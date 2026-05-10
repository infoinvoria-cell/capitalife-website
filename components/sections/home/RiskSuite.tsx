"use client";

import type { ReactNode } from "react";

import { useLanguage, type Lang } from "@/lib/i18n/language";
import raw from "./RiskSuite.module.css";

function r(name: string): string {
  return (raw as Record<string, string>)[name] ?? "";
}

// ── Illustrative model index (2010→2026): compounded-style series for chart visualization only ───
const BT_YEAR_START = 2010;
const BT_YEAR_END = 2026;
const BT_N = BT_YEAR_END - BT_YEAR_START + 1;

/** Synthetic index level (base 100 at start); not raw trade data. */
const BT_INDEX = (() => {
  const out: number[] = [];
  let v = 100;
  out.push(v);
  for (let i = 1; i < BT_N; i++) {
    const wave = 0.048 * Math.sin(i * 0.82) + 0.03 * Math.cos(i * 1.35);
    const drift = 0.1971 + wave * 0.065;
    const r = Math.min(0.38, Math.max(-0.16, drift));
    v *= 1 + r;
    out.push(v);
  }
  return out;
})();

const BT_CMIN = Math.min(...BT_INDEX);
const BT_CMAX = Math.max(...BT_INDEX);
const BT_PAD = Math.max((BT_CMAX - BT_CMIN) * 0.08, (BT_CMAX - BT_CMIN) * 0.02 + 8);
const BT_SCALE_MIN = BT_CMIN - BT_PAD;
const BT_SCALE_MAX = BT_CMAX + BT_PAD;

const BT_TICK_N = 5;
const BT_Y_TICKS = Array.from({ length: BT_TICK_N }, (_, i) => {
  const t = i / (BT_TICK_N - 1);
  return Math.round(BT_SCALE_MIN + t * (BT_SCALE_MAX - BT_SCALE_MIN));
});

const BT_Y_MINOR: number[] = [];
for (let i = 0; i < BT_Y_TICKS.length - 1; i++) {
  BT_Y_MINOR.push(Math.round((BT_Y_TICKS[i]! + BT_Y_TICKS[i + 1]!) / 2));
}

// ── Chart geometry ─────────────────────────────────────────────────────────────
const CW = 560,
  CH = 162;
const BT_PL = 54,
  BT_PR = 20,
  BT_PT = 10,
  BT_PB = 28;
const BT_uW = CW - BT_PL - BT_PR;
const BT_uH = CH - BT_PT - BT_PB;
const BT_X_IDXS = [0, 4, 8, 12, 16];
const BT_X_LBLS = ["2010", "2014", "2018", "2022", "2026"];

function btYPos(v: number): number {
  const span = BT_SCALE_MAX - BT_SCALE_MIN || 1;
  const t = (v - BT_SCALE_MIN) / span;
  return BT_PT + BT_uH - t * BT_uH;
}

function btXFromIdx(idx: number): number {
  return BT_PL + (idx / (BT_N - 1)) * BT_uW;
}

/** Y-axis: model index (no % — illustrative series). */
function btFmtY(v: number, lang: Lang): string {
  const sep = lang === "de" ? "." : ",";
  const rounded = Math.round(v);
  const body = Math.abs(rounded)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, sep);
  if (rounded === 0) return "0";
  return `${rounded < 0 ? "−" : ""}${body}`;
}

/** Segment-wise path through illustrative index series. */
function buildBtChart() {
  const pts = BT_INDEX.map((v, i) => ({
    x: BT_PL + (i / (BT_N - 1)) * BT_uW,
    y: btYPos(v),
  }));
  const p0 = pts[0]!;
  let line = `M${p0.x.toFixed(1)},${p0.y.toFixed(1)}`;
  for (let i = 1; i < pts.length; i++) {
    const p = pts[i]!;
    line += ` L${p.x.toFixed(1)},${p.y.toFixed(1)}`;
  }
  const last  = pts[pts.length - 1]!;
  const baseY = (BT_PT + BT_uH).toFixed(1);
  const area  = `${line} L${last.x.toFixed(1)},${baseY} L${BT_PL},${baseY} Z`;
  return { line, area, lastX: last.x, lastY: last.y };
}

const { line: BT_LINE, area: BT_AREA, lastX: BT_LX, lastY: BT_LY } = buildBtChart();

// ── Risk engine radar (Box 2) — layered radar / signal visual ─────────────────
const RK_CX = 170;
const RK_CY = 170;
const RK_R = 118;
const RK_ANGLES = [-Math.PI / 2, 0, Math.PI / 2, Math.PI] as const;
/** Visual footprint only — aligned loosely with risk KPI emphasis */
const RK_NORM = [0.88, 0.76, 0.82, 0.79] as const;

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

