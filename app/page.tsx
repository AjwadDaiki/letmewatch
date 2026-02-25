"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  Clock3,
  Shuffle,
  Sparkles,
  UtensilsCrossed,
} from "lucide-react";

const DURATIONS = [
  { label: "15 min", value: 15, note: "Pause express", icon: "⚡" },
  { label: "30 min", value: 30, note: "Format standard", icon: "🍽️" },
  { label: "1h+", value: 65, note: "Je m'installe", icon: "🥂" },
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
  { label: "Surprends-moi", value: "interesting popular trending viral quality", icon: "🎲" },
];

const LANGUAGES = [
  { label: "Francais", value: "fr", flag: "🇫🇷" },
  { label: "English", value: "en", flag: "🇬🇧" },
  { label: "Libre", value: "any", flag: "🌐" },
];

type Step = "welcome" | "duration" | "mood" | "language";

const pageVariants: Variants = {
  initial: { opacity: 0, y: 24 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
  },
  exit: {
    opacity: 0,
    y: -24,
    transition: { duration: 0.25, ease: [0.4, 0, 1, 1] },
  },
};

function SplitTitle({ text }: { text: string }) {
  return (
    <h1 className="font-serif text-[clamp(2.3rem,6vw,4.5rem)] leading-[0.95] tracking-tight text-[var(--charcoal)]">
      {text.split(" ").map((word, index) => (
        <motion.span
          key={`${word}-${index}`}
          initial={{ opacity: 0, y: 26, rotateX: 25 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ delay: index * 0.08, duration: 0.5 }}
          className="inline-block mr-3"
        >
          {word}
        </motion.span>
      ))}
    </h1>
  );
}

function StepRail({ current }: { current: number }) {
  return (
    <div className="flex items-center gap-2">
      {[1, 2, 3].map((n) => (
        <motion.div
          key={n}
          animate={{
            width: n === current ? 48 : 18,
            backgroundColor: n <= current ? "var(--wine)" : "rgba(43,33,28,0.2)",
          }}
          transition={{ duration: 0.3 }}
          className="h-1.5 rounded-full"
        />
      ))}
      <span className="text-xs font-semibold tracking-[0.2em] text-[var(--wine)] ml-1">
        0{current}
      </span>
    </div>
  );
}

