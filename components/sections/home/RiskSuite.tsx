"use client";

import type { ReactNode } from "react";

import { useLanguage, type Lang } from "@/lib/i18n/language";
import raw from "./RiskSuite.module.css";

function r(name: string): string {
  return (raw as Record<string, string>)[name] ?? "";
}

// ── Performance data ──────────────────────────────────────────────────────────
// Real Capitalife cumulative returns % (Apr 2024 → Apr 2026).
// Append a value and update kpis copy below to refresh.
const PERF_CUM = [
  2.13, 17.08, 19.99, 22.13, 22.05, 17.78, 28.31, 21.96, 28.96,
  46.45, 68.07, 69.87, 60.05, 61.40, 62.29, 63.92, 62.79, 62.42,
  61.70, 61.16, 62.24, 62.51, 68.61, 71.99, 73.70,
];
const PERF_NORM = PERF_CUM.map((v) => v - PERF_CUM[0]!);

// ── Chart geometry ────────────────────────────────────────────────────────────
const CW = 560, CH = 148, PL = 36, PR = 6, PT = 6, PB = 22;
const CHART_MAX = 80;
const uW = CW - PL - PR;
const uH = CH - PT - PB;

function buildChart() {
  const n = PERF_NORM.length;
  const pts = PERF_NORM.map((v, i) => ({
    x: PL + (i / (n - 1)) * uW,
    y: PT + uH - (v / CHART_MAX) * uH,
  }));
  const p0 = pts[0]!;
  let line = `M${p0.x.toFixed(1)},${p0.y.toFixed(1)}`;
  for (let i = 1; i < pts.length; i++) {
    const a = pts[i - 1]!;
    const b = pts[i]!;
    const cx = (a.x + b.x) / 2;
    line += ` C${cx.toFixed(1)},${a.y.toFixed(1)} ${cx.toFixed(1)},${b.y.toFixed(1)} ${b.x.toFixed(1)},${b.y.toFixed(1)}`;
  }
  const last = pts[n - 1]!;
  const area = `${line} L${last.x.toFixed(1)},${PT + uH} L${PL},${PT + uH} Z`;
  return { line, area, lastX: last.x, lastY: last.y };
}

const { line: CHART_LINE, area: CHART_AREA, lastX: CHART_LX, lastY: CHART_LY } = buildChart();

const Y_TICKS = [0, 20, 40, 60, 80];
const yPos = (v: number) => PT + uH - (v / CHART_MAX) * uH;

const X_IDXS = [0, 3, 6, 9, 12, 15, 18, 21, 24];
const X_EN = ["Apr '24","Jul '24","Oct '24","Jan '25","Apr '25","Jul '25","Oct '25","Jan '26","Apr '26"];
const X_DE = ["Apr '24","Jul '24","Okt '24","Jan '25","Apr '25","Jul '25","Okt '25","Jan '26","Apr '26"];

// ── Ring chart (Box 2) ────────────────────────────────────────────────────────
// Update MAX_DD / GAUGE_RANGE to shift the needle.
const MAX_DD     = 11;
const GAUGE_RANGE = 20;
const RING_CX = 65, RING_CY = 65, RING_R = 50;
const RING_CIRC = +(2 * Math.PI * RING_R).toFixed(1);                     // ≈ 314.2
const RING_DASH = +(RING_CIRC * (MAX_DD / GAUGE_RANGE)).toFixed(1);       // ≈ 172.8

// ── Icons ─────────────────────────────────────────────────────────────────────
function IcChart() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M3 17l6-6 4 4 8-8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M17 7h4v4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function IcShield() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M12 2L4 6v5c0 5.25 3.4 10.15 8 11.25 4.6-1.1 8-6 8-11.25V6l-8-4z" stroke="currentColor" strokeWidth="1.6" />
      <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function IcPillar() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M3 21h18M3 4h18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <line x1="6" y1="4" x2="6" y2="21" stroke="currentColor" strokeWidth="1.6" />
      <line x1="12" y1="4" x2="12" y2="21" stroke="currentColor" strokeWidth="1.6" />
      <line x1="18" y1="4" x2="18" y2="21" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}
