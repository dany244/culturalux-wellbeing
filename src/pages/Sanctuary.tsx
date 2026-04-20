import { useMood } from "@/context/MoodContext";
import { getMood } from "@/lib/moods";
import { AdvisorPanel } from "@/components/AdvisorPanel";
import { QuestLauncher } from "@/components/QuestLauncher";
import { Particles } from "@/components/Particles";
import { Typewriter } from "@/components/Typewriter";

const Sanctuary = () => {
  const { currentMood } = useMood();
  const mood = getMood(currentMood);

  return (
    <div className="relative">
      {/* Soft particle field — sanctuary-only ambience */}
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-[4]">
        <Particles count={50} />
      </div>

      <div className="container max-w-3xl space-y-12 py-8">
        <header className="space-y-4 animate-fade-in-up">
          <span className="text-xs uppercase tracking-[0.3em] text-primary-glow">
            Sanctuary
          </span>
          <h1 className="font-display text-4xl md:text-6xl text-gradient leading-tight text-veil">
            <Typewriter
              text="A quiet place to listen to yourself."
              speed={42}
              startDelay={300}
            />
          </h1>
          {mood && (
            <p className="text-muted-foreground italic text-veil animate-fade-in">
              "{mood.whisper}"
            </p>
          )}
        </header>

        <AdvisorPanel variant="full" />

        <QuestLauncher />
      </div>
    </div>
  );
};

export default Sanctuary;
