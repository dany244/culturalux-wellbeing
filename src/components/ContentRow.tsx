import React, { ReactNode, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import { trackEvent } from "@/lib/analytics";
import { useMood } from "@/context/MoodContext";
import { ExpertInsight } from "./ExpertInsight";

export interface RowItem {
  id: string;
  title: string;
  subtitle?: string;
  badge?: string;
  image?: string;
  url?: string;
}

interface Props {
  title: string;
  items: RowItem[];
  renderItem?: (item: RowItem) => ReactNode;
}

export function ContentRow({ title, items, renderItem }: Props) {
  const { currentMood } = useMood();
  const scrollRef = useRef<HTMLDivElement>(null);
  const scroll = (dir: 1 | -1) => {
    scrollRef.current?.scrollBy({ left: dir * 600, behavior: "smooth" });
  };

  // Auto-center the scroll start position so the middle card is visible first.
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const center = () => {
      const max = el.scrollWidth - el.clientWidth;
      if (max <= 0) return; // no overflow → already centered via flex
      el.scrollLeft = max / 2;
    };
    center();
    const ro = new ResizeObserver(center);
    ro.observe(el);
    return () => ro.disconnect();
  }, [items.length]);

  // Guard: never render an empty row (must be after hooks to keep hook order stable).
  if (!items || items.length === 0) return null;

  return (
    <section className="space-y-3 group/row w-full min-w-0">
      <div className="flex items-center justify-center relative px-4">
        <h2 className="font-display text-xl sm:text-2xl md:text-3xl text-gradient text-center">{title}</h2>
        <div className="hidden md:flex gap-1 absolute right-0 opacity-0 group-hover/row:opacity-100 transition-opacity">
          <button onClick={() => scroll(-1)} className="glass h-9 w-9 rounded-full flex items-center justify-center hover:text-primary-glow">
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button onClick={() => scroll(1)} className="glass h-9 w-9 rounded-full flex items-center justify-center hover:text-primary-glow">
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
      <div
        ref={scrollRef}
        className="flex gap-3 sm:gap-4 overflow-x-auto scrollbar-hide row-fade-edges snap-x snap-mandatory pb-2 px-4 sm:px-6 md:justify-center"
      >
        {items.map((item) => {
          if (renderItem) {
            return <div key={item.id} className="snap-start">{renderItem(item)}</div>;
          }

          const isBookish = ["Book", "Memoir", "Novel", "Essay", "Letters"].includes(item.badge ?? "");
          const { currentMood } = useContext(MoodContext) || { currentMood: null as any };
          const Card = (
            <article className="group/card snap-start shrink-0 w-[200px] sm:w-[240px] md:w-[280px] aspect-[3/4] rounded-2xl glass glow-hover relative overflow-hidden ring-1 ring-[hsl(var(--mood-calm)/0.3)] hover:ring-[hsl(var(--mood-calm)/0.5)] transition-all duration-1000 animate-fade-dissolve">
              {/* Mood cinematic palette */}
              <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--mood-calm)/0.3)] via-[hsl(var(--mood-warm)/0.2)] to-transparent" />
              {item.image ? (
                <img
                  src={item.image}
                  alt=""
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1200ms] group-hover/card:scale-[1.08]"
                />
              ) : (
                <div className="absolute inset-0 bg-[hsl(var(--mood-calm)/0.4)]" />
              )}
              {/* Vignettes */}
              <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-background/80 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-[hsl(var(--background)/0.8)] via-[hsl(var(--background)/0.5)] to-transparent" />
              <div aria-hidden className="absolute inset-0 pattern-zellige opacity-[0.15] mix-blend-overlay pointer-events-none" />

              {/* Badge top-left */}
              {item.badge && (
                <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full glass-strong px-2.5 py-1 text-[10px] uppercase tracking-[0.2em] shadow-[0_0_12px_hsl(var(--mood-warm)/0.5)]">
                  {isBookish && <span className="h-1 w-1 rounded-full bg-[hsl(var(--mood-warm))] shadow-glow" />}
                  {item.badge}
                </span>
              )}

              {/* Expert diamond icon top-right */}
              <ExpertInsight title={item.title} author={item.subtitle || 'Author'} mood={currentMood || 'stillness'} />

              <div className="absolute inset-x-0 bottom-0 p-5 space-y-1.5 pt-12">
                <span className="block h-px w-10 bg-gradient-to-r from-[hsl(var(--mood-peace)/0.8)] to-transparent mb-2" />
                <h3 className="font-display text-lg md:text-xl leading-tight text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.7)] line-clamp-2">{item.title}</h3>
                {item.subtitle && <p className="text-xs font-sans text-foreground/80 italic">by {item.subtitle}</p>}
                <p className="text-[10px] italic text-[hsl(var(--mood-calm)/0.9)] line-clamp-2 leading-tight">
                  Read this to find stillness when the world feels too loud.
                </p>
                {item.url && (
                  <span className="inline-flex items-center gap-1 pt-1 text-[11px] uppercase tracking-[0.2em] text-[hsl(var(--mood-warm))] opacity-0 group-hover/card:opacity-100 transition-opacity duration-500">
                    Open <ExternalLink className="h-3 w-3" />
                  </span>
                )}
              </div>
            </article>
          );

          return item.url ? (
            <a
              key={item.id}
              href={item.url}
              target="_blank"
              rel="noreferrer"
              className="contents"
              aria-label={`Open ${item.title}`}
              onClick={() =>
                trackEvent({
                  type: "recommendation_click",
                  rowTitle: title,
                  itemId: item.id,
                  itemTitle: item.title,
                  url: item.url,
                })
              }
            >
              {Card}
            </a>
          ) : (
            <div key={item.id}>{Card}</div>
          );
        })}
      </div>
    </section>
  );
}
