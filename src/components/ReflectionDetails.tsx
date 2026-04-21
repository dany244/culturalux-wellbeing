import { useState } from "react";
import { ChevronDown, BookOpen, Quote as QuoteIcon, Sparkles, Scroll, ExternalLink } from "lucide-react";
import { MoodEntry } from "@/context/MoodContext";

interface Props {
  entry: MoodEntry;
}

interface Summary {
  reflection?: string;
  quote?: { text: string; author: string };
  proverb?: { text: string; origin: string };
  story?: { title: string; teaser: string };
  book?: {
    title?: string;
    author?: string;
    url?: string;
    source?: string;
    query?: string;
    found?: boolean;
  };
  timezone?: string;
}

export function ReflectionDetails({ entry }: Props) {
  const [open, setOpen] = useState(false);
  const summary = entry.recommendation_summary as Summary | null | undefined;

  if (!summary) return null;
  const hasContent =
    summary.reflection ||
    summary.quote ||
    summary.proverb ||
    summary.story ||
    summary.book;
  if (!hasContent) return null;

  return (
    <div className="pt-2">
      <button
        onClick={() => setOpen((v) => !v)}
        className="text-[11px] uppercase tracking-[0.22em] text-primary-glow/80 hover:text-primary-glow inline-flex items-center gap-1.5 transition-colors"
      >
        <ChevronDown
          className={`h-3 w-3 transition-transform ${open ? "rotate-180" : ""}`}
        />
        {open ? "Hide reflection" : "Reveal reflection"}
      </button>

      {open && (
        <div className="mt-3 space-y-3 animate-fade-in-up">
          {summary.reflection && (
            <div className="glass rounded-2xl p-4 space-y-1.5">
              <div className="text-[10px] uppercase tracking-[0.22em] text-primary-glow/80">
                Reflection
              </div>
              <p className="font-display text-base leading-relaxed text-veil whitespace-pre-wrap">
                {summary.reflection}
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {summary.book && (summary.book.title || summary.book.query) && (
              <DetailCard icon={<BookOpen className="h-3 w-3" />} label="Book">
                {summary.book.title ? (
                  <>
                    <p className="font-display text-sm leading-snug">
                      {summary.book.title}
                    </p>
                    {summary.book.author && (
                      <p className="text-xs text-muted-foreground">
                        {summary.book.author}
                      </p>
                    )}
                    {summary.book.url && (
                      <a
                        href={summary.book.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-primary-glow hover:text-primary mt-1"
                      >
                        Open <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </>
                ) : (
                  <p className="text-xs text-muted-foreground italic">
                    Searched: {summary.book.query}
                  </p>
                )}
              </DetailCard>
            )}

            {summary.quote && (
              <DetailCard icon={<QuoteIcon className="h-3 w-3" />} label="Quote">
                <p className="font-display text-sm italic leading-relaxed">
                  "{summary.quote.text}"
                </p>
                <p className="text-xs text-muted-foreground">
                  — {summary.quote.author}
                </p>
              </DetailCard>
            )}

            {summary.proverb && (
              <DetailCard icon={<Sparkles className="h-3 w-3" />} label="Proverb">
                <p className="font-display text-sm leading-relaxed">
                  {summary.proverb.text}
                </p>
                <p className="text-xs text-muted-foreground">
                  {summary.proverb.origin}
                </p>
              </DetailCard>
            )}

            {summary.story && (
              <DetailCard icon={<Scroll className="h-3 w-3" />} label="Story">
                <p className="font-display text-sm leading-snug">
                  {summary.story.title}
                </p>
                <p className="text-xs text-foreground/80 leading-relaxed">
                  {summary.story.teaser}
                </p>
              </DetailCard>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function DetailCard({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <article className="glass rounded-2xl p-4 space-y-1.5">
      <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.22em] text-primary-glow/80">
        {icon} {label}
      </div>
      {children}
    </article>
  );
}
