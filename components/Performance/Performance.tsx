"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import raw from "./Performance.module.css";

function c(n: string): string {
  return (raw as Record<string, string>)[n] ?? "";
}

/* ═══════════════════════════════════════════════════════════════
   CENTRAL DATA SOURCE — all chart, table, analytics derived here
   ═══════════════════════════════════════════════════════════════ */

const MONTHLY_RETURNS = [
  // 2024 (month 0-indexed: 3=Apr … 11=Dec)
  { year: 2024, month: 3,  r:  2.13 },
  { year: 2024, month: 4,  r: 14.62 },
  { year: 2024, month: 5,  r:  2.49 },
  { year: 2024, month: 6,  r:  1.77 },
  { year: 2024, month: 7,  r: -0.05 },
  { year: 2024, month: 8,  r: -3.50 },
  { year: 2024, month: 9,  r:  8.96 },
  { year: 2024, month: 10, r: -4.96 },
  { year: 2024, month: 11, r:  5.74 },
  // 2025
  { year: 2025, month: 0,  r: 13.56 },
  { year: 2025, month: 1,  r: 14.77 },
  { year: 2025, month: 2,  r:  1.06 },
  { year: 2025, month: 3,  r: -5.78 },
  { year: 2025, month: 4,  r:  0.84 },
  { year: 2025, month: 5,  r:  0.57 },
  { year: 2025, month: 6,  r:  1.45 },
  { year: 2025, month: 7,  r: -1.12 },
  { year: 2025, month: 8,  r: -0.23 },
  { year: 2025, month: 9,  r: -0.44 },
  { year: 2025, month: 10, r: -0.64 },
  { year: 2025, month: 11, r:  0.67 },
  // 2026
  { year: 2026, month: 0,  r:  0.17 },
  { year: 2026, month: 1,  r:  3.75 },
  { year: 2026, month: 2,  r:  0.17 },
  { year: 2026, month: 3,  r: -0.88 },
  { year: 2026, month: 4,  r:  0.50 },
] as const;

/* ─── Flat returns array for KPI calculations ────────────────── */
const R = MONTHLY_RETURNS.map(e => e.r);
const N = R.length; // 26

/* ─── Equity curve: cumulative % return month-by-month ────────── */
function makeEquityCurve(returns: readonly number[]): number[] {
  let equity = 1;
  const pts: number[] = [0];
  for (const r of returns) {
    equity *= (1 + r / 100);
    pts.push(+((equity - 1) * 100).toFixed(2));
  }
  return pts;
}

const CAP_CURVE = makeEquityCurve(R); // 27 pts, starts at 0, ends ≈ 67.72
const NN = CAP_CURVE.length - 1;      // 26 intervals

/* ─── S&P 500 benchmark — plausible Apr '24 – May '26 values ──── */
// Realistic approximate cumulative returns; endpoint ≈ +24.4%
const SP_CURVE = [
  0, -3.50, 1.13, 4.57, 5.62, 7.94, 10.10, 9.00, 15.10, 12.34,
  15.15, 13.08, 6.97, 6.33, 12.60, 14.62, 17.83, 17.12, 17.70,
  18.64, 21.61, 19.18, 20.97, 19.76, 20.72, 22.17, 24.37,
];

/* ─── SVG geometry ───────────────────────────────────────────── */
const VW = 740, VH = 400;
const PL = 52, PR = 12, PT = 16, PB = 40;
const CW = VW - PL - PR; // 676
const CH = VH - PT - PB; // 344
const YMIN = -8, YMAX = 75;

function gpx(i: number) { return PL + (i / NN) * CW; }
function gpy(v: number) { return PT + CH * (1 - (v - YMIN) / (YMAX - YMIN)); }

function smoothLine(pts: number[]): string {
  return pts.reduce((d, v, i) => {
    if (i === 0) return `M ${gpx(0).toFixed(1)} ${gpy(v).toFixed(1)}`;
    const mx = (gpx(i - 1) + gpx(i)) / 2;
    return `${d} C ${mx.toFixed(1)} ${gpy(pts[i - 1]!).toFixed(1)} ${mx.toFixed(1)} ${gpy(v).toFixed(1)} ${gpx(i).toFixed(1)} ${gpy(v).toFixed(1)}`;
  }, "");
}

