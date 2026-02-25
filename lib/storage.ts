const HISTORY_KEY = "letmeeat_history";
const BLACKLIST_KEY = "letmeeat_blacklist";

const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

export interface VideoItem {
  id: string;
  title: string;
  channelId: string;
  channelTitle: string;
  thumbnail: string;
  duration: number;
  watchedAt: number;
}

export function getHistory(): VideoItem[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(HISTORY_KEY);
    if (!stored) return [];
    const items: VideoItem[] = JSON.parse(stored);
    const weekAgo = Date.now() - WEEK_MS;
    return items.filter((item) => item.watchedAt > weekAgo).slice(0, 30);
  } catch {
    return [];
  }
}

export function addToHistory(video: VideoItem): void {
  if (typeof window === "undefined") return;
  try {
    const history = getHistory();
    const filtered = history.filter((v) => v.id !== video.id);
    const updated = [video, ...filtered].slice(0, 30);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
  } catch {}
}

export function getBlacklist(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(BLACKLIST_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function addToBlacklist(channelId: string): void {
  if (typeof window === "undefined") return;
  try {
    const list = getBlacklist();
    if (!list.includes(channelId)) {
      localStorage.setItem(
        BLACKLIST_KEY,
        JSON.stringify([...list, channelId])
      );
    }
  } catch {}
}

export function removeFromBlacklist(channelId: string): void {
  if (typeof window === "undefined") return;
  try {
    const list = getBlacklist();
    localStorage.setItem(
      BLACKLIST_KEY,
      JSON.stringify(list.filter((id) => id !== channelId))
    );
  } catch {}
}
