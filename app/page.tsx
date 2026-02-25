"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { useRouter } from "next/navigation";
import { Utensils, ChevronRight, Shuffle, Zap, Clock, Target } from "lucide-react";

const DURATIONS = [
  { label: "15 min", value: 15, icon: "⚡", desc: "Pause rapide" },
  { label: "30 min", value: 30, icon: "🍽️", desc: "Repas classique" },
  { label: "1h+", value: 65, icon: "🛋️", desc: "Je prends mon temps" },
];

const MOODS = [
  { label: "Drôle", value: "funny comedy entertainment humor", icon: "😂" },
  { label: "Chill", value: "relaxing calm lofi ambient chill", icon: "😌" },
  { label: "Info", value: "educational documentary explained knowledge", icon: "🧠" },
  { label: "Gaming", value: "gaming gameplay let's play commentary", icon: "🎮" },
  { label: "Cuisine", value: "food cooking recipe street food", icon: "🍜" },
  { label: "Cinéma", value: "cinema movie review film analysis", icon: "🎬" },
  { label: "Découverte", value: "travel nature exploration discovery world", icon: "🌍" },
  { label: "Musique", value: "music live concert performance artist", icon: "🎵" },
  { label: "Science", value: "science technology innovation space physics", icon: "🔬" },
  { label: "J'sais pas", value: "interesting popular trending viral quality", icon: "🤷" },
];

const LANGUAGES = [
  { label: "Français", value: "fr", flag: "🇫🇷" },
  { label: "English", value: "en", flag: "🇬🇧" },
  { label: "Peu importe", value: "any", flag: "🌐" },
];

type Step = "welcome" | "duration" | "mood" | "language";

const pageVariants: Variants = {
  enter: { opacity: 0, x: 40 },
  center: { opacity: 1, x: 0, transition: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] } },
  exit: { opacity: 0, x: -40, transition: { duration: 0.25, ease: [0.4, 0, 1, 1] } },
};

