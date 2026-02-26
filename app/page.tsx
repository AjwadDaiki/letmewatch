"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Clock,
  ArrowRight,
  Play,
  ChevronLeft,
  Search,
  Laugh,
  Coffee,
  BookOpen,
  Gamepad2,
  ChefHat,
  Film,
  Music,
  Zap,
  Globe,
  Shuffle,
} from "lucide-react";

/* ── Types ── */
interface TimeOption {
  value: number;
  label: string;
  description: string;
  note: string;
}

interface Category {
  id: string;
  label: string;
  icon: React.ReactNode;
  bg: string;
  color: string;
}

type Step = "time" | "search";

/* ── Data ── */
const timeOptions: TimeOption[] = [
  { value: 15, label: "15 min", description: "Pause éclair",   note: "2–3 vidéos courtes" },
  { value: 30, label: "30 min", description: "Repas standard", note: "4–6 vidéos" },
  { value: 65, label: "1h+",    description: "Long repas",     note: "8+ vidéos" },
];

const categories: Category[] = [
  { id: "funny",       label: "Drôle",     icon: <Laugh     className="w-4 h-4" />, bg: "rgba(234,179,8,0.12)",   color: "#eab308" },
  { id: "chill",       label: "Détente",   icon: <Coffee    className="w-4 h-4" />, bg: "rgba(59,130,246,0.12)",  color: "#60a5fa" },
  { id: "educational", label: "Éducatif",  icon: <BookOpen  className="w-4 h-4" />, bg: "rgba(34,197,94,0.12)",   color: "#4ade80" },
  { id: "gaming",      label: "Gaming",    icon: <Gamepad2  className="w-4 h-4" />, bg: "rgba(168,85,247,0.12)",  color: "#c084fc" },
  { id: "cooking",     label: "Cuisine",   icon: <ChefHat   className="w-4 h-4" />, bg: "rgba(249,115,22,0.12)",  color: "#fb923c" },
  { id: "cinema",      label: "Cinéma",    icon: <Film      className="w-4 h-4" />, bg: "rgba(236,72,153,0.12)",  color: "#f472b6" },
  { id: "music",       label: "Musique",   icon: <Music     className="w-4 h-4" />, bg: "rgba(6,182,212,0.12)",   color: "#22d3ee" },
  { id: "science",     label: "Science",   icon: <Zap       className="w-4 h-4" />, bg: "rgba(16,185,129,0.12)",  color: "#34d399" },
  { id: "travel",      label: "Voyage",    icon: <Globe     className="w-4 h-4" />, bg: "rgba(99,102,241,0.12)",  color: "#818cf8" },
  { id: "surprise",    label: "Surprise",  icon: <Shuffle   className="w-4 h-4" />, bg: "rgba(239,68,68,0.12)",   color: "#f87171" },
];

/* ── Shared tokens ── */
const S = {
  card:    { background: "#1c1917", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "16px" } as const,
  surface: "#26201d",
  muted:   "rgba(255,255,255,0.46)",
  red:     "#ef4444",
  redGlow: "rgba(239,68,68,0.22)",
};

