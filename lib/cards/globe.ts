// Karte rechts: Punkt-Globus. Eine echte, sich drehende Kugel; die Kontinente bestehen nur aus Punkten,
// Europa in goldenen Punkten. Keine Verbindungslinien. Aussen ein grosser Umriss, der ruhig pulsiert
// und beim Grösserwerden leicht golden wird. Mit Maus oder Finger drehbar.
import { globeMap, MH, MW } from "@/lib/cards/globeMap";
import type { DragHandlers, Draw } from "@/lib/cards/types";

const TILT = 0.35; // Neigung: Norden leicht zum Betrachter
const STEP = 2.6; // Punktabstand in Grad (etwas weiter, damit die grösseren Punkte frei stehen)
let dots: { x: number; y: number; z: number; eu: boolean }[] | null = null;

const isEurope = (lat: number, lon: number) =>
  lat > 36 && lat < 71 && lon > -11 && lon < 40 && !(lat < 42 && lon > 26);

// Punkte einmal auf der Kugel verteilen (je Breitengrad so viele, dass der Abstand überall gleich ist), nur Land
function prepare() {
  const map = globeMap();
  if (dots || !map) return;
  const out: { x: number; y: number; z: number; eu: boolean }[] = [];
  for (let lat = -88 + STEP / 2; lat < 88; lat += STEP) {
    const a = (lat * Math.PI) / 180;
    const n = Math.max(1, Math.round((360 / STEP) * Math.cos(a)));
    for (let i = 0; i < n; i++) {
      const lon = -180 + ((i + 0.5) * 360) / n;
      const u = Math.floor(((lon + 180) / 360) * (MW - 1));
      const v = Math.floor((0.5 - lat / 180) * (MH - 1));
      if (!map.land[v * MW + u]) continue;
      const b = (lon * Math.PI) / 180;
      out.push({
        x: Math.cos(a) * Math.sin(b),
        y: Math.sin(a),
        z: Math.cos(a) * Math.cos(b),
        eu: isEurope(lat, lon),
      });
    }
  }
  dots = out;
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

  // Kugelkörper: ganz dunkel, feiner heller Rand
  const body = ctx.createRadialGradient(
    cx - R * 0.3,
    cy - R * 0.35,
    R * 0.1,
    cx,
    cy,
    R,
  );
  body.addColorStop(0, "rgba(255, 255, 255, 0.05)");
  body.addColorStop(1, "rgba(255, 255, 255, 0.01)");
  ctx.fillStyle = body;
  ctx.beginPath();
  ctx.arc(cx, cy, R, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "rgba(255, 255, 255, 0.12)";
  ctx.lineWidth = 1;
  ctx.stroke();

  // Punkte: drehen, neigen, nur die Vorderseite zeichnen (zum Rand hin schwächer)
  if (!dots) return;
  const c = Math.cos(-spin.angle);
  const s = Math.sin(-spin.angle);
  const ct = Math.cos(TILT);
  const st = Math.sin(TILT);
  const r = Math.max(0.9, R * 0.017); // Punktgrösse (vorne voll, zum Rand kleiner)
  for (const d of dots) {
    const x = d.x * c + d.z * s;
    const z0 = -d.x * s + d.z * c;
    const y = d.y * ct - z0 * st;
    const z = d.y * st + z0 * ct;
    if (z <= 0.02) continue;
    const a = Math.min(1, z * 1.6);
    ctx.fillStyle = d.eu
      ? `rgba(236, 219, 166, ${a})`
      : `rgba(255, 255, 255, ${0.42 * a})`;
    ctx.beginPath();
    ctx.arc(cx + x * R, cy - y * R, (d.eu ? r * 1.6 : r) * (0.55 + 0.45 * z), 0, Math.PI * 2);
    ctx.fill();
  }
};
