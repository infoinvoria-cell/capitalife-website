"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";

import { StrategyAccessFlow } from "@/components/sections/home/StrategyAccessFlow";
import { strategyAccessByLocale } from "@/content/home/strategyAccess";
import { useLanguage } from "@/lib/i18n/language";

import raw from "./StrategyAccess.module.css";

function r(name: string): string {
  return (raw as Record<string, string>)[name] ?? "";
}

function StepCardIcon({ index }: { index: number }): ReactNode {
  const ic = r("stepCardIco");
  switch (index) {
    case 0:
      return (
        <svg className={ic} viewBox="0 0 24 24" fill="none" aria-hidden>
          <circle cx="12" cy="8" r="3.2" stroke="currentColor" strokeWidth="1.35" />
          <path
            d="M6 20.5v-.9c0-3 2.5-5.4 6-5.4s6 2.4 6 5.4v.9"
            stroke="currentColor"
            strokeWidth="1.35"
            strokeLinecap="round"
          />
        </svg>
      );
    case 1:
      return (
        <svg className={ic} viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M4.2 15.1A8.2 8.2 0 0 1 19.8 15"
            stroke="currentColor"
            strokeWidth="1.35"
            strokeLinecap="round"
          />
          <path d="M12 13.2l3.2-5.5" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" />
          <circle cx="12" cy="15.5" r="1.35" fill="currentColor" />
        </svg>
      );
    case 2:
      return (
        <svg className={ic} viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M12 3.2l8 4.6-8 4.6-8-4.6 8-4.6z"
            stroke="currentColor"
            strokeWidth="1.3"
            strokeLinejoin="round"
          />
          <path d="M4 11.4l8 4.6 8-4.6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
          <path d="M4 15.4l8 4.6 8-4.6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
        </svg>
      );
    default:
      return (
        <svg className={ic} viewBox="0 0 24 24" fill="none" aria-hidden>
          <path d="M8 16l8-8" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" />
          <circle cx="9" cy="9" r="1.8" stroke="currentColor" strokeWidth="1.35" />
          <circle cx="15" cy="15" r="1.8" stroke="currentColor" strokeWidth="1.35" />
          <path d="M4 20h5M15 4h5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity="0.45" />
        </svg>
      );
  }
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
              <span className={r("headlinePart")}>{copy.headlineLead}</span>
              <span className={r("headlineAccent")}>{copy.headlineAccent}</span>
              <span className={r("headlinePart")}>{copy.headlineTrail}</span>
            </h2>

            <p className={r("sub")}>{copy.sub}</p>

            <ol className={`${r("steps")}${visible ? ` ${r("stepsVisible")}` : ""}`}>
              {copy.steps.map((step, i) => (
                <li key={step.title} className={r("stepCard")}>
                  <div className={r("stepCardTop")}>
                    <span className={r("stepNumBadge")} aria-hidden>
                      {i + 1}
                    </span>
                    <span className={r("stepCardIcoWrap")}>
                      <StepCardIcon index={i} />
                    </span>
                    <div className={r("stepCardMain")}>
                      <span className={r("stepTitle")}>{step.title}</span>
                      <ul className={r("bullets")}>
                        {step.bullets.map((b, j) => (
                          <li key={`${step.title}-${j}`}>{b}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </li>
              ))}
            </ol>

            <ul className={r("benefitStrip")}>
              {copy.highlights.map((h) => (
                <li key={h} className={r("benefitItem")}>
                  <span className={r("benefitDot")} aria-hidden />
                  <span className={r("benefitTxt")}>{h}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
