import { createContext, useCallback, useContext, useEffect, useState, ReactNode } from "react";
import { MoodId } from "@/lib/moods";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./AuthContext";

export interface MoodEntry {
  id: string;
  mood: MoodId;
  note?: string;
  timestamp: number;
  advisor?: string | null;
  recommendation_summary?: any;
}

interface MoodContextValue {
  currentMood: MoodId | null;
  setMood: (mood: MoodId, note?: string) => void;
  clearMood: () => void;
  history: MoodEntry[];
  userName: string | null;
  refreshHistory: () => Promise<void>;
  saveInteraction: (input: {
    mood: MoodId;
    input_text?: string | null;
    advisor?: string | null;
    recommendation_summary?: any;
  }) => Promise<void>;
}

const MoodContext = createContext<MoodContextValue | undefined>(undefined);

const STORAGE_CURRENT = "culturalux:current";

export function MoodProvider({ children }: { children: ReactNode }) {
  const { user, displayName } = useAuth();
  const [currentMood, setCurrentMood] = useState<MoodId | null>(null);
  const [history, setHistory] = useState<MoodEntry[]>([]);

  // Restore last selected mood (UI cue) from localStorage
  useEffect(() => {
    try {
      const c = localStorage.getItem(STORAGE_CURRENT);
      if (c) setCurrentMood(c as MoodId);
    } catch {/* ignore */}
  }, []);

  const refreshHistory = useCallback(async () => {
    if (!user) {
      setHistory([]);
      return;
    }
    const { data, error } = await supabase
      .from("mood_history")
      .select("id, mood, input_text, advisor, recommendation_summary, created_at")
      .order("created_at", { ascending: false })
      .limit(200);
    if (error) {
      console.error("load history error", error);
      return;
    }
    setHistory(
      (data ?? []).map((r: any) => ({
        id: r.id,
        mood: r.mood as MoodId,
        note: r.input_text ?? undefined,
        timestamp: new Date(r.created_at).getTime(),
        advisor: r.advisor,
        recommendation_summary: r.recommendation_summary,
      })),
    );
  }, [user]);

  useEffect(() => {
    refreshHistory();
  }, [refreshHistory]);

  const setMood = useCallback((mood: MoodId, _note?: string) => {
    setCurrentMood(mood);
    localStorage.setItem(STORAGE_CURRENT, mood);
  }, []);

  const clearMood = useCallback(() => {
    setCurrentMood(null);
    localStorage.removeItem(STORAGE_CURRENT);
  }, []);

  const saveInteraction = useCallback<MoodContextValue["saveInteraction"]>(
    async ({ mood, input_text, advisor, recommendation_summary }) => {
      if (!user) return;
      const { data, error } = await supabase
        .from("mood_history")
        .insert({
          user_id: user.id,
          mood,
          input_text: input_text ?? null,
          advisor: advisor ?? null,
          recommendation_summary: recommendation_summary ?? null,
        })
        .select("id, mood, input_text, advisor, recommendation_summary, created_at")
        .single();
      if (error) {
        console.error("save interaction error", error);
        return;
      }
      setHistory((prev) => [
        {
          id: data.id,
          mood: data.mood as MoodId,
          note: data.input_text ?? undefined,
          timestamp: new Date(data.created_at).getTime(),
          advisor: data.advisor,
          recommendation_summary: data.recommendation_summary,
        },
        ...prev,
      ].slice(0, 200));
    },
    [user],
  );

  return (
    <MoodContext.Provider
      value={{
        currentMood,
        setMood,
        clearMood,
        history,
        userName: displayName,
        refreshHistory,
        saveInteraction,
      }}
    >
      {children}
    </MoodContext.Provider>
  );
}

export function useMood() {
  const ctx = useContext(MoodContext);
  if (!ctx) throw new Error("useMood must be used within MoodProvider");
  return ctx;
}
