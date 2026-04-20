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
        animationDelay: `${index * 80}ms`,
        // mood-tinted glow color
        ['--mood-accent' as string]: mood.accent,
      }}
      className={cn(
        "group relative overflow-hidden rounded-2xl p-5 text-left",
        "glass glow-hover animate-fade-in-up",
        "min-h-[120px] flex flex-col justify-between",
        selected && "ring-1 ring-primary/60 shadow-[0_0_40px_-5px_hsl(var(--primary)/0.6)]"
      )}
    >
      {/* Mood-tinted radial glow */}
      <div
        className="absolute inset-0 opacity-40 group-hover:opacity-70 transition-opacity duration-700 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 30% 20%, hsl(var(--mood-accent) / 0.5), transparent 65%)`,
        }}
      />
      <div className="relative">
        <div className="font-display text-lg leading-tight">{mood.label}</div>
        <div className="text-xs text-muted-foreground mt-1">{mood.description}</div>
      </div>
      <div className="relative flex items-center justify-between text-[11px] text-muted-foreground/80">
        <span className="uppercase tracking-[0.2em]">Reflect</span>
        <span
          className="h-1.5 w-1.5 rounded-full"
          style={{ background: `hsl(var(--mood-accent))`, boxShadow: `0 0 12px hsl(var(--mood-accent))` }}
        />
      </div>
    </button>
  );
}
