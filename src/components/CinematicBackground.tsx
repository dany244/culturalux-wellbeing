import { useMood } from "@/context/MoodContext";
import { DEFAULT_BG, getMood } from "@/lib/moods";
import { useEffect, useState } from "react";

/**
 * Full-screen fixed cinematic background.
 * Crossfades smoothly when mood changes. Sits behind all content.
 */
export function CinematicBackground() {
  const { currentMood } = useMood();
  const mood = getMood(currentMood);
  const target = mood?.background ?? DEFAULT_BG;

  // Two layers for crossfade
  const [layerA, setLayerA] = useState(target);
  const [layerB, setLayerB] = useState<string | null>(null);
  const [showB, setShowB] = useState(false);

  useEffect(() => {
    if (target === (showB ? layerB : layerA)) return;
    if (showB) {
      setLayerA(target);
      setShowB(false);
    } else {
      setLayerB(target);
      setShowB(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target]);

  return (
    <div aria-hidden className="fixed inset-0 -z-10 overflow-hidden bg-background">
      <div
        className="absolute inset-0 bg-cover bg-center transition-opacity duration-[1400ms] ease-out animate-ken-burns"
        style={{ backgroundImage: `url(${layerA})`, opacity: showB ? 0 : 1 }}
      />
      {layerB && (
        <div
          className="absolute inset-0 bg-cover bg-center transition-opacity duration-[1400ms] ease-out animate-ken-burns"
          style={{ backgroundImage: `url(${layerB})`, opacity: showB ? 1 : 0 }}
        />
      )}
      {/* Cinematic vignette + stronger scrim for text legibility */}
      <div className="absolute inset-0" style={{ background: "var(--gradient-fade-top)" }} />
      <div className="absolute inset-0 bg-background/45" />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, hsl(var(--background) / 0.55) 0%, hsl(var(--background) / 0.25) 40%, hsl(var(--background) / 0.65) 100%)",
        }}
      />
    </div>
  );
}
