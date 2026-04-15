"use client";

import Link from "next/link";
import { type ReactNode, useCallback, useEffect, useMemo, useRef, useState } from "react";

import { useLanguage, type Lang } from "@/lib/i18n/language";
import heroRaw from "./hero.module.css";

function h(name: string): string {
  return (heroRaw as Record<string, string>)[name] ?? "";
}

const PARTNER_LOGOS = ["/Invoria_partner.png", "/Levantis_partner.png", "/Vorsorgeplaner_partner.png"];

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   TYPES
   â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */

type T = Record<Lang, string>;
type Profile = "conservative" | "balanced" | "growth";
type PartnerType = "retail" | "institutional";

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   BILINGUAL CONTENT
   â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */

const TX = {
  hero: {
    pill: { de: "Partnerprogramm", en: "Partner Program" } as T,
    h1a: { de: "Wachsen Sie mit uns als", en: "Grow With Us as a" } as T,
    h1b: { de: "strategischer Partner", en: "Strategic Partner" } as T,
    sub: {
      de: "Werden Sie exklusiver Partner von Capitalife und profitieren Sie von einem fairen Win-Win-Modell auf institutionellem Niveau.",
      en: "Become an exclusive partner of Capitalife and benefit from a structured win-win model built to institutional standards.",
    } as T,
    cta1: { de: "Partner werden", en: "Become a Partner" } as T,
    cta2: { de: "Mehr erfahren", en: "Learn More" } as T,
  },
  overview: {
    pill: { de: "Partnermodell", en: "Partner Model" } as T,
    h2a: { de: "Gemeinsam wachsen", en: "Grow together" } as T,
    h2b: { de: "mit Ihrem Netzwerk", en: "with your network" } as T,
    intro: {
      de: "Als Partner verdienen Sie an dem Gewinn von Capitalife. Ihr Anteil kommt direkt aus unserem Gewinn, ohne zusätzliche Kosten für Investoren.",
      en: "As a partner, you earn from Capitalife’s performance. Your share comes from our side, not from investors.",
    } as T,
    kpis: [
      { val: { de: "Bis zu 80%", en: "Up to 80%" } as T, desc: { de: "Bis zu 80% Anteil unseres Gewinns", en: "Earn up to 80% share of our performance" } as T },
      { val: { de: "30%", en: "30%" } as T, desc: { de: "Standardbeteiligung f\u00FCr qualifizierte Partner", en: "Standard participation for qualified partners" } as T },
      { val: { de: "Premium", en: "Premium" } as T, desc: { de: "Individuelle Partnermodelle f\u00FCr gro\u00DFe Netzwerke", en: "Custom partnership structures for high-volume networks" } as T },
    ],
    cta: { de: "Jetzt als Partner starten", en: "Start Earning with Us" } as T,
    cards: [
      { title: { de: "F\u00FCr wen gedacht", en: "Who It's For" } as T, heading: { de: "Tippgeber & Partner", en: "Referrers & Partners" } as T, text: { de: "F\u00FCr Menschen mit Netzwerk und Vertrauen, die hochwertige Empfehlungen statt Massenvertrieb aufbauen.", en: "For individuals with trusted networks who build quality referrals over mass distribution." } as T },
      { title: { de: "Premiummodell", en: "Premium Model" } as T, heading: { de: "H\u00F6here Beteiligungen auf Anfrage", en: "Higher Participation on Request" } as T, text: { de: "F\u00FCr starke Netzwerke und ausgew\u00E4hlte Partner sind individuelle Modelle m\u00F6glich.", en: "For strong networks and selected partners, individual models are available." } as T },
      { title: { de: "Hinweis", en: "Note" } as T, heading: { de: "Vertrauliche Strukturen", en: "Confidential Structures" } as T, text: { de: "Interne Verg\u00FCtungsstrukturen werden vertraulich behandelt.", en: "Internal compensation structures are handled confidentially." } as T },
    ],
  },
  model: {
    pill: { de: "So funktioniert das Modell", en: "How the Model Works" } as T,
    h2a: { de: "Einfach erkl\u00E4rt.", en: "Simple in structure." } as T,
    h2b: { de: "Partnerschaftlich gedacht.", en: "Built for partnership." } as T,
    text: {
      de: "Einfach, transparent und auf Performance ausgelegt \u2014 Sie verdienen nur, wenn Ergebnisse entstehen.",
      en: "Simple, transparent and built around performance \u2014 you only earn when results are generated.",
    } as T,
    steps: [
      { title: { de: "Investor bindet Kapital", en: "Investor connects capital" } as T, desc: { de: "Kapital wird mit der Strategie verbunden.", en: "Capital is connected to the strategy." } as T },
      { title: { de: "Performance entsteht", en: "Performance is generated" } as T, desc: { de: "Ergebnisse entstehen im Markt.", en: "Results are generated in the market." } as T },
      { title: { de: "Gewinn wird mit Ihnen geteilt", en: "Profit is shared with you" } as T, desc: { de: "Sie partizipieren am Erfolgsanteil.", en: "You participate in the performance share." } as T },
    ],
  },
  calc: {
    pill: { de: "Partner-Rechner", en: "Partnership Calculator" } as T,
    h2a: { de: "Beispielhafte", en: "Illustrative" } as T,
    h2b: { de: "Ergebnisse", en: "Returns" } as T,
    intro: {
      de: "Sch\u00E4tzen Sie Ihr Potenzial anhand von Investorenkapital und Beteiligungsniveau.",
      en: "Estimate your potential earnings based on investor capital and participation level.",
    } as T,
    bullets: [
      { de: "Rein leistungsbasiertes Modell", en: "Fully performance-based model" } as T,
      { de: "Keine Vorabkosten oder Risiko", en: "No upfront costs or risk" } as T,
      { de: "Skaliert mit Ihrem Netzwerk", en: "Scales with your network" } as T,
      { de: "F\u00FCr langfristige Partnerschaften gebaut", en: "Built for long-term partnerships" } as T,
    ],
    ctaPartner: { de: "Partnerzugang anfragen", en: "Get Your Partner Access" } as T,
    capitalLabel: { de: "Investorkapital", en: "Investor Capital" } as T,
    factorLabel: { de: "Investmentfaktor", en: "Investment Factor" } as T,
    partnerTypeLabel: { de: "Partnertyp", en: "Partner Type" } as T,
    retail: { de: "Retail Partner", en: "Retail Partner" } as T,
    retailRange: { de: "\u20AC5.000 \u2013 \u20AC100.000", en: "\u20AC5,000 \u2013 \u20AC100,000" } as T,
    retailText: { de: "F\u00FCr Einzelpartner (Allokationen \u20AC5.000 \u2013 \u20AC100.000)", en: "For individual partners (\u20AC5k \u2013 \u20AC100k allocations)" } as T,
    instLabel: { de: "Institutionell", en: "Institutional" } as T,
    instRange: { de: "\u20AC100.000+", en: "\u20AC100,000+" } as T,
    instText: { de: "F\u00FCr professionelle Netzwerke (Allokationen \u20AC100.000+)", en: "For professional networks (\u20AC100k+ allocations)" } as T,
    resultPool: { de: "Performance-Pool (25\u00A0%)", en: "Performance Pool (25%)" } as T,
    resultPartner: { de: "Ihr Anteil", en: "Your Share" } as T,
    resultCapitalife: { de: "Capitalife-Anteil", en: "Capitalife Share" } as T,
  },
  premium: {
    pill: { de: "Ausgew\u00E4hlte strategische Partner", en: "Selected Strategic Partners" } as T,
    h2a: { de: "Premium-Partner", en: "Premium Partnerships" } as T,
    h2b: { de: "auf Anfrage", en: "on Request" } as T,
    text: { de: "F\u00FCr etablierte Netzwerke und institutionelle Partner bieten wir ma\u00DFgeschneiderte Partnerstrukturen mit h\u00F6herer Beteiligung.", en: "For established networks and institutional partners, we offer tailored partnership structures with higher participation." } as T,
    cta: { de: "Premium-Partnerschaft beantragen", en: "Apply for Premium Partnership" } as T,
    ctaSub: { de: "Begrenzte Verf\u00FCgbarkeit f\u00FCr ausgew\u00E4hlte Partner", en: "Limited availability for selected partners" } as T,
    trusted: { de: "Vertrauenspartner", en: "Trusted Partners" } as T,
    trustMicro: { de: "Vertrauen von professionellen Netzwerken und institutionellen Partnern", en: "Trusted by professional networks and institutional allocators" } as T,
  },
  profiles: {
    conservative: { de: "Konservativ", en: "Conservative" } as T,
    balanced: { de: "Ausgewogen", en: "Balanced" } as T,
    growth: { de: "Kapitalorientiert", en: "Growth-Oriented" } as T,
  },
};

