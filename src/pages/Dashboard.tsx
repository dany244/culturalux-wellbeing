import { useMemo } from "react";
import { useMood, MoodEntry } from "@/context/MoodContext";
import { MOODS, getMood, MoodId } from "@/lib/moods";
import { computeInsights } from "@/lib/insights";
import { Sparkles, Clock, TrendingUp, Calendar } from "lucide-react";

const TZ = Intl.DateTimeFormat().resolvedOptions().timeZone;

function formatDateTime(ts: number) {
  return new Date(ts).toLocaleString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: TZ,
  });
}

function formatRelative(ts: number) {
  const diff = Date.now() - ts;
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d}d ago`;
  return new Date(ts).toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

const Dashboard = () => {
  const { history } = useMood();

  const counts = useMemo(() => {
    const c: Record<string, number> = {};
    history.forEach((h) => {
      c[h.mood] = (c[h.mood] ?? 0) + 1;
    });
    return c;
  }, [history]);

  const total = history.length;
  const max = Math.max(1, ...Object.values(counts));

  const topMoodId = useMemo<MoodId | null>(() => {
    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    return (sorted[0]?.[0] as MoodId) ?? null;
  }, [counts]);
  const topMood = topMoodId ? getMood(topMoodId) : null;

  const insights = useMemo(() => computeInsights(history), [history]);
  const recent = useMemo(() => history.slice(0, 5), [history]);
  const timeline = useMemo(() => history.slice(0, 30), [history]);

  if (total === 0) {
    return (
      <div className="container max-w-3xl py-12 space-y-6 text-center">
        <span className="text-xs uppercase tracking-[0.3em] text-primary-glow">
          Dashboard
        </span>
        <h1 className="font-display text-4xl md:text-5xl text-gradient">
          Your inner weather.
        </h1>
        <p className="text-muted-foreground">
          Log your first reflection in Sanctuary — patterns will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="container max-w-6xl space-y-10 py-8">
      {/* Header */}
      <header className="space-y-3 animate-fade-in-up">
        <span className="text-xs uppercase tracking-[0.3em] text-primary-glow">
          Dashboard
        </span>
        <h1 className="font-display text-4xl md:text-5xl text-gradient leading-tight">
          Your inner weather.
        </h1>
        <p className="text-muted-foreground text-sm">
          {total} reflection{total === 1 ? "" : "s"} · {TZ.replace("_", " ")}
        </p>
      </header>

      {/* Top stats */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-fade-in-up">
        <StatCard
          icon={<TrendingUp className="h-4 w-4" />}
          label="Most common"
          value={topMood?.label ?? "—"}
          accent={topMood?.accent}
          sub={`${counts[topMoodId ?? ""] ?? 0} of ${total}`}
        />
        <StatCard
          icon={<Calendar className="h-4 w-4" />}
          label="This week"
          value={`${
            history.filter((h) => Date.now() - h.timestamp < 7 * 86400000).length
          }`}
          sub="reflections"
        />
        <StatCard
          icon={<Clock className="h-4 w-4" />}
          label="Last entry"
          value={formatRelative(history[0].timestamp)}
          sub={getMood(history[0].mood)?.label}
        />
      </section>

      {/* Insights */}
      {insights.length > 0 && (
        <section className="animate-fade-in-up">
          <div className="flex items-center gap-2 mb-3 text-xs uppercase tracking-[0.3em] text-primary-glow">
            <Sparkles className="h-3 w-3" /> Insights
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {insights.map((ins) => (
              <article
                key={ins.id}
                className="glass rounded-2xl p-5 flex gap-3 items-start"
              >
                <span
                  className="mt-1 h-2 w-2 rounded-full bg-primary-glow shrink-0"
                  style={{ boxShadow: "0 0 12px hsl(var(--primary) / 0.7)" }}
                />
                <p className="text-sm md:text-base leading-relaxed">{ins.text}</p>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* Two-column: Frequency + Recent */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Frequency */}
        <section className="lg:col-span-2 glass-strong rounded-3xl p-6 space-y-5 animate-fade-in-up">
          <div className="flex items-baseline justify-between">
            <h2 className="font-display text-xl">Mood frequency</h2>
            <span className="text-xs text-muted-foreground">all time</span>
          </div>
          <div className="space-y-3">
            {MOODS.map((m) => {
              const count = counts[m.id] ?? 0;
              const pct = (count / max) * 100;
              return (
                <div key={m.id} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-foreground/90">{m.label}</span>
                    <span className="text-muted-foreground tabular-nums">{count}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-secondary/60 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${pct}%`,
                        background: `linear-gradient(90deg, hsl(${m.accent}), hsl(${m.accent} / 0.5))`,
                        boxShadow: `0 0 12px hsl(${m.accent} / 0.4)`,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Recent */}
        <section className="lg:col-span-3 space-y-3 animate-fade-in-up">
          <div className="flex items-baseline justify-between">
            <h2 className="font-display text-xl">Recent entries</h2>
            <span className="text-xs text-muted-foreground">last 5</span>
          </div>
          <div className="space-y-2">
            {recent.map((entry) => (
              <RecentRow key={entry.id} entry={entry} />
            ))}
          </div>
        </section>
      </div>

      {/* Timeline */}
      <section className="space-y-4 animate-fade-in-up">
        <div className="flex items-baseline justify-between">
          <h2 className="font-display text-xl">Mood timeline</h2>
          <span className="text-xs text-muted-foreground">
            {Math.min(timeline.length, 30)} most recent
          </span>
        </div>
        <ol className="relative border-l border-border/60 pl-6 space-y-3">
          {timeline.map((entry) => {
            const m = getMood(entry.mood);
            if (!m) return null;
            return (
              <li key={entry.id} className="relative">
                <span
                  className="absolute -left-[31px] top-3 h-2.5 w-2.5 rounded-full"
                  style={{
                    background: `hsl(${m.accent})`,
                    boxShadow: `0 0 12px hsl(${m.accent})`,
                  }}
                />
                <div className="glass rounded-2xl px-4 py-3 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="font-display text-base shrink-0">{m.label}</span>
                    {entry.advisor && (
                      <span className="text-[10px] uppercase tracking-[0.18em] text-primary-glow/70 shrink-0">
                        · {entry.advisor}
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground tabular-nums shrink-0">
                    {formatDateTime(entry.timestamp)}
                  </span>
                </div>
              </li>
            );
          })}
        </ol>
      </section>
    </div>
  );
};

