export interface VideoResult {
  id: string;
  title: string;
  channelId: string;
  channelTitle: string;
  thumbnail: string;
  duration: number; // seconds
  publishedAt: string;
}

function parseDuration(iso: string): number {
  const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return 0;
  const h = parseInt(match[1] || "0");
  const m = parseInt(match[2] || "0");
  const s = parseInt(match[3] || "0");
  return h * 3600 + m * 60 + s;
}

export async function searchVideos(
  query: string,
  maxDurationSeconds: number,
  blacklistedChannels: string[] = [],
  historyIds: string[] = []
): Promise<VideoResult[]> {
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) throw new Error("YouTube API key manquante");

  // Choose duration filter for YouTube API
  let videoDuration = "any";
  if (maxDurationSeconds <= 240) videoDuration = "short"; // <4 min
  else if (maxDurationSeconds <= 1200) videoDuration = "medium"; // 4-20 min
  else videoDuration = "long"; // >20 min

  const searchUrl = new URL("https://www.googleapis.com/youtube/v3/search");
  searchUrl.searchParams.set("part", "snippet");
  searchUrl.searchParams.set("q", query);
  searchUrl.searchParams.set("type", "video");
  searchUrl.searchParams.set("videoDuration", videoDuration);
  searchUrl.searchParams.set("maxResults", "15");
  searchUrl.searchParams.set("safeSearch", "moderate");
  searchUrl.searchParams.set("videoEmbeddable", "true");
  searchUrl.searchParams.set("key", apiKey);

  const searchRes = await fetch(searchUrl.toString());
  if (!searchRes.ok) {
    const err = await searchRes.json();
    throw new Error(err?.error?.message || "Erreur YouTube API");
  }
  const searchData = await searchRes.json();

  if (!searchData.items?.length) return [];

  // Filter blacklisted channels
  const filtered = searchData.items.filter(
    (item: any) =>
      !blacklistedChannels.includes(item.snippet?.channelId || "") &&
      item.id?.videoId
  );

  if (!filtered.length) return [];

  const videoIds = filtered
    .map((item: any) => item.id.videoId)
    .filter(Boolean)
    .join(",");

  const detailUrl = new URL("https://www.googleapis.com/youtube/v3/videos");
  detailUrl.searchParams.set("part", "contentDetails,snippet");
  detailUrl.searchParams.set("id", videoIds);
  detailUrl.searchParams.set("key", apiKey);

  const detailRes = await fetch(detailUrl.toString());
  if (!detailRes.ok) return [];
  const detailData = await detailRes.json();

  if (!detailData.items) return [];

  return detailData.items
    .map((item: any) => {
      const duration = parseDuration(item.contentDetails?.duration || "");
      const thumbnails = item.snippet?.thumbnails || {};
      const thumbnail =
        thumbnails.maxres?.url ||
        thumbnails.standard?.url ||
        thumbnails.high?.url ||
        thumbnails.medium?.url ||
        `https://img.youtube.com/vi/${item.id}/hqdefault.jpg`;

      return {
        id: item.id,
        title: item.snippet?.title || "Sans titre",
        channelId: item.snippet?.channelId || "",
        channelTitle: item.snippet?.channelTitle || "",
        thumbnail,
        duration,
        publishedAt: item.snippet?.publishedAt || "",
      } as VideoResult;
    })
    .filter(
      (v: VideoResult) =>
        v.duration > 60 && // at least 1 min
        v.duration <= maxDurationSeconds + 300 && // 5 min grace period
        !historyIds.includes(v.id) &&
        !blacklistedChannels.includes(v.channelId)
    )
    .slice(0, 6);
}