const PROFILE_FACTOR: Record<Profile, number> = { conservative: 1, balanced: 1.5, growth: 2 };
const POOL_PCT: Record<PartnerType, number> = { retail: 0.40, institutional: 0.60 };

/* Section spacing: ~100px mobile, ~120px desktop */
const SEC = "relative mx-auto max-w-[1400px] px-6 pt-[100px] md:px-10 md:pt-[120px]";

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   UTILITIES
   â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */

function fmtEuro(n: number, lang: Lang): string {
  return new Intl.NumberFormat(lang === "de" ? "de-DE" : "en-US", {
    style: "currency", currency: "EUR", maximumFractionDigits: 0,
  }).format(n);
}

function sliderToCapital(pct: number): number {
  if (pct <= 50) return Math.round((5000 + (pct / 50) * 45000) / 1000) * 1000;
  if (pct <= 80) return Math.round((50000 + ((pct - 50) / 30) * 200000) / 5000) * 5000;
  return Math.round((250000 + ((pct - 80) / 20) * 750000) / 25000) * 25000;
}

function capitalToSlider(cap: number): number {
  if (cap <= 50000) return Math.max(0, ((cap - 5000) / 45000) * 50);
  if (cap <= 250000) return 50 + ((cap - 50000) / 200000) * 30;
  return 80 + ((cap - 250000) / 750000) * 20;
}

