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
    text: "Two people, one conviction: clarity and patience beat noise. We build Capitalife with exactly that, personally and every day.",
    people: [
      {
        name: "Jeroen Göhlert",
        role: "CEO & Founder",
        image: "/team/portrait-2.png",
      },
      {
        name: "Jan Luca Manfré",
        role: "COO & Founder",
        image: "/team/portrait-1.png",
      },
    ],
  },
  de: {
    title: "Die Menschen hinter Capitalife",
    text: "Zwei Menschen, eine Überzeugung: Klarheit und Geduld schlagen Hektik. Genau so bauen wir Capitalife, persönlich und jeden Tag.",
    people: [
      {
        name: "Jeroen Göhlert",
        role: "CEO & Gründer",
        image: "/team/portrait-2.png",
      },
      {
        name: "Jan Luca Manfré",
        role: "COO & Gründer",
        image: "/team/portrait-1.png",
      },
    ],
  },
};
