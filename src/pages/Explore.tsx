import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useMood } from "@/context/MoodContext";
import { getMood } from "@/lib/moods";
import { fetchBooks, type BookCard } from "@/lib/advisorClient";
import { MoodChipsCarousel } from "@/components/MoodChipsCarousel";
import { Skeleton } from "@/components/ui/skeleton";
import { trackEvent } from "@/lib/analytics";

type Tab = "books" | "quotes" | "proverbs" | "stories";

const TABS: { id: Tab; label: string }[] = [
  { id: "books", label: "Books" },
  { id: "quotes", label: "Quotes" },
  { id: "proverbs", label: "Proverbs" },
  { id: "stories", label: "Stories" },
];

const STATIC_CONTENT: Record<Exclude<Tab, "books">, { title: string; meta?: string; body?: string }[]> = {
  quotes: [
    { title: "“The wound is the place where the Light enters you.”", meta: "Rumi" },
    { title: "“What is to give light must endure burning.”", meta: "Viktor Frankl" },
    { title: "“We are all just walking each other home.”", meta: "Ram Dass" },
    { title: "“This being human is a guest house.”", meta: "Rumi" },
    { title: "“In the depth of winter I finally learned that within me there lay an invincible summer.”", meta: "Albert Camus" },
  ],
  proverbs: [
    { title: "“Fall seven times, stand up eight.”", meta: "Japanese" },
    { title: "“The river that forgets its source will dry up.”", meta: "Yoruba" },
    { title: "“He who plants a tree plants hope.”", meta: "Chinese" },
    { title: "“A smooth sea never made a skilled sailor.”", meta: "African" },
    { title: "“The eye never forgets what the heart has seen.”", meta: "Bantu" },
  ],
  stories: [
    { title: "The Two Wolves", meta: "Cherokee", body: "An old grandfather told his grandson: a battle goes on inside us between two wolves…" },
    { title: "The Empty Boat", meta: "Zhuangzi", body: "If a man is crossing a river and an empty boat collides with his, he will not become angry…" },
    { title: "The Stonecutter", meta: "Japanese", body: "A stonecutter wished to be more powerful, and the mountain answered him in stone…" },
  ],
};

// Default seed query when no mood is selected
const DEFAULT_QUERY = "wisdom contemplative literature";

const MOOD_QUERY: Record<string, string> = {
  "burned-out": "rest restorative quiet living",
  anxious: "calm stillness anxiety mindfulness",
  motivated: "courage discipline creative work",
  lonely: "solitude belonging companionship memoir",
  overwhelmed: "simplicity essentialism focus",
  inspired: "creativity wonder imagination",
};

