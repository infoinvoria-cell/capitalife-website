"use client";

import Link from "next/link";

import { useLanguage, type Lang } from "@/lib/i18n/language";
import raw from "./Hero.module.css";

type HeroCopy = {
  navHome: string;
  navPerformance: string;
  navStrategy: string;
  navAbout: string;
  navPartner: string;
  navCta: string;
  badge: string;
  h1: string;
  h2: string;
  sub: string;
  ctaStart: string;
  ctaPartner: string;
};

const COPY: Record<Lang, HeroCopy> = {
  en: {
    navHome: "Home",
    navPerformance: "Performance",
    navStrategy: "Strategy",
    navAbout: "About us",
    navPartner: "Partner Program",
    navCta: "Get Started",
    badge: "Institutional-Grade Investing",
    h1: "Open the Gateway to",
    h2: "Institutional Investing",
    sub: "Data-driven investment strategies built on over 20 years of market experience, validated by +2 years real-world performance.",
    ctaStart: "Get Started",
    ctaPartner: "Partner Program",
  },
  de: {
    navHome: "Start",
    navPerformance: "Performance",
    navStrategy: "Strategie",
    navAbout: "Über uns",
    navPartner: "Partnerprogramm",
    navCta: "Jetzt starten",
    badge: "Institutional-Grade Investing",
    h1: "Zugang zu",
    h2: "Capitalife Investmentstrategien",
    sub: "Datengetriebene Strategien auf Basis von über 20 Jahren Markterfahrung – validiert durch reale Performance.",
    ctaStart: "Jetzt starten",
    ctaPartner: "Partnerprogramm",
  },
};

function c(name: string): string {
  return (raw as Record<string, string>)[name] ?? "";
}

const LOGOS = ["/Roboforex.png", "/Darwinex.png", "/Vantage.png", "/Tradingview.png", "/Myfxbook.png"];

export function Hero() {
  const { lang, setLang } = useLanguage();
  const doubled = [...LOGOS, ...LOGOS];
  const t = COPY[lang];

  return (
    <section className={c("hero")} id="home">
      <nav className={c("nav")}>
        <Link href="/">
          <img className={c("logoImg")} src="/Capitalife-text_logo.png" alt="Capitalife" />
        </Link>

        <div className={c("navLinks")}>
          <Link href="#home" className={c("navLink")}>{t.navHome}</Link>
          <Link href="#performance" className={c("navLink")}>{t.navPerformance}</Link>
          <a href="#strategy" className={c("navLink")}>{t.navStrategy}</a>
          <Link href="#about" className={c("navLink")}>{t.navAbout}</Link>
          <Link href="/partner-program" className={c("navLink")}>{t.navPartner}</Link>
        </div>

        <div className={c("navRight")}>
          <div className={c("langToggle")}>
            {(["DE", "EN"] as const).map((code) => {
              const nextLang = code.toLowerCase() as Lang;
              return (
                <button
                  key={code}
                  type="button"
                  onClick={() => setLang(nextLang)}
                  className={`${c("langBtn")} ${lang === nextLang ? c("langActive") : ""}`}
                  aria-label={`Switch language to ${code}`}
                >
                  {code}
                </button>
              );
            })}
          </div>

          <Link href="#home" className={c("navBtn")}>
            <img className={c("navBtnIcon")} src="/CAPITALIFE_ICON.png" alt="" width={16} height={18} aria-hidden />
            <span className={c("navBtnText")}>{t.navCta}</span>
          </Link>
        </div>
      </nav>

      <div className={c("content")}>
        <div className={c("label")}>
          <span className={c("labelShine")} />
          <span className={c("labelDot")} />
          <span className={c("labelText")}>{t.badge}</span>
        </div>

        <h1 className={c("headline")}>
          <span className={c("h1")}>{t.h1}</span>
          <span className={c("h2")}>{t.h2}</span>
        </h1>

        <p className={c("sub")}>{t.sub}</p>

        <div className={c("buttons")}>
          <Link href="#home" className={c("btnStart")}>
            <span className={c("btnShine")} />
            <img className={c("btnIconStart")} src="/CAPITALIFE_ICON.png" alt="" width={20} height={22} aria-hidden />
            <span className={c("btnText")}>{t.ctaStart}</span>
          </Link>
          <Link href="/partner-program" className={c("btnPartner")}>
            <span className={c("btnShine")} />
            <svg className={c("btnIconPartner")} width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M12 2.5l2.5 5.5h6l-4.8 3.7 1.8 5.8L12 13.8l-5.5 3.7 1.8-5.8L3.5 8h6L12 2.5z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" fill="none" />
            </svg>
            <span className={c("btnText")}>{t.ctaPartner}</span>
          </Link>
        </div>
      </div>

      <div className={c("sliderWrap")}>
        <div className={c("sliderTrack")}>
          {doubled.map((src, i) => (
            <img key={`${src}-${i}`} className={c("sliderLogo")} src={src} alt="" />
          ))}
        </div>
      </div>
    </section>
  );
}
