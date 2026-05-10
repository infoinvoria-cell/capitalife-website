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
  headlineLead: string;
  headlineAccent: string;
  headlineTrail: string;
  sub: string;
  steps: StrategyAccessStep[];
  highlights: string[];
  diagram: StrategyAccessDiagramCopy;
};

export const strategyAccessByLocale: Record<Locale, StrategyAccessContent> = {
  en: {
    label: "Strategy Access",
    headlineLead: "How structured ",
    headlineAccent: "strategy access",
    headlineTrail: " works",
    sub:
      "A clear structure makes the process easier to understand. Each step is shown transparently, from the starting setup to the illustrative allocation.",
    steps: [
      {
        title: "Starting point",
        bullets: [
          "Define the initial setup",
          "Example investment amount",
          "Purely illustrative",
        ],
      },
      {
        title: "Risk factor",
        bullets: [
          "Influences the model logic",
          "Explains the structure",
          "Not a forecast",
        ],
      },
      {
        title: "Strategy layer",
        bullets: [
          "Central Capitalife system",
          "Structured strategy logic",
          "Conceptual process",
        ],
      },
      {
        title: "Illustrative allocation",
        bullets: [
          "Transparent example split",
          "Investor and Capitalife shown separately",
          "No commitment or forecast",
        ],
      },
    ],
    highlights: ["Clear structure", "Transparent model logic", "Easy to follow"],
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
    headlineLead: "So funktioniert strukturierter ",
    headlineAccent: "Strategy Access",
    headlineTrail: "",
    sub:
      "Eine klare Struktur macht den Ablauf leichter verständlich. Jeder Schritt wird transparent dargestellt, von der Ausgangsbasis bis zur beispielhaften Aufteilung.",
    steps: [
      {
        title: "Ausgangspunkt",
        bullets: [
          "Ausgangsbasis definieren",
          "Beispielhafte Investitionssumme",
          "Rein illustrative Darstellung",
        ],
      },
      {
        title: "Risikofaktor",
        bullets: [
          "Beeinflusst die Modelllogik",
          "Erklärt die Struktur",
          "Keine Prognose",
        ],
      },
      {
        title: "Strategieebene",
        bullets: [
          "Zentrales Capitalife System",
          "Strukturierte Strategie-Logik",
          "Konzeptioneller Ablauf",
        ],
      },
      {
        title: "Beispielhafte Aufteilung",
        bullets: [
          "Transparente Beispielaufteilung",
          "Anleger und Capitalife separat dargestellt",
          "Keine Zusage oder Prognose",
        ],
      },
    ],
    highlights: ["Klare Struktur", "Transparente Modelllogik", "Leicht nachvollziehbar"],
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
        "Beispielhafte Darstellung zur Erklärung des strukturierten Zugangs. Keine Zusage oder Prognose.",
    },
  },
};
