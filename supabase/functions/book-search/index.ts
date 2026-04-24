import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

type Source =
  | "openlibrary"
  | "gutendex"
  | "googlebooks"
  | "standardebooks"
  | "nyt"
  | "poetrydb"
  | "philosophers"
  | "librivox";

interface BookResult {
  title: string;
  author: string;
  cover?: string | null;
  url: string;
  source: Source;
  free_full_text?: boolean;
  description?: string;
  audio_url?: string | null;
  isbn?: string | null;
  preview?: string | null;
  matched_cues?: string[];
  tone?: "reflective" | "dark" | "hopeful" | "neutral";
}

const safeFetch = async (url: string, init?: RequestInit, timeoutMs = 6000) => {
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { ...init, signal: controller.signal });
    return res.ok ? res : null;
  } catch {
    return null;
  } finally {
    clearTimeout(t);
  }
};

// 1. Open Library — modern catalog + covers
async function searchOpenLibrary(q: string): Promise<BookResult | null> {
  const res = await safeFetch(
    `https://openlibrary.org/search.json?q=${encodeURIComponent(q)}&limit=5`,
  );
  if (!res) return null;
  try {
    const data = await res.json();
    const doc = (data.docs ?? []).find((d: any) => d.title && d.author_name);
    if (!doc) return null;
    const isbn = doc.isbn?.[0] ?? null;
    return {
      title: doc.title,
      author: (doc.author_name ?? ["Unknown"])[0],
      cover: doc.cover_i
        ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-L.jpg`
        : isbn
        ? `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg`
        : null,
      url: `https://openlibrary.org${doc.key}`,
      source: "openlibrary",
      free_full_text: false,
      isbn,
    };
  } catch {
    return null;
  }
}

// 2. Gutendex — Project Gutenberg (free full text classics)
async function searchGutendex(q: string): Promise<BookResult | null> {
  const res = await safeFetch(
    `https://gutendex.com/books?search=${encodeURIComponent(q)}`,
  );
  if (!res) return null;
  try {
    const data = await res.json();
    const book = (data.results ?? [])[0];
    if (!book) return null;
    const author = book.authors?.[0]?.name ?? "Unknown";
    const cover = book.formats?.["image/jpeg"] ?? null;
    const readUrl =
      book.formats?.["text/html"] ??
      book.formats?.["text/html; charset=utf-8"] ??
      `https://www.gutenberg.org/ebooks/${book.id}`;
    return {
      title: book.title,
      author,
      cover,
      url: readUrl,
      source: "gutendex",
      free_full_text: true,
    };
  } catch {
    return null;
  }
}

// 3. Google Books — rich metadata + previews (no key required for basic search)
async function searchGoogleBooks(q: string): Promise<BookResult | null> {
  const key = Deno.env.get("GOOGLE_BOOKS_API_KEY");
  const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
    q,
  )}&maxResults=3${key ? `&key=${key}` : ""}`;
  const res = await safeFetch(url);
  if (!res) return null;
  try {
    const data = await res.json();
    const item = (data.items ?? [])[0];
    if (!item) return null;
    const v = item.volumeInfo ?? {};
    return {
      title: v.title ?? "Untitled",
      author: (v.authors ?? ["Unknown"])[0],
      cover: v.imageLinks?.thumbnail?.replace("http://", "https://") ?? null,
      url: v.infoLink ?? v.previewLink ?? `https://books.google.com`,
      source: "googlebooks",
      free_full_text: item.accessInfo?.viewability === "ALL_PAGES",
      description: v.description,
      preview: v.previewLink ?? null,
      isbn:
        v.industryIdentifiers?.find((i: any) => i.type === "ISBN_13")
          ?.identifier ?? null,
    };
  } catch {
    return null;
  }
}

