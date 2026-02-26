export interface MoodConfig {
  label: string;
  emoji: string;
  moodValue: string;
  title: string;
  description: string;
  h1: string;
  subheading: string;
  whatToExpect: string[];
  faqs: { q: string; a: string }[];
}

function makeMood(
  label: string,
  emoji: string,
  moodValue: string,
  summary: string,
  bullets: string[]
): MoodConfig {
  return {
    label,
    emoji,
    moodValue,
    title: `${label} YouTube Recommendations | LetMeWatch`,
    description: `Get ${label.toLowerCase()} YouTube videos matched to your available time and context. No endless scrolling.`,
    h1: `${label} videos to watch now`,
    subheading: summary,
    whatToExpect: bullets,
    faqs: [
      {
        q: `How does ${label.toLowerCase()} mode work?`,
        a: `LetMeWatch uses your context, duration, and language to find the most relevant ${label.toLowerCase()} videos.`,
      },
      {
        q: "Can I change duration and language?",
        a: "Yes. You can relaunch recommendations with a different duration, language, or context at any time.",
      },
    ],
  };
}

export const MOOD_CONFIG: Record<string, MoodConfig> = {
  funny: makeMood(
    "Funny",
    "😂",
    "funny comedy entertainment humor sketches",
    "Fast comedy picks when you want something light and instantly watchable.",
    [
      "Stand-up extracts",
      "Sketch and parody formats",
      "Reaction and commentary",
      "Short entertaining compilations",
    ]
  ),
  chill: makeMood(
    "Chill",
    "😌",
    "relaxing calm lofi ambient chill vibe",
    "Low-pressure videos for calm sessions with no noise overload.",
    [
      "Lofi and ambient playlists",
      "Walking and travel calm edits",
      "Nature and slow visuals",
      "Soft educational formats",
    ]
  ),
  educational: makeMood(
    "Educational",
    "🧠",
    "educational documentary explainer knowledge science history",
    "Learn while watching with clean explainers adapted to your available time.",
    [
      "Compact explainers",
      "Science and tech topics",
      "History and culture",
      "Useful how-things-work videos",
    ]
  ),
  gaming: makeMood(
    "Gaming",
    "🎮",
    "gaming gameplay let's play commentary esports highlights",
    "Gameplay, highlights, and commentary that fit your exact session length.",
    [
      "Gameplay highlights",
      "Review and commentary",
      "Esport moments",
      "Funny gaming formats",
    ]
  ),
  cooking: makeMood(
    "Cooking",
    "🍜",
    "food cooking recipe street food mukbang culinary",
    "Food and cooking-focused content curated for short or long watch slots.",
    [
      "Street food edits",
      "Recipe breakdowns",
      "Chef techniques",
      "Food culture videos",
    ]
  ),
  cinema: makeMood(
    "Cinema",
    "🎬",
    "cinema movie review film analysis trailer breakdown",
    "Movie reviews and film analysis selected for direct watchability.",
    [
      "Review and critique",
      "Film analysis",
      "Trailer breakdown",
      "Cinema references",
    ]
  ),
  short: makeMood(
    "Short",
    "⚡",
    "short quick interesting viral trending under 10 minutes",
    "Quick picks when you only have a few minutes and still want quality.",
    [
      "5-10 minute formats",
      "Quick explainers",
      "Trending clips",
      "High signal low commitment",
    ]
  ),
  drama: makeMood(
    "Drama",
    "🎭",
    "drama reaction commentary story news controversy tea",
    "Story-driven commentary and reaction content with strong hooks.",
    [
      "Commentary videos",
      "Reaction formats",
      "Storytime narratives",
      "Current topic breakdowns",
    ]
  ),
  music: makeMood(
    "Music",
    "🎵",
    "music live concert performance artist session playlist",
    "Live sessions and performance picks adapted to the time you have.",
    [
      "Live performances",
      "Studio sessions",
      "Artist deep dives",
      "Music discovery",
    ]
  ),
  science: makeMood(
    "Science",
    "🔬",
    "science technology space physics innovation research explained",
    "Curiosity-driven science and tech content selected for your timing.",
    [
      "Space and astronomy",
      "Physics and chemistry",
      "Tech and innovation",
      "Research explainers",
    ]
  ),
};

export const MOOD_SLUGS = Object.keys(MOOD_CONFIG);
