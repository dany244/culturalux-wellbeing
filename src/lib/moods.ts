import anxious from "@/assets/mood-anxious.jpg";
import burnedout from "@/assets/mood-burnedout.jpg";
import lonely from "@/assets/mood-lonely.jpg";
import overwhelmed from "@/assets/mood-overwhelmed.jpg";
import motivated from "@/assets/mood-motivated.jpg";
import inspired from "@/assets/mood-inspired.jpg";
import defaultBg from "@/assets/mood-default.jpg";

export type MoodId =
  | "burned-out"
  | "anxious"
  | "motivated"
  | "lonely"
  | "overwhelmed"
  | "inspired"
  | "stillness"
  | "solitude"
  | "courage";

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
    id: "inspired",
    label: "Inspired",
    description: "Awake, luminous",
    background: inspired,
    accent: "190 80% 65%",
    whisper: "Catch the spark. Follow where it glows.",
    glyph: "✧",
  },
  // New task moods
  {
    id: "stillness",
    label: "Searching for Stillness",
    description: "Peace, Lao Tzu / Taoism",
    background: anxious, // reuse calm bg
    accent: "210 80% 70%", // blue calm
    whisper: "Be still. The mud settles, water clears.",
    glyph: "🕊️",
  },
  {
    id: "solitude",
    label: "In Solitude",
    description: "Connection, Rilke / Murakami",
    background: lonely,
    accent: "260 50% 65%",
    whisper: "Solitude is where the soul finds its rhythm.",
    glyph: "☾",
  },
  {
    id: "courage",
    label: "Need for Courage",
    description: "Strength, Gibran",
    background: motivated,
    accent: "20 90% 65%", // warm courage
    whisper: "Courage is the ladder on which all virtues mount.",
    glyph: "⚔️",
  },
  {
    id: "overwhelmed",
    label: "Overwhelmed",
    description: "Grounding, Stoicism / Marcus Aurelius", // task map
    background: overwhelmed,
    accent: "280 60% 70%",
    whisper: "You have power over your mind - not outside events.",
    glyph: "❖",
  },
];

export const DEFAULT_BG = defaultBg;

export const getMood = (id: MoodId | null) =>
  id ? MOODS.find((m) => m.id === id) ?? null : null;
