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
/** Subtle intermediate gridlines between major Y ticks */
const BT_Y_MINOR = [1250, 3750, 6250, 8750];
const BT_X_IDXS  = [0, 10, 20, 30, 40, 50, 56];
const BT_X_LBLS  = ["1970", "1980", "1990", "2000", "2010", "2020", "2026"];

function btYPos(v: number): number {
  return BT_PT + BT_uH - (Math.max(0, v) / BT_MAX) * BT_uH;
}

function btXFromIdx(idx: number): number {
  return BT_PL + (idx / (BT_N - 1)) * BT_uW;
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

// ── Risk engine radar (Box 2) — layered radar / signal visual ─────────────────
// Normalized radii (0–1) derived from published metrics for a coherent footprint.
const RK_CX = 110;
const RK_CY = 110;
const RK_R  = 74;
const RK_ANGLES = [-Math.PI / 2, 0, Math.PI / 2, Math.PI] as const;
/** Sharpe, Calmar, profit factor, win rate — visual mapping, not a second data table */
const RK_NORM = [0.80, 0.54, 0.66, 0.58] as const;

function rkPt(i: number, norm: number): { x: number; y: number } {
  const a = RK_ANGLES[i]!;
  return {
    x: RK_CX + RK_R * norm * Math.cos(a),
    y: RK_CY + RK_R * norm * Math.sin(a),
  };
}

const RK_POLY_PTS = RK_NORM.map((n, i) => rkPt(i, n));
const RK_POLY_D = (() => {
  const p0 = RK_POLY_PTS[0]!;
  let d = `M${p0.x.toFixed(2)},${p0.y.toFixed(2)}`;
  for (let i = 1; i < RK_POLY_PTS.length; i++) {
    const p = RK_POLY_PTS[i]!;
    d += ` L${p.x.toFixed(2)},${p.y.toFixed(2)}`;
  }
  return `${d} Z`;
})();

const RK_RING_LEVELS = [0.28, 0.46, 0.64, 0.82, 1];
const RK_SPOKE_N = 12;
const RK_SPOKES: { x2: number; y2: number; faint: boolean }[] = Array.from(
  { length: RK_SPOKE_N },
  (_, i) => {
    const a = -Math.PI / 2 + (i / RK_SPOKE_N) * 2 * Math.PI;
    return {
      x2: RK_CX + RK_R * 1.06 * Math.cos(a),
      y2: RK_CY + RK_R * 1.06 * Math.sin(a),
      faint: i % 3 !== 0,
    };
  },
);

const RK_SWEEP_R = RK_R + 5;
const RK_SWEEP_A0 = -Math.PI / 2;
const RK_SWEEP_A1 = RK_SWEEP_A0 + (26 * Math.PI) / 180;
const RK_SWEEP_D = (() => {
  const x0 = RK_CX + RK_SWEEP_R * Math.cos(RK_SWEEP_A0);
  const y0 = RK_CY + RK_SWEEP_R * Math.sin(RK_SWEEP_A0);
  const x1 = RK_CX + RK_SWEEP_R * Math.cos(RK_SWEEP_A1);
  const y1 = RK_CY + RK_SWEEP_R * Math.sin(RK_SWEEP_A1);
  return `M${RK_CX},${RK_CY} L${x0.toFixed(2)},${y0.toFixed(2)} A${RK_SWEEP_R},${RK_SWEEP_R} 0 0 1 ${x1.toFixed(2)},${y1.toFixed(2)} Z`;
})();

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

/** Classical institutional façade — Box 3 header */
function IcInstitution(): ReactNode {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 2.5l8.5 4.2v1.6H3.5V6.7L12 2.5z"
        stroke="currentColor"
        strokeWidth="1.35"
        strokeLinejoin="round"
      />
      <path d="M5.5 11h2.3v8H5.5v-8zm5.1 0h2.3v8h-2.3v-8zm5.2 0H18v8h-2.2v-8z" fill="currentColor" opacity="0.34" />
      <path
        d="M4.5 8.2h15"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
      />
      <path
        d="M3.5 19.5h17"
        stroke="currentColor"
        strokeWidth="1.35"
        strokeLinecap="round"
      />
      <path
        d="M12 4.8v2.4"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        opacity="0.45"
      />
    </svg>
  );
}

