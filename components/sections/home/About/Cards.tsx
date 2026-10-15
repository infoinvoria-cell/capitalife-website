"use client";

import type { AboutCopy } from "@/content/home/about";
import { toolsArc, toolsDrag } from "@/lib/cards/arc";
import { earthCard, earthDrag } from "@/lib/cards/globe";
import { AnimCanvas } from "./AnimCanvas";
import { CountUp } from "./CountUp";
import styles from "./Cards.module.css";

// Drei Karten wie Referenz: Zähler, Logo mit springenden Tool-Namen am Kugelrand, Erde mit Ring und Impulsen.
export function Cards({ value, cards }: Pick<AboutCopy, "value" | "cards">) {
  return (
    <ul className={styles["grid"]}>
      {cards.map((card, i) => (
        <li
          key={card.key}
          className={styles["item"]}
          data-reveal={String(i + 1)}
        >
          <div className={styles["frame"]}>
            {card.key === "value" && (
              <CountUp value={value.number} label={value.label} />
            )}
            {card.key === "tools" && (
              <AnimCanvas
                draw={toolsArc}
                drag={toolsDrag}
                className={styles["art"]}
              />
            )}
            {card.key === "global" && (
              <AnimCanvas
                draw={earthCard}
                drag={earthDrag}
                className={styles["art"]}
              />
            )}
          </div>
          <h3 className={styles["title"]}>{card.title}</h3>
          <p className={styles["text"]}>{card.text}</p>
        </li>
      ))}
    </ul>
  );
}
