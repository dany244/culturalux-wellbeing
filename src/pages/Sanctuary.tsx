import { useMood } from "@/context/MoodContext";
import { getMood } from "@/lib/moods";
import { AdvisorPanel } from "@/components/AdvisorPanel";

const Sanctuary = () => {
  const { currentMood } = useMood();
  const mood = getMood(currentMood);

  return (
    <div className="container max-w-3xl space-y-12 py-8">
      <header className="space-y-4 animate-fade-in-up">
        <span className="text-xs uppercase tracking-[0.3em] text-primary-glow">
          Sanctuary
        </span>
        <h1 className="font-display text-4xl md:text-6xl text-gradient leading-tight">
          A quiet place to listen to yourself.
        </h1>
        {mood && (
          <p className="text-muted-foreground italic">"{mood.whisper}"</p>
        )}
      </header>

      <AdvisorPanel variant="full" />
    </div>
  );
};

export default Sanctuary;
