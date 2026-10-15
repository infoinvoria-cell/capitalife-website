// Karte rechts: kleine Erde im Stil der Hero (echte NASA-Oberfläche, dunkle Kugel, Licht von oben links),
// schwarz-weiss, dreht sich langsam. Aussen ein grosser Umriss mit Verlauf innen, der ruhig pulsiert
// und beim Grösserwerden leicht golden wird.
import type { DragHandlers, Draw } from "@/lib/cards/types";

const S = 220; // interne Auflösung der Kugel in Pixeln (Durchmesser)
const TW = 1024;
const TH = 512;
let tex: Uint8Array | null = null;
let base: { lat: Float32Array; lon: Float32Array; shade: Float32Array; inside: Uint8Array } | null = null;
let loading = false;
let buffer: HTMLCanvasElement | null = null;

function prepare() {
  if (loading || typeof Image === "undefined") return;
  loading = true;
  const img = new Image();
  img.onload = () => {
    const c = document.createElement("canvas");
    c.width = TW;
    c.height = TH;
    const x = c.getContext("2d");
    if (!x) return;
    x.drawImage(img, 0, 0, TW, TH);
    const d = x.getImageData(0, 0, TW, TH).data;
    const out = new Uint8Array(TW * TH);
    for (let i = 0; i < TW * TH; i++) out[i] = d[i * 4] ?? 0;
    tex = out;
  };
  img.src = "/hero/earth-day.jpg";

  // Feste Blickgeometrie (Neigung) und Licht einmal vorrechnen
  const n = S * S;
  const b = { lat: new Float32Array(n), lon: new Float32Array(n), shade: new Float32Array(n), inside: new Uint8Array(n) };
  const tilt = 0.35;
  const L = [-0.5, 0.72, 0.48] as const;
  const ll = Math.hypot(L[0], L[1], L[2]);
  for (let py = 0; py < S; py++) {
    for (let px = 0; px < S; px++) {
      const i = py * S + px;
      const nx = (px + 0.5) / (S / 2) - 1;
      const ny = 1 - (py + 0.5) / (S / 2);
      const r2 = nx * nx + ny * ny;
      if (r2 >= 1) continue;
      const nz = Math.sqrt(1 - r2);
      b.inside[i] = 1;
      const y = ny * Math.cos(tilt) + nz * Math.sin(tilt);
      const z = -ny * Math.sin(tilt) + nz * Math.cos(tilt);
      b.lat[i] = Math.asin(Math.max(-1, Math.min(1, y)));
      b.lon[i] = Math.atan2(nx, z);
      const diffuse = Math.max(0, (nx * L[0] + ny * L[1] + nz * L[2]) / ll);
      const rim = (1 - nz) ** 3 * Math.max(0, (-nx * 0.55 + ny * 0.83) / Math.sqrt(r2 || 1));
      b.shade[i] = 0.35 + 0.9 * diffuse ** 1.3 + rim * 0.5; // genug Licht, damit die Kontinente gut lesbar sind
    }
  }
  base = b;
  buffer = document.createElement("canvas");
  buffer.width = S;
  buffer.height = S;
}

// 1 innerhalb [a, b], weich auslaufend über 4 Grad
const soft = (x: number, a: number, b: number) => Math.min(Math.max(Math.min(x - a, b - x) / 4 + 0.5, 0), 1);

function renderEarth(rot: number): boolean {
  const ctx = buffer?.getContext("2d");
  if (!ctx || !base || !tex) return false;
  const img = ctx.createImageData(S, S);
  const o = img.data;
  const TAU = Math.PI * 2;
  for (let i = 0; i < S * S; i++) {
    if (!base.inside[i]) continue;
    const lon = ((((base.lon[i] ?? 0) + rot + Math.PI) % TAU) + TAU) % TAU;
    const u = Math.floor((lon / TAU) * (TW - 1));
    const v = Math.floor((0.5 - (base.lat[i] ?? 0) / Math.PI) * (TH - 1));
    const raw = tex[v * TW + u] ?? 0;
    const alb = (raw / 255) ** 1.2;
    const val = Math.min(1, 0.02 + (base.shade[i] ?? 0) * (0.03 + alb * 1.1));
    // Europa (Land zwischen ca. 35–72° N und 11° W–40° O) gold, sonst schwarz-weiss
    const latD = ((base.lat[i] ?? 0) * 180) / Math.PI;
    const lonD = (lon / TAU) * 360 - 180;
    const eu = soft(latD, 35, 72) * soft(lonD, -11, 40) * (raw > 52 ? 1 : 0);
    // Europa: eine flache Goldfarbe (nur leicht schattiert), damit es heraussticht
    const lit = Math.min(1, 0.55 + 0.45 * Math.min(base.shade[i] ?? 0, 1));
    // helles Weiss-Gold der Marke (#ecdba6)
    o[i * 4] = 242 * val * (1 - eu) + 236 * lit * eu;
    o[i * 4 + 1] = 242 * val * (1 - eu) + 219 * lit * eu;
    o[i * 4 + 2] = 240 * val * (1 - eu) + 166 * lit * eu;
    o[i * 4 + 3] = 255;
  }
  ctx.putImageData(img, 0, 0);
  return true;
}

// Wischen: Globus links/rechts drehen, dreht mit Schwung weiter, Reibung bremst, dann normale Drehung.
const AUTO = 0.12; // Grunddrehung (rad/s)
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

  // Erde (bis die Textur geladen ist: dunkle Kugel)
  if (renderEarth(spin.angle) && buffer) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, R, 0, Math.PI * 2);
    ctx.clip();
    ctx.drawImage(buffer, cx - R, cy - R, 2 * R, 2 * R);
    ctx.restore();
  } else {
    ctx.fillStyle = "#070707";
    ctx.beginPath();
    ctx.arc(cx, cy, R, 0, Math.PI * 2);
    ctx.fill();
  }
};
