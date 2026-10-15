"use client";

import Image from "next/image";
import Link from "next/link";

import { contactEmail, footerCopy } from "@/content/home/footer";
import { useLanguage } from "@/lib/i18n/language";
import styles from "./Footer.module.css";

// Fusszeile, so reduziert wie möglich: Logo mit Claim und Pflicht-Links, kurzer Hinweis, eine Zeile Copyright/Kontakt.
// Logo aus dem Terminal-Projekt kopiert (nur Branding): public/brand/capitalife-logo-tagline.png
export function Footer() {
  const { lang } = useLanguage();
  const t = footerCopy[lang];
  const year = new Date().getFullYear();

  return (
    <footer className={styles["footer"]}>
      <div className={styles["inner"]}>
        <div className={styles["top"]}>
          <Link href="/" aria-label="Capitalife" data-reveal>
            <Image
              src="/brand/capitalife-logo-tagline.png"
              alt="Capitalife – change the industry"
              width={1600}
              height={250}
              className={styles["logo"]}
            />
          </Link>
          <nav
            className={styles["links"]}
            aria-label="Legal"
            data-reveal="2"
          >
            {t.links.map((l) => (
              <Link key={l.href} href={l.href}>
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
        <p
          className={styles["notice"]}
          data-reveal="3"
        >
          {t.notice}
        </p>
        <p
          className={styles["bottom"]}
          data-reveal="4"
        >
          © {year} Capitalife GbR · {t.rights} ·{" "}
          <a href={`mailto:${contactEmail}`}>{contactEmail}</a>
        </p>
      </div>
    </footer>
  );
}
