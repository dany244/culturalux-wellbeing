import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Loader2 } from "lucide-react";
import { useMood } from "@/context/MoodContext";
import { AdvisorId, getAdvisor } from "@/lib/advisors";
import lampIcon from "@/assets/icon-lamp.png";
import { AdvisorToggle } from "./AdvisorToggle";
import { AdvisorResponseCards } from "./AdvisorResponseCards";
import {
  AdvisorResponse,
  BookCard,
  callAdvisor,
  fetchBook,
} from "@/lib/advisorClient";
import { getTimeOfDay } from "@/lib/greeting";
import { toast } from "@/hooks/use-toast";
import { MoodId } from "@/lib/moods";

const STORAGE_ADVISOR = "culturalux:advisor";
const STORAGE_PENDING = "culturalux:pendingPrompt";

interface Props {
  variant?: "compact" | "full";
  /** When true, instead of running on this page, push to /sanctuary with the prompt. */
  redirectToSanctuary?: boolean;
}

export function AdvisorPanel({
  variant = "full",
  redirectToSanctuary = false,
}: Props) {
  const { currentMood, setMood, userName, saveInteraction } = useMood();
  const navigate = useNavigate();
  const [advisor, setAdvisor] = useState<AdvisorId>(() => {
    const s = localStorage.getItem(STORAGE_ADVISOR);
    if (s === "reza" || s === "omar" || s === "asha") return s;
    return "asha";
  });
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<AdvisorResponse | null>(null);
  const [book, setBook] = useState<BookCard | null>(null);
  const [bookLoading, setBookLoading] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_ADVISOR, advisor);
  }, [advisor]);

  // Pick up a pending prompt if redirected from Home
  useEffect(() => {
    if (redirectToSanctuary) return;
    const pending = sessionStorage.getItem(STORAGE_PENDING);
    if (pending) {
      sessionStorage.removeItem(STORAGE_PENDING);
      setText(pending);
      // auto-run
      run(pending);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function run(input: string) {
    setLoading(true);
    setResponse(null);
    setBook(null);
    try {
      const res = await callAdvisor({
        text: input,
        mood: currentMood,
        advisor,
        name: userName,
        timeOfDay: getTimeOfDay(),
      });
      setResponse(res);
      setMood(res.mood as MoodId, input);

      setBookLoading(true);
      const resolvedBook = await fetchBook(res.book_query)
        .then((b) => {
          setBook(b);
          return b;
        })
        .finally(() => setBookLoading(false));

      const summary = {
        reflection: res.reflection,
        quote: res.quote,
        proverb: res.proverb,
        story: res.story,
        book: resolvedBook
          ? {
              title: resolvedBook.title,
              author: resolvedBook.author,
              url: resolvedBook.url,
              source: resolvedBook.source,
            }
          : { query: res.book_query, found: false },
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      };
      await saveInteraction({
        mood: res.mood as MoodId,
        input_text: input,
        advisor,
        recommendation_summary: summary,
      });
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Something went quiet.";
      toast({ title: "The advisor paused", description: msg });
    } finally {
      setLoading(false);
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const t = text.trim();
    if (!t || loading) return;
    if (redirectToSanctuary) {
      sessionStorage.setItem(STORAGE_PENDING, t);
      localStorage.setItem(STORAGE_ADVISOR, advisor);
      navigate("/sanctuary");
      return;
    }
    run(t);
  };

  const adv = getAdvisor(advisor);
  const compact = variant === "compact";

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-center gap-3 text-center">
        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-primary-glow">
          <span
            className="relative h-6 w-6 rounded-full flex items-center justify-center animate-[drift_6s_ease-in-out_infinite]"
            style={{
              background: "radial-gradient(circle at 30% 30%, hsl(var(--primary) / 0.5), hsl(var(--primary) / 0.1))",
              boxShadow: "0 0 16px -2px hsl(var(--primary) / 0.7), inset 0 0 0 1px hsl(var(--primary) / 0.45)",
            }}
            aria-hidden
          >
            <img src={lampIcon} alt="" className="h-4 w-4 object-contain" />
          </span>
          {compact ? "Or, talk to an advisor" : "Choose your advisor"}
        </div>
        <AdvisorToggle value={advisor} onChange={setAdvisor} />
      </div>

      {!compact && (
        <p className="text-sm text-muted-foreground italic">
          {adv.name} — {adv.voice}
        </p>
      )}

      <form
        onSubmit={handleSubmit}
        className="glass-strong rounded-3xl p-3 md:p-4 space-y-3 animate-fade-in-up glow-hover"
      >
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={compact ? 2 : 4}
          placeholder={
            compact
              ? `Type how you feel — ${adv.name} will listen…`
              : `Tell ${adv.name} what's on your heart. As much or as little as you like.`
          }
          className="w-full bg-transparent outline-none resize-none text-base leading-relaxed placeholder:text-muted-foreground/60 px-2 py-2"
          maxLength={2000}
          disabled={loading}
        />
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            {text.length}/2000
          </span>
          <button
            type="submit"
            disabled={!text.trim() || loading}
            className="h-11 px-5 rounded-full bg-primary text-primary-foreground flex items-center gap-2 text-sm disabled:opacity-30 transition-all hover:shadow-[0_0_30px_-5px_hsl(var(--primary)/0.7)]"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Listening
              </>
            ) : (
              <>
                {redirectToSanctuary ? "Open Sanctuary" : `Speak to ${adv.name}`}
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </div>
      </form>

      {response && !redirectToSanctuary && (
        <div className="space-y-6 animate-fade-in-up">
          <article className="glass rounded-3xl p-6 md:p-8 space-y-3 relative overflow-hidden">
            <div
              aria-hidden
              className="absolute inset-0 pattern-zellige opacity-[0.25] pointer-events-none"
            />
            <div className="relative flex items-center gap-3 text-[10px] uppercase tracking-[0.3em] text-primary-glow">
              <span
                className="relative h-11 w-11 overflow-hidden rounded-full animate-[drift_6s_ease-in-out_infinite]"
                style={{
                  boxShadow: `0 0 24px -3px hsl(${adv.accent} / 0.75), inset 0 0 0 1px hsl(${adv.accent} / 0.55)`,
                }}
                aria-hidden
              >
                <img
                  src={adv.portrait}
                  alt=""
                  loading="lazy"
                  width={44}
                  height={44}
                  className="h-full w-full object-cover"
                />
              </span>
              <span>{adv.name} reflects</span>
            </div>
            <p className="relative font-display text-xl md:text-2xl leading-relaxed whitespace-pre-wrap text-veil">
              {response.reflection}
            </p>
            <p className="relative text-xs text-muted-foreground">
              Sensed feeling:{" "}
              <span className="text-primary-glow">{response.mood}</span>
            </p>
          </article>

          <AdvisorResponseCards
            response={response}
            book={book}
            bookLoading={bookLoading}
          />
        </div>
      )}
    </div>
  );
}
