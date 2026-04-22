import { useEffect, useState, useCallback } from "react";
import { Bug, X, RefreshCw, Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface OverflowItem {
  selector: string;
  tag: string;
  width: number;
  viewportWidth: number;
  overflowBy: number;
  text: string;
  rect: { top: number; left: number; width: number; height: number };
}

const HIGHLIGHT_ATTR = "data-dev-overflow-highlight";

function describe(el: Element): string {
  const tag = el.tagName.toLowerCase();
  const id = (el as HTMLElement).id ? `#${(el as HTMLElement).id}` : "";
  const cls = (el as HTMLElement).className && typeof (el as HTMLElement).className === "string"
    ? "." + ((el as HTMLElement).className as string).trim().split(/\s+/).slice(0, 2).join(".")
    : "";
  return `${tag}${id}${cls}`;
}

export function DevDiagnostics() {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<OverflowItem[]>([]);
  const [highlight, setHighlight] = useState(true);

  const scan = useCallback(() => {
    const vw = document.documentElement.clientWidth;
    const found: OverflowItem[] = [];
    const all = document.body.querySelectorAll<HTMLElement>("*");
    // Clear previous highlights
    document.querySelectorAll<HTMLElement>(`[${HIGHLIGHT_ATTR}]`).forEach((el) => {
      el.style.outline = "";
      el.style.outlineOffset = "";
      el.removeAttribute(HIGHLIGHT_ATTR);
    });

    all.forEach((el) => {
      const rect = el.getBoundingClientRect();
      // Skip the diagnostics UI itself
      if (el.closest("[data-dev-diagnostics]")) return;
      // Element extends beyond viewport on the right or starts before the left
      const right = rect.left + rect.width;
      if (right > vw + 1 || rect.left < -1) {
        const overflowBy = Math.max(0, Math.round(right - vw)) + Math.max(0, Math.round(-rect.left));
        if (rect.width < 4 || rect.height < 4) return;
        found.push({
          selector: describe(el),
          tag: el.tagName.toLowerCase(),
          width: Math.round(rect.width),
          viewportWidth: vw,
          overflowBy,
          text: (el.textContent || "").trim().slice(0, 60),
          rect: { top: rect.top, left: rect.left, width: rect.width, height: rect.height },
        });
        if (highlight) {
          el.setAttribute(HIGHLIGHT_ATTR, "true");
          el.style.outline = "2px dashed hsl(var(--destructive))";
          el.style.outlineOffset = "-2px";
        }
      }
    });

    // Sort by overflow size desc, keep top 30
    found.sort((a, b) => b.overflowBy - a.overflowBy);
    setItems(found.slice(0, 30));
  }, [highlight]);

  useEffect(() => {
    if (!open) {
      // Cleanup highlights when closed
      document.querySelectorAll<HTMLElement>(`[${HIGHLIGHT_ATTR}]`).forEach((el) => {
        el.style.outline = "";
        el.style.outlineOffset = "";
        el.removeAttribute(HIGHLIGHT_ATTR);
      });
      return;
    }
    scan();
    const onResize = () => scan();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [open, scan]);

  // Keyboard shortcut: Ctrl/Cmd + Shift + D
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === "d") {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <div data-dev-diagnostics>
      {/* Floating toggle */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Toggle developer diagnostics"
        className="fixed bottom-24 md:bottom-6 right-4 z-[60] h-11 w-11 rounded-full glass-strong flex items-center justify-center text-primary-glow hover:scale-105 transition-transform shadow-[0_4px_20px_-4px_hsl(var(--primary)/0.5)]"
        title="Diagnostics (Ctrl/Cmd+Shift+D)"
      >
        <Bug className="h-5 w-5" />
      </button>

      {open && (
        <div className="fixed top-4 right-4 left-4 md:left-auto md:w-[380px] z-[60] glass-strong rounded-2xl border border-border/40 p-4 max-h-[80vh] flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Bug className="h-4 w-4 text-primary-glow" />
              <h3 className="font-display text-sm">Dev Diagnostics</h3>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setHighlight((v) => !v)}
                className="h-8 w-8 rounded-full hover:bg-muted/30 flex items-center justify-center"
                title={highlight ? "Hide highlights" : "Show highlights"}
              >
                {highlight ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              </button>
              <button
                onClick={scan}
                className="h-8 w-8 rounded-full hover:bg-muted/30 flex items-center justify-center"
                title="Rescan"
              >
                <RefreshCw className="h-4 w-4" />
              </button>
              <button
                onClick={() => setOpen(false)}
                className="h-8 w-8 rounded-full hover:bg-muted/30 flex items-center justify-center"
                title="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="text-[11px] text-muted-foreground mb-2">
            Viewport: {document.documentElement.clientWidth}px ·{" "}
            <span className={cn(items.length === 0 ? "text-primary-glow" : "text-destructive")}>
              {items.length} overflow{items.length === 1 ? "" : "s"}
            </span>
          </div>

          <div className="overflow-y-auto flex-1 -mr-1 pr-1 space-y-1.5">
            {items.length === 0 && (
              <p className="text-xs text-muted-foreground italic">No overflow detected. ✨</p>
            )}
            {items.map((item, i) => (
              <button
                key={i}
                onClick={() => {
                  window.scrollTo({
                    top: window.scrollY + item.rect.top - 80,
                    behavior: "smooth",
                  });
                }}
                className="w-full text-left rounded-lg border border-border/30 bg-background/30 hover:bg-background/50 p-2 text-xs transition-colors"
              >
                <div className="font-mono text-primary-glow truncate">{item.selector}</div>
                <div className="flex justify-between text-[10px] text-muted-foreground mt-0.5">
                  <span>w: {item.width}px / vp: {item.viewportWidth}px</span>
                  <span className="text-destructive">+{item.overflowBy}px</span>
                </div>
                {item.text && (
                  <div className="text-[10px] text-muted-foreground/70 truncate mt-0.5 italic">
                    "{item.text}"
                  </div>
                )}
              </button>
            ))}
          </div>

          <p className="text-[10px] text-muted-foreground/60 mt-2 pt-2 border-t border-border/30">
            Shortcut: Ctrl/Cmd + Shift + D
          </p>
        </div>
      )}
    </div>
  );
}
