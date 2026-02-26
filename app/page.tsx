"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Clock,
  ArrowRight,
  TrendingUp,
  Play,
  ChevronLeft,
  PenLine,
  List,
  RotateCcw,
  Check,
  Sparkles,
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
  videos: string;
}

interface Category {
  id: string;
  label: string;
  icon: React.ReactNode;
  description: string;
  bg: string;
  color: string;
}

type Step = "time" | "input" | "summary";
type InputMode = "write" | "category" | null;

/* ── Data ── */
const timeOptions: TimeOption[] = [
  { value: 15, label: "15 min", description: "Pause rapide", videos: "2–3 vidéos" },
  { value: 30, label: "30 min", description: "Repas standard", videos: "4–6 vidéos" },
  { value: 65, label: "1h+",    description: "Long repas",     videos: "8–12 vidéos" },
];

const categories: Category[] = [
  { id: "funny",       label: "Drôle",       icon: <Laugh     className="w-[18px] h-[18px]" />, description: "Humour & sketches",    bg: "rgba(234,179,8,0.15)",   color: "#eab308" },
  { id: "chill",       label: "Détente",     icon: <Coffee    className="w-[18px] h-[18px]" />, description: "Calme & ambient",      bg: "rgba(59,130,246,0.15)",  color: "#60a5fa" },
  { id: "educational", label: "Éducatif",    icon: <BookOpen  className="w-[18px] h-[18px]" />, description: "Apprendre en mangeant",bg: "rgba(34,197,94,0.15)",   color: "#4ade80" },
  { id: "gaming",      label: "Gaming",      icon: <Gamepad2  className="w-[18px] h-[18px]" />, description: "Let's play & esport",  bg: "rgba(168,85,247,0.15)",  color: "#c084fc" },
  { id: "cooking",     label: "Cuisine",     icon: <ChefHat   className="w-[18px] h-[18px]" />, description: "Recettes & food",      bg: "rgba(249,115,22,0.15)",  color: "#fb923c" },
  { id: "cinema",      label: "Cinéma",      icon: <Film      className="w-[18px] h-[18px]" />, description: "Critiques & analyses", bg: "rgba(236,72,153,0.15)",  color: "#f472b6" },
  { id: "music",       label: "Musique",     icon: <Music     className="w-[18px] h-[18px]" />, description: "Clips & lives",        bg: "rgba(6,182,212,0.15)",   color: "#22d3ee" },
  { id: "science",     label: "Science",     icon: <Zap       className="w-[18px] h-[18px]" />, description: "Tech & découvertes",   bg: "rgba(16,185,129,0.15)",  color: "#34d399" },
  { id: "travel",      label: "Voyage",      icon: <Globe     className="w-[18px] h-[18px]" />, description: "Nature & exploration",  bg: "rgba(99,102,241,0.15)",  color: "#818cf8" },
  { id: "surprise",    label: "Surprise",    icon: <Shuffle   className="w-[18px] h-[18px]" />, description: "Laisse-toi surprendre",bg: "rgba(239,68,68,0.15)",   color: "#f87171" },
];

/* ── Shared style tokens ── */
const S = {
  card:    { background: "hsl(220,15%,12%)", border: "1px solid hsl(220,15%,20%)", borderRadius: "14px" } as const,
  muted:   "hsl(220,10%,55%)",
  red:     "#ef4444",
  redSoft: "rgba(239,68,68,0.2)",
  surface: "hsl(220,15%,18%)",
};

