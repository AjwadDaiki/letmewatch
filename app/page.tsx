"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Brain,
  ChevronLeft,
  Clock,
  Languages,
  Loader2,
  Search,
  Sparkles,
  Utensils,
  Youtube,
  Zap,
} from "lucide-react";

type Step = "welcome" | "time" | "context" | "language" | "loading";
type Direction = "forward" | "backward";
type Language = "fr" | "en";

interface TimeOption {
  id: string;
  label: string;
  minutes: number;
  emoji: string;
}

interface KeywordOption {
  id: string;
  label: string;
  emoji: string;
  category: "mood" | "content" | "style";
  query: string;
}

const timeOptions: TimeOption[] = [
  { id: "quick", label: "15 min", minutes: 15, emoji: "⚡" },
  { id: "normal", label: "30 min", minutes: 30, emoji: "🍽️" },
  { id: "long", label: "1 heure", minutes: 60, emoji: "🍷" },
  { id: "relax", label: "1h30", minutes: 90, emoji: "🛋️" },
];

const keywordOptions: KeywordOption[] = [
  { id: "lazy", label: "Flemme", emoji: "😴", category: "mood", query: "relaxing chill easy watch" },
  { id: "tired", label: "Creve", emoji: "😮‍💨", category: "mood", query: "light entertaining low effort" },
  { id: "happy", label: "Bonne vibe", emoji: "😄", category: "mood", query: "positive upbeat fun" },
  { id: "stressed", label: "Stresse", emoji: "😵", category: "mood", query: "calm soothing no stress" },
  { id: "funny", label: "Drole", emoji: "😂", category: "content", query: "funny comedy entertainment humor" },
  { id: "gaming", label: "Gaming", emoji: "🎮", category: "content", query: "gaming gameplay highlights" },
  { id: "docu", label: "Docu", emoji: "🎬", category: "content", query: "documentary educational interesting" },
  { id: "music", label: "Musique", emoji: "🎵", category: "content", query: "music live performance session" },
  { id: "science", label: "Science", emoji: "🔬", category: "content", query: "science technology explained" },
  { id: "short", label: "Court", emoji: "💥", category: "style", query: "short videos quick format" },
  { id: "story", label: "Story", emoji: "📖", category: "style", query: "storytelling narrative" },
  { id: "mindblow", label: "Mindblow", emoji: "🤯", category: "style", query: "mind blowing facts discoveries" },
];

const languageOptions: { id: Language; label: string; emoji: string; helper: string }[] = [
  { id: "fr", label: "Francais", emoji: "🇫🇷", helper: "Creators FR en priorite" },
  { id: "en", label: "English", emoji: "🇬🇧", helper: "Creators EN en priorite" },
];

const loadingPhases = [
  { icon: Brain, text: "Analyse de ton contexte..." },
  { icon: Search, text: "Recherche des meilleures videos..." },
  { icon: Sparkles, text: "Selection finale en cours..." },
];

const panelVariants: Variants = {
  enter: (direction: Direction) => ({
    opacity: 0,
    y: 24,
    x: direction === "forward" ? 28 : -28,
    scale: 0.98,
    filter: "blur(4px)",
  }),
  center: {
    opacity: 1,
    y: 0,
    x: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: { duration: 0.46, ease: [0.22, 1, 0.36, 1] },
  },
  exit: (direction: Direction) => ({
    opacity: 0,
    y: -18,
    x: direction === "forward" ? -24 : 24,
    scale: 0.985,
    filter: "blur(2px)",
    transition: { duration: 0.24, ease: [0.4, 0, 1, 1] },
  }),
};