function IcUser() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="1.6" />
      <path d="M4 21v-2a4 4 0 014-4h8a4 4 0 014 4v2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}
function IcNoFee() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
      <path d="M9 9l6 6M15 9l-6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}
function IcMonitor() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="2" y="3" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M8 21h8M12 17v4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M6 11l3-3 3 3 3-3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function IcDoc() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M14 2v6h6M8 13h8M8 17h5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function sgIcon(i: number): ReactNode {
  if (i === 0) return <IcUser />;
  if (i === 1) return <IcNoFee />;
  if (i === 2) return <IcMonitor />;
  return <IcDoc />;
}

// ── Copy ──────────────────────────────────────────────────────────────────────
type KPI      = { value: string; label: string };
type Safeguard = { title: string; body: string };
type Copy = {
  badge: string;
  h1: string;
  h2: string;
  sub: string;
  b1title: string;
  b1backtest: string;
  kpis: KPI[];
  disclaimer: string;
  b2title: string;
  gaugeLabel: string;
  volLabel: string;
  sharpeLabel: string;
  calmarLabel: string;
  b3title: string;
  b3desc: string;
  b4title: string;
  safeguards: Safeguard[];
};

const COPY: Record<Lang, Copy> = {
  en: {
    badge:    "Capitalife Risk Suite",
    h1:       "Understand risk.",
    h2:       "Stay in control.",
    sub:      "Historical strategy data, transparent risk metrics and clear investor safeguards give investors full visibility while keeping full control over their capital.",
    b1title:  "Historical Strategy & Performance",
    b1backtest: "Backtested since 1970",
    kpis: [
      { value: "+72.0%", label: "Net return"       },
      { value: "1970",   label: "Backtested since" },
      { value: "2024",   label: "Live since"        },
      { value: "–11.0%", label: "Max drawdown"      },
    ],
    disclaimer:   "Historical strategy data shown for informational purposes.",
    b2title:      "Strategy Risk Overview",
    gaugeLabel:   "Controlled drawdown",
    volLabel:     "Volatility",
    sharpeLabel:  "Sharpe",
    calmarLabel:  "Calmar",
    b3title:      "Regulated Partners",
    b3desc:       "Execution and partner infrastructure operate within regulated environments.",
    b4title:      "Investor Safeguards",
    safeguards: [
      { title: "Client-owned accounts",  body: "Capital remains in the client's own broker account." },
      { title: "No hidden fees",         body: "No additional investor fees for partner payouts."    },
      { title: "Live monitoring",        body: "Ongoing visibility into portfolio and strategy development." },
      { title: "Clear reporting",        body: "Transparent monthly performance and risk reporting." },
    ],
  },
  de: {
    badge:    "Capitalife Risiko-Suite",
    h1:       "Risiko verstehen.",
    h2:       "Kontrolle behalten.",
    sub:      "Historische Strategiedaten, transparente Risikometriken und klare Schutzmechanismen geben Investoren volle Transparenz – bei voller Kontrolle über das eigene Kapital.",
    b1title:  "Historische Strategie & Performance",
    b1backtest: "Backtesting seit 1970",
    kpis: [
      { value: "+72,0%", label: "Nettorendite"     },
      { value: "1970",   label: "Backtesting seit" },
      { value: "2024",   label: "Live seit"         },
      { value: "–11,0%", label: "Max. Drawdown"     },
    ],
    disclaimer:   "Historische Strategiedaten zu Informationszwecken dargestellt.",
    b2title:      "Strategie-Risikoüberblick",
    gaugeLabel:   "Kontrollierter Drawdown",
    volLabel:     "Volatilität",
    sharpeLabel:  "Sharpe",
    calmarLabel:  "Calmar",
    b3title:      "Regulierte Partner",
    b3desc:       "Ausführungs- und Partnerinfrastruktur operieren in regulierten Umgebungen.",
    b4title:      "Investorenschutz",
    safeguards: [
      { title: "Eigene Broker-Konten",        body: "Kapital verbleibt in eigenen Broker-Konten der Kunden."              },
      { title: "Keine versteckten Gebühren",   body: "Keine zusätzlichen Investorengebühren für Partnerauszahlungen."      },
      { title: "Live-Überwachung",             body: "Laufende Einsicht in Portfolio- und Strategieentwicklung."           },
      { title: "Klare Berichte",               body: "Transparente monatliche Performance- und Risikoübersichten."         },
    ],
  },
};

