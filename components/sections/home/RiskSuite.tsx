"use client";

import type { ReactNode } from "react";

import { useLanguage, type Lang } from "@/lib/i18n/language";
import raw from "./RiskSuite.module.css";

function r(name: string): string {
  return (raw as Record<string, string>)[name] ?? "";
}

// ── Backtesting curve (1970–2026, cumulative return %) ─────────────────────────
// 57 data points: index 0 = 1970, index 56 = 2026.
const BACKTEST_RAW = [
  -3.43, -5.60, -0.50, 2.10, 3.81, -6.00, -2.58, -0.03, 1.29, 1.13,
  11.37, 5.15, 6.28, 5.87, 6.58, 14.48, 9.24, 9.09, 13.04, 15.67,
  15.06, 11.99, 22.66, 30.93, 38.83, 57.83, 68.32, 89.43, 96.32, 124.12,
  141.52, 143.01, 182.72, 231.83, 219.59, 235.09, 333.80, 403.30, 340.69, 494.40,
  664.40, 802.52, 846.66, 1086.06, 1304.66, 1397.36, 1710.31, 2130.85, 2271.17, 3181.22,
  4026.79, 5156.30, 5597.30, 7057.52, 8929.21, 11488.99, 11564.32,
];
const BT_N = BACKTEST_RAW.length; // 57

// ── Chart geometry ─────────────────────────────────────────────────────────────
const CW = 560, CH = 148;
const BT_PL = 52, BT_PR = 18, BT_PT = 8, BT_PB = 22;
const BT_uW  = CW - BT_PL - BT_PR;
const BT_uH  = CH - BT_PT - BT_PB;
const BT_MAX = 12000;

const BT_Y_TICKS = [0, 2500, 5000, 7500, 10000];
const BT_X_IDXS  = [0, 10, 20, 30, 40, 50, 56];
const BT_X_LBLS  = ["1970", "1980", "1990", "2000", "2010", "2020", "2026"];

function btYPos(v: number): number {
  return BT_PT + BT_uH - (Math.max(0, v) / BT_MAX) * BT_uH;
}

function btFmtY(v: number, lang: Lang): string {
  if (v === 0) return "0%";
  const sep = lang === "de" ? "." : ",";
  return `${v.toString().replace(/\B(?=(\d{3})+(?!\d))/g, sep)}%`;
}

function buildBtChart() {
  const pts = BACKTEST_RAW.map((v, i) => ({
    x: BT_PL + (i / (BT_N - 1)) * BT_uW,
    y: btYPos(v),
  }));
  const p0 = pts[0]!;
  let line = `M${p0.x.toFixed(1)},${p0.y.toFixed(1)}`;
  for (let i = 1; i < pts.length; i++) {
    const a  = pts[i - 1]!;
    const b  = pts[i]!;
    const cx = (a.x + b.x) / 2;
    line += ` C${cx.toFixed(1)},${a.y.toFixed(1)} ${cx.toFixed(1)},${b.y.toFixed(1)} ${b.x.toFixed(1)},${b.y.toFixed(1)}`;
  }
  const last  = pts[pts.length - 1]!;
  const baseY = (BT_PT + BT_uH).toFixed(1);
  const area  = `${line} L${last.x.toFixed(1)},${baseY} L${BT_PL},${baseY} Z`;
  return { line, area, lastX: last.x, lastY: last.y };
}

const { line: BT_LINE, area: BT_AREA, lastX: BT_LX, lastY: BT_LY } = buildBtChart();

// ── Ring chart (Box 2) — decorative control indicator ─────────────────────────
// Arc fill at 72% as a visual "control level" — not tied to a specific metric.
const RING_CX    = 100;
const RING_CY    = 100;
const RING_R     = 80;
const RING_CIRC  = +(2 * Math.PI * RING_R).toFixed(1);                     // ≈ 502.7
const RING_FILL  = 0.72;                                                    // visual fill
const RING_DASH  = +(RING_CIRC * RING_FILL).toFixed(1);                    // ≈ 361.9
const RING_END_A = -Math.PI / 2 + RING_FILL * 2 * Math.PI;
const RING_EX    = +(RING_CX + RING_R * Math.cos(RING_END_A)).toFixed(1);  // ≈ 21.4
const RING_EY    = +(RING_CY + RING_R * Math.sin(RING_END_A)).toFixed(1);  // ≈ 115.2

