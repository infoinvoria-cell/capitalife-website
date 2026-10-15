"use client";

import { useEffect, useRef } from "react";

import styles from "./About.module.css";

// Feiner Nebel unter dem Mauszeiger: kleine Schwaden entstehen am Zeiger, treiben mit der Bewegung weiter,
// verwirbeln leicht, dehnen sich aus und lösen sich auf. Sehr dezent. Auf Touch-Geräten und bei
// "weniger Bewegung" aus. Gezeichnet wird nur, solange Schwaden leben.
type Puff = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  age: number;
  life: number;
  seed: number;
};

const MAX = 90;
const EMIT = 0.09; // Sekunden zwischen zwei Schwaden, auch im Stillstand (durchgehender Nebel)

export function FogCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    const host = canvas?.parentElement;
    if (!canvas || !ctx || !host) return;
    if (
      window.matchMedia("(pointer: coarse), (prefers-reduced-motion: reduce)")
        .matches
    )
      return;

    const puffs: Puff[] = [];
    let raf = 0;
    let last = performance.now();
    let prev: { x: number; y: number } | null = null;
    let pointer: { x: number; y: number } | null = null;
    let since = 0;
    const emit = (x: number, y: number, vx: number, vy: number) => {
      if (puffs.length >= MAX) puffs.shift();
      puffs.push({
        x,
        y,
        vx,
        vy,
        r: 90 + Math.random() * 50,
        age: 0,
        life: 3 + Math.random() * 1.5,
        seed: Math.random(),
      });
    };

    const size = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(canvas.clientWidth * dpr);
      canvas.height = Math.round(canvas.clientHeight * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      // Durchgehend: solange der Zeiger in der Sektion ist, entsteht gleichmässig neuer Nebel
      if (pointer) {
        since += dt;
        while (since >= EMIT) {
          since -= EMIT;
          emit(
            pointer.x + (Math.random() - 0.5) * 30,
            pointer.y + (Math.random() - 0.5) * 30,
            0,
            0,
          );
        }
      }
      ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
      ctx.globalCompositeOperation = "lighter";
      for (let i = puffs.length - 1; i >= 0; i--) {
        const p = puffs[i]!;
        p.age += dt;
        if (p.age >= p.life) {
          puffs.splice(i, 1);
          continue;
        }
        // leichte Verwirbelung + Reibung + ganz leichter Auftrieb
        const swirl = Math.sin(now / 900 + p.seed * 6.3) * 14;
        p.vx += (swirl - p.vx * 1.6) * dt;
        p.vy +=
          (Math.cos(now / 1100 + p.seed * 4.1) * 10 - 6 - p.vy * 1.6) * dt;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.r += 70 * dt; // gross und weich
        const k = p.age / p.life;
        const a = 0.009 * Math.sin(Math.PI * k); // kaum sichtbar, weich ein- und ausblenden
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r);
        g.addColorStop(0, `rgba(236, 228, 210, ${a})`);
        g.addColorStop(1, "rgba(236, 228, 210, 0)");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = puffs.length || pointer ? requestAnimationFrame(tick) : 0;
    };

    const move = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      // Bei schneller Bewegung Schwaden entlang des Wegs verteilen (nicht abgehackt)
      if (prev) {
        const dist = Math.hypot(x - prev.x, y - prev.y);
        const steps = Math.min(Math.floor(dist / 40), 6);
        for (let i = 1; i <= steps; i++) {
          const f = i / (steps + 1);
          emit(
            prev.x + (x - prev.x) * f,
            prev.y + (y - prev.y) * f,
            (x - prev.x) * 2,
            (y - prev.y) * 2,
          );
        }
      }
      prev = { x, y };
      pointer = { x, y };
      if (!raf) {
        last = performance.now();
        raf = requestAnimationFrame(tick);
      }
    };
    const leave = () => {
      prev = null;
      pointer = null;
    };

    size();
    const ro = new ResizeObserver(size);
    ro.observe(canvas);
    host.addEventListener("pointermove", move);
    host.addEventListener("pointerleave", leave);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      host.removeEventListener("pointermove", move);
      host.removeEventListener("pointerleave", leave);
    };
  }, []);

  return <canvas ref={ref} className={styles["fog"]} aria-hidden />;
}
