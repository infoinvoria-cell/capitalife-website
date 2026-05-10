"use client";

import { useEffect, useRef, useState } from "react";

import { useLanguage, type Lang } from "@/lib/i18n/language";

import {
  StrategyAccessFlow,
  type StrategyAccessDiagramCopy,
} from "@/components/sections/home/StrategyAccessFlow";

import raw from "./StrategyAccess.module.css";

function r(name: string): string {
  return (raw as Record<string, string>)[name] ?? "";
}

type StepBlock = { title: string; bullets: string[] };

type StrategyAccessCopy = {
  label: string;
  headline: string;
  sub: string;
  steps: StepBlock[];
  highlights: string[];
  diagram: StrategyAccessDiagramCopy;
};

const COPY: Record<Lang, StrategyAccessCopy> = {
  en: {
    label: "Strategy Access",
    headline: "How structured strategy access works",
    sub:
      "A clear process makes strategy access easier to understand. From the starting setup and risk factor to the illustrative distribution, each step is presented in a transparent and easy-to-follow way.",
    steps: [
      {
        title: "Starting point",
        bullets: [
          "The investor defines the initial setup",
          "Illustrated with an example investment amount",
          "The visual is for demonstration purposes only",
        ],
      },
      {
        title: "Risk factor",
        bullets: [
          "The risk factor influences the model example",
          "It helps explain the structural logic",
          "It is not a statement about actual outcomes",
        ],
      },
      {
        title: "Strategy layer",
        bullets: [
          "The Capitalife trading system represents the central strategy layer",
          "This is where the structure comes together",
          "The visual only shows an example process",
        ],
      },
      {
        title: "Illustrative distribution",
        bullets: [
          "The resulting distribution is shown transparently",
          "Investor and Capitalife are displayed separately",
          "All values are purely illustrative",
        ],
      },
    ],
    highlights: ["Clear structure", "Transparent model logic", "Easy to understand"],
    diagram: {
      investor: "Investor",
      investment: "Investment",
      investmentEx: "20,000",
      risk: "Risk factor",
      riskEx: "×1.5",
      cfs: "Capitalife trading system",
      cfsEx: "30% p.a. × 1.5 × 20k",
      outInv: "Investor",
      outInvEx: "80% profit share",
      outCap: "Capitalife",
      outCapEx: "20% profit share",
      figNote: "Illustrative example — not a commitment or forecast.",
    },
  },
  de: {
    label: "Strategy Access",
    headline: "So funktioniert der strukturierte Zugang",
    sub:
      "Ein klarer Ablauf hilft dabei, den Zugang zur Strategie einfach zu verstehen. Von der Ausgangsbasis über den Risikofaktor bis zur beispielhaften Aufteilung bleibt jeder Schritt transparent nachvollziehbar.",
    steps: [
      {
        title: "Ausgangsbasis",
        bullets: [
          "Investor definiert die Ausgangsbasis",
          "Beispielhaft mit einem Investitionsbetrag",
          "Die Darstellung dient nur zur Veranschaulichung",
        ],
      },
      {
        title: "Risikofaktor",
        bullets: [
          "Der Risikofaktor beeinflusst die Modellrechnung",
          "Er dient als vereinfachtes Beispiel für die Struktur",
          "Keine Aussage über reale Ergebnisse",
        ],
      },
      {
        title: "Strategieebene",
        bullets: [
          "Das Capitalife Handelssystem bildet die zentrale Strategieebene",
          "Hier wird die Struktur des Modells zusammengeführt",
          "Die Visualisierung zeigt nur einen Beispielablauf",
        ],
      },
      {
        title: "Beispielhafte Aufteilung",
        bullets: [
          "Die Ergebnisverteilung wird transparent dargestellt",
          "Investor und Capitalife werden separat ausgewiesen",
          "Die Werte dienen ausschließlich als illustrative Darstellung",
        ],
      },
    ],
    highlights: ["Klare Struktur", "Transparente Modelllogik", "Einfach nachvollziehbare Darstellung"],
    diagram: {
      investor: "Investor",
      investment: "Investment",
      investmentEx: "20.000",
      risk: "Risikofaktor",
      riskEx: "×1,5",
      cfs: "Capitalife Handelssystem",
      cfsEx: "30 % p.a. × 1,5 × 20k",
      outInv: "Investor",
      outInvEx: "80 % Gewinnaufteilung",
      outCap: "Capitalife",
      outCapEx: "20 % Gewinnaufteilung",
      figNote: "Beispielhafte Darstellung — keine Zusage oder Prognose.",
    },
  },
};

export default function StrategyAccess() {
  const { lang } = useLanguage();
  const rootRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const copy = COPY[lang];

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.14, rootMargin: "0px 0px -6% 0px" },
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section ref={rootRef} className={r("section")} id="strategy-access" aria-labelledby="strategy-access-h">
      <div className={r("bg")} aria-hidden />

      <div className={r("inner")}>
        <div className={r("grid")}>
          <div className={r("colDiagram")}>
            <StrategyAccessFlow diagram={copy.diagram} visible={visible} />
          </div>

          <div className={r("colCopy")}>
            <div className={r("pill")}>
              <span className={r("pillDot")} />
              <span className={r("pillText")}>{copy.label}</span>
            </div>

            <h2 id="strategy-access-h" className={r("headline")}>
              {copy.headline}
            </h2>

            <p className={r("sub")}>{copy.sub}</p>

            <ol className={r("steps")}>
              {copy.steps.map((step, i) => (
                <li key={step.title} className={r("step")}>
                  <span className={r("stepNum")}>{String(i + 1)}</span>
                  <div className={r("stepBody")}>
                    <span className={r("stepTitle")}>{step.title}</span>
                    <ul className={r("bullets")}>
                      {step.bullets.map((b, j) => (
                        <li key={`${step.title}-${j}`}>{b}</li>
                      ))}
                    </ul>
                  </div>
                </li>
              ))}
            </ol>

            <ul className={r("highlights")}>
              {copy.highlights.map((h) => (
                <li key={h} className={r("hiItem")}>
                  <span className={r("hiMark")} aria-hidden>
                    <svg viewBox="0 0 16 16" fill="none">
                      <path
                        d="M3.5 8.2l3 3 6.2-6.2"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  {h}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
