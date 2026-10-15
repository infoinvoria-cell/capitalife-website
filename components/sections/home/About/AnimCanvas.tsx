"use client";

import { useEffect, useRef } from "react";

import type { DragHandlers, Draw } from "@/lib/cards/types";

// Zeichnet eine Animation scharf (Retina) und nur, solange sie sichtbar ist.
// Optional: wischen mit Maus oder Finger (drag). Bei "weniger Bewegung" ein einziges ruhiges Bild.
export function AnimCanvas({ draw, drag, className }: { draw: Draw; drag?: DragHandlers; className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let visible = false;
    const t0 = performance.now();

    const frame = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (canvas.width !== Math.round(w * dpr)) canvas.width = Math.round(w * dpr);
      if (canvas.height !== Math.round(h * dpr)) canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      draw(ctx, w, h, still ? 4 : (performance.now() - t0) / 1000);
    };
    const loop = () => {
      frame();
      raf = visible && !still ? requestAnimationFrame(loop) : 0;
    };
    const io = new IntersectionObserver(([e]) => {
      visible = Boolean(e?.isIntersecting);
      if (visible && !raf) raf = requestAnimationFrame(loop);
    });
    io.observe(canvas);
    const ro = new ResizeObserver(frame);
    ro.observe(canvas);

    // Wischen: Zeiger festhalten, Bewegung weitergeben; die andere Richtung bleibt fürs Scrollen frei
    let last: { x: number; y: number; t: number } | null = null;
    const down = (e: PointerEvent) => {
      if (!drag) return;
      canvas.setPointerCapture(e.pointerId);
      last = { x: e.clientX, y: e.clientY, t: performance.now() };
      canvas.style.cursor = "grabbing";
      drag.start();
    };
    const move = (e: PointerEvent) => {
      if (!drag || !last) return;
      const now = performance.now();
      drag.move(e.clientX - last.x, e.clientY - last.y, Math.max(now - last.t, 1));
      last = { x: e.clientX, y: e.clientY, t: now };
    };
    const up = () => {
      if (!drag || !last) return;
      last = null;
      canvas.style.cursor = "grab";
      drag.end();
    };
    if (drag) {
      canvas.style.cursor = "grab";
      canvas.style.touchAction = drag.axis === "x" ? "pan-y" : "pan-x";
      canvas.addEventListener("pointerdown", down);
      canvas.addEventListener("pointermove", move);
      canvas.addEventListener("pointerup", up);
      canvas.addEventListener("pointercancel", up);
    }
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      canvas.removeEventListener("pointerdown", down);
      canvas.removeEventListener("pointermove", move);
      canvas.removeEventListener("pointerup", up);
      canvas.removeEventListener("pointercancel", up);
    };
  }, [draw, drag]);

  return <canvas ref={ref} className={className} aria-hidden />;
}