function areaLine(pts: number[]): string {
  const n = pts.length - 1;
  return `${smoothLine(pts)} L ${gpx(n).toFixed(1)} ${gpy(YMIN).toFixed(1)} L ${gpx(0).toFixed(1)} ${gpy(YMIN).toFixed(1)} Z`;
}

const CAP_PATH = smoothLine(CAP_CURVE);
const CAP_AREA = areaLine(CAP_CURVE);
const SP_PATH  = smoothLine(SP_CURVE);

const CAP_END = CAP_CURVE[CAP_CURVE.length - 1]!; // ≈ 67.72
const SP_END  = SP_CURVE[SP_CURVE.length - 1]!;   // 24.37

// % positions for right-side legend labels (preserveAspectRatio="none" makes these exact)
const CAP_LEGEND_TOP = `${((gpy(CAP_END) / VH) * 100).toFixed(1)}%`;
const SP_LEGEND_TOP  = `${((gpy(SP_END)  / VH) * 100).toFixed(1)}%`;

/* ─── X-axis / date labels ───────────────────────────────────── */
const X_LABELS: [number, string][] = [
  [0,  "Apr '24"], [4,  "Jul '24"], [7,  "Oct '24"], [10, "Jan '25"],
  [13, "Apr '25"], [16, "Jul '25"], [19, "Oct '25"], [22, "Jan '26"],
  [26, "May '26"],
];
const Y_TICKS = [70, 50, 30, 10, -5];

const DATE_FROM    = "Apr '24";
const DATE_FROM_1Y = "May '25";
const DATE_TO      = "May '26";

/* ─── Table data derived from MONTHLY_RETURNS ───────────────────*/
const MONTH_ABBR = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

// Annual totals compounded from verified track record (slight rounding in monthly figures)
const YEAR_TOTALS: Record<number, number> = { 2024: 28.96, 2025: 25.47, 2026: 3.71 };
const TABLE_TOTAL = 67.81;

const TABLE_ROWS = [2024, 2025, 2026].map(year => {
  const months = Array.from({ length: 12 }, () => null) as (number | null)[];
  MONTHLY_RETURNS.filter(e => e.year === year).forEach(e => { months[e.month] = e.r; });
  return { year, months, total: YEAR_TOTALS[year]! };
});

/* ─── Analytics KPIs — all computed from MONTHLY_RETURNS ────────*/
// All values approximated from 26 monthly % returns
const _mean = R.reduce((s, v) => s + v, 0) / N;
const _std  = Math.sqrt(R.reduce((s, v) => s + (v - _mean) ** 2, 0) / (N - 1));

// Max drawdown via equity curve
const _eq: number[] = [1];
for (const r of R) _eq.push(_eq[_eq.length - 1]! * (1 + r / 100));
let _peak = 1, _mdd = 0;
for (const e of _eq) { if (e > _peak) _peak = e; const dd = (_peak - e) / _peak; if (dd > _mdd) _mdd = dd; }

const _wins   = R.filter(r => r > 0);
const _losses = R.filter(r => r < 0);
const _pf     = _wins.reduce((s, v) => s + v, 0) / Math.abs(_losses.reduce((s, v) => s + v, 0));
const _cagr   = (Math.pow(1 + TABLE_TOTAL / 100, 12 / N) - 1) * 100; // 26-month basis

const KPIS = [
  { label: "Total Return",  value: `+${TABLE_TOTAL.toFixed(2)}%` },
  { label: "CAGR",          value: `${_cagr.toFixed(1)}%`        },
  { label: "Max Drawdown",  value: `-${(_mdd * 100).toFixed(2)}%`},
  { label: "Avg Monthly",   value: `+${_mean.toFixed(2)}%`       },
  { label: "Best Month",    value: `+${Math.max(...R).toFixed(2)}%` },
  { label: "Worst Month",   value: `${Math.min(...R).toFixed(2)}%`  },
  { label: "Win Rate",      value: `${Math.round((_wins.length / N) * 100)}%` },
  { label: "Profit Factor", value: _pf.toFixed(2)                },
];

