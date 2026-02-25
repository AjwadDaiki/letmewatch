import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { mood, duration, language, videoId } = body;

    const params = new URLSearchParams({
      mood: mood || "",
      duration: String(duration || "30"),
      language: language || "any",
      ...(videoId ? { v: videoId } : {}),
    });

    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    const shareUrl = `${siteUrl}/results?${params.toString()}`;

    return NextResponse.json({ url: shareUrl });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
