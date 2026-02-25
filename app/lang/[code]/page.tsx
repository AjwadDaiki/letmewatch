import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import { LANG_CONFIG, LANG_CODES } from "@/lib/langConfig";
import { MOOD_CONFIG, MOOD_SLUGS } from "@/lib/moodConfig";

export async function generateStaticParams() {
  return LANG_CODES.map((code) => ({ code }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ code: string }>;
}): Promise<Metadata> {
  const { code } = await params;
  const config = LANG_CONFIG[code];
  if (!config) return {};

  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://letmeeat.vercel.app";

  return {
    title: config.title,
    description: config.description,
    openGraph: {
      title: config.title,
      description: config.description,
      url: `${SITE_URL}/lang/${code}`,
      type: "website",
    },
    alternates: {
      canonical: `${SITE_URL}/lang/${code}`,
      languages: {
        [code]: `${SITE_URL}/lang/${code}`,
      },
    },
  };
}

export default async function LangPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const config = LANG_CONFIG[code];
  if (!config) notFound();

  const ctaUrl = `/results?mood=interesting+popular+trending&duration=30&language=${code}&surprise=false`;

  return (
    <main style={{ background: "#1A1A2E", minHeight: "100vh", color: "white" }}>
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
          <div style={{ fontSize: 80, marginBottom: 16 }}>{config.flag}</div>

          <h1
            style={{
              fontSize: "clamp(26px, 5vw, 42px)",
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

          {/* Duration links */}
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
              { label: "1h+", value: 65 },
            ].map((d) => (
              <Link
                key={d.value}
                href={`/results?mood=interesting+popular+trending&duration=${d.value}&language=${code}&surprise=false`}
                style={{
                  padding: "10px 20px",
                  borderRadius: 12,
                  border: "1px solid rgba(108,99,255,0.3)",
                  color: "#A0AEC0",
                  textDecoration: "none",
                  fontSize: 14,
                  fontWeight: 500,
                  background: "rgba(108,99,255,0.08)",
                }}
              >
                {d.label}
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
            {config.cta}
          </Link>
        </div>

        {/* Browse by mood in this language */}
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
            Browse by mood — in {config.label}
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
              gap: 12,
            }}
          >
            {MOOD_SLUGS.map((slug) => {
              const mood = MOOD_CONFIG[slug];
              return (
                <Link
                  key={slug}
                  href={`/results?mood=${encodeURIComponent(mood.moodValue)}&duration=30&language=${code}&surprise=false`}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 8,
                    padding: "16px 12px",
                    borderRadius: 14,
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.07)",
                    textDecoration: "none",
                    color: "#A0AEC0",
                    fontSize: 13,
                    fontWeight: 500,
                  }}
                >
                  <span style={{ fontSize: 28 }}>{mood.emoji}</span>
                  <span>{mood.label}</span>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Other languages */}
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
            Other languages
          </h2>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <Link
              href="/"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "10px 18px",
                borderRadius: 12,
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                color: "#8892A4",
                textDecoration: "none",
                fontSize: 14,
              }}
            >
              🇬🇧 English
            </Link>
            {LANG_CODES.filter((c) => c !== code).map((c) => {
              const l = LANG_CONFIG[c];
              return (
                <Link
                  key={c}
                  href={`/lang/${c}`}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "10px 18px",
                    borderRadius: 12,
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    color: "#8892A4",
                    textDecoration: "none",
                    fontSize: 14,
                  }}
                >
                  {l.flag} {l.label}
                </Link>
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
}
