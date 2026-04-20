import { MoodId } from "./moods";
import { RowItem } from "@/components/ContentRow";

interface Row {
  title: string;
  items: RowItem[];
}

const COMMON: Row[] = [
  {
    title: "Quiet Listening",
    items: [
      { id: "l1", title: "Nocturne in E-flat", subtitle: "Chopin · 4 min", badge: "Music" },
      { id: "l2", title: "Spiegel im Spiegel", subtitle: "Arvo Pärt · 8 min", badge: "Music" },
      { id: "l3", title: "Weightless", subtitle: "Marconi Union · 8 min", badge: "Ambient" },
      { id: "l4", title: "Avril 14th", subtitle: "Aphex Twin · 2 min", badge: "Piano" },
      { id: "l5", title: "Clair de Lune", subtitle: "Debussy · 5 min", badge: "Music" },
    ],
  },
];

const BY_MOOD: Record<MoodId, Row[]> = {
  "burned-out": [
    { title: "Permission to Rest", items: [
      { id: "b1", title: "How to Do Nothing", subtitle: "Jenny Odell", badge: "Essay" },
      { id: "b2", title: "The Sabbath", subtitle: "Abraham Heschel", badge: "Book" },
      { id: "b3", title: "On Slowness", subtitle: "A short film", badge: "Watch" },
      { id: "b4", title: "Wintering", subtitle: "Katherine May", badge: "Book" },
    ]},
    { title: "Sunsets to Watch", items: [
      { id: "s1", title: "Paterson", subtitle: "Jim Jarmusch · 2016", badge: "Film" },
      { id: "s2", title: "Perfect Days", subtitle: "Wim Wenders · 2023", badge: "Film" },
      { id: "s3", title: "The Tree of Life", subtitle: "Terrence Malick", badge: "Film" },
    ]},
  ],
  anxious: [
    { title: "Stillness", items: [
      { id: "a1", title: "When Things Fall Apart", subtitle: "Pema Chödrön", badge: "Book" },
      { id: "a2", title: "The Untethered Soul", subtitle: "Michael Singer", badge: "Book" },
      { id: "a3", title: "Box Breathing", subtitle: "4 minute practice", badge: "Practice" },
      { id: "a4", title: "Ocean sounds", subtitle: "30 min loop", badge: "Sound" },
    ]},
  ],
  sad: [
    { title: "Tender Companions", items: [
      { id: "sd1", title: "The Year of Magical Thinking", subtitle: "Joan Didion", badge: "Memoir" },
      { id: "sd2", title: "A Little Life", subtitle: "Hanya Yanagihara", badge: "Novel" },
      { id: "sd3", title: "Letters to a Young Poet", subtitle: "Rilke", badge: "Letters" },
      { id: "sd4", title: "Bluets", subtitle: "Maggie Nelson", badge: "Essay" },
    ]},
  ],
  unmotivated: [
    { title: "Small Sparks", items: [
      { id: "u1", title: "The War of Art", subtitle: "Steven Pressfield", badge: "Book" },
      { id: "u2", title: "Bird by Bird", subtitle: "Anne Lamott", badge: "Book" },
      { id: "u3", title: "Ten minutes outside", subtitle: "A simple ritual", badge: "Practice" },
    ]},
  ],
  lonely: [
    { title: "You Are Not Alone", items: [
      { id: "ln1", title: "The Lonely City", subtitle: "Olivia Laing", badge: "Book" },
      { id: "ln2", title: "Just Kids", subtitle: "Patti Smith", badge: "Memoir" },
      { id: "ln3", title: "Lost in Translation", subtitle: "Sofia Coppola", badge: "Film" },
    ]},
  ],
  overwhelmed: [
    { title: "One Thing at a Time", items: [
      { id: "o1", title: "Four Thousand Weeks", subtitle: "Oliver Burkeman", badge: "Book" },
      { id: "o2", title: "Essentialism", subtitle: "Greg McKeown", badge: "Book" },
      { id: "o3", title: "A walk without a phone", subtitle: "Tonight's invitation", badge: "Practice" },
    ]},
  ],
};

export function getRecommendations(mood: MoodId | null): Row[] {
  if (!mood) return COMMON;
  return [...BY_MOOD[mood], ...COMMON];
}
