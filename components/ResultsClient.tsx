"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import { useSearchParams, useRouter } from "next/navigation";
import {
  X,
  Share2,
  Shuffle,
  ArrowLeft,
  ExternalLink,
  Ban,
  Play,
  RefreshCw,
  History,
  Check,
} from "lucide-react";
import { getBlacklist, addToBlacklist, getHistory, addToHistory } from "@/lib/storage";
import type { VideoItem } from "@/lib/storage";

interface Video {
  id: string;
  title: string;
  channelId: string;
  channelTitle: string;
  thumbnail: string;
  duration: number;
}

function formatDuration(s: number): string {
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  return `${m}:${String(sec).padStart(2, "0")}`;
}

function getMoodEmoji(mood: string): string {
  if (mood.includes("funny") || mood.includes("comedy")) return "😂";
  if (mood.includes("chill") || mood.includes("calm")) return "😌";
  if (mood.includes("educational") || mood.includes("documentary")) return "🧠";
  if (mood.includes("gaming")) return "🎮";
  if (mood.includes("food") || mood.includes("cooking")) return "🍜";
  if (mood.includes("cinema") || mood.includes("movie")) return "🎬";
  if (mood.includes("travel") || mood.includes("nature")) return "🌍";
  if (mood.includes("music")) return "🎵";
  if (mood.includes("science") || mood.includes("technology")) return "🔬";
  if (mood === "surprise") return "🎲";
  return "✨";
}

// ─── VIDEO CARD ───────────────────────────────────────────────────────────────

