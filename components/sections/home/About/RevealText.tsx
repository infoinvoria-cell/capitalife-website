"use client";

import { useEffect, useRef } from "react";

import styles from "./About.module.css";

// Satz, der beim Scrollen Wort für Wort hell wird (Apple-Stil). Ohne JS bleibt er voll lesbar.
export function RevealText({ text }: { text: string }) {
  const ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const words = Array.from(el.querySelectorAll<HTMLSpanElement>("span"));
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const p = Math.min(Math.max((vh * 0.85 - r.top) / (r.height + vh * 0.35), 0), 1);
      const lit = p * (words.length + 2);
      words.forEach((w, i) => {
        w.style.opacity = String(Math.min(Math.max(lit - i, 0.18), 1));
      });
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [text]);

  return (
    <p ref={ref} className={styles["statement"]}>
      {text.split(" ").map((word, i) => (
        <span key={`${word}-${i}`}>{word} </span>
      ))}
    </p>
  );
}
