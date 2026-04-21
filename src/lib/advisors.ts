export type AdvisorId = "asha" | "reza";

export interface Advisor {
  id: AdvisorId;
  name: string;
  tagline: string;
  voice: string;
  accent: string; // hsl
  glyph: string;
}

export const ADVISORS: Advisor[] = [
  {
    id: "asha",
    name: "Asha",
    tagline: "Warm · Poetic",
    voice: "Speaks like soft candlelight.",
    accent: "32 95% 70%",
    glyph: "✦",
  },
  {
    id: "reza",
    name: "Reza",
    tagline: "Deep · Philosophical",
    voice: "Asks the quiet, piercing question.",
    accent: "260 60% 70%",
    glyph: "☾",
  },
];

export const getAdvisor = (id: AdvisorId) =>
  ADVISORS.find((a) => a.id === id) ?? ADVISORS[0];
