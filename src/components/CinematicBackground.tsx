import { useMood } from "@/context/MoodContext";
import { DEFAULT_BG, getMood } from "@/lib/moods";
import { useEffect, useState } from "react";

/**
 * Full-screen fixed cinematic background.
 * - When no mood is selected: shows the default background with a stronger scrim
 *   so the hero text remains perfectly legible.
 * - When a mood is selected: crossfades to that mood's image with a softer scrim.
 */
export function CinematicBackground() {
  const { currentMood } = useMood();
  const mood = getMood(currentMood);
  const target = mood?.background ?? DEFAULT_BG;
  const isDefault = !mood;

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
      {/* Cinematic vignette + scrim for text legibility.
          Stronger when no mood is selected so default hero text stays readable. */}
      <div className="absolute inset-0" style={{ background: "var(--gradient-fade-top)" }} />
      <div
        className="absolute inset-0 transition-opacity duration-[1400ms] ease-out"
        style={{ background: "hsl(var(--background) / 1)", opacity: isDefault ? 0.6 : 0.4 }}
      />
      <div
        className="absolute inset-0 transition-opacity duration-[1400ms] ease-out"
        style={{
          opacity: isDefault ? 1 : 0.85,
          background:
            "linear-gradient(180deg, hsl(var(--background) / 0.65) 0%, hsl(var(--background) / 0.35) 40%, hsl(var(--background) / 0.75) 100%)",
        }}
      />
    </div>
  );
}
