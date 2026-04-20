export type AdvisorId = "asha" | "reza";

export interface Advisor {
  id: AdvisorId;
  name: string;
  tagline: string;
  voice: string;
  accent: string; // hsl
}

export const ADVISORS: Advisor[] = [
  {
    id: "asha",
    name: "Asha",
    tagline: "Warm · Poetic",
    voice: "Speaks like soft candlelight.",
    accent: "32 95% 70%",
  },
  {
    id: "reza",
    name: "Reza",
    tagline: "Deep · Philosophical",
    voice: "Asks the quiet, piercing question.",
    accent: "260 60% 70%",
  },
];

export const getAdvisor = (id: AdvisorId) =>
  ADVISORS.find((a) => a.id === id) ?? ADVISORS[0];
