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
    label: "Francais",
    flag: "🇫🇷",
    title: "Quoi regarder sur YouTube maintenant | LetMeWatch",
    description:
      "Trouve rapidement une video YouTube qui colle a ton timing et a ton contexte. 3 etapes, resultat direct.",
    h1: "Quoi regarder sur YouTube maintenant ?",
    subheading:
      "Arrete de chercher pendant 10 minutes. Donne ton contexte, ton temps et ta langue, on lance les recos.",
    keyword: "quoi regarder sur youtube",
    cta: "Lancer mes recommandations →",
  },
  es: {
    code: "es",
    label: "Espanol",
    flag: "🇪🇸",
    title: "Que ver en YouTube ahora | LetMeWatch",
    description:
      "Encuentra rapido un video de YouTube que encaje con tu tiempo y tu contexto. 3 pasos y ya esta.",
    h1: "Que ver en YouTube ahora?",
    subheading:
      "Deja de perder tiempo buscando. Define contexto, duracion e idioma y lanzamos recomendaciones utiles.",
    keyword: "que ver en youtube ahora",
    cta: "Dame recomendaciones →",
  },
  pt: {
    code: "pt",
    label: "Portugues",
    flag: "🇧🇷",
    title: "O que assistir no YouTube agora | LetMeWatch",
    description:
      "Ache rapido um video do YouTube que combine com seu tempo e contexto. 3 passos e pronto.",
    h1: "O que assistir no YouTube agora?",
    subheading:
      "Para de rolar sem fim. Define contexto, tempo e idioma e recebe recomendacoes diretas.",
    keyword: "o que assistir no youtube agora",
    cta: "Receber recomendacoes →",
  },
};

export const LANG_CODES = Object.keys(LANG_CONFIG);
