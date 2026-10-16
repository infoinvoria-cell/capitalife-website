"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";

import { waitlistCopy } from "@/content/home/waitlist";
import { useLanguage } from "@/lib/i18n/language";
import { joinWaitlist, waitlistKey } from "@/lib/waitlist";
import styles from "./Waitlist.module.css";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// Sektion 3: Warteliste. Prüft die Eingabe und schickt sie über Web3Forms an unser Postfach (lib/waitlist.ts).
// Ohne hinterlegten Schlüssel wird nichts gesendet.
export function Waitlist() {
  const { lang } = useLanguage();
  const t = waitlistCopy[lang];
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (busy) return;
    if (!EMAIL.test(email) || !consent) return setMessage(t.invalid);
    if (!waitlistKey) return setMessage(t.pending);
    setBusy(true);
    setMessage(t.sending);
    const ok = await joinWaitlist(
      email.trim(),
      lang,
      `${t.consent} ${t.privacy}`,
    );
    setBusy(false);
    setMessage(ok ? t.success : t.error);
    if (ok) {
      setEmail("");
      setConsent(false);
    }
  };

  return (
    <section className={styles["waitlist"]} id="waitlist">
      <h2 className={styles["title"]} data-reveal>
        <span>{t.line1}</span>
        <span>{t.line2}</span>
      </h2>

      <form className={styles["form"]} onSubmit={onSubmit} noValidate>
        <div className={styles["field"]} data-reveal="2">
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
          <button type="submit" className={styles["button"]} disabled={busy}>
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
            {t.consent} <Link href="/privacy#warteliste">{t.privacy}</Link>
          </span>
        </label>

        <p className={styles["note"]} aria-live="polite" data-reveal="4">
          {message ?? t.note}
        </p>
      </form>
    </section>
  );
}
