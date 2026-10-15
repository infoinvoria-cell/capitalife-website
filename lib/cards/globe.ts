// Karte rechts: Umriss-Globus. Keine echte Landschaft, nur feine Küstenlinien und ein leichtes Gradnetz,
// Europa als goldene Fläche. Dreht sich zügig, von Europa laufen Lichtbögen zu grossen Börsenplätzen.
// Aussen ein grosser Umriss mit Verlauf innen, der ruhig pulsiert und beim Grösserwerden leicht golden wird.
import { drawArcs } from "@/lib/cards/globeArcs";
import { globeMap, MH, MW } from "@/lib/cards/globeMap";
import type { DragHandlers, Draw } from "@/lib/cards/types";

const S = 300; // interne Auflösung der Kugel in Pixeln (Durchmesser)
const TILT = 0.35; // Neigung: Norden leicht zum Betrachter
let base: {
  lat: Float32Array;
  lon: Float32Array;
  shade: Float32Array;
  inside: Uint8Array;
} | null = null;
let buffer: HTMLCanvasElement | null = null;

function prepare() {
  globeMap();
  if (base || typeof document === "undefined") return;
  // Feste Blickgeometrie (Neigung) und Licht einmal vorrechnen
  const n = S * S;
  const b = {
    lat: new Float32Array(n),
    lon: new Float32Array(n),
    shade: new Float32Array(n),
    inside: new Uint8Array(n),
  };
  for (let py = 0; py < S; py++) {
    for (let px = 0; px < S; px++) {
      const i = py * S + px;
      const nx = (px + 0.5) / (S / 2) - 1;
      const ny = 1 - (py + 0.5) / (S / 2);
      const r2 = nx * nx + ny * ny;
      if (r2 >= 1) continue;
      const nz = Math.sqrt(1 - r2);
      b.inside[i] = 1;
      const y = ny * Math.cos(TILT) + nz * Math.sin(TILT);
      const z = -ny * Math.sin(TILT) + nz * Math.cos(TILT);
      b.lat[i] = Math.asin(Math.max(-1, Math.min(1, y)));
      b.lon[i] = Math.atan2(nx, z);
      b.shade[i] = 0.35 + 0.65 * nz; // zum Rand hin dunkler: wirkt räumlich
    }
  }
  base = b;
  buffer = document.createElement("canvas");
  buffer.width = S;
  buffer.height = S;
}

// 1 innerhalb [a, b], weich auslaufend über 4 Grad
const soft = (x: number, a: number, b: number) =>
  Math.min(Math.max(Math.min(x - a, b - x) / 4 + 0.5, 0), 1);
// feine Linie alle 30 Grad (Gradnetz)
const grid = (deg: number) => {
  const m = Math.abs((((deg % 30) + 45) % 30) - 15);
  return Math.max(0, 1 - m / 0.9); // m = Abstand zur nächsten 30-Grad-Linie
};

function renderEarth(rot: number): boolean {
  const ctx = buffer?.getContext("2d");
  const map = globeMap();
  if (!ctx || !base || !map) return false;
  const img = ctx.createImageData(S, S);
  const o = img.data;
  const TAU = Math.PI * 2;
  for (let i = 0; i < S * S; i++) {
    if (!base.inside[i]) continue;
    const lon = ((((base.lon[i] ?? 0) + rot + Math.PI) % TAU) + TAU) % TAU;
    const u = Math.floor((lon / TAU) * (MW - 1));
    const v = Math.floor((0.5 - (base.lat[i] ?? 0) / Math.PI) * (MH - 1));
    const k = v * MW + u;
    const land = map.land[k] ?? 0;
    const coast = (map.coast[k] ?? 0) / 255;
    const sh = base.shade[i] ?? 0;
    const latD = ((base.lat[i] ?? 0) * 180) / Math.PI;
    const lonD = (lon / TAU) * 360 - 180;
    const net = Math.max(grid(latD), grid(lonD)) * 0.07;
    // dunkle Kugel, Land kaum angedeutet, Küste als feine helle Linie
    const val = Math.min(
      1,
      0.035 * sh + land * 0.045 * sh + coast * 0.62 * sh + net * sh,
    );
    // Europa: goldene Fläche mit hellerer Küste
    // ohne Nordafrika (unter 37° N) und ohne Türkei/Nahost
    const eu =
      soft(latD, 37, 72) *
      soft(lonD, -11, 60) *
      Math.min(1, Math.max(0, (46 - lonD) / 16)) * // nach Osten weich auslaufen (keine gerade Kante)
      (1 - soft(latD, 28, 41.5) * soft(lonD, 26, 50)) *
      Math.max(land, coast);
    const gold = Math.min(1, (0.42 + coast * 0.5) * (0.55 + 0.45 * sh));
    o[i * 4] = 242 * val * (1 - eu) + 236 * gold * eu;
    o[i * 4 + 1] = 242 * val * (1 - eu) + 219 * gold * eu;
    o[i * 4 + 2] = 240 * val * (1 - eu) + 166 * gold * eu;
    o[i * 4 + 3] = 255;
  }
  ctx.putImageData(img, 0, 0);
  return true;
}

