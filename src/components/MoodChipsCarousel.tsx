import React from "react";
import { useMood } from "@/context/MoodContext";
import { MOODS, getMood, type MoodId } from "@/lib/moods";
import { cn } from "@/lib/utils";
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselPrevious, 
  CarouselNext 
} from "@/components/ui/carousel";
import { trackEvent } from "@/lib/analytics";

const TASK_MOODS: MoodId[] = ["overwhelmed", "stillness", "solitude", "courage"]; // primary navigation

interface Props {
  className?: string;
}

export function MoodChipsCarousel({ className }: Props) {
  const { currentMood, setMood } = useMood();

  const chips = TASK_MOODS.map(id => getMood(id)).filter(Boolean) as typeof MOODS;

  return (
    <div className={cn("max-w-4xl mx-auto", className)}>
      <Carousel
        opts={{
          align: "start",
          containScroll: "trimSnaps",
          dragFree: true,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {chips.map((mood, index) => (
            <CarouselItem key={mood.id} className="pl-2 md:pl-4 basis-52 md:basis-64 lg:basis-72">
              <button
                onClick={() => {
                  setMood(mood.id);
                  trackEvent({ type: "mood_selected", mood: mood.id });
                }}
                className={cn(
                  "group relative w-full h-20 md:h-24 p-4 md:p-5 rounded-full glass glow-hover transition-all duration-500 overflow-hidden font-body text-left animate-fade-in-up",
                  currentMood === mood.id 
                    ? "ring-2 ring-[hsl(var(--mood-calm)/0.6)] shadow-[0_0_30px_hsl(var(--mood-calm)/0.4)] scale-[1.02]" 
                    : "hover:scale-[1.02]"
                )}
                style={{ 
                  "--mood-accent": mood.accent,
                  animationDelay: `${index * 80}ms`
                } as React.CSSProperties}
              >
                {/* Mood bg subtle */}
                <div 
                  className="absolute inset-0 opacity-20 group-hover:opacity-40 transition-opacity duration-700 mix-blend-overlay"
                  style={{ backgroundImage: `url(${mood.background})` }}
                />
                {/* Glow radial */}
                <div 
                  className="absolute inset-0 bg-gradient-radial from-[hsl(var(--mood-accent)/0.4)] to-transparent opacity-70 group-hover:opacity-100 transition-opacity"
                />
                
                <div className="relative z-10 flex items-center gap-3 h-full">
                  <span 
                    className="h-10 w-10 flex items-center justify-center rounded-full shadow-[0_0_20px_hsl(var(--mood-accent)/0.6)] text-lg font-display shrink-0"
                    style={{ background: `hsl(var(--mood-accent)/0.2)`, color: `hsl(var(--mood-accent))` }}
                  >
                    {mood.glyph}
                  </span>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-display text-sm md:text-base leading-tight truncate">{mood.label}</h3>
                    <p className="text-xs md:text-sm text-muted-foreground line-clamp-1">{mood.description}</p>
                  </div>
                </div>
              </button>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="h-10 w-10 rounded-full glass" />
        <CarouselNext className="h-10 w-10 rounded-full glass" />
      </Carousel>
    </div>
  );
}

