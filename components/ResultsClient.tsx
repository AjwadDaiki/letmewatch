"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useTransform } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  Ban,
  Check,
  ExternalLink,
  History,
  MousePointer2,
  Play,
  RefreshCw,
  Share2,
  Shuffle,
  X,
} from "lucide-react";
import { addToBlacklist, addToHistory, getBlacklist, getHistory } from "@/lib/storage";
import type { VideoItem } from "@/lib/storage";

interface Video {
  id: string;
  title: string;
  channelId: string;
  channelTitle: string;
  thumbnail: string;
  duration: number;
}

function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  return `${m}:${String(s).padStart(2, "0")}`;
}

function getMoodLabel(mood: string, isSurprise: boolean): string {
  if (isSurprise) return "Surprise";
  const map: Record<string, string> = {
    funny: "Drôle", chill: "Détente", educational: "Éducatif", gaming: "Gaming",
    cooking: "Cuisine", cinema: "Cinéma", music: "Musique", science: "Science",
    travel: "Voyage", surprise: "Surprise",
  };
  const first = mood.split(" ")[0] || mood;
  return map[first] || (first.charAt(0).toUpperCase() + first.slice(1));
}

/* ── Video card — full dark ── */
function VideoCard({ video, onReject, onBlacklist, onPlay }: {
  video: Video;
  onReject: (id: string) => void;
  onBlacklist: (video: Video) => void;
  onPlay: (video: Video) => void;
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showBlacklist, setShowBlacklist] = useState(false);

  const x       = useMotionValue(0);
  const rotate  = useTransform(x, [-120, 120], [-4, 4]);
  const opacity = useTransform(x, [-150, -30, 0, 30, 150], [0, 0.9, 1, 0.9, 0]);

  return (
    <motion.article
      drag="x"
      dragElastic={0.18}
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={(_, info) => { if (Math.abs(info.offset.x) > 85) onReject(video.id); }}
      layout
      initial={{ opacity: 0, y: 20, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: -50, scale: 0.94, transition: { duration: 0.2 } }}
      transition={{ duration: 0.28 }}
      style={{ x, rotate, opacity, position: "relative" }}
      className="group"
      css-override="true"
    >
      <div style={{
        background: "#1c1917",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: "18px",
        overflow: "hidden",
      }}>
        {/* Thumbnail */}
        <div style={{ position: "relative", aspectRatio: "16/9" }}>
          {isPlaying ? (
            <iframe
              src={`https://www.youtube.com/embed/${video.id}?autoplay=1&rel=0`}
              allow="autoplay; encrypted-media; fullscreen"
              allowFullScreen
              style={{ width: "100%", height: "100%", border: "none", display: "block" }}
            />
          ) : (
            <>
              <img
                src={video.thumbnail}
                alt={video.title}
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transition: "transform 0.4s ease" }}
                onError={e => { (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${video.id}/hqdefault.jpg`; }}
                draggable={false}
                className="group-hover:scale-[1.03]"
              />

              {/* Play button */}
              <button
                onClick={() => { onPlay(video); setIsPlaying(true); }}
                style={{
                  position: "absolute", inset: 0,
                  display: "grid", placeContent: "center",
                  background: "linear-gradient(180deg, rgba(0,0,0,0.04), rgba(0,0,0,0.4))",
                  border: "none", cursor: "pointer",
                }}
              >
                <span style={{
                  width: 52, height: 52, borderRadius: "50%",
                  background: "#ef4444",
                  display: "grid", placeContent: "center",
                  boxShadow: "0 6px 24px rgba(239,68,68,0.5)",
                  transition: "transform 0.2s, box-shadow 0.2s",
                }}
                  className="group-hover:scale-105"
                >
                  <Play size={20} fill="white" color="white" style={{ marginLeft: 2 }} />
                </span>
              </button>

              {/* Duration badge */}
              <span style={{
                position: "absolute", right: 8, bottom: 8,
                background: "rgba(0,0,0,0.82)", borderRadius: "6px",
                padding: "2px 8px", fontSize: "11px", fontWeight: 700,
                color: "white", letterSpacing: "0.02em",
              }}>
                {formatDuration(video.duration)}
              </span>

              {/* Reject button */}
              <button
                onClick={e => { e.stopPropagation(); onReject(video.id); }}
                style={{
                  position: "absolute", right: 8, top: 8,
                  width: 30, height: 30, borderRadius: "50%",
                  background: "rgba(0,0,0,0.65)", border: "none",
                  color: "rgba(255,255,255,0.85)", cursor: "pointer",
                  display: "grid", placeContent: "center",
                  opacity: 0, transition: "opacity 0.2s",
                }}
                className="group-hover:!opacity-100"
              >
                <X size={13} />
              </button>
            </>
          )}
        </div>

        {/* Info */}
        <div style={{ padding: "14px 16px" }}>
          <h3 style={{
            margin: "0 0 10px", fontSize: "14px", fontWeight: 600,
            color: "white", lineHeight: 1.45,
          }} className="line-clamp-2">
            {video.title}
          </h3>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
            <span style={{
              fontSize: "12px", color: "rgba(255,255,255,0.45)",
              overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
            }}>
              {video.channelTitle}
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
              <a
                href={`https://youtube.com/watch?v=${video.id}`}
                target="_blank" rel="noopener noreferrer"
                onClick={e => e.stopPropagation()}
                style={{
                  display: "grid", placeContent: "center",
                  width: 28, height: 28, borderRadius: "8px",
                  background: "#26201d", border: "1px solid rgba(255,255,255,0.08)",
                  color: "rgba(255,255,255,0.5)", transition: "color 0.15s",
                  textDecoration: "none",
                }}
                onMouseEnter={e => (e.currentTarget.style.color = "white")}
                onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.5)")}
                title="Ouvrir sur YouTube"
              >
                <ExternalLink size={12} />
              </a>
              <button
                onClick={e => { e.stopPropagation(); setShowBlacklist(true); }}
                style={{
                  display: "grid", placeContent: "center",
                  width: 28, height: 28, borderRadius: "8px",
                  background: "#26201d", border: "1px solid rgba(239,68,68,0.18)",
                  color: "rgba(239,68,68,0.65)", cursor: "pointer", transition: "color 0.15s",
                }}
                onMouseEnter={e => (e.currentTarget.style.color = "#ef4444")}
                onMouseLeave={e => (e.currentTarget.style.color = "rgba(239,68,68,0.65)")}
                title="Ne plus voir cette chaîne"
              >
                <Ban size={12} />
              </button>
            </div>
          </div>
        </div>

        {/* Blacklist confirm */}
        <AnimatePresence>
          {showBlacklist && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{
                position: "absolute", inset: 0, borderRadius: "18px",
                background: "rgba(12,10,9,0.94)",
                display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center", gap: 16, padding: 20,
              }}
            >
              <p style={{ textAlign: "center", fontSize: "14px", color: "rgba(255,255,255,0.85)", lineHeight: 1.5, margin: 0 }}>
                Masquer définitivement <span style={{ color: "#f87171", fontWeight: 600 }}>{video.channelTitle}</span> ?
              </p>
              <div style={{ display: "flex", gap: 10 }}>
                <button
                  onClick={() => { onBlacklist(video); setShowBlacklist(false); }}
                  style={{
                    padding: "8px 18px", background: "#ef4444", border: "none",
                    borderRadius: "10px", fontSize: "13px", fontWeight: 600,
                    color: "white", cursor: "pointer",
                  }}
                >
                  Masquer
                </button>
                <button
                  onClick={() => setShowBlacklist(false)}
                  style={{
                    padding: "8px 18px",
                    background: "#26201d", border: "1px solid rgba(255,255,255,0.12)",
                    borderRadius: "10px", fontSize: "13px", fontWeight: 600,
                    color: "rgba(255,255,255,0.7)", cursor: "pointer",
                  }}
                >
                  Annuler
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.article>
  );
}

/* ── Dark loading skeleton ── */
function LoadingSkeleton() {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3].map(i => (
        <div key={i} style={{ background: "#1c1917", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "18px", overflow: "hidden" }}>
          <div style={{
            aspectRatio: "16/9",
            background: "linear-gradient(90deg, #1c1917 25%, #26201d 50%, #1c1917 75%)",
            backgroundSize: "200% 100%",
            animation: "shimmer 1.6s infinite",
          }} />
          <div style={{ padding: "14px 16px", display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ height: 13, borderRadius: 6, background: "rgba(255,255,255,0.07)" }} />
            <div style={{ height: 13, width: "72%", borderRadius: 6, background: "rgba(255,255,255,0.05)" }} />
            <div style={{ height: 10, width: "40%", borderRadius: 6, background: "rgba(255,255,255,0.04)", marginTop: 4 }} />
          </div>
        </div>
      ))}
    </div>
  );
}

