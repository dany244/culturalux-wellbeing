import { useMemo } from "react";
import { useMood } from "@/context/MoodContext";
import { MOODS, getMood } from "@/lib/moods";
import { buildGreeting } from "@/lib/greeting";
import { MoodCard } from "@/components/MoodCard";
import { ContentRow } from "@/components/ContentRow";
import { getRecommendations } from "@/lib/recommendations";
import { AdvisorPanel } from "@/components/AdvisorPanel";
import { QuestLauncher } from "@/components/QuestLauncher";

const Index = () => {
  const { currentMood, setMood, userName } = useMood();
  const greeting = useMemo(() => buildGreeting(userName), [userName]);
  const mood = getMood(currentMood);
  const rows = useMemo(() => getRecommendations(currentMood), [currentMood]);

  return (
    <div className="container space-y-16">
      {/* Hero greeting */}
      <section className="min-h-[55vh] flex flex-col justify-center max-w-3xl space-y-6 animate-fade-in-up">
        <span className="text-xs uppercase tracking-[0.3em] text-primary-glow">Culturalux</span>
        <h1 className="font-display text-5xl md:text-7xl leading-[1.05] text-gradient text-veil">
          {greeting}.
        </h1>
        <p className="text-xl md:text-2xl text-foreground/85 font-light text-veil">
          How are you feeling today?
        </p>
        {mood && (
          <p className="text-sm italic text-primary-glow/90 max-w-md animate-fade-in text-veil">
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

      {/* AI Advisor — routes to Sanctuary */}
      <section className="max-w-3xl">
        <AdvisorPanel variant="compact" redirectToSanctuary />
      </section>

      {/* Reflection Quest */}
      <section className="max-w-3xl">
        <QuestLauncher />
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
