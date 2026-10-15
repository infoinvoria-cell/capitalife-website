"use client";

import { useEffect, useRef } from "react";

interface Star {
  x: number;
  y: number;
  radius: number;
  baseOpacity: number;
  phase: number;
  vx: number;
  vy: number;
}

export function StarfieldCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let rafId: number;
    let stars: Star[] = [];

    function resize() {
      if (!canvas) return;
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx!.scale(window.devicePixelRatio, window.devicePixelRatio);
      initStars();
    }

    function initStars() {
      if (!canvas) return;
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      const count = Math.floor((w * h) / 6000);
      stars = Array.from({ length: Math.min(count, 220) }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        radius: 0.2 + Math.random() * 0.6,
        baseOpacity: 0.5 + Math.random() * 0.5,
        phase: Math.random() * Math.PI * 2,
        vx: (Math.random() - 0.5) * 0.04,
        vy: (Math.random() - 0.5) * 0.04,
      }));
    }

    let time = 0;

    function draw() {
      if (!canvas || !ctx) return;
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      time += 0.016;

      ctx.clearRect(0, 0, w, h);

      for (const star of stars) {
        star.x += star.vx;
        star.y += star.vy;
        if (star.x < 0) star.x = w;
        if (star.x > w) star.x = 0;
        if (star.y < 0) star.y = h;
        if (star.y > h) star.y = 0;

        const opacity = star.baseOpacity * (0.6 + 0.4 * Math.sin(time * 0.8 + star.phase));
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
        ctx.fill();
      }

      rafId = requestAnimationFrame(draw);
    }

    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    resize();
    rafId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafId);
      observer.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
        pointerEvents: "none",
        display: "block",
        opacity: 0.3,
      }}
    />
  );
}
