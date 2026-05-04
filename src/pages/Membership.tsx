const tiers = [
  {
    name: "Wanderer",
    price: "Free",
    cadence: "",
    perks: [
      "Daily mood check-ins",
      "Three advisors of your choice",
      "Basic recommendations",
    ],
    accent: "32 95% 70%",
    cta: "Current plan",
  },
  {
    name: "Lantern",
    price: "$8",
    cadence: "/ month",
    perks: [
      "All four advisors, including James",
      "Unlimited reflections & quests",
      "Curated weekly reading list",
      "Save and revisit past sanctuaries",
    ],
    accent: "200 80% 65%",
    cta: "Begin Lantern",
    highlight: true,
  },
  {
    name: "Hearth",
    price: "$72",
    cadence: "/ year",
    perks: [
      "Everything in Lantern",
      "Two months free",
      "Early access to new advisors",
      "Members-only print + ritual drops",
    ],
    accent: "260 60% 70%",
    cta: "Begin Hearth",
  },
];

export default function Membership() {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 py-6 md:py-10 pb-28 md:pb-12">
      <header className="text-center space-y-3 max-w-2xl mx-auto">
        <span className="text-[10px] md:text-xs uppercase tracking-[0.3em] text-primary-glow">Membership</span>
        <h1 className="font-display text-3xl sm:text-4xl md:text-5xl text-white drop-shadow-[0_2px_24px_rgba(0,0,0,0.55)]">
          Tend your inner garden
        </h1>
        <p className="text-white/85 text-base sm:text-lg">
          Choose a rhythm that fits your practice. Cancel anytime.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5 max-w-5xl mx-auto">
        {tiers.map((t) => (
          <article
            key={t.name}
            style={{ ['--mood-accent' as string]: t.accent }}
            className={`glass rounded-2xl p-6 flex flex-col gap-4 transition-transform duration-500 hover:-translate-y-1 ${
              t.highlight ? "ring-1 ring-primary/60 shadow-[0_0_36px_-10px_hsl(var(--primary)/0.6)]" : ""
            }`}
          >
            <div className="flex items-baseline justify-between">
              <h2 className="font-display text-2xl text-foreground">{t.name}</h2>
              <span
                className="h-2 w-2 rounded-full"
                style={{ background: `hsl(var(--mood-accent))`, boxShadow: `0 0 12px hsl(var(--mood-accent))` }}
              />
            </div>
            <div className="flex items-baseline gap-1">
              <span className="font-display text-4xl text-foreground">{t.price}</span>
              <span className="text-sm text-muted-foreground">{t.cadence}</span>
            </div>
            <ul className="space-y-2 text-sm text-foreground/85 flex-1">
              {t.perks.map((p) => (
                <li key={p} className="flex gap-2">
                  <span className="text-primary-glow">·</span>
                  <span>{p}</span>
                </li>
              ))}
            </ul>
            <button
              className={`mt-2 rounded-full text-sm py-2 transition-colors ${
                t.highlight
                  ? "bg-primary/25 hover:bg-primary/35 text-primary-glow"
                  : "bg-foreground/10 hover:bg-foreground/15 text-foreground"
              }`}
            >
              {t.cta}
            </button>
          </article>
        ))}
      </div>
    </div>
  );
}
