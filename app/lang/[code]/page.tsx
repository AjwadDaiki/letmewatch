import { notFound } from "next/navigation";
import type { Metadata } from "next";
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

  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://letmewatch.vercel.app";

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
    <main className="paper-grain min-h-screen px-4 py-6 md:px-8 md:py-10">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/"
          className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-[var(--wine)]"
        >
          ← LetMeWatch
        </Link>

        <section className="bistro-card rounded-[28px] p-7 md:p-10">
          <div className="text-center">
            <p className="text-6xl md:text-7xl">{config.flag}</p>
            <h1 className="mt-4 font-serif text-[clamp(2rem,5vw,3.2rem)] font-semibold text-[var(--charcoal)]">
              {config.h1}
            </h1>
            <p className="mx-auto mt-3 max-w-2xl text-[15px] md:text-base text-[rgba(21,32,51,0.72)]">
              {config.subheading}
            </p>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-2.5">
              {[15, 30, 65].map((value) => (
                <Link
                  key={value}
                  href={`/results?mood=interesting+popular+trending&duration=${value}&language=${code}&surprise=false`}
                  className="yt-button rounded-xl border border-[rgba(21,32,51,0.14)] bg-white px-4 py-2 text-sm font-semibold text-[var(--charcoal)]"
                >
                  {value === 65 ? "1h+" : `${value} min`}
                </Link>
              ))}
            </div>

            <Link
              href={ctaUrl}
              className="yt-button mt-6 inline-flex items-center gap-2 rounded-2xl bg-[var(--wine)] px-7 py-3.5 text-sm font-semibold text-white shadow-[0_10px_22px_rgba(255,47,79,0.24)] md:text-base"
            >
              {config.cta}
            </Link>
          </div>
        </section>

        <section className="mt-5 bistro-card rounded-[28px] p-6 md:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--wine)]">
            Categories
          </p>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
            {MOOD_SLUGS.map((slug) => {
              const mood = MOOD_CONFIG[slug];
              return (
                <Link
                  key={slug}
                  href={`/results?mood=${encodeURIComponent(mood.moodValue)}&duration=30&language=${code}&surprise=false`}
                  className="yt-button rounded-xl border border-[rgba(21,32,51,0.12)] bg-white/80 px-3 py-3 text-center"
                >
                  <span className="block text-xl">{mood.emoji}</span>
                  <span className="mt-1 block text-xs font-semibold text-[var(--charcoal)]">{mood.label}</span>
                </Link>
              );
            })}
          </div>
        </section>

        <section className="mt-5 bistro-card rounded-[28px] p-6 md:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--wine)]">
            Other languages
          </p>
          <div className="mt-4 flex flex-wrap gap-2.5">
            <Link
              href="/"
              className="yt-button rounded-xl border border-[rgba(21,32,51,0.14)] bg-white px-4 py-2 text-sm font-semibold text-[var(--charcoal)]"
            >
              🇬🇧 English
            </Link>
            {LANG_CODES.filter((c) => c !== code).map((c) => {
              const lang = LANG_CONFIG[c];
              return (
                <Link
                  key={c}
                  href={`/lang/${c}`}
                  className="yt-button rounded-xl border border-[rgba(21,32,51,0.14)] bg-white px-4 py-2 text-sm font-semibold text-[var(--charcoal)]"
                >
                  {lang.flag} {lang.label}
                </Link>
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
}
