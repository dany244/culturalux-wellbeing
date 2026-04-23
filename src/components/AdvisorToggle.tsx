import { ADVISORS, AdvisorId } from "@/lib/advisors";
import { cn } from "@/lib/utils";

interface Props {
  value: AdvisorId;
  onChange: (id: AdvisorId) => void;
}

export function AdvisorToggle({ value, onChange }: Props) {
  return (
    <div className="grid grid-cols-2 sm:flex sm:flex-wrap sm:justify-center glass rounded-3xl sm:rounded-full p-1.5 gap-1.5 mx-auto w-full sm:w-auto max-w-md">
      {ADVISORS.map((a) => {
        const active = a.id === value;
        return (
          <button
            key={a.id}
            onClick={() => onChange(a.id)}
            className={cn(
              "group px-3 py-2 rounded-2xl sm:rounded-full text-sm transition-all duration-500 flex items-center gap-2 hover:-translate-y-0.5 min-w-0",
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
              className="relative h-7 w-7 overflow-hidden rounded-full transition-transform duration-500 group-hover:scale-110"
              style={{
                boxShadow: `0 0 14px -3px hsl(${a.accent} / 0.75), inset 0 0 0 1px hsl(${a.accent} / 0.5)`,
              }}
              aria-hidden
            >
              <img
                src={a.portrait}
                alt=""
                loading="lazy"
                width={28}
                height={28}
                className="h-full w-full object-cover"
              />
            </span>
            <span className="font-medium truncate">{a.name}</span>
            <span className="hidden md:inline text-xs opacity-70 truncate">
              {a.tagline}
            </span>
          </button>
        );
      })}
    </div>
  );
}
