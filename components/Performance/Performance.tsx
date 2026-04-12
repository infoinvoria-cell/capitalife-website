"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type MouseEvent as ReactMouseEvent } from "react";

import { useLanguage, type Lang } from "@/lib/i18n/language";
import raw from "./Performance.module.css";
import { SP500_CUM } from "./sp500-data";

function c(name: string): string {
  return (raw as Record<string, string>)[name] ?? "";
}

const MONTH_KEYS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const MONTH_LABELS_SHORT: Record<Lang, string[]> = {
  en: [...MONTH_KEYS],
  de: ["Jan", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"],
};

type PerformanceCopy = {
  badge: string;
  title: string;
  kpis: Array<{ label: string; sub: string }>;
  toggleChart: string;
  toggleTable: string;
  verifiedData: string;
  ytd: string;
};

const COPY: Record<Lang, PerformanceCopy> = {
  en: {
    badge: "Verified Track Record",
    title: "Performance Overview",
    kpis: [
      { label: "Total Return", sub: "Compounded net since inception" },
      { label: "Track Record", sub: "Live since April 2024" },
      { label: "Max Drawdown", sub: "Controlled risk management" },
      { label: "Active Investors", sub: "Capital following the strategy" },
    ],
    toggleChart: "Chart",
    toggleTable: "Table",
    verifiedData: "Verified Data",
    ytd: "YTD",
  },
  de: {
    badge: "Verifizierter Track Record",
    title: "Performance-Überblick",
    kpis: [
      { label: "Gesamtrendite", sub: "Seit Start netto kumuliert" },
      { label: "Track Record", sub: "Live seit April 2024" },
      { label: "Max. Drawdown", sub: "Kontrolliertes Risikomanagement" },
      { label: "Aktive Investoren", sub: "Kapital, das der Strategie folgt" },
    ],
    toggleChart: "Chart",
    toggleTable: "Tabelle",
    verifiedData: "Verifizierte Daten",
    ytd: "YTD",
  },
};

interface MonthEntry {
  monthReturn: number;
  cumReturn: number;
}

const DATA_2024: Record<string, MonthEntry> = {
  Apr: { monthReturn: 2.13, cumReturn: 2.13 },
  May: { monthReturn: 14.64, cumReturn: 17.08 },
  Jun: { monthReturn: 2.49, cumReturn: 19.99 },
  Jul: { monthReturn: 1.78, cumReturn: 22.13 },
  Aug: { monthReturn: -0.06, cumReturn: 22.05 },
  Sep: { monthReturn: -3.5, cumReturn: 17.78 },
  Oct: { monthReturn: 8.94, cumReturn: 28.31 },
  Nov: { monthReturn: -4.95, cumReturn: 21.96 },
  Dec: { monthReturn: 5.74, cumReturn: 28.96 },
};

const DATA_2025: Record<string, MonthEntry> = {
  Jan: { monthReturn: 13.57, cumReturn: 46.45 },
  Feb: { monthReturn: 14.76, cumReturn: 68.07 },
  Mar: { monthReturn: 1.07, cumReturn: 69.87 },
  Apr: { monthReturn: -5.78, cumReturn: 60.05 },
  May: { monthReturn: 0.85, cumReturn: 61.4 },
  Jun: { monthReturn: 0.55, cumReturn: 62.29 },
  Jul: { monthReturn: 1.0, cumReturn: 63.92 },
  Aug: { monthReturn: -0.69, cumReturn: 62.79 },
  Sep: { monthReturn: -0.23, cumReturn: 62.42 },
  Oct: { monthReturn: -0.44, cumReturn: 61.7 },
  Nov: { monthReturn: -0.33, cumReturn: 61.16 },
  Dec: { monthReturn: 0.67, cumReturn: 62.24 },
};

const DATA_2026: Record<string, MonthEntry> = {
  Jan: { monthReturn: 0.17, cumReturn: 62.51 },
  Feb: { monthReturn: 3.75, cumReturn: 68.61 },
  Mar: { monthReturn: 2.0, cumReturn: 71.99 },
};

const YEARLY_TOTALS: Record<string, number> = { 2024: 28.96, 2025: 25.81, 2026: 6.01 };

const CAP_DATA = [
  2.13, 17.08, 19.99, 22.13, 22.05, 17.78, 28.31, 21.96, 28.96, 46.45, 68.07, 69.87, 60.05, 61.4, 62.29, 63.92,
  62.79, 62.42, 61.7, 61.16, 62.24, 62.51, 68.61, 71.99,
];

const CAP_FIRST = CAP_DATA[0]!;
const SP_FIRST = SP500_CUM[0]!;
const CAP_CHART = CAP_DATA.map((v) => v - CAP_FIRST);
const SP_CHART = SP500_CUM.map((v) => v - SP_FIRST);

function fullDateLabel(i: number, lang: Lang): string {
  const startMonth = 3;
  const t = startMonth + i;
  const y = 2024 + Math.floor(t / 12);
  const m = t % 12;
  return `${MONTH_LABELS_SHORT[lang][m]!} ${y}`;
}

const CW = 960;
const CH = 300;
const PL = 50;
const PR = 180;
const PT = 12;
const PB = 28;

function buildLine(data: number[], maxV: number) {
  const uW = CW - PL - PR;
  const uH = CH - PT - PB;
  const pts = data.map((v, i) => ({
    x: PL + (i / (data.length - 1)) * uW,
    y: PT + uH - (v / maxV) * uH,
  }));
  const p0 = pts[0]!;
  let d = `M${p0.x},${p0.y}`;
  for (let i = 1; i < pts.length; i++) {
    const prev = pts[i - 1]!;
    const cur = pts[i]!;
    const cx = (prev.x + cur.x) / 2;
    d += ` C${cx},${prev.y} ${cx},${cur.y} ${cur.x},${cur.y}`;
  }
  const last = pts[pts.length - 1]!;
  return { d, endX: last.x, endY: last.y };
}

function buildChartData(chartLabels: string[]) {
  const peak = Math.max(...CAP_CHART, ...SP_CHART, 1);
  const maxV = Math.max(80, Math.ceil(peak / 10) * 10);

  const cap = buildLine(CAP_CHART, maxV);
  const sp = buildLine(SP_CHART, maxV);

  const uH = CH - PT - PB;
  const baselineY = PT + uH;
  const area = cap.d + ` L${cap.endX},${baselineY} L${PL},${baselineY} Z`;

  const grids: number[] = [];
  for (let v = 0; v <= maxV; v += 20) grids.push(PT + uH - (v / maxV) * uH);

  const yTicks = [];
  for (let v = 0; v <= maxV; v += 20) yTicks.push(v);
  const yLabels = yTicks.map((v) => ({ y: PT + uH - (v / maxV) * uH, text: `${v}%` }));

  const n = CAP_DATA.length;
  const xIdx: number[] = [];
  for (let i = 0; i < n; i += 6) xIdx.push(i);
  if (xIdx[xIdx.length - 1] !== n - 1) xIdx.push(n - 1);

  const xLabels = xIdx.map((i) => ({
    x: PL + (i / (n - 1)) * (CW - PL - PR),
    text: chartLabels[i]!,
  }));

  const capFinal = CAP_DATA[CAP_DATA.length - 1]!;
  const spFinalDelta = SP500_CUM[SP500_CUM.length - 1]! - SP_FIRST;

  return { cap, sp, area, grids, yLabels, xLabels, capFinal, spFinal: spFinalDelta };
}

function ChartUpIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M3 17l6-6 4 4 8-8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M17 7h4v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="3" y="4" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="1.5" />
      <path d="M3 9h18M8 2v4M16 2v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function ShieldSmIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M12 2L4 6v5c0 5.25 3.4 10.15 8 11.25 4.6-1.1 8-6 8-11.25V6l-8-4z" stroke="currentColor" strokeWidth="1.5" />
      <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="1.5" />
      <path d="M2 21v-2a4 4 0 014-4h6a4 4 0 014 4v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="17" cy="7" r="3" stroke="currentColor" strokeWidth="1.5" />
      <path d="M21 21v-2a3 3 0 00-2-2.83" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function CheckStripIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden className={c("verifyStripIcon")}>
      <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function useCursorGlow(opts?: { radius?: number; alpha?: number }) {
  const radius = opts?.radius ?? 280;
  const alpha = opts?.alpha ?? 0.1;
  const ref = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  const onMove = useCallback(
    (e: ReactMouseEvent<HTMLDivElement>) => {
      if (!ref.current || !glowRef.current) return;
      const rect = ref.current.getBoundingClientRect();
      glowRef.current.style.background =
        `radial-gradient(circle ${radius}px at ${e.clientX - rect.left}px ${e.clientY - rect.top}px, rgba(212,175,55,${alpha}), transparent 40%)`;
    },
    [radius, alpha],
  );

  return { ref, glowRef, onMove };
}

function useCountUp(end: number, suffix = "") {
  const [val, setVal] = useState("0" + suffix);
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;
    const t0 = performance.now();

    function tick(now: number) {
      const p = Math.min((now - t0) / 1400, 1);
      const e = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(e * end) + suffix);
      if (p < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  }, [end, suffix]);

  return val;
}

