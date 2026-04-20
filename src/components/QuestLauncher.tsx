import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { QuestModal } from "./QuestModal";
import { cn } from "@/lib/utils";

interface QuestLauncherProps {
  className?: string;
  variant?: "card" | "inline";
}

export function QuestLauncher({ className, variant = "card" }: QuestLauncherProps) {
  const [open, setOpen] = useState(false);

  if (variant === "inline") {
    return (
      <>
        <Button
          variant="outline"
          onClick={() => setOpen(true)}
          className={cn("gap-2", className)}
        >
          <Sparkles className="h-4 w-4" />
          Begin a reflection quest
        </Button>
        <QuestModal open={open} onOpenChange={setOpen} />
      </>
    );
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={cn(
          "group w-full text-left rounded-2xl glass border border-glass-border p-5 md:p-6",
          "hover:border-primary/40 transition-all duration-500",
          "hover:shadow-[0_0_40px_-10px_hsl(var(--primary)/0.4)]",
          className,
        )}
      >
        <div className="flex items-start gap-4">
          <div className="h-10 w-10 rounded-xl bg-primary/15 flex items-center justify-center shrink-0 group-hover:bg-primary/25 transition-colors">
            <Sparkles className="h-5 w-5 text-primary-glow" />
          </div>
          <div className="space-y-1 flex-1">
            <div className="flex items-center justify-between gap-3">
              <h3 className="font-display text-lg md:text-xl">Reflection Quest</h3>
              <span className="text-[10px] uppercase tracking-[0.25em] text-primary-glow opacity-0 group-hover:opacity-100 transition-opacity">
                Begin →
              </span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Four gentle prompts — a riddle, a proverb, a story, and a question — to help
              you listen inward.
            </p>
          </div>
        </div>
      </button>
      <QuestModal open={open} onOpenChange={setOpen} />
    </>
  );
}
