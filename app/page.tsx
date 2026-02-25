"use client";

import { useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  Clock3,
  Languages,
  MessageSquareText,
  Shuffle,
  Youtube,
} from "lucide-react";

const DURATIONS = [
  { label: "15 min", value: 15, note: "Rapide", icon: "⚡" },
  { label: "30 min", value: 30, note: "Standard", icon: "🍽️" },
  { label: "1h+", value: 65, note: "Detendu", icon: "🕰️" },
];

const MOODS = [
  { label: "Drole", value: "funny comedy entertainment humor", icon: "😂" },
  { label: "Chill", value: "relaxing calm lofi ambient chill", icon: "😌" },
  { label: "Info", value: "educational documentary explained knowledge", icon: "🧠" },
  { label: "Gaming", value: "gaming gameplay let's play commentary", icon: "🎮" },
  { label: "Cuisine", value: "food cooking recipe street food", icon: "🍜" },
  { label: "Cinema", value: "cinema movie review film analysis", icon: "🎬" },
  { label: "Decouverte", value: "travel nature exploration discovery world", icon: "🌍" },
  { label: "Musique", value: "music live concert performance artist", icon: "🎵" },
  { label: "Science", value: "science technology innovation space physics", icon: "🔬" },
  { label: "Surprise", value: "interesting popular trending viral quality", icon: "🎲" },
];

const LANGUAGES = [
  { label: "Francais", value: "fr", flag: "🇫🇷" },
  { label: "English", value: "en", flag: "🇬🇧" },
  { label: "Peu importe", value: "any", flag: "🌐" },
];

type Step = "welcome" | "duration" | "mood" | "language";

const STEP_ORDER: Step[] = ["welcome", "duration", "mood", "language"];

const pageVariants: Variants = {
  enter: (direction: number) => ({
    opacity: 0,
    y: 22,
    x: direction > 0 ? 24 : -24,
    filter: "blur(3px)",
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
    x: direction > 0 ? -18 : 18,
    filter: "blur(2px)",
    transition: { duration: 0.22, ease: [0.4, 0, 1, 1] },
  }),
};

