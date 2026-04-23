import { MoodId } from "./moods";

export type QuestStepType = "riddle" | "proverb" | "story" | "reflection";

export interface QuestStep {
  type: QuestStepType;
  prompt: string;
  /** For riddle / proverb — accepted answers (lowercase). For story — choice labels. */
  options?: string[];
  /** Index of the "kindest" choice for story; for riddle/proverb the canonical answer. */
  answer?: string;
  /** A short reveal/insight shown after the step is completed. */
  reveal: string;
}

export interface Quest {
  id: string;
  title: string;
  intro: string;
  mood?: MoodId;
  steps: QuestStep[];
}

const UNIVERSAL: QuestStep[] = [
  {
    type: "riddle",
    prompt:
      "I grow heavier the more you carry me, but lighter the moment you set me down. What am I?",
    options: ["worry", "regret", "a stone", "grief"],
    answer: "worry",
    reveal:
      "Worry doubles the weight of everything. Naming it is the first step to setting it down.",
  },
  {
    type: "proverb",
    prompt: "Complete the proverb: \"This too ___ pass.\"",
    options: ["shall", "will", "may", "must"],
    answer: "shall",
    reveal:
      "Nothing — not joy, not pain — stays forever. Impermanence is a quiet mercy.",
  },
  {
    type: "story",
    prompt:
      "You are walking a dim path and meet a stranger who looks lost. What do you do?",
    options: [
      "Walk past — you have your own path",
      "Ask if they need company",
      "Share what little light you have",
    ],
    answer: "Share what little light you have",
    reveal:
      "Often the kindest thing we can offer another is also what we most need ourselves.",
  },
  {
    type: "reflection",
    prompt: "What is one feeling you've been avoiding? Just name it — softly.",
    reveal:
      "Naming a feeling is not the same as drowning in it. It's how we begin to meet ourselves.",
  },
  {
    type: "reflection",
    prompt: "If today were a weather, what would it be? And what does that weather need?",
    reveal: "Sometimes a storm just needs to be witnessed. Sometimes it needs shelter.",
  },
];

const BY_MOOD: Partial<Record<MoodId, QuestStep[]>> = {
  anxious: [
    {
      type: "riddle",
      prompt:
        "I run through your mind without legs and steal your sleep without hands. What am I?",
      options: ["a thought", "fear", "tomorrow", "a worry"],
      answer: "a thought",
      reveal: "A thought is only a guest. You don't have to host every one.",
    },
    {
      type: "reflection",
      prompt: "Name three things in this room. Anchor here. What do you notice?",
      reveal: "The body is always in the present. The mind is the one that travels.",
    },
  ],
  sad: [
    {
      type: "proverb",
      prompt: "Complete this Persian proverb: \"After every night ___ a morning.\"",
      options: ["comes", "follows", "waits", "rises"],
      answer: "comes",
      reveal: "Sadness is honest. It doesn't lie about what mattered to you.",
    },
  ],
  lonely: [
    {
      type: "story",
      prompt:
        "An old friend crosses your mind. What's the kindest thing to do?",
      options: [
        "Let the thought drift past",
        "Send a small message — no expectation",
        "Sit with the longing for a while",
      ],
      answer: "Send a small message — no expectation",
      reveal: "Reaching out is brave. Even if no one answers, you have answered yourself.",
    },
  ],
  "burned-out": [
    {
      type: "reflection",
      prompt: "What is one thing you can take off your plate today — even just for an hour?",
      reveal: "Rest is not a reward for finishing. It's the soil everything grows from.",
    },
  ],
  motivated: [
    {
      type: "riddle",
      prompt: "I am the smallest possible step. Take me, and the next one appears. What am I?",
      options: ["beginning", "movement", "intention", "now"],
      answer: "beginning",
      reveal: "Motivation often arrives after action — not before.",
    },
  ],
  overwhelmed: [
    {
      type: "reflection",
      prompt: "If you could only do ONE thing today, what would it be?",
      reveal: "Clarity is a form of relief. One thing, done with care, is enough.",
    },
  ],
};

export function buildQuest(mood: MoodId | null): Quest {
  const moodSteps = mood ? BY_MOOD[mood] ?? [] : [];
  // Pick 1 mood step + 3 universal (varied types)
  const universalShuffled = [...UNIVERSAL].sort(() => Math.random() - 0.5);
  const picks: QuestStep[] = [];
  const types = new Set<QuestStepType>();
  if (moodSteps.length) {
    const s = moodSteps[Math.floor(Math.random() * moodSteps.length)];
    picks.push(s);
    types.add(s.type);
  }
  for (const s of universalShuffled) {
    if (picks.length >= 4) break;
    if (types.has(s.type) && picks.length < 3) continue;
    picks.push(s);
    types.add(s.type);
  }
  while (picks.length < 4 && universalShuffled.length) {
    const s = universalShuffled.shift()!;
    if (!picks.includes(s)) picks.push(s);
  }
  return {
    id: `quest-${Date.now()}`,
    title: "A small reflection",
    intro:
      "Four gentle prompts. There are no wrong answers — only a quieter you on the other side.",
    mood: mood ?? undefined,
    steps: picks.slice(0, 4),
  };
}
