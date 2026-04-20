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
              "px-4 py-2 rounded-full text-sm transition-all flex items-center gap-2",
              active
                ? "bg-primary text-primary-foreground shadow-[0_0_24px_-6px_hsl(var(--primary)/0.7)]"
                : "text-muted-foreground hover:text-foreground",
            )}
            style={
              active
                ? { boxShadow: `0 0 28px -6px hsl(${a.accent} / 0.7)` }
                : undefined
            }
          >
            <span
              className="h-2 w-2 rounded-full"
              style={{ background: `hsl(${a.accent})` }}
            />
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
