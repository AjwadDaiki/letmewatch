"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  Clock3,
  Globe2,
  Layers,
  Search,
  Shuffle,
  Sparkles,
  Youtube,
} from "lucide-react";

type Step = "welcome" | "duration" | "context" | "language";
type Language = "fr" | "en" | "any";

const STEP_ORDER: Step[] = ["welcome", "duration", "context", "language"];

const DURATIONS = [
  { value: 15, label: "15 min", note: "Rapide" },
  { value: 30, label: "30 min", note: "Standard" },
  { value: 65, label: "1h+", note: "Pose longue" },
];

const PRESETS = [
  { label: "Drole", value: "funny comedy entertainment humor" },
  { label: "Detente", value: "relaxing calm lofi ambient chill" },
  { label: "Docu", value: "documentary educational interesting" },
  { label: "Gaming", value: "gaming gameplay commentary highlights" },
  { label: "Cinema", value: "movie review cinema analysis" },
  { label: "Musique", value: "live session music performance" },
  { label: "Science", value: "science technology innovation explained" },
  { label: "Surprise", value: "interesting popular trending high quality" },
];

const LANGUAGES: { label: string; value: Language; icon: string }[] = [
  { label: "Francais", value: "fr", icon: "🇫🇷" },
  { label: "English", value: "en", icon: "🇬🇧" },
  { label: "Peu importe", value: "any", icon: "🌐" },
];

const panelVariants: Variants = {
  enter: (direction: number) => ({
    opacity: 0,
    y: 18,
    x: direction > 0 ? 16 : -16,
    filter: "blur(4px)",
  }),
  center: {
    opacity: 1,
    y: 0,
    x: 0,
    filter: "blur(0px)",
    transition: { duration: 0.34, ease: [0.22, 1, 0.36, 1] },
  },
  exit: (direction: number) => ({
    opacity: 0,
    y: -12,
    x: direction > 0 ? -14 : 14,
    filter: "blur(3px)",
    transition: { duration: 0.22, ease: [0.4, 0, 1, 1] },
  }),
};

