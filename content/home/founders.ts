// Gründer-Box unter den drei Karten (Sektion 2). Namen und Rollen von Jeroen. PLATZHALTER: Überschrift und Satz bis Freigabe.
// Bilder: public/team/portrait-2.png (links) und portrait-2.png (rechts) (freigestellt, transparenter Hintergrund, Hochformat).
export type FoundersCopy = {
  title: string;
  text: string;
  people: readonly { name: string; role: string; image: string }[];
};

export const foundersCopy: Record<"en" | "de", FoundersCopy> = {
  en: {
    title: "The people behind Capitalife",
    text: "Founded in Germany by two traders. We build with data, clear rules and discipline.",
    people: [
      { name: "Jeroen Göhlert", role: "CEO & Founder", image: "/team/portrait-2.png" },
      { name: "Jan Luca Manfré", role: "COO & Founder", image: "/team/portrait-1.png" },
    ],
  },
  de: {
    title: "Die Menschen hinter Capitalife",
    text: "Gegründet in Deutschland von zwei Tradern. Wir bauen mit Daten, klaren Regeln und Disziplin.",
    people: [
      { name: "Jeroen Göhlert", role: "CEO & Gründer", image: "/team/portrait-2.png" },
      { name: "Jan Luca Manfré", role: "COO & Gründer", image: "/team/portrait-1.png" },
    ],
  },
};
