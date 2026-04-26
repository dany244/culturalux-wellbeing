import { useState } from "react";
import {
  BookOpen,
  Quote as QuoteIcon,
  Sparkles,
  Scroll,
  Plus,
  ExternalLink,
  Eye,
} from "lucide-react";
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

/* ---------------- Shared shell ---------------- */

interface CardShellProps {
  bg: string;
  delay: number;
  children: React.ReactNode;
  className?: string;
}

function CardShell({ bg, delay, children, className = "" }: CardShellProps) {
  return (
    <article
      className={`group relative glass-strong rounded-3xl overflow-hidden animate-fade-in-up
        ring-1 ring-primary/15 hover:ring-primary/30
        shadow-[0_0_0_0_hsl(var(--primary)/0)] hover:shadow-[0_18px_60px_-20px_hsl(var(--primary)/0.5)]
        transition-all duration-500 ${className}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div
        className="absolute inset-0 bg-cover bg-center opacity-25 group-hover:opacity-30 transition-opacity duration-700 pointer-events-none"
        style={{ backgroundImage: `url(${bg})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-tr from-background/85 via-background/55 to-transparent pointer-events-none" />
      <div className="absolute inset-0 pattern-zellige opacity-15 mix-blend-overlay pointer-events-none" />
      {/* subtle inner glow */}
      <div
        aria-hidden
        className="absolute -inset-px rounded-3xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background:
            "radial-gradient(120% 80% at 50% 0%, hsl(var(--primary) / 0.18), transparent 60%)",
        }}
      />
      <div className="relative flex flex-col h-full">{children}</div>
    </article>
  );
}

function CardHeader({
  icon: Icon,
  label,
}: {
  icon: typeof BookOpen;
  label: string;
}) {
  return (
    <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-primary-glow">
      <span
        className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary/15 ring-1 ring-primary/30"
        aria-hidden
      >
        <Icon className="h-3 w-3" />
      </span>
      {label}
    </div>
  );
}

/* ---------------- Action buttons (unified) ---------------- */

function PrimaryAction({
  href,
  children,
  icon: Icon = ExternalLink,
}: {
  href: string;
  children: React.ReactNode;
  icon?: typeof ExternalLink;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.2em] px-3.5 py-1.5 rounded-full
        bg-primary/20 text-primary-glow border border-primary/30
        hover:bg-primary/30 hover:shadow-[0_0_18px_-4px_hsl(var(--primary)/0.7)] transition-all"
    >
      <Icon className="h-3 w-3" />
      {children}
    </a>
  );
}

function SecondaryAction({
  href,
  children,
  icon: Icon = Eye,
}: {
  href: string;
  children: React.ReactNode;
  icon?: typeof Eye;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.2em] px-3.5 py-1.5 rounded-full
        bg-foreground/5 text-foreground/80 border border-foreground/10
        hover:bg-foreground/10 hover:text-foreground transition-all"
    >
      <Icon className="h-3 w-3" />
      {children}
    </a>
  );
}

function CardActions({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-2 pt-3 mt-auto border-t border-foreground/10">
      {children}
    </div>
  );
}

function MoreToggle({
  open,
  onClick,
  labelOpen,
  labelClosed,
}: {
  open: boolean;
  onClick: () => void;
  labelOpen: string;
  labelClosed: string;
}) {
  return (
    <button
      onClick={onClick}
      className="ml-auto inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.2em] text-muted-foreground hover:text-primary-glow transition-colors"
    >
      <Plus
        className={`h-3 w-3 transition-transform ${open ? "rotate-45" : ""}`}
      />
      {open ? labelOpen : labelClosed}
    </button>
  );
}

/* ---------------- "More" pools + helpers ---------------- */

