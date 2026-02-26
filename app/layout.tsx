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

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://letmewatch.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Find the Right YouTube Video Fast | LetMeWatch",
    template: "%s | LetMeWatch",
  },
  description:
    "Stop scrolling. Tell us what you want to watch and how much time you have - we find the right YouTube video in seconds.",
  keywords: [
    "what to watch on youtube",
    "youtube recommendations",
    "what to watch now",
    "video recommendation app",
    "find a youtube video quickly",
    "quoi regarder sur youtube",
    "que ver en youtube ahora",
  ],
  authors: [{ name: "LetMeWatch" }],
  creator: "LetMeWatch",
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "LetMeWatch",
    title: "Find the Right YouTube Video Fast",
    description:
      "Stop scrolling. Tell us what you want to watch and how much time you have - we find the right YouTube video in seconds.",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "LetMeWatch - Smart video picks for your watch session",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Find the Right YouTube Video Fast",
    description:
      "Stop scrolling. AI picks the right YouTube video for your current session in seconds.",
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
      name: "LetMeWatch",
      url: SITE_URL,
      description:
        "AI-powered YouTube recommendations. Set your context, available time, and language to get instantly watchable videos.",
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
          name: "What should I watch on YouTube right now?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "LetMeWatch uses AI to find the right YouTube video for your current context. Just set your available time, what you want to watch, and your language preference.",
          },
        },
        {
          "@type": "Question",
          name: "How does LetMeWatch work?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Answer 3 quick questions (duration, context, language). Our AI generates optimized YouTube search queries and returns the best videos matched to your input.",
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
