import { ReactNode, useRef } from "react";
import { ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";

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
  const scrollRef = useRef<HTMLDivElement>(null);
  const scroll = (dir: 1 | -1) => {
    scrollRef.current?.scrollBy({ left: dir * 600, behavior: "smooth" });
  };

  return (
    <section className="space-y-3 group/row">
      <div className="flex items-end justify-between">
        <h2 className="font-display text-2xl md:text-3xl text-gradient">{title}</h2>
        <div className="hidden md:flex gap-1 opacity-0 group-hover/row:opacity-100 transition-opacity">
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
        className="flex gap-4 overflow-x-auto scrollbar-hide row-fade-edges snap-x snap-mandatory pb-2 -mx-6 px-6"
      >
        {items.map((item) => {
          if (renderItem) {
            return <div key={item.id} className="snap-start">{renderItem(item)}</div>;
          }

          const Card = (
            <article className="group/card snap-start shrink-0 w-[260px] md:w-[300px] aspect-[3/4] rounded-2xl glass glow-hover relative overflow-hidden">
              {item.image ? (
                <img
                  src={item.image}
                  alt=""
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover/card:scale-105"
                />
              ) : (
                <div className="absolute inset-0" style={{ background: "var(--gradient-mood)" }} />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/55 to-transparent" />
              <div aria-hidden className="absolute inset-0 pattern-zellige opacity-[0.18] mix-blend-overlay pointer-events-none" />
              <div className="absolute inset-x-0 bottom-0 p-5 space-y-1">
                {item.badge && (
                  <span className="inline-block text-[10px] uppercase tracking-[0.2em] text-primary-glow">
                    {item.badge}
                  </span>
                )}
                <h3 className="font-display text-xl leading-tight text-veil">{item.title}</h3>
                {item.subtitle && <p className="text-xs text-muted-foreground">{item.subtitle}</p>}
                {item.url && (
                  <span className="inline-flex items-center gap-1 pt-1 text-[11px] uppercase tracking-[0.2em] text-primary-glow opacity-0 group-hover/card:opacity-100 transition-opacity">
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
