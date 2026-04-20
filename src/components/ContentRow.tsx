import { ReactNode, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface RowItem {
  id: string;
  title: string;
  subtitle?: string;
  badge?: string;
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
        {items.map((item) =>
          renderItem ? (
            <div key={item.id} className="snap-start">{renderItem(item)}</div>
          ) : (
            <article
              key={item.id}
              className="snap-start shrink-0 w-[260px] md:w-[300px] aspect-[3/4] rounded-2xl glass glow-hover relative overflow-hidden"
            >
              <div className="absolute inset-0" style={{ background: "var(--gradient-mood)" }} />
              <div className="absolute inset-0" style={{ background: "var(--gradient-fade-bottom)" }} />
              <div className="absolute inset-x-0 bottom-0 p-5 space-y-1">
                {item.badge && (
                  <span className="inline-block text-[10px] uppercase tracking-[0.2em] text-primary-glow">
                    {item.badge}
                  </span>
                )}
                <h3 className="font-display text-xl leading-tight">{item.title}</h3>
                {item.subtitle && <p className="text-xs text-muted-foreground">{item.subtitle}</p>}
              </div>
            </article>
          )
        )}
      </div>
    </section>
  );
}
