"use client";

import { useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  Clock3,
  Globe,
  MessageSquareText,
  Sparkles,
  Shuffle,
  Youtube,
} from "lucide-react";

type Step = "welcome" | "duration" | "context" | "language";
type Language = "fr" | "en" | "any";

const STEP_ORDER: Step[] = ["welcome", "duration", "context", "language"];

const DURATIONS = [
  { label: "15 min", value: 15, note: "Rapide", expected: "2-4 videos" },
  { label: "30 min", value: 30, note: "Standard", expected: "4-7 videos" },
  { label: "1h+", value: 65, note: "Pose longue", expected: "8+ videos" },
];

const CONTEXT_PRESETS = [
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
    y: 20,
    x: direction > 0 ? 18 : -18,
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
    y: -14,
    x: direction > 0 ? -16 : 16,
    filter: "blur(3px)",
    transition: { duration: 0.2, ease: [0.4, 0, 1, 1] },
  }),
};

function SplitTitle({ text }: { text: string }) {
  const words = text.split(" ");
  return (
    <h1 className="font-serif font-semibold text-[clamp(2rem,5vw,3.8rem)] leading-[0.98] tracking-tight text-[var(--yt-text)]">
      {words.map((word, idx) => (
        <motion.span
          key={`${word}-${idx}`}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.05, duration: 0.32 }}
          className="inline-block"
        >
          {word}
          {idx < words.length - 1 ? "\u00A0" : ""}
        </motion.span>
      ))}
    </h1>
  );
}