// 4. Standard Ebooks — beautifully typeset public-domain books (OPDS feed)
async function searchStandardEbooks(q: string): Promise<BookResult | null> {
  const res = await safeFetch(
    `https://standardebooks.org/ebooks?query=${encodeURIComponent(q)}`,
    { headers: { Accept: "text/html" } },
  );
  if (!res) return null;
  try {
    const html = await res.text();
    // Parse first result link
    const match = html.match(/href="(\/ebooks\/[^"]+)"[^>]*>\s*<[^>]*>\s*([^<]+)<\/[^>]*>\s*<[^>]*author[^>]*>([^<]+)/i);
    if (!match) return null;
    const [, path, title, author] = match;
    return {
      title: title.trim(),
      author: author.trim(),
      cover: `https://standardebooks.org${path}/downloads/cover.jpg`,
      url: `https://standardebooks.org${path}`,
      source: "standardebooks",
      free_full_text: true,
    };
  } catch {
    return null;
  }
}

// 5. PoetryDB — free poetry by title/author
async function searchPoetryDB(q: string): Promise<BookResult | null> {
  const res = await safeFetch(
    `https://poetrydb.org/title/${encodeURIComponent(q)}`,
  );
  if (!res) return null;
  try {
    const data = await res.json();
    const poem = Array.isArray(data) ? data[0] : null;
    if (!poem?.title) return null;
    return {
      title: poem.title,
      author: poem.author ?? "Unknown",
      cover: null,
      url: `https://poetrydb.org/title/${encodeURIComponent(poem.title)}`,
      source: "poetrydb",
      free_full_text: true,
      description: (poem.lines ?? []).slice(0, 6).join(" / "),
    };
  } catch {
    return null;
  }
}

// 6. PhilosophersAPI — philosopher metadata
async function searchPhilosophers(q: string): Promise<BookResult | null> {
  const res = await safeFetch(`https://philosophersapi.com/api/philosophers`);
  if (!res) return null;
  try {
    const data = await res.json();
    const arr = Array.isArray(data) ? data : data.philosophers ?? [];
    const lower = q.toLowerCase();
    const p = arr.find((x: any) =>
      (x.name ?? "").toLowerCase().includes(lower),
    );
    if (!p) return null;
    return {
      title: p.name,
      author: p.school ?? "Philosopher",
      cover: p.images?.[0]?.url ?? p.image ?? null,
      url: p.link ?? `https://en.wikipedia.org/wiki/${encodeURIComponent(p.name)}`,
      source: "philosophers",
      description: p.life ?? p.bio ?? null,
    };
  } catch {
    return null;
  }
}

// 7. NYT Bestsellers — surfaces a current bestseller match (requires key)
async function searchNYT(q: string): Promise<BookResult | null> {
  const key = Deno.env.get("NYT_API_KEY");
  if (!key) return null;
  const res = await safeFetch(
    `https://api.nytimes.com/svc/books/v3/reviews.json?title=${encodeURIComponent(
      q,
    )}&api-key=${key}`,
  );
  if (!res) return null;
  try {
    const data = await res.json();
    const r = (data.results ?? [])[0];
    if (!r) return null;
    return {
      title: r.book_title,
      author: r.book_author,
      cover: null,
      url: r.url,
      source: "nyt",
      description: r.summary,
    };
  } catch {
    return null;
  }
}

// Mood → style cues used to rank results (StoryGraph-inspired)
const MOOD_CUES: Record<string, string[]> = {
  "burned-out": ["rest", "slow", "quiet", "gentle", "soft", "restorative", "tender"],
  anxious: ["calm", "stillness", "grounding", "mindful", "breath", "reassuring", "soothing"],
  motivated: ["inspiring", "bold", "courage", "drive", "ambition", "uplifting", "challenging"],
  lonely: ["companion", "intimate", "tender", "warm", "connection", "belonging", "memoir"],
  overwhelmed: ["simple", "clarity", "minimal", "calm", "essential", "focus", "quiet"],
  inspired: ["luminous", "creative", "wonder", "awe", "imaginative", "visionary", "lyrical"],
  hopeful: ["hopeful", "light", "bright", "renewal", "dawn", "uplifting", "redemptive", "tender"],
};

