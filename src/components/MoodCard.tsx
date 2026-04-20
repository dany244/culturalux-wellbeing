import { Mood } from "@/lib/moods";
import { cn } from "@/lib/utils";

interface Props {
  mood: Mood;
  selected?: boolean;
  onClick?: () => void;
  index?: number;
}

export function MoodCard({ mood, selected, onClick, index = 0 }: Props) {
  return (
    <button
      onClick={onClick}
      style={{
        animationDelay: `${index * 70}ms`,
        ['--mood-accent' as string]: mood.accent,
      }}
      className={cn(
        "group relative overflow-hidden rounded-xl px-3.5 py-3 text-left",
        "glass glow-hover animate-fade-in-up",
        "min-h-[78px] flex items-center gap-3",
        selected && "ring-1 ring-primary/60 shadow-[0_0_30px_-8px_hsl(var(--primary)/0.55)]"
      )}
    >
      {/* Mood-tinted radial glow */}
      <div
        className="absolute inset-0 opacity-30 group-hover:opacity-60 transition-opacity duration-700 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 20% 20%, hsl(var(--mood-accent) / 0.45), transparent 65%)`,
        }}
      />

      {/* Glyph avatar */}
      <span
        className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-base font-display"
        style={{
          background: `radial-gradient(circle at 30% 30%, hsl(var(--mood-accent) / 0.45), hsl(var(--mood-accent) / 0.12))`,
          boxShadow: `0 0 18px -4px hsl(var(--mood-accent) / 0.7), inset 0 0 0 1px hsl(var(--mood-accent) / 0.45)`,
          color: `hsl(var(--mood-accent))`,
        }}
        aria-hidden
      >
        {mood.glyph}
      </span>

      <div className="relative min-w-0 flex-1">
        <div className="font-display text-[15px] leading-tight truncate">{mood.label}</div>
        <div className="text-[11px] text-muted-foreground/90 truncate">{mood.description}</div>
      </div>
    </button>
  );
}
