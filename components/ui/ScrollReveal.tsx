"use client";

import { useEffect } from "react";

// Blendet jedes Element mit data-reveal ein, sobald es in den Bildschirm kommt (3D von unten, einmalig).
// Verzögerung je Element über die CSS-Variable --rd. Aussehen in app/globals.css.
// Ohne JavaScript bleibt alles sichtbar: versteckt wird erst, wenn html die Klasse "reveal" hat.
export function ScrollReveal() {
  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("reveal");
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          e.target.setAttribute("data-shown", "");
          io.unobserve(e.target);
        }
      },
      // Erst wenn ein Teil sichtbar ist; ohne Rand unten, sonst blenden die letzten Zeilen der Seite nie ein
      { threshold: 0.15 },
    );
    const scan = () =>
      document
        .querySelectorAll("[data-reveal]:not([data-shown])")
        .forEach((el) => io.observe(el));
    scan();
    // Neue Elemente (z. B. nach Sprachwechsel) ebenfalls erfassen
    const mo = new MutationObserver(scan);
    mo.observe(document.body, { childList: true, subtree: true });
    return () => {
      io.disconnect();
      mo.disconnect();
      root.classList.remove("reveal");
    };
  }, []);

  return null;
}
