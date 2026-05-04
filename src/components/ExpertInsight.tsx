import React from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Info, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  title: string;
  author: string;
  mood?: string;
  className?: string;
}

const TEMPLATES = [
  "Our cultural experts have selected this passage from {author} because it speaks to the universal human need for {emotion}. As you read this, notice the space between the words—this is where your own wisdom resides.",
  "Our experts have brought this passage to you because it serves as an anchor. In times of transition, {author} reminds us that growth is often invisible before it is felt. Sit with these words for three breaths.",
];

export function ExpertInsight({ title, author, mood = "stillness", className }: Props) {
  const [open, setOpen] = React.useState(false);
  const emotion = mood.split(' ')[0]?.toLowerCase() || 'peace';
  const template = TEMPLATES[Math.floor(Math.random() * TEMPLATES.length)]
    .replace(/{author}/g, author)
    .replace('{emotion}', emotion);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className={cn(
            "absolute top-3 right-3 h-7 w-7 rounded-sm glass-strong p-0 shadow-[0_0_12px_hsl(var(--mood-peace)/0.4)] hover:shadow-[0_0_20px_hsl(var(--mood-peace)/0.6)] transition-all z-20 animate-fade-in-up",
            className
          )}
        >
          <Info className="h-3.5 w-3.5 text-primary-glow drop-shadow-sm" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md p-0 sm:p-6 backdrop-blur-xl glass-strong border-[hsl(var(--mood-calm)/0.3)] max-h-[85vh] overflow-y-auto">
        <div className="relative">
          <div className="flex items-center justify-between mb-4 pt-2">
            <h3 className="font-body text-lg font-medium">{title}</h3>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 rounded-full"
              onClick={() => setOpen(false)}
            >
              <X className="h-3.5 w-3.5" />
            </Button>
          </div>
          <div className="space-y-3 text-sm leading-relaxed prose prose-invert max-w-none">
            <p className="italic font-body text-muted-foreground/90">{template}</p>
          </div>
          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-4 h-4 rotate-45 bg-card border-t border-l" aria-hidden />
        </div>
      </DialogContent>
    </Dialog>
  );
}

