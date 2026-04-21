import { BookOpen, Quote as QuoteIcon, Sparkles, Scroll } from "lucide-react";
import { AdvisorResponse, BookCard } from "@/lib/advisorClient";
import cardBookBg from "@/assets/card-book.jpg";
import cardQuoteBg from "@/assets/card-quote.jpg";
import cardProverbBg from "@/assets/card-proverb.jpg";
import cardStoryBg from "@/assets/card-story.jpg";

interface Props {
  response: AdvisorResponse;
  book: BookCard | null;
  bookLoading: boolean;
}

interface CardShellProps {
  bg: string;
  delay: number;
  children: React.ReactNode;
  className?: string;
}

function CardShell({ bg, delay, children, className = "" }: CardShellProps) {
  return (
    <article
      className={`relative glass-strong rounded-3xl overflow-hidden animate-fade-in-up ${className}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div
        className="absolute inset-0 bg-cover bg-center opacity-25 group-hover:opacity-40 transition-opacity duration-700 pointer-events-none"
        style={{ backgroundImage: `url(${bg})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-tr from-background/85 via-background/55 to-transparent pointer-events-none" />
      <div className="absolute inset-0 pattern-zellige opacity-15 mix-blend-overlay pointer-events-none" />
      <div className="relative">{children}</div>
    </article>
  );
}

export function AdvisorResponseCards({ response, book, bookLoading }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Book */}
      <CardShell bg={cardBookBg} delay={0} className="flex">
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
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${cardBookBg})` }}
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
              <h3 className="font-display text-lg leading-tight text-veil">{book.title}</h3>
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
      </CardShell>

      {/* Quote */}
      <CardShell bg={cardQuoteBg} delay={120}>
        <div className="p-5 space-y-3">
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-primary-glow">
            <QuoteIcon className="h-3 w-3" /> Quote
          </div>
          <p className="font-display text-lg italic leading-relaxed text-veil">
            "{response.quote.text}"
          </p>
          <p className="text-xs text-muted-foreground">— {response.quote.author}</p>
        </div>
      </CardShell>

      {/* Proverb */}
      <CardShell bg={cardProverbBg} delay={240}>
        <div className="p-5 space-y-3">
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-primary-glow">
            <Sparkles className="h-3 w-3" /> Proverb
          </div>
          <p className="font-display text-lg leading-relaxed text-veil">
            {response.proverb.text}
          </p>
          <p className="text-xs text-muted-foreground">{response.proverb.origin}</p>
        </div>
      </CardShell>

      {/* Story */}
      <CardShell bg={cardStoryBg} delay={360}>
        <div className="p-5 space-y-3">
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-primary-glow">
            <Scroll className="h-3 w-3" /> Story
          </div>
          <h4 className="font-display text-lg leading-tight text-veil">
            {response.story.title}
          </h4>
          <p className="text-sm text-foreground/80 leading-relaxed">
            {response.story.teaser}
          </p>
        </div>
      </CardShell>
    </div>
  );
}
