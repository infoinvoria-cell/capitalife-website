"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import { heroCopy } from "@/content/home/hero";
import { useLanguage } from "@/lib/i18n/language";
import styles from "./HeroNav.module.css";

// Schwebende Liquid-Glass-Leiste: oben 1000 px, beim Scrollen schmaler (720 px).
export function HeroNav() {
  const { lang, setLang } = useLanguage();
  const { nav, navCta, langSwitch } = heroCopy[lang];
  const [compact, setCompact] = useState(false);

  useEffect(() => {
    const onScroll = () => setCompact(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`${styles["nav"]} ${compact ? styles["compact"] : ""}`}>
      {/* Logo: zeigt nur das Symbol, klappt beim Hover zum vollen Schriftzug aus.
          Normales <a>, damit der Klick die Startseite wirklich neu lädt. */}
      {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
      <a href="/" aria-label="Capitalife" className={styles["brand"]}>
        <span className={styles["brandClip"]}>
          <Image
            src="/brand/capitalife-wordmark.png"
            alt=""
            width={2531}
            height={221}
            priority
            className={styles["brandImg"]}
          />
        </span>
      </a>
      <nav className={styles["links"]} aria-label="Main">
        {nav.map((item) => (
          <Link key={item.label} href={item.href} className={styles["link"]}>
            {item.label}
          </Link>
        ))}
      </nav>
      <div className={styles["actions"]}>
        <button
          type="button"
          className={styles["lang"]}
          onClick={() => setLang(lang === "en" ? "de" : "en")}
          aria-label={langSwitch}
        >
          {lang.toUpperCase()}
        </button>
        <Link href={navCta.href} className={styles["cta"]}>
          {navCta.label}
        </Link>
      </div>
    </header>
  );
}
