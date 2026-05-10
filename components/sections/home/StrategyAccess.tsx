"use client";

import { useEffect, useRef, useState } from "react";

import { StrategyAccessFlow } from "@/components/sections/home/StrategyAccessFlow";
import { strategyAccessByLocale } from "@/content/home/strategyAccess";
import { useLanguage } from "@/lib/i18n/language";

import raw from "./StrategyAccess.module.css";

function r(name: string): string {
  return (raw as Record<string, string>)[name] ?? "";
}

export default function StrategyAccess() {
  const { lang } = useLanguage();
  const rootRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const copy = strategyAccessByLocale[lang];

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

            <ol className={`${r("steps")}${visible ? ` ${r("stepsVisible")}` : ""}`}>
              {copy.steps.map((step, i) => (
                <li key={step.title} className={r("stepCard")}>
                  <div className={r("stepCardHead")}>
                    <span className={r("stepNumBadge")} aria-hidden>
                      {i + 1}
                    </span>
                    <span className={r("stepTitle")}>{step.title}</span>
                  </div>
                  <ul className={r("bullets")}>
                    {step.bullets.map((b, j) => (
                      <li key={`${step.title}-${j}`}>{b}</li>
                    ))}
                  </ul>
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
