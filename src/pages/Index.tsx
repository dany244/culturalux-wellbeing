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
        <h1 className="font-display text-5xl md:text-7xl leading-[1.05] text-white drop-shadow-[0_2px_24px_rgba(0,0,0,0.55)]">
          {greeting}.
        </h1>
        <p className="text-xl md:text-2xl text-white/90 font-light drop-shadow-[0_1px_12px_rgba(0,0,0,0.45)]">
          How are you feeling today?
        </p>
        {mood && (
          <p className="text-sm italic text-primary-glow/90 max-w-md animate-fade-in text-veil">
            "{mood.whisper}"
          </p>
        )}
      </section>

      {/* Mood grid */}
      <section className="space-y-4">
        <h2 className="font-display text-2xl md:text-3xl">Choose a feeling</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5 md:gap-3">
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
        {currentMood && (
          <div className="pt-1">
            <button
              onClick={() => setMood(currentMood)}
              className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground/70 hover:text-primary-glow transition-colors inline-flex items-center gap-2"
            >
              <span className="h-px w-6 bg-current opacity-50" />
              Log this feeling again
            </button>
          </div>
        )}
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
