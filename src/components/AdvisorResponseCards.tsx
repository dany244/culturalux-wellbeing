import { useState } from "react";
import { BookOpen, Quote as QuoteIcon, Sparkles, Scroll, Plus, ExternalLink, Eye } from "lucide-react";
import { AdvisorResponse, BookCard, fetchBooks } from "@/lib/advisorClient";
import { useMood } from "@/context/MoodContext";
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
        className="absolute inset-0 bg-cover bg-center opacity-25 transition-opacity duration-700 pointer-events-none"
        style={{ backgroundImage: `url(${bg})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-tr from-background/85 via-background/55 to-transparent pointer-events-none" />
      <div className="absolute inset-0 pattern-zellige opacity-15 mix-blend-overlay pointer-events-none" />
      <div className="relative">{children}</div>
    </article>
  );
}

// --- Static "more" pools for quote / proverb / story expansions
const MORE_QUOTES = [
  { text: "The wound is the place where the Light enters you.", author: "Rumi" },
  { text: "What is to give light must endure burning.", author: "Viktor Frankl" },
  { text: "We are all just walking each other home.", author: "Ram Dass" },
  { text: "In the depth of winter I finally learned that within me there lay an invincible summer.", author: "Albert Camus" },
];
const MORE_PROVERBS = [
  { text: "Fall seven times, stand up eight.", origin: "Japanese" },
  { text: "The river that forgets its source will dry up.", origin: "Yoruba" },
  { text: "A smooth sea never made a skilled sailor.", origin: "African" },
  { text: "The eye never forgets what the heart has seen.", origin: "Bantu" },
];
const MORE_STORIES = [
  { title: "The Two Wolves", teaser: "An old grandfather told his grandson about a battle between two wolves inside us all…" },
  { title: "The Empty Boat", teaser: "If a man crossing a river is hit by an empty boat, he will not become angry…" },
  { title: "The Stonecutter", teaser: "A stonecutter wished to be more powerful, and the mountain answered him in stone…" },
];

function BookButtons({ book }: { book: BookCard }) {
  const readUrl = book.url;
  const previewUrl = book.preview ?? book.url;
  return (
    <div className="flex flex-wrap gap-2 pt-1">
      <a
        href={readUrl}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.18em] px-3 py-1.5 rounded-full bg-primary/20 text-primary-glow border border-primary/30 hover:bg-primary/30 transition-colors"
      >
        <ExternalLink className="h-3 w-3" />
        {book.free_full_text ? "Read free" : "Read"}
      </a>
      {previewUrl && (
        <a
          href={previewUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.18em] px-3 py-1.5 rounded-full bg-foreground/5 text-foreground/80 border border-foreground/10 hover:bg-foreground/10 transition-colors"
        >
          <Eye className="h-3 w-3" />
          Preview
        </a>
      )}
    </div>
  );
}

export function AdvisorResponseCards({ response, book, bookLoading }: Props) {
  const { currentMood } = useMood();
  const [moreBooks, setMoreBooks] = useState<BookCard[]>([]);
  const [loadingMoreBooks, setLoadingMoreBooks] = useState(false);
  const [showMoreQuotes, setShowMoreQuotes] = useState(false);
  const [showMoreProverbs, setShowMoreProverbs] = useState(false);
  const [showMoreStories, setShowMoreStories] = useState(false);

  const loadMoreBooks = async () => {
    if (loadingMoreBooks) return;
    setLoadingMoreBooks(true);
    try {
      const res = await fetchBooks(response.book_query, currentMood, 5);
      // Skip the primary book (already shown)
      const filtered = res.filter((b) => b.url !== book?.url).slice(0, 4);
      setMoreBooks(filtered);
    } finally {
      setLoadingMoreBooks(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Book */}
      <CardShell bg={cardBookBg} delay={0} className="md:col-span-2">
        <div className="flex flex-col">
          <div className="flex">
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
                  {book.description && (
                    <p className="text-xs text-foreground/70 leading-relaxed line-clamp-2">{book.description}</p>
                  )}
                  <BookButtons book={book} />
                </>
              ) : (
                <p className="text-sm text-muted-foreground italic">No book found right now.</p>
              )}
            </div>
          </div>

          {book && (
            <div className="px-5 pb-5">
              <button
                onClick={loadMoreBooks}
                disabled={loadingMoreBooks || moreBooks.length > 0}
                className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.2em] text-muted-foreground hover:text-primary-glow transition-colors disabled:opacity-50"
              >
                <Plus className="h-3 w-3" />
                {moreBooks.length > 0 ? "More books" : loadingMoreBooks ? "Loading…" : "Show more books"}
              </button>

              {moreBooks.length > 0 && (
                <div className="mt-3 grid sm:grid-cols-2 gap-3">
                  {moreBooks.map((b, i) => (
                    <div
                      key={(b.url ?? b.title) + i}
                      className="flex gap-3 p-3 rounded-2xl bg-foreground/5 border border-foreground/10 animate-fade-in-up"
                      style={{ animationDelay: `${i * 60}ms` }}
                    >
                      {b.cover ? (
                        <img src={b.cover} alt="" loading="lazy" className="w-12 h-16 object-cover rounded-md shrink-0" />
                      ) : (
                        <div className="w-12 h-16 rounded-md bg-primary/10 shrink-0" />
                      )}
                      <div className="min-w-0 space-y-1">
                        <h4 className="text-sm font-display leading-tight truncate">{b.title}</h4>
                        <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground truncate">{b.author}</p>
                        <BookButtons book={b} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
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

          <button
            onClick={() => setShowMoreQuotes((v) => !v)}
            className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.2em] text-muted-foreground hover:text-primary-glow transition-colors"
          >
            <Plus className="h-3 w-3" />
            {showMoreQuotes ? "Hide" : "More quotes"}
          </button>

          {showMoreQuotes && (
            <ul className="space-y-2 pt-2 border-t border-foreground/10">
              {MORE_QUOTES.map((q, i) => (
                <li key={i} className="text-sm text-foreground/80 italic animate-fade-in-up" style={{ animationDelay: `${i * 50}ms` }}>
                  "{q.text}" <span className="not-italic text-[10px] uppercase tracking-[0.18em] text-muted-foreground">— {q.author}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </CardShell>

      {/* Proverb */}
      <CardShell bg={cardProverbBg} delay={240}>
        <div className="p-5 space-y-3">
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-primary-glow">
            <Sparkles className="h-3 w-3" /> Proverb
          </div>
          <p className="font-display text-lg leading-relaxed text-veil">{response.proverb.text}</p>
          <p className="text-xs text-muted-foreground">{response.proverb.origin}</p>

          <button
            onClick={() => setShowMoreProverbs((v) => !v)}
            className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.2em] text-muted-foreground hover:text-primary-glow transition-colors"
          >
            <Plus className="h-3 w-3" />
            {showMoreProverbs ? "Hide" : "More proverbs"}
          </button>

          {showMoreProverbs && (
            <ul className="space-y-2 pt-2 border-t border-foreground/10">
              {MORE_PROVERBS.map((p, i) => (
                <li key={i} className="text-sm text-foreground/80 animate-fade-in-up" style={{ animationDelay: `${i * 50}ms` }}>
                  {p.text} <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">· {p.origin}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </CardShell>

      {/* Story */}
      <CardShell bg={cardStoryBg} delay={360} className="md:col-span-2">
        <div className="p-5 space-y-3">
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-primary-glow">
            <Scroll className="h-3 w-3" /> Story
          </div>
          <h4 className="font-display text-lg leading-tight text-veil">{response.story.title}</h4>
          <p className="text-sm text-foreground/80 leading-relaxed">{response.story.teaser}</p>

          <button
            onClick={() => setShowMoreStories((v) => !v)}
            className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.2em] text-muted-foreground hover:text-primary-glow transition-colors"
          >
            <Plus className="h-3 w-3" />
            {showMoreStories ? "Hide" : "More stories"}
          </button>

          {showMoreStories && (
            <ul className="space-y-3 pt-2 border-t border-foreground/10">
              {MORE_STORIES.map((s, i) => (
                <li key={i} className="animate-fade-in-up" style={{ animationDelay: `${i * 60}ms` }}>
                  <p className="font-display text-base text-veil">{s.title}</p>
                  <p className="text-sm text-foreground/75 leading-relaxed">{s.teaser}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </CardShell>
    </div>
  );
}
