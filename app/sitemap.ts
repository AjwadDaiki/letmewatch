import { MetadataRoute } from "next";

const BASE = "https://letmewatch.me";

const MOOD_SLUGS = [
  "funny", "chill", "educational", "gaming", "cooking",
  "cinema", "short", "drama", "music", "science",
  "true-crime", "anime", "tech", "travel", "sports", "discovery",
];

const DURATIONS = ["15min", "30min", "1hour"];
const LANG_CODES = ["fr", "es", "pt"];

export default function sitemap(): MetadataRoute.Sitemap {
  const moodPages = MOOD_SLUGS.map((slug) => ({
    url: `${BASE}/mood/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const durationPages = DURATIONS.map((d) => ({
    url: `${BASE}/duration/${d}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const langPages = LANG_CODES.map((lang) => ({
    url: `${BASE}/${lang}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [
    { url: BASE, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    ...moodPages,
    ...durationPages,
    ...langPages,
  ];
}
