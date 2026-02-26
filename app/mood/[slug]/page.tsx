import { notFound } from "next/navigation";
import type { Metadata } from "next";
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

  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://letmewatch.vercel.app";

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
              <p className="text-6xl md:text-7xl">{config.emoji}</p>
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
                    href={`/results?mood=${encodeURIComponent(config.moodValue)}&duration=${value}&language=any&surprise=false`}
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
                Get {config.label} recommendations →
              </Link>
            </div>
          </section>

          <section className="mt-5 bistro-card rounded-[28px] p-6 md:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--wine)]">
              What to expect
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {config.whatToExpect.map((item) => (
                <div
                  key={item}
                  className="rounded-xl border border-[rgba(21,32,51,0.12)] bg-white/78 px-4 py-3 text-sm text-[var(--charcoal)]"
                >
                  {item}
                </div>
              ))}
            </div>
          </section>

          <section className="mt-5 bistro-card rounded-[28px] p-6 md:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--wine)]">
              FAQ
            </p>
            <div className="mt-4 space-y-3">
              {config.faqs.map((faq) => (
                <article
                  key={faq.q}
                  className="rounded-xl border border-[rgba(21,32,51,0.12)] bg-white/78 px-4 py-4"
                >
                  <h2 className="text-sm font-semibold text-[var(--charcoal)]">{faq.q}</h2>
                  <p className="mt-1.5 text-sm text-[rgba(21,32,51,0.68)]">{faq.a}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="mt-5 bistro-card rounded-[28px] p-6 md:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--wine)]">
              Explore other categories
            </p>
            <div className="mt-4 flex flex-wrap gap-2.5">
              {MOOD_SLUGS.filter((s) => s !== slug).map((s) => {
                const mood = MOOD_CONFIG[s];
                return (
                  <Link
                    key={s}
                    href={`/mood/${s}`}
                    className="yt-button rounded-xl border border-[rgba(21,32,51,0.14)] bg-white px-4 py-2 text-sm font-semibold text-[var(--charcoal)]"
                  >
                    {mood.emoji} {mood.label}
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
