import type { Metadata } from "next";
import { Fraunces, Manrope } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://letmeeat.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Find the Perfect YouTube Video to Watch While Eating | LetMeEat",
    template: "%s | LetMeEat",
  },
  description:
    "Stop scrolling. Tell us your mood and how long you're eating - we find the perfect YouTube video in seconds. AI-powered, no account needed.",
  keywords: [
    "what to watch while eating",
    "videos to watch while eating",
    "youtube videos while eating",
    "what to watch during lunch",
    "youtube while eating alone",
    "quoi regarder en mangeant",
    "que ver en youtube mientras como",
  ],
  authors: [{ name: "LetMeEat" }],
  creator: "LetMeEat",
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "LetMeEat",
    title: "Find the Perfect YouTube Video to Watch While Eating",
    description:
      "Stop scrolling. Tell us your mood and how long you're eating - we find the perfect YouTube video in seconds.",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "LetMeEat - Find the perfect YouTube video for your meal",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Find the Perfect YouTube Video to Watch While Eating",
    description:
      "Stop scrolling. AI picks the perfect YouTube video for your meal in 10 seconds.",
    images: ["/opengraph-image"],
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
      en: SITE_URL,
      fr: `${SITE_URL}/lang/fr`,
      es: `${SITE_URL}/lang/es`,
      pt: `${SITE_URL}/lang/pt`,
    },
  },
};

const schemaOrg = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "@id": `${SITE_URL}/#webapp`,
      name: "LetMeEat",
      url: SITE_URL,
      description:
        "AI-powered YouTube video recommendations for mealtime. Tell us your mood and meal duration - get the perfect video in seconds.",
      applicationCategory: "EntertainmentApplication",
      operatingSystem: "Any",
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
            text: "LetMeEat uses AI to find the perfect YouTube video for your meal. Just tell us your mood, how long you're eating, and your language preference - you get 3 perfectly matched videos in seconds.",
          },
        },
        {
          "@type": "Question",
          name: "How does LetMeEat work?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Answer 3 quick questions (meal duration, mood, language). Our AI generates optimized YouTube search queries and returns the best videos matched to your context. No account needed, no scrolling.",
          },
        },
        {
          "@type": "Question",
          name: "Is LetMeEat free?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes, LetMeEat is completely free. No account, no subscription, no ads.",
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
    <html lang="en" className={`${fraunces.variable} ${manrope.variable}`}>
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
