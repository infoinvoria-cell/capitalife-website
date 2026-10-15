"use client";

import Link from "next/link";
import { useEffect } from "react";

import { heroCopy } from "@/content/home/hero";
import { useLanguage } from "@/lib/i18n/language";
import styles from "./HeroMobileMenu.module.css";

// Handy-Menü: Fenster gleitet von oben herein (halber Bildschirm, dunkles Liquid Glass),
// dahinter wird die Seite weichgezeichnet und abgedunkelt. Von oben nach unten: Seiten, Sprache, Warteliste.
export function HeroMobileMenu({
  id,
  open,
  onClose,
}: {
  id: string;
  open: boolean;
  onClose: () => void;
}) {
  const { lang, setLang } = useLanguage();
  const { nav, navCta } = heroCopy[lang];

  // Escape schliesst, Seite dahinter scrollt nicht mit
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    const html = document.documentElement;
    html.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      html.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  return (
    <div className={styles["root"]} data-open={open || undefined} inert={!open}>
      <div className={styles["backdrop"]} onClick={onClose} aria-hidden />
      <div id={id} className={styles["panel"]}>
        <nav className={styles["pages"]} aria-label="Main">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={styles["page"]}
              onClick={onClose}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className={styles["langs"]}>
          {(["en", "de"] as const).map((l) => (
            <button
              key={l}
              type="button"
              className={styles["langOption"]}
              aria-pressed={lang === l}
              onClick={() => setLang(l)}
            >
              {l.toUpperCase()}
            </button>
          ))}
        </div>
        <Link href={navCta.href} className={styles["cta"]} onClick={onClose}>
          {navCta.label}
        </Link>
      </div>
    </div>
  );
}
