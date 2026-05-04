import React, { useMemo, useState, useRef, useCallback, useEffect } from "react";
import { useMood } from "@/context/MoodContext";
import { MOODS, getMood } from "@/lib/moods";
import { buildGreeting } from "@/lib/greeting";
import { MoodChipsCarousel } from "@/components/MoodChipsCarousel";
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

  // Cinematic focus mode
  const [uiHidden, setUiHidden] = React.useState(false);
  const timerRef = React.useRef<NodeJS.Timeout>();
  const resetTimer = React.useCallback(() => {
    setUiHidden(false);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setUiHidden(true), 5000);
  }, []);

  React.useEffect(() => {
    const onActivity = () => resetTimer();
    document.addEventListener('mousemove', onActivity);
    document.addEventListener('keydown', onActivity);
    document.addEventListener('scroll', onActivity, { passive: true });
    resetTimer();

    return () => {
      document.removeEventListener('mousemove', onActivity);
      document.removeEventListener('keydown', onActivity);
      document.removeEventListener('scroll', onActivity);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [resetTimer]);

  return (
    <>
      <div className={`w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 md:space-y-16 lg:space-y-20 py-6 md:py-10 pb-28 md:pb-12 overflow-x-hidden transition-all duration-1000 ${uiHidden ? 'opacity-0 pointer-events-none' : 'opacity-100 pointer-events-auto'}`}>
        {/* Hero - Mood-Based Wellbeing Sanctuary - always visible */}
        <section className="min-h-[60vh] md:min-h-[70vh] flex flex-col items-center justify-center text-center w-full max-w-4xl mx-auto space-y-6 md:space-y-8 animate-fade-in-up">
          <span className="text-[10px] md:text-xs uppercase tracking-[0.3em] text-primary-glow block">Cultura Lux</span>
          <h1 className="font-display text-4xl xs:text-5xl sm:text-6xl md:text-7xl lg:text-8xl leading-[1.05] text-white drop-shadow-[0_2px_24px_rgba(0,0,0,0.55)] max-w-4xl mx-auto px-4">
            What does your spirit seek<br className="hidden lg:inline" /><span className="text-primary-glow">in this moment?</span>
          </h1>
          <div className="text-lg sm:text-xl md:text-2xl text-white/90 font-light drop-shadow-[0_1px_12px_rgba(0,0,0,0.45)] max-w-2xl mx-auto px-4">
            Seek emotional guidance through literary remedies, curated by cultural experts.
          </div>
          {/* Expert Badge */}
          <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full glass-strong glow-pulse animate-fade-in-up" style={{animationDelay: '200ms'}}>
            <span className="text-xs uppercase tracking-[0.25em] text-primary-glow font-sans">Curation by Cultural Experts</span>
          </div>
          {mood && (
            <p className="text-sm italic text-primary-glow/90 animate-fade-in text-veil px-4 max-w-2xl mx-auto">
              "{mood.whisper}"
            </p>
          )}
        </section>

        {/* Rest of content - hides on focus mode */}
        {!uiHidden && (
          <>
            <section className="max-w-3xl mx-auto w-full animate-fade-in-up" style={{ animationDelay: "120ms" }}>
              <AdvisorPanel variant="compact" redirectToSanctuary />
            </section>

            <section className="space-y-4 max-w-6xl mx-auto w-full text-center animate-fade-in-up" style={{ animationDelay: "400ms" }}>
              <h2 className="font-display text-2xl md:text-3xl lg:text-4xl font-body">Primary Navigation</h2>
              <MoodChipsCarousel />
            </section>

            <section className="max-w-3xl mx-auto w-full animate-fade-in-up" style={{ animationDelay: "560ms" }}>
              <QuestLauncher />
            </section>

            <div className="space-y-10 md:space-y-12 max-w-6xl mx-auto w-full">
              {rows.length > 0 ? (
                rows.map((row, idx) => (
                  <div key={row.title} className="animate-fade-in-up" style={{ animationDelay: `${680 + idx * 120}ms` }}>
                    <ContentRow title={row.title} items={row.items} />
                  </div>
                ))
              ) : currentMood ? (
                <div className="text-center text-sm text-muted-foreground italic max-w-xl mx-auto animate-fade-in">
                  Curated picks for this feeling are on the way. In the meantime, open the Sanctuary or Explore for tuned recommendations.
                </div>
              ) : null}
            </div>
          </>
        )}
      </div>
    </>

      {/* AI Advisor — routes to Sanctuary */}
      <section className="max-w-3xl mx-auto w-full animate-fade-in-up" style={{ animationDelay: "120ms" }}>
        <AdvisorPanel variant="compact" redirectToSanctuary />
      </section>

      {/* Mood Chips - Primary Navigation */}
      <section className="space-y-4 max-w-6xl mx-auto w-full text-center animate-fade-in-up" style={{ animationDelay: "400ms" }}>
        <h2 className="font-display text-2xl md:text-3xl lg:text-4xl font-body">Primary Navigation</h2>
        <MoodChipsCarousel />
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
