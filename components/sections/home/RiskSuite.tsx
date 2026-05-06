"use client";

import type { ReactNode } from "react";

import { useLanguage, type Lang } from "@/lib/i18n/language";
import raw from "./RiskSuite.module.css";

function r(name: string): string {
  return (raw as Record<string, string>)[name] ?? "";
}

// ── Performance data ──────────────────────────────────────────────────────────
// Real Capitalife cumulative returns % (Apr 2024 → Apr 2026).
// Append a value here and update kpis copy below to refresh.
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
const yPos    = (v: number) => PT + uH - (v / CHART_MAX) * uH;

const X_IDXS = [0, 3, 6, 9, 12, 15, 18, 21, 24];
const X_EN   = ["Apr '24","Jul '24","Oct '24","Jan '25","Apr '25","Jul '25","Oct '25","Jan '26","Apr '26"];
const X_DE   = ["Apr '24","Jul '24","Okt '24","Jan '25","Apr '25","Jul '25","Okt '25","Jan '26","Apr '26"];

// ── Ring chart (Box 2) ────────────────────────────────────────────────────────
// Change MAX_DD / GAUGE_RANGE to adjust the fill.
const MAX_DD      = 11;
const GAUGE_RANGE = 20;
const RING_CX     = 100;
const RING_CY     = 100;
const RING_R      = 80;
const RING_CIRC   = +(2 * Math.PI * RING_R).toFixed(1);                     // ≈ 502.7
const RING_DASH   = +(RING_CIRC * (MAX_DD / GAUGE_RANGE)).toFixed(1);       // ≈ 276.5
// Endpoint of active arc (for glow dot)
const RING_END_A  = -Math.PI / 2 + (MAX_DD / GAUGE_RANGE) * 2 * Math.PI;
const RING_EX     = +(RING_CX + RING_R * Math.cos(RING_END_A)).toFixed(1);  // ≈ 75.3
const RING_EY     = +(RING_CY + RING_R * Math.sin(RING_END_A)).toFixed(1);  // ≈ 176.1

