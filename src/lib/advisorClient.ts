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

export interface BookCard {
  title: string;
  author: string;
  cover?: string | null;
  url: string;
  source: "openlibrary" | "gutendex";
  free_full_text?: boolean;
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

export async function fetchBook(query: string): Promise<BookCard | null> {
  const { data, error } = await supabase.functions.invoke("book-search", {
    body: { query },
  });
  if (error) {
    console.error("book-search error", error);
    return null;
  }
  if ((data as any)?.error) return null;
  return (data as any).book as BookCard;
}