// Wischen: Globus links/rechts drehen, dreht mit Schwung weiter, Reibung bremst, dann normale Drehung.
const AUTO = 0.32; // Grunddrehung (rad/s), zügig
const spin = { angle: 0, vel: 0, dragging: false, lastT: 0 };

export const earthDrag: DragHandlers = {
  axis: "x",
  start: () => {
    spin.dragging = true;
    spin.vel = 0;
  },
  move: (dx, _dy, dtMs) => {
    const d = -dx * 0.012; // Pixel → Drehung (Richtung umgekehrt: links wischen dreht entgegen)
    spin.angle += d;
    spin.vel = Math.max(-12, Math.min(12, (d / dtMs) * 1000));
  },
  end: () => {
    spin.dragging = false;
  },
};

export const earthCard: Draw = (ctx, w, h, t) => {
  prepare();
  const dt = Math.min(Math.max(t - spin.lastT, 0), 0.1);
  spin.lastT = t;
  if (!spin.dragging) {
    spin.angle += (AUTO + spin.vel) * dt;
    spin.vel *= Math.exp(-1.6 * dt); // Reibung
  }
  const cx = w / 2;
  const cy = h / 2;
  const R = Math.min(w, h) * 0.3;
  // Grosser Umriss, pulsiert ruhig in der Grösse (kein umlaufendes Licht).
  // Klein = weiss, je grösser desto mehr leicht golden.
  const pulse = Math.sin(t * 1.3);
  const ringR = R * 1.82 * (1 + 0.025 * pulse); // etwas grösser als die Karte: oben und unten leicht angeschnitten
  const g = ((pulse + 1) / 2) ** 2; // 0 klein … 1 gross
  const rgb = `${Math.round(255 - 29 * g)}, ${Math.round(255 - 53 * g)}, ${Math.round(255 - 133 * g)}`; // weiss → #e2ca7a

  // Leichter Verlauf an der Innenseite des Rings
  const inner = ctx.createRadialGradient(cx, cy, ringR * 0.86, cx, cy, ringR);
  inner.addColorStop(0, `rgba(${rgb}, 0)`);
  inner.addColorStop(1, `rgba(${rgb}, ${0.07 + 0.03 * g})`);
  ctx.fillStyle = inner;
  ctx.beginPath();
  ctx.arc(cx, cy, ringR, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = `rgba(${rgb}, ${0.16 + 0.1 * g})`;
  ctx.lineWidth = 1;
  ctx.stroke();

  // Erde (bis die Karte geladen ist: dunkle Kugel)
  if (renderEarth(spin.angle) && buffer) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, R, 0, Math.PI * 2);
    ctx.clip();
    ctx.drawImage(buffer, cx - R, cy - R, 2 * R, 2 * R);
    ctx.restore();
    // feiner heller Kugelrand
    ctx.strokeStyle = "rgba(255, 255, 255, 0.14)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(cx, cy, R, 0, Math.PI * 2);
    ctx.stroke();
    drawArcs(ctx, cx, cy, R, t, spin.angle, TILT);
  } else {
    ctx.fillStyle = "#070707";
    ctx.beginPath();
    ctx.arc(cx, cy, R, 0, Math.PI * 2);
    ctx.fill();
  }
};