function VideoCard({
  video,
  onReject,
  onBlacklist,
  onPlay,
}: {
  video: Video;
  onReject: (id: string) => void;
  onBlacklist: (video: Video) => void;
  onPlay: (video: Video) => void;
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showBlacklist, setShowBlacklist] = useState(false);
  const x = useMotionValue(0);
  const opacity = useTransform(x, [-120, -60, 0, 60, 120], [0, 0.5, 1, 0.5, 0]);
  const rotate = useTransform(x, [-120, 120], [-8, 8]);

  const handlePlay = () => {
    onPlay(video);
    setIsPlaying(true);
  };

  return (
    <motion.div
      style={{ x, rotate, opacity, background: "#16213E", border: "1px solid rgba(255,255,255,0.06)" }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.2}
      onDragEnd={(_, info) => {
        if (Math.abs(info.offset.x) > 80) {
          onReject(video.id);
        }
      }}
      layout
      initial={{ opacity: 0, y: 24, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: -60, scale: 0.9, transition: { duration: 0.25 } }}
      transition={{ duration: 0.35 }}
      className="group relative rounded-2xl overflow-hidden cursor-grab active:cursor-grabbing"
      whileHover={{
        borderColor: "rgba(108,99,255,0.35)",
        boxShadow: "0 0 30px rgba(108,99,255,0.1)",
        y: -2,
      }}
    >
      {/* Thumbnail / Player */}
      <div className="relative" style={{ aspectRatio: "16/9", background: "#0F1C3F" }}>
        {isPlaying ? (
          <iframe
            src={`https://www.youtube.com/embed/${video.id}?autoplay=1&rel=0`}
            allow="autoplay; encrypted-media; fullscreen"
            allowFullScreen
            className="w-full h-full"
            style={{ border: "none" }}
          />
        ) : (
          <>
            {/* Thumbnail */}
            <img
              src={video.thumbnail}
              alt={video.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              onError={(e) => {
                (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${video.id}/hqdefault.jpg`;
              }}
              draggable={false}
            />

            {/* Play button overlay */}
            <button
              onClick={handlePlay}
              className="absolute inset-0 flex items-center justify-center cursor-pointer play-overlay"
              style={{ background: "transparent" }}
            >
              <span className="play-icon w-14 h-14 rounded-full flex items-center justify-center"
                style={{
                  background: "rgba(255,255,255,0.95)",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
                }}>
                <Play size={22} fill="#1A1A2E" color="#1A1A2E" style={{ marginLeft: 3 }} />
              </span>
            </button>

            {/* Duration badge */}
            <div
              className="absolute bottom-2 right-2 px-2 py-0.5 rounded text-xs font-bold text-white"
              style={{ background: "rgba(0,0,0,0.8)" }}
            >
              {formatDuration(video.duration)}
            </div>

            {/* Reject button */}
            <motion.button
              initial={{ opacity: 0, scale: 0.7 }}
              whileHover={{ scale: 1.1 }}
              onClick={(e) => {
                e.stopPropagation();
                onReject(video.id);
              }}
              className="absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center text-white transition-all opacity-0 group-hover:opacity-100"
              style={{ background: "rgba(0,0,0,0.6)" }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLElement).style.background = "#FF6584")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLElement).style.background =
                  "rgba(0,0,0,0.6)")
              }
            >
              <X size={14} />
            </motion.button>

            {/* Swipe hint */}
            <div
              className="absolute bottom-2 left-2 text-xs rounded px-1.5 py-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ background: "rgba(0,0,0,0.5)", color: "#8892A4" }}
            >
              swipe ←
            </div>
          </>
        )}
      </div>

      {/* Card body */}
      <div className="p-4">
        <h3
          className="font-semibold text-sm leading-snug mb-2 text-white line-clamp-2"
          style={{ minHeight: "2.5rem" }}
        >
          {video.title}
        </h3>

        <div className="flex items-center justify-between gap-2">
          <span
            className="text-xs truncate flex-1"
            style={{ color: "#8892A4" }}
            title={video.channelTitle}
          >
            {video.channelTitle}
          </span>

          <div className="flex items-center gap-1 shrink-0">
            {/* Watch on YouTube */}
            <a
              href={`https://youtube.com/watch?v=${video.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-lg transition-colors"
              style={{ color: "#8892A4" }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLElement).style.color = "white")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLElement).style.color = "#8892A4")
              }
              title="Ouvrir sur YouTube"
              onClick={(e) => e.stopPropagation()}
            >
              <ExternalLink size={13} />
            </a>

            {/* Blacklist */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowBlacklist(true);
              }}
              className="p-1.5 rounded-lg transition-colors"
              style={{ color: "#8892A4" }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLElement).style.color = "#FF6584")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLElement).style.color = "#8892A4")
              }
              title="Ne plus voir cette chaîne"
            >
              <Ban size={13} />
            </button>
          </div>
        </div>
      </div>

      {/* Blacklist confirm overlay */}
      <AnimatePresence>
        {showBlacklist && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-5"
            style={{ background: "rgba(22,33,62,0.97)" }}
          >
            <p className="text-white text-sm text-center font-medium leading-relaxed">
              Ne plus jamais voir{" "}
              <span style={{ color: "#FF6584" }}>{video.channelTitle}</span> ?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  onBlacklist(video);
                  setShowBlacklist(false);
                }}
                className="px-4 py-2 rounded-xl text-white text-xs font-semibold transition-opacity hover:opacity-90"
                style={{ background: "#FF6584" }}
              >
                Blacklister
              </button>
              <button
                onClick={() => setShowBlacklist(false)}
                className="px-4 py-2 rounded-xl text-white text-xs font-semibold transition-colors"
                style={{
                  background: "rgba(255,255,255,0.1)",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLElement).style.background =
                    "rgba(255,255,255,0.15)")
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLElement).style.background =
                    "rgba(255,255,255,0.1)")
                }
              >
                Annuler
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── LOADING SKELETON ────────────────────────────────────────────────────────