function KpiCard({ icon, value, label, sub }: { icon: React.ReactNode; value: string; label: string; sub: string }) {
  return (
    <div className={c("kpiCard")}>
      <div className={c("kpiIcon")}>{icon}</div>
      <span className={c("kpiValue")}>{value}</span>
      <span className={c("kpiLabel")}>{label}</span>
      <span className={c("kpiSub")}>{sub}</span>
    </div>
  );
}

function ChartView({ chartLabels }: { chartLabels: string[] }) {
  const capRef = useRef<SVGPathElement>(null);
  const spRef = useRef<SVGPathElement>(null);
  const [capPl, setCapPl] = useState(2000);
  const [spPl, setSpPl] = useState(2000);
  const { cap, sp, area, grids, yLabels, xLabels, capFinal, spFinal } = buildChartData(chartLabels);

  useEffect(() => {
    if (capRef.current) setCapPl(capRef.current.getTotalLength());
    if (spRef.current) setSpPl(spRef.current.getTotalLength());
  }, []);

  const capEndLeft = `${(cap.endX / CW) * 100}%`;
  const capEndTop = `${(cap.endY / CH) * 100}%`;
  const spEndLeft = `${(sp.endX / CW) * 100}%`;
  const spEndTop = `${(sp.endY / CH) * 100}%`;

  return (
    <div className={c("chartInner")}>
      <svg className={c("chartSvg")} viewBox={`0 0 ${CW} ${CH}`} preserveAspectRatio="none">
        <defs>
          <linearGradient id="perf_line_grad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#c9a84e" />
            <stop offset="50%" stopColor="#f5e6a3" />
            <stop offset="100%" stopColor="#e2ca7b" />
          </linearGradient>
          <linearGradient id="perf_area_grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#e2ca7b" />
            <stop offset="100%" stopColor="#e2ca7b" stopOpacity="0" />
          </linearGradient>
        </defs>

        {grids.map((y, i) => (
          <line key={i} className={c("chartGrid")} x1={PL} y1={y} x2={CW - PR} y2={y} />
        ))}
        {yLabels.map((l, i) => (
          <text key={i} className={c("chartLabel")} x={PL - 8} y={l.y + 4} textAnchor="end">
            {l.text}
          </text>
        ))}
        {xLabels.map((l, i) => (
          <text key={i} className={c("chartLabelAxis")} x={l.x} y={CH - 4} textAnchor="middle">
            {l.text}
          </text>
        ))}

        <path ref={spRef} className={`${c("chartLineSp")} ${c("chartDrawSp")}`} d={sp.d} style={{ "--path-length": spPl } as React.CSSProperties} />
        <path className={`${c("chartArea")} ${c("chartAreaDraw")}`} d={area} fill="url(#perf_area_grad)" />
        <path ref={capRef} className={`${c("chartLine")} ${c("chartDraw")}`} d={cap.d} style={{ "--path-length": capPl } as React.CSSProperties} />
      </svg>

      <div className={`${c("chartEndpoint")} ${c("chartEndpointCap")}`} style={{ left: capEndLeft, top: capEndTop, transform: "translate(18px, -50%)" }}>
        <img className={c("endpointIcon")} src="/CAPITALIFE_ICON.png" alt="" />
        <span className={c("endpointValueGold")}>+{capFinal.toFixed(0)}%</span>
      </div>

      <div className={`${c("chartEndpoint")} ${c("chartEndpointSp")}`} style={{ left: spEndLeft, top: spEndTop, transform: "translate(18px, -50%)" }}>
        <img className={c("endpointIconSp")} src="/sp500.png" alt="S&P 500" />
        <span className={c("endpointValueGray")}>+{spFinal.toFixed(1)}%</span>
      </div>
    </div>
  );
}

