"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

import { useLanguage, type Lang } from "@/lib/i18n/language";
import raw from "./Hero.module.css";
import { IntroAnimation } from "./IntroAnimation";

function c(name: string): string {
  return (raw as Record<string, string>)[name] ?? "";
}

/* ─── Flags ──────────────────────────────────────────────────────── */

function FlagDE({ size = 24 }: { size?: number }) {
  return (
    <svg viewBox="0 0 5 3" width={size} height={Math.round(size * 0.6)} aria-hidden style={{ display: "block" }}>
      <rect width="5" height="1" fill="#000" />
      <rect y="1" width="5" height="1" fill="#D00" />
      <rect y="2" width="5" height="1" fill="#FFCE00" />
    </svg>
  );
}

function FlagGB({ size = 24 }: { size?: number }) {
  return (
    <svg viewBox="0 0 60 30" width={size} height={Math.round(size * 0.5)} aria-hidden style={{ display: "block" }}>
      <rect width="60" height="30" fill="#012169" />
      <path d="M0 0 L60 30 M60 0 L0 30" stroke="white" strokeWidth="6" />
      <path d="M0 0 L60 30 M60 0 L0 30" stroke="#C8102E" strokeWidth="4" />
      <rect y="12" width="60" height="6" fill="white" />
      <rect x="27" width="6" height="30" fill="white" />
      <rect y="13" width="60" height="4" fill="#C8102E" />
      <rect x="28" width="4" height="30" fill="#C8102E" />
    </svg>
  );
}

/* ─── Copy ──────────────────────────────────────────────────────── */

type HeroCopy = {
  navPerformance: string; navStrategy: string;
  navAccess: string; navPartner: string; navCta: string;
  badge: string; h1a: string; h1b: string;
  sub: string; ctaStart: string; ctaPartner: string;
};

const COPY: Record<Lang, HeroCopy> = {
  en: {
    navPerformance: "Performance", navStrategy: "Strategy",
    navAccess: "Access", navPartner: "Partner",
    navCta: "Get Started",
    badge: "Data-Driven Performance",
    h1a: "Open the Gateway to",
    h1b: "Institutional Investing",
    sub: "Data-driven strategies built on 20+ years of market expertise, validated by real-world performance you can verify.",
    ctaStart: "Get Started", ctaPartner: "Partner Program",
  },
  de: {
    navPerformance: "Performance", navStrategy: "Strategie",
    navAccess: "Zugang", navPartner: "Partner",
    navCta: "Jetzt starten",
    badge: "Data-Driven Performance",
    h1a: "Zugang zu",
    h1b: "Institutionellen Strategien",
    sub: "Datengetriebene Strategien auf Basis von 20+ Jahren Markterfahrung – validiert durch reale, überprüfbare Performance.",
    ctaStart: "Jetzt starten", ctaPartner: "Partnerprogramm",
  },
};

const LOGOS   = ["/Roboforex.png", "/Darwinex.png", "/Vantage.png", "/Tradingview.png", "/Myfxbook.png"];
const DOUBLED = [...LOGOS, ...LOGOS];

/* ─── Component ─────────────────────────────────────────────────── */