function StatCard({
  icon,
  label,
  value,
  sub,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub?: string;
  accent?: string;
}) {
  return (
    <article
      className="glass-strong rounded-2xl p-5 space-y-2 relative overflow-hidden"
    >
      {accent && (
        <span
          className="absolute -top-12 -right-12 h-32 w-32 rounded-full opacity-30 blur-2xl"
          style={{ background: `hsl(${accent})` }}
        />
      )}
      <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-primary-glow">
        {icon}
        {label}
      </div>
      <div className="font-display text-2xl md:text-3xl">{value}</div>
      {sub && <div className="text-xs text-muted-foreground">{sub}</div>}
    </article>
  );
}

function RecentRow({ entry }: { entry: MoodEntry }) {
  const m = getMood(entry.mood);
  if (!m) return null;
  return (
    <article className="glass rounded-2xl p-4 space-y-1.5">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <span
            className="h-2 w-2 rounded-full shrink-0"
            style={{
              background: `hsl(${m.accent})`,
              boxShadow: `0 0 10px hsl(${m.accent})`,
            }}
          />
          <span className="font-display text-base">{m.label}</span>
          {entry.advisor && (
            <span className="text-[10px] uppercase tracking-[0.18em] text-primary-glow/70">
              · {entry.advisor}
            </span>
          )}
        </div>
        <span className="text-xs text-muted-foreground tabular-nums shrink-0">
          {formatRelative(entry.timestamp)}
        </span>
      </div>
      {entry.note && (
        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
          {entry.note}
        </p>
      )}
    </article>
  );
}

export default Dashboard;
