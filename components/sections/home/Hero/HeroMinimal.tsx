"use client";

import Link from "next/link";

import { heroCopy } from "@/content/home/hero";
import type { TitleStyle } from "@/content/home/heroTitles";
import { GermanyIcon } from "@/components/ui/GermanyIcon";
import { useLanguage } from "@/lib/i18n/language";
import { HeroGlobe } from "./HeroGlobe";
import { HeroNav } from "./HeroNav";
import kpiStyles from "./HeroKpis.module.css";
import styles from "./HeroMinimal.module.css";
import parallax from "./HeroParallax.module.css";
import titles from "./HeroTitle.module.css";

// titleStyle: Variante 1 bis 7 aus HeroTitle.module.css. Gewählt: 3 (senkrecht weiss nach Gold).
export function HeroMinimal({ titleStyle = "3" }: { titleStyle?: TitleStyle }) {
  const { lang } = useLanguage();
  const { headline, badge, primary, secondary, kpis } = heroCopy[lang];

  return (
    <>
      {/* Navigation ausserhalb der Hero, damit sie beim Scrollen über allen Sektionen liegt */}
      <HeroNav />
      <section className={styles["hero"]} id="home">
        <HeroGlobe />

        <div className={`${styles["copy"]} ${parallax["text"]}`}>
          <p className={styles["badge"]}>
            <span className={styles["badgeText"]}>{badge}</span>
          </p>
          <h1
            className={`${styles["title"]} ${titles[`t${titleStyle}`] ?? ""}`}
          >
            <span className={titles["l1"]}>{headline.line1}</span>
            <span className={titles["l2"]}>{headline.line2}</span>
          </h1>
          <div className={styles["actions"]}>
            <Link href={primary.href} className={styles["primary"]}>
              {primary.label}
            </Link>
            {/* Zweiter Button nur mit Rand, scrollt weich zu Sektion 2 */}
            <Link href={secondary.href} className={styles["secondary"]}>
              {secondary.label}
            </Link>
          </div>
        </div>

        <dl className={`${kpiStyles["kpis"]} ${parallax["kpis"]}`}>
          {kpis.map((k) => (
            <div key={k.label} className={kpiStyles["kpi"]}>
              <dt>{k.label}</dt>
              <dd>
                {/* Wort bleibt mittig, das Symbol hängt rechts daneben (zählt nicht zur Breite) */}
                <span className={kpiStyles["value"]}>
                  {k.value}
                  {k.icon === "germany" && (
                    <GermanyIcon className={kpiStyles["icon"]} />
                  )}
                </span>
              </dd>
            </div>
          ))}
        </dl>
      </section>
    </>
  );
}