/* ──────────────────────────────────────────── */
export default function Home() {
  const router = useRouter();
  const [step, setStep]       = useState<Step>("time");
  const [time, setTime]       = useState<number | null>(null);
  const [mode, setMode]       = useState<InputMode>(null);
  const [text, setText]       = useState("");
  const [cat, setCat]         = useState<string | null>(null);
  const [fading, setFading]   = useState(false);

  const canSubmit = mode === "write" ? text.trim().length > 0 : cat !== null;
  const selectedCat = categories.find((c) => c.id === cat);

  function goTo(next: Step, delay = 380) {
    setFading(true);
    setTimeout(() => { setStep(next); setFading(false); }, delay);
  }

  function handleTimeSelect(v: number) {
    setTime(v);
    goTo("input");
  }

  function handleModeSelect(m: InputMode) {
    setMode(m);
    if (m === "write") setCat(null);
    else setText("");
  }

  function handleCatSelect(id: string) {
    setCat(id);
    setTimeout(() => goTo("summary"), 180);
  }

  function handleSubmit() {
    if (canSubmit) goTo("summary");
  }

  function handleBack() {
    if (step === "input") { setMode(null); setTime(null); goTo("time"); }
    else if (step === "summary") goTo("input");
  }

  function handleReset() {
    setFading(true);
    setTimeout(() => {
      setStep("time"); setTime(null); setMode(null);
      setText(""); setCat(null); setFading(false);
    }, 380);
  }

  function handleSearch() {
    const mood = mode === "write" ? text : (cat || "chill");
    const lang = "fr";
    router.push(`/results?mood=${encodeURIComponent(mood)}&duration=${time}&language=${lang}`);
  }

  /* ── Layout wrapper ── */
  return (
    <main style={{
      minHeight: "100vh",
      background: "hsl(220,15%,8%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "24px 16px",
      fontFamily: "var(--font-outfit, 'Inter', sans-serif)",
      position: "relative",
    }}>
      {/* bg grid */}
      <div className="bg-grid" style={{ position: "fixed", inset: 0, pointerEvents: "none" }} />

      {/* card */}
      <div style={{
        width: "100%",
        maxWidth: "440px",
        position: "relative",
        transition: "opacity 0.38s ease, transform 0.38s ease",
        opacity: fading ? 0 : 1,
        transform: fading ? "translateY(20px)" : "translateY(0)",
      }}>

        {/* ───────── STEP 1 : TEMPS ───────── */}
        {step === "time" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>

            {/* header */}
            <div style={{ textAlign: "center", display: "flex", flexDirection: "column", gap: "10px" }}>
              <div style={{
                display: "inline-flex", alignItems: "center", gap: "7px",
                padding: "7px 16px", background: "hsl(220,15%,15%)",
                borderRadius: "999px", fontSize: "13px", color: S.muted,
                border: "1px solid hsl(220,15%,20%)", margin: "0 auto",
              }}>
                <TrendingUp style={{ width: 14, height: 14, color: "#f87171" }} />
                Quoi regarder en mangeant ?
              </div>
              <h1 style={{ fontSize: "clamp(26px,6vw,34px)", fontWeight: 700, color: "white", margin: 0, lineHeight: 1.15 }}>
                Combien de temps<br />tu manges ?
              </h1>
              <p style={{ color: S.muted, margin: 0, fontSize: "14px" }}>
                On va trouver la vidéo parfaite pour ton repas
              </p>
            </div>

            {/* options */}
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {timeOptions.map((opt, i) => (
                <button
                  key={opt.value}
                  onClick={() => handleTimeSelect(opt.value)}
                  className="card-hover"
                  style={{
                    width: "100%", background: "none", border: "none",
                    padding: 0, cursor: "pointer",
                    animation: `fadeInUp 0.5s cubic-bezier(0.16,1,0.3,1) ${i * 90}ms both`,
                  }}
                >
                  <div style={{
                    ...S.card, padding: "18px 20px",
                    display: "flex", alignItems: "center", gap: "14px", textAlign: "left",
                  }}>
                    <div className="card-icon" style={{
                      width: 52, height: 52,
                      background: "linear-gradient(135deg,hsl(220,15%,18%),hsl(220,15%,14%))",
                      borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center",
                      border: "1px solid hsl(220,15%,22%)", flexShrink: 0,
                      transition: "border-color 0.3s,color 0.3s",
                    }}>
                      <Clock style={{ width: 22, height: 22, color: S.muted }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "baseline", gap: "10px" }}>
                        <span style={{ fontWeight: 700, fontSize: "17px", color: "white" }}>{opt.label}</span>
                        <span style={{ fontSize: "13px", color: S.muted }}>— {opt.description}</span>
                      </div>
                      <p style={{ margin: "3px 0 0", fontSize: "13px", color: "rgba(248,113,113,0.85)", display: "flex", alignItems: "center", gap: "5px" }}>
                        <Play style={{ width: 11, height: 11 }} />
                        Environ {opt.videos}
                      </p>
                    </div>
                    <div className="arrow-btn" style={{
                      width: 36, height: 36, borderRadius: "50%",
                      background: "transparent", display: "flex", alignItems: "center", justifyContent: "center",
                      transition: "all 0.3s ease", flexShrink: 0,
                    }}>
                      <ArrowRight style={{ width: 18, height: 18, color: "#f87171" }} />
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ───────── STEP 2 : CONTENU ───────── */}
        {step === "input" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

            {/* back */}
            <button onClick={handleBack} style={{
              display: "inline-flex", alignItems: "center", gap: "6px",
              fontSize: "13px", color: S.muted, background: "none",
              border: "none", cursor: "pointer", padding: 0,
              transition: "color 0.2s", width: "fit-content",
            }}
              onMouseEnter={e => (e.currentTarget.style.color = "white")}
              onMouseLeave={e => (e.currentTarget.style.color = S.muted)}
            >
              <ChevronLeft style={{ width: 15, height: 15 }} />
              Retour
            </button>

            {/* recap durée */}
            <div style={{ ...S.card, padding: "14px 16px", display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{ width: 38, height: 38, background: S.redSoft, borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Clock style={{ width: 18, height: 18, color: "#f87171" }} />
              </div>
              <div>
                <div style={{ fontSize: "12px", color: S.muted }}>Durée sélectionnée</div>
                <div style={{ fontWeight: 600, color: "white", fontSize: "15px" }}>{time} minutes</div>
              </div>
            </div>

            {/* header */}
            <div>
              <h2 style={{ fontSize: "22px", fontWeight: 700, color: "white", margin: "0 0 4px" }}>
                Qu'est-ce que tu veux regarder ?
              </h2>
              <p style={{ color: S.muted, margin: 0, fontSize: "13px" }}>
                Décris ou choisis une catégorie
              </p>
            </div>

            {/* toggle write / category */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
              {([
                { m: "write"    as InputMode, icon: <PenLine style={{ width: 18, height: 18 }} />, label: "Écrire",    sub: "Je sais ce que je veux" },
                { m: "category" as InputMode, icon: <List    style={{ width: 18, height: 18 }} />, label: "Catégorie", sub: "Donne-moi une idée" },
              ] as const).map(({ m, icon, label, sub }) => (
                <button
                  key={m}
                  onClick={() => handleModeSelect(m)}
                  style={{
                    background:   mode === m ? S.red       : "hsl(220,15%,12%)",
                    border:       `2px solid ${mode === m ? S.red : "hsl(220,15%,20%)"}`,
                    borderRadius: "14px", padding: "18px 14px",
                    cursor: "pointer", transition: "all 0.25s ease", color: "white",
                  }}
                >
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "9px" }}>
                    <div style={{
                      width: 42, height: 42,
                      background: mode === m ? "rgba(255,255,255,0.22)" : S.surface,
                      borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      {icon}
                    </div>
                    <div style={{ textAlign: "center" }}>
                      <div style={{ fontWeight: 600, fontSize: "14px" }}>{label}</div>
                      <div style={{ fontSize: "11px", opacity: 0.65, marginTop: "2px" }}>{sub}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* write mode */}
            {mode === "write" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "10px", animation: "scaleIn 0.25s ease both" }}>
                <div style={{ position: "relative" }}>
                  <textarea
                    autoFocus
                    placeholder="Ex : documentaire nature, humour entre amis, tech, cuisine japonaise…"
                    value={text}
                    onChange={e => setText(e.target.value)}
                    rows={4}
                    style={{
                      width: "100%", resize: "none", fontSize: "14px",
                      background: "hsl(220,15%,12%)",
                      border: "1px solid hsl(220,15%,20%)",
                      borderRadius: "12px", padding: "13px 13px 30px",
                      color: "white", fontFamily: "inherit",
                      outline: "none", boxSizing: "border-box",
                      transition: "border-color 0.2s",
                      lineHeight: 1.6,
                    }}
                    onFocus={e => (e.target.style.borderColor = "rgba(239,68,68,0.5)")}
                    onBlur={e  => (e.target.style.borderColor = "hsl(220,15%,20%)")}
                  />
                  <span style={{ position: "absolute", bottom: "10px", right: "12px", fontSize: "11px", color: S.muted }}>
                    {text.length}
                  </span>
                </div>
                <button
                  onClick={handleSubmit}
                  disabled={!canSubmit}
                  style={{
                    width: "100%", padding: "13px",
                    background: canSubmit ? S.red : "hsl(220,15%,18%)",
                    color: canSubmit ? "white" : "hsl(220,10%,35%)",
                    border: "none", borderRadius: "12px",
                    fontSize: "14px", fontWeight: 600,
                    cursor: canSubmit ? "pointer" : "not-allowed",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: "7px",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={e => canSubmit && (e.currentTarget.style.background = "#dc2626")}
                  onMouseLeave={e => canSubmit && (e.currentTarget.style.background = S.red)}
                >
                  Trouver des vidéos <ArrowRight style={{ width: 15, height: 15 }} />
                </button>
              </div>
            )}

            {/* category mode */}
            {mode === "category" && (
              <div style={{
                display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px",
                animation: "scaleIn 0.25s ease both",
              }}>
                {categories.map(c => (
                  <button
                    key={c.id}
                    onClick={() => handleCatSelect(c.id)}
                    style={{
                      background:   cat === c.id ? "hsl(220,15%,16%)" : "hsl(220,15%,11%)",
                      border:       `2px solid ${cat === c.id ? "rgba(239,68,68,0.45)" : "transparent"}`,
                      borderRadius: "11px", padding: "12px", cursor: "pointer",
                      transition: "all 0.18s ease", textAlign: "left",
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = "hsl(220,15%,28%)"; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = cat === c.id ? "rgba(239,68,68,0.45)" : "transparent"; }}
                  >
                    <div style={{ display: "flex", alignItems: "flex-start", gap: "9px" }}>
                      <div style={{
                        width: 34, height: 34, borderRadius: "8px",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        background: c.bg, color: c.color, flexShrink: 0,
                      }}>
                        {c.icon}
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontWeight: 600, fontSize: "13px", color: "white", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                          {c.label}
                        </div>
                        <div style={{ fontSize: "11px", color: S.muted, marginTop: "1px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                          {c.description}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ───────── STEP 3 : RECAP ───────── */}
        {step === "summary" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "22px", alignItems: "center" }}>

            {/* success icon */}
            <div style={{ position: "relative" }}>
              <div style={{
                width: 76, height: 76,
                background: "linear-gradient(135deg,#ef4444,#dc2626)",
                borderRadius: "20px",
                display: "flex", alignItems: "center", justifyContent: "center",
                animation: "pulseGlow 2s ease infinite",
              }}>
                <Check style={{ width: 38, height: 38, color: "white", strokeWidth: 2.5 }} />
              </div>
              <div style={{
                position: "absolute", bottom: -4, right: -4,
                width: 26, height: 26, background: "hsl(220,15%,8%)",
                borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                border: "2px solid #ef4444",
              }}>
                <Sparkles style={{ width: 12, height: 12, color: "#f87171" }} />
              </div>
            </div>

            <div style={{ textAlign: "center" }}>
              <h2 style={{ fontSize: "20px", fontWeight: 700, color: "white", margin: "0 0 3px" }}>Parfait !</h2>
              <p style={{ color: S.muted, margin: 0, fontSize: "13px" }}>On va te trouver les meilleures vidéos pour ton repas</p>
            </div>

            {/* recap card */}
            <div style={{ width: "100%", ...S.card, overflow: "hidden", position: "relative" }}>
              {/* gradient top bar */}
              <div style={{ height: 3, background: "linear-gradient(to right,#ef4444,#f97316,#eab308)" }} />
              <div style={{ padding: "18px 20px", display: "flex", flexDirection: "column", gap: "14px" }}>

                {/* durée */}
                <div style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  paddingBottom: "14px", borderBottom: "1px solid hsl(220,15%,20%)",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "11px" }}>
                    <div style={{ width: 42, height: 42, background: S.surface, borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Clock style={{ width: 19, height: 19, color: S.muted }} />
                    </div>
                    <div>
                      <div style={{ fontSize: "12px", color: S.muted }}>Durée</div>
                      <div style={{ fontWeight: 700, fontSize: "16px", color: "white" }}>{time} minutes</div>
                    </div>
                  </div>
                  <span style={{ padding: "4px 11px", background: S.redSoft, color: "#f87171", borderRadius: "999px", fontSize: "12px", fontWeight: 600 }}>
                    {time === 15 ? "Rapide" : time === 30 ? "Standard" : "Long repas"}
                  </span>
                </div>

                {/* contenu */}
                <div style={{ display: "flex", alignItems: "center", gap: "11px" }}>
                  <div style={{ width: 42, height: 42, background: S.surface, borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    {mode === "write"
                      ? <PenLine style={{ width: 19, height: 19, color: S.muted }} />
                      : <List    style={{ width: 19, height: 19, color: S.muted }} />}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: "12px", color: S.muted }}>Contenu</div>
                    <div style={{ fontWeight: 600, fontSize: "15px", color: "white", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {mode === "write" ? text : selectedCat?.label}
                    </div>
                  </div>
                  {mode === "category" && selectedCat && (
                    <div style={{ width: 34, height: 34, borderRadius: 8, background: selectedCat.bg, color: selectedCat.color, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginLeft: "auto" }}>
                      {selectedCat.icon}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* actions */}
            <div style={{ display: "flex", gap: "10px", width: "100%" }}>
              <button
                onClick={handleReset}
                style={{
                  padding: "13px 18px", background: "hsl(220,15%,12%)",
                  border: "1px solid hsl(220,15%,22%)", borderRadius: "12px",
                  color: S.muted, cursor: "pointer",
                  display: "flex", alignItems: "center", gap: "6px",
                  fontSize: "13px", fontWeight: 500,
                  transition: "all 0.2s", whiteSpace: "nowrap",
                }}
                onMouseEnter={e => { e.currentTarget.style.color = "white"; e.currentTarget.style.borderColor = "hsl(220,15%,30%)"; }}
                onMouseLeave={e => { e.currentTarget.style.color = S.muted;  e.currentTarget.style.borderColor = "hsl(220,15%,22%)"; }}
              >
                <RotateCcw style={{ width: 14, height: 14 }} /> Modifier
              </button>
              <button
                onClick={handleSearch}
                style={{
                  flex: 1, padding: "13px", background: S.red,
                  border: "none", borderRadius: "12px",
                  color: "white", cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: "7px",
                  fontSize: "14px", fontWeight: 700,
                  transition: "background 0.2s",
                  boxShadow: "0 4px 20px rgba(239,68,68,0.35)",
                }}
                onMouseEnter={e => (e.currentTarget.style.background = "#dc2626")}
                onMouseLeave={e => (e.currentTarget.style.background = S.red)}
              >
                <Play style={{ width: 15, height: 15 }} />
                Lancer la recherche
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