export function Hero() {
  const { lang, setLang } = useLanguage();
  const t = COPY[lang];

  const [introComplete, setIntroComplete] = useState(false);
  const [scrolled, setScrolled]           = useState(false);
  const [langOpen, setLangOpen]           = useState(false);

  // Passed to IntroAnimation so it can getBoundingClientRect() at fly time
  const navLogoRef = useRef<HTMLImageElement>(null);
  const heroRef    = useRef<HTMLElement>(null);
  const langRef    = useRef<HTMLDivElement>(null);

  const handleIntroComplete = useCallback(() => setIntroComplete(true), []);

  useEffect(() => {
    const fn = () => {
      setScrolled(window.scrollY > 20);
      if (heroRef.current)
        heroRef.current.style.backgroundPositionY = `calc(50% + ${window.scrollY * 0.5}px)`;
    };
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    const fn = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node))
        setLangOpen(false);
    };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);

  return (
    <>
      {/* ── INTRO ANIMATION — self-contained, plays once per session ── */}
      <IntroAnimation navLogoRef={navLogoRef} onComplete={handleIntroComplete} />

      {/* ── HERO SECTION ─────────────────────────────────────────── */}
      <section ref={heroRef} className={c("hero")} id="home">

        {/* ── NAVBAR ─────────────────────────────────────────────── */}
        <nav className={`${c("nav")} ${scrolled ? c("navScrolled") : ""}`}>
          <div className={c("navInner")}>

            {/* LEFT: real logo — opacity 0 during intro, 1 after */}
            <div className={c("navLogo")}>
              <Link href="/" aria-label="Capitalife home">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  ref={navLogoRef}
                  src="/CAPITALIFE_ICON.png"
                  alt="Capitalife"
                  className={c("navLogoIcon")}
                  style={{
                    display: "block",
                    opacity: introComplete ? 1 : 0,
                    transition: "opacity 0.3s ease",
                  }}
                />
              </Link>
            </div>

            {/* CENTER */}
            <div className={c("navLinks")}>
              <a href="#performance"   className={c("navLink")}>{t.navPerformance}</a>
              <a href="#strategy"      className={c("navLink")}>{t.navStrategy}</a>
              <a href="#access"        className={c("navLink")}>{t.navAccess}</a>
              <Link href="/partner-program" className={c("navLink")}>{t.navPartner}</Link>
            </div>

            {/* RIGHT */}
            <div className={c("navRight")}>
              <div ref={langRef} className={c("langWrap")}>
                <button
                  type="button"
                  className={c("langTrigger")}
                  onClick={() => setLangOpen((o) => !o)}
                  aria-label="Language"
                  aria-expanded={langOpen}
                >
                  {lang === "de" ? <FlagDE size={22} /> : <FlagGB size={22} />}
                </button>

                {/* Dropdown: always in DOM, CSS transition for open/close */}
                <div
                  className={c("langDropdown")}
                  style={{
                    opacity: langOpen ? 1 : 0,
                    transform: langOpen ? "translateY(0)" : "translateY(-6px)",
                    pointerEvents: langOpen ? "auto" : "none",
                    transition: "opacity 0.14s ease, transform 0.14s ease",
                  }}
                >
                  {(["de", "en"] as Lang[]).map((l) => (
                    <button
                      key={l}
                      type="button"
                      className={`${c("langOption")} ${lang === l ? c("langOptionActive") : ""}`}
                      onClick={() => { setLang(l); setLangOpen(false); }}
                    >
                      {l === "de" ? <FlagDE size={18} /> : <FlagGB size={18} />}
                      <span>{l === "de" ? "DE" : "EN"}</span>
                    </button>
                  ))}
                </div>
              </div>

              <Link href="#contact" className={c("navCta")}>{t.navCta}</Link>
            </div>
          </div>
        </nav>

        {/* ── HERO CONTENT ─────────────────────────────────────────── */}
        <div className={c("content")}>

          <div className={c("badgeOuter")}>
            <div className={c("badge")}>
              <span className={c("badgePulse")} />
              {t.badge}
            </div>
          </div>

          <h1 className={c("headline")}>
            <span className={c("h1Light")}>{t.h1a}</span>
            <span className={c("h1Gradient")}>{t.h1b}</span>
          </h1>

          <p className={c("sub")}>{t.sub}</p>

          <div className={c("buttons")}>
            <Link href="#contact"         className={c("btnPrimary")}>{t.ctaStart}</Link>
            <Link href="/partner-program" className={c("btnSecondary")}>{t.ctaPartner}</Link>
          </div>

        </div>

        {/* ── LOGO SLIDER ─────────────────────────────────────────── */}
        <div className={c("sliderWrap")}>
          <div className={c("sliderTrack")}>
            {DOUBLED.map((src: string, i: number) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={`${src}-${i}`} src={src} alt="" className={c("sliderLogo")} />
            ))}
          </div>
        </div>

      </section>
    </>
  );
}