function StepRail({ current }: { current: Step }) {
  const steps = [
    { key: "duration", label: "Temps" },
    { key: "context", label: "Contexte" },
    { key: "language", label: "Langue" },
  ] as const;
  const currentIndex = Math.max(0, steps.findIndex((item) => item.key === current));

  return (
    <div className="flex items-center gap-3">
      {steps.map((item, idx) => {
        const active = idx <= currentIndex;
        return (
          <div key={item.key} className="flex items-center gap-2">
            <motion.div
              layout
              className="h-1.5 rounded-full"
              animate={{
                width: idx === currentIndex ? 42 : 16,
                backgroundColor: active ? "var(--yt-red)" : "rgba(255,255,255,0.16)",
              }}
            />
            <span className="text-[10px] uppercase tracking-[0.16em]" style={{ color: active ? "#ffd8df" : "var(--yt-muted)" }}>
              {item.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export default function Home() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("welcome");
  const [direction, setDirection] = useState(1);
  const [duration, setDuration] = useState<number | null>(null);
  const [contextText, setContextText] = useState("");
  const [preset, setPreset] = useState<string | null>(null);
  const [navigating, setNavigating] = useState(false);

  const stepIndex = useMemo(() => STEP_ORDER.indexOf(step), [step]);

  const toStep = (next: Step) => {
    const nextIndex = STEP_ORDER.indexOf(next);
    setDirection(nextIndex >= stepIndex ? 1 : -1);
    setStep(next);
  };

  const launch = (language: Language, surprise = false) => {
    const finalContext = contextText.trim() || preset || "interesting popular trending";
    const params = new URLSearchParams({
      mood: surprise ? "surprise" : finalContext,
      duration: String(duration ?? 30),
      language: surprise ? "any" : language,
      surprise: String(surprise),
    });
    setNavigating(true);
    window.setTimeout(() => router.push(`/results?${params.toString()}`), 260);
  };

  return (
    <main className="paper-grain min-h-screen px-4 py-6 md:px-8 md:py-8">
      <AnimatePresence>
        {navigating && (
          <motion.div
            className="curtain-wipe"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.32, ease: [0.65, 0, 0.35, 1] }}
          />
        )}
      </AnimatePresence>

      <div className="mx-auto max-w-7xl">
        <div className="extension-shell">
          <div className="extension-shell-bar">
            <div className="flex items-center gap-1.5">
              <span className="shell-dot bg-[#fc5f57]" />
              <span className="shell-dot bg-[#fdbc2e]" />
              <span className="shell-dot bg-[#28c840]" />
            </div>
            <div className="extension-shell-pill">
              <Youtube size={14} />
              <span>YouTube</span>
            </div>
          </div>

          <div className="grid gap-5 p-3 lg:grid-cols-[1.2fr_0.8fr]">
            <section className="yt-mock rounded-2xl p-4 md:p-5">
              <div className="yt-video-frame">
                <div className="yt-video-overlay">
                  <div className="yt-logo-chip">
                    <Youtube size={15} />
                    <span>LetMeWatch Extension</span>
                  </div>
                  <h1 className="font-serif text-[clamp(1.4rem,3.2vw,2.3rem)] font-semibold leading-tight text-white">
                    Recos YouTube en quelques secondes
                  </h1>
                  <p className="max-w-md text-sm text-[var(--yt-muted)]">
                    Tu gardes ton focus sur la video. Le panneau extension gere le matching.
                  </p>
                </div>
              </div>

              <div className="mt-3 grid gap-2 sm:grid-cols-3">
                {["Compris tout de suite", "Flow 3 etapes", "Reco directe"].map((item) => (
                  <div key={item} className="yt-chip rounded-xl px-3 py-2 text-xs font-semibold">
                    {item}
                  </div>
                ))}
              </div>

              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {[1, 2, 3, 4].map((idx) => (
                  <motion.div
                    key={idx}
                    whileHover={{ y: -2 }}
                    className="yt-feed-item"
                  >
                    <div className="yt-feed-thumb" />
                    <div>
                      <p className="text-sm font-semibold text-white">Suggestion {idx}</p>
                      <p className="text-xs text-[var(--yt-muted)]">Pret a regarder</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>

            <aside className="bistro-card relative overflow-hidden rounded-2xl p-5 md:p-6">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="grid h-8 w-8 place-content-center rounded-lg bg-[var(--yt-red)] text-white">
                    <Layers size={14} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">Panneau Extension</p>
                    <p className="text-[11px] text-[var(--yt-muted)]">Action rapide</p>
                  </div>
                </div>
                {step !== "welcome" && (
                  <button onClick={() => toStep("welcome")} className="bistro-pill rounded-full px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.14em]">
                    Reset
                  </button>
                )}
              </div>

              {step !== "welcome" && (
                <div className="mb-5">
                  <StepRail current={step} />
                </div>
              )}

              <AnimatePresence custom={direction} mode="wait">
                {step === "welcome" && (
                  <motion.div key="welcome" custom={direction} variants={panelVariants} initial="enter" animate="center" exit="exit">
                    <div className="inline-flex items-center gap-1.5 rounded-full border border-[var(--yt-border)] bg-[rgba(26,28,31,0.9)] px-3 py-1 text-[11px] uppercase tracking-[0.16em] text-[#ff5f7e]">
                      <Sparkles size={12} />
                      Guide rapide
                    </div>
                    <h2 className="mt-3 font-serif text-3xl font-semibold text-white">T'en as marre de scroller ?</h2>
                    <p className="mt-2 text-sm text-[var(--yt-muted)]">
                      Donne ton timing, ton contexte, ta langue. On te sort des videos directement regardables.
                    </p>
                    <div className="mt-5 flex flex-col gap-2">
                      <button onClick={() => toStep("duration")} className="yt-button rounded-xl bg-[var(--yt-red)] px-4 py-3 text-sm font-semibold text-white">
                        Commencer
                      </button>
                      <button
                        onClick={() => launch("any", true)}
                        className="yt-button inline-flex items-center justify-center gap-2 rounded-xl border border-[var(--yt-border-strong)] bg-[rgba(26,28,31,0.94)] px-4 py-3 text-sm font-semibold text-white"
                      >
                        <Shuffle size={15} />
                        Surprise directe
                      </button>
                    </div>
                  </motion.div>
                )}

                {step === "duration" && (
                  <motion.div key="duration" custom={direction} variants={panelVariants} initial="enter" animate="center" exit="exit">
                    <h3 className="font-serif text-2xl font-semibold text-white">Combien de temps ?</h3>
                    <p className="mt-1 text-xs text-[var(--yt-muted)]">On ajuste la duree des videos automatiquement.</p>
                    <div className="mt-4 grid gap-2">
                      {DURATIONS.map((item) => (
                        <button
                          key={item.value}
                          onClick={() => {
                            setDuration(item.value);
                            toStep("context");
                          }}
                          className="yt-button focus-halo yt-card rounded-xl px-4 py-3 text-left"
                        >
                          <p className="text-sm font-semibold text-white">{item.label}</p>
                          <p className="text-xs text-[var(--yt-muted)]">{item.note}</p>
                        </button>
                      ))}
                    </div>
                    <button onClick={() => toStep("welcome")} className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-[#ff6b87]">
                      <ChevronLeft size={13} /> Retour
                    </button>
                  </motion.div>
                )}

                {step === "context" && (
                  <motion.div key="context" custom={direction} variants={panelVariants} initial="enter" animate="center" exit="exit">
                    <h3 className="font-serif text-2xl font-semibold text-white">Contexte</h3>
                    <p className="mt-1 text-xs text-[var(--yt-muted)]">Le texte libre passe en priorite.</p>
                    <div className="yt-input-wrap mt-4 rounded-xl p-3">
                      <div className="relative">
                        <Search size={14} className="absolute left-3 top-3.5 text-[var(--yt-muted)]" />
                        <input
                          value={contextText}
                          onChange={(e) => {
                            setContextText(e.target.value);
                            if (e.target.value) setPreset(null);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && contextText.trim()) toStep("language");
                          }}
                          placeholder="Decris ce que tu veux regarder..."
                          className="yt-input w-full rounded-lg py-2.5 pl-8 pr-3 text-sm outline-none"
                        />
                      </div>
                    </div>
                    <div className="mt-3 grid grid-cols-2 gap-2">
                      {PRESETS.map((item) => (
                        <button
                          key={item.value}
                          onClick={() => {
                            setPreset(item.value);
                            setContextText("");
                            toStep("language");
                          }}
                          className="yt-button focus-halo rounded-lg border px-2.5 py-2 text-xs font-semibold"
                          style={{
                            borderColor: preset === item.value && !contextText ? "rgba(255, 0, 51, 0.45)" : "var(--yt-border)",
                            background: preset === item.value && !contextText ? "rgba(255, 0, 51, 0.15)" : "rgba(27, 29, 32, 0.9)",
                            color: "white",
                          }}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                    <button onClick={() => toStep("duration")} className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-[#ff6b87]">
                      <ChevronLeft size={13} /> Retour
                    </button>
                  </motion.div>
                )}

                {step === "language" && (
                  <motion.div key="language" custom={direction} variants={panelVariants} initial="enter" animate="center" exit="exit">
                    <h3 className="font-serif text-2xl font-semibold text-white">Langue</h3>
                    <p className="mt-1 text-xs text-[var(--yt-muted)]">Derniere etape.</p>
                    <div className="mt-4 grid gap-2">
                      {LANGUAGES.map((item) => (
                        <button
                          key={item.value}
                          onClick={() => launch(item.value)}
                          className="yt-button focus-halo yt-card flex items-center justify-between rounded-xl px-4 py-3 text-left"
                        >
                          <span className="text-sm font-semibold text-white">{item.label}</span>
                          <span>{item.icon}</span>
                        </button>
                      ))}
                    </div>
                    <button onClick={() => toStep("context")} className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-[#ff6b87]">
                      <ChevronLeft size={13} /> Retour
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="mt-5 rounded-xl border border-[var(--yt-border)] bg-[rgba(22,24,27,0.92)] p-3">
                <p className="text-xs font-semibold text-white">Etat actuel</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <span className="rounded-full border border-[var(--yt-border)] bg-[rgba(30,32,35,0.9)] px-2.5 py-1 text-[10px] text-white">
                    {duration ? `${duration} min` : "temps a definir"}
                  </span>
                  <span className="rounded-full border border-[var(--yt-border)] bg-[rgba(30,32,35,0.9)] px-2.5 py-1 text-[10px] text-white">
                    {contextText.trim() ? "texte libre" : preset ? "preset" : "contexte a definir"}
                  </span>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </main>
  );
}
