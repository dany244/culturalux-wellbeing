import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const MOOD_IDS = [
  "burned-out",
  "anxious",
  "sad",
  "unmotivated",
  "lonely",
  "overwhelmed",
] as const;

const ADVISOR_PROMPTS: Record<string, string> = {
  asha: `You are Asha — a warm, poetic guide. You write like soft candlelight: gentle, lyrical, imagistic, never clinical. You speak in second person ("you"). Keep sentences short and breathful. Avoid clichés like "remember to breathe". One small sensory image is enough.`,
  reza: `You are Layla — a deep, philosophical companion. You write with quiet gravity, drawing on Stoic, Sufi, and existential wisdom without name-dropping. You ask one piercing question. You speak in second person. No platitudes. No bullet points.`,
  omar: `You are Omar — a grounded, contemplative man. You speak like a steady older brother sitting beside the user: plain-spoken, warm, unhurried. You acknowledge what is hard without softening it falsely. You offer one simple, concrete grounding thought or small action. You speak in second person. No platitudes, no clinical tone, no bullet points.`,
};

serve(async (req) => {
  if (req.method === "OPTIONS")
    return new Response(null, { headers: corsHeaders });

  try {
    const { text, mood: hintedMood, advisor = "asha", name, timeOfDay } =
      await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY)
      throw new Error("LOVABLE_API_KEY is not configured");

    const advisorPersona =
      ADVISOR_PROMPTS[advisor] ?? ADVISOR_PROMPTS.asha;

    const system = `${advisorPersona}

You are part of Culturalux, a cinematic wellbeing app. The user has shared how they feel. Your task:
1. Greet them once by name and time of day (if provided), naturally folded into the first sentence.
2. Reflect the emotion you hear — name it back to them with care.
3. Identify ONE primary mood from this exact list: ${MOOD_IDS.join(", ")}.
4. Suggest a single short book search query (2-4 words, e.g. "stillness grief" or "purpose meaning") that fits the emotion — used to fetch a real book.
5. Offer a quote (≤25 words, attributed to a real author), a proverb (≤20 words, name the culture of origin), and a short story seed (1-2 sentences hinting at a fable/parable that fits).

Return ONLY the tool call.`;

    const userMsg = `Name: ${name ?? "(unknown)"}
Time of day: ${timeOfDay ?? "(unknown)"}
Hinted mood: ${hintedMood ?? "(none)"}
What they wrote: """${text ?? ""}"""`;

    const body = {
      model: "google/gemini-2.5-flash",
      messages: [
        { role: "system", content: system },
        { role: "user", content: userMsg },
      ],
      tools: [
        {
          type: "function",
          function: {
            name: "advisor_response",
            description: "Return the advisor's structured emotional response.",
            parameters: {
              type: "object",
              properties: {
                reflection: {
                  type: "string",
                  description:
                    "3-5 sentences in the advisor's voice: greet, reflect, hold space.",
                },
                mood: {
                  type: "string",
                  enum: [...MOOD_IDS],
                  description: "Primary mood detected.",
                },
                book_query: {
                  type: "string",
                  description: "Short search query for a real book.",
                },
                quote: {
                  type: "object",
                  properties: {
                    text: { type: "string" },
                    author: { type: "string" },
                  },
                  required: ["text", "author"],
                  additionalProperties: false,
                },
                proverb: {
                  type: "object",
                  properties: {
                    text: { type: "string" },
                    origin: { type: "string" },
                  },
                  required: ["text", "origin"],
                  additionalProperties: false,
                },
                story: {
                  type: "object",
                  properties: {
                    title: { type: "string" },
                    teaser: { type: "string" },
                  },
                  required: ["title", "teaser"],
                  additionalProperties: false,
                },
              },
              required: [
                "reflection",
                "mood",
                "book_query",
                "quote",
                "proverb",
                "story",
              ],
              additionalProperties: false,
            },
          },
        },
      ],
      tool_choice: {
        type: "function",
        function: { name: "advisor_response" },
      },
    };

    const response = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      },
    );

    if (response.status === 429) {
      return new Response(
        JSON.stringify({
          error: "Too many requests right now. Please pause a moment and try again.",
        }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }
    if (response.status === 402) {
      return new Response(
        JSON.stringify({
          error: "AI credits exhausted. Add funds in Settings → Workspace → Usage.",
        }),
        { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }
    if (!response.ok) {
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(
        JSON.stringify({ error: "AI gateway error" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const data = await response.json();
    const call = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!call) throw new Error("No tool call in response");
    const args = JSON.parse(call.function.arguments);

    return new Response(JSON.stringify(args), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("advisor error:", e);
    return new Response(
      JSON.stringify({
        error: e instanceof Error ? e.message : "Unknown error",
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