function CompactTable({
  visible,
  copy,
  monthLabels,
}: {
  visible: boolean;
  copy: PerformanceCopy;
  monthLabels: string[];
}) {
  const years: { year: string; data: Record<string, MonthEntry>; total: number }[] = [
    { year: "2024", data: DATA_2024, total: YEARLY_TOTALS["2024"]! },
    { year: "2025", data: DATA_2025, total: YEARLY_TOTALS["2025"]! },
    { year: "2026", data: DATA_2026, total: YEARLY_TOTALS["2026"]! },
  ];

  return (
    <div className={c("compactTable")}>
      <div className={c("tableArea")}>
        <div className={c("yearRow")}>
          <span className={c("yearLabel")} />
          <div className={c("monthGrid")}>
            {monthLabels.map((m) => (
              <span key={m} className={c("monthHeader")}>
                {m}
              </span>
            ))}
            <span className={c("totalLabel")}>{copy.ytd}</span>
          </div>
        </div>

        {years.map((yr, yi) => (
          <div
            key={yr.year}
            className={`${c("yearRow")} ${c("yearRowData")} ${visible ? c("tableRowAnim") : ""}`}
            style={{ animationDelay: visible ? `${yi * 120}ms` : "0ms" }}
          >
            <span className={c("yearLabel")}>{yr.year}</span>
            <div className={c("monthGrid")}>
              {MONTH_KEYS.map((key, idx) => {
                const entry = yr.data[key];
                if (!entry) {
                  return (
                    <span key={key} className={`${c("monthCell")} ${c("cellEmpty")}`}>
                      —
                    </span>
                  );
                }

                const val = entry.monthReturn;
                const cls = val >= 0 ? c("cellPos") : c("cellNeg");
                return (
                  <span key={`${key}-${monthLabels[idx]}`} className={`${c("monthCell")} ${cls}`}>
                    {val >= 0 ? "+" : ""}
                    {val.toFixed(1)}
                  </span>
                );
              })}
              <span className={c("totalCell")}>+{yr.total.toFixed(1)}%</span>
            </div>
          </div>
        ))}
      </div>

      <div className={`${c("tableVerifyStrip")} ${visible ? c("tableVerifyStripIn") : ""}`}>
        <CheckStripIcon />
        <span className={c("tableVerifyLabel")}>{copy.verifiedData}</span>
        <img className={`${c("tableVerifyLogo")} ${c("tableVerifyLogoDarwinex")}`} src="/Darwinex.png" alt="Darwinex" />
        <img className={c("tableVerifyLogo")} src="/Myfxbook.png" alt="Myfxbook" />
      </div>
    </div>
  );
}

