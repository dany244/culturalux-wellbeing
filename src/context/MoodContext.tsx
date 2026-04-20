import { createContext, useCallback, useContext, useEffect, useState, ReactNode } from "react";
import { MoodId } from "@/lib/moods";

export interface MoodEntry {
  id: string;
  mood: MoodId;
  note?: string;
  timestamp: number;
}

interface MoodContextValue {
  currentMood: MoodId | null;
  setMood: (mood: MoodId, note?: string) => void;
  clearMood: () => void;
  history: MoodEntry[];
  userName: string | null;
}

const MoodContext = createContext<MoodContextValue | undefined>(undefined);

const STORAGE_HISTORY = "culturalux:history";
const STORAGE_CURRENT = "culturalux:current";

export function MoodProvider({ children }: { children: ReactNode }) {
  const [currentMood, setCurrentMood] = useState<MoodId | null>(null);
  const [history, setHistory] = useState<MoodEntry[]>([]);
  // No auth yet — placeholder name. Will plug into Lovable Cloud later.
  const userName: string | null = null;

  useEffect(() => {
    try {
      const c = localStorage.getItem(STORAGE_CURRENT);
      if (c) setCurrentMood(c as MoodId);
      const h = localStorage.getItem(STORAGE_HISTORY);
      if (h) setHistory(JSON.parse(h));
    } catch { /* ignore */ }
  }, []);

  const setMood = useCallback((mood: MoodId, note?: string) => {
    setCurrentMood(mood);
    const entry: MoodEntry = {
      id: crypto.randomUUID(),
      mood,
      note,
      timestamp: Date.now(),
    };
    setHistory((prev) => {
      const next = [entry, ...prev].slice(0, 200);
      localStorage.setItem(STORAGE_HISTORY, JSON.stringify(next));
      return next;
    });
    localStorage.setItem(STORAGE_CURRENT, mood);
  }, []);

  const clearMood = useCallback(() => {
    setCurrentMood(null);
    localStorage.removeItem(STORAGE_CURRENT);
  }, []);

  return (
    <MoodContext.Provider value={{ currentMood, setMood, clearMood, history, userName }}>
      {children}
    </MoodContext.Provider>
  );
}

export function useMood() {
  const ctx = useContext(MoodContext);
  if (!ctx) throw new Error("useMood must be used within MoodProvider");
  return ctx;
}
