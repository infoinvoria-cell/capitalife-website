"use client";

import Image from "next/image";

import { foundersCopy } from "@/content/home/founders";
import { dotWaves } from "@/lib/cards/dotWaves";
import { AnimCanvas } from "../About/AnimCanvas";
import { useLanguage } from "@/lib/i18n/language";
import styles from "./Founders.module.css";

// Eine breite, ruhige Box: links und rechts je ein Porträt (läuft nach unten und zur Mitte ins Dunkle aus),
// in der Mitte Überschrift und ein Satz. Vorerst nur Desktop (auf dem Handy ausgeblendet).
export function Founders() {
  const { lang } = useLanguage();
  const { title, text, people } = foundersCopy[lang];

  return (
    <section className={styles["founders"]} aria-labelledby="founders-title">
      <div className={styles["box"]} data-reveal>
        <AnimCanvas draw={dotWaves} className={styles["waves"]} />
        {people.map((p, i) => (
          <figure
            key={p.image}
            className={`${styles["person"]} ${styles[i === 0 ? "left" : "right"]}`}
          >
            <Image
              src={p.image}
              alt={p.name}
              width={1000}
              height={1500}
              sizes="(min-width: 861px) 360px, 50vw"
              className={styles["photo"]}
            />
            <figcaption className={styles["caption"]}>
              <span className={styles["name"]}>{p.name}</span>
              <span className={styles["role"]}>{p.role}</span>
            </figcaption>
          </figure>
        ))}
        <div className={styles["center"]}>
          <h2 id="founders-title" className={styles["title"]}>
            {title}
          </h2>
          <p className={styles["text"]}>{text}</p>
        </div>
      </div>
    </section>
  );
}
