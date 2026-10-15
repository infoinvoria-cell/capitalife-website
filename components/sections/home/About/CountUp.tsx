"use client";

import { useEffect, useRef } from "react";

import styles from "./Cards.module.css";

// Ziffern-Zähler im Loop: jede Ziffer ist eine Walze, neue Zahlen rollen von oben herein.
// Ablauf: "0+" → einstellig bis 9 → ab 10 kommt die Zehnerstelle weich dazu (das "+" rückt nach) → bis 25,
// ca. 3 s stehen lassen, kurz ausblenden, von vorn. Läuft nur, wenn sichtbar.
const COUNT = 4; // Sekunden für 0 bis 25
const HOLD_END = COUNT + 3;
const FADE_END = HOLD_END + 0.5;
const CYCLE = FADE_END + 0.4;
const DIGIT_W = 0.56; // Breite einer Ziffer in em

export function CountUp({ value, label }: { value: string; label: string }) {
  const match = /^(\d+)(.*)$/.exec(value);
  const target = match ? Number(match[1]) : 0;
  const suffix = match ? match[2] : value;
  const places = String(target).length;
  const box = useRef<HTMLDivElement>(null);
  const strips = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const set = (v: number, phase: "count" | "hold" | "fade") => {
      // Walzen: Einer laufen fliessend, höhere Stellen drehen weich mit, wenn die Stelle darunter von 9 auf 0 geht
      for (let p = 0; p < places; p++) {
        const unit = 10 ** (places - 1 - p);
        const raw = v / unit;
        const below = raw - Math.floor(raw);
        const digit = Math.floor(raw) % 10;
        const pos = unit === 1 ? raw % 10 : digit + Math.max(0, below * unit - (unit - 1));
        const s = strips.current[p];
        // Walze: 11 Felder (0, 9 … 1, 0), Feld = 1/11 der Walzenhöhe; steigende Zahl schiebt nach unten
        if (s) s.style.transform = `translateY(${(-(10 - pos) * 100) / 11}%)`;
        // Führende Null: höhere Stelle wächst erst in die Breite, wenn sie gebraucht wird (das "+" rückt nach)
        const col = s?.parentElement;
        if (col && unit > 1) {
          const k = Math.min(Math.max(v - (unit - 1), 0), 1);
          col.style.opacity = String(k);
          col.style.width = `${k * DIGIT_W}em`;
        }
      }
      el.dataset["phase"] = phase;
    };
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      set(target, "hold");
      return;
    }
    let raf = 0;
    let t0 = 0;
    const loop = (now: number) => {
      if (!t0) t0 = now;
      const t = ((now - t0) / 1000) % CYCLE;
      if (t < COUNT) {
        const p = t / COUNT;
        // Mischung aus "sanft am Ende" und "schneller in der Mitte"
        const v = target * (0.5 * (1 - (1 - p) ** 2) + 0.5 * p * p * (3 - 2 * p));
        // Die letzte Zahl rollt schon im Gold-Verlauf herein
        set(v, v > target - 1 ? "hold" : "count");
      } else if (t < HOLD_END) set(target, "hold");
      else if (t < FADE_END) set(target, "fade");
      else set(0, "fade");
      raf = requestAnimationFrame(loop);
    };
    const io = new IntersectionObserver(([e]) => {
      cancelAnimationFrame(raf);
      t0 = 0;
      if (e?.isIntersecting) raf = requestAnimationFrame(loop);
    });
    io.observe(el);
    set(0, "count");
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [target, places]);

  return (
    <div ref={box} className={styles["value"]}>
      <span className={styles["number"]} aria-label={value} role="img">
        {Array.from({ length: places }, (_, p) => (
          <span key={p} className={styles["col"]}>
            <span
              ref={(n) => {
                strips.current[p] = n;
              }}
              className={styles["strip"]}
            >
              {[0, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0].map((d, i) => (
                <span key={i}>{d}</span>
              ))}
            </span>
          </span>
        ))}
        <span className={styles["suffix"]}>{suffix}</span>
      </span>
      <span className={styles["label"]}>{label}</span>
    </div>
  );
}
