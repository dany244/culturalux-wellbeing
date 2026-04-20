import { Outlet, NavLink, useLocation } from "react-router-dom";
import { CinematicBackground } from "./CinematicBackground";
import { Footer } from "./Footer";
import { Home, Sparkles, Compass, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMood } from "@/context/MoodContext";
import { getMood } from "@/lib/moods";

const NAV = [
  { to: "/", label: "Home", icon: Home },
  { to: "/sanctuary", label: "Sanctuary", icon: Sparkles },
  { to: "/explore", label: "Explore", icon: Compass },
  { to: "/dashboard", label: "Dashboard", icon: BarChart3 },
];

export default function Layout() {
  const location = useLocation();
  const { currentMood } = useMood();
  const mood = getMood(currentMood);
  // Mood accent (HSL string) drives the ambient pattern hue
  const patternHue = mood?.accent ?? "var(--primary)";
  return (
    <div className="relative min-h-screen flex flex-col">
      <CinematicBackground />

      {/* Ambient cultural pattern veil — hue follows current mood */}
      <div
        aria-hidden
        style={{ ["--pattern-hue" as string]: patternHue }}
        className="pointer-events-none fixed inset-0 -z-[5] pattern-persian opacity-[0.4] mix-blend-overlay transition-opacity duration-[1600ms]"
      />

      {/* Top brand bar */}
      <header className="fixed top-0 inset-x-0 z-40">
        <div className="container flex items-center justify-between py-5">
          <NavLink to="/" className="flex items-center gap-2 group">
            <span className="h-2 w-2 rounded-full bg-primary glow-soft animate-glow-pulse" />
            <span className="font-display text-xl tracking-wide text-gradient">Culturalux</span>
          </NavLink>
          <nav className="hidden md:flex items-center gap-1 glass rounded-full px-2 py-1.5">
            {NAV.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === "/"}
                className={({ isActive }) =>
                  cn(
                    "px-4 py-1.5 text-sm rounded-full transition-all duration-500",
                    isActive
                      ? "bg-primary/20 text-primary-glow shadow-[0_0_20px_-5px_hsl(var(--primary)/0.5)]"
                      : "text-muted-foreground hover:text-foreground"
                  )
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      {/* Page content */}
      <main key={location.pathname} className="relative z-10 pt-24 pb-12 flex-1 animate-fade-in">
        <Outlet />
      </main>

      <Footer />

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-4 inset-x-4 z-40 glass-strong rounded-full px-2 py-2 flex justify-around">
        {NAV.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            className={({ isActive }) =>
              cn(
                "flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-full text-[10px] transition-colors",
                isActive ? "text-primary-glow" : "text-muted-foreground"
              )
            }
          >
            <Icon className="h-5 w-5" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