function LoadingSkeleton() {
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="rounded-2xl overflow-hidden"
            style={{ background: "#16213E", border: "1px solid rgba(255,255,255,0.05)" }}
          >
            <div
              className="w-full"
              style={{
                aspectRatio: "16/9",
                background: "linear-gradient(90deg, #0F1C3F 25%, #16213E 50%, #0F1C3F 75%)",
                backgroundSize: "200% 100%",
                animation: "shimmer 1.6s infinite",
              }}
            />
            <div className="p-4 space-y-3">
              <div
                className="h-4 rounded-lg"
                style={{
                  background:
                    "linear-gradient(90deg, rgba(255,255,255,0.06) 25%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.06) 75%)",
                  backgroundSize: "200% 100%",
                  animation: "shimmer 1.6s infinite",
                  animationDelay: `${i * 0.15}s`,
                }}
              />
              <div
                className="h-4 rounded-lg"
                style={{
                  width: "70%",
                  background:
                    "linear-gradient(90deg, rgba(255,255,255,0.06) 25%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.06) 75%)",
                  backgroundSize: "200% 100%",
                  animation: "shimmer 1.6s infinite",
                  animationDelay: `${i * 0.15 + 0.1}s`,
                }}
              />
              <div
                className="h-3 rounded-lg"
                style={{
                  width: "45%",
                  background: "rgba(255,255,255,0.04)",
                }}
              />
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="flex items-center justify-center gap-2 mt-8 text-sm"
        style={{ color: "#8892A4" }}
      >
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: "#6C63FF",
            }}
            animate={{ y: [0, -8, 0] }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: i * 0.2,
              ease: "easeInOut",
            }}
          />
        ))}
        <span className="ml-1">L'IA cherche la vidéo parfaite…</span>
      </motion.div>

    </div>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────

