import ashaPortrait from "@/assets/advisor-asha.jpg";
import laylaPortrait from "@/assets/advisor-layla.jpg";
import omarPortrait from "@/assets/advisor-omar.jpg";

export type AdvisorId = "asha" | "reza" | "omar";

export interface Advisor {
  id: AdvisorId;
  name: string;
  tagline: string;
  voice: string;
  accent: string; // hsl
  glyph: string;
  portrait: string;
}

export const ADVISORS: Advisor[] = [
  {
    id: "asha",
    name: "Asha",
    tagline: "Warm · Poetic",
    voice: "Speaks like soft candlelight.",
    accent: "32 95% 70%",
    glyph: "✦",
    portrait: ashaPortrait,
  },
  {
    // Backend id stays "reza" for compatibility; display name is Layla.
    id: "reza",
    name: "Layla",
    tagline: "Deep · Philosophical",
    voice: "Asks the quiet, piercing question.",
    accent: "260 60% 70%",
    glyph: "☾",
    portrait: laylaPortrait,
  },
  {
    id: "omar",
    name: "Omar",
    tagline: "Grounded · Contemplative",
    voice: "A steady hand and an older brother's calm.",
    accent: "150 45% 60%",
    glyph: "☉",
    portrait: omarPortrait,
  },
];

export const getAdvisor = (id: AdvisorId) =>
  ADVISORS.find((a) => a.id === id) ?? ADVISORS[0];
