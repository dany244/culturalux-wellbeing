import { useMood } from "@/context/MoodContext";
import { getMood } from "@/lib/moods";
import { useState } from "react";

const PROMPTS = [
  "What is asking for your attention right now?",
  "Where in your body do you feel this?",
  "If this feeling could speak, what would it say?",
  "What would softness look like, just for tonight?",
  "Name one thing you do not have to solve today.",
];

const Sanctuary = () => {
  const { currentMood } = useMood();
  const mood = getMood(currentMood);
  const [reflection, setReflection] = useState("");
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="container max-w-3xl space-y-12 py-8">
      <header className="space-y-4 animate-fade-in-up">
        <span className="text-xs uppercase tracking-[0.3em] text-primary-glow">Sanctuary</span>
        <h1 className="font-display text-4xl md:text-6xl text-gradient leading-tight">
          A quiet place to listen to yourself.
        </h1>
        {mood && (
          <p className="text-muted-foreground italic">"{mood.whisper}"</p>
        )}
      </header>

      <section className="space-y-6">
        {PROMPTS.map((p, i) => (
          <div
            key={p}
            className="glass rounded-3xl p-6 md:p-8 animate-fade-in-up"
            style={{ animationDelay: `${i * 120}ms` }}
          >
            <p className="font-display text-xl md:text-2xl leading-relaxed">{p}</p>
          </div>
        ))}
      </section>

      <section className="glass-strong rounded-3xl p-6 md:p-8 space-y-4 animate-fade-in-up">
        <label className="text-xs uppercase tracking-[0.3em] text-primary-glow">Your reflection</label>
        <textarea
          value={reflection}
          onChange={(e) => { setReflection(e.target.value); setSubmitted(false); }}
          rows={6}
          placeholder="Write freely. Nothing here is judged."
          className="w-full bg-transparent outline-none resize-none text-lg leading-relaxed placeholder:text-muted-foreground/60"
        />
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">{reflection.length} characters</span>
          <button
            onClick={() => setSubmitted(true)}
            disabled={!reflection.trim()}
            className="px-5 py-2 rounded-full bg-primary text-primary-foreground text-sm disabled:opacity-30 hover:shadow-[0_0_30px_-5px_hsl(var(--primary)/0.7)] transition-all"
          >
            {submitted ? "Held" : "Hold this"}
          </button>
        </div>
      </section>
    </div>
  );
};

export default Sanctuary;