const MORE_QUOTES = [
  { text: "The wound is the place where the Light enters you.", author: "Rumi" },
  { text: "What is to give light must endure burning.", author: "Viktor Frankl" },
  { text: "We are all just walking each other home.", author: "Ram Dass" },
  {
    text: "In the depth of winter I finally learned that within me there lay an invincible summer.",
    author: "Albert Camus",
  },
];
const MORE_PROVERBS = [
  { text: "Fall seven times, stand up eight.", origin: "Japanese" },
  { text: "The river that forgets its source will dry up.", origin: "Yoruba" },
  { text: "A smooth sea never made a skilled sailor.", origin: "African" },
  { text: "The eye never forgets what the heart has seen.", origin: "Bantu" },
];
const MORE_STORIES = [
  {
    title: "The Two Wolves",
    teaser:
      "An old grandfather told his grandson about a battle between two wolves inside us all…",
  },
  {
    title: "The Empty Boat",
    teaser:
      "If a man crossing a river is hit by an empty boat, he will not become angry…",
  },
  {
    title: "The Stonecutter",
    teaser:
      "A stonecutter wished to be more powerful, and the mountain answered him in stone…",
  },
];

const searchUrl = (q: string) =>
  `https://www.google.com/search?q=${encodeURIComponent(q)}`;
const wikiUrl = (q: string) =>
  `https://en.wikipedia.org/wiki/Special:Search?search=${encodeURIComponent(q)}`;

