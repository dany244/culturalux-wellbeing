import { Outlet, NavLink, useLocation, useNavigate } from "react-router-dom";
import { CinematicBackground } from "./CinematicBackground";
import { Footer } from "./Footer";
import { DevDiagnostics } from "./DevDiagnostics";
import { Home, Sparkles, Compass, BarChart3, ShoppingBag, Crown, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMood } from "@/context/MoodContext";
import { getMood } from "@/lib/moods";
import culturaLuxLogo from "@/assets/cultura-lux-logo.png";

const NAV = [
  { to: "/", label: "Home", shortLabel: "Home", icon: Home },
  { to: "/sanctuary", label: "Sanctuary", shortLabel: "Sanct.", icon: Sparkles },
  { to: "/explore", label: "Explore", shortLabel: "Explore", icon: Compass },
  { to: "/shop", label: "Shop", shortLabel: "Shop", icon: ShoppingBag },
  { to: "/membership", label: "Membership", shortLabel: "Member", icon: Crown },
  { to: "/dashboard", label: "Dashboard", shortLabel: "Stats", icon: BarChart3 },
];

export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentMood } = useMood();
  const mood = getMood(currentMood);
  const showBack = location.pathname !== "/";
  const handleBack = () => {
    if (window.history.length > 1) navigate(-1);
    else navigate("/");
  };
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
          <div className="flex items-center gap-3">
            <NavLink to="/" className="flex items-center gap-2 group">
              <img
                src={culturaLuxLogo}
                alt="Cultura Lux"
                className="h-9 w-9 object-contain drop-shadow-[0_0_12px_hsl(var(--primary)/0.4)]"
              />
              <span className="font-display text-xl tracking-wide text-gradient">Cultura Lux</span>
            </NavLink>
            {showBack && (
              <button
                type="button"
                onClick={handleBack}
                aria-label="Go back"
                className="glass rounded-full px-3 py-1.5 flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Back</span>
              </button>
            )}
          </div>
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
      <main key={location.pathname} className="relative z-10 pt-24 pb-12 flex-1 animate-fade-in w-full overflow-x-hidden">
        <Outlet />
      </main>

      <Footer />

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-3 inset-x-2 z-40 glass-strong rounded-full px-1 py-1.5 flex justify-between gap-0.5">
        {NAV.map(({ to, shortLabel, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            className={({ isActive }) =>
              cn(
                "flex flex-1 min-w-0 flex-col items-center gap-0.5 px-1 py-1 rounded-full text-[9px] leading-none transition-colors",
                isActive ? "text-primary-glow" : "text-muted-foreground"
              )
            }
          >
            <Icon className="h-4 w-4 shrink-0" />
            <span className="truncate max-w-full">{shortLabel}</span>
          </NavLink>
        ))}
      </nav>

      {import.meta.env.DEV && <DevDiagnostics />}
    </div>
  );
}
