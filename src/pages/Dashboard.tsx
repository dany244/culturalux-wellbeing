import { useMood } from "@/context/MoodContext";
import { MOODS, getMood } from "@/lib/moods";
import { useMemo } from "react";

const TZ = Intl.DateTimeFormat().resolvedOptions().timeZone;

function formatTimestamp(ts: number) {
  const d = new Date(ts);
  return d.toLocaleString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: TZ,
    timeZoneName: "short",
  });
}

const Dashboard = () => {
  const { history } = useMood();

  const counts = useMemo(() => {
    const c: Record<string, number> = {};
    history.forEach((h) => { c[h.mood] = (c[h.mood] ?? 0) + 1; });
    return c;
  }, [history]);

  const max = Math.max(1, ...Object.values(counts));

  return (
    <div className="container space-y-12 py-8">
      <header className="space-y-3 animate-fade-in-up">
        <span className="text-xs uppercase tracking-[0.3em] text-primary-glow">Dashboard</span>
        <h1 className="font-display text-4xl md:text-6xl text-gradient">Your inner weather.</h1>
        <p className="text-muted-foreground">A gentle record. No streaks. No judgments.</p>
      </header>

      {/* Distribution */}
      <section className="glass-strong rounded-3xl p-6 md:p-8 space-y-5 animate-fade-in-up">
        <h2 className="font-display text-2xl">Mood distribution</h2>
        <div className="space-y-3">
          {MOODS.map((m) => {
            const count = counts[m.id] ?? 0;
            const pct = (count / max) * 100;
            return (
              <div key={m.id} className="grid grid-cols-[120px_1fr_40px] items-center gap-4">
                <span className="text-sm">{m.label}</span>
                <div className="h-2 rounded-full bg-secondary/60 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${pct}%`,
                      background: `linear-gradient(90deg, hsl(${m.accent}), hsl(${m.accent} / 0.6))`,
                      boxShadow: `0 0 16px hsl(${m.accent} / 0.5)`,
                    }}
                  />
                </div>
                <span className="text-sm text-muted-foreground tabular-nums text-right">{count}</span>
              </div>
            );
          })}
        </div>
      </section>

      {/* History */}
      <section className="space-y-4 animate-fade-in-up">
        <h2 className="font-display text-2xl">Recent reflections</h2>
        {history.length === 0 ? (
          <div className="glass rounded-3xl p-8 text-center text-muted-foreground">
            No entries yet. Log your first feeling on the home page.
          </div>
        ) : (
          <ol className="relative border-l border-border/60 pl-6 space-y-4">
            {history.map((entry) => {
              const m = getMood(entry.mood);
              if (!m) return null;
              return (
                <li key={entry.id} className="relative">
                  <span
                    className="absolute -left-[31px] top-3 h-2.5 w-2.5 rounded-full"
                    style={{ background: `hsl(${m.accent})`, boxShadow: `0 0 12px hsl(${m.accent})` }}
                  />
                  <div className="glass rounded-2xl p-5 space-y-1">
                    <div className="flex items-center justify-between gap-4">
                      <span className="font-display text-lg">{m.label}</span>
                      <span className="text-xs text-muted-foreground">{formatTimestamp(entry.timestamp)}</span>
                    </div>
                    {entry.note && <p className="text-sm text-muted-foreground leading-relaxed">{entry.note}</p>}
                  </div>
                </li>
              );
            })}
          </ol>
        )}
      </section>
    </div>
  );
};

export default Dashboard;
