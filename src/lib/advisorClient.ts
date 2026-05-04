import { supabase } from "@/integrations/supabase/client";
import { MoodId } from "./moods";
import { AdvisorId } from "./advisors";

export interface AdvisorResponse {
  reflection: string;
  mood: MoodId;
  book_query: string;
  quote: { text: string; author: string };
  proverb: { text: string; origin: string };
  story: { title: string; teaser: string };
}

export type BookSource =
  | "openlibrary"
  | "gutendex"
  | "googlebooks"
  | "standardebooks"
  | "nyt"
  | "poetrydb"
  | "philosophers"
  | "librivox";

export interface BookCard {
  title: string;
  author: string;
  cover?: string | null;
  url: string;
  source: BookSource;
  free_full_text?: boolean;
  description?: string;
  preview?: string | null;
  isbn?: string | null;
  matched_cues?: string[];
  tone?: "reflective" | "dark" | "hopeful" | "neutral";
}

export async function callAdvisor(input: {
  text?: string;
  mood?: MoodId | null;
  advisor: AdvisorId;
  name?: string | null;
  timeOfDay?: string;
}): Promise<AdvisorResponse> {
  const { data, error } = await supabase.functions.invoke("advisor", {
    body: input,
  });
  if (error) {
    // surface server-provided message if any
    const msg =
      (data as any)?.error ?? error.message ?? "The advisor is resting.";
    throw new Error(msg);
  }
  if ((data as any)?.error) throw new Error((data as any).error);
  return data as AdvisorResponse;
}

export async function fetchBook(
  query: string,
  mood?: MoodId | null,
): Promise<BookCard | null> {
  const { data, error } = await supabase.functions.invoke("book-search", {
    body: { query, mood: mood ?? null },
  });
  if (error) {
    console.error("book-search error", error);
    return null;
  }
  if ((data as any)?.error) return null;
  return (data as any).book as BookCard;
}

export async function fetchBooks(
  query: string,
  mood?: MoodId | null,
  limit = 8,
): Promise<BookCard[]> {
  const { data, error } = await supabase.functions.invoke("book-search", {
    body: { query, mood: mood ?? null, limit },
  });
  if (error || (data as any)?.error) {
    if (error) console.error("book-search error", error);
    return [];
  }
  const book = (data as any).book as BookCard | undefined;
  const alts = ((data as any).alternates ?? []) as BookCard[];
  return [book, ...alts].filter(Boolean) as BookCard[];
}
