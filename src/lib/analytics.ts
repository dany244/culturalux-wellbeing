// Lightweight client-side event tracking.
// Stores aggregated counts in localStorage so usage can be inspected
// without any external analytics provider. Safe to call anywhere.

export type AnalyticsEvent =
  | { type: "mood_selected"; mood: string }
  | { type: "recommendation_click"; rowTitle: string; itemId: string; itemTitle: string; url?: string }
  | { type: "explore_book_click"; title: string; author?: string; mood?: string | null }
  | { type: "explore_tab_change"; tab: string };

const STORAGE_KEY = "culturalux:analytics:v1";
const LOG_KEY = "culturalux:analytics:log:v1";
const MAX_LOG = 200;

interface Store {
  counts: Record<string, number>;
  updatedAt: number;
}

function read(): Store {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { counts: {}, updatedAt: 0 };
    return JSON.parse(raw) as Store;
  } catch {
    return { counts: {}, updatedAt: 0 };
  }
}

function write(store: Store) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch {/* ignore quota */}
}

function keyFor(event: AnalyticsEvent): string {
  switch (event.type) {
    case "mood_selected":
      return `mood:${event.mood}`;
    case "recommendation_click":
      return `rec:${event.rowTitle}:${event.itemId}`;
    case "explore_book_click":
      return `book:${event.title}`;
    case "explore_tab_change":
      return `tab:${event.tab}`;
  }
}

export function trackEvent(event: AnalyticsEvent) {
  const store = read();
  const key = keyFor(event);
  store.counts[key] = (store.counts[key] ?? 0) + 1;
  store.updatedAt = Date.now();
  write(store);

  // Append a rolling log for richer inspection.
  try {
    const raw = localStorage.getItem(LOG_KEY);
    const log: Array<AnalyticsEvent & { ts: number }> = raw ? JSON.parse(raw) : [];
    log.unshift({ ...event, ts: Date.now() });
    localStorage.setItem(LOG_KEY, JSON.stringify(log.slice(0, MAX_LOG)));
  } catch {/* ignore */}

  if (import.meta.env.DEV) {
    // Helpful during development.
     
    console.debug("[analytics]", event);
  }
}

export interface AnalyticsSummary {
  moods: Array<{ mood: string; count: number }>;
  recommendations: Array<{ rowTitle: string; itemId: string; count: number }>;
  books: Array<{ title: string; count: number }>;
  tabs: Array<{ tab: string; count: number }>;
  updatedAt: number;
}

export function getAnalyticsSummary(): AnalyticsSummary {
  const { counts, updatedAt } = read();
  const moods: AnalyticsSummary["moods"] = [];
  const recs: AnalyticsSummary["recommendations"] = [];
  const books: AnalyticsSummary["books"] = [];
  const tabs: AnalyticsSummary["tabs"] = [];

  for (const [key, count] of Object.entries(counts)) {
    if (key.startsWith("mood:")) {
      moods.push({ mood: key.slice(5), count });
    } else if (key.startsWith("rec:")) {
      const rest = key.slice(4);
      const idx = rest.indexOf(":");
      if (idx > -1) {
        recs.push({ rowTitle: rest.slice(0, idx), itemId: rest.slice(idx + 1), count });
      }
    } else if (key.startsWith("book:")) {
      books.push({ title: key.slice(5), count });
    } else if (key.startsWith("tab:")) {
      tabs.push({ tab: key.slice(4), count });
    }
  }

  const byCount = <T extends { count: number }>(a: T, b: T) => b.count - a.count;
  return {
    moods: moods.sort(byCount),
    recommendations: recs.sort(byCount),
    books: books.sort(byCount),
    tabs: tabs.sort(byCount),
    updatedAt,
  };
}

export function clearAnalytics() {
  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(LOG_KEY);
  } catch {/* ignore */}
}