const MOOD_TONE: Record<string, "reflective" | "dark" | "hopeful" | "neutral"> = {
  "burned-out": "reflective",
  anxious: "reflective",
  motivated: "hopeful",
  lonely: "reflective",
  overwhelmed: "reflective",
  inspired: "hopeful",
  hopeful: "hopeful",
};

function moodScore(b: BookResult, mood?: string | null): number {
  if (!mood) return 0;
  const cues = MOOD_CUES[mood] ?? [];
  const hay = `${b.title} ${b.author} ${b.description ?? ""}`.toLowerCase();
  let s = 0;
  for (const cue of cues) if (hay.includes(cue)) s += 2;
  // tone bonus
  const tone = MOOD_TONE[mood];
  if (tone === "hopeful" && /(hope|light|dawn|joy|renewal)/.test(hay)) s += 2;
  if (tone === "reflective" && /(quiet|still|reflect|solitude|memoir|essay)/.test(hay)) s += 2;
  return s;
}

// Score results so we pick the richest, prioritizing free full text
function score(b: BookResult, mood?: string | null): number {
  let s = 0;
  if (b.free_full_text) s += 5;
  if (b.cover) s += 3;
  if (b.description) s += 2;
  if (b.preview) s += 1;
  // Source preference for literary depth
  const pref: Record<Source, number> = {
    standardebooks: 4,
    gutendex: 3,
    openlibrary: 3,
    googlebooks: 2,
    poetrydb: 2,
    philosophers: 1,
    nyt: 1,
    librivox: 1,
  };
  s += pref[b.source] ?? 0;
  s += moodScore(b, mood);
  return s;
}

serve(async (req) => {
  if (req.method === "OPTIONS")
    return new Response(null, { headers: corsHeaders });

  try {
    const { query, mood, limit } = await req.json();
    if (!query || typeof query !== "string") {
      return new Response(
        JSON.stringify({ error: "query required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // Fold mood cues into the query string to bias upstream APIs
    const moodKey = typeof mood === "string" ? mood : null;
    const cues = moodKey ? (MOOD_CUES[moodKey] ?? []).slice(0, 2).join(" ") : "";
    const enrichedQuery = cues ? `${query} ${cues}` : query;

    const results = await Promise.all([
      searchOpenLibrary(enrichedQuery),
      searchGutendex(enrichedQuery),
      searchGoogleBooks(enrichedQuery),
      searchStandardEbooks(query),
      searchPoetryDB(query),
      searchPhilosophers(query),
      searchNYT(query),
    ]);

    const found = results.filter((b): b is BookResult => !!b);

    if (found.length === 0) {
      return new Response(
        JSON.stringify({ error: "No book found", query }),
        {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    found.sort((a, b) => score(b, moodKey) - score(a, moodKey));

    // Attach matched cues + tone for UI explanation (no raw scores exposed)
    if (moodKey) {
      const cuesList = MOOD_CUES[moodKey] ?? [];
      const tone = MOOD_TONE[moodKey] ?? "neutral";
      for (const b of found) {
        const hay = `${b.title} ${b.author} ${b.description ?? ""}`.toLowerCase();
        const matched = cuesList.filter((c) => hay.includes(c)).slice(0, 3);
        b.matched_cues = matched;
        b.tone = tone;
      }
    }

    const max = typeof limit === "number" && limit > 0 ? Math.min(limit, 12) : 5;
    const [book, ...rest] = found;

    return new Response(
      JSON.stringify({
        book,
        alternates: rest.slice(0, max - 1),
        mood: moodKey,
        sources_tried: results.length,
        sources_found: found.length,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (e) {
    console.error("book-search error:", e);
    return new Response(
      JSON.stringify({
        error: e instanceof Error ? e.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});