const Explore = () => {
  const [tab, setTab] = useState<Tab>("books");
  const { currentMood } = useMood();
  const mood = getMood(currentMood);

  const [books, setBooks] = useState<BookCard[]>([]);
  const [loading, setLoading] = useState(false);

  // Mood palette cinematic
  const palette = mood?.accent ? `hsl(${mood.accent})` : 'hsl(var(--mood-calm))';

  useEffect(() => {
    if (tab !== "books") return;
    let cancelled = false;
    setLoading(true);
    const q = currentMood
      ? MOOD_QUERY[currentMood] ?? DEFAULT_QUERY
      : DEFAULT_QUERY;
    fetchBooks(q, currentMood, 8)
      .then((res) => {
        if (!cancelled) setBooks(res);
      })
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [tab, currentMood]);

  return (
    <div className="container max-w-6xl space-y-8 md:space-y-10 py-6 md:py-8 px-4 sm:px-6 overflow-x-hidden" style={{ '--mood-palette': palette } as React.CSSProperties}>
      {/* Mood Chips Nav */}
      <MoodChipsCarousel className="mb-8 animate-fade-dissolve" />
      <header className="space-y-3 animate-fade-in-up">
        <span className="text-xs uppercase tracking-[0.3em] text-primary-glow">Literary Remedies</span>
        <h1 className="font-display text-3xl sm:text-4xl md:text-6xl text-gradient leading-tight break-words">
          {mood ? `Remedies for ${mood.label}` : "Wisdom for the in-between."}
        </h1>
        {mood ? (
          <p className="text-sm text-[hsl(var(--mood-calm))] italic font-body animate-fade-dissolve">
            "{mood.whisper}"
          </p>
        ) : (
          <p className="text-sm text-muted-foreground">
            Select a mood to see cinematic palette and tuned literary remedies.
          </p>
        )}
      </header>

      <div className="glass inline-flex max-w-full overflow-x-auto scrollbar-hide rounded-full p-1 sm:p-1.5 gap-1">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => {
              setTab(t.id);
              trackEvent({ type: "explore_tab_change", tab: t.id });
            }}
            className={cn(
              "px-3 sm:px-5 py-1.5 sm:py-2 text-xs sm:text-sm rounded-full transition-all duration-500 whitespace-nowrap shrink-0",
              tab === t.id
                ? "bg-primary/20 text-primary-glow shadow-[0_0_20px_-5px_hsl(var(--primary)/0.5)]"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "books" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {loading && books.length === 0
            ? Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-44 rounded-3xl" />
              ))
            : books.map((b, i) => (
                <a
                  key={(b.url ?? b.title) + i}
                  href={b.url}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() =>
                    trackEvent({
                      type: "explore_book_click",
                      title: b.title,
                      author: b.author,
                      mood: currentMood,
                    })
                  }
                  className="glass glow-hover rounded-3xl p-4 sm:p-6 md:p-8 flex flex-col sm:flex-row gap-4 animate-fade-in-up min-w-0"
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  {b.cover ? (
                    <img
                      src={b.cover}
                      alt=""
                      loading="lazy"
                      className="w-20 h-28 object-cover rounded-lg shadow-lg shrink-0 self-start"
                    />
                  ) : (
                    <div className="w-20 h-28 rounded-lg bg-primary/10 shrink-0 self-start" />
                  )}
                  <div className="space-y-2 min-w-0 flex-1">
                    <h3 className="font-display text-lg sm:text-xl md:text-2xl leading-snug break-words">
                      {b.title}
                    </h3>
                    <div className="text-[11px] sm:text-xs uppercase tracking-[0.2em] sm:tracking-[0.25em] text-primary-glow/80 break-words">
                      {b.author}
                      {b.free_full_text ? " · Free full text" : ""}
                    </div>
                    {currentMood && (b.tone || (b.matched_cues && b.matched_cues.length > 0)) && (
                      <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                        <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                          Why this match
                        </span>
                        {b.tone && b.tone !== "neutral" && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/15 text-primary-glow border border-primary/20">
                            {b.tone}
                          </span>
                        )}
                        {b.matched_cues?.map((c) => (
                          <span
                            key={c}
                            className="text-[10px] px-2 py-0.5 rounded-full bg-foreground/5 text-muted-foreground border border-foreground/10"
                          >
                            {c}
                          </span>
                        ))}
                      </div>
                    )}
                    {b.description && (
                      <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 break-words">
                        {b.description}
                      </p>
                    )}
                  </div>
                </a>
              ))}
          {!loading && books.length === 0 && (
            <p className="text-muted-foreground">No books found right now. Try another mood.</p>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {STATIC_CONTENT[tab].map((it, i) => (
            <article
              key={it.title + i}
              className="glass glow-hover rounded-3xl p-4 sm:p-6 md:p-8 space-y-3 animate-fade-in-up min-w-0"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <h3 className="font-display text-lg sm:text-xl md:text-2xl leading-snug break-words">
                {it.title}
              </h3>
              {it.body && (
                <p className="text-muted-foreground leading-relaxed break-words">{it.body}</p>
              )}
              {it.meta && (
                <div className="text-[11px] sm:text-xs uppercase tracking-[0.25em] text-primary-glow/80 break-words">
                  {it.meta}
                </div>
              )}
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

export default Explore;
