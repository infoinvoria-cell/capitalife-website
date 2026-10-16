"use client";

import type { LegalCopy } from "@/content/legal/types";
import { HeroNav } from "@/components/sections/home/Hero/HeroNav";
import { Footer } from "@/components/sections/home/Footer/Footer";
import { BackToTop } from "@/components/ui/BackToTop";
import { useLanguage } from "@/lib/i18n/language";
import styles from "./LegalPage.module.css";

// Gemeinsames Gerüst aller Rechtsseiten: gleiche Kopfzeile und Fusszeile wie die Startseite,
// dazwischen ruhiger, gut lesbarer Text. Auf Englisch Hinweis, dass die deutsche Fassung gilt.
export function LegalPage({ copy }: { copy: LegalCopy }) {
  const { lang } = useLanguage();
  const doc = copy[lang];

  return (
    <>
      <HeroNav />
      <main className={styles["page"]}>
        <article className={styles["article"]}>
          <header className={styles["head"]}>
            <h1 className={styles["title"]}>{doc.title}</h1>
            <p className={styles["updated"]}>{doc.updated}</p>
            {doc.intro && <p className={styles["intro"]}>{doc.intro}</p>}
          </header>
          {doc.sections.map((s) => (
            <section key={s.heading} id={s.id} className={styles["section"]}>
              <h2 className={styles["heading"]}>{s.heading}</h2>
              {s.paragraphs?.map((p) => (
                <p key={p} className={styles["text"]}>
                  {p}
                </p>
              ))}
              {s.items && (
                <ul className={styles["list"]}>
                  {s.items.map((i) => (
                    <li key={i}>{i}</li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </article>
      </main>
      <Footer />
      <BackToTop />
    </>
  );
}