const AUTO_SWITCH_MS = 5000;

export function Performance() {
  const { lang } = useLanguage();
  const copy = COPY[lang];
  const monthLabels = MONTH_LABELS_SHORT[lang];
  const chartLabels = useMemo(() => CAP_DATA.map((_, i) => fullDateLabel(i, lang)), [lang]);

  const [mode, setMode] = useState<"chart" | "table">("chart");
  const [isHovered, setIsHovered] = useState(false);

  const elapsedMsRef = useRef(0);
  const panelHoverRef = useRef(false);
  const lastFrameRef = useRef(0);

  const rightGlow = useCursorGlow({ radius: 300, alpha: 0.09 });

  const totalReturn = useCountUp(72, "%");
  const drawdown = useCountUp(11, "%");
  const investors = useCountUp(50, "+");

  useEffect(() => {
    let alive = true;
    let rafId = 0;
    lastFrameRef.current = performance.now();

    const tick = (now: number) => {
      if (!alive) return;

      const rawDt = now - lastFrameRef.current;
      lastFrameRef.current = now;
      const dt = Math.min(Math.max(rawDt, 0), 80);

      if (!panelHoverRef.current) {
        elapsedMsRef.current += dt;
        if (elapsedMsRef.current >= AUTO_SWITCH_MS) {
          elapsedMsRef.current = 0;
          setMode((v) => (v === "chart" ? "table" : "chart"));
        }
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => {
      alive = false;
      cancelAnimationFrame(rafId);
    };
  }, []);

  const handleChartTableEnter = useCallback(() => {
    panelHoverRef.current = true;
    setIsHovered(true);
  }, []);

  const handleChartTableLeave = useCallback(() => {
    panelHoverRef.current = false;
    setIsHovered(false);
    lastFrameRef.current = performance.now();
  }, []);

  const handleToggle = useCallback(() => {
    elapsedMsRef.current = 0;
    setMode((v) => (v === "chart" ? "table" : "chart"));
    lastFrameRef.current = performance.now();
  }, []);

  const isTable = mode === "table";

  return (
    <section className={c("section")} id="performance">
      <div className={c("sectionBg")} aria-hidden />
      <div className={c("inner")}>
        <div className={c("header")}>
          <div className={c("label")}>
            <span className={c("labelShine")} />
            <span className={c("labelDot")} />
            <span className={c("labelText")}>{copy.badge}</span>
          </div>
          <h2 className={c("title")}>{copy.title}</h2>
        </div>

        <div className={c("grid")}>
          <div className={c("kpiGrid")}>
            <KpiCard icon={<ChartUpIcon />} value={`+${totalReturn}`} label={copy.kpis[0]!.label} sub={copy.kpis[0]!.sub} />
            <KpiCard icon={<CalendarIcon />} value="2Y+" label={copy.kpis[1]!.label} sub={copy.kpis[1]!.sub} />
            <KpiCard icon={<ShieldSmIcon />} value={drawdown} label={copy.kpis[2]!.label} sub={copy.kpis[2]!.sub} />
            <KpiCard icon={<UsersIcon />} value={investors} label={copy.kpis[3]!.label} sub={copy.kpis[3]!.sub} />
          </div>

          <div className={c("rightPanel")} ref={rightGlow.ref} onMouseMove={rightGlow.onMove}>
            <div className={c("cursorGlow")} ref={rightGlow.glowRef} />
            <div className={c("panelHeader")}>
              <div
                className={c("toggle")}
                onClick={handleToggle}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleToggle();
                  }
                }}
                role="button"
                tabIndex={0}
              >
                <div className={`${c("toggleSlider")} ${isTable ? c("toggleSliderRight") : ""}`} />
                <span className={`${c("toggleLabel")} ${!isTable ? c("toggleLabelActive") : ""}`}>{copy.toggleChart}</span>
                <span className={`${c("toggleLabel")} ${isTable ? c("toggleLabelActive") : ""}`}>{copy.toggleTable}</span>
              </div>
            </div>

            <div className={c("viewContainer")} onMouseEnter={handleChartTableEnter} onMouseLeave={handleChartTableLeave}>
              <div className={`${c("progressBar")} ${isHovered ? c("progressBarPaused") : ""}`} />

              <div className={`${c("viewSlide")} ${isTable ? c("viewSlideLeft") : c("viewSlideCenter")}`}>
                <ChartView chartLabels={chartLabels} />
              </div>

              <div className={`${c("viewSlide")} ${!isTable ? c("viewSlideRight") : c("viewSlideCenter")}`}>
                <CompactTable visible={isTable} copy={copy} monthLabels={monthLabels} />
              </div>
            </div>
          </div>
        </div>

        <div style={{ height: 24 }} />
      </div>
    </section>
  );
}