export default function Home() {
  const router = useRouter();

  const [step, setStep] = useState<Step>("welcome");
  const [direction, setDirection] = useState<Direction>("forward");
  const [selectedTime, setSelectedTime] = useState<TimeOption | null>(null);
  const [contextText, setContextText] = useState("");
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(null);
  const [loadingIndex, setLoadingIndex] = useState(0);
  const [navigating, setNavigating] = useState(false);

  const canContinue = useMemo(
    () => contextText.trim().length > 0 || selectedKeywords.length > 0,
    [contextText, selectedKeywords]
  );

  const goToStep = (next: Step, dir: Direction = "forward") => {
    setDirection(dir);
    setStep(next);
  };

  const toggleKeyword = (keywordId: string) => {
    setSelectedKeywords((prev) =>
      prev.includes(keywordId)
        ? prev.filter((id) => id !== keywordId)
        : [...prev, keywordId]
    );
  };

  const startLoading = (language: Language) => {
    if (!selectedTime || !canContinue) return;
    setSelectedLanguage(language);
    goToStep("loading");
  };

  useEffect(() => {
    if (step !== "loading" || !selectedTime || !selectedLanguage) return;

    setLoadingIndex(0);
    const interval = window.setInterval(() => {
      setLoadingIndex((prev) => (prev + 1) % loadingPhases.length);
    }, 750);

    const timeout = window.setTimeout(() => {
      const keywordQuery = selectedKeywords
        .map((id) => keywordOptions.find((item) => item.id === id)?.query ?? "")
        .join(" ");
      const mood = [contextText.trim(), keywordQuery]
        .join(" ")
        .trim() || "interesting popular trending";
      const params = new URLSearchParams({
        mood,
        duration: String(selectedTime.minutes),
        language: selectedLanguage,
        surprise: "false",
      });

      setNavigating(true);
      window.setTimeout(() => {
        router.push(`/results?${params.toString()}`);
      }, 260);
    }, 1750);

    return () => {
      window.clearInterval(interval);
      window.clearTimeout(timeout);
    };
  }, [step, selectedTime, selectedKeywords, contextText, selectedLanguage, router]);

  const handleContextEnter = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey && canContinue) {
      event.preventDefault();
      goToStep("language");
    }
  };

  const moodKeywords = keywordOptions.filter((item) => item.category === "mood");
  const contentKeywords = keywordOptions.filter((item) => item.category === "content");
  const styleKeywords = keywordOptions.filter((item) => item.category === "style");

  return (
    <div className="min-h-screen overflow-hidden bg-[#141518] text-white scrollbar-yt">
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

      <main className="min-h-screen px-4 pb-8 pt-8 sm:px-6 lg:px-8">
        <div className="relative mx-auto flex min-h-[88vh] w-full max-w-4xl flex-col justify-center">
          <AnimatePresence custom={direction} mode="wait">
            {step === "welcome" && (
              <motion.section
                key="welcome"
                custom={direction}
                variants={panelVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="flex flex-col items-center justify-center"
              >
                <div className="relative mb-8">
                  <div className="animate-float flex h-28 w-28 items-center justify-center rounded-3xl bg-gradient-to-br from-[#FF0000] to-[#CC0000] shadow-lg shadow-red-500/18">
                    <div className="relative">
                      <Youtube className="h-14 w-14 text-white" />
                      <div className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-white">
                        <Utensils className="h-2.5 w-2.5 text-[#FF0000]" />
                      </div>
                    </div>
                  </div>
                  <div className="absolute inset-0 -z-10 rounded-3xl bg-[#FF0000] opacity-10 blur-2xl" />
                </div>

                <h1 className="text-center text-5xl font-bold sm:text-6xl">
                  LetMe<span className="text-[#FF0000]">Watch</span>
                </h1>
                <p className="mb-12 mt-4 max-w-xl text-center text-xl text-[#AAAAAA] sm:text-2xl">
                  Trouve la bonne video YouTube selon ton temps et ton contexte.
                </p>

                <div className="mb-12 flex flex-wrap justify-center gap-3">
                  {[
                    { icon: Clock, text: "Sans compte" },
                    { icon: Zap, text: "Resultat rapide" },
                    { icon: Sparkles, text: "Contexte libre" },
                  ].map((feature) => (
                    <div
                      key={feature.text}
                      className="flex items-center gap-2 rounded-full border border-[#3F3F3F]/50 bg-[#1F1F1F] px-4 py-2.5 text-[#AAAAAA] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#5A5A5A] hover:text-white"
                    >
                      <feature.icon className="h-4 w-4 text-[#FF0000]" />
                      <span className="text-sm font-medium">{feature.text}</span>
                    </div>
                  ))}
                </div>

                <div className="mb-12 grid w-full max-w-2xl grid-cols-1 gap-4 sm:grid-cols-3">
                  {[
                    { num: "1", text: "Choisis ton temps" },
                    { num: "2", text: "Decris ton contexte" },
                    { num: "3", text: "Choisis la langue" },
                  ].map((item) => (
                    <div
                      key={item.num}
                      className="flex items-center gap-3 rounded-xl border border-[#3F3F3F]/30 bg-[#1F1F1F]/60 p-4 transition-all duration-300 hover:-translate-y-1 hover:border-[#505050]/70"
                    >
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#FF0000] text-sm font-bold">
                        {item.num}
                      </div>
                      <span className="text-sm text-[#CCCCCC]">{item.text}</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => goToStep("time")}
                  className="group relative overflow-hidden rounded-full bg-gradient-to-r from-[#FF0000] to-[#CC0000] px-10 py-5 text-lg font-bold text-white transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-red-500/35 active:scale-95"
                >
                  <div className="absolute inset-0 -translate-x-[200%] rounded-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-[200%]" />
                  <span className="relative flex items-center gap-3">
                    Demarrer
                    <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </span>
                </button>
              </motion.section>
            )}

            {step === "time" && (
              <motion.section
                key="time"
                custom={direction}
                variants={panelVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="py-8"
              >
                <button
                  onClick={() => goToStep("welcome", "backward")}
                  className="mb-8 inline-flex items-center gap-2 text-[#AAAAAA] transition-colors hover:text-white"
                >
                  <ChevronLeft className="h-5 w-5" />
                  Retour
                </button>

                <div className="mb-8 flex items-center gap-2">
                  <div className="h-1 flex-1 rounded-full bg-[#FF0000]" />
                  <div className="h-1 flex-1 rounded-full bg-[#3F3F3F]" />
                  <div className="h-1 flex-1 rounded-full bg-[#3F3F3F]" />
                </div>

                <div className="mb-10 text-center">
                  <span className="mb-4 inline-block rounded-full bg-[#FF0000]/20 px-3 py-1 text-sm font-medium text-[#FF0000]">
                    Etape 1 sur 3
                  </span>
                  <h2 className="mb-3 text-3xl font-bold text-white sm:text-4xl">
                    Combien de temps tu as ?
                  </h2>
                  <p className="text-[#AAAAAA]">
                    On aligne les videos sur ton timing.
                  </p>
                </div>

                <div className="mx-auto grid max-w-3xl grid-cols-2 gap-4 sm:grid-cols-4">
                  {timeOptions.map((option, index) => (
                    <button
                      key={option.id}
                      onClick={() => {
                        setSelectedTime(option);
                        window.setTimeout(() => goToStep("context"), 360);
                      }}
                      className={`
                        group relative rounded-2xl border-2 p-6 transition-all duration-300
                        hover:-translate-y-1 hover:shadow-xl hover:shadow-black/30
                        ${selectedTime?.id === option.id
                          ? "border-[#FF0000] bg-[#FF0000]/10"
                          : "border-[#3F3F3F]/50 bg-[#1F1F1F] hover:border-[#FF0000] hover:bg-[#272727]"
                        }
                      `}
                      style={{ animationDelay: `${index * 0.08}s` }}
                    >
                      <div className="flex flex-col items-center gap-3">
                        <span className="text-4xl transition-transform group-hover:scale-110">{option.emoji}</span>
                        <span className="text-lg font-semibold text-white">{option.label}</span>
                      </div>
                      <div className="absolute inset-0 rounded-2xl bg-[#FF0000] opacity-0 transition-opacity group-hover:opacity-5" />
                    </button>
                  ))}
                </div>
              </motion.section>
            )}

            {step === "context" && (
              <motion.section
                key="context"
                custom={direction}
                variants={panelVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="py-8"
              >
                <button
                  onClick={() => goToStep("time", "backward")}
                  className="mb-6 inline-flex items-center gap-2 text-[#AAAAAA] transition-colors hover:text-white"
                >
                  <ChevronLeft className="h-5 w-5" />
                  Retour
                </button>

                <div className="mb-6 flex items-center gap-2">
                  <div className="h-1 flex-1 rounded-full bg-[#FF0000]" />
                  <div className="h-1 flex-1 rounded-full bg-[#FF0000]" />
                  <div className="h-1 flex-1 rounded-full bg-[#3F3F3F]" />
                </div>

                <div className="mb-8 text-center">
                  <span className="mb-3 inline-block rounded-full bg-[#FF0000]/20 px-3 py-1 text-sm font-medium text-[#FF0000]">
                    Etape 2 sur 3
                  </span>
                  <h2 className="mb-2 text-3xl font-bold text-white sm:text-4xl">
                    Decris ce que tu veux regarder
                  </h2>
                  <p className="text-[#AAAAAA]">
                    Appuie sur Entrer pour passer a la langue.
                  </p>
                </div>

                {selectedTime && (
                  <div className="mb-6 flex justify-center">
                    <div className="inline-flex items-center gap-2 rounded-full bg-[#272727] px-4 py-2 text-[#AAAAAA]">
                      <span>{selectedTime.emoji}</span>
                      <span>{selectedTime.label}</span>
                      <button onClick={() => goToStep("time", "backward")} className="ml-2 text-[#666666] hover:text-white">
                        Modifier
                      </button>
                    </div>
                  </div>
                )}

                <div className="mx-auto mb-5 w-full max-w-2xl">
                  <textarea
                    value={contextText}
                    onChange={(event) => setContextText(event.target.value)}
                    onKeyDown={handleContextEnter}
                    placeholder="Ex: j ai envie de quelque chose de fun et pas trop long..."
                    className="w-full resize-none rounded-2xl border-2 border-[#3F3F3F]/50 bg-[#1F1F1F] px-5 py-4 text-lg leading-relaxed text-white outline-none transition-all duration-300 placeholder:text-[#666666] focus:border-[#FF0000] focus:shadow-[0_0_0_4px_rgba(255,0,51,0.12)]"
                    rows={3}
                  />

                  <div className="mt-3 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#3F3F3F]/40 bg-[#1B1B1D] px-3 py-2.5">
                    <p className="text-xs text-[#9A9A9A]">
                      `Enter` continue directement
                    </p>
                    <button
                      onClick={() => canContinue && goToStep("language")}
                      disabled={!canContinue}
                      className="yt-button rounded-lg bg-[#FF0000] px-3.5 py-2 text-xs font-semibold text-white disabled:cursor-not-allowed disabled:opacity-45"
                    >
                      Continuer
                    </button>
                  </div>
                </div>

                <div className="mx-auto mb-8 w-full max-w-3xl">
                  <p className="mb-4 text-center text-sm text-[#666666]">
                    Ou selectionne des mots-cles
                  </p>

                  <div className="mb-3 flex flex-wrap justify-center gap-2">
                    {moodKeywords.map((keyword) => (
                      <KeywordPill
                        key={keyword.id}
                        keyword={keyword}
                        selected={selectedKeywords.includes(keyword.id)}
                        onToggle={toggleKeyword}
                      />
                    ))}
                  </div>

                  <div className="mb-3 flex flex-wrap justify-center gap-2">
                    {contentKeywords.map((keyword) => (
                      <KeywordPill
                        key={keyword.id}
                        keyword={keyword}
                        selected={selectedKeywords.includes(keyword.id)}
                        onToggle={toggleKeyword}
                      />
                    ))}
                  </div>

                  <div className="flex flex-wrap justify-center gap-2">
                    {styleKeywords.map((keyword) => (
                      <KeywordPill
                        key={keyword.id}
                        keyword={keyword}
                        selected={selectedKeywords.includes(keyword.id)}
                        onToggle={toggleKeyword}
                      />
                    ))}
                  </div>
                </div>

                <div className="sticky bottom-4 z-10 mx-auto w-full max-w-md">
                  <button
                    onClick={() => canContinue && goToStep("language")}
                    disabled={!canContinue}
                    className={`
                      relative w-full overflow-hidden rounded-xl px-8 py-4 text-lg font-bold text-white transition-all duration-300
                      ${canContinue
                        ? "bg-gradient-to-r from-[#FF0000] to-[#CC0000] hover:scale-[1.015] hover:shadow-xl hover:shadow-red-500/30 active:scale-[0.98]"
                        : "cursor-not-allowed bg-[#272727] text-[#666666]"
                      }
                    `}
                  >
                    {canContinue && (
                      <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-[shimmer_2s_infinite]" />
                    )}
                    <span className="relative flex items-center justify-center gap-3">
                      <Languages className="h-6 w-6" />
                      Choisir la langue
                      <ArrowRight className="h-5 w-5" />
                    </span>
                  </button>
                </div>
              </motion.section>
            )}

            {step === "language" && (
              <motion.section
                key="language"
                custom={direction}
                variants={panelVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="py-8"
              >
                <button
                  onClick={() => goToStep("context", "backward")}
                  className="mb-6 inline-flex items-center gap-2 text-[#AAAAAA] transition-colors hover:text-white"
                >
                  <ChevronLeft className="h-5 w-5" />
                  Retour
                </button>

                <div className="mb-6 flex items-center gap-2">
                  <div className="h-1 flex-1 rounded-full bg-[#FF0000]" />
                  <div className="h-1 flex-1 rounded-full bg-[#FF0000]" />
                  <div className="h-1 flex-1 rounded-full bg-[#FF0000]" />
                </div>

                <div className="mb-8 text-center">
                  <span className="mb-3 inline-block rounded-full bg-[#FF0000]/20 px-3 py-1 text-sm font-medium text-[#FF0000]">
                    Etape 3 sur 3
                  </span>
                  <h2 className="mb-2 text-3xl font-bold text-white sm:text-4xl">
                    Choisis la langue
                  </h2>
                  <p className="text-[#AAAAAA]">
                    Derniere etape avant la recherche.
                  </p>
                </div>

                <div className="mx-auto grid w-full max-w-2xl gap-3 sm:grid-cols-2">
                  {languageOptions.map((option) => (
                    <motion.button
                      key={option.id}
                      whileHover={{ y: -3, scale: 1.01 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => startLoading(option.id)}
                      className="group rounded-2xl border border-[#3F3F3F]/50 bg-[#1F1F1F] px-5 py-5 text-left transition-all duration-300 hover:border-[#FF0000]/60 hover:bg-[#272727] hover:shadow-xl hover:shadow-black/30"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-xl font-semibold text-white">{option.label}</p>
                          <p className="mt-1 text-sm text-[#AAAAAA]">{option.helper}</p>
                        </div>
                        <span className="text-3xl">{option.emoji}</span>
                      </div>
                      <div className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-[#FF6B82]">
                        Lancer
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </div>
                    </motion.button>
                  ))}
                </div>
              </motion.section>
            )}

            {step === "loading" && (
              <motion.section
                key="loading"
                custom={direction}
                variants={panelVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="mx-auto w-full max-w-md"
              >
                <div className="mb-12 flex flex-col items-center">
                  <div className="relative">
                    <div className="h-24 w-24 animate-spin rounded-full border-4 border-[#272727] border-t-[#FF0000]" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-[#FF0000] to-[#CC0000]">
                        <Youtube className="h-8 w-8 text-white" />
                      </div>
                    </div>
                    <div className="absolute inset-0 rounded-full bg-[#FF0000] opacity-10 blur-xl" />
                  </div>

                  <p className="mt-8 text-2xl font-bold text-white">
                    Preparation en cours...
                  </p>
                  <p className="mt-2 text-[#AAAAAA]">
                    Moins de 10 secondes.
                  </p>
                </div>

                <div className="space-y-3">
                  {loadingPhases.map((phase, index) => {
                    const active = index === loadingIndex;
                    const done = index < loadingIndex;
                    return (
                      <div
                        key={phase.text}
                        className={`
                          flex items-center gap-4 rounded-xl border p-4 transition-all duration-300
                          ${active
                            ? "scale-105 border-[#FF0000]/50 bg-[#FF0000]/10"
                            : done
                              ? "border-[#3F3F3F]/30 bg-[#1F1F1F] opacity-65"
                              : "border-[#3F3F3F]/30 bg-[#1F1F1F] opacity-40"
                          }
                        `}
                      >
                        <div
                          className={`
                            flex h-10 w-10 items-center justify-center rounded-lg
                            ${active ? "bg-[#FF0000] text-white" : "bg-[#272727] text-[#666666]"}
                          `}
                        >
                          {active ? (
                            <Loader2 className="h-5 w-5 animate-spin" />
                          ) : (
                            <phase.icon className="h-5 w-5" />
                          )}
                        </div>
                        <span className={active ? "text-white" : "text-[#AAAAAA]"}>
                          {phase.text}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </motion.section>
            )}
          </AnimatePresence>
        </div>
      </main>

      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-[#FF0000] opacity-[0.018] blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 h-80 w-80 rounded-full bg-[#FF0000] opacity-[0.015] blur-3xl" />
      </div>
    </div>
  );
}

function KeywordPill({
  keyword,
  selected,
  onToggle,
}: {
  keyword: KeywordOption;
  selected: boolean;
  onToggle: (keywordId: string) => void;
}) {
  return (
    <button
      onClick={() => onToggle(keyword.id)}
      className={`
        inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm transition-all duration-200
        hover:-translate-y-0.5
        ${selected
          ? "bg-[#FF0000] text-white shadow-md shadow-red-500/20"
          : "border border-[#3F3F3F]/50 bg-[#272727] text-[#AAAAAA] hover:border-[#5B5B5B] hover:bg-[#343434] hover:text-white"
        }
      `}
    >
      <span>{keyword.emoji}</span>
      <span>{keyword.label}</span>
    </button>
  );
}
