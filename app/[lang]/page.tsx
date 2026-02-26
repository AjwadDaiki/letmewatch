import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";

const LANG_DATA: Record<string, {
  title: string;
  description: string;
  h1: string;
  subheading: string;
  cta: string;
  moods: { id: string; label: string; emoji: string }[];
}> = {
  fr: {
    title: "Quoi regarder en mangeant — LetMeWatch",
    description: "Arrête de scroller pour trouver quoi regarder en mangeant. L'IA te trouve la vidéo YouTube parfaite en quelques secondes. Gratuit, sans compte.",
    h1: "Quoi regarder en mangeant ?",
    subheading: "Dis-nous ton humeur et combien de temps tu manges — on trouve la vidéo parfaite en moins de 10 secondes.",
    cta: "Trouve-moi quelque chose",
    moods: [
      { id: "funny",       label: "Drôle",    emoji: "😂" },
      { id: "chill",       label: "Détente",  emoji: "😌" },
      { id: "educational", label: "Éducatif", emoji: "🧠" },
      { id: "gaming",      label: "Gaming",   emoji: "🎮" },
      { id: "cooking",     label: "Cuisine",  emoji: "🍜" },
      { id: "cinema",      label: "Cinéma",   emoji: "🎬" },
      { id: "music",       label: "Musique",  emoji: "🎵" },
      { id: "science",     label: "Science",  emoji: "🔬" },
      { id: "true-crime",  label: "Crime",    emoji: "🕵️" },
      { id: "discovery",   label: "Surprise", emoji: "🔭" },
    ],
  },
  es: {
    title: "¿Qué ver en YouTube mientras como? — LetMeWatch",
    description: "Deja de buscar qué ver mientras comes. La IA encuentra el video de YouTube perfecto para tu humor en segundos. Gratis, sin cuenta.",
    h1: "¿Qué ver en YouTube mientras como?",
    subheading: "Dinos tu estado de ánimo y cuánto tiempo tienes — encontramos el video perfecto en menos de 10 segundos.",
    cta: "Encontrar algo para ver",
    moods: [
      { id: "funny",       label: "Gracioso",    emoji: "😂" },
      { id: "chill",       label: "Relajante",   emoji: "😌" },
      { id: "educational", label: "Educativo",   emoji: "🧠" },
      { id: "gaming",      label: "Gaming",      emoji: "🎮" },
      { id: "cooking",     label: "Cocina",      emoji: "🍜" },
      { id: "cinema",      label: "Cine",        emoji: "🎬" },
      { id: "music",       label: "Música",      emoji: "🎵" },
      { id: "science",     label: "Ciencia",     emoji: "🔬" },
      { id: "true-crime",  label: "True Crime",  emoji: "🕵️" },
      { id: "discovery",   label: "Descubrir",   emoji: "🔭" },
    ],
  },
  pt: {
    title: "O que assistir enquanto como no YouTube — LetMeWatch",
    description: "Pare de rolar o YouTube procurando o que assistir enquanto come. A IA encontra o vídeo perfeito para o seu humor em segundos. Grátis, sem conta.",
    h1: "O que assistir enquanto como?",
    subheading: "Diga-nos seu humor e quanto tempo você tem — encontramos o vídeo perfeito em menos de 10 segundos.",
    cta: "Encontrar um vídeo",
    moods: [
      { id: "funny",       label: "Engraçado",  emoji: "😂" },
      { id: "chill",       label: "Relaxante",  emoji: "😌" },
      { id: "educational", label: "Educativo",  emoji: "🧠" },
      { id: "gaming",      label: "Gaming",     emoji: "🎮" },
      { id: "cooking",     label: "Culinária",  emoji: "🍜" },
      { id: "cinema",      label: "Cinema",     emoji: "🎬" },
      { id: "music",       label: "Música",     emoji: "🎵" },
      { id: "science",     label: "Ciência",    emoji: "🔬" },
      { id: "true-crime",  label: "True Crime", emoji: "🕵️" },
      { id: "discovery",   label: "Descobrir",  emoji: "🔭" },
    ],
  },
};

const VALID_LANGS = Object.keys(LANG_DATA);

export async function generateStaticParams() {
  return VALID_LANGS.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const data = LANG_DATA[lang];
  if (!data) return {};

  return {
    title: data.title,
    description: data.description,
    alternates: { canonical: `https://letmewatch.me/${lang}` },
    openGraph: {
      title: data.title,
      description: data.description,
      url: `https://letmewatch.me/${lang}`,
    },
  };
}

export default async function LangPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const data = LANG_DATA[lang];
  if (!data) notFound();

  const S = {
    card:    { background: "#1c1917", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "14px" } as const,
    surface: "#26201d",
    muted:   "rgba(255,255,255,0.46)",
    red:     "#ef4444",
  };

  return (
    <main style={{
      minHeight: "100vh",
      background: "#0c0a09",
      color: "#f0ebe5",
      fontFamily: "var(--font-outfit, 'Inter', sans-serif)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "48px 16px",
    }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: data.title,
          description: data.description,
          url: `https://letmewatch.me/${lang}`,
          isPartOf: { "@type": "WebSite", url: "https://letmewatch.me", name: "LetMeWatch" },
        }) }}
      />

      <div style={{ width: "100%", maxWidth: "480px", display: "flex", flexDirection: "column", gap: "32px" }}>
        {/* Brand */}
        <div style={{ textAlign: "center" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            padding: "5px 13px 5px 9px",
            background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.22)",
            borderRadius: 999, fontSize: 13, fontWeight: 600, color: "#f87171",
            marginBottom: 20,
          }}>
            ▶ LetMeWatch
          </div>
          <h1 style={{ fontSize: "clamp(26px,6vw,36px)", fontWeight: 800, color: "white", margin: "0 0 12px", lineHeight: 1.1, letterSpacing: "-0.02em" }}>
            {data.h1}
          </h1>
          <p style={{ color: S.muted, margin: 0, fontSize: 15, lineHeight: 1.6 }}>
            {data.subheading}
          </p>
        </div>

        {/* Mood grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          {data.moods.map((m) => (
            <Link
              key={m.id}
              href={`/results?mood=${m.id}&duration=30&language=${lang}`}
              style={{
                ...S.card,
                padding: "14px 16px",
                display: "flex", alignItems: "center", gap: 10,
                textDecoration: "none", color: "white",
                transition: "border-color 0.18s",
              }}
            >
              <span style={{ fontSize: 22 }}>{m.emoji}</span>
              <span style={{ fontWeight: 600, fontSize: 14 }}>{m.label}</span>
            </Link>
          ))}
        </div>

        {/* CTA */}
        <Link
          href="/"
          style={{
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            padding: "15px", background: S.red, border: "none", borderRadius: 14,
            color: "white", fontWeight: 700, fontSize: 15, textDecoration: "none",
            boxShadow: "0 4px 20px rgba(239,68,68,0.35)",
          }}
        >
          {data.cta} →
        </Link>

        {/* Lang switcher */}
        <div style={{ textAlign: "center", display: "flex", justifyContent: "center", gap: 16, fontSize: 13 }}>
          {VALID_LANGS.filter(l => l !== lang).map(l => (
            <Link key={l} href={`/${l}`} style={{ color: S.muted, textDecoration: "none" }}>
              {l === "fr" ? "🇫🇷 Français" : l === "es" ? "🇪🇸 Español" : "🇧🇷 Português"}
            </Link>
          ))}
          <Link href="/" style={{ color: S.muted, textDecoration: "none" }}>🇬🇧 English</Link>
        </div>
      </div>
    </main>
  );
}
