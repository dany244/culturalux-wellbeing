import { MoodId } from "./moods";
import { RowItem } from "@/components/ContentRow";

import recBook from "@/assets/rec-book.jpg";
import recFilm from "@/assets/rec-film.jpg";
import recPractice from "@/assets/rec-practice.jpg";
import recEssay from "@/assets/rec-essay.jpg";

interface Row {
  title: string;
  items: RowItem[];
}

const ol = (q: string) =>
  `https://openlibrary.org/search?q=${encodeURIComponent(q)}`;
const yt = (q: string) =>
  `https://www.youtube.com/results?search_query=${encodeURIComponent(q)}`;
const wiki = (q: string) =>
  `https://en.wikipedia.org/wiki/Special:Search?search=${encodeURIComponent(q)}`;

const COMMON: Row[] = [];

const BY_MOOD: Record<MoodId, Row[]> = {
  "burned-out": [
    { title: "Permission to Rest", items: [
      { id: "b1", title: "How to Do Nothing", subtitle: "Jenny Odell", badge: "Essay", image: recEssay, url: ol("How to Do Nothing Jenny Odell") },
      { id: "b2", title: "The Sabbath", subtitle: "Abraham Heschel", badge: "Book", image: recBook, url: ol("The Sabbath Abraham Heschel") },
      { id: "b3", title: "On Slowness", subtitle: "A short film", badge: "Watch", image: recFilm, url: yt("On slowness short film") },
      { id: "b4", title: "Wintering", subtitle: "Katherine May", badge: "Book", image: recBook, url: ol("Wintering Katherine May") },
    ]},
    { title: "Sunsets to Watch", items: [
      { id: "s1", title: "Paterson", subtitle: "Jim Jarmusch · 2016", badge: "Film", image: recFilm, url: wiki("Paterson 2016 film") },
      { id: "s2", title: "Perfect Days", subtitle: "Wim Wenders · 2023", badge: "Film", image: recFilm, url: wiki("Perfect Days 2023 film") },
      { id: "s3", title: "The Tree of Life", subtitle: "Terrence Malick", badge: "Film", image: recFilm, url: wiki("The Tree of Life film") },
    ]},
  ],
  anxious: [
    { title: "Stillness", items: [
      { id: "a1", title: "When Things Fall Apart", subtitle: "Pema Chödrön", badge: "Book", image: recBook, url: ol("When Things Fall Apart Pema Chodron") },
      { id: "a2", title: "The Untethered Soul", subtitle: "Michael Singer", badge: "Book", image: recBook, url: ol("The Untethered Soul Michael Singer") },
      { id: "a3", title: "Box Breathing", subtitle: "4 minute practice", badge: "Practice", image: recPractice, url: yt("box breathing 4 minute guided") },
      
    ]},
  ],
  sad: [
    { title: "Tender Companions", items: [
      { id: "sd1", title: "The Year of Magical Thinking", subtitle: "Joan Didion", badge: "Memoir", image: recBook, url: ol("The Year of Magical Thinking Didion") },
      { id: "sd2", title: "A Little Life", subtitle: "Hanya Yanagihara", badge: "Novel", image: recBook, url: ol("A Little Life Yanagihara") },
      { id: "sd3", title: "Letters to a Young Poet", subtitle: "Rilke", badge: "Letters", image: recEssay, url: ol("Letters to a Young Poet Rilke") },
      { id: "sd4", title: "Bluets", subtitle: "Maggie Nelson", badge: "Essay", image: recEssay, url: ol("Bluets Maggie Nelson") },
    ]},
  ],
  unmotivated: [
    { title: "Small Sparks", items: [
      { id: "u1", title: "The War of Art", subtitle: "Steven Pressfield", badge: "Book", image: recBook, url: ol("The War of Art Pressfield") },
      { id: "u2", title: "Bird by Bird", subtitle: "Anne Lamott", badge: "Book", image: recBook, url: ol("Bird by Bird Anne Lamott") },
      { id: "u3", title: "Ten minutes outside", subtitle: "A simple ritual", badge: "Practice", image: recPractice, url: yt("ten minute mindful walk outside") },
    ]},
  ],
  lonely: [
    { title: "You Are Not Alone", items: [
      { id: "ln1", title: "The Lonely City", subtitle: "Olivia Laing", badge: "Book", image: recBook, url: ol("The Lonely City Olivia Laing") },
      { id: "ln2", title: "Just Kids", subtitle: "Patti Smith", badge: "Memoir", image: recEssay, url: ol("Just Kids Patti Smith") },
      { id: "ln3", title: "Lost in Translation", subtitle: "Sofia Coppola", badge: "Film", image: recFilm, url: wiki("Lost in Translation film") },
    ]},
  ],
  overwhelmed: [
    { title: "One Thing at a Time", items: [
      { id: "o1", title: "Four Thousand Weeks", subtitle: "Oliver Burkeman", badge: "Book", image: recBook, url: ol("Four Thousand Weeks Burkeman") },
      { id: "o2", title: "Essentialism", subtitle: "Greg McKeown", badge: "Book", image: recBook, url: ol("Essentialism Greg McKeown") },
      { id: "o3", title: "A walk without a phone", subtitle: "Tonight's invitation", badge: "Practice", image: recPractice, url: yt("walk without phone mindful evening") },
    ]},
  ],
};

export function getRecommendations(mood: MoodId | null): Row[] {
  if (!mood) return COMMON;
  return [...BY_MOOD[mood], ...COMMON];
}
