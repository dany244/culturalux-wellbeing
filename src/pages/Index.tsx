import { useMemo, useState } from "react";
import { useMood } from "@/context/MoodContext";
import { MOODS, getMood } from "@/lib/moods";
import { buildGreeting } from "@/lib/greeting";
import { MoodCard } from "@/components/MoodCard";
import { ContentRow } from "@/components/ContentRow";
import { getRecommendations } from "@/lib/recommendations";
import { ArrowRight } from "lucide-react";

const Index = () => {
  const { currentMood, setMood, userName } = useMood();
  const [note, setNote] = useState("");
  const greeting = useMemo(() => buildGreeting(userName), [userName]);
  const mood = getMood(currentMood);
  const rows = useMemo(() => getRecommendations(currentMood), [currentMood]);

  const handleReflect = (e: React.FormEvent) => {
    e.preventDefault();
    if (!note.trim() || !currentMood) return;
    setMood(currentMood, note.trim());
    setNote("");
  };

  return (
    <div className="container space-y-16">
      {/* Hero greeting */}
      <section className="min-h-[55vh] flex flex-col justify-center max-w-3xl space-y-6 animate-fade-in-up">
        <span className="text-xs uppercase tracking-[0.3em] text-primary-glow">Culturalux</span>
        <h1 className="font-display text-5xl md:text-7xl leading-[1.05] text-gradient">
          {greeting}.
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground font-light">
          How are you feeling today?
        </p>
        {mood && (
          <p className="text-sm italic text-primary-glow/90 max-w-md animate-fade-in">
            "{mood.whisper}"
          </p>
        )}
      </section>

      {/* Mood grid */}
      <section className="space-y-5">
        <div className="flex items-end justify-between">
          <h2 className="font-display text-2xl md:text-3xl">Choose a feeling</h2>
          {currentMood && (
            <button
              onClick={() => setMood(currentMood)}
              className="text-xs text-muted-foreground hover:text-primary-glow transition-colors"
            >
              Log again
            </button>
          )}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
          {MOODS.map((m, i) => (
            <MoodCard
              key={m.id}
              mood={m}
              index={i}
              selected={currentMood === m.id}
              onClick={() => setMood(m.id)}
            />
          ))}
        </div>
      </section>

      {/* Reflection input */}
      <section>
        <form onSubmit={handleReflect} className="glass-strong rounded-3xl p-2 flex items-center gap-2 max-w-2xl">
          <input
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder={mood ? `Say more about feeling ${mood.label.toLowerCase()}…` : "Pick a feeling, then say more…"}
            className="flex-1 bg-transparent px-4 py-3 outline-none text-foreground placeholder:text-muted-foreground/70"
          />
          <button
            type="submit"
            disabled={!currentMood || !note.trim()}
            className="h-11 w-11 shrink-0 rounded-full bg-primary text-primary-foreground flex items-center justify-center disabled:opacity-30 transition-all hover:shadow-[0_0_30px_-5px_hsl(var(--primary)/0.7)]"
          >
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>
      </section>

      {/* Recommendations */}
      <div className="space-y-12">
        {rows.map((row) => (
          <ContentRow key={row.title} title={row.title} items={row.items} />
        ))}
      </div>
    </div>
  );
};

export default Index;