function clampCap(n: number): number {
  return Math.max(5000, Math.min(1000000, Math.round(n / 1000) * 1000));
}

function useCountUp(target: number, dur = 500): number {
  const [val, setVal] = useState(target);
  const prev = useRef(target);
  useEffect(() => {
    const from = prev.current;
    if (from === target) return;
    const t0 = performance.now();
    let raf: number;
    const tick = (now: number) => {
      const p = Math.min((now - t0) / dur, 1);
      setVal(Math.round(from + (target - from) * (1 - (1 - p) ** 3)));
      if (p < 1) raf = requestAnimationFrame(tick);
      else prev.current = target;
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, dur]);
  return val;
}

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   SHARED UI
   â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */

function Glass({ children, className = "", hover = false }: { children: ReactNode; className?: string; hover?: boolean }) {
  return (
    <div className={[
      "rounded-2xl border border-white/[0.07] bg-white/[0.025] backdrop-blur-lg",
      hover && "transition-all duration-300 hover:border-white/15 hover:bg-white/[0.05] hover:shadow-[0_0_40px_rgba(217,194,122,0.06)] hover:-translate-y-0.5",
      className,
    ].filter(Boolean).join(" ")}>{children}</div>
  );
}

function Pill({ children }: { children: ReactNode }) {
  return (
    <div className="pill-glow inline-flex items-center gap-2.5 rounded-full border border-white/15 bg-white/[0.06] px-5 py-2 text-sm tracking-wide text-white/70 backdrop-blur-xl">
      <span className="h-1.5 w-1.5 rounded-full bg-[#d9c27a] shadow-[0_0_10px_rgba(217,194,122,0.5)]" />
      {children}
    </div>
  );
}

/** Primary gold CTA â€” matches hero â€œBecome a Partnerâ€ button */
function GoldCta({ href, children, className = "" }: { href: string; children: ReactNode; className?: string }) {
  return (
    <a href={href} className={`${h("btnPartner")} ${className}`.trim()}>
      <span className={h("btnShine")} />
      <svg className={h("btnIconPartner")} width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path d="M12 2.5l2.5 5.5h6l-4.8 3.7 1.8 5.8L12 13.8l-5.5 3.7 1.8-5.8L3.5 8h6L12 2.5z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" fill="none" />
      </svg>
      <span className={h("btnText")}>{children}</span>
    </a>
  );
}

function FadeIn({ children, className = "", delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver((entries) => {
      const e = entries[0];
      if (e?.isIntersecting) {
        setVis(true);
        io.disconnect();
      }
    }, { threshold: 0.08, rootMargin: "0px 0px -30px 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} style={{ transitionDelay: `${delay}ms` }} className={`transition-all duration-700 ease-out ${vis ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"} ${className}`}>
      {children}
    </div>
  );
}

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   ICONS
   â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */

const SK = { fill: "none", stroke: "currentColor", strokeWidth: 1.5, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

/* Outline icons (24px) for general use */
function IcoPartner() { return <svg width="24" height="24" viewBox="0 0 24 24" {...SK}><path d="M16 21v-1a4 4 0 00-4-4H8a4 4 0 00-4 4v1" /><circle cx="10" cy="8" r="4" /><path d="M20 8v6M23 11h-6" /></svg>; }
function IcoRocket() { return <svg width="24" height="24" viewBox="0 0 24 24" {...SK}><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 00-2.91-.09z" /><path d="M12 15l-3-3a22 22 0 012-3.95A12.88 12.88 0 0122 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 01-4 2z" /></svg>; }
function IcoChart() { return <svg width="24" height="24" viewBox="0 0 24 24" {...SK}><path d="M3 3v18h18" /><path d="M7 16l4-8 4 5 5-9" /></svg>; }
function IcoPie() { return <svg width="24" height="24" viewBox="0 0 24 24" {...SK}><path d="M21 12A9 9 0 1112 3v9h9z" /><path d="M21.18 8.02A9 9 0 0015.97 2.82L16 12h5.18z" /></svg>; }
function IcoTrending() { return <svg width="24" height="24" viewBox="0 0 24 24" {...SK}><path d="M23 6l-9.5 9.5-5-5L1 18" /><path d="M17 6h6v6" /></svg>; }
function IcoShield() { return <svg width="24" height="24" viewBox="0 0 24 24" {...SK}><path d="M12 2l7 4v5c0 5.25-3.5 9.74-7 11-3.5-1.26-7-5.75-7-11V6l7-4z" /></svg>; }

/* Solid gold icons (28px) for KPI cards */
function IcoStarSolid() { return <svg width="28" height="28" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.27 5.82 21 7 14.14l-5-4.87 6.91-1.01L12 2z" fill="currentColor" /></svg>; }
function IcoShieldSolid() { return <svg width="28" height="28" viewBox="0 0 24 24"><path d="M12 2l7 4v5c0 5.25-3.5 9.74-7 11-3.5-1.26-7-5.75-7-11V6l7-4z" fill="currentColor" /></svg>; }
function IcoDiamondSolid() { return <svg width="28" height="28" viewBox="0 0 24 24"><path d="M6 3h12l3 6-9 12L3 9l3-6z" fill="currentColor" /></svg>; }

const KPI_ICONS_SOLID = [<IcoStarSolid key="s" />, <IcoShieldSolid key="sh" />, <IcoDiamondSolid key="d" />];
const FACTOR_ICONS = [<IcoShield key="c" />, <IcoChart key="b" />, <IcoTrending key="g" />];

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   PAGE
   â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */

export default function PartnerProgramPage() {
  const { lang, setLang } = useLanguage();
  const [capital, setCapital] = useState(10_000);
  const [profile, setProfile] = useState<Profile>("balanced");
  const [editCap, setEditCap] = useState(false);
  const [rawCap, setRawCap] = useState("10000");

  /* Partner type is DERIVED from capital â€” not independent state */
  const partnerType: PartnerType = capital >= 100_000 ? "institutional" : "retail";

  const sliderPct = capitalToSlider(capital);

  const onSlider = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setCapital(sliderToCapital(Number(e.target.value)));
  }, []);

  const onPartnerType = useCallback((pt: PartnerType) => {
    if (pt === "institutional" && capital < 100_000) {
      setCapital(100_000);
    } else if (pt === "retail" && capital >= 100_000) {
      setCapital(99_000);
    }
  }, [capital]);

  const calc = useMemo(() => {
    const rate = 0.3 * PROFILE_FACTOR[profile];
    const gross = capital * rate;
    const pool = gross * 0.25;
    const poolPct = POOL_PCT[partnerType];
    const partner = pool * poolPct;
    const capitalife = pool - partner;
    return { rate, pool, partner, capitalife, poolPct };
  }, [capital, profile, partnerType]);

  const aPool = useCountUp(calc.pool);
  const aPartner = useCountUp(calc.partner);
  const aCapitalife = useCountUp(calc.capitalife);

  const t = useCallback(<K extends T>(obj: K) => obj[lang], [lang]);
  const navText = useMemo(
    () => ({
      home: lang === "de" ? "Start" : "Home",
      performance: "Performance",
      strategy: lang === "de" ? "Strategie" : "Strategy",
      about: lang === "de" ? "\u00DCber uns" : "About us",
      partner: lang === "de" ? "Partnerprogramm" : "Partner Program",
      cta: lang === "de" ? "Jetzt starten" : "Get Started",
    }),
    [lang],
  );

  return (
    <main className="relative min-h-screen overflow-x-hidden text-white" style={{ background: "#0f0f0f" }}>
      {/* â”€â”€ Background glows â”€â”€ */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden>
        <div className="absolute -left-32 -top-32 h-[600px] w-[600px] rounded-full bg-[#d9c27a]/[0.03] blur-[160px]" />
        <div className="absolute -right-24 top-[25%] h-[500px] w-[500px] rounded-full bg-[#d9c27a]/[0.02] blur-[140px]" />
        <div className="absolute bottom-[10%] left-1/3 h-[400px] w-[400px] rounded-full bg-white/[0.01] blur-[130px]" />
      </div>

      {/* â”€â”€ Global CSS â”€â”€ */}
      <style>{`
        .cs{-webkit-appearance:none;appearance:none;background:transparent;cursor:pointer}
        .cs::-webkit-slider-runnable-track{height:6px;border-radius:3px;background:linear-gradient(90deg,rgba(217,194,122,.3),rgba(217,194,122,.08))}
        .cs::-webkit-slider-thumb{-webkit-appearance:none;height:22px;width:22px;border-radius:50%;background:#d9c27a;margin-top:-8px;box-shadow:0 0 12px rgba(217,194,122,.35);transition:box-shadow .2s}
        .cs::-webkit-slider-thumb:hover{box-shadow:0 0 22px rgba(217,194,122,.55)}
        .cs::-moz-range-track{height:6px;border-radius:3px;background:linear-gradient(90deg,rgba(217,194,122,.3),rgba(217,194,122,.08));border:0}
        .cs::-moz-range-thumb{height:22px;width:22px;border-radius:50%;background:#d9c27a;border:0;box-shadow:0 0 12px rgba(217,194,122,.35)}
        @keyframes pillGlow{0%,100%{opacity:.72}50%{opacity:1}}
        .pill-glow{animation:pillGlow 3s infinite ease-in-out}
        @keyframes marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}
        @keyframes iconGlow{0%,100%{filter:drop-shadow(0 0 0 transparent)}50%{filter:drop-shadow(0 0 6px rgba(217,194,122,.25))}}
        .ico-glow{animation:iconGlow 3s infinite ease-in-out}
        @keyframes iconPopIn{0%{opacity:0;transform:scale(.5)}100%{opacity:1;transform:scale(1)}}
        .ico-pop{animation:iconPopIn .6s ease-out both}
      `}</style>

      {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• SHARED WRAPPER: Hero + Overview (seamless background) â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
      <div
        style={{
          background: `linear-gradient(180deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.6) 35%, rgba(0,0,0,0.85) 55%, #0a0a0a 70%, #0f0f0f 100%), url('/partnerprogramm-background.png') center 180% / cover no-repeat`,
        }}
      >
        {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• HERO â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
        <section className={h("hero")}>
          <nav className={h("nav")}>
            <Link href="/"><img className={h("logoImg")} src="/Capitalife-text_logo.png" alt="Capitalife" /></Link>
            <div className={h("navLinks")}>
              <Link href="/" className={h("navLink")}>{navText.home}</Link>
              <Link href="/#performance" className={h("navLink")}>{navText.performance}</Link>
              <Link href="/#strategy" className={h("navLink")}>{navText.strategy}</Link>
              <Link href="/#about" className={h("navLink")}>{navText.about}</Link>
              <span className={h("navLink")} style={{ color: "#fff" }}>{navText.partner}</span>
            </div>
            <div className={h("navRight")}>
              <div className={h("langToggle")}>
                {(["DE", "EN"] as const).map((code) => {
                  const l = code.toLowerCase() as Lang;
                  return (
                    <button key={code} onClick={() => setLang(l)} className={`${h("langBtn")} ${lang === l ? h("langActive") : ""}`}>
                      {code}
                    </button>
                  );
                })}
              </div>
              <Link href="/" className={h("navBtn")}>
                <img className={h("navBtnIcon")} src="/CAPITALIFE_ICON.png" alt="" width={16} height={18} aria-hidden />
                <span className={h("navBtnText")}>{navText.cta}</span>
              </Link>
            </div>
          </nav>
          <div className={h("content")}>
            <div className={h("label")}>
              <span className={h("labelShine")} />
              <span className={h("labelDot")} />
              <span className={h("labelText")}>{t(TX.hero.pill)}</span>
            </div>
            <h1 className={h("headline")}>
              <span className={h("h1")}>{t(TX.hero.h1a)}</span>
              <span className={h("h2")}>{t(TX.hero.h1b)}</span>
            </h1>
            <p className={`${h("sub")} ${lang === "de" ? h("subDe") : ""}`}>{t(TX.hero.sub)}</p>
            <div className={h("buttons")}>
              <a href="mailto:info@capitalife.co?subject=Partner%20Program" className={h("btnPartner")}>
                <span className={h("btnShine")} />
                <svg className={h("btnIconPartner")} width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path d="M12 2.5l2.5 5.5h6l-4.8 3.7 1.8 5.8L12 13.8l-5.5 3.7 1.8-5.8L3.5 8h6L12 2.5z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" fill="none" />
                </svg>
                <span className={h("btnText")}>{t(TX.hero.cta1)}</span>
              </a>
              <a href="#calculator" className={h("btnPartner")}>
                <span className={h("btnShine")} />
                <span className={h("btnText")}>{t(TX.hero.cta2)}</span>
              </a>
            </div>
          </div>
          {/* Partner trust slider */}
          <div
            className="relative z-[2] mt-auto w-full max-w-[780px] overflow-hidden pb-[100px]"
            style={{
              WebkitMaskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
              maskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
            }}
          >
            <div className="flex w-max items-center gap-[52px]" style={{ animation: "marquee 68s linear infinite" }}>
              {[...PARTNER_LOGOS, ...PARTNER_LOGOS, ...PARTNER_LOGOS, ...PARTNER_LOGOS].map((src, i) => (
                <img
                  key={i} src={src} alt=""
                  className="h-8 w-auto shrink-0 opacity-[0.45] transition-opacity duration-300 hover:opacity-80"
                />
              ))}
            </div>
          </div>
        </section>

        {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• OVERVIEW (inside shared wrapper â€” no cut) â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
        <section id="model" className={SEC}>
          <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr]">
            {/* Left */}
            <div>
              <FadeIn><Pill>{t(TX.overview.pill)}</Pill></FadeIn>
              <FadeIn delay={80}>
                <h2 className="mt-6 text-4xl font-bold leading-[1.12] tracking-[-0.03em] text-white md:text-5xl">
                  {t(TX.overview.h2a)}<br />
                  <span className="bg-gradient-to-b from-[#f5e6b8] to-[#c9a84c] bg-clip-text text-transparent">{t(TX.overview.h2b)}</span>
                </h2>
              </FadeIn>
              <FadeIn delay={160}><p className="mt-6 max-w-xl text-lg leading-[1.8] text-white/50">{t(TX.overview.intro)}</p></FadeIn>

              {/* KPI row: equal height, stretch, top-aligned content */}
              <div className="mt-10 grid grid-cols-1 items-stretch gap-6 sm:grid-cols-3">
                {TX.overview.kpis.map((k, i) => {
                  const isHighlight = i === 0;
                  return (
                    <FadeIn key={i} delay={240 + i * 100} className="h-full">
                      <div
                        className={`group flex h-full w-full min-h-[212px] flex-col rounded-2xl border p-6 backdrop-blur-lg transition-all duration-300 hover:-translate-y-0.5 ${
                          isHighlight
                            ? "border-[#d9c27a]/30 hover:border-[#d9c27a]/50"
                            : "border-white/[0.07] bg-white/[0.025] hover:border-white/15 hover:bg-white/[0.05]"
                        }`}
                        style={isHighlight ? {
                          background: "linear-gradient(135deg, rgba(217,194,122,0.12) 0%, rgba(217,194,122,0.04) 60%, rgba(217,194,122,0.08) 100%)",
                          boxShadow: "0 0 50px rgba(217,194,122,0.10), 0 0 20px rgba(217,194,122,0.06)",
                        } : undefined}
                      >
                        <div
                          className={`mb-3.5 inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${isHighlight ? "bg-[#d9c27a]/20 text-[#d9c27a]" : "bg-[#d9c27a]/10 text-[#d9c27a]"}`}
                          style={{ boxShadow: isHighlight ? "0 0 18px rgba(212,175,55,0.5)" : "0 0 12px rgba(212,175,55,0.3)" }}
                        >
                          {KPI_ICONS_SOLID[i]}
                        </div>
                        <div className="flex min-h-0 flex-1 flex-col">
                          <div className={`whitespace-nowrap text-3xl font-bold ${isHighlight ? "text-[#f5e6b8]" : "text-white"}`}>{t(k.val)}</div>
                          <p className="mt-2 text-xs leading-[1.7] text-white/40">{t(k.desc)}</p>
                        </div>
                      </div>
                    </FadeIn>
                  );
                })}
              </div>
              <FadeIn delay={360}>
                <div className="mt-10">
                  <GoldCta href="mailto:info@capitalife.co?subject=Partner%20Program">{t(TX.overview.cta)}</GoldCta>
                </div>
              </FadeIn>
            </div>

            {/* Right */}
            <div className="grid gap-5 self-start">
              {TX.overview.cards.map((c, i) => (
                <FadeIn key={i} delay={100 + i * 100}>
                  <Glass hover className="group p-6">
                    <div className="text-[11px] font-medium uppercase tracking-widest text-white/25">{t(c.title)}</div>
                    <div className="mt-2 text-xl font-bold leading-snug text-white">{t(c.heading)}</div>
                    <p className="mt-3 text-sm leading-[1.8] text-white/45">{t(c.text)}</p>
                  </Glass>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>
      </div>
      {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• END shared wrapper â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}

      {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• MODEL â€” centered layout â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
      <section className={SEC}>
        <div className="text-center">
          <FadeIn><Pill>{t(TX.model.pill)}</Pill></FadeIn>
          <FadeIn delay={80}>
            <h2 className="mt-6 text-4xl font-bold leading-[1.12] tracking-[-0.03em] text-white md:text-5xl">
              {t(TX.model.h2a)}<br />
              <span className="bg-gradient-to-b from-[#f5e6b8] to-[#c9a84c] bg-clip-text text-transparent">{t(TX.model.h2b)}</span>
            </h2>
          </FadeIn>
          <FadeIn delay={160}><p className="mx-auto mt-6 max-w-2xl text-lg leading-[1.8] text-white/50">{t(TX.model.text)}</p></FadeIn>
        </div>
        <FadeIn delay={200}>
          <div className="mt-14 grid gap-8 md:grid-cols-3">
            {TX.model.steps.map((s, i) => (
              <Glass hover key={i} className="group p-6 md:p-8">
                <span
                  className="ico-pop mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl border border-[#d9c27a]/15 bg-[#d9c27a]/[0.06] text-[#d9c27a]/70"
                  style={{ animationDelay: `${200 + i * 150}ms` }}
                >
                  {i === 0 ? <IcoRocket /> : i === 1 ? <IcoChart /> : <IcoPie />}
                </span>
                <div className="text-xs font-medium text-white/25">{String(i + 1).padStart(2, "0")}</div>
                <h3 className="mt-1 text-lg font-bold leading-snug text-white">{t(s.title)}</h3>
                <p className="mt-2 text-sm leading-[1.7] text-white/40">{t(s.desc)}</p>
              </Glass>
            ))}
          </div>
        </FadeIn>
      </section>

      {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• CALCULATOR â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
      <section id="calculator" className={SEC}>
        <div className="grid items-start gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          {/* Left column: copy + gold CTA + soft brand mark */}
          <div className="relative flex flex-col">
            <FadeIn><Pill>{t(TX.calc.pill)}</Pill></FadeIn>
            <FadeIn delay={80}>
              <h2 className="mt-6 text-4xl font-bold tracking-[-0.03em] text-white md:text-5xl">
                {t(TX.calc.h2a)}{" "}
                <span className="bg-gradient-to-b from-[#f5e6b8] to-[#c9a84c] bg-clip-text text-transparent">{t(TX.calc.h2b)}</span>
              </h2>
            </FadeIn>
            <FadeIn delay={120}>
              <p className="relative z-[1] mt-6 max-w-lg text-base leading-[1.8] text-white/50">{t(TX.calc.intro)}</p>
            </FadeIn>
            <FadeIn delay={160}>
              <ul className="relative z-[1] mt-5 max-w-lg space-y-2.5">
                {TX.calc.bullets.map((b, i) => (
                  <li key={i} className="flex items-start gap-3 text-[15px] leading-[1.7] text-white/50">
                    <span className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-[#d9c27a]/50" />
                    {t(b)}
                  </li>
                ))}
              </ul>
            </FadeIn>
            <FadeIn delay={200}>
              <div className="relative z-[1] mt-10">
                <GoldCta href="mailto:info@capitalife.co?subject=Partner%20Access">{t(TX.calc.ctaPartner)}</GoldCta>
              </div>
            </FadeIn>
            <img
              src="/CAPITALIFE_ICON.png"
              alt=""
              aria-hidden
              className="pointer-events-none relative z-0 mt-6 h-auto w-[200px] select-none object-contain opacity-15"
            />
          </div>

          {/* Right â€” calculator panel */}
          <FadeIn delay={120}>
            <Glass className="space-y-6 p-6 md:p-8">
              {/* Capital slider */}
              <div>
                <label className="text-sm font-medium text-white/45">{t(TX.calc.capitalLabel)}</label>
                <input type="range" min={0} max={100} step={0.5} value={sliderPct} onChange={onSlider} className="cs mt-4 w-full" />
                <input
                  type="text" inputMode="numeric"
                  value={editCap ? rawCap : fmtEuro(capital, lang)}
                  onFocus={() => { setEditCap(true); setRawCap(String(capital)); }}
                  onBlur={() => { setEditCap(false); const n = parseInt(rawCap.replace(/\D/g, ""), 10); if (!isNaN(n)) setCapital(clampCap(n)); }}
                  onChange={(e) => setRawCap(e.target.value)}
                  className="mt-3 w-full rounded-xl border border-white/[0.06] bg-black/30 px-5 py-3 text-xl font-bold tabular-nums text-white outline-none transition focus:border-[#d9c27a]/30"
                />
              </div>

              {/* Investment Factor â€” big factor number */}
              <div>
                <label className="text-sm font-medium text-white/45">{t(TX.calc.factorLabel)}</label>
                <div className="mt-3 grid gap-3 sm:grid-cols-3">
                  {(["conservative", "balanced", "growth"] as Profile[]).map((p, i) => {
                    const f = PROFILE_FACTOR[p];
                    const active = profile === p;
                    return (
                      <button key={p} type="button" onClick={() => setProfile(p)}
                        className={`rounded-xl border p-5 text-left transition ${
                          active
                            ? "border-[#d9c27a]/40 bg-[#d9c27a]/10 shadow-[0_0_28px_rgba(217,194,122,0.08)]"
                            : "border-white/[0.06] bg-black/20 hover:border-white/12 hover:-translate-y-0.5"
                        }`}
                      >
                        <span className={`ico-glow mb-2 inline-flex h-10 w-10 items-center justify-center rounded-xl border ${active ? "border-[#d9c27a]/25 bg-[#d9c27a]/10 text-[#d9c27a]/80" : "border-white/10 bg-white/[0.04] text-white/35"}`}>
                          {FACTOR_ICONS[i]}
                        </span>
                        <div className={`text-sm font-semibold ${active ? "text-[#f1df9f]" : "text-white/60"}`}>
                          {t(TX.profiles[p])}
                        </div>
                        <div className={`mt-1 text-[22px] font-bold leading-none ${active ? "text-[#f1df9f]" : "text-white/50"}`}>
                          {f}
                          {"\u00D7"}
                        </div>
                        <div className={`mt-1.5 text-xs ${active ? "text-[#f1df9f]/45" : "text-white/25"}`}>
                          {"\u2248"} {(f * 30).toFixed(0)}% p.a.
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Partner Type â€” Retail / Institutional toggle */}
              <div>
                <label className="text-sm font-medium text-white/45">{t(TX.calc.partnerTypeLabel)}</label>
                <div className="mt-3 grid grid-cols-2 overflow-hidden rounded-xl border border-white/[0.06]">
                  {(["retail", "institutional"] as PartnerType[]).map((pt) => {
                    const active = partnerType === pt;
                    const isInst = pt === "institutional";
                    return (
                      <button key={pt} type="button" onClick={() => onPartnerType(pt)}
                        className={`flex flex-col items-center gap-1.5 py-5 transition ${
                          active
                            ? "bg-[#d9c27a]/10 text-[#f1df9f]"
                            : "bg-black/20 text-white/50 hover:bg-white/[0.03]"
                        }`}
                      >
                        <span className={`text-sm font-bold ${active ? "text-[#f1df9f]" : "text-white/60"}`}>
                          {isInst ? t(TX.calc.instLabel) : t(TX.calc.retail)}
                        </span>
                        <span className={`whitespace-nowrap text-xs font-medium ${active ? "text-[#f1df9f]/60" : "text-white/30"}`}>
                          {isInst ? t(TX.calc.instRange) : t(TX.calc.retailRange)}
                        </span>
                      </button>
                    );
                  })}
                </div>
                <p className={`mt-2.5 min-h-[2.75rem] text-xs leading-relaxed ${partnerType === "institutional" ? "text-[#f1df9f]/45" : "text-white/35"}`}>
                  {partnerType === "institutional" ? t(TX.calc.instText) : t(TX.calc.retailText)}
                </p>
              </div>

              {/* Result Cards â€” Pool / Partner / Capitalife */}
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-xl border border-white/[0.06] bg-black/30 p-5">
                  <div className="mb-2 text-[#d9c27a]/40"><IcoPie /></div>
                  <div className="whitespace-nowrap text-xs font-medium text-white/35">{t(TX.calc.resultPool)}</div>
                  <div className="mt-1 text-2xl font-bold tabular-nums text-white">{fmtEuro(aPool, lang)}</div>
                </div>
                <div className="rounded-xl border border-[#d9c27a]/15 bg-[#d9c27a]/[0.04] p-5">
                  <div className="mb-2 text-[#d9c27a]/50"><IcoPartner /></div>
                  <div className="whitespace-nowrap text-xs font-medium text-[#d9c27a]/50">{t(TX.calc.resultPartner)}</div>
                  <div className="mt-1 text-2xl font-bold tabular-nums text-[#e4cf8b]">{fmtEuro(aPartner, lang)}</div>
                </div>
                <div className="rounded-xl border border-white/[0.06] bg-black/30 p-5">
                  <div className="mb-2 flex items-center gap-1.5 text-white/25">
                    <img src="/CAPITALIFE_ICON.png" alt="" width={13} height={15} className="opacity-40" />
                  </div>
                  <div className="whitespace-nowrap text-xs font-medium text-white/35">{t(TX.calc.resultCapitalife)}</div>
                  <div className="mt-1 text-2xl font-bold tabular-nums text-white">{fmtEuro(aCapitalife, lang)}</div>
                </div>
              </div>
            </Glass>
          </FadeIn>
        </div>
      </section>

      {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• PREMIUM â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
      <section className={`${SEC} pb-[100px] md:pb-[120px]`}>
        <FadeIn>
          <Glass className="relative overflow-hidden p-8 md:p-12">
            <div className="absolute inset-0 bg-cover bg-center opacity-[0.03]" style={{ backgroundImage: "url('/partnerprogramm-background.png')" }} aria-hidden />
            <div className="relative grid items-center gap-10 lg:grid-cols-2">
              {/* Left */}
              <div>
                <Pill>{t(TX.premium.pill)}</Pill>
                <h2 className="mt-6 text-4xl font-bold leading-[1.12] tracking-[-0.03em] text-white md:text-5xl">
                  {t(TX.premium.h2a)}<br />
                  <span className="bg-gradient-to-b from-[#f5e6b8] to-[#c9a84c] bg-clip-text text-transparent">{t(TX.premium.h2b)}</span>
                </h2>
                <p className="mt-6 max-w-xl text-lg leading-[1.8] text-white/50">{t(TX.premium.text)}</p>
                <p className="mt-4 text-sm italic text-white/30">{t(TX.premium.trustMicro)}</p>
              </div>

              {/* Right â€” CTA + slider centered */}
              <div className="flex flex-col items-center gap-8">
                <div className="flex flex-col items-center gap-3">
                  <GoldCta href="mailto:info@capitalife.co?subject=Premium%20Partnership">{t(TX.premium.cta)}</GoldCta>
                  <p className="text-center text-xs text-white/40">{t(TX.premium.ctaSub)}</p>
                </div>
                <div className="text-[11px] font-medium uppercase tracking-widest text-white/25">{t(TX.premium.trusted)}</div>
                <div
                  className="w-full max-w-[380px] overflow-hidden"
                  style={{
                    WebkitMaskImage: "linear-gradient(to right, transparent, black 15%, black 85%, transparent)",
                    maskImage: "linear-gradient(to right, transparent, black 15%, black 85%, transparent)",
                  }}
                >
                  <div className="flex w-max items-center gap-12" style={{ animation: "marquee 28s linear infinite" }}>
                    {[...PARTNER_LOGOS, ...PARTNER_LOGOS, ...PARTNER_LOGOS, ...PARTNER_LOGOS].map((src, i) => {
                      const isVorsorgeplaner = src.includes("Vorsorgeplaner");
                      return (
                        <img
                          key={i} src={src} alt=""
                          className={`w-auto shrink-0 opacity-50 grayscale transition-all duration-300 hover:opacity-100 hover:grayscale-0 ${isVorsorgeplaner ? "h-9" : "h-7"}`}
                        />
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </Glass>
        </FadeIn>
      </section>
    </main>
  );
}
