// Gründer-Box unter den drei Karten (Sektion 2). PLATZHALTER: Namen, Rollen und Text bis Freigabe durch Jeroen.
// Bilder: public/team/portrait-1.png (links) und portrait-2.png (rechts) (freigestellt, transparenter Hintergrund, Hochformat).
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
      { name: "Name", role: "Co-founder", image: "/team/portrait-1.png" },
      { name: "Name", role: "Co-founder", image: "/team/portrait-2.png" },
    ],
  },
  de: {
    title: "Die Menschen hinter Capitalife",
    text: "Gegründet in Deutschland von zwei Tradern. Wir bauen mit Daten, klaren Regeln und Disziplin.",
    people: [
      { name: "Name", role: "Mitgründer", image: "/team/portrait-1.png" },
      { name: "Name", role: "Mitgründer", image: "/team/portrait-2.png" },
    ],
  },
};
