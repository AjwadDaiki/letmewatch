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
  if (isSurprise) return "Carte blanche";
  const first = mood.split(" ")[0] || "mood";
  return first.charAt(0).toUpperCase() + first.slice(1);
}

function languageFlag(language: string): string {
  if (language === "fr") return "🇫🇷";
  if (language === "en") return "🇬🇧";
  return "🌐";
}

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
  const rotate = useTransform(x, [-120, 120], [-5, 5]);
  const opacity = useTransform(x, [-150, -30, 0, 30, 150], [0, 0.85, 1, 0.85, 0]);

  const handlePlay = () => {
    onPlay(video);
    setIsPlaying(true);
  };

  return (
    <motion.article
      drag="x"
      dragElastic={0.18}
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={(_, info) => {
        if (Math.abs(info.offset.x) > 85) onReject(video.id);
      }}
      layout
      initial={{ opacity: 0, y: 18, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: -50, scale: 0.94, transition: { duration: 0.2 } }}
      transition={{ duration: 0.3 }}
      style={{ x, rotate, opacity }}
      className="group rounded-[22px] border border-[rgba(43,33,28,0.2)] bg-[rgba(255,251,245,0.83)] overflow-hidden shadow-[0_12px_30px_rgba(43,33,28,0.1)]"
    >
      <div className="relative" style={{ aspectRatio: "16/9" }}>
        {isPlaying ? (
          <iframe
            src={`https://www.youtube.com/embed/${video.id}?autoplay=1&rel=0`}
            allow="autoplay; encrypted-media; fullscreen"
            allowFullScreen
            className="h-full w-full"
            style={{ border: "none" }}
          />
        ) : (
          <>
            <img
              src={video.thumbnail}
              alt={video.title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              onError={(e) => {
                (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${video.id}/hqdefault.jpg`;
              }}
              draggable={false}
            />

            <button
              onClick={handlePlay}
              className="absolute inset-0 grid place-content-center"
              style={{ background: "linear-gradient(180deg, rgba(29,23,19,0.05), rgba(29,23,19,0.35))" }}
            >
              <span className="h-14 w-14 rounded-full bg-[rgba(247,239,225,0.95)] text-[var(--wine)] grid place-content-center shadow-[0_8px_20px_rgba(29,23,19,0.35)] transition-transform group-hover:scale-105">
                <Play size={22} fill="currentColor" style={{ marginLeft: 2 }} />
              </span>
            </button>

            <span className="absolute right-2 bottom-2 rounded-md bg-[rgba(29,23,19,0.85)] px-2 py-0.5 text-xs font-semibold text-[#f4ecdf]">
              {formatDuration(video.duration)}
            </span>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onReject(video.id);
              }}
              className="absolute right-2 top-2 h-8 w-8 rounded-full bg-[rgba(29,23,19,0.55)] text-[#f4ecdf] grid place-content-center opacity-0 transition-opacity group-hover:opacity-100"
            >
              <X size={14} />
            </button>

            <span className="absolute left-2 bottom-2 rounded-md bg-[rgba(247,239,225,0.9)] px-2 py-0.5 text-[10px] uppercase tracking-[0.16em] text-[var(--wine)] opacity-0 transition-opacity group-hover:opacity-100">
              swipe gauche
            </span>
          </>
        )}
      </div>

      <div className="p-4">
        <h3 className="line-clamp-2 min-h-10 font-semibold text-[14px] text-[var(--charcoal)]">{video.title}</h3>
        <div className="mt-3 flex items-center justify-between gap-2">
          <span className="truncate text-xs text-[rgba(43,33,28,0.7)]" title={video.channelTitle}>
            {video.channelTitle}
          </span>

          <div className="flex items-center gap-1">
            <a
              href={`https://youtube.com/watch?v=${video.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border border-[rgba(43,33,28,0.15)] p-1.5 text-[rgba(43,33,28,0.7)] hover:text-[var(--charcoal)]"
              onClick={(e) => e.stopPropagation()}
              title="Ouvrir sur YouTube"
            >
              <ExternalLink size={13} />
            </a>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowBlacklist(true);
              }}
              className="rounded-lg border border-[rgba(110,30,42,0.2)] p-1.5 text-[var(--wine)]"
              title="Ne plus voir cette chaine"
            >
              <Ban size={13} />
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showBlacklist && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-[rgba(29,23,19,0.93)] p-5 text-[#f4ecdf]"
          >
            <p className="text-center text-sm leading-relaxed">
              Retirer definitivement <span className="text-[#e9b2b8]">{video.channelTitle}</span> ?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  onBlacklist(video);
                  setShowBlacklist(false);
                }}
                className="rounded-xl bg-[var(--wine)] px-4 py-2 text-xs font-semibold text-white"
              >
                Blacklister
              </button>
              <button
                onClick={() => setShowBlacklist(false)}
                className="rounded-xl border border-[rgba(247,239,225,0.25)] px-4 py-2 text-xs font-semibold"
              >
                Annuler
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  );
}

function LoadingSkeleton() {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="overflow-hidden rounded-[22px] border border-[rgba(43,33,28,0.14)] bg-[rgba(255,251,245,0.72)]"
        >
          <div
            style={{
              aspectRatio: "16/9",
              background:
                "linear-gradient(90deg, rgba(141,45,62,0.08) 25%, rgba(247,239,225,0.8) 50%, rgba(141,45,62,0.08) 75%)",
              backgroundSize: "200% 100%",
              animation: "shimmer 1.5s infinite",
            }}
          />
          <div className="space-y-2 p-4">
            <div className="h-4 rounded bg-[rgba(43,33,28,0.1)]" />
            <div className="h-4 w-3/4 rounded bg-[rgba(43,33,28,0.08)]" />
            <div className="h-3 w-1/3 rounded bg-[rgba(43,33,28,0.06)]" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function ResultsClient() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const mood = searchParams.get("mood") || "interesting";
  const duration = parseInt(searchParams.get("duration") || "30", 10);
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
        const filtered = (data.videos || []).filter((v: Video) => !rejectedIds.includes(v.id));

        setAllVideos(filtered);
        setVideos(filtered.slice(0, 3));
        setReason(data.reason || "");
      } catch (err: unknown) {
        if (err instanceof Error) setError(err.message);
        else setError("Une erreur est survenue");
      } finally {
        setLoading(false);
      }
    },
    [duration, isSurprise, language, mood]
  );

  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);

  const handleReject = (videoId: string) => {
    const remaining = videos.filter((v) => v.id !== videoId);
    const rejectedSet = videos.filter((v) => v.id === videoId).map((v) => v.id);

    const usedIds = new Set([...remaining.map((v) => v.id), ...rejectedSet]);
    const nextVideo = allVideos.find((v) => !usedIds.has(v.id));

    if (nextVideo) {
      setVideos([...remaining, nextVideo]);
    } else {
      setVideos(remaining);
      if (remaining.length < 2) fetchVideos([...rejectedSet]);
    }
  };

  const handleBlacklist = (video: Video) => {
    addToBlacklist(video.channelId);
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
    try {
      await navigator.clipboard.writeText(window.location.href);
      setShareSuccess(true);
      window.setTimeout(() => setShareSuccess(false), 2200);
    } catch {
      setShareSuccess(false);
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
    <main className="paper-grain min-h-screen px-4 py-6 md:px-8 md:py-10">
      <div className="mx-auto max-w-6xl">
        <header className="mb-6 rounded-[24px] border border-[rgba(43,33,28,0.18)] bg-[rgba(255,251,245,0.76)] p-4 md:p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <button
              onClick={() => router.push("/")}
              className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--wine)]"
            >
              <ArrowLeft size={16} /> Retour au menu
            </button>

            <p className="font-serif text-[clamp(1.2rem,3.5vw,1.8rem)] text-[var(--charcoal)]">Service en cours</p>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setHistory(getHistory());
                  setShowHistory((prev) => !prev);
                }}
                className="relative rounded-xl border border-[rgba(43,33,28,0.16)] bg-white/50 p-2 text-[var(--charcoal)]"
                title="Historique"
              >
                <History size={16} />
                {history.length > 0 && (
                  <span className="absolute -right-1 -top-1 grid h-4 w-4 place-content-center rounded-full bg-[var(--wine)] text-[9px] font-bold text-white">
                    {history.length}
                  </span>
                )}
              </button>

              <button
                onClick={handleSurprise}
                className="inline-flex items-center gap-1.5 rounded-xl border border-[rgba(110,30,42,0.3)] bg-[rgba(110,30,42,0.08)] px-3 py-2 text-sm font-semibold text-[var(--wine)]"
              >
                <Shuffle size={14} /> Carte blanche
              </button>

              <button
                onClick={() => fetchVideos()}
                className="rounded-xl border border-[rgba(43,33,28,0.16)] bg-white/50 p-2 text-[var(--charcoal)]"
                title="Rafraichir"
              >
                <RefreshCw size={16} />
              </button>

              <button
                onClick={handleShare}
                className="inline-flex items-center gap-1.5 rounded-xl border border-[rgba(43,33,28,0.16)] bg-white/50 px-3 py-2 text-sm font-semibold text-[var(--charcoal)]"
              >
                {shareSuccess ? <Check size={14} /> : <Share2 size={14} />}
                {shareSuccess ? "Copie" : "Partager"}
              </button>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
            <span className="rounded-full border border-[rgba(110,30,42,0.25)] bg-[rgba(110,30,42,0.1)] px-3 py-1 font-semibold text-[var(--wine)]">
              {duration} min
            </span>
            <span className="rounded-full border border-[rgba(43,33,28,0.2)] bg-white/65 px-3 py-1 font-semibold text-[var(--charcoal)]">
              {getMoodLabel(mood, isSurprise)}
            </span>
            <span className="rounded-full border border-[rgba(43,33,28,0.2)] bg-white/65 px-3 py-1 font-semibold text-[var(--charcoal)]">
              {languageFlag(language)}
            </span>
            {reason && !loading && (
              <span className="text-[rgba(29,23,19,0.65)]">Selection: {reason}</span>
            )}
          </div>
        </header>

        <AnimatePresence>
          {showHistory && (
            <motion.section
              initial={{ opacity: 0, height: 0, marginBottom: 0 }}
              animate={{ opacity: 1, height: "auto", marginBottom: 16 }}
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              className="overflow-hidden"
            >
              <div className="rounded-[20px] border border-[rgba(43,33,28,0.18)] bg-[rgba(255,251,245,0.76)] p-4">
                <div className="mb-3 flex items-center justify-between">
                  <p className="font-semibold text-[var(--charcoal)]">Recemment servi</p>
                  <p className="text-xs text-[rgba(29,23,19,0.6)]">Expire apres 7 jours</p>
                </div>

                {history.length === 0 ? (
                  <p className="text-sm text-[rgba(29,23,19,0.65)]">Aucune video regarde cette semaine.</p>
                ) : (
                  <div className="flex gap-3 overflow-x-auto pb-1">
                    {history.slice(0, 8).map((v) => (
                      <a
                        key={v.id}
                        href={`https://youtube.com/watch?v=${v.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-[112px] shrink-0"
                      >
                        <img
                          src={v.thumbnail}
                          alt={v.title}
                          className="w-full rounded-lg border border-[rgba(43,33,28,0.12)]"
                          style={{ aspectRatio: "16/9", objectFit: "cover" }}
                        />
                        <span className="mt-1 block line-clamp-2 text-xs text-[rgba(29,23,19,0.7)]">{v.title}</span>
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {loading ? (
          <LoadingSkeleton />
        ) : error ? (
          <section className="rounded-[22px] border border-[rgba(110,30,42,0.2)] bg-[rgba(255,251,245,0.76)] p-10 text-center">
            <p className="font-serif text-3xl text-[var(--wine)]">Service interrompu</p>
            <p className="mt-2 text-sm text-[rgba(29,23,19,0.72)]">{error}</p>
            <button
              onClick={() => fetchVideos()}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[var(--wine)] px-5 py-3 text-sm font-semibold text-white"
            >
              <RefreshCw size={15} /> Reessayer
            </button>
          </section>
        ) : videos.length === 0 ? (
          <section className="rounded-[22px] border border-[rgba(43,33,28,0.18)] bg-[rgba(255,251,245,0.76)] p-10 text-center">
            <p className="font-serif text-3xl text-[var(--charcoal)]">Rien en cuisine pour ce mood</p>
            <p className="mt-2 text-sm text-[rgba(29,23,19,0.7)]">Lance carte blanche pour trouver une piste inattendue.</p>
            <button
              onClick={handleSurprise}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[var(--wine)] px-5 py-3 text-sm font-semibold text-white"
            >
              <Shuffle size={15} /> Carte blanche
            </button>
          </section>
        ) : (
          <motion.section layout className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
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
          </motion.section>
        )}

        {!loading && videos.length > 0 && (
          <p className="mt-8 text-center text-xs uppercase tracking-[0.16em] text-[rgba(29,23,19,0.58)]">
            Swipe gauche ou bouton X pour passer - bouton interdit pour blacklister
          </p>
        )}
      </div>
    </main>
  );
}
