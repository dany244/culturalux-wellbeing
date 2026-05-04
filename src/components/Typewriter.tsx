import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface TypewriterProps {
  text: string;
  speed?: number; // ms per character
  startDelay?: number;
  className?: string;
  showCaret?: boolean;
  onDone?: () => void;
}

export function Typewriter({
  text,
  speed = 32,
  startDelay = 200,
  className,
  showCaret = true,
  onDone,
}: TypewriterProps) {
  const [out, setOut] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    setOut("");
    setDone(false);
    let i = 0;
    let cancel = false;
    const start = window.setTimeout(function tick() {
      if (cancel) return;
      if (i >= text.length) {
        setDone(true);
        onDone?.();
        return;
      }
      i += 1;
      setOut(text.slice(0, i));
      window.setTimeout(tick, speed);
    }, startDelay);
    return () => {
      cancel = true;
      clearTimeout(start);
    };
  }, [text, speed, startDelay, onDone]);

  return (
    <span className={cn("whitespace-pre-wrap", className)}>
      {out}
      {showCaret && !done && (
        <span className="inline-block w-[2px] h-[1em] align-[-0.15em] ml-0.5 bg-primary-glow animate-caret-blink" />
      )}
    </span>
  );
}
