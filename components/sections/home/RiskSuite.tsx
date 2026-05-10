"use client";

import type { ReactNode } from "react";
import Image from "next/image";

import { useLanguage, type Lang } from "@/lib/i18n/language";
import raw from "./RiskSuite.module.css";

function r(name: string): string {
  return (raw as Record<string, string>)[name] ?? "";
}

/** Annual returns (1970→2026). Visual series is additive cumulative: cum = prev + returnPct (no compounding). */
const BT_ANNUAL_RETURNS: Array<{ year: number; ret: number }> = [
  { year: 1970, ret: -3.43 },
  { year: 1971, ret: -2.25 },
  { year: 1972, ret: 5.41 },
  { year: 1973, ret: 2.61 },
  { year: 1974, ret: 1.67 },
  { year: 1975, ret: -9.45 },
  { year: 1976, ret: 3.64 },
  { year: 1977, ret: 2.62 },
  { year: 1978, ret: 1.32 },
  { year: 1979, ret: -0.16 },
  { year: 1980, ret: 10.13 },
  { year: 1981, ret: -5.59 },
  { year: 1982, ret: 1.08 },
  { year: 1983, ret: -0.39 },
  { year: 1984, ret: 0.67 },
  { year: 1985, ret: 7.42 },
  { year: 1986, ret: -4.58 },
  { year: 1987, ret: -0.14 },
  { year: 1988, ret: 3.62 },
  { year: 1989, ret: 2.33 },
  { year: 1990, ret: -0.53 },
  { year: 1991, ret: -2.67 },
  { year: 1992, ret: 9.53 },
  { year: 1993, ret: 6.74 },
  { year: 1994, ret: 6.04 },
  { year: 1995, ret: 13.68 },
  { year: 1996, ret: 6.65 },
  { year: 1997, ret: 12.54 },
  { year: 1998, ret: 3.64 },
  { year: 1999, ret: 14.16 },
  { year: 2000, ret: 7.76 },
  { year: 2001, ret: 0.62 },
  { year: 2002, ret: 16.34 },
  { year: 2003, ret: 17.37 },
  { year: 2004, ret: -3.69 },
  { year: 2005, ret: 4.85 },
  { year: 2006, ret: 29.46 },
  { year: 2007, ret: 16.02 },
  { year: 2008, ret: -12.44 },
  { year: 2009, ret: 34.88 },
  { year: 2010, ret: 28.6 },
  { year: 2011, ret: 18.07 },
  { year: 2012, ret: 4.89 },
  { year: 2013, ret: 25.29 },
  { year: 2014, ret: 18.43 },
  { year: 2015, ret: 6.6 },
  { year: 2016, ret: 20.9 },
  { year: 2017, ret: 23.23 },
  { year: 2018, ret: 6.29 },
  { year: 2019, ret: 38.38 },
  { year: 2020, ret: 25.77 },
  { year: 2021, ret: 27.37 },
  { year: 2022, ret: 8.39 },
  { year: 2023, ret: 25.63 },
  { year: 2024, ret: 26.15 },
  { year: 2025, ret: 28.35 },
  { year: 2026, ret: 0.65 },
] as const;

const BT_YEARS = BT_ANNUAL_RETURNS.map((p) => p.year);
const BT_VALUES = BT_ANNUAL_RETURNS.reduce<number[]>((acc, p, i) => {
  const prev = i === 0 ? 0 : acc[i - 1]!;
  acc.push(prev + p.ret);
  return acc;
}, []);
const BT_N = BT_VALUES.length;

/** Y-axis domain — additive cumulative scale (ends ~+530%). */
const BT_SCALE_MIN = 0;
const BT_SCALE_MAX = 600;
const BT_Y_TICKS = [0, 100, 200, 300, 400, 500, 600] as const;

// ── Chart geometry ─────────────────────────────────────────────────────────────
const CW = 520,
  CH = 148;
const BT_PL = 54,
  BT_PR = 20,
  BT_PT = 10,
  BT_PB = 28;
const BT_uW = CW - BT_PL - BT_PR;
const BT_uH = CH - BT_PT - BT_PB;
const BT_X_YEARS = [1970, 1980, 1990, 2000, 2010, 2020, 2026] as const;
const BT_X_IDXS = BT_X_YEARS.map((y) => Math.max(0, BT_YEARS.indexOf(y)));
const BT_X_LBLS = BT_X_YEARS.map((y) => String(y));

function btYPos(v: number): number {
  const span = BT_SCALE_MAX - BT_SCALE_MIN || 1;
  const t = (v - BT_SCALE_MIN) / span;
  return BT_PT + BT_uH - t * BT_uH;
}

function btXFromIdx(idx: number): number {
  return BT_PL + (idx / (BT_N - 1)) * BT_uW;
}

function btFmtYPercent(v: number): string {
  return `${v}%`;
}