// ── Compliance data ───────────────────────────────────────────────────────────
const COMPLIANCE_DATA = [
  { reg: "FCA",   full: "Financial Conduct Authority"     },
  { reg: "CySEC", full: "Cyprus Securities Commission"    },
  { reg: "FSC",   full: "Financial Services Commission"   },
] as const;

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
function IcCheck() {
  return (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M5 12l5 5 9-9" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function IcUser() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="1.6" />
      <path d="M4 21v-2a4 4 0 014-4h8a4 4 0 014 4v2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}
function IcNoFee() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
      <path d="M9 9l6 6M15 9l-6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}
function IcMonitor() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="2" y="3" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M8 21h8M12 17v4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M6 11l3-3 3 3 3-3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function IcDoc() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
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
  compStatus: string;
  b4title: string;
  safeguards: Safeguard[];
};

const COPY: Record<Lang, Copy> = {
  en: {
    badge:       "Capitalife Control Framework",
    h1:          "Risk in clear view.",
    h2:          "Capital under control.",
    sub:         "Historical strategy data, transparent risk metrics and clear safeguards give investors full visibility while keeping full control over their capital.",
    b1title:     "Historical Strategy & Performance",
    b1backtest:  "Backtested since 1970",
    kpis: [
      { value: "+72.0%", label: "Net return"       },
      { value: "1970",   label: "Backtested since" },
      { value: "2024",   label: "Live since"        },
      { value: "–11.0%", label: "Max drawdown"      },
    ],
    disclaimer:   "Historical strategy data shown for informational purposes.",
    b2title:      "Strategy Risk Overview",
    gaugeLabel:   "Controlled Drawdown",
    volLabel:     "Volatility",
    sharpeLabel:  "Sharpe",
    calmarLabel:  "Calmar",
    b3title:      "Regulated Partners",
    b3desc:       "Execution and partner infrastructure operate within regulated environments.",
    compStatus:   "Verified",
    b4title:      "Investor Safeguards",
    safeguards: [
      { title: "Client-owned accounts",  body: "Capital remains in the client's own broker account."        },
      { title: "No hidden fees",         body: "No additional investor fees for partner payouts."            },
      { title: "Live monitoring",        body: "Ongoing visibility into portfolio and strategy development." },
      { title: "Clear reporting",        body: "Transparent monthly performance and risk reporting."         },
    ],
  },
  de: {
    badge:       "Capitalife Kontrollsystem",
    h1:          "Risiko klar im Blick.",
    h2:          "Kapital unter Kontrolle.",
    sub:         "Historische Strategiedaten, transparente Risikometriken und klare Schutzmechanismen geben Investoren volle Transparenz – bei voller Kontrolle über das eigene Kapital.",
    b1title:     "Historische Strategie & Performance",
    b1backtest:  "Backtesting seit 1970",
    kpis: [
      { value: "+72,0%", label: "Nettorendite"      },
      { value: "1970",   label: "Backtesting seit"  },
      { value: "2024",   label: "Live seit"          },
      { value: "–11,0%", label: "Max. Drawdown"      },
    ],
    disclaimer:   "Historische Strategiedaten zu Informationszwecken dargestellt.",
    b2title:      "Strategie Risikoübersicht",
    gaugeLabel:   "Kontrollierter Drawdown",
    volLabel:     "Volatilität",
    sharpeLabel:  "Sharpe",
    calmarLabel:  "Calmar",
    b3title:      "Regulierte Partner",
    b3desc:       "Ausführungs- und Partnerinfrastruktur operieren in regulierten Umgebungen.",
    compStatus:   "Verifiziert",
    b4title:      "Investorenschutz",
    safeguards: [
      { title: "Eigene Broker-Konten",          body: "Kapital verbleibt in den Broker-Konten der Kunden."              },
      { title: "Keine versteckten Gebühren",     body: "Keine zusätzlichen Investorengebühren für Partnerauszahlungen." },
      { title: "Live-Überwachung",               body: "Laufende Einsicht in Portfolio- und Strategieentwicklung."      },
      { title: "Klare Berichte",                 body: "Transparente monatliche Performance- und Risikoübersichten."    },
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
      {/* Overlay: dark + gold radial + top/bottom fades */}
      <div className={r("bg")} aria-hidden />

      <div className={r("inner")}>

        {/* ── Header ── */}
        <div className={r("header")}>
          <div className={r("headerBadge")}>
            <IcShield />
            <span>{copy.badge}</span>
          </div>
          <h2 className={r("headline")}>
            <span>{copy.h1}</span>{" "}
            <span className={r("headlineAccent")}>{copy.h2}</span>
          </h2>
          <p className={r("sub")}>{copy.sub}</p>
        </div>

        {/* ── Asymmetric 5-column grid ── */}
        <div className={r("grid")}>

          {/* ── Box 1  top-left LARGE: Performance chart ── */}
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
                    <stop offset="0%"   stopColor="#7a5c18" />
                    <stop offset="40%"  stopColor="#e2d090" />
                    <stop offset="100%" stopColor="#a87e28" />
                  </linearGradient>
                  <linearGradient id="rs_ag" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%"   stopColor="#c8a840" stopOpacity="0.20" />
                    <stop offset="80%"  stopColor="#c8a840" stopOpacity="0.02" />
                    <stop offset="100%" stopColor="#c8a840" stopOpacity="0" />
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
                <circle cx={CHART_LX.toFixed(1)} cy={CHART_LY.toFixed(1)} r="6" fill="rgba(226,208,144,0.18)" />
                <circle cx={CHART_LX.toFixed(1)} cy={CHART_LY.toFixed(1)} r="3" fill="#e2d090" />
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

          {/* ── Box 2  top-right SMALL: Risk ring + stats row below ── */}
          <div className={`${r("box")} ${r("boxRisk")}`}>
            <div className={r("boxHead")}>
              <span className={r("boxIco")}><IcShield /></span>
              <span className={r("boxTitle")}>{copy.b2title}</span>
            </div>

            {/* Large ring chart — fills available space */}
            <div className={r("ringWrap")}>
              <svg viewBox="0 0 200 200" fill="none" className={r("ringSvg")}>
                <defs>
                  <linearGradient id="rs_rg" x1="0" y1="1" x2="1" y2="0">
                    <stop offset="0%"   stopColor="#2e1c04" />
                    <stop offset="55%"  stopColor="#a87e28" />
                    <stop offset="100%" stopColor="#e2d090" />
                  </linearGradient>
                  <radialGradient id="rs_rdot" cx="50%" cy="50%" r="50%">
                    <stop offset="0%"   stopColor="#e2d090" stopOpacity="0.55" />
                    <stop offset="100%" stopColor="#e2d090" stopOpacity="0" />
                  </radialGradient>
                  <filter id="rs_rglow">
                    <feGaussianBlur stdDeviation="5" result="blur" />
                    <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                  </filter>
                </defs>

                {/* Outermost ambient ring */}
                <circle cx={RING_CX} cy={RING_CY} r={RING_R + 12}
                  stroke="rgba(200,168,64,0.055)" strokeWidth="1"
                />
                {/* Inner decorative ring */}
                <circle cx={RING_CX} cy={RING_CY} r={RING_R - 16}
                  stroke="rgba(255,255,255,0.04)" strokeWidth="1"
                />

                {/* Track */}
                <circle cx={RING_CX} cy={RING_CY} r={RING_R}
                  stroke="rgba(255,255,255,0.06)" strokeWidth="14"
                />
                {/* Active arc — starts at 12 o'clock */}
                <circle cx={RING_CX} cy={RING_CY} r={RING_R}
                  stroke="url(#rs_rg)"
                  strokeWidth="14"
                  strokeLinecap="round"
                  strokeDasharray={`${RING_DASH} ${RING_CIRC}`}
                  transform={`rotate(-90, ${RING_CX}, ${RING_CY})`}
                  filter="url(#rs_rglow)"
                />

                {/* Arc endpoint: glow halo + dot */}
                <circle cx={RING_EX} cy={RING_EY} r="16" fill="url(#rs_rdot)" />
                <circle cx={RING_EX} cy={RING_EY} r="5"  fill="#e2d090" />
                <circle cx={RING_EX} cy={RING_EY} r="2.5" fill="rgba(255,255,255,0.9)" />

                {/* Center text */}
                <text x={RING_CX} y={RING_CY - 8} textAnchor="middle" className={r("ringVal")}>
                  {MAX_DD}%
                </text>
                <text x={RING_CX} y={RING_CY + 12} textAnchor="middle" className={r("ringLbl")}>
                  {copy.gaugeLabel}
                </text>
              </svg>
            </div>

            {/* 3 stats below the ring */}
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

          {/* ── Box 3  bottom-left SMALL: Regulated partners ── */}
          <div className={`${r("box")} ${r("boxReg")}`}>
            <div className={r("boxHead")}>
              <span className={r("boxIco")}><IcPillar /></span>
              <span className={r("boxTitle")}>{copy.b3title}</span>
            </div>

            <p className={r("boxDesc")}>{copy.b3desc}</p>

            {/* Authority cards — shown once, not duplicated below */}
            <div className={r("authGrid")}>
              {COMPLIANCE_DATA.map(({ reg, full }) => (
                <div key={reg} className={r("authCard")}>
                  <span className={r("authAcronym")}>{reg}</span>
                  <span className={r("authFull")}>{full}</span>
                  <div className={r("authStatus")}>
                    <IcCheck />
                    <span>{copy.compStatus}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Box 4  bottom-right LARGE: Investor safeguards ── */}
          <div className={`${r("box")} ${r("boxSafe")}`}>
            <div className={r("boxHead")}>
              <span className={r("boxIco")}><IcShield /></span>
              <span className={r("boxTitle")}>{copy.b4title}</span>
            </div>
            <div className={r("sgGrid")}>
              {copy.safeguards.map((sg, i) => (
                <div key={i} className={r("sgCard")}>
                  <span className={r("sgIco")}>{sgIcon(i)}</span>
                  <div className={r("sgContent")}>
                    <span className={r("sgTitle")}>{sg.title}</span>
                    <span className={r("sgBody")}>{sg.body}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
