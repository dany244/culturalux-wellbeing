import { ADVISORS, AdvisorId } from "@/lib/advisors";
import { cn } from "@/lib/utils";

interface Props {
  value: AdvisorId;
  onChange: (id: AdvisorId) => void;
}

export function AdvisorToggle({ value, onChange }: Props) {
  return (
    <div className="inline-flex glass rounded-full p-1 gap-1">
      {ADVISORS.map((a) => {
        const active = a.id === value;
        return (
          <button
            key={a.id}
            onClick={() => onChange(a.id)}
            className={cn(
              "group px-3 py-1.5 rounded-full text-sm transition-all duration-500 flex items-center gap-2 hover:-translate-y-0.5",
              active
                ? "bg-primary/10 text-foreground shadow-[0_0_24px_-6px_hsl(var(--primary)/0.7)]"
                : "text-muted-foreground hover:text-foreground",
            )}
            style={
              active
                ? { boxShadow: `0 0 28px -6px hsl(${a.accent} / 0.7)` }
                : undefined
            }
          >
            <span
              className="flex h-6 w-6 items-center justify-center rounded-full font-display text-[13px] leading-none transition-transform duration-500 group-hover:scale-110"
              style={{
                background: `radial-gradient(circle at 30% 30%, hsl(${a.accent} / 0.55), hsl(${a.accent} / 0.15))`,
                boxShadow: `0 0 14px -3px hsl(${a.accent} / 0.75), inset 0 0 0 1px hsl(${a.accent} / 0.5)`,
                color: `hsl(${a.accent})`,
              }}
              aria-hidden
            >
              {a.glyph}
            </span>
            <span className="font-medium">{a.name}</span>
            <span className="hidden sm:inline text-xs opacity-70">
              {a.tagline}
            </span>
          </button>
        );
      })}
    </div>
  );
}