export default function ResultsClient() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const mood = searchParams.get("mood") || "interesting";
  const duration = parseInt(searchParams.get("duration") || "30");
  const language = searchParams.get("language") || "any";
  const isSurprise = searchParams.get("surprise") === "true";

  const [videos, setVideos] = useState<Video[]>([]);
  const [allVideos, setAllVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reason, setReason] = useState("");
  const [shareSuccess, setShareSuccess] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState<VideoItem[]>([]);

  const fetchVideos = useCallback(
    async (rejectedIds: string[] = []) => {
      setLoading(true);
      setError("");

      try {
        const currentHistory = getHistory();
        const blacklist = getBlacklist();
        setHistory(currentHistory);

        const res = await fetch("/api/match", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            mood,
            duration,
            language,
            isSurprise,
            history: currentHistory.map((v) => v.id),
            blacklist,
          }),
        });

        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.error || "Erreur lors de la recherche");
        }

        const data = await res.json();
        const filtered = (data.videos || []).filter(
          (v: Video) => !rejectedIds.includes(v.id)
        );

        setAllVideos(filtered);
        setVideos(filtered.slice(0, 3));
        setReason(data.reason || "");
      } catch (err: any) {
        setError(err.message || "Une erreur est survenue");
      } finally {
        setLoading(false);
      }
    },
    [mood, duration, language, isSurprise]
  );

  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);

  const handleReject = (videoId: string) => {
    const remaining = videos.filter((v) => v.id !== videoId);
    const rejectedSet = videos
      .filter((v) => v.id === videoId)
      .map((v) => v.id);

    // Try to replace from allVideos pool
    const usedIds = new Set([...remaining.map((v) => v.id), ...rejectedSet]);
    const nextVideo = allVideos.find((v) => !usedIds.has(v.id));

    if (nextVideo) {
      setVideos([...remaining, nextVideo]);
    } else {
      setVideos(remaining);
      // Fetch more if we're running low
      if (remaining.length < 2) {
        fetchVideos([...rejectedSet]);
      }
    }
  };

  const handleBlacklist = (video: Video) => {
    addToBlacklist(video.channelId);
    // Remove all videos from this channel
    setVideos((prev) => prev.filter((v) => v.channelId !== video.channelId));
    setAllVideos((prev) => prev.filter((v) => v.channelId !== video.channelId));
  };

  const handlePlay = (video: Video) => {
    addToHistory({
      id: video.id,
      title: video.title,
      channelId: video.channelId,
      channelTitle: video.channelTitle,
      thumbnail: video.thumbnail,
      duration: video.duration,
      watchedAt: Date.now(),
    });
    setHistory(getHistory());
  };

  const handleShare = async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      setShareSuccess(true);
      setTimeout(() => setShareSuccess(false), 2500);
    } catch {
      // Fallback: select text
    }
  };

  const handleSurprise = () => {
    const params = new URLSearchParams({
      mood: "surprise",
      duration: String(duration),
      language: "any",
      surprise: "true",
    });
    router.push(`/results?${params.toString()}`);
  };

  return (
    <main
      className="min-h-screen relative overflow-hidden"
      style={{ background: "#1A1A2E" }}
    >
      {/* Ambient blobs */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: "-20%",
          left: "-10%",
          width: "600px",
          height: "600px",
          borderRadius: "50%",
          background: "#6C63FF",
          opacity: 0.06,
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
          opacity: 0.06,
          filter: "blur(100px)",
        }}
      />

      <div className="relative max-w-6xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-2 text-sm transition-colors"
            style={{ color: "#8892A4" }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLElement).style.color = "white")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLElement).style.color = "#8892A4")
            }
          >
            <ArrowLeft size={16} />
            Retour
          </button>

          {/* Logo */}
          <span className="text-xl font-black">
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
          </span>

          <div className="flex items-center gap-2">
            {/* History */}
            <button
              onClick={() => {
                setHistory(getHistory());
                setShowHistory(!showHistory);
              }}
              className="p-2 rounded-xl transition-colors relative"
              style={{
                color: showHistory ? "#6C63FF" : "#8892A4",
                background: showHistory ? "rgba(108,99,255,0.1)" : "transparent",
                border: "1px solid",
                borderColor: showHistory
                  ? "rgba(108,99,255,0.3)"
                  : "rgba(255,255,255,0.08)",
              }}
              title="Historique"
            >
              <History size={16} />
              {history.length > 0 && (
                <span
                  className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-white flex items-center justify-center text-xs font-bold"
                  style={{ background: "#6C63FF", fontSize: 9 }}
                >
                  {history.length}
                </span>
              )}
            </button>

            {/* Surprise */}
            <button
              onClick={handleSurprise}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-colors"
              style={{
                border: "1px solid rgba(255,101,132,0.3)",
                color: "#FF6584",
                background: "rgba(255,101,132,0.05)",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.background = "rgba(255,101,132,0.12)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.background = "rgba(255,101,132,0.05)";
              }}
            >
              <Shuffle size={14} />
              Surprise
            </button>

            {/* Refresh */}
            <button
              onClick={() => fetchVideos()}
              className="p-2 rounded-xl transition-colors"
              style={{
                color: "#8892A4",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.color = "white";
                el.style.borderColor = "rgba(255,255,255,0.2)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.color = "#8892A4";
                el.style.borderColor = "rgba(255,255,255,0.08)";
              }}
              title="Nouvelles suggestions"
            >
              <RefreshCw size={16} />
            </button>

            {/* Share */}
            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-colors"
              style={{
                border: "1px solid rgba(255,255,255,0.08)",
                color: shareSuccess ? "#6C63FF" : "#8892A4",
                borderColor: shareSuccess ? "rgba(108,99,255,0.3)" : "rgba(255,255,255,0.08)",
              }}
            >
              {shareSuccess ? <Check size={14} /> : <Share2 size={14} />}
              {shareSuccess ? "Copié !" : "Partager"}
            </button>
          </div>
        </div>

        {/* Context tags */}
        <div className="flex items-center gap-2 mb-6 flex-wrap">
          <span
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold"
            style={{
              background: "rgba(108,99,255,0.15)",
              border: "1px solid rgba(108,99,255,0.25)",
              color: "#6C63FF",
            }}
          >
            <span>⏱</span> {duration} min
          </span>

          <span
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold"
            style={{
              background: isSurprise
                ? "rgba(255,101,132,0.15)"
                : "rgba(255,255,255,0.06)",
              border: isSurprise
                ? "1px solid rgba(255,101,132,0.25)"
                : "1px solid rgba(255,255,255,0.08)",
              color: isSurprise ? "#FF6584" : "#A0AEC0",
            }}
          >
            {getMoodEmoji(mood)}{" "}
            {isSurprise
              ? "Mode Surprise"
              : mood.split(" ")[0].charAt(0).toUpperCase() +
                mood.split(" ")[0].slice(1)}
          </span>

          <span
            className="px-3 py-1.5 rounded-lg text-xs font-semibold"
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.08)",
              color: "#A0AEC0",
            }}
          >
            {language === "fr" ? "🇫🇷" : language === "en" ? "🇬🇧" : "🌐"}
          </span>

          {reason && !loading && (
            <span
              className="text-xs ml-1 hidden sm:inline"
              style={{ color: "#6B7280" }}
            >
              — {reason}
            </span>
          )}
        </div>

        {/* History panel */}
        <AnimatePresence>
          {showHistory && (
            <motion.div
              initial={{ opacity: 0, height: 0, marginBottom: 0 }}
              animate={{ opacity: 1, height: "auto", marginBottom: 24 }}
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              className="overflow-hidden"
            >
              <div
                className="p-4 rounded-2xl"
                style={{
                  background: "#16213E",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-white">
                    Récemment regardé
                  </h3>
                  <span className="text-xs" style={{ color: "#6B7280" }}>
                    Effacé après 7 jours
                  </span>
                </div>
                {history.length === 0 ? (
                  <p className="text-xs" style={{ color: "#6B7280" }}>
                    Aucune vidéo regardée cette semaine
                  </p>
                ) : (
                  <div className="flex gap-3 overflow-x-auto pb-1">
                    {history.slice(0, 8).map((v) => (
                      <a
                        key={v.id}
                        href={`https://youtube.com/watch?v=${v.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="shrink-0 flex flex-col gap-1 group"
                        style={{ width: 100 }}
                      >
                        <div className="rounded-lg overflow-hidden" style={{ aspectRatio: "16/9" }}>
                          <img
                            src={v.thumbnail}
                            alt={v.title}
                            className="w-full h-full object-cover transition-transform group-hover:scale-105"
                          />
                        </div>
                        <span
                          className="text-xs leading-tight line-clamp-2"
                          style={{ color: "#8892A4" }}
                        >
                          {v.title}
                        </span>
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main content */}
        {loading ? (
          <LoadingSkeleton />
        ) : error ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <p className="mb-2 text-lg" style={{ color: "#FF6584" }}>
              😕 Oops, quelque chose s'est mal passé
            </p>
            <p className="text-sm mb-6" style={{ color: "#6B7280" }}>
              {error}
            </p>
            <button
              onClick={() => fetchVideos()}
              className="px-6 py-3 rounded-xl text-white font-semibold flex items-center gap-2 mx-auto"
              style={{ background: "#6C63FF" }}
            >
              <RefreshCw size={16} />
              Réessayer
            </button>
          </motion.div>
        ) : videos.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <p className="text-4xl mb-4">🤔</p>
            <p className="text-lg font-semibold text-white mb-2">
              Rien trouvé pour ce mood
            </p>
            <p className="text-sm mb-6" style={{ color: "#6B7280" }}>
              L'IA n'a pas trouvé de vidéos adaptées. Essaie le Mode Surprise ?
            </p>
            <button
              onClick={handleSurprise}
              className="px-6 py-3 rounded-xl text-white font-semibold flex items-center gap-2 mx-auto"
              style={{ background: "#FF6584" }}
            >
              <Shuffle size={16} />
              Mode Surprise
            </button>
          </motion.div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            <AnimatePresence mode="popLayout">
              {videos.map((video) => (
                <VideoCard
                  key={video.id}
                  video={video}
                  onReject={handleReject}
                  onBlacklist={handleBlacklist}
                  onPlay={handlePlay}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Footer */}
        {!loading && videos.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center mt-10 text-xs"
            style={{ color: "#4B5563" }}
          >
            Swipe ← ou clique ✕ pour passer · Clique ⊘ pour blacklister une chaîne
          </motion.div>
        )}
      </div>
    </main>
  );
}
