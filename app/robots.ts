import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/results"],
    },
    sitemap: "https://letmewatch.me/sitemap.xml",
  };
}
