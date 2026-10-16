// Aufbau aller Rechtsseiten (Impressum, Datenschutz, Risikohinweis): gleiche Struktur, Texte je Sprache.
// Deutsch ist die massgebliche Fassung, Englisch eine Übersetzung.
export type LegalSection = {
  /** Sprungmarke, z. B. /privacy#warteliste */
  id?: string;
  heading: string;
  paragraphs?: readonly string[];
  items?: readonly string[];
};

export type LegalDoc = {
  title: string;
  updated: string;
  intro?: string;
  sections: readonly LegalSection[];
};

export type LegalCopy = Record<"en" | "de", LegalDoc>;