/** Classical bank / institution façade — Box 3 header */
function IcInstitution(): ReactNode {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M12 2L4 6h16L12 2z" stroke="currentColor" strokeWidth="1.35" strokeLinejoin="round" />
      <path d="M5 7.5h14" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity="0.45" />
      <path
        d="M6 8.5V20M10 8.5V20M14 8.5V20M18 8.5V20"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
      />
      <path d="M8 12h8M8 15.5h8" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.35" />
      <path d="M4 20.5h16" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" />
      <path d="M11 4.5h2v2h-2z" fill="currentColor" opacity="0.25" />
    </svg>
  );
}

/** Investor Protection — per-card icons */
function IcSgBroker(): ReactNode {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M4 10h16v10H4V10z" stroke="currentColor" strokeWidth="1.35" />
      <path d="M8 14h4M12 10V6l4-2 4 2v4" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IcSgFees(): ReactNode {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.35" />
      <path d="M8 15l8-8M9 9h4v4" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" />
    </svg>
  );
}

function IcSgVisibility(): ReactNode {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 7a7 7 0 0 1 7 5 7 7 0 0 1-14 0 7 7 0 0 1 7-5z"
        stroke="currentColor"
        strokeWidth="1.35"
      />
      <circle cx="12" cy="12" r="2.5" fill="currentColor" />
    </svg>
  );
}

