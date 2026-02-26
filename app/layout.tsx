import type { Metadata } from "next";
import { Outfit, Plus_Jakarta_Sans } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

const SITE_URL = "https://letmewatch.me";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "LetMeWatch — Find the Perfect YouTube Video to Watch While Eating",
    template: "%s | LetMeWatch",
  },
  description:
    "Stop spending 10 minutes finding what to watch while eating. Tell us your mood, get the perfect YouTube video in seconds. AI-powered, no account needed.",
  keywords: [
    "what to watch while eating",
    "videos to watch while eating",
    "youtube while eating",
    "what to watch during lunch",
    "youtube videos to watch while eating alone",
    "what to watch while eating dinner",
    "best youtube channels while eating",
    "quoi regarder en mangeant",
    "que ver en youtube mientras como",
  ],
  authors: [{ name: "LetMeWatch" }],
  creator: "LetMeWatch",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: "LetMeWatch",
    title: "LetMeWatch — Find the Perfect YouTube Video to Watch While Eating",
    description:
      "Stop spending 10 minutes finding what to watch while eating. AI picks the perfect YouTube video for your mood in seconds.",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "LetMeWatch - Find YouTube videos to watch while eating",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "LetMeWatch — Find the Perfect YouTube Video to Watch While Eating",
    description:
      "AI picks the perfect YouTube video for your meal in seconds. No account, no scrolling.",
    images: ["/opengraph-image"],
    creator: "@letmewatch",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: SITE_URL,
    languages: {
      "en-US": SITE_URL,
      "fr-FR": `${SITE_URL}/fr`,
      "es-ES": `${SITE_URL}/es`,
      "pt-BR": `${SITE_URL}/pt`,
    },
  },
};

const schemaOrg = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "@id": `${SITE_URL}/#webapp`,
      name: "LetMeWatch",
      url: SITE_URL,
      description:
        "AI-powered YouTube video recommender for meal times. Tell us your mood, get the perfect video in seconds.",
      applicationCategory: "EntertainmentApplication",
      operatingSystem: "Web",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
      featureList: [
        "AI-powered video matching",
        "Mood-based recommendations",
        "Duration filtering",
        "Multi-language support",
        "No account required",
      ],
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "What should I watch while eating?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "LetMeWatch uses AI to find the perfect YouTube video for your meal based on your mood and how much time you have. Just describe your vibe and get instant recommendations — no scrolling needed.",
          },
        },
        {
          "@type": "Question",
          name: "What are good YouTube videos to watch while eating?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "The best YouTube videos to watch while eating depend on your mood and meal duration. Funny videos, gaming commentary, documentaries, and video essays are popular choices. LetMeWatch AI-matches the perfect video to your exact mood.",
          },
        },
        {
          "@type": "Question",
          name: "How do I find a YouTube video to watch during lunch?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "On LetMeWatch, describe your mood or pick a category, select your meal duration, and get instant AI-curated YouTube recommendations. The whole process takes under 10 seconds.",
          },
        },
        {
          "@type": "Question",
          name: "Is LetMeWatch free?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes, LetMeWatch is completely free. No account, no subscription, no ads.",
          },
        },
      ],
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${outfit.variable} ${plusJakartaSans.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrg) }}
        />
      </head>
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-CCQ8YRPKLQ"
        strategy="afterInteractive"
      />
      <Script id="gtag-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-CCQ8YRPKLQ');
        `}
      </Script>
      <body className="antialiased">{children}</body>
    </html>
  );
}
