export interface LangConfig {
  code: string;
  label: string;
  flag: string;
  title: string;
  description: string;
  h1: string;
  subheading: string;
  keyword: string;
  cta: string;
}

export const LANG_CONFIG: Record<string, LangConfig> = {
  fr: {
    code: "fr",
    label: "Français",
    flag: "🇫🇷",
    title: "Quoi Regarder en Mangeant sur YouTube | LetMeEat",
    description:
      "Trouve la vidéo YouTube parfaite pour ton repas en 10 secondes. Dis-nous ton humeur et la durée de ton repas — l'IA s'occupe du reste.",
    h1: "Quoi regarder en mangeant sur YouTube ?",
    subheading:
      "Stop scroller pendant 10 minutes pour trouver quoi regarder. LetMeEat pose 3 questions et te trouve la vidéo parfaite en quelques secondes.",
    keyword: "quoi regarder en mangeant youtube",
    cta: "Trouve-moi quelque chose à regarder →",
  },
  es: {
    code: "es",
    label: "Español",
    flag: "🇪🇸",
    title: "Qué Ver en YouTube Mientras Como | LetMeEat",
    description:
      "Encuentra el video de YouTube perfecto para tu comida en 10 segundos. Dinos tu estado de ánimo y cuánto tiempo tienes — la IA se encarga del resto.",
    h1: "¿Qué ver en YouTube mientras como?",
    subheading:
      "Deja de buscar durante 10 minutos qué ver. LetMeEat hace 3 preguntas y encuentra el video perfecto para tu comida en segundos.",
    keyword: "que ver en youtube mientras como",
    cta: "Encuéntrame algo que ver →",
  },
  pt: {
    code: "pt",
    label: "Português",
    flag: "🇧🇷",
    title: "O Que Assistir Enquanto Como no YouTube | LetMeEat",
    description:
      "Encontre o vídeo perfeito do YouTube para sua refeição em 10 segundos. Diga seu humor e quanto tempo você tem — a IA faz o resto.",
    h1: "O que assistir no YouTube enquanto como?",
    subheading:
      "Para de rolar por 10 minutos tentando achar algo pra ver. LetMeEat faz 3 perguntas e encontra o vídeo perfeito para sua refeição em segundos.",
    keyword: "o que assistir enquanto como youtube",
    cta: "Encontre algo pra mim →",
  },
};

export const LANG_CODES = Object.keys(LANG_CONFIG);