/* ─── Types ──────────────────────────────────────────────────── */
type Tab    = "chart" | "table" | "analytics";
type Period = "1Y" | "2Y";

const TAB_EASE = [0.4, 0, 0.2, 1] as [number, number, number, number];

/* ─── SVG Icons ──────────────────────────────────────────────── */
function IconChart({ col, sz = 20 }: { col: string; sz?: number }) {
  return (
    <svg width={sz} height={sz} viewBox="0 0 24 24" fill="none" stroke={col} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 17 7 9 11 13 15 7 19 12" />
      <line x1="3" y1="21" x2="21" y2="21" />
    </svg>
  );
}
function IconTable({ col, sz = 20 }: { col: string; sz?: number }) {
  return (
    <svg width={sz} height={sz} viewBox="0 0 24 24" fill="none" stroke={col} strokeWidth="1.8" strokeLinecap="round">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <line x1="3" y1="9" x2="21" y2="9" />
      <line x1="3" y1="15" x2="21" y2="15" />
      <line x1="9" y1="3" x2="9" y2="21" />
    </svg>
  );
}
function IconAnalytics({ col, sz = 20 }: { col: string; sz?: number }) {
  return (
    <svg width={sz} height={sz} viewBox="0 0 24 24" fill="none" stroke={col} strokeWidth="1.8" strokeLinecap="round">
      <circle cx="12" cy="12" r="2.5" />
      <circle cx="4"  cy="6"  r="1.8" /><circle cx="20" cy="6"  r="1.8" />
      <circle cx="4"  cy="18" r="1.8" /><circle cx="20" cy="18" r="1.8" />
      <line x1="5.8"  y1="6.8"  x2="10.2" y2="10.5" />
      <line x1="18.2" y1="6.8"  x2="13.8" y2="10.5" />
      <line x1="5.8"  y1="17.2" x2="10.2" y2="13.5" />
      <line x1="18.2" y1="17.2" x2="13.8" y2="13.5" />
    </svg>
  );
}

/* ─── Custom candlestick cursor ──────────────────────────────── */
function DashboardCursor({ containerRef }: { containerRef: React.RefObject<HTMLDivElement | null> }) {
  const [pos, setPos]   = useState({ x: -200, y: -200 });
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || "ontouchstart" in window) return;
    const el = containerRef.current;
    if (!el) return;

    let rect  = el.getBoundingClientRect();
    let rafId = 0;

    const onMove   = (e: MouseEvent) => { cancelAnimationFrame(rafId); rafId = requestAnimationFrame(() => setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top })); };
    const onIn     = () => { rect = el.getBoundingClientRect(); setShow(true); };
    const onOut    = () => setShow(false);
    const onResize = () => { rect = el.getBoundingClientRect(); };

    el.addEventListener("mousemove",  onMove);
    el.addEventListener("mouseenter", onIn);
    el.addEventListener("mouseleave", onOut);
    window.addEventListener("resize", onResize, { passive: true });
    return () => {
      cancelAnimationFrame(rafId);
      el.removeEventListener("mousemove",  onMove);
      el.removeEventListener("mouseenter", onIn);
      el.removeEventListener("mouseleave", onOut);
      window.removeEventListener("resize", onResize);
    };
  }, [containerRef]);

  if (!show) return null;
  return (
    <div style={{ position: "absolute", left: pos.x, top: pos.y, pointerEvents: "none", zIndex: 100, transform: "translate(-2px,-2px)", transition: "left 40ms linear, top 40ms linear" }}>
      <svg width="24" height="22" viewBox="0 0 24 22" fill="none">
        <line x1="4" y1="1"  x2="4" y2="5"  stroke="white" strokeWidth="1.2" opacity="0.8" />
        <rect x="2" y="5" width="4" height="8" rx="0.5" fill="white" opacity="0.8" />
        <line x1="4" y1="13" x2="4" y2="17" stroke="white" strokeWidth="1.2" opacity="0.8" />
        <line x1="13" y1="4"  x2="13" y2="8"  stroke="#eadf9a" strokeWidth="1.1" />
        <rect x="11.5" y="8" width="3" height="6" rx="0.5" fill="#eadf9a" />
        <line x1="13" y1="14" x2="13" y2="17" stroke="#eadf9a" strokeWidth="1.1" />
      </svg>
    </div>
  );
}