export default function Home() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const [step, setStep] = useState<Step>("welcome");
  const [duration, setDuration] = useState<number | null>(null);
  const [mood, setMood] = useState<string | null>(null);
  const [customMood, setCustomMood] = useState("");
  const [showCurtain, setShowCurtain] = useState(false);

  const transitionTo = (next: Step) => {
    setShowCurtain(true);
    window.setTimeout(() => setStep(next), 170);
    window.setTimeout(() => setShowCurtain(false), 520);
  };

  const navigate = (lang: string, surprise = false) => {
    const finalMood = customMood.trim() || mood || "interesting popular trending";
    const params = new URLSearchParams({
      mood: finalMood,
      duration: String(duration ?? 30),
      language: lang,
      surprise: String(surprise),
    });
    router.push(`/results?${params.toString()}`);
  };

  const handleSurprise = () => {
    const params = new URLSearchParams({
      mood: "surprise",
      duration: String(duration ?? 30),
      language: "any",
      surprise: "true",
    });
    router.push(`/results?${params.toString()}`);
  };

  return (
    <main className="paper-grain min-h-screen px-4 py-6 md:px-8 md:py-10">
      <AnimatePresence>
        {showCurtain && (
          <motion.div
            className="curtain-wipe"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: [0, 1, 0], transformOrigin: ["left", "left", "right"] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.55, times: [0, 0.5, 1], ease: "easeInOut" }}
          />
        )}
      </AnimatePresence>

      <div className="mx-auto max-w-6xl">
        <header className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-[var(--wine)] text-white grid place-content-center">
              <UtensilsCrossed size={18} />
            </div>
            <div>
              <p className="font-serif text-xl leading-none text-[var(--charcoal)]">LetMeWatch</p>
              <p className="text-[10px] uppercase tracking-[0.22em] text-[var(--wine)]">YouTube Match</p>
            </div>
          </div>
          {step !== "welcome" && (
            <button
              onClick={() => transitionTo("welcome")}
              className="bistro-pill rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--charcoal)]"
            >
              Retour a l'accueil
            </button>
          )}
        </header>

        <div className="grid gap-5 lg:grid-cols-[1.15fr_1fr]">
          <section className="bistro-card rounded-[30px] p-7 md:p-10 relative overflow-hidden">
            <div className="absolute -top-7 -right-6 h-24 w-24 rounded-full border border-[rgba(86,19,30,0.22)]" />
            <div className="absolute -bottom-7 -left-8 h-32 w-32 rounded-full border border-[rgba(86,19,30,0.18)]" />

            <AnimatePresence mode="wait">
              {step === "welcome" && (
                <motion.div
                  key="welcome"
                  variants={pageVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--wine)] mb-5">
                    Trouve vite quoi regarder
                  </p>
                  <SplitTitle text="La bonne video, au bon moment." />

                  <p className="mt-6 max-w-lg text-[15px] md:text-base text-[rgba(29,23,19,0.78)] leading-relaxed">
                    Dis ce que tu veux regarder et combien de temps tu as. LetMeWatch te propose
                    des videos YouTube adaptees en quelques secondes.
                  </p>

                  <div className="mt-8 flex flex-col sm:flex-row gap-3">
                    <motion.button
                      whileHover={{ y: -2, scale: 1.01 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => transitionTo("duration")}
                      className="rounded-2xl bg-[var(--wine)] text-white px-6 py-4 font-semibold text-sm md:text-base flex items-center justify-center gap-2"
                    >
                      Trouver mes videos
                      <ChevronRight size={18} />
                    </motion.button>
                    <motion.button
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleSurprise}
                      className="rounded-2xl border border-[rgba(86,19,30,0.35)] px-6 py-4 font-semibold text-sm md:text-base text-[var(--wine)] flex items-center justify-center gap-2"
                    >
                      <Shuffle size={16} />
                      Mode surprise
                    </motion.button>
                  </div>

                  <div className="mt-8 flex flex-wrap items-center gap-4 text-xs text-[rgba(43,33,28,0.7)]">
                    <span className="bistro-pill rounded-full px-3 py-1">3 questions</span>
                    <span className="bistro-pill rounded-full px-3 py-1">10 secondes</span>
                    <span className="bistro-pill rounded-full px-3 py-1">matching IA</span>
                  </div>
                </motion.div>
              )}

              {step === "duration" && (
                <motion.div key="duration" variants={pageVariants} initial="initial" animate="animate" exit="exit">
                  <StepRail current={1} />
                  <h2 className="font-serif text-[clamp(1.9rem,5vw,3rem)] mt-5 text-[var(--charcoal)]">
                    Combien de temps dure ton repas ?
                  </h2>
                  <p className="mt-2 text-[rgba(29,23,19,0.7)]">
                    On ajuste la duree pour que la video colle a ton timing.
                  </p>

                  <div className="mt-6 grid gap-3 sm:grid-cols-3">
                    {DURATIONS.map((d, index) => (
                      <motion.button
                        key={d.value}
                        initial={{ opacity: 0, y: 18 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.06 }}
                        whileHover={{ y: -4 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          setDuration(d.value);
                          transitionTo("mood");
                        }}
                        className="rounded-2xl border border-[rgba(43,33,28,0.14)] bg-[rgba(255,255,255,0.62)] p-4 text-left"
                      >
                        <p className="text-2xl">{d.icon}</p>
                        <p className="mt-3 font-serif text-2xl text-[var(--charcoal)]">{d.label}</p>
                        <p className="text-sm text-[rgba(29,23,19,0.65)]">{d.note}</p>
                      </motion.button>
                    ))}
                  </div>

                  <button
                    onClick={() => transitionTo("welcome")}
                    className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-[var(--wine)]"
                  >
                    <ChevronLeft size={14} /> Retour
                  </button>
                </motion.div>
              )}

              {step === "mood" && (
                <motion.div key="mood" variants={pageVariants} initial="initial" animate="animate" exit="exit">
                  <StepRail current={2} />
                  <h2 className="font-serif text-[clamp(1.9rem,5vw,3rem)] mt-5 text-[var(--charcoal)]">
                    Quelle ambiance aujourd'hui ?
                  </h2>
                  <p className="mt-2 text-[rgba(29,23,19,0.7)]">
                    Decris librement ce que tu veux regarder: style, ton, sujet, energie.
                  </p>

                  <div className="mt-5 rounded-2xl border border-[rgba(86,19,30,0.3)] bg-[rgba(110,30,42,0.06)] p-4">
                    <label
                      htmlFor="custom-mood"
                      className="block text-xs font-semibold uppercase tracking-[0.16em] text-[var(--wine)]"
                    >
                      Decris exactement ce que tu veux
                    </label>
                    <p className="mt-1 text-sm text-[rgba(29,23,19,0.72)]">
                      Exemple: "quelque chose de captivant, sans trop parler, 20-30 min"
                    </p>
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
                          if (e.key === "Enter" && customMood.trim()) transitionTo("language");
                        }}
                        placeholder="Ecris ton besoin ici, sans contrainte..."
                        className="w-full rounded-2xl bg-[rgba(255,255,255,0.84)] border border-[rgba(86,19,30,0.38)] px-4 py-4 text-sm outline-none focus:border-[rgba(86,19,30,0.55)]"
                      />
                      <button
                        onClick={() => {
                          if (customMood.trim()) transitionTo("language");
                        }}
                        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-xl bg-[var(--wine)] px-4 py-2 text-xs font-semibold text-white disabled:opacity-45"
                        disabled={!customMood.trim()}
                      >
                        Continuer
                      </button>
                    </div>
                  </div>

                  <p className="mt-5 text-xs uppercase tracking-[0.16em] text-[rgba(29,23,19,0.6)]">
                    Ou choisis un preset rapide
                  </p>
                  <div className="mt-2 grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                    {MOODS.map((m, index) => (
                      <motion.button
                        key={m.value}
                        initial={{ opacity: 0, scale: 0.93 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.03 }}
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.96 }}
                        onClick={() => {
                          setMood(m.value);
                          setCustomMood("");
                          transitionTo("language");
                        }}
                        className="rounded-xl px-3 py-3 text-center border text-sm"
                        style={{
                          borderColor:
                            mood === m.value && !customMood
                              ? "rgba(86,19,30,0.45)"
                              : "rgba(43,33,28,0.18)",
                          background:
                            mood === m.value && !customMood
                              ? "rgba(110,30,42,0.1)"
                              : "rgba(255,255,255,0.5)",
                        }}
                      >
                        <span className="block text-xl">{m.icon}</span>
                        <span className="mt-1 block text-[13px] font-semibold text-[var(--charcoal)]">
                          {m.label}
                        </span>
                      </motion.button>
                    ))}
                  </div>

                  <button
                    onClick={() => transitionTo("duration")}
                    className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-[var(--wine)]"
                  >
                    <ChevronLeft size={14} /> Retour
                  </button>
                </motion.div>
              )}

              {step === "language" && (
                <motion.div key="language" variants={pageVariants} initial="initial" animate="animate" exit="exit">
                  <StepRail current={3} />
                  <h2 className="font-serif text-[clamp(1.9rem,5vw,3rem)] mt-5 text-[var(--charcoal)]">
                    Quelle langue preferee ?
                  </h2>
                  <p className="mt-2 text-[rgba(29,23,19,0.7)]">On filtre directement les recommandations.</p>

                  <div className="mt-6 grid gap-3 sm:grid-cols-3">
                    {LANGUAGES.map((lang, index) => (
                      <motion.button
                        key={lang.value}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.06 }}
                        whileHover={{ y: -4 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => navigate(lang.value)}
                        className="rounded-2xl border border-[rgba(43,33,28,0.18)] bg-[rgba(255,255,255,0.6)] p-5 text-center"
                      >
                        <p className="text-4xl">{lang.flag}</p>
                        <p className="mt-3 font-serif text-2xl text-[var(--charcoal)]">{lang.label}</p>
                      </motion.button>
                    ))}
                  </div>

                  <button
                    onClick={() => transitionTo("mood")}
                    className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-[var(--wine)]"
                  >
                    <ChevronLeft size={14} /> Retour
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </section>

          <aside className="flex flex-col gap-5">
            <motion.div
              initial={{ opacity: 0, x: 18 }}
              animate={{ opacity: 1, x: 0 }}
              className="bistro-card rounded-[28px] p-6"
            >
              <p className="text-xs uppercase tracking-[0.24em] text-[var(--wine)] font-semibold">Ce que tu gagnes</p>
              <ul className="mt-4 space-y-4">
                <li className="flex items-start gap-3 text-sm text-[rgba(29,23,19,0.75)]">
                  <Clock3 size={16} className="mt-0.5 text-[var(--wine)]" />
                  Duree alignee sur ton repas, pas de video qui deborde.
                </li>
                <li className="flex items-start gap-3 text-sm text-[rgba(29,23,19,0.75)]">
                  <Sparkles size={16} className="mt-0.5 text-[var(--wine)]" />
                  Selection contextuelle selon ton humeur du moment.
                </li>
                <li className="flex items-start gap-3 text-sm text-[rgba(29,23,19,0.75)]">
                  <Shuffle size={16} className="mt-0.5 text-[var(--wine)]" />
                  Mode surprise pour decouvrir des videos inattendues.
                </li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 18 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="rounded-[28px] bg-[var(--charcoal)] text-[#f4ecdf] p-6"
            >
              <p className="text-xs uppercase tracking-[0.2em] text-[#cfab74] font-semibold">LetMeWatch</p>
              <p className="mt-4 font-serif text-3xl leading-tight">"Decris ton mood, on trouve ta video."</p>
              <p className="mt-3 text-sm text-[#dbc9b1] leading-relaxed">
                Une reco utile et rapide pour ton repas. Tu peux etre precis, vague, ou
                creatif: l'input libre est la pour ca.
              </p>
              <div className="mt-6 h-[1px] bg-[rgba(244,236,223,0.2)]" />
              <p className="mt-4 text-xs uppercase tracking-[0.14em] text-[#b5a086]">No scroll, juste des choix utiles</p>
            </motion.div>
          </aside>
        </div>
      </div>
    </main>
  );
}
