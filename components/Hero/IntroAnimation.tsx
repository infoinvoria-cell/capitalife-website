"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

/* ─── Stage constants ───────────────────────────────────────────── */

const STAGE = {
  LOGO_IN:  0,  // 0 → 1 200ms: text logo fades in
  HOLD:     1,  // 1 200 → 2 000ms: logo holds
  TEXT_OUT: 2,  // 2 000 → 2 500ms: text fades out, icon fades in
  ICON_FLY: 3,  // 2 500 → 3 100ms: icon flies to navbar + overlay fades
  DONE:     4,
} as const;

type StageVal = (typeof STAGE)[keyof typeof STAGE];

/* ─── Props ─────────────────────────────────────────────────────── */

interface Props {
  navLogoRef: React.RefObject<HTMLImageElement | null>;
  onComplete: () => void;
}

/* ─── Constants ─────────────────────────────────────────────────── */

const ICON_SIZE = 48;

/* ─── Component ─────────────────────────────────────────────────── */

export function IntroAnimation({ navLogoRef, onComplete }: Props) {
  const [stage, setStage]           = useState<StageVal>(STAGE.LOGO_IN);
  const [logoOpacity, setLogoOp]    = useState(0);
  const [flyPos, setFlyPos]         = useState<{ left: number; top: number } | null>(null);

  const iconCenterRef  = useRef({ left: 0, top: 0 });
  const onCompleteRef  = useRef(onComplete);

  // Keep the callback ref fresh without adding it as an effect dep
  useEffect(() => { onCompleteRef.current = onComplete; });

  // Compute pixel-based icon center once on mount (used for fly start position)
  useEffect(() => {
    iconCenterRef.current = {
      left: window.innerWidth  / 2 - ICON_SIZE / 2,
      top:  window.innerHeight / 2 - ICON_SIZE / 2,
    };
  }, []);

  // Runs once on mount. navLogoRef is accessed inside a 2500ms timeout — by
  // then the DOM is laid out and .current is populated. RefObjects are not
  // reactive, so including navLogoRef in deps would be incorrect.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (sessionStorage.getItem("introPlayed")) {
      setStage(STAGE.DONE);
      onCompleteRef.current();
      return;
    }

    // Trigger logo opacity transition after initial paint (double rAF)
    const rafId = requestAnimationFrame(() => {
      requestAnimationFrame(() => setLogoOp(1));
    });

    const timers = [
      // STAGE 1: hold — logo is fully visible
      setTimeout(() => setStage(STAGE.HOLD), 1200),

      // STAGE 2: text fades out, icon fades in
      setTimeout(() => setStage(STAGE.TEXT_OUT), 2000),

      // STAGE 3: icon flies to navbar, overlay fades
      setTimeout(() => {
        if (navLogoRef.current) {
          const nr = navLogoRef.current.getBoundingClientRect();
          setFlyPos({ left: nr.left, top: nr.top });
        }
        setStage(STAGE.ICON_FLY);
      }, 2500),

      // STAGE 4: done
      setTimeout(() => {
        setStage(STAGE.DONE);
        sessionStorage.setItem("introPlayed", "true");
        onCompleteRef.current();
      }, 3100),
    ];

    return () => {
      cancelAnimationFrame(rafId);
      timers.forEach(clearTimeout);
    };
  }, []); // intentionally empty — runs once on mount

  if (stage === STAGE.DONE) return null;

  const isFly      = stage === STAGE.ICON_FLY;
  const isTextOut  = stage === STAGE.TEXT_OUT;
  const showIcon   = stage >= STAGE.TEXT_OUT;

  return (
    <>
      {/* Scoped keyframes — injected once, names prefixed to avoid collisions */}
      <style>{`
        @keyframes cap-logo-out { from { opacity: 1; } to { opacity: 0; } }
        @keyframes cap-icon-in  { from { opacity: 0; } to { opacity: 1; } }
      `}</style>

      {/* ── BLACK OVERLAY ──────────────────────────────────────── */}
      <div
        style={{
          position: "fixed", inset: 0,
          background: "#000",
          zIndex: 9999,
          opacity: isFly ? 0 : 1,
          transition: isFly ? "opacity 0.6s ease-out" : "none",
          pointerEvents: "none",
          willChange: "opacity",
        }}
      />

      {/* ── STAGE 0–2: Full text logo ──────────────────────────── */}
      {stage <= STAGE.TEXT_OUT && (
        <div
          style={{
            position: "fixed", inset: 0,
            display: "flex", alignItems: "center", justifyContent: "center",
            zIndex: 10000, pointerEvents: "none",
          }}
        >
          <Image
            src="/Capitalife-text_logo.png"
            alt="Capitalife"
            width={320}
            height={64}
            style={{
              display: "block",
              willChange: "opacity",
              // TEXT_OUT: CSS animation from 1→0 (avoids animation/transition conflict)
              // LOGO_IN/HOLD: CSS transition 0→1 controlled by logoOpacity state
              ...(isTextOut
                ? { animation: "cap-logo-out 0.5s ease forwards" }
                : { opacity: logoOpacity, transition: "opacity 1.2s cubic-bezier(0.16,1,0.3,1)" }
              ),
            }}
            priority
          />
        </div>
      )}

      {/* ── STAGE 2–3: C icon, centered → flies to navbar ────── */}
      {showIcon && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src="/CAPITALIFE_ICON.png"
          alt=""
          style={{
            position: "fixed",
            width: ICON_SIZE,
            height: "auto",
            zIndex: 10001,
            pointerEvents: "none",
            willChange: "transform, opacity, left, top",
            ...(isFly && flyPos
              ? {
                  // Fly: transition from center to navbar rect position
                  left: flyPos.left,
                  top:  flyPos.top,
                  transform: "translate(0, 0) scale(0.7)",
                  opacity: 1,
                  animation: "none",
                  transition: "all 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
                }
              : {
                  // Center: pixel-based so transition to px navbar pos works
                  left: iconCenterRef.current.left,
                  top:  iconCenterRef.current.top,
                  animation: "cap-icon-in 0.5s ease forwards",
                }
            ),
          }}
        />
      )}
    </>
  );
}
