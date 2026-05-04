import { useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { buildQuest, Quest, QuestStep } from "@/lib/quests";
import { useMood } from "@/context/MoodContext";
import { Check, Sparkles, ChevronRight, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuestModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function QuestModal({ open, onOpenChange }: QuestModalProps) {
  const { currentMood } = useMood();
  const [quest, setQuest] = useState<Quest>(() => buildQuest(currentMood));
  const [stepIndex, setStepIndex] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [reflectionText, setReflectionText] = useState("");
  const [revealed, setRevealed] = useState(false);
  const [done, setDone] = useState(false);

  const step: QuestStep | undefined = quest.steps[stepIndex];
  const total = quest.steps.length;
  const progress = done ? 100 : ((stepIndex + (revealed ? 1 : 0)) / total) * 100;

  const reset = (mood = currentMood) => {
    setQuest(buildQuest(mood));
    setStepIndex(0);
    setPicked(null);
    setReflectionText("");
    setRevealed(false);
    setDone(false);
  };

  const handleNext = () => {
    if (stepIndex + 1 >= total) {
      setDone(true);
      return;
    }
    setStepIndex((i) => i + 1);
    setPicked(null);
    setReflectionText("");
    setRevealed(false);
  };

  const canReveal = useMemo(() => {
    if (!step) return false;
    if (step.type === "reflection") return reflectionText.trim().length > 2;
    return picked !== null;
  }, [step, picked, reflectionText]);

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        onOpenChange(o);
        if (!o) setTimeout(() => reset(), 300);
      }}
    >
      <DialogContent className="max-w-xl glass-strong border-glass-border">
        <DialogHeader className="space-y-2">
          <span className="text-[10px] uppercase tracking-[0.3em] text-primary-glow flex items-center gap-2">
            <Sparkles className="h-3 w-3" /> Reflection Quest
          </span>
          <DialogTitle className="font-display text-2xl text-gradient">
            {done ? "A small thank you" : quest.title}
          </DialogTitle>
          {!done && (
            <DialogDescription className="text-muted-foreground">
              {stepIndex === 0 ? quest.intro : `Step ${stepIndex + 1} of ${total}`}
            </DialogDescription>
          )}
        </DialogHeader>

        <Progress value={progress} className="h-1 bg-secondary" />

        {!done && step && (
          <div key={stepIndex} className="space-y-5 animate-fade-in-up">
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
              <span className="px-2 py-0.5 rounded-full bg-secondary">
                {labelFor(step.type)}
              </span>
            </div>

            <p className="text-lg md:text-xl font-display leading-snug">
              {step.prompt}
            </p>

            {/* Choice-based steps */}
            {step.options && step.type !== "reflection" && (
              <div className="grid gap-2">
                {step.options.map((opt) => {
                  const isPicked = picked === opt;
                  const isCorrect =
                    revealed && step.answer && opt.toLowerCase() === step.answer.toLowerCase();
                  return (
                    <button
                      key={opt}
                      disabled={revealed}
                      onClick={() => setPicked(opt)}
                      className={cn(
                        "text-left px-4 py-3 rounded-xl border transition-all duration-300",
                        "border-glass-border bg-secondary/40 hover:bg-secondary/70",
                        isPicked && !revealed && "ring-2 ring-primary/60 bg-primary/10",
                        isCorrect && "bg-primary/20 border-primary/60 text-primary-glow",
                        revealed && isPicked && !isCorrect && "opacity-60",
                      )}
                    >
                      <span className="flex items-center justify-between gap-3">
                        <span>{opt}</span>
                        {isCorrect && <Check className="h-4 w-4 text-primary-glow" />}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Reflection text input */}
            {step.type === "reflection" && (
              <Textarea
                value={reflectionText}
                onChange={(e) => setReflectionText(e.target.value)}
                placeholder="Type as little or as much as you'd like…"
                disabled={revealed}
                className="min-h-[100px] bg-secondary/40 border-glass-border resize-none"
              />
            )}

            {/* Reveal */}
            {revealed && (
              <div className="rounded-xl border border-primary/30 bg-primary/5 p-4 animate-fade-in">
                <p className="text-sm text-primary-glow/90 italic leading-relaxed">
                  {step.reveal}
                </p>
              </div>
            )}

            <div className="flex justify-between items-center pt-2">
              <span className="text-xs text-muted-foreground">
                {stepIndex + 1} / {total}
              </span>
              {!revealed ? (
                <Button
                  onClick={() => setRevealed(true)}
                  disabled={!canReveal}
                  variant="default"
                >
                  Reveal
                </Button>
              ) : (
                <Button onClick={handleNext} className="gap-2">
                  {stepIndex + 1 >= total ? "Finish" : "Continue"}
                  <ChevronRight className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        )}

        {done && (
          <div className="space-y-5 text-center py-4 animate-fade-in-up">
            <div className="mx-auto h-14 w-14 rounded-full bg-primary/20 flex items-center justify-center glow-soft">
              <Sparkles className="h-6 w-6 text-primary-glow" />
            </div>
            <p className="text-muted-foreground italic max-w-sm mx-auto">
              You showed up for yourself. That matters more than any answer.
            </p>
            <div className="flex justify-center gap-2 pt-2">
              <Button variant="outline" onClick={() => reset()} className="gap-2">
                <RotateCcw className="h-4 w-4" /> Another quest
              </Button>
              <Button onClick={() => onOpenChange(false)}>Close</Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

function labelFor(t: QuestStep["type"]) {
  switch (t) {
    case "riddle":
      return "Riddle";
    case "proverb":
      return "Proverb";
    case "story":
      return "Story choice";
    case "reflection":
      return "Reflection";
  }
}