// 24 tachometer tick marks outside the ring track
const RTICK_N = 24;
const RTICK_I = 88;
const RTICK_O = 94;
interface TickCoord { x1: number; y1: number; x2: number; y2: number; major: boolean }
const RING_TICKS: TickCoord[] = Array.from({ length: RTICK_N }, (_, i) => {
  const a     = -Math.PI / 2 + (i / RTICK_N) * 2 * Math.PI;
  const inner = i % 6 === 0 ? RTICK_I - 3 : RTICK_I;
  return {
    x1: +(RING_CX + inner * Math.cos(a)).toFixed(1),
    y1: +(RING_CY + inner * Math.sin(a)).toFixed(1),
    x2: +(RING_CX + RTICK_O * Math.cos(a)).toFixed(1),
    y2: +(RING_CY + RTICK_O * Math.sin(a)).toFixed(1),
    major: i % 6 === 0,
  };
});

// ── Icons ──────────────────────────────────────────────────────────────────────
function IcChart(): ReactNode {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M3 17l6-6 4 4 8-8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M17 7h4v4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IcShield(): ReactNode {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M12 2L4 6v5c0 5.25 3.4 10.15 8 11.25 4.6-1.1 8-6 8-11.25V6l-8-4z" stroke="currentColor" strokeWidth="1.6" />
      <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// Network / compliance icon for Box 3
function IcNetwork(): ReactNode {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="2.5" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="5"  cy="5"  r="2"   stroke="currentColor" strokeWidth="1.6" />
      <circle cx="19" cy="5"  r="2"   stroke="currentColor" strokeWidth="1.6" />
      <circle cx="5"  cy="19" r="2"   stroke="currentColor" strokeWidth="1.6" />
      <circle cx="19" cy="19" r="2"   stroke="currentColor" strokeWidth="1.6" />
      <path d="M7 7l3.5 3.5M17 7l-3.5 3.5M7 17l3.5-3.5M17 17l-3.5-3.5"
        stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

// Large central shield for Box 4
function IcShieldLg(): ReactNode {
  return (
    <svg width="46" height="54" viewBox="0 0 52 60" fill="none" aria-hidden>
      <path
        d="M26 2L4 10v16c0 16.8 11.8 32.5 22 36.9C36.2 58.5 48 42.8 48 26V10L26 2z"
        stroke="rgba(255,255,255,0.22)" strokeWidth="1.5"
        fill="rgba(255,255,255,0.05)"
      />
      <path
        d="M26 13L14 19v9c0 10.5 7.4 20.3 12 22.8 4.6-2.5 12-12.3 12-22.8V19L26 13z"
        stroke="rgba(255,255,255,0.09)" strokeWidth="1"
        fill="rgba(255,255,255,0.02)"
      />
      <path
        d="M19 30l5 5 9-9"
        stroke="rgba(255,255,255,0.52)" strokeWidth="1.6"
        strokeLinecap="round" strokeLinejoin="round"
      />
    </svg>
  );
}

// ── Copy ──────────────────────────────────────────────────────────────────────
type StatItem  = { lbl: string; val: string };
type KPI       = { value: string; label: string };
type Safeguard = { title: string; body: string };

type Copy = {
  badge: string;
  h1: string;
  h2: string;
  sub: string;
  // Box 1
  b1title: string;
  b1backtest: string;
  b1kpis: KPI[];
  b1disclaimer: string;
  // Box 2
  b2title: string;
  b2center1: string;
  b2center2: string;
  b2subLine: string;
  b2stats: StatItem[];
  // Box 3
  b3title: string;
  b3desc: string;
  // Box 4
  b4title: string;
  safeguards: Safeguard[];
};

const COPY: Record<Lang, Copy> = {
  en: {
    badge: "For Investors",
    h1:    "Transparency that",
    h2:    "builds trust.",
    sub:   "Clear visibility into strategy, structure and safeguards helps investors understand how everything is designed to communicate clarity, confidence and control.",
    // Box 1
    b1title:     "Historical Strategy & Performance",
    b1backtest:  "Backtesting since 1970",
    b1kpis: [
      { value: "+8.80%",  label: "Annual return"        },
      { value: "1970",    label: "Backtested since"     },
      { value: "2024",    label: "Live + shadow since"  },
      { value: "−20.91%", label: "Max drawdown"         },
    ],
    b1disclaimer: "Historical strategy data shown for informational purposes.",
    // Box 2
    b2title:   "Strategy Risk Overview",
    b2center1: "Controlled",
    b2center2: "risk profile",
    b2subLine: "Structured control across multiple market phases",
    b2stats: [
      { lbl: "Sharpe",        val: "1.63"  },
      { lbl: "Calmar",        val: "0.43"  },
      { lbl: "Profit factor", val: "1.24"  },
      { lbl: "Win rate",      val: "42.9%" },
    ],
    // Box 3
    b3title: "Regulated Partners",
    b3desc:  "Collaboration with established and regulated partners.",
    // Box 4
    b4title: "Investor Protection",
    safeguards: [
      { title: "Existing broker accounts", body: "Capital remains within the investor's existing account structure."      },
      { title: "No hidden fees",           body: "Structures and processes remain transparent and easy to understand."     },
      { title: "Ongoing visibility",       body: "Developments and reporting can be reviewed on a regular basis."          },
      { title: "Clear reporting",          body: "Relevant information is presented in a clear and structured way."        },
    ],
  },
  de: {
    badge: "Für Investoren",
    h1:    "Transparenz, die",
    h2:    "Vertrauen schafft.",
    sub:   "Klare Einblicke in Strategie, Struktur und Schutzmechanismen geben Investoren Orientierung. Alles ist darauf ausgelegt, Vertrauen aufzubauen und Kontrolle einfach nachvollziehbar zu machen.",
    // Box 1
    b1title:     "Historische Strategie & Performance",
    b1backtest:  "Backtesting seit 1970",
    b1kpis: [
      { value: "+8,80%",  label: "Jährliche Rendite"   },
      { value: "1970",    label: "Backtesting seit"     },
      { value: "2024",    label: "Live + Shadow seit"   },
      { value: "−20,91%", label: "Max. Drawdown"        },
    ],
    b1disclaimer: "Historische Strategiedaten zu Informationszwecken dargestellt.",
    // Box 2
    b2title:   "Strategie Risikoübersicht",
    b2center1: "Kontrolliertes",
    b2center2: "Risikoprofil",
    b2subLine: "Strukturierte Steuerung über mehrere Marktphasen",
    b2stats: [
      { lbl: "Sharpe",        val: "1,63"  },
      { lbl: "Calmar",        val: "0,43"  },
      { lbl: "Profit Factor", val: "1,24"  },
      { lbl: "Trefferquote",  val: "42,9%" },
    ],
    // Box 3
    b3title: "Regulierte Partner",
    b3desc:  "Zusammenarbeit mit etablierten und regulierten Partnern.",
    // Box 4
    b4title: "Investorenschutz",
    safeguards: [
      { title: "Eigene Broker-Konten",      body: "Kapital bleibt in der bestehenden Kontostruktur der Investoren."                    },
      { title: "Keine versteckten Gebühren", body: "Strukturen und Abläufe bleiben transparent und nachvollziehbar."                   },
      { title: "Laufende Einsicht",          body: "Entwicklungen und Berichte können regelmäßig nachvollzogen werden."               },
      { title: "Klare Berichte",             body: "Wesentliche Informationen werden verständlich und strukturiert aufbereitet."       },
    ],
  },
};

// ── Component ──────────────────────────────────────────────────────────────────
export default function RiskSuite() {
  const { lang } = useLanguage();
  const copy = COPY[lang];

  return (
    <section className={r("section")} id="risk-suite">
      <div className={r("bg")} aria-hidden />

      <div className={r("inner")}>

        {/* ── Header ── */}
        <div className={r("header")}>
          {/* Pill badge — same style as Strategy/other sections */}
          <div className={r("headerPill")}>
            <span className={r("pillDot")} />
            <span className={r("pillText")}>{copy.badge}</span>
          </div>
          <h2 className={r("headline")}>
            <span>{copy.h1}</span>{" "}
            <span className={r("headlineAccent")}>{copy.h2}</span>
          </h2>
          <p className={r("sub")}>{copy.sub}</p>
        </div>

        {/* ── 5-col asymmetric grid ── */}
        <div className={r("grid")}>

          {/* ── Box 1: Backtesting chart ── */}
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
                    <stop offset="0%"   stopColor="#5a4520" />
                    <stop offset="50%"  stopColor="#ddd4aa" />
                    <stop offset="100%" stopColor="#8a7038" />
                  </linearGradient>
                  <linearGradient id="rs_ag" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%"   stopColor="#c0a84a" stopOpacity="0.12" />
                    <stop offset="100%" stopColor="#c0a84a" stopOpacity="0" />
                  </linearGradient>
                </defs>

                {/* Subtle horizontal grid */}
                {BT_Y_TICKS.map((v) => (
                  <g key={v}>
                    <line
                      x1={BT_PL} y1={btYPos(v)}
                      x2={CW - BT_PR} y2={btYPos(v)}
                      className={r("cGrid")}
                    />
                    <text
                      x={BT_PL - 5} y={btYPos(v) + 4}
                      className={r("cYLbl")} textAnchor="end"
                    >
                      {btFmtY(v, lang)}
                    </text>
                  </g>
                ))}

                {/* X-axis year labels */}
                {BT_X_IDXS.map((idx, i) => (
                  <text
                    key={idx}
                    x={(BT_PL + (idx / (BT_N - 1)) * BT_uW).toFixed(1)}
                    y={CH - 5}
                    className={r("cXLbl")}
                    textAnchor={i === BT_X_IDXS.length - 1 ? "end" : "middle"}
                  >
                    {BT_X_LBLS[i]}
                  </text>
                ))}

                {/* Fill + line */}
                <path d={BT_AREA} fill="url(#rs_ag)" />
                <path d={BT_LINE} className={r("cLine")} />

                {/* Endpoint glow dot */}
                <circle cx={BT_LX.toFixed(1)} cy={BT_LY.toFixed(1)} r="6" fill="rgba(220,210,170,0.14)" />
                <circle cx={BT_LX.toFixed(1)} cy={BT_LY.toFixed(1)} r="2.5" fill="#ddd4aa" />
              </svg>
            </div>

            <div className={r("kpiRow")}>
              {copy.b1kpis.map((k, i) => (
                <div key={i} className={r("kpiItem")}>
                  <span className={r("kpiVal")}>{k.value}</span>
                  <span className={r("kpiLbl")}>{k.label}</span>
                </div>
              ))}
            </div>

            <p className={r("disclaim")}>{copy.b1disclaimer}</p>
          </div>

          {/* ── Box 2: Risk ring ── */}
          <div className={`${r("box")} ${r("boxRisk")}`}>
            <div className={r("boxHead")}>
              <span className={r("boxIco")}><IcShield /></span>
              <span className={r("boxTitle")}>{copy.b2title}</span>
            </div>

            <div className={r("ringWrap")}>
              <svg viewBox="0 0 200 200" fill="none" className={r("ringSvg")}>
                <defs>
                  <linearGradient id="rs_rg" x1="0" y1="1" x2="1" y2="0">
                    <stop offset="0%"   stopColor="#1a1206" />
                    <stop offset="45%"  stopColor="#8a6828" />
                    <stop offset="100%" stopColor="#ddd4aa" />
                  </linearGradient>
                  <radialGradient id="rs_rdot" cx="50%" cy="50%" r="50%">
                    <stop offset="0%"   stopColor="#ddd4aa" stopOpacity="0.45" />
                    <stop offset="100%" stopColor="#ddd4aa" stopOpacity="0" />
                  </radialGradient>
                  <filter id="rs_rglow">
                    <feGaussianBlur stdDeviation="3.5" result="blur" />
                    <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                  </filter>
                </defs>

                {/* Outer ambient pulsing ring */}
                <circle cx={RING_CX} cy={RING_CY} r={RING_R + 15}
                  stroke="rgba(196,166,80,0.04)" strokeWidth="1"
                  className={r("ringGlow")}
                />

                {/* 24 tachometer ticks */}
                {RING_TICKS.map((t, i) => (
                  <line
                    key={i}
                    x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2}
                    stroke={t.major ? "rgba(255,255,255,0.16)" : "rgba(255,255,255,0.06)"}
                    strokeWidth={t.major ? "1.4" : "0.9"}
                  />
                ))}

                {/* Track */}
                <circle cx={RING_CX} cy={RING_CY} r={RING_R}
                  stroke="rgba(255,255,255,0.055)" strokeWidth="13"
                />
                {/* Active arc — clockwise from 12 o'clock */}
                <circle cx={RING_CX} cy={RING_CY} r={RING_R}
                  stroke="url(#rs_rg)"
                  strokeWidth="13"
                  strokeLinecap="round"
                  strokeDasharray={`${RING_DASH} ${RING_CIRC}`}
                  transform={`rotate(-90, ${RING_CX}, ${RING_CY})`}
                  filter="url(#rs_rglow)"
                />

                {/* Inner decorative ring */}
                <circle cx={RING_CX} cy={RING_CY} r={RING_R - 19}
                  stroke="rgba(255,255,255,0.035)" strokeWidth="1"
                />

                {/* Arc endpoint glow + dot */}
                <circle cx={RING_EX} cy={RING_EY} r="13" fill="url(#rs_rdot)" />
                <circle cx={RING_EX} cy={RING_EY} r="4" fill="#ddd4aa" />
                <circle cx={RING_EX} cy={RING_EY} r="1.8" fill="rgba(255,255,255,0.85)" />

                {/* Center text: 2-line "Controlled risk profile" */}
                <text x={RING_CX} y={RING_CY - 8} textAnchor="middle" className={r("ringCenter1")}>
                  {copy.b2center1}
                </text>
                <text x={RING_CX} y={RING_CY + 9} textAnchor="middle" className={r("ringCenter2")}>
                  {copy.b2center2}
                </text>
              </svg>
            </div>

            {/* Subtitle below ring */}
            <p className={r("b2SubLine")}>{copy.b2subLine}</p>

            {/* 4 stats */}
            <div className={r("statsRow")}>
              {copy.b2stats.flatMap((s, i) => [
                i > 0 ? <div key={`d${i}`} className={r("statDiv")} /> : null,
                <div key={s.lbl} className={r("statItem")}>
                  <span className={r("statLbl")}>{s.lbl}</span>
                  <span className={r("statVal")}>{s.val}</span>
                </div>,
              ])}
            </div>
          </div>

          {/* ── Box 3: Partner network ── */}
          <div className={`${r("box")} ${r("boxReg")}`}>
            <div className={r("boxHead")}>
              <span className={r("boxIco")}><IcNetwork /></span>
              <span className={r("boxTitle")}>{copy.b3title}</span>
            </div>

            <p className={r("boxDesc")}>{copy.b3desc}</p>

            {/* Partner & regulator network visualization */}
            <div className={r("partnerWrap")}>
              <svg viewBox="0 0 280 152" fill="none" aria-label="Partner network" className={r("partnerSvg")}>
                <defs>
                  <radialGradient id="rs_hubGrad" cx="50%" cy="50%" r="50%">
                    <stop offset="0%"   stopColor="rgba(196,166,80,0.20)" />
                    <stop offset="100%" stopColor="rgba(196,166,80,0)" />
                  </radialGradient>
                  <radialGradient id="rs_hubInner" cx="50%" cy="50%" r="50%">
                    <stop offset="0%"   stopColor="rgba(221,212,170,0.6)" />
                    <stop offset="100%" stopColor="rgba(196,166,80,0.2)" />
                  </radialGradient>
                </defs>

                {/* ── Connecting lines with flow animation ── */}
                {/* Hub → RoboForex */}
                <line x1="140" y1="76" x2="70" y2="32"
                  stroke="rgba(255,255,255,0.08)" strokeWidth="1"
                  strokeDasharray="3 4" className={r("netLine")} />
                {/* Hub → Vantage */}
                <line x1="140" y1="76" x2="210" y2="32"
                  stroke="rgba(255,255,255,0.08)" strokeWidth="1"
                  strokeDasharray="3 4" className={r("netLineB")} />
                {/* Hub → FCA */}
                <line x1="140" y1="76" x2="52" y2="132"
                  stroke="rgba(255,255,255,0.06)" strokeWidth="1"
                  strokeDasharray="3 4" className={r("netLineC")} />
                {/* Hub → CySEC */}
                <line x1="140" y1="76" x2="140" y2="138"
                  stroke="rgba(255,255,255,0.06)" strokeWidth="1"
                  strokeDasharray="3 4" className={r("netLineD")} />
                {/* Hub → FSC */}
                <line x1="140" y1="76" x2="228" y2="132"
                  stroke="rgba(255,255,255,0.06)" strokeWidth="1"
                  strokeDasharray="3 4" className={r("netLineE")} />

                {/* ── Partner nodes (top) ── */}
                {/* RoboForex */}
                <rect x="28" y="16" width="84" height="28" rx="14"
                  fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.10)" strokeWidth="1" />
                <text x="70" y="33" textAnchor="middle" className={r("partnerLabel")}>
                  RoboForex
                </text>
                <circle cx="106" cy="30" r="3" fill="rgba(196,166,80,0.55)" className={r("partnerDot")} />

                {/* Vantage */}
                <rect x="168" y="16" width="84" height="28" rx="14"
                  fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.10)" strokeWidth="1" />
                <text x="210" y="33" textAnchor="middle" className={r("partnerLabel")}>
                  Vantage
                </text>
                <circle cx="246" cy="30" r="3" fill="rgba(196,166,80,0.55)" className={r("partnerDotB")} />

                {/* ── Central compliance hub ── */}
                {/* Ambient glow */}
                <circle cx="140" cy="76" r="36" fill="url(#rs_hubGrad)" />
                {/* Outer ring */}
                <circle cx="140" cy="76" r="20"
                  stroke="rgba(196,166,80,0.18)" strokeWidth="1"
                  fill="rgba(196,166,80,0.03)" />
                {/* Mid ring */}
                <circle cx="140" cy="76" r="13"
                  stroke="rgba(255,255,255,0.07)" strokeWidth="1"
                  fill="rgba(255,255,255,0.02)" />
                {/* Core dot (pulsing) */}
                <circle cx="140" cy="76" r="5.5"
                  fill="url(#rs_hubInner)" className={r("netHub")} />
                {/* Checkmark inside hub */}
                <path d="M135 76l3.5 3.5 6.5-6.5"
                  stroke="rgba(255,255,255,0.60)" strokeWidth="1.4"
                  strokeLinecap="round" strokeLinejoin="round" />

                {/* ── Regulator nodes (bottom) ── */}
                {/* FCA */}
                <circle cx="52" cy="132" r="18"
                  fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.09)" strokeWidth="1" />
                <text x="52" y="130" textAnchor="middle" className={r("regLabel")}>FCA</text>
                <text x="52" y="141" textAnchor="middle" className={r("regSub")}>regulated</text>

                {/* CySEC */}
                <circle cx="140" cy="138" r="18"
                  fill="rgba(255,255,255,0.03)" stroke="rgba(196,166,80,0.15)" strokeWidth="1" />
                <text x="140" y="136" textAnchor="middle" className={r("regLabel")}>CySEC</text>
                <text x="140" y="147" textAnchor="middle" className={r("regSub")}>regulated</text>

                {/* FSC */}
                <circle cx="228" cy="132" r="18"
                  fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.09)" strokeWidth="1" />
                <text x="228" y="130" textAnchor="middle" className={r("regLabel")}>FSC</text>
                <text x="228" y="141" textAnchor="middle" className={r("regSub")}>regulated</text>
              </svg>
            </div>
          </div>

          {/* ── Box 4: Investor protection — shield center, cards around ── */}
          <div className={`${r("box")} ${r("boxSafe")}`}>
            <div className={r("boxHead")}>
              <span className={r("boxIco")}><IcShield /></span>
              <span className={r("boxTitle")}>{copy.b4title}</span>
            </div>

            {/*
              3-column grid layout:
              [card 1] | [shield zone] | [card 2]
              [card 3] | [shield zone] | [card 4]
            */}
            <div className={r("sgLayout")}>
              {/* Card 1 — top left */}
              <div className={`${r("sgCard")} ${r("sgCard1")}`}>
                <span className={r("sgTitle")}>{copy.safeguards[0]!.title}</span>
                <span className={r("sgBody")}>{copy.safeguards[0]!.body}</span>
              </div>

              {/* Central shield — spans both rows */}
              <div className={r("shieldZone")}>
                <div className={r("orbitRingLg")}>
                  <div className={r("orbitDot")} style={{ top: "1%",  left: "50%" }} />
                  <div className={r("orbitDot")} style={{ top: "50%", left: "99%" }} />
                  <div className={r("orbitDot")} style={{ top: "99%", left: "50%" }} />
                  <div className={r("orbitDot")} style={{ top: "50%", left: "1%"  }} />
                </div>
                <div className={r("orbitRingSm")} />
                <div className={r("shieldCore")}><IcShieldLg /></div>
              </div>

              {/* Card 2 — top right */}
              <div className={`${r("sgCard")} ${r("sgCard2")}`}>
                <span className={r("sgTitle")}>{copy.safeguards[1]!.title}</span>
                <span className={r("sgBody")}>{copy.safeguards[1]!.body}</span>
              </div>

              {/* Card 3 — bottom left */}
              <div className={`${r("sgCard")} ${r("sgCard3")}`}>
                <span className={r("sgTitle")}>{copy.safeguards[2]!.title}</span>
                <span className={r("sgBody")}>{copy.safeguards[2]!.body}</span>
              </div>

              {/* Card 4 — bottom right */}
              <div className={`${r("sgCard")} ${r("sgCard4")}`}>
                <span className={r("sgTitle")}>{copy.safeguards[3]!.title}</span>
                <span className={r("sgBody")}>{copy.safeguards[3]!.body}</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