// ── Component ─────────────────────────────────────────────────────────────────
export default function RiskSuite() {
  const { lang } = useLanguage();
  const copy    = COPY[lang];
  const xLabels = lang === "de" ? X_DE : X_EN;

  return (
    <section className={r("section")} id="risk-suite">
      {/* Dark overlay + subtle gold ambience on top of background image */}
      <div className={r("bg")} aria-hidden />

      <div className={r("inner")}>

        {/* ── Header ───────────────────────────────────────────── */}
        <div className={r("header")}>
          <div className={r("headerBadge")}>
            <IcShield />
            <span>{copy.badge}</span>
          </div>
          <h2 className={r("headline")}>
            <span>{copy.h1}</span>{" "}
            <span className={r("headlineGold")}>{copy.h2}</span>
          </h2>
          <p className={r("sub")}>{copy.sub}</p>
        </div>

        {/* ── Asymmetric 5-col grid ────────────────────────────── */}
        <div className={r("grid")}>

          {/* ── Box 1 top-left LARGE: Performance chart ── */}
          <div className={`${r("box")} ${r("boxPerf")}`}>
            <div className={r("boxHead")}>
              <span className={r("boxIco")}><IcChart /></span>
              <span className={r("boxTitle")}>{copy.b1title}</span>
              <span className={r("btBadge")}>{copy.b1backtest}</span>
            </div>

            <div className={r("chartWrap")}>
              <svg className={r("chartSvg")} viewBox={`0 0 ${CW} ${CH}`} preserveAspectRatio="none">
                <defs>
                  <linearGradient id="rs_lg" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%"   stopColor="#b8922e" />
                    <stop offset="45%"  stopColor="#f5e6a3" />
                    <stop offset="100%" stopColor="#d4af55" />
                  </linearGradient>
                  <linearGradient id="rs_ag" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%"   stopColor="#d4af55" stopOpacity="0.25" />
                    <stop offset="80%"  stopColor="#d4af55" stopOpacity="0.03" />
                    <stop offset="100%" stopColor="#d4af55" stopOpacity="0" />
                  </linearGradient>
                </defs>

                {Y_TICKS.map((v) => (
                  <g key={v}>
                    <line x1={PL} y1={yPos(v)} x2={CW - PR} y2={yPos(v)} className={r("cGrid")} />
                    <text x={PL - 5} y={yPos(v) + 4} className={r("cYLbl")} textAnchor="end">{v}%</text>
                  </g>
                ))}

                {X_IDXS.map((idx, i) => (
                  <text
                    key={idx}
                    x={(PL + (idx / (PERF_NORM.length - 1)) * uW).toFixed(1)}
                    y={CH - 5}
                    className={r("cXLbl")}
                    textAnchor="middle"
                  >
                    {xLabels[i]}
                  </text>
                ))}

                <path d={CHART_AREA} fill="url(#rs_ag)" />
                <path d={CHART_LINE} className={r("cLine")} />

                {/* Endpoint glow dot */}
                <circle cx={CHART_LX.toFixed(1)} cy={CHART_LY.toFixed(1)} r="5" fill="#f0dc96" opacity="0.3" />
                <circle cx={CHART_LX.toFixed(1)} cy={CHART_LY.toFixed(1)} r="3" fill="#f0dc96" />
              </svg>
            </div>

            <div className={r("kpiRow")}>
              {copy.kpis.map((k, i) => (
                <div key={i} className={r("kpiItem")}>
                  <span className={r("kpiVal")}>{k.value}</span>
                  <span className={r("kpiLbl")}>{k.label}</span>
                </div>
              ))}
            </div>

            <p className={r("disclaim")}>{copy.disclaimer}</p>
          </div>

          {/* ── Box 2 top-right SMALL: Risk ring chart ── */}
          <div className={`${r("box")} ${r("boxRisk")}`}>
            <div className={r("boxHead")}>
              <span className={r("boxIco")}><IcShield /></span>
              <span className={r("boxTitle")}>{copy.b2title}</span>
            </div>

            <div className={r("ringWrap")}>
              <svg viewBox="0 0 130 130" fill="none" className={r("ringSvg")}>
                <defs>
                  <linearGradient id="rs_rg" x1="0" y1="1" x2="1" y2="0">
                    <stop offset="0%"   stopColor="#3d2608" />
                    <stop offset="60%"  stopColor="#c9a84e" />
                    <stop offset="100%" stopColor="#f0dc96" />
                  </linearGradient>
                  <filter id="rs_rglow">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                  </filter>
                </defs>

                {/* Track */}
                <circle cx={RING_CX} cy={RING_CY} r={RING_R}
                  stroke="rgba(255,255,255,0.07)"
                  strokeWidth="11"
                />
                {/* Active arc — starts at 12 o'clock via rotate(-90) */}
                <circle cx={RING_CX} cy={RING_CY} r={RING_R}
                  stroke="url(#rs_rg)"
                  strokeWidth="11"
                  strokeLinecap="round"
                  strokeDasharray={`${RING_DASH} ${RING_CIRC}`}
                  transform={`rotate(-90, ${RING_CX}, ${RING_CY})`}
                  filter="url(#rs_rglow)"
                />
                {/* Center value */}
                <text x={RING_CX} y={RING_CY - 5} textAnchor="middle" className={r("ringVal")}>
                  {MAX_DD}%
                </text>
                <text x={RING_CX} y={RING_CY + 13} textAnchor="middle" className={r("ringLbl")}>
                  {copy.gaugeLabel}
                </text>
              </svg>
            </div>

            <div className={r("statsRow")}>
              <div className={r("statItem")}>
                <span className={r("statLbl")}>{copy.volLabel}</span>
                {/* Update value below as needed */}
                <span className={r("statVal")}>9.8%</span>
              </div>
              <div className={r("statDiv")} />
              <div className={r("statItem")}>
                <span className={r("statLbl")}>{copy.sharpeLabel}</span>
                <span className={r("statVal")}>1.32</span>
              </div>
              <div className={r("statDiv")} />
              <div className={r("statItem")}>
                <span className={r("statLbl")}>{copy.calmarLabel}</span>
                <span className={r("statVal")}>1.91</span>
              </div>
            </div>
          </div>

          {/* ── Box 3 bottom-left SMALL: Regulated partners ── */}
          <div className={`${r("box")} ${r("boxReg")}`}>
            <div className={r("boxHead")}>
              <span className={r("boxIco")}><IcPillar /></span>
              <span className={r("boxTitle")}>{copy.b3title}</span>
            </div>

            {/* Visual: 3 shield icons with acronym */}
            <div className={r("regVisual")}>
              {(["FCA", "CySEC", "FSC"] as const).map((reg) => (
                <div key={reg} className={r("regVisualItem")}>
                  <span className={r("regVisualIco")}><IcShield /></span>
                  <span className={r("regVisualName")}>{reg}</span>
                </div>
              ))}
            </div>

            <p className={r("boxDesc")}>{copy.b3desc}</p>

            {/* Regulation badges — gold/white, no green */}
            <div className={r("regList")}>
              {(["FCA-regulated", "CySEC-regulated", "FSC-regulated"] as const).map((b) => (
                <span key={b} className={r("regBadge")}>
                  <IcShield />
                  {b}
                </span>
              ))}
            </div>
          </div>

          {/* ── Box 4 bottom-right LARGE: Investor safeguards ── */}
          <div className={`${r("box")} ${r("boxSafe")}`}>
            <div className={r("boxHead")}>
              <span className={r("boxIco")}><IcShield /></span>
              <span className={r("boxTitle")}>{copy.b4title}</span>
            </div>
            <div className={r("sgGrid")}>
              {copy.safeguards.map((sg, i) => (
                <div key={i} className={r("sgCard")}>
                  <div className={r("sgTop")}>
                    <span className={r("sgIco")}>{sgIcon(i)}</span>
                    <span className={r("sgTitle")}>{sg.title}</span>
                  </div>
                  <span className={r("sgBody")}>{sg.body}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