/** Polyline through fixed normal-cumulative visual series. */
function buildBtChart() {
  const pts = BT_VALUES.map((v, i) => ({
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

// ── Risk control (Box 2): robust metric rows (no radar / no abstract visuals) ────────────────

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

/** Institution / bank façade — Box 3 header */
function IcInstitution(): ReactNode {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M12 2l9 5v2H3V7l9-5z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
      <path d="M6 9h12" stroke="currentColor" strokeWidth="1.15" strokeLinecap="round" opacity="0.4" />
      <path d="M7 10v10M10.5 10v10M14 10v10M17.5 10v10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M8.5 13h7M8.5 16h7" stroke="currentColor" strokeWidth="0.95" strokeLinecap="round" opacity="0.35" />
      <path d="M5 20h14" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" />
      <path d="M11 4h2v2.5h-2z" fill="currentColor" opacity="0.22" />
    </svg>
  );
}

/** Investor Protection — per-card icons */
function IcSgBroker(): ReactNode {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M4 10h16v10H4V10z" stroke="currentColor" strokeWidth="1.35" />
      <path d="M8 14h4M12 10V6l4-2 4 2v4" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IcSgFees(): ReactNode {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.35" />
      <path d="M8 15l8-8M9 9h4v4" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" />
    </svg>
  );
}

function IcSgVisibility(): ReactNode {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden>
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
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden>
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
      width="128"
      height="148"
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
  b2status: string;
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
    b1backtest: "Backtesting since 1970",
    b1kpis: [
      { value: "+8.90% p.a.", label: "Annual performance" },
      { value: "−20.91%", label: "Max drawdown" },
      { value: "1.63", label: "Sharpe Ratio" },
      { value: "0.43", label: "Calmar Ratio" },
    ],
    b1disclaimer:
      "Backtesting and model history shown for informational purposes only. No guarantee of future results.",
    // Box 2
    b2title: "Strategy Risk Overview",
    b2status: "Controlled risk profile",
    b2stats: [
      { lbl: "Sharpe Ratio", val: "1.63" },
      { lbl: "Calmar Ratio", val: "0.43" },
      { lbl: "Profit Factor", val: "1.24" },
      { lbl: "Win Rate", val: "42.9%" },
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
      "Klare Einblicke in Strategie, Struktur und Schutzmechanismen helfen Investoren, den Aufbau besser zu verstehen und langfristiges Vertrauen aufzubauen.",
    b1title: "Historische Strategie & Performance",
    b1backtest: "Backtesting seit 1970",
    b1kpis: [
      { value: "+8,90 % p.a.", label: "Jährliche Performance" },
      { value: "−20,91 %", label: "Max. Drawdown" },
      { value: "1,63", label: "Sharpe Ratio" },
      { value: "0,43", label: "Calmar Ratio" },
    ],
    b1disclaimer:
      "Backtesting- und Modellhistorie dienen ausschließlich Informationszwecken. Keine Garantie für zukünftige Ergebnisse.",
    b2title: "Strategie-Risikoüberblick",
    b2status: "Kontrolliertes Risikoprofil",
    b2stats: [
      { lbl: "Sharpe Ratio", val: "1,63" },
      { lbl: "Calmar Ratio", val: "0,43" },
      { lbl: "Profit Factor", val: "1,24" },
      { lbl: "Trefferquote", val: "42,9 %" },
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

  const riskBarPct = (lbl: string): number => {
    switch (lbl) {
      case "Sharpe Ratio":
        return 78;
      case "Calmar Ratio":
        return 32;
      case "Profit Factor":
        return 58;
      case "Win Rate":
      case "Trefferquote":
        return 52;
      default:
        return 50;
    }
  };

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

        {/* ── 2x2 grid ── */}
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

                {/* Horizontal guides + Y labels (0–120%) */}
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
                      x={BT_PL - 6}
                      y={btYPos(v) + 3.5}
                      className={r("cYLbl")}
                      textAnchor="end"
                    >
                      {btFmtYPercent(v)}
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
                  <p className={r("kpiCombined")}>
                    <span className={r("kpiValGold")}>{k.value}</span>
                    <span className={r("kpiDash")}> — </span>
                    <span className={r("kpiLblInline")}>{k.label}</span>
                  </p>
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

            <div className={r("riskStatus")}>
              <span className={r("riskStatusDot")} aria-hidden />
              <span className={r("riskStatusTxt")}>{copy.b2status}</span>
            </div>

            <div className={r("riskRows")}>
              {copy.b2stats.map((m) => (
                <div key={m.lbl} className={r("riskRow")}>
                  <span className={r("riskLbl")}>{m.lbl}</span>
                  <div className={r("riskBar")} aria-hidden>
                    <div className={r("riskBarFill")} style={{ width: `${riskBarPct(m.lbl)}%` }} />
                  </div>
                  <span className={r("riskVal")}>{m.val}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── Box 3: Regulated partners ── */}
          <div className={`${r("box")} ${r("boxReg")}`}>
            <div className={r("boxHead")}>
              <span className={r("boxIco")}><IcInstitution /></span>
              <span className={r("boxTitle")}>{copy.b3title}</span>
            </div>

            <p className={r("regDesc")}>{copy.b3desc}</p>

            <div className={r("regLogos")}>
              <div className={r("regLogoCard")}>
                <Image src="/Roboforex.png" alt="RoboForex" width={160} height={44} className={r("regLogoImg2")} />
              </div>
              <div className={r("regLogoCard")}>
                <Image src="/Vantage.png" alt="Vantage" width={160} height={44} className={r("regLogoImg2")} />
              </div>
            </div>

            <div className={r("regChips")} aria-label={lang === "de" ? "Regulierungen" : "Regulations"}>
              <span className={r("regChip")}>FCA</span>
              <span className={r("regChip")}>CySEC</span>
              <span className={r("regChip")}>FSC</span>
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