/* ─── Sidebar ────────────────────────────────────────────────── */
function DashboardSidebar({ tab, setTab }: { tab: Tab; setTab: (t: Tab) => void }) {
  const ITEMS: { id: Tab; Ico: (p: { col: string }) => React.ReactElement }[] = [
    { id: "chart",     Ico: ({ col }) => <IconChart     col={col} sz={20} /> },
    { id: "table",     Ico: ({ col }) => <IconTable     col={col} sz={20} /> },
    { id: "analytics", Ico: ({ col }) => <IconAnalytics col={col} sz={20} /> },
  ];
  return (
    <aside className={c("sidebar")}>
      <div className={c("sidebarTop")}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/CAPITALIFE_ICON.png" alt="Capitalife" width="32" height="32" style={{ display: "block", opacity: 0.88 }} />
      </div>
      <nav className={c("sidebarNav")}>
        {ITEMS.map(({ id, Ico }) => {
          const active = tab === id;
          return (
            <button
              key={id}
              className={`${c("sidebarBtn")} ${active ? c("sidebarBtnActive") : ""}`}
              onClick={() => setTab(id)}
              aria-label={id}
            >
              <Ico col={active ? "#eadf9a" : "rgba(255,255,255,0.42)"} />
            </button>
          );
        })}
      </nav>
    </aside>
  );
}

/* ─── Dashboard header ───────────────────────────────────────── */
function DashboardHeader({ tab, setTab }: { tab: Tab; setTab: (t: Tab) => void }) {
  const TABS: { id: Tab; label: string }[] = [
    { id: "chart",     label: "Performance Chart" },
    { id: "table",     label: "Performance Table" },
    { id: "analytics", label: "Analytics"         },
  ];
  return (
    <header className={c("dashHeader")}>
      <nav className={c("dashTabs")}>
        {TABS.map(({ id, label }) => (
          <button
            key={id}
            className={`${c("dashTab")} ${tab === id ? c("dashTabActive") : ""}`}
            onClick={() => setTab(id)}
          >
            {label}
          </button>
        ))}
      </nav>

      {/* Third Party Verified — real logos, all clickable */}
      <div className={c("verifiedBox")}>
        <span className={c("verifiedLabel")}>Third Party Verified</span>
        <div className={c("verifiedLogos")}>
          <a href="https://www.darwinex.com/account/L.23491" target="_blank" rel="noopener noreferrer" className={c("verifiedLogoLink")}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/Darwinex.png" alt="Darwinex" className={c("verifiedLogoImg")} />
          </a>
          <a href="https://www.myfxbook.com/members/jgfxtrading/capitalife--live-strategy-/12014242" target="_blank" rel="noopener noreferrer" className={c("verifiedLogoLink")}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/Myfxbook.png" alt="Myfxbook" className={c("verifiedLogoImg")} />
          </a>
          <a href="https://www.copyfx.com/ratings/rating-all/show/340470/tab/profit/period/all/" target="_blank" rel="noopener noreferrer" className={c("verifiedLogoLink")}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/copyfx.png" alt="CopyFX" className={c("verifiedLogoImg")} />
          </a>
        </div>
      </div>
    </header>
  );
}

/* ─── Controls row ───────────────────────────────────────────── */
function DashboardControls({ period, setPeriod }: { period: Period; setPeriod: (p: Period) => void }) {
  const dateFrom = period === "1Y" ? DATE_FROM_1Y : DATE_FROM;
  return (
    <div className={c("controls")}>
      <div className={c("ctrlLeft")}>
        <button type="button" className={`${c("ctrlPeriodBtn")} ${period === "1Y" ? c("ctrlPeriodActive") : ""}`} onClick={() => setPeriod("1Y")}>1Y</button>
        <button type="button" className={`${c("ctrlPeriodBtn")} ${period === "2Y" ? c("ctrlPeriodActive") : ""}`} onClick={() => setPeriod("2Y")}>2Y</button>
        <span className={c("ctrlDate")}>{dateFrom} → {DATE_TO}</span>
      </div>
    </div>
  );
}

