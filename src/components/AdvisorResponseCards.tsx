import { BookOpen, Quote as QuoteIcon, Sparkles, Scroll } from "lucide-react";
import { AdvisorResponse, BookCard } from "@/lib/advisorClient";

interface Props {
  response: AdvisorResponse;
  book: BookCard | null;
  bookLoading: boolean;
}

export function AdvisorResponseCards({ response, book, bookLoading }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Book */}
      <article
        className="glass-strong rounded-3xl overflow-hidden flex animate-fade-in-up"
        style={{ animationDelay: "0ms" }}
      >
        <div className="w-28 md:w-36 shrink-0 relative bg-muted">
          {book?.cover ? (
            <img
              src={book.cover}
              alt={book.title}
              className="absolute inset-0 h-full w-full object-cover"
              loading="lazy"
            />
          ) : (
            <div
              className="absolute inset-0"
              style={{ background: "var(--gradient-mood)" }}
            />
          )}
        </div>
        <div className="flex-1 p-5 space-y-2">
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-primary-glow">
            <BookOpen className="h-3 w-3" /> Book
          </div>
          {bookLoading ? (
            <p className="text-sm text-muted-foreground italic">Finding a book…</p>
          ) : book ? (
            <>
              <h3 className="font-display text-lg leading-tight">{book.title}</h3>
              <p className="text-xs text-muted-foreground">{book.author}</p>
              <a
                href={book.url}
                target="_blank"
                rel="noreferrer"
                className="inline-block text-xs text-primary-glow hover:text-primary transition-colors"
              >
                {book.free_full_text ? "Read free →" : "Open →"}
              </a>
            </>
          ) : (
            <p className="text-sm text-muted-foreground italic">
              No book found right now.
            </p>
          )}
        </div>
      </article>

      {/* Quote */}
      <article
        className="glass-strong rounded-3xl p-5 space-y-3 animate-fade-in-up"
        style={{ animationDelay: "120ms" }}
      >
        <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-primary-glow">
          <QuoteIcon className="h-3 w-3" /> Quote
        </div>
        <p className="font-display text-lg italic leading-relaxed">
          "{response.quote.text}"
        </p>
        <p className="text-xs text-muted-foreground">— {response.quote.author}</p>
      </article>

      {/* Proverb */}
      <article
        className="glass-strong rounded-3xl p-5 space-y-3 animate-fade-in-up"
        style={{ animationDelay: "240ms" }}
      >
        <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-primary-glow">
          <Sparkles className="h-3 w-3" /> Proverb
        </div>
        <p className="font-display text-lg leading-relaxed">
          {response.proverb.text}
        </p>
        <p className="text-xs text-muted-foreground">{response.proverb.origin}</p>
      </article>

      {/* Story */}
      <article
        className="glass-strong rounded-3xl p-5 space-y-3 animate-fade-in-up"
        style={{ animationDelay: "360ms" }}
      >
        <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-primary-glow">
          <Scroll className="h-3 w-3" /> Story
        </div>
        <h4 className="font-display text-lg leading-tight">
          {response.story.title}
        </h4>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {response.story.teaser}
        </p>
      </article>
    </div>
  );
}
