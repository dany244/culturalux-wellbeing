import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useMood } from "@/context/MoodContext";
import { getMood } from "@/lib/moods";
import { fetchBooks, type BookCard } from "@/lib/advisorClient";
import { Skeleton } from "@/components/ui/skeleton";

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
  hopeful: "hope renewal light essays",
};

const Explore = () => {
  const [tab, setTab] = useState<Tab>("books");
  const { currentMood } = useMood();
  const mood = getMood(currentMood);

  const [books, setBooks] = useState<BookCard[]>([]);
  const [loading, setLoading] = useState(false);

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
    <div className="container space-y-10 py-8">
      <header className="space-y-3 animate-fade-in-up">
        <span className="text-xs uppercase tracking-[0.3em] text-primary-glow">Explore</span>
        <h1 className="font-display text-4xl md:text-6xl text-gradient">Wisdom for the in-between.</h1>
        {mood ? (
          <p className="text-sm text-muted-foreground">
            Tuned to your mood:{" "}
            <span className="text-primary-glow">{mood.label.toLowerCase()}</span> ·{" "}
            <span className="italic">{mood.whisper}</span>
          </p>
        ) : (
          <p className="text-sm text-muted-foreground">
            Select a mood on the home page to tune these recommendations.
          </p>
        )}
      </header>

      <div className="glass inline-flex rounded-full p-1.5 gap-1">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              "px-5 py-2 text-sm rounded-full transition-all duration-500",
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
        <div className="grid md:grid-cols-2 gap-4">
          {loading && books.length === 0
            ? Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-40 rounded-3xl" />
              ))
            : books.map((b, i) => (
                <a
                  key={(b.url ?? b.title) + i}
                  href={b.url}
                  target="_blank"
                  rel="noreferrer"
                  className="glass glow-hover rounded-3xl p-6 md:p-8 flex gap-4 animate-fade-in-up"
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  {b.cover ? (
                    <img
                      src={b.cover}
                      alt=""
                      loading="lazy"
                      className="w-20 h-28 object-cover rounded-lg shadow-lg shrink-0"
                    />
                  ) : (
                    <div className="w-20 h-28 rounded-lg bg-primary/10 shrink-0" />
                  )}
                  <div className="space-y-2 min-w-0">
                    <h3 className="font-display text-xl md:text-2xl leading-snug truncate">
                      {b.title}
                    </h3>
                    <div className="text-xs uppercase tracking-[0.25em] text-primary-glow/80">
                      {b.author}
                      {b.free_full_text ? " · Free full text" : ""}
                    </div>
                    {b.description && (
                      <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
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
        <div className="grid md:grid-cols-2 gap-4">
          {STATIC_CONTENT[tab].map((it, i) => (
            <article
              key={it.title + i}
              className="glass glow-hover rounded-3xl p-6 md:p-8 space-y-3 animate-fade-in-up"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <h3 className="font-display text-xl md:text-2xl leading-snug">{it.title}</h3>
              {it.body && <p className="text-muted-foreground leading-relaxed">{it.body}</p>}
              {it.meta && (
                <div className="text-xs uppercase tracking-[0.25em] text-primary-glow/80">{it.meta}</div>
              )}
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

export default Explore;
