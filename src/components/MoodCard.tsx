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
        "group relative overflow-hidden rounded-xl text-left",
        "glass glow-hover animate-fade-in-up",
        "min-h-[112px] p-3.5 flex flex-col justify-between",
        selected && "ring-1 ring-primary/60 shadow-[0_0_30px_-8px_hsl(var(--primary)/0.55)]"
      )}
    >
      {/* Background image — subtle, mood-specific */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-30 group-hover:opacity-45 transition-opacity duration-700 pointer-events-none"
        style={{ backgroundImage: `url(${mood.background})` }}
      />
      {/* Dark veil for legibility */}
      <div className="absolute inset-0 bg-gradient-to-tr from-background/85 via-background/55 to-transparent pointer-events-none" />
      {/* Mood-tinted radial glow */}
      <div
        className="absolute inset-0 opacity-50 group-hover:opacity-80 transition-opacity duration-700 pointer-events-none mix-blend-screen"
        style={{
          background: `radial-gradient(circle at 85% 15%, hsl(var(--mood-accent) / 0.55), transparent 60%)`,
        }}
      />
      {/* Subtle zellige texture */}
      <div
        className="absolute inset-0 pattern-zellige opacity-20 mix-blend-overlay pointer-events-none"
        style={{ ['--pattern-hue' as string]: mood.accent }}
      />

      {/* Top row: glyph avatar + label */}
      <div className="relative flex items-start gap-2.5">
        <span
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-display"
          style={{
            background: `radial-gradient(circle at 30% 30%, hsl(var(--mood-accent) / 0.55), hsl(var(--mood-accent) / 0.15))`,
            boxShadow: `0 0 16px -3px hsl(var(--mood-accent) / 0.75), inset 0 0 0 1px hsl(var(--mood-accent) / 0.5)`,
            color: `hsl(var(--mood-accent))`,
          }}
          aria-hidden
        >
          {mood.glyph}
        </span>
        <div className="min-w-0 flex-1 pt-0.5">
          <div className="font-display text-[15px] leading-tight truncate text-veil">{mood.label}</div>
          <div className="text-[11px] text-muted-foreground/90 truncate">{mood.description}</div>
        </div>
      </div>

      {/* Bottom row: whisper preview + dot */}
      <div className="relative flex items-end justify-between gap-2 mt-2">
        <p className="text-[10.5px] italic text-foreground/70 line-clamp-2 leading-snug pr-1">
          "{mood.whisper}"
        </p>
        <span
          className="h-1.5 w-1.5 rounded-full shrink-0 mb-0.5"
          style={{
            background: `hsl(var(--mood-accent))`,
            boxShadow: `0 0 10px hsl(var(--mood-accent))`,
          }}
        />
      </div>
    </button>
  );
}