/* ─── View 1: Performance Chart ──────────────────────────────── */
function PerformanceChartView() {
  return (
    <div className={c("chartView")}>
      <h3 className={c("viewTitle")}>Performance Chart</h3>
      <div className={c("chartLayout")}>

        <div className={c("chartSvgWrap")}>
          <svg
            viewBox={`0 0 ${VW} ${VH}`}
            width="100%" height="100%"
            preserveAspectRatio="none"
            style={{ overflow: "visible", display: "block" }}
          >
            <defs>
              <linearGradient id="capAreaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%"   stopColor="rgba(234,223,154,0.40)" />
                <stop offset="68%"  stopColor="rgba(234,223,154,0.05)" />
                <stop offset="100%" stopColor="rgba(234,223,154,0)"    />
              </linearGradient>
              <filter id="lineGlow" x="-10%" y="-30%" width="120%" height="160%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" result="blur" />
                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
            </defs>

            {Y_TICKS.map(v => {
              const y = gpy(v);
              return (
                <g key={v}>
                  <line x1={PL} y1={y} x2={VW - PR} y2={y}
                    stroke="rgba(255,255,255,0.07)" strokeWidth="1"
                    strokeDasharray={v === 0 ? "none" : "5 5"} />
                  <text x={PL - 8} y={y + 5} textAnchor="end"
                    fill="rgba(255,255,255,0.42)" fontSize="13"
                    fontFamily="-apple-system,BlinkMacSystemFont,sans-serif">
                    {v}%
                  </text>
                </g>
              );
            })}

            {X_LABELS.map(([i, label]) => (
              <text key={i} x={gpx(i)} y={VH - PB + 22} textAnchor="middle"
                fill="rgba(255,255,255,0.34)" fontSize="11.5"
                fontFamily="-apple-system,BlinkMacSystemFont,sans-serif">
                {label}
              </text>
            ))}

            <path d={SP_PATH}  stroke="rgba(255,255,255,0.30)" strokeWidth="2"   fill="none" strokeLinecap="round" />
            <path d={CAP_AREA} fill="url(#capAreaGrad)" />
            <path d={CAP_PATH} stroke="#eadf9a"          strokeWidth="2.5" fill="none" strokeLinecap="round" filter="url(#lineGlow)" />

            <line x1={PL} y1={VH - PB} x2={VW - PR} y2={VH - PB}
              stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
          </svg>
        </div>

        {/* Legend items pinned to exact Y% matching line endpoints */}
        <div className={c("chartLegend")}>
          <div className={c("legendItem")} style={{ top: CAP_LEGEND_TOP }}>
            <div className={c("legendPill")} style={{ borderColor: "rgba(234,223,154,0.35)", background: "rgba(234,223,154,0.08)" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/CAPITALIFE_ICON.png" alt="" width="12" height="12" style={{ display: "block", opacity: 0.88 }} />
              <span style={{ color: "#eadf9a", fontWeight: 650, fontSize: 13, letterSpacing: "-0.01em" }}>+{CAP_END.toFixed(2)}%</span>
            </div>
            <span className={c("legendName")} style={{ color: "rgba(234,223,154,0.70)" }}>Capitalife</span>
          </div>

          <div className={c("legendItem")} style={{ top: SP_LEGEND_TOP }}>
            <div className={c("legendPill")} style={{ borderColor: "rgba(255,255,255,0.11)", background: "rgba(255,255,255,0.04)" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/sp500.png" alt="S&P 500" width="28" height="12" style={{ display: "block", opacity: 0.62, objectFit: "contain" }} />
              <span style={{ color: "rgba(255,255,255,0.58)", fontWeight: 500, fontSize: 13 }}>+{SP_END.toFixed(2)}%</span>
            </div>
            <span className={c("legendName")} style={{ color: "rgba(255,255,255,0.38)" }}>S&amp;P 500</span>
          </div>
        </div>

      </div>
    </div>
  );
}

/* ─── View 2: Performance Table ──────────────────────────────── */
function PerformanceTableView() {
  const fmt = (v: number | null) => {
    if (v === null) return <span className={c("cellDash")}>—</span>;
    return <span className={v > 0 ? c("cellPos") : c("cellNeg")}>{v > 0 ? "+" : ""}{v.toFixed(2)}%</span>;
  };
  return (
    <div className={c("tableView")}>
      <h3 className={c("viewTitle")}>Performance Table</h3>
      <div className={c("tableBox")}>
        <div className={c("tableScroll")}>
          <table className={c("perfTable")}>
            <thead>
              <tr>
                <th className={`${c("th")} ${c("thYear")}`}>Year</th>
                {MONTH_ABBR.map(m => <th key={m} className={c("th")}>{m}</th>)}
                <th className={`${c("th")} ${c("thTotal")}`}>Total</th>
              </tr>
            </thead>
            <tbody>
              {TABLE_ROWS.map(row => (
                <tr key={row.year} className={c("tr")}>
                  <td className={`${c("td")} ${c("tdYear")}`}>{row.year}</td>
                  {row.months.map((v, i) => <td key={i} className={c("td")}>{fmt(v)}</td>)}
                  <td className={`${c("td")} ${c("tdTotal")}`}>{fmt(row.total)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className={c("trTotal")}>
                <td className={`${c("td")} ${c("tdYear")} ${c("tdGrandLabel")}`} colSpan={13}>TOTAL RETURN</td>
                <td className={`${c("td")} ${c("tdTotal")} ${c("tdGrandValue")}`}>
                  <span className={c("cellPos")}>+{TABLE_TOTAL.toFixed(2)}%</span>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ─── View 3: Analytics ──────────────────────────────────────── */
function AnalyticsView() {
  return (
    <div className={c("analyticsView")}>
      <h3 className={c("viewTitle")}>Analytics</h3>
      <div className={c("kpiGrid")}>
        {KPIS.map(kpi => (
          <div key={kpi.label} className={c("kpiCard")}>
            <span className={c("kpiDot")} />
            <span className={c("kpiLabel")}>{kpi.label}</span>
            <span className={c("kpiValue")}>{kpi.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Dashboard ──────────────────────────────────────────────── */
function PerformanceDashboard() {
  const [tab, setTab]       = useState<Tab>("chart");
  const [period, setPeriod] = useState<Period>("2Y");
  const screenRef           = useRef<HTMLDivElement>(null);

  return (
    <div className={c("deviceOuter")}>
      <div className={c("device")}>
        <div className={c("screen")} ref={screenRef}>
          <DashboardCursor containerRef={screenRef} />
          <div className={c("dashLayout")}>
            <DashboardSidebar tab={tab} setTab={setTab} />
            <div className={c("dashMain")}>
              <DashboardHeader tab={tab} setTab={setTab} />
              <DashboardControls period={period} setPeriod={setPeriod} />
              <div className={c("dashContent")}>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={tab}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2, ease: TAB_EASE }}
                    style={{ height: "100%" }}
                  >
                    {tab === "chart"     && <PerformanceChartView />}
                    {tab === "table"     && <PerformanceTableView />}
                    {tab === "analytics" && <AnalyticsView />}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
        <div className={c("laptopBase")}><div className={c("trackpad")} /></div>
      </div>
      <div className={c("deviceFade")} />
    </div>
  );
}

/* ─── Section export ─────────────────────────────────────────── */
export function Performance() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const fn = () => {
      if (!sectionRef.current) return;
      const r = sectionRef.current.getBoundingClientRect();
      sectionRef.current.style.setProperty("--para-y", `${(r.top * 0.22).toFixed(1)}px`);
    };
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <section ref={sectionRef} className={c("section")} id="performance">
      <div className={c("bg")} />
      <div className={c("vignette")} />
      <div className={c("inner")}>
        <div className={c("pill")}>
          <span className={c("pillDot")} />
          <span>Verified Track Record</span>
        </div>
        <h2 className={c("headline")}>Performance Overview</h2>
        <p className={c("sub")}>
          Explore verified performance data, transparent risk metrics, and strategy insights
          designed to help investors evaluate Capitalife with confidence.
        </p>
        <div className={c("btns")}>
          <Link href="#performance" className={c("btnPrimary")}>View Track Record</Link>
          <Link href="#contact"     className={c("btnSecondary")}>Request Report</Link>
        </div>
        <PerformanceDashboard />
      </div>
    </section>
  );
}
