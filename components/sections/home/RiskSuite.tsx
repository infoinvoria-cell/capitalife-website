"use client";

import type { ReactNode } from "react";

import { useLanguage, type Lang } from "@/lib/i18n/language";
import raw from "./RiskSuite.module.css";

function r(name: string): string {
  return (raw as Record<string, string>)[name] ?? "";
}

// ── Backtesting curve (1970–2026, cumulative return %) ─────────────────────────
// 57 data points: index 0 = 1970, index 56 = 2026.
// Do not recalculate from raw annual returns — use these directly.
const BACKTEST_RAW = [
  -3.43, -5.60, -0.50, 2.10, 3.81, -6.00, -2.58, -0.03, 1.29, 1.13,
  11.37, 5.15, 6.28, 5.87, 6.58, 14.48, 9.24, 9.09, 13.04, 15.67,
  15.06, 11.99, 22.66, 30.93, 38.83, 57.83, 68.32, 89.43, 96.32, 124.12,
  141.52, 143.01, 182.72, 231.83, 219.59, 235.09, 333.80, 403.30, 340.69, 494.40,
  664.40, 802.52, 846.66, 1086.06, 1304.66, 1397.36, 1710.31, 2130.85, 2271.17, 3181.22,
  4026.79, 5156.30, 5597.30, 7057.52, 8929.21, 11488.99, 11564.32,
];
const BT_N = BACKTEST_RAW.length; // 57

// ── Chart geometry ────────────────────────────────────────────────────────────
const CW = 560, CH = 148;
const BT_PL = 52, BT_PR = 18, BT_PT = 8, BT_PB = 22;
const BT_uW = CW - BT_PL - BT_PR;
const BT_uH = CH - BT_PT - BT_PB;
const BT_MAX = 12000;

const BT_Y_TICKS   = [0, 2500, 5000, 7500, 10000];
const BT_X_IDXS    = [0, 10, 20, 30, 40, 50, 56];
const BT_X_LBLS    = ["1970", "1980", "1990", "2000", "2010", "2020", "2026"];

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

// ── Ring chart (Box 2) ────────────────────────────────────────────────────────
// Update MAX_DD and GAUGE_RANGE to shift the fill.
const MAX_DD      = 20.91;
const GAUGE_RANGE = 30;
const RING_CX     = 100;
const RING_CY     = 100;
const RING_R      = 80;
const RING_CIRC   = +(2 * Math.PI * RING_R).toFixed(1);                     // ≈ 502.7
const RING_FILL   = MAX_DD / GAUGE_RANGE;                                    // ≈ 0.697
const RING_DASH   = +(RING_CIRC * RING_FILL).toFixed(1);                     // ≈ 350.4
const RING_END_A  = -Math.PI / 2 + RING_FILL * 2 * Math.PI;
const RING_EX     = +(RING_CX + RING_R * Math.cos(RING_END_A)).toFixed(1);  // ≈ 24.7
const RING_EY     = +(RING_CY + RING_R * Math.sin(RING_END_A)).toFixed(1);  // ≈ 127.1

// Tachometer ticks — just outside the ring track (ring outer edge ≈ R+7=87)
const RTICK_N = 24;
const RTICK_I = 88; // inner tick radius
const RTICK_O = 94; // outer tick radius

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

