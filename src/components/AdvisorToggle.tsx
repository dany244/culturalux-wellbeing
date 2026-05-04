import { ADVISORS, AdvisorId } from "@/lib/advisors";
import { cn } from "@/lib/utils";

interface Props {
  value: AdvisorId;
  onChange: (id: AdvisorId) => void;
}

export function AdvisorToggle({ value, onChange }: Props) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 w-full max-w-xl mx-auto">
      {ADVISORS.map((a) => {
        const active = a.id === value;
        return (
          <button
            key={a.id}
            onClick={() => onChange(a.id)}
            className={cn(
              "group relative glass rounded-2xl p-2.5 flex flex-col items-center gap-1.5 text-center transition-all duration-500 hover:-translate-y-0.5",
              active
                ? "bg-primary/10 ring-1 ring-primary/40"
                : "hover:bg-foreground/5",
            )}
            style={
              active
                ? { boxShadow: `0 0 28px -6px hsl(${a.accent} / 0.7)` }
                : undefined
            }
          >
            <span
              className="relative h-12 w-12 sm:h-14 sm:w-14 overflow-hidden rounded-full transition-transform duration-500 group-hover:scale-105"
              style={{
                boxShadow: `0 0 16px -3px hsl(${a.accent} / 0.75), inset 0 0 0 1px hsl(${a.accent} / 0.55)`,
              }}
              aria-hidden
            >
              <img
                src={a.portrait}
                alt=""
                loading="lazy"
                width={56}
                height={56}
                className="h-full w-full object-cover"
              />
            </span>
            <span
              className={cn(
                "text-sm font-medium leading-tight",
                active ? "text-foreground" : "text-foreground/80",
              )}
            >
              {a.name}
            </span>
            <span className="text-[10px] uppercase tracking-[0.15em] opacity-70 leading-tight">
              {a.tagline}
            </span>
          </button>
        );
      })}
    </div>
  );
}
