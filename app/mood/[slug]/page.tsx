import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import { MOOD_CONFIG, MOOD_SLUGS } from "@/lib/moodConfig";

export async function generateStaticParams() {
  return MOOD_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const config = MOOD_CONFIG[slug];
  if (!config) return {};

  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://letmeeat.vercel.app";

  return {
    title: config.title,
    description: config.description,
    openGraph: {
      title: config.title,
      description: config.description,
      url: `${SITE_URL}/mood/${slug}`,
      type: "website",
    },
    alternates: {
      canonical: `${SITE_URL}/mood/${slug}`,
    },
  };
}

export default async function MoodPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const config = MOOD_CONFIG[slug];
  if (!config) notFound();

  const ctaUrl = `/results?mood=${encodeURIComponent(config.moodValue)}&duration=30&language=any&surprise=false`;

  const schemaFAQ = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: config.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.a,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaFAQ) }}
      />

      <main
        style={{ background: "#1A1A2E", minHeight: "100vh", color: "white" }}
      >
        {/* Ambient blobs */}
        <div
          style={{
            position: "fixed",
            top: "-15%",
            left: "-10%",
            width: 600,
            height: 600,
            borderRadius: "50%",
            background: "#6C63FF",
            opacity: 0.07,
            filter: "blur(120px)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "fixed",
            bottom: "-20%",
            right: "-10%",
            width: 500,
            height: 500,
            borderRadius: "50%",
            background: "#FF6584",
            opacity: 0.07,
            filter: "blur(100px)",
            pointerEvents: "none",
          }}
        />

        <div
          style={{
            maxWidth: 720,
            margin: "0 auto",
            padding: "48px 24px 80px",
            position: "relative",
          }}
        >
          {/* Back link */}
          <Link
            href="/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              color: "#8892A4",
              textDecoration: "none",
              fontSize: 14,
              marginBottom: 40,
            }}
          >
            ← LetMeEat
          </Link>

          {/* Hero */}
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <div style={{ fontSize: 64, marginBottom: 16 }}>{config.emoji}</div>

            <h1
              style={{
                fontSize: "clamp(28px, 5vw, 44px)",
                fontWeight: 900,
                lineHeight: 1.2,
                letterSpacing: "-1px",
                marginBottom: 16,
                color: "white",
              }}
            >
              {config.h1}
            </h1>

            <p
              style={{
                fontSize: 18,
                color: "#A0AEC0",
                lineHeight: 1.6,
                marginBottom: 36,
                maxWidth: 560,
                margin: "0 auto 36px",
              }}
            >
              {config.subheading}
            </p>

            {/* Duration selector links */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: 12,
                marginBottom: 28,
                flexWrap: "wrap",
              }}
            >
              {[
                { label: "15 min", value: 15 },
                { label: "30 min", value: 30 },
                { label: "1 hour+", value: 65 },
              ].map((d) => (
                <Link
                  key={d.value}
                  href={`/results?mood=${encodeURIComponent(config.moodValue)}&duration=${d.value}&language=any&surprise=false`}
                  style={{
                    padding: "10px 20px",
                    borderRadius: 12,
                    border: "1px solid rgba(108,99,255,0.3)",
                    color: "#A0AEC0",
                    textDecoration: "none",
                    fontSize: 14,
                    fontWeight: 500,
                    background: "rgba(108,99,255,0.08)",
                    transition: "all 0.2s",
                  }}
                >
                  {d.label} meal
                </Link>
              ))}
            </div>

            <Link
              href={ctaUrl}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "16px 36px",
                borderRadius: 16,
                background: "linear-gradient(135deg, #6C63FF, #7C73FF)",
                color: "white",
                fontWeight: 700,
                fontSize: 18,
                textDecoration: "none",
                boxShadow: "0 0 30px rgba(108,99,255,0.35)",
              }}
            >
              Get {config.label} recommendations →
            </Link>
          </div>

          {/* What to expect */}
          <section style={{ marginBottom: 56 }}>
            <h2
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: "#6C63FF",
                marginBottom: 20,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
              }}
            >
              What to expect
            </h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 12,
              }}
            >
              {config.whatToExpect.map((item) => (
                <div
                  key={item}
                  style={{
                    padding: "16px 20px",
                    borderRadius: 14,
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.07)",
                    color: "#A0AEC0",
                    fontSize: 15,
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                  }}
                >
                  <span style={{ color: "#6C63FF" }}>✓</span>
                  {item}
                </div>
              ))}
            </div>
          </section>

          {/* How it works */}
          <section style={{ marginBottom: 56 }}>
            <h2
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: "#6C63FF",
                marginBottom: 20,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
              }}
            >
              How it works
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[
                { n: "1", text: "Pick your meal duration — 15 min, 30 min, or 1 hour+" },
                { n: "2", text: `Choose ${config.label} as your vibe (or type anything)` },
                { n: "3", text: "Select your language preference" },
                { n: "4", text: "Get 3 perfectly matched YouTube videos — instantly" },
              ].map(({ n, text }) => (
                <div
                  key={n}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 16,
                    padding: "14px 20px",
                    borderRadius: 14,
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.06)",
                  }}
                >
                  <span
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 8,
                      background: "linear-gradient(135deg, #6C63FF, #FF6584)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 13,
                      fontWeight: 700,
                      color: "white",
                      flexShrink: 0,
                    }}
                  >
                    {n}
                  </span>
                  <span style={{ color: "#A0AEC0", fontSize: 15 }}>{text}</span>
                </div>
              ))}
            </div>
          </section>

          {/* FAQ */}
          <section style={{ marginBottom: 56 }}>
            <h2
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: "#6C63FF",
                marginBottom: 20,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
              }}
            >
              FAQ
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {config.faqs.map((faq) => (
                <div
                  key={faq.q}
                  style={{
                    padding: "20px 24px",
                    borderRadius: 16,
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.07)",
                  }}
                >
                  <h3
                    style={{
                      fontSize: 16,
                      fontWeight: 600,
                      color: "white",
                      marginBottom: 8,
                    }}
                  >
                    {faq.q}
                  </h3>
                  <p style={{ fontSize: 14, color: "#8892A4", lineHeight: 1.6, margin: 0 }}>
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Other moods */}
          <section>
            <h2
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: "#6C63FF",
                marginBottom: 16,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
              }}
            >
              Explore other moods
            </h2>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
              {MOOD_SLUGS.filter((s) => s !== slug).map((s) => {
                const m = MOOD_CONFIG[s];
                return (
                  <Link
                    key={s}
                    href={`/mood/${s}`}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      padding: "8px 16px",
                      borderRadius: 10,
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      color: "#8892A4",
                      textDecoration: "none",
                      fontSize: 13,
                    }}
                  >
                    {m.emoji} {m.label}
                  </Link>
                );
              })}
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
