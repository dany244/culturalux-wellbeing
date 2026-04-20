import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { useAuth } from "@/context/AuthContext";
import { toast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

const emailSchema = z
  .string()
  .trim()
  .email("Enter a valid email")
  .max(255, "Email is too long");
const passwordSchema = z
  .string()
  .min(8, "At least 8 characters")
  .max(72, "Too long");
const nameSchema = z
  .string()
  .trim()
  .min(1, "Tell us your first name")
  .max(60, "Too long");

const Auth = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (user) navigate("/", { replace: true });
  }, [user, navigate]);

  if (loading) {
    return (
      <div className="container max-w-md py-24 text-center text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin mx-auto" />
      </div>
    );
  }
  if (user) return <Navigate to="/" replace />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      const e1 = emailSchema.safeParse(email);
      const p1 = passwordSchema.safeParse(password);
      if (!e1.success) throw new Error(e1.error.issues[0].message);
      if (!p1.success) throw new Error(p1.error.issues[0].message);

      if (mode === "signup") {
        const n1 = nameSchema.safeParse(firstName);
        if (!n1.success) throw new Error(n1.error.issues[0].message);
        const { error } = await supabase.auth.signUp({
          email: e1.data,
          password: p1.data,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
            data: { first_name: n1.data, full_name: n1.data },
          },
        });
        if (error) throw error;
        toast({ title: "Welcome to Culturalux", description: "You're signed in." });
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: e1.data,
          password: p1.data,
        });
        if (error) throw error;
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Something went wrong";
      toast({ title: "Couldn't continue", description: msg });
    } finally {
      setBusy(false);
    }
  };

  const handleGoogle = async () => {
    setBusy(true);
    try {
      const result = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: window.location.origin,
      });
      if (result.error) throw result.error;
      // if redirected:true, browser is leaving
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Google sign-in failed";
      toast({ title: "Couldn't sign in with Google", description: msg });
      setBusy(false);
    }
  };

  return (
    <div className="container max-w-md py-12 space-y-8">
      <header className="space-y-3 text-center animate-fade-in-up">
        <span className="text-xs uppercase tracking-[0.3em] text-primary-glow">
          Culturalux
        </span>
        <h1 className="font-display text-4xl text-gradient leading-tight">
          {mode === "signup" ? "Begin your sanctuary." : "Welcome back."}
        </h1>
        <p className="text-sm text-muted-foreground">
          {mode === "signup"
            ? "Your reflections will be saved across devices."
            : "Pick up where your inner weather left off."}
        </p>
      </header>

      <div className="glass-strong rounded-3xl p-6 space-y-5 animate-fade-in-up">
        <button
          type="button"
          onClick={handleGoogle}
          disabled={busy}
          className="w-full h-11 rounded-full bg-foreground text-background font-medium text-sm flex items-center justify-center gap-2 hover:opacity-90 transition disabled:opacity-50"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M21.35 11.1H12v3.2h5.35c-.23 1.4-1.7 4.1-5.35 4.1-3.22 0-5.85-2.66-5.85-5.95s2.63-5.95 5.85-5.95c1.83 0 3.06.78 3.76 1.45l2.57-2.47C16.78 4.1 14.6 3.2 12 3.2 6.92 3.2 2.85 7.27 2.85 12.45S6.92 21.7 12 21.7c6.92 0 9.5-4.85 9.5-9.05 0-.6-.06-1.05-.15-1.55z"
            />
          </svg>
          Continue with Google
        </button>

        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex-1 h-px bg-border/60" />
          or
          <span className="flex-1 h-px bg-border/60" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          {mode === "signup" && (
            <input
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="First name"
              autoComplete="given-name"
              className="w-full h-11 rounded-full bg-input/40 border border-border/60 px-4 text-sm outline-none focus:border-primary/60"
              maxLength={60}
            />
          )}
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
            className="w-full h-11 rounded-full bg-input/40 border border-border/60 px-4 text-sm outline-none focus:border-primary/60"
            maxLength={255}
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            autoComplete={mode === "signup" ? "new-password" : "current-password"}
            className="w-full h-11 rounded-full bg-input/40 border border-border/60 px-4 text-sm outline-none focus:border-primary/60"
            maxLength={72}
          />
          <button
            type="submit"
            disabled={busy}
            className="w-full h-11 rounded-full bg-primary text-primary-foreground font-medium text-sm flex items-center justify-center gap-2 disabled:opacity-50 hover:shadow-[0_0_30px_-5px_hsl(var(--primary)/0.7)] transition-all"
          >
            {busy && <Loader2 className="h-4 w-4 animate-spin" />}
            {mode === "signup" ? "Create account" : "Sign in"}
          </button>
        </form>

        <p className="text-center text-xs text-muted-foreground">
          {mode === "signup" ? "Already have an account?" : "New here?"}{" "}
          <button
            type="button"
            onClick={() => setMode(mode === "signup" ? "signin" : "signup")}
            className="text-primary-glow hover:text-primary transition-colors"
          >
            {mode === "signup" ? "Sign in" : "Create one"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Auth;
