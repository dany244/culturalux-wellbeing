import { MoodEntry } from "@/context/MoodContext";
import { MOODS, MoodId } from "./moods";

export interface Insight {
  id: string;
  text: string;
  tone: "neutral" | "warm" | "alert";
}

type Bucket = "morning" | "afternoon" | "evening" | "night";
function bucketOf(d: Date): Bucket {
  const h = d.getHours();
  if (h < 6) return "night";
  if (h < 12) return "morning";
  if (h < 18) return "afternoon";
  return "evening";
}

const BUCKET_LABEL: Record<Bucket, string> = {
  morning: "in the mornings",
  afternoon: "in the afternoons",
  evening: "in the evenings",
  night: "late at night",
};

const moodLabel = (id: MoodId) =>
  MOODS.find((m) => m.id === id)?.label.toLowerCase() ?? id;

export function computeInsights(history: MoodEntry[]): Insight[] {
  const out: Insight[] = [];
  if (history.length === 0) return out;

  const recent = history.slice(0, 30); // last 30 entries

  // 1. Most common mood
  const counts: Record<string, number> = {};
  recent.forEach((h) => {
    counts[h.mood] = (counts[h.mood] ?? 0) + 1;
  });
  const top = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
  if (top && top[1] >= 2) {
    const [moodId, count] = top;
    out.push({
      id: "top-mood",
      text: `${moodLabel(moodId as MoodId)} has come up ${count} times in your last ${recent.length} reflections.`,
      tone: "neutral",
    });
  }

  // 2. Mood × time-of-day pattern
  const moodByBucket: Record<string, Record<Bucket, number>> = {};
  recent.forEach((h) => {
    const b = bucketOf(new Date(h.timestamp));
    moodByBucket[h.mood] ??= { morning: 0, afternoon: 0, evening: 0, night: 0 };
    moodByBucket[h.mood][b]++;
  });
  let best: { mood: MoodId; bucket: Bucket; n: number; total: number } | null = null;
  for (const [mood, byB] of Object.entries(moodByBucket)) {
    const total = Object.values(byB).reduce((a, b) => a + b, 0);
    if (total < 2) continue;
    const [bucket, n] = (Object.entries(byB) as [Bucket, number][]).sort(
      (a, b) => b[1] - a[1],
    )[0];
    if (n >= 2 && n / total >= 0.5) {
      if (!best || n > best.n) {
        best = { mood: mood as MoodId, bucket, n, total };
      }
    }
  }
  if (best) {
    out.push({
      id: "tod-pattern",
      text: `You've been feeling ${moodLabel(best.mood)} more ${BUCKET_LABEL[best.bucket]}.`,
      tone: "warm",
    });
  }

  // 3. Cadence — recent activity
  const last7 = recent.filter(
    (h) => Date.now() - h.timestamp < 7 * 24 * 3600 * 1000,
  );
  if (last7.length >= 3) {
    out.push({
      id: "cadence",
      text: `You've reflected ${last7.length} times this week. That's a steady rhythm.`,
      tone: "warm",
    });
  } else if (last7.length === 0 && recent.length > 0) {
    out.push({
      id: "cadence-quiet",
      text: `It's been quiet here for a week. Whenever you're ready.`,
      tone: "neutral",
    });
  }

  // 4. Shift — last vs prior
  if (recent.length >= 6) {
    const half = Math.floor(recent.length / 2);
    const newer = recent.slice(0, half);
    const older = recent.slice(half);
    const top1 = topMood(newer);
    const top2 = topMood(older);
    if (top1 && top2 && top1 !== top2) {
      out.push({
        id: "shift",
        text: `Lately you've shifted from feeling ${moodLabel(top2)} toward feeling ${moodLabel(top1)}.`,
        tone: "warm",
      });
    }
  }

  return out.slice(0, 4);
}

function topMood(list: MoodEntry[]): MoodId | null {
  const c: Record<string, number> = {};
  list.forEach((h) => (c[h.mood] = (c[h.mood] ?? 0) + 1));
  const top = Object.entries(c).sort((a, b) => b[1] - a[1])[0];
  return top ? (top[0] as MoodId) : null;
}
