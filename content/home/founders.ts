// Gründer-Box unter den drei Karten (Sektion 2). Namen, Rollen und Text (Variante 3) von Jeroen freigegeben.
// Bilder: public/team/portrait-2.png (links) und portrait-2.png (rechts) (freigestellt, transparenter Hintergrund, Hochformat).
export type FoundersCopy = {
  title: string;
  text: string;
  people: readonly { name: string; role: string; image: string }[];
};

export const foundersCopy: Record<"en" | "de", FoundersCopy> = {
  en: {
    title: "The people behind Capitalife",
    text: "Think long term, act clearly, share openly: what is usually reserved for institutions should be accessible to everyone. That is what we stand for.",
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
    text: "Langfristig denken, klar handeln, offen teilen: Was sonst Institutionen vorbehalten ist, soll für alle zugänglich sein. Dafür stehen wir.",
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
