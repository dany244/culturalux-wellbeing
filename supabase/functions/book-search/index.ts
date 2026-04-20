import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface BookResult {
  title: string;
  author: string;
  cover?: string | null;
  url: string;
  source: "openlibrary" | "gutendex";
  free_full_text?: boolean;
  description?: string;
}

async function searchOpenLibrary(q: string): Promise<BookResult | null> {
  try {
    const res = await fetch(
      `https://openlibrary.org/search.json?q=${encodeURIComponent(q)}&limit=5`,
    );
    if (!res.ok) return null;
    const data = await res.json();
    const doc = (data.docs ?? []).find((d: any) => d.title && d.author_name);
    if (!doc) return null;
    return {
      title: doc.title,
      author: (doc.author_name ?? ["Unknown"])[0],
      cover: doc.cover_i
        ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-L.jpg`
        : null,
      url: `https://openlibrary.org${doc.key}`,
      source: "openlibrary",
      free_full_text: false,
    };
  } catch (e) {
    console.error("OpenLibrary error:", e);
    return null;
  }
}

async function searchGutendex(q: string): Promise<BookResult | null> {
  try {
    const res = await fetch(
      `https://gutendex.com/books?search=${encodeURIComponent(q)}`,
    );
    if (!res.ok) return null;
    const data = await res.json();
    const book = (data.results ?? [])[0];
    if (!book) return null;
    const author = book.authors?.[0]?.name ?? "Unknown";
    const cover =
      book.formats?.["image/jpeg"] ?? null;
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
  } catch (e) {
    console.error("Gutendex error:", e);
    return null;
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS")
    return new Response(null, { headers: corsHeaders });

  try {
    const { query } = await req.json();
    if (!query || typeof query !== "string") {
      return new Response(
        JSON.stringify({ error: "query required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // Try OpenLibrary first (modern), Gutendex second (classics, free full text)
    const [ol, gut] = await Promise.all([
      searchOpenLibrary(query),
      searchGutendex(query),
    ]);

    const book = ol ?? gut;
    if (!book) {
      return new Response(
        JSON.stringify({ error: "No book found", query }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    return new Response(
      JSON.stringify({ book, alternate: ol && gut ? gut : null }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (e) {
    console.error("book-search error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
