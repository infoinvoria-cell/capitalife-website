"use client";

import { useEffect, useState } from "react";

import { uiCopy } from "@/content/home/ui";
import { useLanguage } from "@/lib/i18n/language";
import styles from "./BackToTop.module.css";

// Handy: kleiner Pfeil unten rechts. Erscheint, sobald man ein Stück nach oben scrollt,
// verschwindet beim Runterscrollen und ganz oben. Antippen bringt sofort weich an den Seitenanfang.
export function BackToTop() {
  const { lang } = useLanguage();
  const [show, setShow] = useState(false);

  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      if (y < 200) setShow(false);
      else if (y < last - 4) setShow(true);
      else if (y > last + 4) setShow(false);
      last = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Sofort beim Antippen: laufenden Schwung (iOS) kurz anhalten, dann weich nach oben
  const toTop = () => {
    const html = document.documentElement;
    html.style.overflow = "hidden";
    requestAnimationFrame(() => {
      html.style.overflow = "";
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  };

  return (
    <button
      type="button"
      className={styles["button"]}
      data-show={show || undefined}
      tabIndex={show ? 0 : -1}
      aria-label={uiCopy[lang].backToTop}
      onPointerDown={toTop}
      onClick={(e) => e.detail === 0 && toTop()} // Tastatur (Enter/Leertaste)
    >
      <span className={styles["arrow"]} aria-hidden />
    </button>
  );
}
