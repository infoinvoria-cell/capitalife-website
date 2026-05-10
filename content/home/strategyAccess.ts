import type { Locale } from "@/lib/i18n/types";

export type StrategyAccessDiagramCopy = {
  investor: string;
  investment: string;
  investmentEx: string;
  risk: string;
  riskEx: string;
  cfs: string;
  cfsEx: string;
  investorShare: string;
  investorShareEx: string;
  capitalifeShare: string;
  capitalifeShareEx: string;
  figNote: string;
};

export type StrategyAccessStep = { title: string; bullets: string[] };

export type StrategyAccessContent = {
  label: string;
  headline: string;
  sub: string;
  steps: StrategyAccessStep[];
  highlights: string[];
  diagram: StrategyAccessDiagramCopy;
};

export const strategyAccessByLocale: Record<Locale, StrategyAccessContent> = {
  en: {
    label: "Strategy Access",
    headline: "How structured strategy access works",
    sub:
      "A clear structure makes access easier to understand. From the starting setup and risk factor to the illustrative allocation, each step is presented in a transparent and easy-to-follow way.",
    steps: [
      {
        title: "Starting point",
        bullets: [
          "The investor defines the starting setup",
          "The investment amount is shown as an example",
          "The visual is used for easier understanding",
        ],
      },
      {
        title: "Risk factor",
        bullets: [
          "The risk factor influences the model logic",
          "It helps illustrate the structural setup",
          "The display is purely illustrative",
        ],
      },
      {
        title: "Strategy layer",
        bullets: [
          "The Capitalife trading system represents the central strategy layer",
          "This is where the structured logic comes together",
          "The visual shows the conceptual process",
        ],
      },
      {
        title: "Illustrative allocation",
        bullets: [
          "The illustrative allocation is shown transparently",
          "Investor and Capitalife shares are displayed separately",
          "All values are for illustration only",
        ],
      },
    ],
    highlights: ["Clearly structured", "Presented transparently", "Easy to follow"],
    diagram: {
      investor: "Investor",
      investment: "Investment",
      investmentEx: "20,000",
      risk: "Risk factor",
      riskEx: "x 1.5",
      cfs: "Capitalife trading system",
      cfsEx: "Structured strategy logic",
      investorShare: "Investor share",
      investorShareEx: "80% example share",
      capitalifeShare: "Capitalife share",
      capitalifeShareEx: "20% example share",
      figNote:
        "Illustrative example for explaining structured access. Not a promise or forecast.",
    },
  },
  de: {
    label: "Strategy Access",
    headline: "So funktioniert strukturierter Strategy Access",
    sub:
      "Ein klarer Aufbau macht den Zugang leichter verständlich. Von der Ausgangsbasis über den Risikofaktor bis zur beispielhaften Verteilung wird jeder Schritt transparent und nachvollziehbar dargestellt.",
    steps: [
      {
        title: "Ausgangspunkt",
        bullets: [
          "Der Investor definiert die Ausgangsbasis",
          "Die Investitionssumme wird beispielhaft dargestellt",
          "Die Visualisierung dient der verständlichen Einordnung",
        ],
      },
      {
        title: "Risikofaktor",
        bullets: [
          "Der Risikofaktor beeinflusst die Modelllogik",
          "Er dient der strukturellen Veranschaulichung",
          "Die Darstellung ist rein illustrativ",
        ],
      },
      {
        title: "Strategieebene",
        bullets: [
          "Das Capitalife Handelssystem bildet die zentrale Strategieebene",
          "Hier läuft die strukturierte Logik zusammen",
          "Die Darstellung zeigt den konzeptionellen Ablauf",
        ],
      },
      {
        title: "Beispielhafte Verteilung",
        bullets: [
          "Die beispielhafte Verteilung wird transparent dargestellt",
          "Anleger- und Capitalife-Anteil werden separat gezeigt",
          "Alle Werte dienen ausschließlich der Illustration",
        ],
      },
    ],
    highlights: ["Klar strukturiert", "Transparent dargestellt", "Leicht nachvollziehbar"],
    diagram: {
      investor: "Investor",
      investment: "Investment",
      investmentEx: "20.000",
      risk: "Risikofaktor",
      riskEx: "x 1,5",
      cfs: "Capitalife Handelssystem",
      cfsEx: "Strukturierte Strategie-Logik",
      investorShare: "Anlegeranteil",
      investorShareEx: "80 % Beispielanteil",
      capitalifeShare: "Capitalife Anteil",
      capitalifeShareEx: "20 % Beispielanteil",
      figNote:
        "Beispielhafte Darstellung zur Veranschaulichung des strukturierten Zugangs. Keine Zusage oder Prognose.",
    },
  },
};
