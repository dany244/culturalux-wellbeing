import anxious from "@/assets/mood-anxious.jpg";
import sad from "@/assets/mood-sad.jpg";
import burnedout from "@/assets/mood-burnedout.jpg";
import lonely from "@/assets/mood-lonely.jpg";
import overwhelmed from "@/assets/mood-overwhelmed.jpg";
import unmotivated from "@/assets/mood-unmotivated.jpg";
import defaultBg from "@/assets/mood-default.jpg";

export type MoodId =
  | "burned-out"
  | "anxious"
  | "sad"
  | "unmotivated"
  | "lonely"
  | "overwhelmed";

export interface Mood {
  id: MoodId;
  label: string;
  description: string;
  background: string;
  accent: string; // tailwind hsl color string for glow tint
  whisper: string;
}

export const MOODS: Mood[] = [
  {
    id: "burned-out",
    label: "Burned Out",
    description: "Drained, depleted",
    background: burnedout,
    accent: "28 90% 60%",
    whisper: "Let the day soften. You don't have to carry it alone.",
  },
  {
    id: "anxious",
    label: "Anxious",
    description: "Unsettled, restless",
    background: anxious,
    accent: "200 70% 65%",
    whisper: "Breathe with the water. The wave will pass.",
  },
  {
    id: "sad",
    label: "Sad",
    description: "Heavy, tender",
    background: sad,
    accent: "215 50% 60%",
    whisper: "Feel it fully. The rain knows the way.",
  },
  {
    id: "unmotivated",
    label: "Unmotivated",
    description: "Stuck, uninspired",
    background: unmotivated,
    accent: "32 90% 70%",
    whisper: "A new sun is rising. Take one small step.",
  },
  {
    id: "lonely",
    label: "Lonely",
    description: "Distant, longing",
    background: lonely,
    accent: "260 50% 65%",
    whisper: "You are not alone in feeling alone.",
  },
  {
    id: "overwhelmed",
    label: "Overwhelmed",
    description: "Too much, all at once",
    background: overwhelmed,
    accent: "280 60% 70%",
    whisper: "Soften your gaze. One thing at a time.",
  },
];

export const DEFAULT_BG = defaultBg;

export const getMood = (id: MoodId | null) =>
  id ? MOODS.find((m) => m.id === id) ?? null : null;