/* ──────────────────────────────────────────── */
export default function ResultsClient() {
  const searchParams = useSearchParams();
  const router       = useRouter();

  const mood       = searchParams.get("mood")     || "interesting";
  const duration   = parseInt(searchParams.get("duration") || "30", 10);
  const language   = searchParams.get("language") || "fr";
  const isSurprise = searchParams.get("surprise") === "true";

  const [videos,       setVideos]       = useState<Video[]>([]);
  const [allVideos,    setAllVideos]    = useState<Video[]>([]);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState("");
  const [reason,       setReason]       = useState("");
  const [shareSuccess, setShareSuccess] = useState(false);
  const [showHistory,  setShowHistory]  = useState(false);
  const [history,      setHistory]      = useState<VideoItem[]>([]);

  const fetchVideos = useCallback(async (rejectedIds: string[] = []) => {
    setLoading(true);
    setError("");
    try {
      const currentHistory = getHistory();
      const blacklist      = getBlacklist();
      setHistory(currentHistory);

      const res = await fetch("/api/match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mood, duration, language, isSurprise, history: currentHistory.map(v => v.id), blacklist }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Erreur lors de la recherche");
      }

      const data     = await res.json();
      const filtered = (data.videos || []).filter((v: Video) => !rejectedIds.includes(v.id));
      setAllVideos(filtered);
      setVideos(filtered.slice(0, 3));
      setReason(data.reason || "");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  }, [duration, isSurprise, language, mood]);

  useEffect(() => { fetchVideos(); }, [fetchVideos]);

  const handleReject = (videoId: string) => {
    const remaining  = videos.filter(v => v.id !== videoId);
    const rejectedSet = [videoId];
    const usedIds    = new Set([...remaining.map(v => v.id), ...rejectedSet]);
    const next       = allVideos.find(v => !usedIds.has(v.id));
    if (next) setVideos([...remaining, next]);
    else { setVideos(remaining); if (remaining.length < 2) fetchVideos(rejectedSet); }
  };

  const handleBlacklist = (video: Video) => {
    addToBlacklist(video.channelId);
    setVideos(prev => prev.filter(v => v.channelId !== video.channelId));
    setAllVideos(prev => prev.filter(v => v.channelId !== video.channelId));
  };

  const handlePlay = (video: Video) => {
    addToHistory({ id: video.id, title: video.title, channelId: video.channelId, channelTitle: video.channelTitle, thumbnail: video.thumbnail, duration: video.duration, watchedAt: Date.now() });
    setHistory(getHistory());
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setShareSuccess(true);
      window.setTimeout(() => setShareSuccess(false), 2200);
    } catch { setShareSuccess(false); }
  };

  const handleSurprise = () => {
    router.push(`/results?mood=surprise&duration=${duration}&language=${language}&surprise=true`);
  };

  /* ── Shared button style ── */
  const btnBase: React.CSSProperties = {
    display: "inline-flex", alignItems: "center", gap: 6,
    padding: "7px 14px", borderRadius: "10px",
    background: "#1c1917", border: "1px solid rgba(255,255,255,0.09)",
    color: "rgba(255,255,255,0.7)", fontSize: "13px", fontWeight: 500,
    cursor: "pointer", transition: "all 0.18s ease",
  };

  return (
    <main style={{ minHeight: "100vh", padding: "20px 16px", fontFamily: "var(--font-outfit,'Inter',sans-serif)" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto", display: "flex", flexDirection: "column", gap: 16 }}>

        {/* ── Header ── */}
        <motion.header
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          style={{
            background: "#1c1917",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "18px", padding: "14px 18px",
          }}
        >
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
            <button
              onClick={() => router.push("/")}
              style={{ ...btnBase, padding: "7px 12px" }}
              onMouseEnter={e => { e.currentTarget.style.color = "white"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.18)"; }}
              onMouseLeave={e => { e.currentTarget.style.color = "rgba(255,255,255,0.7)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.09)"; }}
            >
              <ArrowLeft size={15} /> Revenir
            </button>

            <p style={{ fontWeight: 700, fontSize: "clamp(16px,3vw,20px)", color: "white", margin: 0 }}>
              Tes recommandations
            </p>

            <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
              {/* History */}
              <button
                onClick={() => { setHistory(getHistory()); setShowHistory(p => !p); }}
                style={{ ...btnBase, padding: "7px 10px", position: "relative" }}
                onMouseEnter={e => (e.currentTarget.style.color = "white")}
                onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.7)")}
                title="Historique"
              >
                <History size={15} />
                {history.length > 0 && (
                  <span style={{
                    position: "absolute", top: -4, right: -4,
                    width: 16, height: 16, borderRadius: "50%",
                    background: "#ef4444", fontSize: "9px", fontWeight: 700,
                    color: "white", display: "grid", placeContent: "center",
                  }}>{history.length}</span>
                )}
              </button>

              {/* Surprise */}
              <button
                onClick={handleSurprise}
                style={{ ...btnBase }}
                onMouseEnter={e => (e.currentTarget.style.color = "white")}
                onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.7)")}
              >
                <Shuffle size={14} /> Surprise
              </button>

              {/* Refresh */}
              <button
                onClick={() => fetchVideos()}
                style={{ ...btnBase, padding: "7px 10px" }}
                onMouseEnter={e => (e.currentTarget.style.color = "white")}
                onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.7)")}
                title="Rafraîchir"
              >
                <RefreshCw size={15} />
              </button>

              {/* Share */}
              <button
                onClick={handleShare}
                style={{ ...btnBase }}
                onMouseEnter={e => (e.currentTarget.style.color = "white")}
                onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.7)")}
              >
                {shareSuccess ? <Check size={14} /> : <Share2 size={14} />}
                {shareSuccess ? "Copié !" : "Partager"}
              </button>
            </div>
          </div>

          {/* Pills */}
          <div style={{ marginTop: 12, display: "flex", flexWrap: "wrap", alignItems: "center", gap: 8 }}>
            <span style={{ padding: "4px 12px", background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: "999px", fontSize: "12px", fontWeight: 600, color: "#f87171" }}>
              {duration} min
            </span>
            <span style={{ padding: "4px 12px", background: "#26201d", border: "1px solid rgba(255,255,255,0.09)", borderRadius: "999px", fontSize: "12px", fontWeight: 600, color: "rgba(255,255,255,0.8)" }}>
              {getMoodLabel(mood, isSurprise)}
            </span>
            {reason && !loading && (
              <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.38)", lineHeight: 1.4 }}>
                — {reason}
              </span>
            )}
          </div>
        </motion.header>

        {/* ── History panel ── */}
        <AnimatePresence>
          {showHistory && (
            <motion.section
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              style={{ overflow: "hidden" }}
            >
              <div style={{ background: "#1c1917", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px", padding: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                  <p style={{ fontWeight: 600, color: "white", margin: 0, fontSize: "14px" }}>Récemment regardées</p>
                  <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.35)", margin: 0 }}>Expire après 7 jours</p>
                </div>
                {history.length === 0 ? (
                  <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)", margin: 0 }}>Aucune vidéo regardée cette semaine.</p>
                ) : (
                  <div style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 4 }}>
                    {history.slice(0, 8).map(v => (
                      <a key={v.id} href={`https://youtube.com/watch?v=${v.id}`} target="_blank" rel="noopener noreferrer"
                        style={{ width: 110, flexShrink: 0, textDecoration: "none" }}>
                        <img src={v.thumbnail} alt={v.title}
                          style={{ width: "100%", borderRadius: 8, aspectRatio: "16/9", objectFit: "cover", border: "1px solid rgba(255,255,255,0.08)" }} />
                        <span style={{ display: "block", marginTop: 4, fontSize: "11px", color: "rgba(255,255,255,0.5)", lineHeight: 1.35 }} className="line-clamp-2">
                          {v.title}
                        </span>
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* ── Tip ── */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
          style={{
            display: "flex", alignItems: "center", gap: 8,
            background: "#1c1917", border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: "12px", padding: "10px 14px",
            fontSize: "12px", color: "rgba(255,255,255,0.4)",
          }}
        >
          <MousePointer2 size={13} style={{ flexShrink: 0 }} />
          Clique pour lire · Glisse à gauche pour passer · 🚫 pour masquer une chaîne
        </motion.div>

        {/* ── Content ── */}
        {loading ? (
          <LoadingSkeleton />
        ) : error ? (
          <div style={{ background: "#1c1917", border: "1px solid rgba(239,68,68,0.2)", borderRadius: "18px", padding: "48px 24px", textAlign: "center" }}>
            <p style={{ fontWeight: 700, fontSize: "22px", color: "#f87171", margin: "0 0 8px" }}>Une erreur est survenue</p>
            <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.5)", margin: "0 0 24px" }}>{error}</p>
            <button onClick={() => fetchVideos()} style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "10px 22px", background: "#ef4444", border: "none", borderRadius: "12px", color: "white", fontWeight: 600, fontSize: "14px", cursor: "pointer" }}>
              <RefreshCw size={14} /> Réessayer
            </button>
          </div>
        ) : videos.length === 0 ? (
          <div style={{ background: "#1c1917", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "18px", padding: "48px 24px", textAlign: "center" }}>
            <p style={{ fontWeight: 700, fontSize: "20px", color: "white", margin: "0 0 8px" }}>Aucun résultat pour ce contexte</p>
            <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.45)", margin: "0 0 24px" }}>Essaie le mode surprise pour explorer d'autres pistes.</p>
            <button onClick={handleSurprise} style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "10px 22px", background: "#ef4444", border: "none", borderRadius: "12px", color: "white", fontWeight: 600, fontSize: "14px", cursor: "pointer" }}>
              <Shuffle size={14} /> Mode surprise
            </button>
          </div>
        ) : (
          <motion.section layout className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {videos.map(video => (
                <VideoCard
                  key={video.id}
                  video={video}
                  onReject={handleReject}
                  onBlacklist={handleBlacklist}
                  onPlay={handlePlay}
                />
              ))}
            </AnimatePresence>
          </motion.section>
        )}
      </div>
    </main>
  );
}
