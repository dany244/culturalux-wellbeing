import { useState } from "react";
import { cn } from "@/lib/utils";

type Tab = "books" | "quotes" | "proverbs" | "stories";

const TABS: { id: Tab; label: string }[] = [
  { id: "books", label: "Books" },
  { id: "quotes", label: "Quotes" },
  { id: "proverbs", label: "Proverbs" },
  { id: "stories", label: "Stories" },
];

const CONTENT: Record<Tab, { title: string; meta?: string; body?: string }[]> = {
  books: [
    { title: "Letters to a Young Poet", meta: "Rainer Maria Rilke", body: "Be patient toward all that is unsolved in your heart." },
    { title: "Tao Te Ching", meta: "Lao Tzu", body: "Nature does not hurry, yet everything is accomplished." },
    { title: "The Prophet", meta: "Kahlil Gibran", body: "Your pain is the breaking of the shell that encloses your understanding." },
    { title: "Meditations", meta: "Marcus Aurelius", body: "You have power over your mind — not outside events." },
    { title: "The Bell Jar", meta: "Sylvia Plath" },
    { title: "Norwegian Wood", meta: "Haruki Murakami" },
  ],
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

const Explore = () => {
  const [tab, setTab] = useState<Tab>("books");
  const items = CONTENT[tab];

  return (
    <div className="container space-y-10 py-8">
      <header className="space-y-3 animate-fade-in-up">
        <span className="text-xs uppercase tracking-[0.3em] text-primary-glow">Explore</span>
        <h1 className="font-display text-4xl md:text-6xl text-gradient">Wisdom for the in-between.</h1>
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

      <div className="grid md:grid-cols-2 gap-4">
        {items.map((it, i) => (
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
    </div>
  );
};

export default Explore;
