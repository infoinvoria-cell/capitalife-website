"use client";

import type { CSSProperties, ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import raw from "./MacroStrategy.module.css";

function m(name: string): string {
  return (raw as Record<string, string>)[name] ?? "";
}

const subtext =
  "A quantitative macro strategy built for multi-asset diversification and disciplined, data-driven allocation across global markets—engineered for institutional-grade capital deployment.";

const features: { icon: ReactNode; title: string; sub: string }[] = [
  {
    icon: <IconCommodity />,
    title: "Commodities",
    sub: "Global supply & demand dynamics",
  },
  {
    icon: <IconEquity />,
    title: "Equities",
    sub: "Major indices & leadership names",
  },
  {
    icon: <IconForex />,
    title: "Forex",
    sub: "Macro currency flows",
  },
  {
    icon: <IconMetal />,
    title: "Metals",
    sub: "Inflation & risk hedge",
  },
];

const markers: {
  id: string;
  style: CSSProperties;
  label: string;
  icon: ReactNode;
}[] = [
  {
    id: "us",
    style: { left: "12%", top: "32%" },
    label: "Equities",
    icon: <IconMarkerEquity />,
  },
  {
    id: "eu",
    style: { left: "43%", top: "24%" },
    label: "Forex",
    icon: <span className="text-lg font-semibold text-[#e2ca7a]">€</span>,
  },
  {
    id: "af",
    style: { left: "47%", top: "46%" },
    label: "Metals",
    icon: <IconMarkerMetal />,
  },
  {
    id: "sa",
    style: { left: "20%", top: "58%" },
    label: "Commodities",
    icon: <IconMarkerCommodity />,
  },
];

export function MacroStrategy() {
  const reduce = Boolean(useReducedMotion());

  return (
    <section
      id="strategy"
      style={{
        position: "relative",
        minHeight: "100vh",
        background: "rgba(255,0,0,0.1)",
      }}
      className="isolate w-full px-6 py-10 sm:px-8 sm:py-12 lg:py-14"
    >
      <div
        className="pointer-events-none absolute inset-0 z-0"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 85% 15%, rgba(212, 175, 55, 0.07), transparent 55%), radial-gradient(ellipse 55% 45% at 10% 85%, rgba(212, 175, 55, 0.055), transparent 58%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-[0.04] bg-hero-noise mix-blend-overlay"
        aria-hidden
      />

      <div className="relative z-10 mx-auto w-full max-w-[1580px]">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] lg:items-stretch lg:gap-12 xl:gap-14">
          <motion.div
            className="relative flex min-h-0 flex-col justify-center"
            initial={reduce ? false : { opacity: 0, y: 16 }}
            whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          >
            <img
              src="/CAPITALIFE_ICON.png"
              alt=""
              className="pointer-events-none absolute -left-4 top-1/2 w-48 -translate-y-1/2 opacity-[0.07] sm:w-56"
              aria-hidden
            />

            <div className="relative">
              <div className="relative mb-5 inline-flex h-8 items-center gap-2.5 overflow-hidden rounded-full border border-white/15 bg-gradient-to-r from-white/[0.07] to-white/[0.02] px-4">
                <motion.span
                  className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.12] to-transparent"
                  animate={reduce ? undefined : { x: ["-100%", "120%"] }}
                  transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut" }}
                />
                <span className="relative h-1.5 w-1.5 shrink-0 rounded-full bg-white/70 shadow-[0_0_8px_rgba(255,255,255,0.45)]" />
                <span className="relative font-[family-name:var(--font-inter),Inter,sans-serif] text-[11px] font-medium tracking-wide text-white/75">
                  Global Macro Strategy
                </span>
              </div>

              <h2 className="font-[family-name:var(--font-montserrat),Montserrat,sans-serif] text-3xl font-bold italic leading-[1.12] text-white sm:text-4xl lg:text-[2.35rem]">
                <span className="bg-gradient-to-r from-white via-white to-[#c9a84e] bg-clip-text text-transparent">
                  Trading Global Markets
                </span>
                <br />
                <span className="text-white/95">Across Asset Classes</span>
              </h2>

              <p className="mt-4 max-w-xl font-[family-name:var(--font-inter),Inter,sans-serif] text-sm leading-relaxed text-white/55 sm:text-[15px]">
                {subtext}
              </p>

              <ul className="mt-6 space-y-3.5">
                {features.map((f) => (
                  <li key={f.title} className="flex gap-3">
                    <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#e2ca7b]/20 bg-[#e2ca7b]/[0.07] text-[#e2ca7b]">
                      {f.icon}
                    </span>
                    <div>
                      <p className="font-[family-name:var(--font-inter),Inter,sans-serif] text-sm font-semibold text-white/85">
                        {f.title}
                      </p>
                      <p className="font-[family-name:var(--font-inter),Inter,sans-serif] text-xs text-white/48">
                        {f.sub}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="mt-8 flex flex-wrap items-center gap-5 border-t border-white/[0.07] pt-6">
                <img src="/Tradingview.png" alt="TradingView" className="h-6 w-auto opacity-80 sm:h-7" />
                <div className="h-5 w-px bg-white/15" aria-hidden />
                <span className="font-[family-name:var(--font-inter),Inter,sans-serif] text-[11px] font-bold uppercase tracking-[0.22em] text-white/70">
                  NASDAQ
                </span>
                <p className="w-full basis-full font-[family-name:var(--font-inter),Inter,sans-serif] text-xs leading-snug text-white/45 sm:basis-auto sm:pl-2">
                  Data-driven execution using institutional-grade market data
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="relative min-h-[300px] lg:min-h-0"
            initial={reduce ? false : { opacity: 0, scale: 0.98 }}
            whileInView={reduce ? undefined : { opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          >
            <div
              className="relative h-full min-h-[300px] overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-br from-white/[0.04] to-transparent shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_16px_48px_rgba(0,0,0,0.45)] backdrop-blur-md lg:min-h-[420px]"
              style={{ perspective: "1200px" }}
            >
              <div
                className="absolute inset-0 rounded-2xl"
                style={{
                  background:
                    "radial-gradient(circle at 75% 20%, rgba(212, 175, 55, 0.12), transparent 45%)",
                }}
              />
              <div className={`relative h-full w-full overflow-hidden rounded-2xl ${m("mapInner")}`}>
                <img
                  src="/world-map-macro.svg"
                  alt=""
                  className="h-full w-full object-cover object-center opacity-95"
                  aria-hidden
                />
              </div>

              {markers.map((m, i) => (
                <MapMarker key={m.id} marker={m} index={i} reduce={reduce} />
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function MapMarker({
  marker,
  index,
  reduce,
}: {
  marker: (typeof markers)[0];
  index: number;
  reduce: boolean;
}) {
  return (
    <motion.div
      className="absolute z-10 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1"
      style={marker.style}
      initial={reduce ? false : { opacity: 0, scale: 0.85 }}
      whileInView={reduce ? undefined : { opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: reduce ? 0 : 0.35 + index * 0.12, duration: 0.45, ease: "easeOut" }}
    >
      <motion.div
        className="group flex flex-col items-center gap-1 rounded-xl border border-white/12 bg-black/50 px-2.5 py-2 shadow-[0_0_20px_rgba(212,175,55,0.08)] backdrop-blur-md"
        whileHover={
          reduce
            ? undefined
            : {
                scale: 1.05,
                boxShadow: "0 0 28px rgba(212, 175, 55, 0.2), 0 0 0 1px rgba(212, 175, 55, 0.15)",
              }
        }
        transition={{ type: "spring", stiffness: 400, damping: 24 }}
      >
        <div className="flex h-9 w-9 items-center justify-center text-white/90">{marker.icon}</div>
        <span className="font-[family-name:var(--font-inter),Inter,sans-serif] text-[10px] font-semibold uppercase tracking-wider text-white/50 transition-colors group-hover:text-[#f0e4bc]">
          {marker.label}
        </span>
      </motion.div>
    </motion.div>
  );
}

function IconCommodity() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M4 16l4-8 4 5 4-9 4 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function IconEquity() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M4 18V6M8 18v-5M12 18V9M16 18v-3M20 18V4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
function IconForex() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M8 7h12M8 12h8M8 17h12M4 7h.01M4 12h.01M4 17h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
function IconMetal() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="5" y="8" width="14" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 8V6a4 4 0 018 0v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
function IconMarkerEquity() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M4 16l4-6 3 3 5-8 4 6" stroke="#e2ca7b" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="19" cy="8" r="1.5" fill="#e2ca7b" />
    </svg>
  );
}
function IconMarkerMetal() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M12 3l8 5v8l-8 5-8-5V8l8-5z" stroke="#c0c0c0" strokeWidth="1.4" strokeLinejoin="round" />
      <path d="M12 8v8M8 10l8 4M8 14l8-4" stroke="#e2ca7b" strokeWidth="1.2" strokeLinecap="round" opacity="0.7" />
    </svg>
  );
}
function IconMarkerCommodity() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="13" r="6" fill="#c87f2a" opacity="0.85" />
      <path d="M12 7c-1.5 0-2.5-1-2-3h4c.5 2-.5 3-2 3z" fill="#6b9e4e" opacity="0.9" />
    </svg>
  );
}

export default MacroStrategy;
