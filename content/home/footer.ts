// Fusszeile. Impressum, Datenschutz und Risikohinweis sind Pflicht vor dem Livegang.
// Die drei Seiten existieren noch nicht (Inhalte von Jeroen / Anwalt). Texte sind Platzhalter bis Freigabe.
export type FooterCopy = {
  links: readonly { label: string; href: string }[];
  notice: string;
  rights: string;
};

export const footerCopy: Record<"en" | "de", FooterCopy> = {
  en: {
    links: [
      { label: "Imprint", href: "/imprint" },
      { label: "Privacy", href: "/privacy" },
      { label: "Risk notice", href: "/risk" },
    ],
    notice:
      "Capitalife currently offers no investment services, no investment advice and no financial products. Trading financial instruments involves substantial risk of loss.",
    rights: "All rights reserved.",
  },
  de: {
    links: [
      { label: "Impressum", href: "/imprint" },
      { label: "Datenschutz", href: "/privacy" },
      { label: "Risikohinweis", href: "/risk" },
    ],
    notice:
      "Capitalife bietet derzeit keine Wertpapierdienstleistungen, keine Anlageberatung und keine Finanzprodukte an. Der Handel mit Finanzinstrumenten ist mit erheblichen Verlustrisiken verbunden.",
    rights: "Alle Rechte vorbehalten.",
  },
};

export const contactEmail = "info@capitalife.co";
