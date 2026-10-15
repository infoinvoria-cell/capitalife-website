// Karte Mitte: grosse dunkle Kugel links mit schlichtem Capitalife-Logo, innen am Rand ein leichter Verlauf.
// Am rechten Kugelrand springen die Tool-Logos (weiss, einfarbig) Schritt für Schritt weiter (Federphysik).
import { tools } from "@/content/home/tools";
import { logoMark } from "@/lib/cards/logos";
import type { DragHandlers, Draw } from "@/lib/cards/types";

let icon: HTMLImageElement | null = null;
function getIcon() {
  if (!icon && typeof Image !== "undefined") {
    icon = new Image();
    icon.src = "/CAPITALIFE_ICON.png";
  }
  return icon;
}

const STEP = 1.2; // Sekunden pro Sprung
// Gedämpfte Feder: 0 → 1 mit leichtem Überschwingen, nach ca. 0,8 des Schritts ruhig
const spring = (f: number) => {
  const x = Math.min(f / 0.8, 1);
  return 1 - Math.exp(-6 * x) * Math.cos(9 * x);
};

// Wischen: Logos lassen sich hoch und runter ziehen (mit Schwung). Danach rasten sie auf den
// nächsten Platz ein und der Loop läuft von dort weiter.
const s = { manual: 0, vel: 0, dragging: false, clock: 0, lastT: 0, gap: 60 };

export const toolsDrag: DragHandlers = {
  axis: "y",
  start: () => {
    s.dragging = true;
    s.vel = 0;
  },
  move: (_dx, dy, dtMs) => {
    const d = -dy / s.gap; // nach oben ziehen = Logos wandern nach oben
    s.manual += d;
    s.vel = (d / dtMs) * 1000;
  },
  end: () => {
    s.dragging = false;
  },
};

export const toolsArc: Draw = (ctx, w, h, t) => {
  const dt = Math.min(Math.max(t - s.lastT, 0), 0.1);
  s.lastT = t;
  if (!s.dragging) {
    s.manual += s.vel * dt;
    s.vel *= Math.exp(-5 * dt); // Reibung
    if (Math.abs(s.vel) < 0.4) {
      s.manual += (Math.round(s.manual) - s.manual) * Math.min(1, dt * 8); // einrasten
      s.clock += dt; // Loop läuft nur, wenn nicht gewischt wird
    }
  }
  const R = h * 0.95;
  // rechter Kugelrand bei 55 % der Breite. Nur die Kugel pulsiert ruhig nach links und rechts,
  // die Logos laufen auf der festen Bahn (baseX).
  const baseX = w * 0.55 - R;
  const cx = w * (0.55 + 0.012 * Math.sin(t * 1.6)) - R;
  const cy = h / 2;

  // Kugel mit leichtem Verlauf innen am Rand
  const body = ctx.createRadialGradient(cx, cy, R * 0.55, cx, cy, R);
  body.addColorStop(0, "rgba(4, 4, 4, 1)");
  body.addColorStop(0.82, "rgba(12, 12, 11, 1)");
  body.addColorStop(1, "rgba(46, 45, 41, 1)");
  ctx.fillStyle = body;
  ctx.beginPath();
  ctx.arc(cx, cy, R, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "rgba(255, 255, 255, 0.16)";
  ctx.lineWidth = 1;
  ctx.stroke();

  // Logo schlicht, ohne Rahmen
  const img = getIcon();
  if (img?.complete && img.naturalWidth) {
    const ih = h * 0.3;
    const iw = (ih * img.naturalWidth) / img.naturalHeight;
    ctx.drawImage(img, w * 0.24 - iw / 2, cy - ih / 2, iw, ih);
  }

  // Logos: springen nacheinander nach oben, die Mitte ist hell und etwas grösser
  const n = tools.length;
  const phase = s.clock / STEP;
  const offset =
    Math.floor(phase) + spring(phase - Math.floor(phase)) + s.manual;
  const gap = h / 4.2;
  s.gap = gap;
  tools.forEach((name, i) => {
    let slot = (i - offset) % n;
    if (slot < -n / 2) slot += n;
    if (slot > n / 2) slot -= n;
    const y = cy + slot * gap;
    const dy = y - cy;
    if (Math.abs(dy) > h * 0.62) return;
    const focus = Math.max(0, 1 - Math.abs(slot) / 2.2);
    const size = h * (0.17 + 0.05 * focus); // Zeichen sind optisch angeglichen (lib/cards/logos.ts)
    const x = baseX + Math.sqrt(Math.max(R * R - dy * dy, 0)) + 30; // Abstand der Logos zum Kugelrand
    const mark = logoMark(name);
    if (!mark) return;
    ctx.globalAlpha = 0.25 + 0.7 * focus;
    ctx.drawImage(mark, x, y - size / 2, size, size);
    ctx.globalAlpha = 1;
  });
};
