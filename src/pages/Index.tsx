import { useMemo } from "react";
import { useMood } from "@/context/MoodContext";
import { MOODS, getMood } from "@/lib/moods";
import { buildGreeting } from "@/lib/greeting";
import { MoodCard } from "@/components/MoodCard";
import { ContentRow } from "@/components/ContentRow";
import { getRecommendations } from "@/lib/recommendations";
import { AdvisorPanel } from "@/components/AdvisorPanel";
import { QuestLauncher } from "@/components/QuestLauncher";
import { trackEvent } from "@/lib/analytics";

const Index = () => {
  const { currentMood, setMood, userName } = useMood();
  const greeting = useMemo(() => buildGreeting(userName), [userName]);
  const mood = getMood(currentMood);
  const rows = useMemo(() => getRecommendations(currentMood), [currentMood]);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 md:space-y-16 lg:space-y-20 py-6 md:py-10 pb-28 md:pb-12 overflow-x-hidden">
      {/* Hero greeting — left aligned */}
      <section className="min-h-[50vh] md:min-h-[55vh] flex flex-col items-start justify-center text-left w-full max-w-3xl mr-auto space-y-4 md:space-y-6 animate-fade-in-up">
        <span className="text-[10px] md:text-xs uppercase tracking-[0.3em] text-primary-glow">Cultura Lux</span>
        <h1 className="font-display text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.05] text-white drop-shadow-[0_2px_24px_rgba(0,0,0,0.55)] break-words hyphens-auto">
          {greeting}.
        </h1>
        <p className="text-lg sm:text-xl md:text-2xl text-white/90 font-light drop-shadow-[0_1px_12px_rgba(0,0,0,0.45)]">
          How are you feeling today?
        </p>
        <div className="space-y-3 text-sm sm:text-base text-white/80 font-light max-w-2xl drop-shadow-[0_1px_10px_rgba(0,0,0,0.45)] leading-relaxed">
          <p>
            When words fail, art speaks. When the mind races, music breathes. Cultura Lux prescribes books, films, rituals, and wisdom from traditions around the world — matched to exactly how you feel.
          </p>
          <p>
            A sanctuary for seekers, Cultura Lux offers curated cultural insight, reflective practices, and community spaces designed to nourish the heart and expand the mind for your well-being.
          </p>
        </div>
        {mood && (
          <p className="text-sm italic text-primary-glow/90 animate-fade-in text-veil">
            "{mood.whisper}"
          </p>
        )}
      </section>

      {/* AI Advisor — routes to Sanctuary */}
      <section className="max-w-3xl mx-auto w-full animate-fade-in-up" style={{ animationDelay: "120ms" }}>
        <AdvisorPanel variant="compact" redirectToSanctuary />
      </section>

      {/* Mood grid — centered */}
      <section className="space-y-4 max-w-5xl mx-auto w-full text-center animate-fade-in-up" style={{ animationDelay: "240ms" }}>
        <h2 className="font-display text-2xl md:text-3xl">Choose a feeling</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5 md:gap-3 mx-auto">
          {MOODS.map((m, i) => (
            <MoodCard
              key={m.id}
              mood={m}
              index={i}
              selected={currentMood === m.id}
              onClick={() => {
                setMood(m.id);
                trackEvent({ type: "mood_selected", mood: m.id });
              }}
            />
          ))}
        </div>
        {currentMood && (
          <div className="pt-1 animate-fade-in">
            <button
              onClick={() => {
                setMood(currentMood);
                trackEvent({ type: "mood_selected", mood: currentMood });
              }}
              className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground/70 hover:text-primary-glow transition-colors inline-flex items-center gap-2"
            >
              <span className="h-px w-6 bg-current opacity-50" />
              Log this feeling again
            </button>
          </div>
        )}
      </section>

      {/* Reflection Quest */}
      <section className="max-w-3xl mx-auto w-full animate-fade-in-up" style={{ animationDelay: "360ms" }}>
        <QuestLauncher />
      </section>

      {/* Recommendations */}
      <div className="space-y-10 md:space-y-12 max-w-6xl mx-auto w-full">
        {rows.length > 0 ? (
          rows.map((row, idx) => (
            <div key={row.title} className="animate-fade-in-up" style={{ animationDelay: `${480 + idx * 120}ms` }}>
              <ContentRow title={row.title} items={row.items} />
            </div>
          ))
        ) : currentMood ? (
          <div className="text-center text-sm text-muted-foreground italic max-w-xl mx-auto animate-fade-in">
            Curated picks for this feeling are on the way. In the meantime, open the Sanctuary or Explore for tuned recommendations.
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Index;