function SplitTitle({ text }: { text: string }) {
  const words = text.split(" ");
  return (
    <h1 className="font-serif font-semibold text-[clamp(2rem,5.8vw,4rem)] leading-[0.96] tracking-tight text-[var(--charcoal)]">
      {words.map((word, index) => (
        <motion.span
          key={`${word}-${index}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05, duration: 0.34 }}
          className="inline-block"
        >
          {word}
          {index < words.length - 1 ? "\u00A0" : ""}
        </motion.span>
      ))}
    </h1>
  );
}

function StepProgress({ current }: { current: Step }) {
  const labels = [
    { step: "duration", label: "Temps" },
    { step: "mood", label: "Envie" },
    { step: "language", label: "Langue" },
  ] as const;

  const currentIndex = Math.max(0, labels.findIndex((item) => item.step === current));
  return (
    <div className="flex items-center gap-4 flex-wrap">
      {labels.map((item, index) => {
        const active = index <= currentIndex;
        return (
          <div key={item.step} className="flex items-center gap-2">
            <motion.div
              layout
              className="h-1.5 rounded-full"
              animate={{
                width: index === currentIndex ? 44 : 18,
                backgroundColor: active ? "var(--wine)" : "rgba(194,213,255,0.24)",
              }}
            />
            <span
              className="text-[10px] uppercase tracking-[0.16em]"
              style={{ color: active ? "var(--wine)" : "rgba(214,228,255,0.62)" }}
            >
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
  const inputRef = useRef<HTMLInputElement>(null);

  const [step, setStep] = useState<Step>("welcome");
  const [direction, setDirection] = useState(1);
  const [duration, setDuration] = useState<number | null>(null);
  const [mood, setMood] = useState<string | null>(null);
  const [customMood, setCustomMood] = useState("");
  const [navigating, setNavigating] = useState(false);

  const stepIndex = useMemo(() => STEP_ORDER.indexOf(step), [step]);

  const toStep = (next: Step) => {
    const nextIndex = STEP_ORDER.indexOf(next);
    setDirection(nextIndex >= stepIndex ? 1 : -1);
    setStep(next);
  };

  const ambiancePreview = customMood.trim()
    ? customMood.trim()
    : mood
    ? mood.split(" ").slice(0, 2).join(" ")
    : "A definir";

  const pushToResults = (lang: string, surprise = false) => {
    const finalMood = customMood.trim() || mood || "interesting popular trending";
    const params = new URLSearchParams({
      mood: surprise ? "surprise" : finalMood,
      duration: String(duration ?? 30),
      language: surprise ? "any" : lang,
      surprise: String(surprise),
    });

    setNavigating(true);
    window.setTimeout(() => {
      router.push(`/results?${params.toString()}`);
    }, 280);
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
        <header className="mb-7 md:mb-9 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div
              whileHover={{ scale: 1.06, rotate: -4 }}
              transition={{ type: "spring", stiffness: 360, damping: 20 }}
              className="h-10 w-10 rounded-xl bg-[var(--wine)] text-[#051111] grid place-content-center shadow-[0_8px_18px_rgba(61,217,199,0.28)]"
            >
              <Youtube size={18} />
            </motion.div>
            <p className="font-serif font-semibold text-xl leading-none text-[var(--charcoal)]">LetMeWatch</p>
          </div>
          {step !== "welcome" && (
            <button
              onClick={() => toStep("welcome")}
              className="bistro-pill rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em]"
            >
              Recommencer
            </button>
          )}
        </header>

        <div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
          <aside className="order-2 xl:order-1 flex flex-col gap-5 xl:sticky xl:top-6 h-fit">
            <motion.div
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              className="bistro-card rounded-[26px] p-6"
            >
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--wine)] font-semibold">Mode d'emploi</p>
              <div className="mt-4 space-y-3">
                {[
                  { icon: Clock3, text: "Choisis ton temps" },
                  { icon: MessageSquareText, text: "Decris ton envie" },
                  { icon: Languages, text: "Choisis ta langue" },
                ].map((item) => (
                  <div
                    key={item.text}
                    className="rounded-xl border border-[rgba(194,213,255,0.16)] bg-[rgba(8,14,28,0.7)] px-3 py-3 flex items-center gap-3"
                  >
                    <item.icon size={16} className="text-[var(--wine)]" />
                    <span className="text-sm text-[rgba(224,236,255,0.8)]">{item.text}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.08 }}
              className="bistro-card rounded-[26px] p-6"
            >
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--wine)] font-semibold">Contexte actuel</p>
              <div className="mt-4 space-y-2 text-sm">
                <div className="rounded-xl border border-[rgba(194,213,255,0.16)] bg-[rgba(8,14,28,0.7)] px-3 py-2 text-[rgba(224,236,255,0.82)]">
                  Temps: {duration ? `${duration} min` : "A definir"}
                </div>
                <div className="rounded-xl border border-[rgba(194,213,255,0.16)] bg-[rgba(8,14,28,0.7)] px-3 py-2 text-[rgba(224,236,255,0.82)] truncate">
                  Envie: {ambiancePreview}
                </div>
              </div>
            </motion.div>
          </aside>

          <section className="order-1 xl:order-2 bistro-card rounded-[30px] p-7 md:p-10 relative overflow-hidden">
            {step !== "welcome" && (
              <div className="mb-6">
                <StepProgress current={step} />
              </div>
            )}

            <AnimatePresence custom={direction} mode="wait">
              {step === "welcome" && (
                <motion.div key="welcome" custom={direction} variants={pageVariants} initial="enter" animate="center" exit="exit">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--wine)] mb-5">
                    Compris en 10 secondes
                  </p>
                  <SplitTitle text="T'en as marre de scroller ?" />
                  <p className="mt-6 max-w-xl text-[15px] md:text-base text-[rgba(224,236,255,0.8)] leading-relaxed">
                    Dis-nous en trois points ce que tu veux et on te propose des videos que tu peux lancer tout de suite.
                  </p>
                  <div className="mt-8 flex flex-col sm:flex-row gap-3">
                    <motion.button
                      whileHover={{ y: -2, scale: 1.01 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => toStep("duration")}
                      className="yt-button rounded-2xl bg-[var(--wine)] text-[#041110] px-6 py-4 font-semibold text-sm md:text-base flex items-center justify-center gap-2 shadow-[0_10px_22px_rgba(61,217,199,0.24)]"
                    >
                      Lancer la recherche
                      <ChevronRight size={18} />
                    </motion.button>
                    <motion.button
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => pushToResults("any", true)}
                      className="yt-button rounded-2xl border border-[rgba(194,213,255,0.18)] bg-[rgba(8,14,28,0.74)] px-6 py-4 font-semibold text-sm md:text-base text-[var(--ink)] flex items-center justify-center gap-2"
                    >
                      <Shuffle size={16} />
                      Surprise directe
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {step === "duration" && (
                <motion.div key="duration" custom={direction} variants={pageVariants} initial="enter" animate="center" exit="exit">
                  <h2 className="font-serif font-semibold text-[clamp(1.9rem,5vw,3rem)] text-[var(--charcoal)]">
                    Combien de temps tu as ?
                  </h2>
                  <p className="mt-2 text-[rgba(224,236,255,0.76)]">On aligne la duree des videos avec ton repas.</p>

                  <div className="mt-6 grid gap-3 sm:grid-cols-3">
                    {DURATIONS.map((item, index) => (
                      <motion.button
                        key={item.value}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.06 }}
                        whileHover={{ y: -4 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          setDuration(item.value);
                          toStep("mood");
                        }}
                        className="yt-button rounded-2xl border border-[rgba(194,213,255,0.16)] bg-[rgba(8,14,28,0.72)] p-4 text-left hover:shadow-[0_12px_24px_rgba(0,0,0,0.24)]"
                      >
                        <p className="text-2xl">{item.icon}</p>
                        <p className="mt-3 font-serif font-semibold text-2xl text-[var(--charcoal)]">{item.label}</p>
                        <p className="text-sm text-[rgba(214,228,255,0.7)]">{item.note}</p>
                      </motion.button>
                    ))}
                  </div>

                  <button onClick={() => toStep("welcome")} className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-[var(--wine)]">
                    <ChevronLeft size={14} /> Retour
                  </button>
                </motion.div>
              )}

              {step === "mood" && (
                <motion.div key="mood" custom={direction} variants={pageVariants} initial="enter" animate="center" exit="exit">
                  <h2 className="font-serif font-semibold text-[clamp(1.9rem,5vw,3rem)] text-[var(--charcoal)]">
                    Decris ce que t'as envie de regarder
                  </h2>
                  <p className="mt-2 text-[rgba(224,236,255,0.76)]">Quelques mots suffisent pour guider les recos.</p>

                  <div className="yt-input-wrap mt-5 rounded-3xl p-5">
                    <label htmlFor="custom-mood" className="block text-xs font-semibold uppercase tracking-[0.16em] text-[var(--ink)]">
                      Description libre
                    </label>
                    <p className="mt-1 text-sm text-[rgba(214,228,255,0.72)]">Ex: "quelque chose de captivant, pas trop bruyant, environ 25 min"</p>
                    <div className="mt-3 relative">
                      <input
                        id="custom-mood"
                        ref={inputRef}
                        type="text"
                        value={customMood}
                        onChange={(e) => {
                          setCustomMood(e.target.value);
                          if (e.target.value) setMood(null);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && customMood.trim()) toStep("language");
                        }}
                        placeholder="Ecris ton besoin ici..."
                        className="yt-input w-full rounded-2xl px-4 py-4 pr-32 text-sm outline-none"
                      />
                      <button
                        onClick={() => {
                          if (customMood.trim()) toStep("language");
                        }}
                        disabled={!customMood.trim()}
                        className="yt-button absolute right-2 top-1/2 -translate-y-1/2 rounded-xl bg-[var(--wine)] px-4 py-2 text-xs font-semibold text-[#041110] disabled:opacity-45 shadow-[0_8px_18px_rgba(61,217,199,0.22)]"
                      >
                        Continuer
                      </button>
                    </div>
                  </div>

                  <p className="mt-5 text-xs uppercase tracking-[0.16em] text-[rgba(214,228,255,0.62)]">Ou choisis une idee rapide</p>
                  <div className="mt-2 grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                    {MOODS.map((item, index) => (
                      <motion.button
                        key={item.value}
                        initial={{ opacity: 0, scale: 0.93 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.025 }}
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.96 }}
                        onClick={() => {
                          setMood(item.value);
                          setCustomMood("");
                          toStep("language");
                        }}
                        className="yt-button rounded-xl px-3 py-3 text-center border text-sm hover:shadow-[0_8px_18px_rgba(0,0,0,0.18)]"
                        style={{
                          borderColor: mood === item.value && !customMood ? "rgba(61,217,199,0.62)" : "rgba(194,213,255,0.2)",
                          background: mood === item.value && !customMood ? "rgba(61,217,199,0.14)" : "rgba(8,14,28,0.66)",
                        }}
                      >
                        <span className="block text-xl">{item.icon}</span>
                        <span className="mt-1 block text-[13px] font-semibold text-[var(--charcoal)]">{item.label}</span>
                      </motion.button>
                    ))}
                  </div>

                  <button onClick={() => toStep("duration")} className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-[var(--wine)]">
                    <ChevronLeft size={14} /> Retour
                  </button>
                </motion.div>
              )}

              {step === "language" && (
                <motion.div key="language" custom={direction} variants={pageVariants} initial="enter" animate="center" exit="exit">
                  <h2 className="font-serif font-semibold text-[clamp(1.9rem,5vw,3rem)] text-[var(--charcoal)]">Quelle langue preferee ?</h2>
                  <p className="mt-2 text-[rgba(224,236,255,0.76)]">Derniere etape, puis on te sort la selection.</p>

                  <div className="mt-6 grid gap-3 sm:grid-cols-3">
                    {LANGUAGES.map((item, index) => (
                      <motion.button
                        key={item.value}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.06 }}
                        whileHover={{ y: -4 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => pushToResults(item.value)}
                        className="yt-button rounded-2xl border border-[rgba(194,213,255,0.18)] bg-[rgba(8,14,28,0.72)] p-5 text-center hover:shadow-[0_10px_22px_rgba(0,0,0,0.24)]"
                      >
                        <p className="text-4xl">{item.flag}</p>
                        <p className="mt-3 font-serif font-semibold text-2xl text-[var(--charcoal)]">{item.label}</p>
                      </motion.button>
                    ))}
                  </div>

                  <button onClick={() => toStep("mood")} className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-[var(--wine)]">
                    <ChevronLeft size={14} /> Retour
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </section>
        </div>
      </div>
    </main>
  );
}
