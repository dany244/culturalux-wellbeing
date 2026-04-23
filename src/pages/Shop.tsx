const items = [
  { title: "Cultura Lux Journal", price: "$28", tag: "Reflection", desc: "A linen-bound journal for daily mood notes and musings." },
  { title: "Lantern Candle", price: "$22", tag: "Sanctuary", desc: "Hand-poured amber soy candle. Notes of oud, fig, and warm cedar." },
  { title: "Poetry Card Deck", price: "$18", tag: "Ritual", desc: "52 cards of cross-cultural verses to draw from when you feel stuck." },
  { title: "Worry Stone", price: "$14", tag: "Grounding", desc: "Polished river stone, palm-sized, for anxious moments." },
  { title: "Whispers Print Set", price: "$32", tag: "Decor", desc: "Three giclée prints of mood whispers in calligraphic typography." },
  { title: "Tea Ritual Box", price: "$36", tag: "Ritual", desc: "Three small-batch loose-leaf blends for morning, midday, and dusk." },
];

export default function Shop() {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 py-6 md:py-10 pb-28 md:pb-12">
      <header className="text-center space-y-3 max-w-2xl mx-auto">
        <span className="text-[10px] md:text-xs uppercase tracking-[0.3em] text-primary-glow">Shop</span>
        <h1 className="font-display text-3xl sm:text-4xl md:text-5xl text-white drop-shadow-[0_2px_24px_rgba(0,0,0,0.55)]">
          Objects for the inner life
        </h1>
        <p className="text-white/85 text-base sm:text-lg">
          A small, considered collection of things to read, hold, and light.
        </p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
        {items.map((it) => (
          <article
            key={it.title}
            className="glass rounded-2xl p-5 flex flex-col gap-3 hover:-translate-y-0.5 transition-transform duration-500"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-[0.25em] text-primary-glow">{it.tag}</span>
              <span className="font-display text-lg text-foreground">{it.price}</span>
            </div>
            <h2 className="font-display text-xl text-foreground">{it.title}</h2>
            <p className="text-sm text-muted-foreground leading-relaxed flex-1">{it.desc}</p>
            <button className="mt-2 rounded-full bg-primary/15 hover:bg-primary/25 text-primary-glow text-sm py-2 transition-colors">
              Add to cart
            </button>
          </article>
        ))}
      </div>

      <p className="text-center text-xs text-muted-foreground/80">
        Storefront preview — checkout coming soon.
      </p>
    </div>
  );
}
