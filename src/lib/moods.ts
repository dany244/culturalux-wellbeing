import anxious from "@/assets/mood-anxious.jpg";
import sad from "@/assets/mood-sad.jpg";
import burnedout from "@/assets/mood-burnedout.jpg";
import lonely from "@/assets/mood-lonely.jpg";
import overwhelmed from "@/assets/mood-overwhelmed.jpg";
import motivated from "@/assets/mood-motivated.jpg";
import good from "@/assets/mood-good.jpg";
import inspired from "@/assets/mood-inspired.jpg";
import hopeful from "@/assets/mood-hopeful.jpg";
import defaultBg from "@/assets/mood-default.jpg";

export type MoodId =
  | "burned-out"
  | "anxious"
  | "sad"
  | "motivated"
  | "lonely"
  | "overwhelmed"
  | "good"
  | "inspired"
  | "hopeful";

export interface Mood {
  id: MoodId;
  label: string;
  description: string;
  background: string;
  accent: string; // tailwind hsl color string for glow tint
  whisper: string;
  glyph: string; // small symbolic avatar
}

export const MOODS: Mood[] = [
  {
    id: "burned-out",
    label: "Burned Out",
    description: "Drained, depleted",
    background: burnedout,
    accent: "28 90% 60%",
    whisper: "Let the day soften. You don't have to carry it alone.",
    glyph: "☼",
  },
  {
    id: "anxious",
    label: "Anxious",
    description: "Unsettled, restless",
    background: anxious,
    accent: "200 70% 65%",
    whisper: "Breathe with the water. The wave will pass.",
    glyph: "≈",
  },
  {
    id: "sad",
    label: "Sad",
    description: "Heavy, tender",
    background: sad,
    accent: "215 50% 60%",
    whisper: "Feel it fully. The rain knows the way.",
    glyph: "❀",
  },
  {
    id: "motivated",
    label: "Motivated",
    description: "Driven, ready",
    background: motivated,
    accent: "32 90% 65%",
    whisper: "The fire is yours. Move with it, gently.",
    glyph: "✶",
  },
  {
    id: "lonely",
    label: "Lonely",
    description: "Distant, longing",
    background: lonely,
    accent: "260 50% 65%",
    whisper: "You are not alone in feeling alone.",
    glyph: "☾",
  },
  {
    id: "overwhelmed",
    label: "Overwhelmed",
    description: "Too much, all at once",
    background: overwhelmed,
    accent: "280 60% 70%",
    whisper: "Soften your gaze. One thing at a time.",
    glyph: "❖",
  },
  {
    id: "good",
    label: "Good",
    description: "Steady, content",
    background: good,
    accent: "140 55% 65%",
    whisper: "Let the quiet light stay a while.",
    glyph: "❁",
  },
  {
    id: "inspired",
    label: "Inspired",
    description: "Awake, luminous",
    background: inspired,
    accent: "190 80% 65%",
    whisper: "Catch the spark. Follow where it glows.",
    glyph: "✧",
  },
  {
    id: "hopeful",
    label: "Hopeful",
    description: "Quietly rising",
    background: hopeful,
    accent: "350 75% 75%",
    whisper: "Dawn doesn't rush. Neither must you.",
    glyph: "❋",
  },
];

export const DEFAULT_BG = defaultBg;

export const getMood = (id: MoodId | null) =>
  id ? MOODS.find((m) => m.id === id) ?? null : null;
