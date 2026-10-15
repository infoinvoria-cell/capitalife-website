"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";

import { waitlistCopy } from "@/content/home/waitlist";
import { useLanguage } from "@/lib/i18n/language";
import styles from "./Waitlist.module.css";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// Sektion 3: Warteliste. Prüft die Eingabe, sendet aber noch NICHTS.
// Versand erst mit Datenschutzerklärung, Impressum und Double-Opt-in (braucht Go für Dienst und Env-Variablen).
export function Waitlist() {
  const { lang } = useLanguage();
  const t = waitlistCopy[lang];
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    setMessage(EMAIL.test(email) && consent ? t.pending : t.invalid);
  };

  return (
    <section className={styles["waitlist"]} id="waitlist">
      <h2 className={styles["title"]} data-reveal>
        <span>{t.line1}</span>
        <span>{t.line2}</span>
      </h2>

      <form className={styles["form"]} onSubmit={onSubmit} noValidate>
        <div
          className={styles["field"]}
          data-reveal="2"
        >
          <label htmlFor="waitlist-email" className={styles["srOnly"]}>
            {t.placeholder}
          </label>
          <input
            id="waitlist-email"
            type="email"
            autoComplete="email"
            placeholder={t.placeholder}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={styles["input"]}
          />
          <button type="submit" className={styles["button"]}>
            {t.button}
          </button>
        </div>

        <label
          className={styles["consent"]}
          htmlFor="waitlist-consent"
          data-reveal="3"
        >
          <input
            id="waitlist-consent"
            type="checkbox"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
          />
          <span>
            {t.consent} <Link href="/privacy">{t.privacy}</Link>
          </span>
        </label>

        <p
          className={styles["note"]}
          aria-live="polite"
          data-reveal="4"
        >
          {message ?? t.note}
        </p>
      </form>
    </section>
  );
}