function StepProgress({ current }: { current: Step }) {
  const labels = [
    { step: "duration", label: "Temps" },
    { step: "context", label: "Contexte" },
    { step: "language", label: "Langue" },
  ] as const;
  const currentIndex = Math.max(0, labels.findIndex((item) => item.step === current));

  return (
    <div className="flex items-center gap-3 flex-wrap">
      {labels.map((item, index) => {
        const active = index <= currentIndex;
        return (
          <div key={item.step} className="flex items-center gap-2">
            <motion.div
              layout
              className="h-1.5 rounded-full"
              animate={{
                width: index === currentIndex ? 46 : 18,
                backgroundColor: active ? "var(--yt-red)" : "rgba(255,255,255,0.17)",
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
  const contextRef = useRef<HTMLInputElement>(null);

  const [step, setStep] = useState<Step>("welcome");
  const [direction, setDirection] = useState(1);
  const [duration, setDuration] = useState<number | null>(null);
  const [contextText, setContextText] = useState("");
  const [contextPreset, setContextPreset] = useState<string | null>(null);
  const [navigating, setNavigating] = useState(false);

  const stepIndex = useMemo(() => STEP_ORDER.indexOf(step), [step]);
  const toStep = (next: Step) => {
    const nextIndex = STEP_ORDER.indexOf(next);
    setDirection(nextIndex >= stepIndex ? 1 : -1);
    setStep(next);
  };

  const launch = (language: Language, surprise = false) => {
    const finalContext = contextText.trim() || contextPreset || "interesting popular trending";
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
    <main className="paper-grain min-h-screen px-4 py-6 md:px-8 md:py-10">
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
        <header className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div
              whileHover={{ scale: 1.06, rotate: -2 }}
              transition={{ type: "spring", stiffness: 330, damping: 22 }}
              className="grid h-10 w-10 place-content-center rounded-xl bg-[var(--yt-red)] text-white shadow-[0_12px_26px_rgba(255,39,72,0.35)]"
            >
              <Youtube size={18} />
            </motion.div>
            <div>
              <p className="font-serif text-xl font-semibold leading-none text-[var(--yt-text)]">LetMeWatch</p>
              <p className="mt-0.5 text-[11px] uppercase tracking-[0.14em] text-[var(--yt-muted)]">Smart picks</p>
            </div>
          </div>

          {step !== "welcome" && (
            <button onClick={() => toStep("welcome")} className="bistro-pill rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em]">
              Recommencer
            </button>
          )}
        </header>

        <div className="grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">
          <section className="bistro-card relative overflow-hidden rounded-[30px] p-7 md:p-10">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(255,255,255,0.35)] to-transparent" />
            {step !== "welcome" && (
              <div className="mb-6">
                <StepProgress current={step} />
              </div>
            )}

            <AnimatePresence custom={direction} mode="wait">
              {step === "welcome" && (
                <motion.div key="welcome" custom={direction} variants={panelVariants} initial="enter" animate="center" exit="exit">
                  <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[var(--yt-border)] bg-[rgba(25,27,30,0.9)] px-3 py-1.5">
                    <Sparkles size={13} className="text-[#ff8da0]" />
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#ff5f7e]">Clair et immediat</p>
                  </div>
                  <SplitTitle text="T'en as marre de scroller sans savoir quoi lancer ?" />
                  <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-[var(--yt-muted)] md:text-base">
                    3 etapes rapides. Tu donnes ton timing, ton contexte et ta langue. On te propose directement des videos regardables.
                  </p>

                  <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                    <motion.button
                      whileHover={{ y: -2, scale: 1.01 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => toStep("duration")}
                      className="yt-button flex items-center justify-center gap-2 rounded-2xl bg-[var(--yt-red)] px-6 py-4 text-sm font-semibold text-white shadow-[0_12px_26px_rgba(255,39,72,0.34)] md:text-base"
                    >
                      Commencer
                      <ChevronRight size={18} />
                    </motion.button>
                    <motion.button
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => launch("any", true)}
                      className="yt-button flex items-center justify-center gap-2 rounded-2xl border border-[var(--yt-border-strong)] bg-[rgba(29,31,34,0.92)] px-6 py-4 text-sm font-semibold text-[var(--yt-text)] md:text-base"
                    >
                      <Shuffle size={16} />
                      Surprise directe
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {step === "duration" && (
                <motion.div key="duration" custom={direction} variants={panelVariants} initial="enter" animate="center" exit="exit">
                  <h2 className="font-serif text-[clamp(1.9rem,5vw,3rem)] font-semibold text-[var(--yt-text)]">Combien de temps tu as ?</h2>
                  <p className="mt-2 text-[var(--yt-muted)]">On calibre la duree des videos sur ton vrai timing.</p>
                  <div className="mt-6 grid gap-3 sm:grid-cols-3">
                    {DURATIONS.map((item, index) => (
                      <motion.button
                        key={item.value}
                        initial={{ opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.06 }}
                        whileHover={{ y: -4 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          setDuration(item.value);
                          toStep("context");
                          window.setTimeout(() => contextRef.current?.focus(), 360);
                        }}
                        className="yt-button yt-card focus-halo rounded-2xl p-4 text-left"
                      >
                        <p className="text-xs uppercase tracking-[0.16em] text-[#ff92a5]">{item.note}</p>
                        <p className="mt-2 font-serif text-3xl font-semibold text-[var(--yt-text)]">{item.label}</p>
                        <p className="mt-1 text-xs text-[var(--yt-muted)]">{item.expected}</p>
                      </motion.button>
                    ))}
                  </div>
                  <button onClick={() => toStep("welcome")} className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-[#ff6b87]">
                    <ChevronLeft size={14} /> Retour
                  </button>
                </motion.div>
              )}

              {step === "context" && (
                <motion.div key="context" custom={direction} variants={panelVariants} initial="enter" animate="center" exit="exit">
                  <h2 className="font-serif text-[clamp(1.9rem,5vw,3rem)] font-semibold text-[var(--yt-text)]">Decris ce que t'as envie de regarder</h2>
                  <p className="mt-2 text-[var(--yt-muted)]">Tu peux ecrire naturellement. Le texte libre est prioritaire.</p>

                  <div className="yt-input-wrap mt-5 rounded-3xl p-5">
                    <label htmlFor="watch-context" className="block text-xs font-semibold uppercase tracking-[0.16em] text-[var(--yt-text)]">
                      Ton texte libre
                    </label>
                    <p className="mt-1 text-sm text-[var(--yt-muted)]">Ex: "quelque chose de captivant, pas bruyant, autour de 25 min"</p>
                    <div className="relative mt-3">
                      <input
                        id="watch-context"
                        ref={contextRef}
                        type="text"
                        value={contextText}
                        onChange={(e) => {
                          setContextText(e.target.value);
                          if (e.target.value) setContextPreset(null);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && contextText.trim()) toStep("language");
                        }}
                        placeholder="Decris exactement ce que tu veux regarder..."
                        className="yt-input w-full rounded-2xl px-4 py-4 pr-32 text-sm outline-none"
                      />
                      <button
                        onClick={() => contextText.trim() && toStep("language")}
                        disabled={!contextText.trim()}
                        className="yt-button absolute right-2 top-1/2 -translate-y-1/2 rounded-xl bg-[var(--yt-red)] px-4 py-2 text-xs font-semibold text-white shadow-[0_8px_18px_rgba(255,39,72,0.24)] disabled:opacity-40"
                      >
                        Continuer
                      </button>
                    </div>
                  </div>

                  <p className="mt-5 text-xs uppercase tracking-[0.16em] text-[var(--yt-muted)]">Ou utilise un raccourci</p>
                  <div className="mt-2 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                    {CONTEXT_PRESETS.map((item, index) => (
                      <motion.button
                        key={item.value}
                        initial={{ opacity: 0, scale: 0.94 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.03 }}
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => {
                          setContextPreset(item.value);
                          setContextText("");
                          toStep("language");
                        }}
                        className="yt-button focus-halo rounded-xl border px-3 py-3 text-center text-sm"
                        style={{
                          borderColor: contextPreset === item.value && !contextText ? "rgba(255, 39, 72, 0.48)" : "var(--yt-border)",
                          background: contextPreset === item.value && !contextText ? "rgba(255, 39, 72, 0.16)" : "rgba(29, 31, 34, 0.9)",
                        }}
                      >
                        <span className="block font-semibold text-[var(--yt-text)]">{item.label}</span>
                      </motion.button>
                    ))}
                  </div>

                  <button onClick={() => toStep("duration")} className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-[#ff6b87]">
                    <ChevronLeft size={14} /> Retour
                  </button>
                </motion.div>
              )}

              {step === "language" && (
                <motion.div key="language" custom={direction} variants={panelVariants} initial="enter" animate="center" exit="exit">
                  <h2 className="font-serif text-[clamp(1.9rem,5vw,3rem)] font-semibold text-[var(--yt-text)]">Quelle langue preferee ?</h2>
                  <p className="mt-2 text-[var(--yt-muted)]">Derniere etape, puis on lance les recommandations.</p>
                  <div className="mt-6 grid gap-3 sm:grid-cols-3">
                    {LANGUAGES.map((item, index) => (
                      <motion.button
                        key={item.value}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.06 }}
                        whileHover={{ y: -4 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => launch(item.value)}
                        className="yt-button yt-card focus-halo rounded-2xl p-5 text-center"
                      >
                        <p className="text-4xl">{item.icon}</p>
                        <p className="mt-3 font-serif text-2xl font-semibold text-[var(--yt-text)]">{item.label}</p>
                        <p className="mt-1 text-xs text-[var(--yt-muted)]">Lancer maintenant</p>
                      </motion.button>
                    ))}
                  </div>
                  <button onClick={() => toStep("context")} className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-[#ff6b87]">
                    <ChevronLeft size={14} /> Retour
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </section>

          <aside className="bistro-card h-fit rounded-[30px] p-6 md:p-7">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#ff5f7e]">Comment ca marche</p>
            <div className="mt-4 space-y-3">
              {[
                { icon: Clock3, title: "1. Duree", text: "15 min, 30 min ou 1h+." },
                { icon: MessageSquareText, title: "2. Contexte", text: "Texte libre ou preset rapide." },
                { icon: Globe, title: "3. Langue", text: "FR, EN ou peu importe." },
              ].map((item) => (
                <motion.div
                  key={item.title}
                  whileHover={{ y: -2 }}
                  className="rounded-xl border border-[var(--yt-border)] bg-[rgba(20,22,25,0.9)] p-4"
                >
                  <div className="flex gap-3">
                    <item.icon size={16} className="mt-0.5 text-[#ff5f7e]" />
                    <div>
                      <p className="text-sm font-semibold text-[var(--yt-text)]">{item.title}</p>
                      <p className="mt-1 text-xs text-[var(--yt-muted)]">{item.text}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-5 rounded-2xl border border-[var(--yt-border)] bg-[rgba(20,22,25,0.9)] p-4">
              <p className="text-sm font-semibold text-[var(--yt-text)]">Briefing en direct</p>
              <div className="mt-2 flex flex-wrap gap-2">
                <span className="rounded-full border border-[var(--yt-border)] bg-[rgba(28,30,33,0.92)] px-2.5 py-1 text-[11px] text-[var(--yt-text)]">
                  {duration ? `${duration} min` : "temps a definir"}
                </span>
                <span className="rounded-full border border-[var(--yt-border)] bg-[rgba(28,30,33,0.92)] px-2.5 py-1 text-[11px] text-[var(--yt-text)]">
                  {contextText.trim() ? "texte libre" : contextPreset ? "preset selectionne" : "contexte a definir"}
                </span>
              </div>
              <p className="mt-1 text-xs text-[var(--yt-muted)]">Des recommandations claires, directement regardables, sans perte de temps.</p>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