// ── Compliance data ───────────────────────────────────────────────────────────
const COMPLIANCE_DATA = [
  { reg: "FCA",   full: "Financial Conduct Authority"   },
  { reg: "CySEC", full: "Cyprus Securities Commission"  },
  { reg: "FSC",   full: "Financial Services Commission" },
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
// Large shield for Box 4
function IcShieldLg() {
  return (
    <svg width="48" height="56" viewBox="0 0 52 60" fill="none" aria-hidden>
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
type StatItem  = { lbl: string; val: string };
type Benefit   = { title: string; body: string };
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
  b2gaugeLabel: string;
  b2stats: StatItem[];
  // Box 3
  b3title: string;
  b3desc: string;
  b3compStatus: string;
  b3benefits: Benefit[];
  // Box 4
  b4title: string;
  safeguards: Safeguard[];
};

const COPY: Record<Lang, Copy> = {
  en: {
    badge: "Capitalife Control System",
    h1:    "Risk transparency.",
    h2:    "Capital under control.",
    sub:   "Historical performance data, transparent risk metrics and clear safeguards provide full visibility while investors retain full control over their capital.",
    // Box 1
    b1title:     "Historical Strategy & Performance",
    b1backtest:  "Backtesting since 1970",
    b1kpis: [
      { value: "+11,564%", label: "Cumulative"       },
      { value: "1970",     label: "Backtested since" },
      { value: "2024",     label: "Live since"        },
      { value: "–20.91%",  label: "Max drawdown"      },
    ],
    b1disclaimer: "Historical strategy data shown for informational purposes.",
    // Box 2
    b2title:      "Strategy Risk Overview",
    b2gaugeLabel: "Max drawdown",
    b2stats: [
      { lbl: "Sharpe",        val: "1.63"  },
      { lbl: "Calmar",        val: "0.43"  },
      { lbl: "Profit factor", val: "1.24"  },
      { lbl: "Win rate",      val: "42.9%" },
    ],
    // Box 3
    b3title:      "Regulated Partners",
    b3desc:       "Partner infrastructure in regulated environments.",
    b3compStatus: "Verified",
    b3benefits: [
      { title: "Regulated & monitored",  body: "Supervised by leading authorities."    },
      { title: "High standards",         body: "Institutional-grade compliance."        },
      { title: "Secure infrastructure",  body: "Protection for capital and data."       },
    ],
    // Box 4
    b4title: "Investor Protection",
    safeguards: [
      { title: "Client-owned accounts",  body: "Capital remains in the client's broker accounts."           },
      { title: "No hidden fees",         body: "No additional investor fees for partner payouts."            },
      { title: "Live monitoring",        body: "Ongoing visibility into portfolio and strategy development." },
      { title: "Clear reporting",        body: "Transparent monthly performance and risk reporting."         },
    ],
  },
  de: {
    badge: "Capitalife Kontrollsystem",
    h1:    "Risikotransparenz.",
    h2:    "Kapital unter Kontrolle.",
    sub:   "Historische Performancedaten, transparente Risikokennzahlen und klare Schutzmechanismen schaffen volle Transparenz – bei durchgehender Kontrolle über das eigene Kapital.",
    // Box 1
    b1title:     "Historische Strategie & Performance",
    b1backtest:  "Backtesting seit 1970",
    b1kpis: [
      { value: "+11.564%", label: "Kumuliert"        },
      { value: "1970",     label: "Backtesting seit"  },
      { value: "2024",     label: "Live seit"          },
      { value: "–20,91%",  label: "Max. Drawdown"      },
    ],
    b1disclaimer: "Historische Strategiedaten zu Informationszwecken dargestellt.",
    // Box 2
    b2title:      "Strategie Risikoübersicht",
    b2gaugeLabel: "Max. Drawdown",
    b2stats: [
      { lbl: "Sharpe",        val: "1.63"  },
      { lbl: "Calmar",        val: "0,43"  },
      { lbl: "Profit Factor", val: "1,24"  },
      { lbl: "Trefferquote",  val: "42,9%" },
    ],
    // Box 3
    b3title:      "Regulierte Partner",
    b3desc:       "Partnerinfrastruktur in regulierten Umgebungen.",
    b3compStatus: "Verifiziert",
    b3benefits: [
      { title: "Reguliert & überwacht",  body: "Durch führende Behörden."               },
      { title: "Hohe Standards",         body: "Compliance auf institutionellem Niveau." },
      { title: "Sichere Infrastruktur",  body: "Schutz für Kapital und Daten."           },
    ],
    // Box 4
    b4title: "Investorenschutz",
    safeguards: [
      { title: "Eigene Broker-Konten",         body: "Kapital verbleibt in den Broker-Konten der Kunden."              },
      { title: "Keine versteckten Gebühren",    body: "Keine zusätzlichen Investorengebühren für Partnerauszahlungen." },
      { title: "Live-Überwachung",              body: "Laufende Einsicht in Portfolio- und Strategieentwicklung."      },
      { title: "Klare Berichte",                body: "Transparente monatliche Performance- und Risikoübersichten."    },
    ],
  },
};

// ── Component ─────────────────────────────────────────────────────────────────
export default function RiskSuite() {
  const { lang } = useLanguage();
  const copy     = COPY[lang];

  return (
    <section className={r("section")} id="risk-suite">
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

        {/* ── 5-col asymmetric grid ── */}
        <div className={r("grid")}>

          {/* ── Box 1  top-left LARGE: Backtesting chart ── */}
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
                    <stop offset="0%"   stopColor="#7a6030" />
                    <stop offset="50%"  stopColor="#e8ddb8" />
                    <stop offset="100%" stopColor="#a88c48" />
                  </linearGradient>
                  <linearGradient id="rs_ag" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%"   stopColor="#c8a840" stopOpacity="0.16" />
                    <stop offset="70%"  stopColor="#c8a840" stopOpacity="0.03" />
                    <stop offset="100%" stopColor="#c8a840" stopOpacity="0" />
                  </linearGradient>
                </defs>

                {/* Horizontal grid lines */}
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

                {/* Area fill + line */}
                <path d={BT_AREA} fill="url(#rs_ag)" />
                <path d={BT_LINE} className={r("cLine")} />

                {/* Endpoint dot */}
                <circle cx={BT_LX.toFixed(1)} cy={BT_LY.toFixed(1)} r="5.5" fill="rgba(232,220,184,0.18)" />
                <circle cx={BT_LX.toFixed(1)} cy={BT_LY.toFixed(1)} r="2.8" fill="#e8ddb8" />
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

          {/* ── Box 2  top-right SMALL: Risk ring + 4 stats ── */}
          <div className={`${r("box")} ${r("boxRisk")}`}>
            <div className={r("boxHead")}>
              <span className={r("boxIco")}><IcShield /></span>
              <span className={r("boxTitle")}>{copy.b2title}</span>
            </div>

            {/* Technical ring visual */}
            <div className={r("ringWrap")}>
              <svg viewBox="0 0 200 200" fill="none" className={r("ringSvg")}>
                <defs>
                  <linearGradient id="rs_rg" x1="0" y1="1" x2="1" y2="0">
                    <stop offset="0%"   stopColor="#2a1a04" />
                    <stop offset="50%"  stopColor="#9a7030" />
                    <stop offset="100%" stopColor="#e2d8b0" />
                  </linearGradient>
                  <radialGradient id="rs_rdot" cx="50%" cy="50%" r="50%">
                    <stop offset="0%"   stopColor="#e2d8b0" stopOpacity="0.5" />
                    <stop offset="100%" stopColor="#e2d8b0" stopOpacity="0" />
                  </radialGradient>
                  <filter id="rs_rglow">
                    <feGaussianBlur stdDeviation="4" result="blur" />
                    <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                  </filter>
                </defs>

                {/* Outer ambient glow ring (pulsing) */}
                <circle cx={RING_CX} cy={RING_CY} r={RING_R + 15}
                  stroke="rgba(200,168,64,0.05)" strokeWidth="1"
                  className={r("ringGlow")}
                />

                {/* Tachometer tick marks */}
                {RING_TICKS.map((t, i) => (
                  <line
                    key={i}
                    x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2}
                    stroke={t.major ? "rgba(255,255,255,0.18)" : "rgba(255,255,255,0.07)"}
                    strokeWidth={t.major ? "1.5" : "1"}
                  />
                ))}

                {/* Track */}
                <circle cx={RING_CX} cy={RING_CY} r={RING_R}
                  stroke="rgba(255,255,255,0.06)" strokeWidth="13"
                />
                {/* Active arc — 12 o'clock start, clockwise */}
                <circle cx={RING_CX} cy={RING_CY} r={RING_R}
                  stroke="url(#rs_rg)"
                  strokeWidth="13"
                  strokeLinecap="round"
                  strokeDasharray={`${RING_DASH} ${RING_CIRC}`}
                  transform={`rotate(-90, ${RING_CX}, ${RING_CY})`}
                  filter="url(#rs_rglow)"
                />

                {/* Inner decorative ring */}
                <circle cx={RING_CX} cy={RING_CY} r={RING_R - 18}
                  stroke="rgba(255,255,255,0.04)" strokeWidth="1"
                />

                {/* Arc endpoint: glow halo + dot */}
                <circle cx={RING_EX} cy={RING_EY} r="14" fill="url(#rs_rdot)" />
                <circle cx={RING_EX} cy={RING_EY} r="4.5" fill="#e2d8b0" />
                <circle cx={RING_EX} cy={RING_EY} r="2" fill="rgba(255,255,255,0.88)" />

                {/* Center: value + label */}
                <text x={RING_CX} y={RING_CY - 7} textAnchor="middle" className={r("ringVal")}>
                  −{MAX_DD}%
                </text>
                <text x={RING_CX} y={RING_CY + 12} textAnchor="middle" className={r("ringLbl")}>
                  {copy.b2gaugeLabel}
                </text>
              </svg>
            </div>

            {/* 4 stats below ring */}
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

          {/* ── Box 3  bottom-left SMALL: Regulated partners ── */}
          <div className={`${r("box")} ${r("boxReg")}`}>
            <div className={r("boxHead")}>
              <span className={r("boxIco")}><IcPillar /></span>
              <span className={r("boxTitle")}>{copy.b3title}</span>
            </div>

            <p className={r("boxDesc")}>{copy.b3desc}</p>

            {/* 3 glass authority cards */}
            <div className={r("authGrid")}>
              {COMPLIANCE_DATA.map(({ reg, full }) => (
                <div key={reg} className={r("authCard")}>
                  <span className={r("authAcronym")}>{reg}</span>
                  <span className={r("authFull")}>{full}</span>
                  <div className={r("authStatus")}>
                    <IcCheck />
                    <span>{copy.b3compStatus}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Animated network hub below cards */}
            <div className={r("netWrap")}>
              <svg viewBox="0 0 200 48" fill="none" aria-hidden className={r("netSvg")}>
                {/* Lines from hub to outer nodes */}
                <line x1="62" y1="24" x2="96" y2="24" stroke="rgba(255,255,255,0.07)" strokeWidth="1" strokeDasharray="3 3" />
                <line x1="104" y1="24" x2="138" y2="24" stroke="rgba(255,255,255,0.07)" strokeWidth="1" strokeDasharray="3 3" />
                <line x1="100" y1="10" x2="100" y2="16" stroke="rgba(255,255,255,0.07)" strokeWidth="1" />

                {/* Left node */}
                <circle cx="50" cy="24" r="8" stroke="rgba(255,255,255,0.08)" strokeWidth="1" fill="rgba(255,255,255,0.02)" />
                <circle cx="50" cy="24" r="3" fill="rgba(255,255,255,0.22)" className={r("netNode")} />

                {/* Central hub */}
                <circle cx="100" cy="24" r="11" stroke="rgba(200,175,110,0.18)" strokeWidth="1" fill="rgba(200,175,110,0.05)" />
                <circle cx="100" cy="24" r="4.5" fill="rgba(200,175,110,0.5)" className={r("netHub")} />

                {/* Top satellite */}
                <circle cx="100" cy="6" r="4" stroke="rgba(255,255,255,0.08)" strokeWidth="1" fill="rgba(255,255,255,0.02)" />
                <circle cx="100" cy="6" r="2" fill="rgba(255,255,255,0.20)" className={r("netNodeB")} />

                {/* Right node */}
                <circle cx="150" cy="24" r="8" stroke="rgba(255,255,255,0.08)" strokeWidth="1" fill="rgba(255,255,255,0.02)" />
                <circle cx="150" cy="24" r="3" fill="rgba(255,255,255,0.22)" className={r("netNodeC")} />
              </svg>
            </div>

            {/* 3 benefit points — not a duplicate of the regulation list */}
            <div className={r("b3Benefits")}>
              {copy.b3benefits.map((b, i) => (
                <div key={i} className={r("b3Benefit")}>
                  <span className={r("b3BenTitle")}>{b.title}</span>
                  <span className={r("b3BenBody")}>{b.body}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── Box 4  bottom-right LARGE: Investor protection ── */}
          <div className={`${r("box")} ${r("boxSafe")}`}>
            <div className={r("boxHead")}>
              <span className={r("boxIco")}><IcShield /></span>
              <span className={r("boxTitle")}>{copy.b4title}</span>
            </div>

            {/* Shield with orbit rings */}
            <div className={r("shieldArea")}>
              {/* Outer orbit ring (rotating) */}
              <div className={r("orbitRingLg")}>
                <div className={r("orbitDot")} style={{ top: "1%",  left: "50%" }} />
                <div className={r("orbitDot")} style={{ top: "50%", left: "99%" }} />
                <div className={r("orbitDot")} style={{ top: "99%", left: "50%" }} />
                <div className={r("orbitDot")} style={{ top: "50%", left: "1%"  }} />
              </div>
              {/* Inner orbit ring (counter-rotating) */}
              <div className={r("orbitRingSm")} />
              {/* Central shield icon */}
              <div className={r("shieldCore")}>
                <IcShieldLg />
              </div>
            </div>

            {/* 2×2 safeguard cards */}
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
