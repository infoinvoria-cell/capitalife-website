"use client";

import { aboutCopy } from "@/content/home/about";
import { useLanguage } from "@/lib/i18n/language";
import styles from "./About.module.css";
import { Cards } from "./Cards";
import { FogCanvas } from "./FogCanvas";
import { RevealText } from "./RevealText";

// Sektion 2: Was ist Capitalife. Genau ein Bildschirm: Überschrift (wird beim Scrollen hell) und drei Karten.
// Unter dem Mauszeiger ein feiner, animierter Nebel (FogCanvas).
export function About() {
  const { lang } = useLanguage();
  const { statement, value, cards } = aboutCopy[lang];

  return (
    <section className={styles["about"]} id="strategy">
      <FogCanvas />
      <div data-reveal>
        <RevealText text={statement} />
      </div>
      <Cards value={value} cards={cards} />
    </section>
  );
}
