import { Link } from "react-router-dom";

/**
 * Quiet library-style footer — minimal, restrained, almost a whisper.
 */
export function Footer() {
  return (
    <footer className="relative z-10 mt-32 pb-8 md:pb-10 pointer-events-auto">
      <div className="container">
        <div className="pattern-divider mb-8" />
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 text-xs">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-primary-glow glow-soft" />
              <span className="font-display text-base tracking-wide text-gradient">
                Culturalux
              </span>
            </div>
            <p className="text-muted-foreground/80 max-w-sm leading-relaxed italic">
              A quiet library for the inner life — words, stories and small reflections.
            </p>
          </div>

          <nav className="flex items-center gap-6 text-muted-foreground/70 uppercase tracking-[0.25em] text-[10px]">
            <Link to="/" className="hover:text-primary-glow transition-colors">Home</Link>
            <Link to="/sanctuary" className="hover:text-primary-glow transition-colors">Sanctuary</Link>
            <Link to="/explore" className="hover:text-primary-glow transition-colors">Explore</Link>
            <Link to="/dashboard" className="hover:text-primary-glow transition-colors">Dashboard</Link>
          </nav>
        </div>

        <p className="mt-6 text-[10px] uppercase tracking-[0.3em] text-muted-foreground/50 text-center md:text-left">
          © {new Date().getFullYear()} Culturalux · Listen softly
        </p>
      </div>
    </footer>
  );
}