/* ---------------- Component ---------------- */

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
      const filtered = res.filter((b) => b.url !== book?.url).slice(0, 4);
      setMoreBooks(filtered);
    } finally {
      setLoadingMoreBooks(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 auto-rows-fr">
      {/* ---------- Book ---------- */}
      <CardShell bg={cardBookBg} delay={0} className="md:col-span-2">
        <div className="flex flex-col h-full">
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
              <div className="absolute inset-y-0 right-0 w-6 bg-gradient-to-r from-transparent to-background/60" />
            </div>
            <div className="flex-1 p-5 flex flex-col gap-2 min-w-0">
              <CardHeader icon={BookOpen} label="Book" />
              {bookLoading ? (
                <p className="text-sm text-muted-foreground italic">
                  Finding a book…
                </p>
              ) : book ? (
                <>
                  <h3 className="font-display text-lg leading-tight text-veil">
                    {book.title}
                  </h3>
                  <p className="text-xs text-muted-foreground">{book.author}</p>
                  {book.description && (
                    <p className="text-xs text-foreground/70 leading-relaxed line-clamp-2">
                      {book.description}
                    </p>
                  )}
                  <CardActions>
                    <PrimaryAction href={book.url}>
                      {book.free_full_text ? "Read free" : "Read"}
                    </PrimaryAction>
                    <SecondaryAction href={book.preview ?? book.url}>
                      Preview
                    </SecondaryAction>
                    <MoreToggle
                      open={moreBooks.length > 0}
                      onClick={loadMoreBooks}
                      labelOpen="More books"
                      labelClosed={
                        loadingMoreBooks ? "Loading…" : "Show more books"
                      }
                    />
                  </CardActions>
                </>
              ) : (
                <p className="text-sm text-muted-foreground italic">
                  No book found right now.
                </p>
              )}
            </div>
          </div>

          {moreBooks.length > 0 && (
            <div className="px-5 pb-5">
              <div className="mt-3 grid sm:grid-cols-2 gap-3">
                {moreBooks.map((b, i) => (
                  <div
                    key={(b.url ?? b.title) + i}
                    className="flex gap-3 p-3 rounded-2xl bg-foreground/5 border border-foreground/10 animate-fade-in-up"
                    style={{ animationDelay: `${i * 60}ms` }}
                  >
                    {b.cover ? (
                      <img
                        src={b.cover}
                        alt=""
                        loading="lazy"
                        className="w-12 h-16 object-cover rounded-md shrink-0"
                      />
                    ) : (
                      <div className="w-12 h-16 rounded-md bg-primary/10 shrink-0" />
                    )}
                    <div className="min-w-0 flex flex-col gap-1">
                      <h4 className="text-sm font-display leading-tight truncate">
                        {b.title}
                      </h4>
                      <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground truncate">
                        {b.author}
                      </p>
                      <div className="flex flex-wrap gap-1.5 mt-auto pt-1">
                        <PrimaryAction href={b.url}>
                          {b.free_full_text ? "Read free" : "Read"}
                        </PrimaryAction>
                        <SecondaryAction href={b.preview ?? b.url}>
                          Preview
                        </SecondaryAction>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardShell>

      {/* ---------- Quote ---------- */}
      <CardShell bg={cardQuoteBg} delay={120}>
        <div className="p-5 flex flex-col gap-3 h-full">
          <CardHeader icon={QuoteIcon} label="Quote" />
          <p className="font-display text-lg italic leading-relaxed text-veil">
            “{response.quote.text}”
          </p>
          <p className="text-xs text-muted-foreground">
            — {response.quote.author}
          </p>

          {showMoreQuotes && (
            <ul className="space-y-2 pt-2 border-t border-foreground/10">
              {MORE_QUOTES.map((q, i) => (
                <li
                  key={i}
                  className="text-sm text-foreground/80 italic animate-fade-in-up"
                  style={{ animationDelay: `${i * 50}ms` }}
                >
                  “{q.text}”{" "}
                  <span className="not-italic text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                    — {q.author}
                  </span>
                </li>
              ))}
            </ul>
          )}

          <CardActions>
            <PrimaryAction
              href={wikiUrl(response.quote.author)}
              icon={ExternalLink}
            >
              Read
            </PrimaryAction>
            <SecondaryAction
              href={searchUrl(`"${response.quote.text}" ${response.quote.author}`)}
            >
              Preview
            </SecondaryAction>
            <MoreToggle
              open={showMoreQuotes}
              onClick={() => setShowMoreQuotes((v) => !v)}
              labelOpen="Hide"
              labelClosed="More quotes"
            />
          </CardActions>
        </div>
      </CardShell>

      {/* ---------- Proverb ---------- */}
      <CardShell bg={cardProverbBg} delay={240}>
        <div className="p-5 flex flex-col gap-3 h-full">
          <CardHeader icon={Sparkles} label="Proverb" />
          <p className="font-display text-lg leading-relaxed text-veil">
            {response.proverb.text}
          </p>
          <p className="text-xs text-muted-foreground">
            {response.proverb.origin}
          </p>

          {showMoreProverbs && (
            <ul className="space-y-2 pt-2 border-t border-foreground/10">
              {MORE_PROVERBS.map((p, i) => (
                <li
                  key={i}
                  className="text-sm text-foreground/80 animate-fade-in-up"
                  style={{ animationDelay: `${i * 50}ms` }}
                >
                  {p.text}{" "}
                  <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                    · {p.origin}
                  </span>
                </li>
              ))}
            </ul>
          )}

          <CardActions>
            <PrimaryAction
              href={searchUrl(`${response.proverb.origin} proverb ${response.proverb.text}`)}
            >
              Read
            </PrimaryAction>
            <SecondaryAction
              href={wikiUrl(`${response.proverb.origin} proverbs`)}
            >
              Preview
            </SecondaryAction>
            <MoreToggle
              open={showMoreProverbs}
              onClick={() => setShowMoreProverbs((v) => !v)}
              labelOpen="Hide"
              labelClosed="More proverbs"
            />
          </CardActions>
        </div>
      </CardShell>

      {/* ---------- Story ---------- */}
      <CardShell bg={cardStoryBg} delay={360} className="md:col-span-2">
        <div className="p-5 flex flex-col gap-3 h-full">
          <CardHeader icon={Scroll} label="Story" />
          <h4 className="font-display text-lg leading-tight text-veil">
            {response.story.title}
          </h4>
          <p className="text-sm text-foreground/80 leading-relaxed">
            {response.story.teaser}
          </p>

          {showMoreStories && (
            <ul className="space-y-3 pt-2 border-t border-foreground/10">
              {MORE_STORIES.map((s, i) => (
                <li
                  key={i}
                  className="animate-fade-in-up"
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  <p className="font-display text-base text-veil">{s.title}</p>
                  <p className="text-sm text-foreground/75 leading-relaxed">
                    {s.teaser}
                  </p>
                </li>
              ))}
            </ul>
          )}

          <CardActions>
            <PrimaryAction href={searchUrl(`${response.story.title} full story`)}>
              Read
            </PrimaryAction>
            <SecondaryAction href={wikiUrl(response.story.title)}>
              Preview
            </SecondaryAction>
            <MoreToggle
              open={showMoreStories}
              onClick={() => setShowMoreStories((v) => !v)}
              labelOpen="Hide"
              labelClosed="More stories"
            />
          </CardActions>
        </div>
      </CardShell>
    </div>
  );
}