/** Hero-scale shield glyph — Investor Protection centerpiece */
function IcShieldLg(): ReactNode {
  return (
    <svg
      width="96"
      height="111"
      viewBox="0 0 52 60"
      fill="none"
      aria-hidden
    >
      <defs>
        <linearGradient id="ip_sg_outer" x1="10" y1="4" x2="42" y2="56" gradientUnits="userSpaceOnUse">
          <stop stopColor="rgba(255,253,248,0.62)" />
          <stop offset="0.45" stopColor="rgba(232,222,198,0.42)" />
          <stop offset="1" stopColor="rgba(210,198,170,0.38)" />
        </linearGradient>
        <linearGradient id="ip_sg_inner" x1="26" y1="14" x2="26" y2="52" gradientUnits="userSpaceOnUse">
          <stop stopColor="rgba(255,255,255,0.08)" />
          <stop offset="1" stopColor="rgba(255,250,242,0.03)" />
        </linearGradient>
        <filter id="ip_sg_glow" x="-35%" y="-35%" width="170%" height="170%">
          <feGaussianBlur stdDeviation="1.4" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      {/* Soft outer glow stroke */}
      <path
        d="M26 2L4 10v16c0 16.8 11.8 32.5 22 36.9C36.2 58.5 48 42.8 48 26V10L26 2z"
        stroke="url(#ip_sg_outer)"
        strokeWidth="2.05"
        fill="rgba(255,253,246,0.04)"
        opacity="0.95"
      />
      <path
        d="M26 2L4 10v16c0 16.8 11.8 32.5 22 36.9C36.2 58.5 48 42.8 48 26V10L26 2z"
        stroke="rgba(255,253,248,0.14)"
        strokeWidth="1.35"
        fill="url(#ip_sg_inner)"
        filter="url(#ip_sg_glow)"
      />
      <path
        d="M26 13L14 19v9c0 10.5 7.4 20.3 12 22.8 4.6-2.5 12-12.3 12-22.8V19L26 13z"
        stroke="rgba(255,253,246,0.16)"
        strokeWidth="1.05"
        fill="rgba(255,255,255,0.025)"
      />
      <path
        d="M19 30l5 5 9-9"
        stroke="rgba(248,242,228,0.72)"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
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
                    <stop offset="0%"   stopColor="rgba(248,245,236,0.55)" />
                    <stop offset="42%" stopColor="rgba(232,223,198,0.92)" />
                    <stop offset="100%" stopColor="rgba(210,198,165,0.78)" />
                  </linearGradient>
                  <linearGradient id="rs_ag" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%"   stopColor="rgba(245,240,228,0.14)" />
                    <stop offset="55%" stopColor="rgba(232,224,200,0.05)" />
                    <stop offset="100%" stopColor="rgba(220,210,185,0)" />
                  </linearGradient>
                  <filter id="rs_lineGlow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="1.15" result="b" />
                    <feMerge>
                      <feMergeNode in="b" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                {/* Vertical decade guides */}
                {BT_X_IDXS.map((idx) => (
                  <line
                    key={`vx-${idx}`}
                    x1={btXFromIdx(idx)}
                    y1={BT_PT}
                    x2={btXFromIdx(idx)}
                    y2={BT_PT + BT_uH}
                    className={r("cGridVert")}
                  />
                ))}

                {/* Fine horizontal minor grid */}
                {BT_Y_MINOR.map((v) => (
                  <line
                    key={`ym-${v}`}
                    x1={BT_PL}
                    y1={btYPos(v)}
                    x2={CW - BT_PR}
                    y2={btYPos(v)}
                    className={r("cGridMinor")}
                  />
                ))}

                {/* Major horizontal grid + Y labels */}
                {BT_Y_TICKS.map((v) => (
                  <g key={v}>
                    <line
                      x1={BT_PL}
                      y1={btYPos(v)}
                      x2={CW - BT_PR}
                      y2={btYPos(v)}
                      className={r("cGrid")}
                    />
                    <text
                      x={BT_PL - 5}
                      y={btYPos(v) + 4}
                      className={r("cYLbl")}
                      textAnchor="end"
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

                {/* Fill + equity line */}
                <path d={BT_AREA} fill="url(#rs_ag)" />
                <path d={BT_LINE} className={r("cLineUnder")} />
                <path d={BT_LINE} className={r("cLine")} filter="url(#rs_lineGlow)" />

                {/* Endpoint — soft champagne highlight */}
                <circle cx={BT_LX.toFixed(1)} cy={BT_LY.toFixed(1)} r="11" className={r("cEndHalo")} />
                <circle cx={BT_LX.toFixed(1)} cy={BT_LY.toFixed(1)} r="7" className={r("cEndGlow")} />
                <circle cx={BT_LX.toFixed(1)} cy={BT_LY.toFixed(1)} r="2.2" fill="rgba(252,249,242,0.95)" />
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

            <div className={r("riskEngineWrap")}>
              <svg viewBox="0 0 220 220" fill="none" className={r("riskEngineSvg")} aria-hidden>
                <defs>
                  <radialGradient id="rs_rk_bg" cx="50%" cy="42%" r="68%">
                    <stop offset="0%" stopColor="rgba(252,248,238,0.07)" />
                    <stop offset="55%" stopColor="rgba(28,26,22,0.12)" />
                    <stop offset="100%" stopColor="rgba(8,8,8,0.35)" />
                  </radialGradient>
                  <linearGradient id="rs_rk_sweep" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="rgba(252,246,232,0.55)" />
                    <stop offset="100%" stopColor="rgba(252,246,232,0)" />
                  </linearGradient>
                  <linearGradient id="rs_rk_polyStroke" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="rgba(255,253,248,0.55)" />
                    <stop offset="100%" stopColor="rgba(218,208,180,0.45)" />
                  </linearGradient>
                  <filter id="rs_rk_sigBlur" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="1.8" />
                  </filter>
                </defs>

                <rect x="0" y="0" width="220" height="220" fill="url(#rs_rk_bg)" rx="14" />

                {/* Concentric risk rings */}
                {RK_RING_LEVELS.map((lv) => (
                  <circle
                    key={lv}
                    cx={RK_CX}
                    cy={RK_CY}
                    r={RK_R * lv}
                    className={lv >= 0.95 ? r("rkRingOuter") : r("rkRing")}
                  />
                ))}

                {/* Radial spokes */}
                {RK_SPOKES.map((s, i) => (
                  <line
                    key={i}
                    x1={RK_CX}
                    y1={RK_CY}
                    x2={s.x2}
                    y2={s.y2}
                    className={s.faint ? r("rkSpokeFaint") : r("rkSpoke")}
                  />
                ))}

                {/* Counter-rotating fine scale */}
                <g className={r("rkRotateSlow")}>
                  <circle
                    cx={RK_CX}
                    cy={RK_CY}
                    r={RK_R + 11}
                    className={r("rkTickOrbit")}
                    strokeDasharray="1.5 7"
                  />
                </g>

                {/* Co-rotating dashed signal ring */}
                <g className={r("rkRotateRev")}>
                  <circle
                    cx={RK_CX}
                    cy={RK_CY}
                    r={RK_R + 5}
                    className={r("rkSignalRing")}
                    strokeDasharray="4 10"
                  />
                </g>

                {/* Radar sweep */}
                <g className={r("rkSweep")}>
                  <path d={RK_SWEEP_D} fill="url(#rs_rk_sweep)" opacity={0.2} />
                  <line
                    x1={RK_CX}
                    y1={RK_CY}
                    x2={RK_CX + RK_SWEEP_R * Math.cos(RK_SWEEP_A0)}
                    y2={RK_CY + RK_SWEEP_R * Math.sin(RK_SWEEP_A0)}
                    className={r("rkSweepLine")}
                  />
                </g>

                {/* Metric footprint — derived shape mirrors headline KPIs below */}
                <path d={RK_POLY_D} className={r("rkPolyFill")} />
                <path d={RK_POLY_D} className={r("rkPolyLine")} stroke="url(#rs_rk_polyStroke)" />

                {/* Axis signal nodes */}
                {RK_POLY_PTS.map((p, i) => (
                  <g key={i}>
                    <circle
                      cx={p.x}
                      cy={p.y}
                      r="10"
                      className={r("rkNodePulse")}
                      filter="url(#rs_rk_sigBlur)"
                      style={{ animationDelay: `${i * 0.85}s` }}
                    />
                    <circle cx={p.x} cy={p.y} r="3.2" className={r("rkNode")} />
                    <circle cx={p.x} cy={p.y} r="1.2" fill="rgba(255,255,255,0.9)" />
                  </g>
                ))}

                {/* Center readout */}
                <circle cx={RK_CX} cy={RK_CY} r="31" className={r("rkCoreRing")} />
                <circle cx={RK_CX} cy={RK_CY} r="24" className={r("rkCoreInner")} />
                <text x={RK_CX} y={RK_CY - 6} textAnchor="middle" className={r("ringCenter1")}>
                  {copy.b2center1}
                </text>
                <text x={RK_CX} y={RK_CY + 10} textAnchor="middle" className={r("ringCenter2")}>
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

          {/* ── Box 3: Regulated partners ── */}
          <div className={`${r("box")} ${r("boxReg")}`}>
            <div className={r("boxHead")}>
              <span className={r("boxIco")}><IcInstitution /></span>
              <span className={r("boxTitle")}>{copy.b3title}</span>
            </div>

            <p className={r("regDesc")}>{copy.b3desc}</p>

            <div className={r("regCanvas")}>
              <svg
                viewBox="0 0 340 224"
                fill="none"
                className={r("regSvg")}
                role="img"
                aria-label={
                  lang === "de"
                    ? "Regulierte Broker-Logos und Verbindung zu FCA, CySEC und FSC"
                    : "Broker logos and links to FCA, CySEC, and FSC"
                }
              >
                <defs>
                  <radialGradient id="rs_reg_hubGlow" cx="50%" cy="42%" r="58%">
                    <stop offset="0%" stopColor="rgba(252,246,232,0.16)" />
                    <stop offset="100%" stopColor="rgba(252,246,232,0)" />
                  </radialGradient>
                  <radialGradient id="rs_reg_hubCore" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="rgba(250,244,230,0.95)" />
                    <stop offset="100%" stopColor="rgba(215,204,176,0.42)" />
                  </radialGradient>
                  <linearGradient id="rs_reg_ln" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="rgba(255,253,246,0.2)" />
                    <stop offset="100%" stopColor="rgba(228,218,196,0.07)" />
                  </linearGradient>
                  <filter id="rs_reg_nodeBlur">
                    <feGaussianBlur stdDeviation="1.4" />
                  </filter>
                </defs>

                {/* Depth panel */}
                <rect
                  x="16"
                  y="54"
                  width="308"
                  height="116"
                  rx="16"
                  className={r("regDepthPanel")}
                />

                {/* Links: hub (170, 114) ↔ partners & regulators */}
                <line
                  x1="170"
                  y1="114"
                  x2="82"
                  y2="46"
                  stroke="url(#rs_reg_ln)"
                  strokeWidth="1"
                  strokeDasharray="3 5"
                  className={r("regFlowA")}
                />
                <line
                  x1="170"
                  y1="114"
                  x2="258"
                  y2="46"
                  stroke="url(#rs_reg_ln)"
                  strokeWidth="1"
                  strokeDasharray="3 5"
                  className={r("regFlowB")}
                />
                <line
                  x1="170"
                  y1="114"
                  x2="68"
                  y2="174"
                  stroke="url(#rs_reg_ln)"
                  strokeWidth="0.9"
                  strokeDasharray="3 5"
                  opacity={0.88}
                  className={r("regFlowC")}
                />
                <line
                  x1="170"
                  y1="114"
                  x2="170"
                  y2="178"
                  stroke="url(#rs_reg_ln)"
                  strokeWidth="0.9"
                  strokeDasharray="3 5"
                  opacity={0.88}
                  className={r("regFlowD")}
                />
                <line
                  x1="170"
                  y1="114"
                  x2="272"
                  y2="174"
                  stroke="url(#rs_reg_ln)"
                  strokeWidth="0.9"
                  strokeDasharray="3 5"
                  opacity={0.88}
                  className={r("regFlowE")}
                />

                {/* Logo plates + PNG marks (same assets as Hero) */}
                <rect x="28" y="16" width="108" height="42" rx="11" className={r("regLogoPlate")} />
                <rect x="204" y="16" width="108" height="42" rx="11" className={r("regLogoPlate")} />
                <image
                  href="/Roboforex.png"
                  x="38"
                  y="23"
                  width="88"
                  height="28"
                  preserveAspectRatio="xMidYMid meet"
                  className={r("regLogoImg")}
                />
                <image
                  href="/Vantage.png"
                  x="214"
                  y="23"
                  width="88"
                  height="28"
                  preserveAspectRatio="xMidYMid meet"
                  className={r("regLogoImg")}
                />

                {/* Partner nodes: dot + pulsing rings */}
                <g>
                  <circle cx="82" cy="44" r="15" className={r("regPartnerRingOuter")} />
                  <circle cx="82" cy="44" r="9" className={r("regPartnerRingGlow")} filter="url(#rs_reg_nodeBlur)" />
                  <circle cx="82" cy="44" r="3.2" className={r("regPartnerDot")} />
                </g>
                <g className={r("regPartnerLate")}>
                  <circle cx="258" cy="44" r="15" className={r("regPartnerRingOuter")} />
                  <circle cx="258" cy="44" r="9" className={r("regPartnerRingGlow")} filter="url(#rs_reg_nodeBlur)" />
                  <circle cx="258" cy="44" r="3.2" className={r("regPartnerDot")} />
                </g>

                {/* Compliance hub */}
                <circle cx="170" cy="114" r="46" fill="url(#rs_reg_hubGlow)" />
                <circle cx="170" cy="114" r="22" className={r("regHubDisk")} />
                <circle cx="170" cy="114" r="14.5" className={r("regHubDiskInner")} />
                <circle cx="170" cy="114" r="6.5" fill="url(#rs_reg_hubCore)" className={r("regHubCore")} />
                <path
                  d="M164.5 114l3 3 8.5-8.5"
                  stroke="rgba(42,40,36,0.42)"
                  strokeWidth="1.35"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Regulators — inset from edges, compact labels */}
                <circle cx="68" cy="182" r="19.5" className={r("regSeal")} />
                <text x="68" y="178.5" textAnchor="middle" className={r("regSealLbl")}>
                  FCA
                </text>
                <text x="68" y="187.5" textAnchor="middle" className={r("regSealSub")}>
                  regulated
                </text>

                <circle cx="170" cy="182" r="19.5" className={r("regSeal")} />
                <text x="170" y="178.5" textAnchor="middle" className={r("regSealLbl")}>
                  CySEC
                </text>
                <text x="170" y="187.5" textAnchor="middle" className={r("regSealSub")}>
                  regulated
                </text>

                <circle cx="272" cy="182" r="19.5" className={r("regSeal")} />
                <text x="272" y="178.5" textAnchor="middle" className={r("regSealLbl")}>
                  FSC
                </text>
                <text x="272" y="187.5" textAnchor="middle" className={r("regSealSub")}>
                  regulated
                </text>
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
                <div className={r("shieldHalo")} aria-hidden />
                <div className={r("orbitSpinXL")} aria-hidden>
                  <div className={r("orbitRingXL")} />
                </div>
                <div className={r("orbitSpinLg")}>
                  <div className={r("orbitRingLg")}>
                    <div className={r("orbitDot")} style={{ top: "1%", left: "50%" }} />
                    <div className={r("orbitDot")} style={{ top: "50%", left: "99%" }} />
                    <div className={r("orbitDot")} style={{ top: "99%", left: "50%" }} />
                    <div className={r("orbitDot")} style={{ top: "50%", left: "1%" }} />
                  </div>
                </div>
                <div className={r("orbitSpinMd")} aria-hidden>
                  <div className={r("orbitRingMd")} />
                </div>
                <div className={r("orbitSpinSm")} aria-hidden>
                  <div className={r("orbitRingSm")} />
                </div>
                <div className={r("shieldCore")}>
                  <IcShieldLg />
                </div>
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
