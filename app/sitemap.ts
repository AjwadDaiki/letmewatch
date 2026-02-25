import { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://letmeeat.vercel.app";

const MOOD_SLUGS = [
  "funny",
  "chill",
  "educational",
  "gaming",
  "cooking",
  "cinema",
  "short",
  "drama",
  "music",
  "science",
];

const LANG_CODES = ["fr", "es", "pt"];

export default function sitemap(): MetadataRoute.Sitemap {
  const moodPages = MOOD_SLUGS.map((slug) => ({
    url: `${SITE_URL}/mood/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const langPages = LANG_CODES.map((code) => ({
    url: `${SITE_URL}/lang/${code}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    ...moodPages,
    ...langPages,
  ];
}