/* ──────────────────────────────────────── */
export default function Home() {
  const router   = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const [step,   setStep]   = useState<Step>("time");
  const [time,   setTime]   = useState<number | null>(null);
  const [text,   setText]   = useState("");
  const [fading, setFading] = useState(false);

  function goTo(next: Step) {
    setFading(true);
    setTimeout(() => { setStep(next); setFading(false); }, 340);
  }

  function handleTimeSelect(v: number) {
    setTime(v);
    goTo("search");
    setTimeout(() => inputRef.current?.focus(), 420);
  }

  function launch(mood: string) {
    router.push(`/results?mood=${encodeURIComponent(mood)}&duration=${time}&language=fr`);
  }

  function handleTextSubmit() {
    const q = text.trim();
    if (q) launch(q);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") handleTextSubmit();
  }

  /* ── Wrapper ── */
  return (
    <main style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "32px 16px",
      fontFamily: "var(--font-outfit, 'Inter', sans-serif)",
    }}>
      <div style={{
        width: "100%",
        maxWidth: "460px",
        transition: "opacity 0.34s ease, transform 0.34s ease",
        opacity: fading ? 0 : 1,
        transform: fading ? "translateY(16px)" : "translateY(0)",
      }}>

        {/* ═══════════════ STEP 1 — TEMPS ═══════════════ */}
        {step === "time" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>

            {/* Brand + headline */}
            <div style={{ textAlign: "center", display: "flex", flexDirection: "column", gap: "14px", animation: "fadeInUp 0.5s ease both" }}>
              {/* Logo pill */}
              <div style={{ margin: "0 auto" }}>
                <div style={{
                  display: "inline-flex", alignItems: "center", gap: "7px",
                  padding: "6px 14px 6px 10px",
                  background: "rgba(239,68,68,0.1)",
                  border: "1px solid rgba(239,68,68,0.22)",
                  borderRadius: "999px", fontSize: "13px", fontWeight: 600,
                  color: "#f87171", letterSpacing: "0.01em",
                }}>
                  <Play style={{ width: 13, height: 13 }} fill="currentColor" />
                  LetMeWatch
                </div>
              </div>

              {/* Headline */}
              <div>
                <h1 style={{
                  fontSize: "clamp(28px,7vw,40px)", fontWeight: 800,
                  color: "white", margin: "0 0 10px", lineHeight: 1.1,
                  letterSpacing: "-0.02em",
                }}>
                  Le repas est servi.<br />
                  <span style={{ color: "#ef4444" }}>La vidéo aussi.</span>
                </h1>
                <p style={{ color: S.muted, margin: 0, fontSize: "15px", lineHeight: 1.55 }}>
                  Dis-nous combien de temps tu as.<br />On s'occupe du reste.
                </p>
              </div>
            </div>

            {/* Time cards */}
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {timeOptions.map((opt, i) => (
                <button
                  key={opt.value}
                  onClick={() => handleTimeSelect(opt.value)}
                  className="card-hover"
                  style={{
                    width: "100%", background: "none", border: "none",
                    padding: 0, cursor: "pointer",
                    animation: `fadeInUp 0.5s cubic-bezier(0.16,1,0.3,1) ${80 + i * 80}ms both`,
                  }}
                >
                  <div style={{
                    ...S.card, padding: "18px 20px",
                    display: "flex", alignItems: "center", gap: "14px", textAlign: "left",
                  }}>
                    {/* Icon */}
                    <div className="card-icon" style={{
                      width: 50, height: 50,
                      background: S.surface, borderRadius: "12px",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      border: "1px solid rgba(255,255,255,0.06)", flexShrink: 0,
                      transition: "border-color 0.3s, color 0.3s", color: S.muted,
                    }}>
                      <Clock style={{ width: 21, height: 21 }} />
                    </div>

                    {/* Text */}
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "baseline", gap: "10px" }}>
                        <span style={{ fontWeight: 700, fontSize: "17px", color: "white" }}>{opt.label}</span>
                        <span style={{ fontSize: "13px", color: S.muted }}>— {opt.description}</span>
                      </div>
                      <p style={{ margin: "3px 0 0", fontSize: "12px", color: "rgba(248,113,113,0.75)", display: "flex", alignItems: "center", gap: "4px" }}>
                        <Play style={{ width: 10, height: 10 }} />
                        {opt.note}
                      </p>
                    </div>

                    {/* Arrow */}
                    <div className="arrow-btn" style={{
                      width: 34, height: 34, borderRadius: "50%",
                      background: "transparent", display: "flex", alignItems: "center", justifyContent: "center",
                      transition: "all 0.25s ease", flexShrink: 0,
                    }}>
                      <ArrowRight style={{ width: 17, height: 17, color: "#f87171" }} />
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Social proof */}
            <p style={{ textAlign: "center", color: S.muted, fontSize: "13px", margin: 0, animation: "fadeInUp 0.5s 340ms both" }}>
              🍜 Des milliers de repas améliorés chaque jour
            </p>
          </div>
        )}

        {/* ═══════════════ STEP 2 — RECHERCHE ═══════════════ */}
        {step === "search" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "22px" }}>

            {/* Back + recap */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <button
                onClick={() => { setTime(null); goTo("time"); }}
                style={{
                  display: "inline-flex", alignItems: "center", gap: "5px",
                  fontSize: "13px", color: S.muted, background: "none",
                  border: "none", cursor: "pointer", padding: 0,
                  transition: "color 0.2s",
                }}
                onMouseEnter={e => (e.currentTarget.style.color = "white")}
                onMouseLeave={e => (e.currentTarget.style.color = S.muted)}
              >
                <ChevronLeft style={{ width: 15, height: 15 }} /> Retour
              </button>
              {/* Duration pill */}
              <div style={{
                display: "inline-flex", alignItems: "center", gap: "5px",
                padding: "5px 12px", background: "rgba(239,68,68,0.12)",
                border: "1px solid rgba(239,68,68,0.25)", borderRadius: "999px",
                fontSize: "12px", fontWeight: 600, color: "#f87171",
              }}>
                <Clock style={{ width: 11, height: 11 }} />
                {time} min
              </div>
            </div>

            {/* Headline */}
            <div style={{ animation: "fadeInUp 0.4s ease both" }}>
              <h2 style={{ fontSize: "22px", fontWeight: 700, color: "white", margin: "0 0 4px", letterSpacing: "-0.01em" }}>
                Qu'est-ce qu'on regarde ?
              </h2>
              <p style={{ color: S.muted, margin: 0, fontSize: "13px" }}>
                Décris ce que tu veux — ou choisis une ambiance ci-dessous
              </p>
            </div>

            {/* ── SEARCH BAR (prominent) ── */}
            <div style={{ animation: "fadeInUp 0.4s 60ms ease both", position: "relative" }}>
              <div style={{
                position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)",
                color: S.muted, pointerEvents: "none", display: "flex",
              }}>
                <Search style={{ width: 18, height: 18 }} />
              </div>
              <input
                ref={inputRef}
                type="text"
                placeholder="Ex : documentaire nature, humour, gaming, cuisine…"
                value={text}
                onChange={e => setText(e.target.value)}
                onKeyDown={handleKeyDown}
                style={{
                  width: "100%", height: "54px",
                  paddingLeft: "46px", paddingRight: text.trim() ? "52px" : "16px",
                  fontSize: "15px", fontFamily: "inherit",
                  background: "#1c1917",
                  border: "1.5px solid rgba(255,255,255,0.1)",
                  borderRadius: "14px", color: "white",
                  outline: "none", boxSizing: "border-box",
                  transition: "border-color 0.2s, box-shadow 0.2s",
                }}
                onFocus={e => {
                  e.target.style.borderColor = "rgba(239,68,68,0.55)";
                  e.target.style.boxShadow = "0 0 0 3px rgba(239,68,68,0.1)";
                }}
                onBlur={e => {
                  e.target.style.borderColor = "rgba(255,255,255,0.1)";
                  e.target.style.boxShadow = "none";
                }}
              />
              {text.trim() && (
                <button
                  onClick={handleTextSubmit}
                  style={{
                    position: "absolute", right: "8px", top: "50%", transform: "translateY(-50%)",
                    width: 38, height: 38, borderRadius: "10px",
                    background: S.red, border: "none", cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "white", transition: "background 0.2s",
                    boxShadow: "0 2px 12px rgba(239,68,68,0.4)",
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = "#dc2626")}
                  onMouseLeave={e => (e.currentTarget.style.background = S.red)}
                >
                  <ArrowRight style={{ width: 16, height: 16 }} />
                </button>
              )}
            </div>

            {/* ── Divider ── */}
            <div style={{
              display: "flex", alignItems: "center", gap: "12px",
              animation: "fadeInUp 0.4s 100ms ease both",
            }}>
              <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.07)" }} />
              <span style={{ fontSize: "12px", color: S.muted, whiteSpace: "nowrap" }}>ou une ambiance</span>
              <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.07)" }} />
            </div>

            {/* ── CATEGORIES GRID ── */}
            <div style={{
              display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px",
              animation: "fadeInUp 0.4s 140ms ease both",
            }}>
              {categories.map(c => (
                <button
                  key={c.id}
                  onClick={() => launch(c.id)}
                  style={{
                    background: "#1c1917",
                    border: "1px solid rgba(255,255,255,0.07)",
                    borderRadius: "12px", padding: "12px 14px",
                    cursor: "pointer", textAlign: "left",
                    transition: "background 0.18s, border-color 0.18s, transform 0.18s",
                    display: "flex", alignItems: "center", gap: "10px",
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = "#26201d";
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.14)";
                    e.currentTarget.style.transform = "translateY(-1px)";
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = "#1c1917";
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  <div style={{
                    width: 32, height: 32, borderRadius: "8px",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    background: c.bg, color: c.color, flexShrink: 0,
                  }}>
                    {c.icon}
                  </div>
                  <span style={{ fontWeight: 600, fontSize: "13px", color: "white" }}>
                    {c.label}
                  </span>
                </button>
              ))}
            </div>

            <p style={{ textAlign: "center", color: S.muted, fontSize: "12px", margin: 0 }}>
              Appuie sur <kbd style={{ background: "#26201d", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "4px", padding: "1px 6px", fontSize: "11px", fontFamily: "inherit" }}>Entrée</kbd> pour lancer la recherche
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
