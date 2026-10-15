// Überschrift-Varianten (Stile in components/sections/home/Hero/HeroTitle.module.css).
export const TITLE_STYLES = ["1", "2", "3", "4", "5", "6", "7"] as const;
export type TitleStyle = (typeof TITLE_STYLES)[number];

export const TITLE_NAMES: Record<TitleStyle, string> = {
  "1": "Getrennt: weiss / helles Gold",
  "2": "Verlauf quer wie Referenz",
  "3": "Verlauf senkrecht: weiss nach Gold",
  "4": "Weiss / weicher Goldverlauf",
  "5": "Champagner einfarbig",
  "6": "Dünn weiss / kräftig gold",
  "7": "Glanz weiss / gold",
};