function IcSgReport(): ReactNode {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M8 4h11v16H8V4z" stroke="currentColor" strokeWidth="1.35" />
      <path d="M8 8h11M8 12h7M8 16h9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

const SG_ICONS: ReactNode[] = [
  <IcSgBroker key="i0" />,
  <IcSgFees key="i1" />,
  <IcSgVisibility key="i2" />,
  <IcSgReport key="i3" />,
];

/** Hero-scale shield glyph — Investor Protection centerpiece */
function IcShieldLg(): ReactNode {
  return (
    <svg
      width="120"
      height="138"
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
  headlineLead: string;
  headlineAccent: string;
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
  b2sub: string;
  b2stats: StatItem[];
  // Box 3
  b3title: string;
  b3desc: string;
  b3authNote: string;
  // Box 4
  b4title: string;
  safeguards: Safeguard[];
};

const COPY: Record<Lang, Copy> = {
  en: {
    badge: "For Investors",
    headlineLead: "Transparency that ",
    headlineAccent: "builds trust.",
    sub:
      "Clear visibility into strategy, structure and safeguards helps investors understand the setup and build long-term confidence.",
    // Box 1 — Portfolio 2.0 / Vantage Ultimate model history (illustrative chart separate)
    b1title: "Historical Strategy & Performance",
    b1backtest: "Backtesting since 2010",
    b1kpis: [
      { value: "+19.71% p.a.", label: "Annual model performance" },
      { value: "−13.61%", label: "Max drawdown" },
      { value: "2.16", label: "Sharpe Ratio" },
      { value: "1.45", label: "Calmar Ratio" },
    ],
    b1disclaimer:
      "Backtesting and model history shown for informational purposes only. No guarantee of future results.",
    // Box 2
    b2title: "Strategy Risk Overview",
    b2center1: "Controlled",
    b2center2: "risk profile",
    b2sub: "Structured risk control across multiple market phases",
    b2stats: [
      { lbl: "Sharpe", val: "2.16" },
      { lbl: "Calmar", val: "1.45" },
      { lbl: "Profit Factor", val: "1.37" },
      { lbl: "Win rate", val: "43.6%" },
    ],
    // Box 3
    b3title: "Regulated Partners",
    b3desc: "Collaboration with established and regulated partners.",
    b3authNote: "Regulated and supervised by recognized authorities.",
    // Box 4
    b4title: "Investor Protection",
    safeguards: [
      {
        title: "Existing broker accounts",
        body: "Capital remains within the investor’s existing account structure.",
      },
      {
        title: "No hidden fees",
        body: "Structures and processes remain transparent and easy to understand.",
      },
      {
        title: "Ongoing visibility",
        body: "Developments and reporting can be reviewed on a regular basis.",
      },
      {
        title: "Clear reporting",
        body: "Relevant information is presented in a clear and structured way.",
      },
    ],
  },
  de: {
    badge: "Für Investoren",
    headlineLead: "Transparenz, die ",
    headlineAccent: "Vertrauen schafft.",
    sub:
      "Klare Einblicke in Strategie, Struktur und Schutzmechanismen helfen Investoren, den Ablauf zu verstehen und Vertrauen aufzubauen.",
    b1title: "Historische Strategie & Performance",
    b1backtest: "Backtesting seit 2010",
    b1kpis: [
      { value: "+19,71 % p.a.", label: "Jährliche Modellperformance" },
      { value: "−13,61 %", label: "Max. Drawdown" },
      { value: "2,16", label: "Sharpe Ratio" },
      { value: "1,45", label: "Calmar Ratio" },
    ],
    b1disclaimer:
      "Backtesting- und Modellhistorie zu Informationszwecken. Keine Garantie für zukünftige Ergebnisse.",
    b2title: "Strategie-Risikoübersicht",
    b2center1: "Kontrolliertes",
    b2center2: "Risikoprofil",
    b2sub: "Strukturierte Risikosteuerung über mehrere Marktphasen",
    b2stats: [
      { lbl: "Sharpe", val: "2,16" },
      { lbl: "Calmar", val: "1,45" },
      { lbl: "Profit Factor", val: "1,37" },
      { lbl: "Trefferquote", val: "43,6 %" },
    ],
    b3title: "Regulierte Partner",
    b3desc: "Zusammenarbeit mit etablierten und regulierten Partnern.",
    b3authNote: "Reguliert und überwacht durch anerkannte Behörden.",
    b4title: "Investorenschutz",
    safeguards: [
      {
        title: "Bestehende Broker-Konten",
        body: "Kapital bleibt innerhalb der bestehenden Kontostruktur des Investors.",
      },
      {
        title: "Keine versteckten Gebühren",
        body: "Strukturen und Abläufe bleiben transparent und nachvollziehbar.",
      },
      {
        title: "Laufende Einsicht",
        body: "Entwicklungen und Berichte können regelmäßig eingesehen werden.",
      },
      {
        title: "Klare Berichte",
        body: "Relevante Informationen werden übersichtlich und verständlich aufbereitet.",
      },
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
            <span className={r("headlinePart")}>{copy.headlineLead}</span>
            <span className={r("headlineAccent")}>{copy.headlineAccent}</span>
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
                    <stop offset="0%"   stopColor="rgba(255,253,248,0.92)" />
                    <stop offset="38%" stopColor="rgba(248,242,228,0.98)" />
                    <stop offset="100%" stopColor="rgba(228,218,192,0.88)" />
                  </linearGradient>
                  <linearGradient id="rs_ag" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%"   stopColor="rgba(245,240,228,0.14)" />
                    <stop offset="55%" stopColor="rgba(232,224,200,0.05)" />
                    <stop offset="100%" stopColor="rgba(220,210,185,0)" />
                  </linearGradient>
                  <filter id="rs_lineGlow" x="-22%" y="-22%" width="144%" height="144%">
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
                    y={CH - 8}
                    className={r("cXLbl")}
                    textAnchor={i === 0 ? "start" : i === BT_X_IDXS.length - 1 ? "end" : "middle"}
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
                  <span className={`${r("kpiVal")} ${r("kpiValGold")}`}>{k.value}</span>
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
              <svg viewBox="0 0 340 340" fill="none" className={r("riskEngineSvg")} aria-hidden>
                <defs>
                  <linearGradient id="rs_rk_polyStroke" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="rgba(255,253,248,0.82)" />
                    <stop offset="100%" stopColor="rgba(218,190,145,0.62)" />
                  </linearGradient>
                  <filter id="rs_rk_sigBlur" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="1.8" />
                  </filter>
                </defs>

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
                    r={RK_R + 14}
                    className={r("rkTickOrbit")}
                    strokeDasharray="1.5 7"
                  />
                </g>

                {/* Co-rotating dashed signal ring */}
                <g className={r("rkRotateRev")}>
                  <circle
                    cx={RK_CX}
                    cy={RK_CY}
                    r={RK_R + 7}
                    className={r("rkSignalRing")}
                    strokeDasharray="4 10"
                  />
                </g>

                {/* Radar sweep — subtle rotating ray */}
                <g transform={`translate(${RK_CX} ${RK_CY})`}>
                  <g className={r("rkSweepArm")}>
                    <line
                      x1="0"
                      y1="0"
                      x2="0"
                      y2={-RK_R * 0.94}
                      className={r("rkSweepRay")}
                    />
                  </g>
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
                <circle cx={RK_CX} cy={RK_CY} r="40" className={r("rkCoreRing")} />
                <circle cx={RK_CX} cy={RK_CY} r="30" className={r("rkCoreInner")} />
                <text x={RK_CX} y={RK_CY - 18} textAnchor="middle" className={r("ringCenter1")}>
                  {copy.b2center1}
                </text>
                <text x={RK_CX} y={RK_CY + 10} textAnchor="middle" className={r("ringCenter2")}>
                  {copy.b2center2}
                </text>
              </svg>
            </div>

            <p className={r("b2SubLine")}>{copy.b2sub}</p>

            {/* 4 stats */}
            <div className={r("statsRow")}>
              {copy.b2stats.flatMap((s, i) => [
                i > 0 ? <div key={`d${i}`} className={r("statDiv")} /> : null,
                <div key={s.lbl} className={r("statItem")}>
                  <span className={r("statLbl")}>{s.lbl}</span>
                  <span className={`${r("statVal")} ${r("statValGold")}`}>{s.val}</span>
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
                viewBox="0 0 360 218"
                fill="none"
                className={r("regSvg")}
                role="img"
                aria-label={
                  lang === "de"
                    ? "Partnerlogos mit Verbindung zu Aufsichtsbehörden"
                    : "Partner logos linked to supervisory authorities"
                }
              >
                <defs>
                  <linearGradient id="rs_reg_ln" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="rgba(255,248,236,0.38)" />
                    <stop offset="100%" stopColor="rgba(218,195,155,0.2)" />
                  </linearGradient>
                </defs>

                <rect x="18" y="14" width="132" height="48" rx="12" className={r("regLogoPlate")} />
                <rect x="210" y="14" width="132" height="48" rx="12" className={r("regLogoPlate")} />
                <image
                  href="/Roboforex.png"
                  x="26"
                  y="22"
                  width="116"
                  height="32"
                  preserveAspectRatio="xMidYMid meet"
                  className={r("regLogoImg")}
                />
                <image
                  href="/Vantage.png"
                  x="218"
                  y="22"
                  width="116"
                  height="32"
                  preserveAspectRatio="xMidYMid meet"
                  className={r("regLogoImg")}
                />

                {/* Small green status dots — clear of logo artwork */}
                <circle cx="142" cy="66" r="3.2" className={r("regStatusDot")} />
                <circle cx="334" cy="66" r="3.2" className={r("regStatusDot")} />

                <line
                  x1="84"
                  y1="66"
                  x2="180"
                  y2="106"
                  stroke="url(#rs_reg_ln)"
                  strokeWidth="1.05"
                  strokeLinecap="round"
                  strokeDasharray="3 5"
                  className={r("regFlowA")}
                />
                <line
                  x1="276"
                  y1="66"
                  x2="180"
                  y2="106"
                  stroke="url(#rs_reg_ln)"
                  strokeWidth="1.05"
                  strokeLinecap="round"
                  strokeDasharray="3 5"
                  className={r("regFlowB")}
                />
                <circle cx="180" cy="106" r="4" className={r("regJunction")} />

                <line
                  x1="180"
                  y1="106"
                  x2="72"
                  y2="166"
                  stroke="url(#rs_reg_ln)"
                  strokeWidth="1"
                  strokeLinecap="round"
                  strokeDasharray="3 5"
                  className={r("regFlowC")}
                />
                <line
                  x1="180"
                  y1="106"
                  x2="180"
                  y2="174"
                  stroke="url(#rs_reg_ln)"
                  strokeWidth="1"
                  strokeLinecap="round"
                  strokeDasharray="3 5"
                  className={r("regFlowD")}
                />
                <line
                  x1="180"
                  y1="106"
                  x2="288"
                  y2="166"
                  stroke="url(#rs_reg_ln)"
                  strokeWidth="1"
                  strokeLinecap="round"
                  strokeDasharray="3 5"
                  className={r("regFlowE")}
                />

                <circle cx="72" cy="182" r="24" className={r("regSeal")} />
                <text x="72" y="187" textAnchor="middle" className={r("regSealLbl")}>
                  FCA
                </text>

                <circle cx="180" cy="182" r="24" className={r("regSeal")} />
                <text x="180" y="187" textAnchor="middle" className={r("regSealLbl")}>
                  CySEC
                </text>

                <circle cx="288" cy="182" r="24" className={r("regSeal")} />
                <text x="288" y="187" textAnchor="middle" className={r("regSealLbl")}>
                  FSC
                </text>
              </svg>
            </div>

            <p className={r("regAuthNote")}>{copy.b3authNote}</p>
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
                <span className={r("sgCardIco")}>{SG_ICONS[0]}</span>
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
                <span className={r("sgCardIco")}>{SG_ICONS[1]}</span>
                <span className={r("sgTitle")}>{copy.safeguards[1]!.title}</span>
                <span className={r("sgBody")}>{copy.safeguards[1]!.body}</span>
              </div>

              {/* Card 3 — bottom left */}
              <div className={`${r("sgCard")} ${r("sgCard3")}`}>
                <span className={r("sgCardIco")}>{SG_ICONS[2]}</span>
                <span className={r("sgTitle")}>{copy.safeguards[2]!.title}</span>
                <span className={r("sgBody")}>{copy.safeguards[2]!.body}</span>
              </div>

              {/* Card 4 — bottom right */}
              <div className={`${r("sgCard")} ${r("sgCard4")}`}>
                <span className={r("sgCardIco")}>{SG_ICONS[3]}</span>
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
