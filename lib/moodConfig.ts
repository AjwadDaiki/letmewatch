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

export const MOOD_CONFIG: Record<string, MoodConfig> = {
  funny: {
    label: "Funny",
    emoji: "😂",
    moodValue: "funny comedy entertainment humor sketches",
    title: "Funny YouTube Videos to Watch While Eating",
    description:
      "Find the best funny YouTube videos perfectly matched to your meal duration. Comedy, sketches, and entertainment — no scrolling needed.",
    h1: "Funny YouTube videos to watch while eating",
    subheading:
      "Stop wasting your lunch searching for something to watch. Get matched to comedy videos that fit your exact meal time — instantly.",
    whatToExpect: [
      "Stand-up comedy clips",
      "Sketch comedy & parodies",
      "Funny commentary & reaction videos",
      "Compilation & fail videos",
    ],
    faqs: [
      {
        q: "What are the best funny YouTube videos to watch while eating?",
        a: "LetMeEat finds comedy and entertainment videos matched to your meal duration. Just pick your mood and time — the AI picks the best funny content for you.",
      },
      {
        q: "How long are the funny videos?",
        a: "Videos are filtered to match your meal duration — 15 minutes for a quick lunch, 30 minutes for a full meal, or 1 hour+ for a relaxed dinner.",
      },
    ],
  },

  chill: {
    label: "Chill",
    emoji: "😌",
    moodValue: "relaxing calm lofi ambient chill vibe",
    title: "Chill Videos to Watch While Eating",
    description:
      "Relaxing, low-key YouTube videos perfect for eating. Lofi, ambient, and calming content matched to your meal duration.",
    h1: "Chill videos to watch while eating",
    subheading:
      "Eat in peace. No hyper energy, no overload — just calm, pleasant videos that don't demand your full attention.",
    whatToExpect: [
      "Lofi music & study streams",
      "Nature & relaxation videos",
      "Slow travel and city walks",
      "Calm documentary content",
    ],
    faqs: [
      {
        q: "What chill videos are good to watch while eating?",
        a: "LetMeEat finds relaxing YouTube content — lofi streams, city walks, ambient music, and calm documentaries — all filtered to your meal duration.",
      },
      {
        q: "Can I find chill content in French or Spanish?",
        a: "Yes. Select your language preference and LetMeEat finds chill content in French, English, Spanish, or any language.",
      },
    ],
  },

  educational: {
    label: "Educational",
    emoji: "🧠",
    moodValue: "educational documentary explainer knowledge science history",
    title: "Educational YouTube Videos to Watch While Eating",
    description:
      "Learn something new during your meal. AI-matched educational YouTube videos — documentaries, explainers, history — filtered to your exact meal duration.",
    h1: "Educational YouTube videos to watch while eating",
    subheading:
      "Make your lunch break count. Get matched to educational videos that fit perfectly into your meal time — no 2-hour documentaries when you have 20 minutes.",
    whatToExpect: [
      "Short documentaries",
      "Science & technology explainers",
      "History & culture deep-dives",
      "How-it-works videos",
    ],
    faqs: [
      {
        q: "What educational videos can I watch while eating?",
        a: "LetMeEat matches you with documentaries, explainers, and knowledge videos based on your available time. Perfect for learning something new during lunch.",
      },
      {
        q: "Are there educational videos in French?",
        a: "Yes. Select French as your language and get educational content in French — science, history, culture, and more.",
      },
    ],
  },

  gaming: {
    label: "Gaming",
    emoji: "🎮",
    moodValue: "gaming gameplay let's play commentary esports highlights",
    title: "Gaming Videos to Watch While Eating",
    description:
      "Best gaming YouTube videos to watch during your meal. Let's plays, highlights, commentary — matched to your meal duration. No endless scrolling.",
    h1: "Gaming videos to watch while eating",
    subheading:
      "Game content perfectly timed for your meal — whether it's a 15-minute snack break or a 1-hour gaming session over dinner.",
    whatToExpect: [
      "Let's Play highlights",
      "Gaming commentary & reviews",
      "Esports highlights & analysis",
      "Funny gaming moments",
    ],
    faqs: [
      {
        q: "What gaming videos should I watch while eating?",
        a: "LetMeEat finds gaming content — let's plays, highlights, reviews — matched to your exact meal duration so you never have to pause mid-game.",
      },
      {
        q: "Can I find gaming videos in a specific language?",
        a: "Yes, select English, French, Spanish, or any language and get gaming content from creators in that language.",
      },
    ],
  },

  cooking: {
    label: "Cooking",
    emoji: "🍜",
    moodValue: "food cooking recipe street food mukbang culinary",
    title: "Cooking Videos to Watch While Eating",
    description:
      "Watch food and cooking YouTube videos while you eat. Street food tours, recipes, mukbang — all matched to your meal duration.",
    h1: "Cooking and food videos to watch while eating",
    subheading:
      "Double the food experience. Watch amazing cooking content while enjoying your own meal — perfectly timed to your lunch or dinner.",
    whatToExpect: [
      "Street food tours",
      "Recipe & cooking process videos",
      "Food travel content",
      "Chef techniques & reviews",
    ],
    faqs: [
      {
        q: "What food videos are good to watch while eating?",
        a: "LetMeEat finds cooking, street food, and culinary content matched to your meal duration. Great for food lovers who want visual inspiration while eating.",
      },
    ],
  },

  cinema: {
    label: "Cinema",
    emoji: "🎬",
    moodValue: "cinema movie review film analysis trailer breakdown",
    title: "Cinema & Movie Videos to Watch While Eating",
    description:
      "Movie reviews, film analysis, and cinema content perfectly matched to your meal time. No need to scroll through YouTube for hours.",
    h1: "Cinema and movie videos to watch while eating",
    subheading:
      "Satisfy your film nerd side during lunch. Movie reviews, breakdowns, and cinema analysis matched to your exact meal duration.",
    whatToExpect: [
      "Movie reviews & critiques",
      "Film analysis & breakdowns",
      "Trailer reactions",
      "Cinema history & culture",
    ],
    faqs: [
      {
        q: "What movie-related videos can I watch during my lunch break?",
        a: "LetMeEat finds movie reviews, film analysis, and cinema content matched to your meal time — perfect for cinephiles who want to make the most of their break.",
      },
    ],
  },

  short: {
    label: "Short",
    emoji: "⚡",
    moodValue: "short quick interesting viral trending under 10 minutes",
    title: "Short YouTube Videos to Watch While Eating",
    description:
      "Best short YouTube videos under 15 minutes to watch during a quick meal or lunch break. No long commitments — just the right length.",
    h1: "Short YouTube videos to watch while eating",
    subheading:
      "Perfect for a 15-minute lunch break. Quick, engaging videos that end exactly when your meal does.",
    whatToExpect: [
      "5-10 minute viral videos",
      "Quick explainers & how-tos",
      "Short comedy & entertainment",
      "Trending clips of the week",
    ],
    faqs: [
      {
        q: "What are good short YouTube videos to watch during lunch?",
        a: "LetMeEat filters YouTube to find videos that match your 15-minute break exactly — no starting a 40-minute video you can't finish.",
      },
    ],
  },

  drama: {
    label: "Drama",
    emoji: "🎭",
    moodValue: "drama reaction commentary story news controversy tea",
    title: "Drama & Reaction Videos to Watch While Eating",
    description:
      "Drama, reactions, and juicy commentary YouTube videos perfect for eating alone. Matched to your meal duration — no cliffhangers.",
    h1: "Drama and reaction videos to watch while eating",
    subheading:
      "Eating alone? Drama content is the perfect companion. Get matched to reaction and commentary videos that fit your meal time.",
    whatToExpect: [
      "Drama commentary & tea videos",
      "Reaction content",
      "Story time & drama breakdowns",
      "Interesting news commentary",
    ],
    faqs: [
      {
        q: "What drama YouTube videos are good to watch while eating?",
        a: "LetMeEat finds commentary, drama, and reaction content matched to your meal duration — perfect for eating alone with something engaging.",
      },
    ],
  },

  music: {
    label: "Music",
    emoji: "🎵",
    moodValue: "music live concert performance artist session playlist",
    title: "Music Videos to Watch While Eating",
    description:
      "Live performances, music sessions, and concert videos perfectly matched to your meal duration. The best meal background.",
    h1: "Music videos to watch while eating",
    subheading:
      "Level up your meal with live music. AI finds concerts, sessions, and performances matched to exactly how long you're eating.",
    whatToExpect: [
      "Live concert performances",
      "Studio sessions & acoustic sets",
      "Music discovery playlists",
      "Artist documentaries",
    ],
    faqs: [
      {
        q: "What music should I watch while eating?",
        a: "LetMeEat finds live performances, music sessions, and concert content matched to your meal duration — better than a playlist.",
      },
    ],
  },

  science: {
    label: "Science",
    emoji: "🔬",
    moodValue: "science technology space physics innovation research explained",
    title: "Science Videos to Watch While Eating",
    description:
      "Mind-blowing science and technology YouTube videos matched to your meal. Space, physics, innovation — learn while you eat.",
    h1: "Science and technology videos to watch while eating",
    subheading:
      "Feed your brain while you feed your body. AI-matched science content from the best creators — timed to your meal perfectly.",
    whatToExpect: [
      "Space & astronomy content",
      "Physics & chemistry explainers",
      "Technology & innovation",
      "Biology & nature science",
    ],
    faqs: [
      {
        q: "What science videos are good to watch while eating?",
        a: "LetMeEat finds science content — space, physics, tech, biology — matched to your meal duration. Perfect for curious minds.",
      },
    ],
  },
};

export const MOOD_SLUGS = Object.keys(MOOD_CONFIG);