export default function Home() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("welcome");
  const [duration, setDuration] = useState<number | null>(null);
  const [mood, setMood] = useState<string | null>(null);
  const [customMood, setCustomMood] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

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
    <main className="min-h-screen bg-[#1A1A2E] flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Ambient blobs */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: "-15%",
          left: "-10%",
          width: "600px",
          height: "600px",
          borderRadius: "50%",
          background: "#6C63FF",
          opacity: 0.07,
          filter: "blur(120px)",
        }}
      />
      <div
        className="absolute pointer-events-none"
        style={{
          bottom: "-20%",
          right: "-10%",
          width: "500px",
          height: "500px",
          borderRadius: "50%",
          background: "#FF6584",
          opacity: 0.07,
          filter: "blur(100px)",
        }}
      />

      <div className="relative w-full max-w-2xl">
        <AnimatePresence mode="wait">
          {/* ─── WELCOME ─── */}
          {step === "welcome" && (
            <motion.div
              key="welcome"
              variants={pageVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="text-center"
            >
              {/* Logo */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.4 }}
                className="flex items-center justify-center mb-8"
              >
                <div
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: 20,
                    background: "linear-gradient(135deg, #6C63FF, #FF6584)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 0 40px rgba(108,99,255,0.4)",
                  }}
                >
                  <Utensils size={28} color="white" />
                </div>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="text-6xl md:text-7xl font-black mb-4 tracking-tight"
              >
                <span className="text-white">Let</span>
                <span
                  style={{
                    background: "linear-gradient(135deg, #6C63FF, #FF6584)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  Me
                </span>
                <span className="text-white">Eat</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-xl mb-2"
                style={{ color: "#A0AEC0" }}
              >
                Tu manges. On s'occupe du reste.
              </motion.p>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.25 }}
                className="text-sm mb-10"
                style={{ color: "#6B7280" }}
              >
                3 questions · 10 secondes · la vidéo parfaite pour ton repas
              </motion.p>

              {/* CTAs */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-col sm:flex-row gap-3 justify-center mb-12"
              >
                <motion.button
                  whileHover={{ scale: 1.03, boxShadow: "0 0 40px rgba(108,99,255,0.5)" }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setStep("duration")}
                  className="flex items-center justify-center gap-2 px-8 py-4 rounded-2xl text-white font-semibold text-lg"
                  style={{
                    background: "linear-gradient(135deg, #6C63FF, #7C73FF)",
                    boxShadow: "0 0 25px rgba(108,99,255,0.3)",
                  }}
                >
                  Trouve-moi quelque chose à regarder
                  <ChevronRight size={20} />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleSurprise}
                  className="flex items-center justify-center gap-2 px-6 py-4 rounded-2xl font-semibold transition-colors"
                  style={{
                    border: "1px solid rgba(255,101,132,0.35)",
                    color: "#FF6584",
                    background: "rgba(255,101,132,0.05)",
                  }}
                  onMouseEnter={(e) =>
                    ((e.currentTarget as HTMLElement).style.background =
                      "rgba(255,101,132,0.12)")
                  }
                  onMouseLeave={(e) =>
                    ((e.currentTarget as HTMLElement).style.background =
                      "rgba(255,101,132,0.05)")
                  }
                >
                  <Shuffle size={18} />
                  Mode Surprise
                </motion.button>
              </motion.div>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="flex items-center justify-center gap-8 text-sm"
                style={{ color: "#6B7280" }}
              >
                <div className="flex items-center gap-2">
                  <Clock size={14} />
                  <span>&lt; 10 sec</span>
                </div>
                <div className="flex items-center gap-2">
                  <Target size={14} />
                  <span>7 filtres</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap size={14} />
                  <span>IA Groq</span>
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* ─── DURATION ─── */}
          {step === "duration" && (
            <motion.div
              key="duration"
              variants={pageVariants}
              initial="enter"
              animate="center"
              exit="exit"
            >
              <StepDots current={1} />
              <h2 className="text-3xl font-bold text-white text-center mb-2 mt-6">
                T'as combien de temps ?
              </h2>
              <p className="text-center text-sm mb-8" style={{ color: "#8892A4" }}>
                On adapte la durée des vidéos à ton repas
              </p>

              <div className="grid grid-cols-3 gap-4">
                {DURATIONS.map((d, i) => (
                  <motion.button
                    key={d.value}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.06 }}
                    whileHover={{ scale: 1.04, y: -3 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => {
                      setDuration(d.value);
                      setTimeout(() => setStep("mood"), 120);
                    }}
                    className="flex flex-col items-center gap-3 p-6 rounded-2xl transition-all"
                    style={{
                      border: "1px solid rgba(255,255,255,0.08)",
                      background: "rgba(255,255,255,0.04)",
                    }}
                    onMouseEnter={(e) => {
                      const el = e.currentTarget as HTMLElement;
                      el.style.border = "1px solid rgba(108,99,255,0.5)";
                      el.style.background = "rgba(108,99,255,0.1)";
                    }}
                    onMouseLeave={(e) => {
                      const el = e.currentTarget as HTMLElement;
                      el.style.border = "1px solid rgba(255,255,255,0.08)";
                      el.style.background = "rgba(255,255,255,0.04)";
                    }}
                  >
                    <span className="text-4xl">{d.icon}</span>
                    <span className="font-bold text-xl text-white">{d.label}</span>
                    <span className="text-xs" style={{ color: "#8892A4" }}>
                      {d.desc}
                    </span>
                  </motion.button>
                ))}
              </div>

              <button
                onClick={() => setStep("welcome")}
                className="flex items-center gap-1 mx-auto mt-6 text-sm transition-colors"
                style={{ color: "#6B7280" }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLElement).style.color = "#A0AEC0")
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLElement).style.color = "#6B7280")
                }
              >
                ← Retour
              </button>
            </motion.div>
          )}

          {/* ─── MOOD ─── */}
          {step === "mood" && (
            <motion.div
              key="mood"
              variants={pageVariants}
              initial="enter"
              animate="center"
              exit="exit"
            >
              <StepDots current={2} />
              <h2 className="text-3xl font-bold text-white text-center mb-2 mt-6">
                C'est quoi l'ambiance ?
              </h2>
              <p className="text-center text-sm mb-7" style={{ color: "#8892A4" }}>
                Clique ou écris ce qui te passe par la tête
              </p>

              <div className="grid grid-cols-5 gap-2 mb-5">
                {MOODS.map((m, i) => (
                  <motion.button
                    key={m.value}
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.04 }}
                    whileHover={{ scale: 1.08, y: -2 }}
                    whileTap={{ scale: 0.94 }}
                    onClick={() => {
                      setMood(m.value);
                      setCustomMood("");
                      setTimeout(() => setStep("language"), 120);
                    }}
                    className="flex flex-col items-center gap-1.5 p-3 rounded-xl transition-all"
                    style={{
                      border:
                        mood === m.value && !customMood
                          ? "1px solid rgba(108,99,255,0.7)"
                          : "1px solid rgba(255,255,255,0.07)",
                      background:
                        mood === m.value && !customMood
                          ? "rgba(108,99,255,0.15)"
                          : "rgba(255,255,255,0.03)",
                    }}
                  >
                    <span className="text-xl">{m.icon}</span>
                    <span className="text-xs font-medium text-white">{m.label}</span>
                  </motion.button>
                ))}
              </div>

              {/* Free text */}
              <div className="relative">
                <input
                  ref={inputRef}
                  type="text"
                  value={customMood}
                  onChange={(e) => {
                    setCustomMood(e.target.value);
                    if (e.target.value) setMood(null);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && customMood.trim()) {
                      setStep("language");
                    }
                  }}
                  placeholder="Ou tape ton mood... (ex: 'j'ai la flemme de réfléchir')"
                  className="w-full rounded-2xl px-5 py-4 text-sm text-white outline-none transition-all"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: customMood
                      ? "1px solid rgba(108,99,255,0.5)"
                      : "1px solid rgba(255,255,255,0.08)",
                    color: "white",
                  }}
                />
                <AnimatePresence>
                  {customMood && (
                    <motion.button
                      initial={{ opacity: 0, scale: 0.7 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.7 }}
                      onClick={() => setStep("language")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 px-4 py-2 rounded-xl text-white text-sm font-semibold"
                      style={{ background: "#6C63FF" }}
                    >
                      OK →
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>

              <button
                onClick={() => setStep("duration")}
                className="flex items-center gap-1 mx-auto mt-5 text-sm transition-colors"
                style={{ color: "#6B7280" }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLElement).style.color = "#A0AEC0")
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLElement).style.color = "#6B7280")
                }
              >
                ← Retour
              </button>
            </motion.div>
          )}

          {/* ─── LANGUAGE ─── */}
          {step === "language" && (
            <motion.div
              key="language"
              variants={pageVariants}
              initial="enter"
              animate="center"
              exit="exit"
            >
              <StepDots current={3} />
              <h2 className="text-3xl font-bold text-white text-center mb-2 mt-6">
                Dans quelle langue ?
              </h2>
              <p className="text-center text-sm mb-8" style={{ color: "#8892A4" }}>
                Pour filtrer les vidéos recommandées
              </p>

              <div className="grid grid-cols-3 gap-4">
                {LANGUAGES.map((l, i) => (
                  <motion.button
                    key={l.value}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.07 }}
                    whileHover={{
                      scale: 1.05,
                      y: -4,
                      boxShadow: "0 0 30px rgba(108,99,255,0.25)",
                    }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => navigate(l.value)}
                    className="flex flex-col items-center gap-3 p-7 rounded-2xl transition-all"
                    style={{
                      border: "1px solid rgba(255,255,255,0.08)",
                      background: "rgba(255,255,255,0.04)",
                    }}
                    onMouseEnter={(e) => {
                      const el = e.currentTarget as HTMLElement;
                      el.style.border = "1px solid rgba(108,99,255,0.5)";
                      el.style.background = "rgba(108,99,255,0.1)";
                    }}
                    onMouseLeave={(e) => {
                      const el = e.currentTarget as HTMLElement;
                      el.style.border = "1px solid rgba(255,255,255,0.08)";
                      el.style.background = "rgba(255,255,255,0.04)";
                    }}
                  >
                    <span className="text-5xl">{l.flag}</span>
                    <span className="font-bold text-white text-base">{l.label}</span>
                  </motion.button>
                ))}
              </div>

              <button
                onClick={() => setStep("mood")}
                className="flex items-center gap-1 mx-auto mt-6 text-sm transition-colors"
                style={{ color: "#6B7280" }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLElement).style.color = "#A0AEC0")
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLElement).style.color = "#6B7280")
                }
              >
                ← Retour
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}

function StepDots({ current }: { current: number }) {
  return (
    <div className="flex items-center justify-center gap-2">
      {[1, 2, 3].map((n) => (
        <motion.div
          key={n}
          animate={{
            width: n === current ? 28 : 8,
            background: n <= current ? "#6C63FF" : "rgba(255,255,255,0.15)",
          }}
          transition={{ duration: 0.3 }}
          style={{ height: 4, borderRadius: 2 }}
        />
      ))}
      <span className="text-xs ml-1" style={{ color: "#6B7280" }}>
        {current}/3
      </span>
    </div>
  );
}
