"use client";

import { useEffect, useRef, useState } from "react";

import { fitGlobe } from "@/lib/globe/fit";
import { createGlobeRenderer, type Rect } from "@/lib/globe/renderer";

const LON0 = 38; // Startansicht: knapp westlich von Saudi-Arabien, dreht dann langsam nach Westen über Europa
const TURN = 90; // Drehung in Grad über die Scroll-Strecke (langsam)
const SPAN = 2; // Scroll-Strecke in Bildschirmhöhen
const AUTO = 0.6; // Dauerdrehung in Grad pro Sekunde (eine Umdrehung in 10 Minuten)
const BEAM0 = -95; // Lichtkegel: Startwinkel (links) ...
const BEAM_SPEED = 9; // ... und 9 Grad pro Sekunde (eine Runde in 40 s)
const SLOW_MS = 22; // Bildzeit, ab der ein Gerät als zu langsam gilt (unter ca. 45 Bilder pro Sekunde)

function load(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

// Live-Erde mit Lichtkegel und Schriftzug in einem Canvas von Bildschirmgrösse (schnell, auch auf schwachen Grafikchips).
// Erde dreht dauerhaft sehr langsam und beim Scrollen schneller. Ohne WebGL bleiben Standbild und CSS-Licht.
// boxSelector: Standbild (Lage der Kugel), markSelector: Platzhalter für den Schriftzug.
export function HeroGlobeCanvas({
  className,
  boxSelector,
  markSelector,
}: {
  className?: string;
  boxSelector: string;
  markSelector: string;
}) {
  const ref = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    let renderer: ReturnType<typeof createGlobeRenderer> = null;
    let raf = 0;
    let current = 0;
    let target = 0;
    let auto = 0;
    let last = 0;
    let visible = true;
    let alive = true;
    const t0 = performance.now();
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // Automatische Qualität: startet mit voller Schärfe, rechnet nur auf zu langsamen Geräten gröber
    let quality = 1;
    let frames = 0;
    let spent = 0;
    let box: Rect = { x: 0, y: 0, w: 1, h: 1 };
    let mark: Rect = { x: 0, y: 0, w: 0, h: 0 };
    const rect = (selector: string, fallback: Rect): Rect => {
      const el = canvas.parentElement?.querySelector(selector);
      if (!el) return fallback;
      const a = el.getBoundingClientRect();
      const c = canvas.getBoundingClientRect();
      return { x: a.left - c.left, y: a.top - c.top, w: a.width, h: a.height };
    };
    const measure = () => {
      box = rect(boxSelector, box);
      mark = rect(markSelector, mark);
    };
    const draw = (now: number) => {
      const beam = still
        ? BEAM0
        : BEAM0 + ((((now - t0) / 1000) * BEAM_SPEED) % 360);
      renderer?.draw(
        LON0 - auto - current,
        (beam * Math.PI) / 180,
        box,
        mark,
        quality,
      );
    };

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      const dt = last ? Math.min((now - last) / 1000, 0.1) : 0;
      last = now;
      if (dt > 0 && dt < 0.1 && quality > 0.5) {
        frames += 1;
        spent += dt * 1000;
        if (frames === 60) {
          if (spent / frames > SLOW_MS) quality -= 0.25;
          frames = 0;
          spent = 0;
        }
      }
      if (!still) auto += AUTO * dt;
      current += (target - current) * 0.12;
      measure(); // Lage der Kugel kann sich mit der Fenstergrösse ändern (günstig, Layout ist fertig)
      draw(now);
    };
    const start = () => {
      if (!raf && visible && renderer) raf = requestAnimationFrame(tick);
    };
    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
      last = 0;
    };
    const onScroll = () => {
      const p = Math.min(
        Math.max(window.scrollY / (window.innerHeight * SPAN), 0),
        1,
      );
      target = p * TURN;
    };

    Promise.all([
      load("/hero/earth-day.jpg"),
      load("/hero/earth-night.jpg"),
      load("/hero/light-2048.webp"),
      load("/hero/wordmark-mask-2048.png"),
    ])
      .then(([day, night, light, markImg]) => {
        if (!alive) return;
        renderer = createGlobeRenderer(canvas, {
          day,
          night,
          light,
          mark: markImg,
        });
        if (!renderer) return;
        onScroll();
        current = target;
        measure();
        draw(performance.now());
        setReady(true);
        start();
      })
      .catch(() => undefined);

    const ro = new ResizeObserver(() => {
      measure();
      draw(performance.now());
    });
    ro.observe(canvas);
    // Nur zeichnen, solange der Globus zu sehen ist
    const io = new IntersectionObserver(([entry]) => {
      visible = Boolean(entry?.isIntersecting);
      if (visible) start();
      else stop();
    });
    io.observe(canvas);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      alive = false;
      stop();
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      renderer?.dispose();
    };
  }, [boxSelector, markSelector]);

  // Kugel genau bis in die unteren Ecken der Hero (Grösse hängt von Breite und Höhe ab)
  useEffect(() => {
    const scene = ref.current?.parentElement;
    return scene ? fitGlobe(scene) : undefined;
  }, []);

  return (
    <canvas
      ref={ref}
      className={className}
      data-ready={ready || undefined}
      aria-hidden
    />
  );
}
