import { NextRequest, NextResponse } from "next/server";
import { getYouTubeQueries } from "@/lib/groq";
import { searchVideos } from "@/lib/youtube";
import { getCached, setCached, makeCacheKey } from "@/lib/cache";

type VideoResult = Awaited<ReturnType<typeof searchVideos>>[number];
interface CachedPayload { videos: VideoResult[]; reason: string }

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      mood,
      duration,
      language,
      history = [],
      blacklist = [],
      isSurprise = false,
    } = body;

    if (!mood || !duration || !language) {
      return NextResponse.json(
        { error: "Paramètres manquants" },
        { status: 400 }
      );
    }

    // Cache only for non-surprise, non-personalised requests
    // (history/blacklist would make results stale for other users)
    const canCache = !isSurprise && history.length === 0 && blacklist.length === 0;
    const cacheKey = makeCacheKey(mood, String(duration), language);

    if (canCache) {
      const cached = getCached<CachedPayload>(cacheKey);
      if (cached) {
        return NextResponse.json({ ...cached, cached: true });
      }
    }

    // Get optimized queries from Groq
    const matchResult = await getYouTubeQueries({
      mood,
      duration: parseInt(duration),
      language,
      history,
      blacklist,
      isSurprise,
    });

    // Search YouTube in parallel for all queries
    const results = await Promise.allSettled(
      matchResult.queries.map((query) =>
        searchVideos(query, matchResult.maxDuration, blacklist, history)
      )
    );

    // Flatten fulfilled results, deduplicate
    const seen = new Set<string>();
    const seenChannels = new Set<string>();
    const videos = results
      .filter(
        (r): r is PromiseFulfilledResult<Awaited<ReturnType<typeof searchVideos>>> =>
          r.status === "fulfilled"
      )
      .flatMap((r) => r.value)
      .filter((v) => {
        if (seen.has(v.id)) return false;
        seen.add(v.id);
        return true;
      })
      // Limit to 2 videos per channel for variety
      .filter((v) => {
        const count = [...seenChannels].filter((c) => c === v.channelId).length;
        if (count >= 2) return false;
        seenChannels.add(v.channelId);
        return true;
      })
      .slice(0, 9); // Return up to 9, client picks top 3

    const payload: CachedPayload = { videos, reason: matchResult.reason };

    if (canCache) {
      setCached(cacheKey, payload, 3600); // 1 hour TTL
    }

    return NextResponse.json(payload);
  } catch (err: any) {
    console.error("[match] Error:", err);
    return NextResponse.json(
      { error: err.message || "Erreur lors de la recherche" },
      { status: 500 }
    );
  }
}
