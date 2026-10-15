// Lichtbögen von Europa (Frankfurt) zu grossen Börsenplätzen: wachsen auf, ein Lichtpunkt läuft mit, blenden aus.
// Projektion passend zur Kugel in globe.ts (gleiche Neigung, gleiche Drehung).

const FROM = [50.1, 8.7] as const; // Frankfurt
const TO = [
  [40.7, -74.0], // New York
  [35.7, 139.7], // Tokio
  [1.3, 103.8], // Singapur
  [41.9, -87.6], // Chicago
  [22.3, 114.2], // Hongkong
  [-23.5, -46.6], // São Paulo
  [19.1, 72.9], // Mumbai
  [-33.9, 151.2], // Sydney
] as const;
const EVERY = 1.1; // alle 1,1 s startet ein neuer Bogen
const LIFE = 3.2; // so lange lebt ein Bogen (Aufbau 1,4 s, halten, ausblenden)
const STEPS = 48;

type V3 = [number, number, number];

const unit = (lat: number, lon: number): V3 => {
  const a = (lat * Math.PI) / 180;
  const b = (lon * Math.PI) / 180;
  return [Math.cos(a) * Math.sin(b), Math.sin(a), Math.cos(a) * Math.cos(b)];
};

/** Punkt auf/über der Kugel (Erd-Koordinaten) → Bildschirm. rot = Drehung der Erde, tilt = Neigung. */
function project(p: V3, rot: number, tilt: number) {
  // Drehung um die Erdachse (y), dann Neigung um x
  const c = Math.cos(-rot);
  const s = Math.sin(-rot);
  const x = p[0] * c + p[2] * s;
  const z0 = -p[0] * s + p[2] * c;
  const y = p[1] * Math.cos(tilt) - z0 * Math.sin(tilt);
  const z = p[1] * Math.sin(tilt) + z0 * Math.cos(tilt);
  return { x, y, z };
}

function slerp(a: V3, b: V3, f: number): V3 {
  const dot = Math.min(
    1,
    Math.max(-1, a[0] * b[0] + a[1] * b[1] + a[2] * b[2]),
  );
  const om = Math.acos(dot);
  const so = Math.sin(om) || 1;
  const ka = Math.sin((1 - f) * om) / so;
  const kb = Math.sin(f * om) / so;
  return [a[0] * ka + b[0] * kb, a[1] * ka + b[1] * kb, a[2] * ka + b[2] * kb];
}

export function drawArcs(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  R: number,
  t: number,
  rot: number,
  tilt: number,
) {
  const a = unit(FROM[0], FROM[1]);
  const first = Math.floor((t - LIFE) / EVERY);
  for (let k = Math.max(first, 0); k <= Math.floor(t / EVERY); k++) {
    const age = t - k * EVERY;
    if (age < 0 || age > LIFE) continue;
    const dest = TO[k % TO.length]!;
    const b = unit(dest[0], dest[1]);
    const grow = Math.min(age / 1.4, 1);
    const ease = 1 - (1 - grow) ** 3;
    const fade = age > LIFE - 0.8 ? (LIFE - age) / 0.8 : 1;
    let prev: { x: number; y: number; z: number } | null = null;
    const n = Math.max(2, Math.round(STEPS * ease));
    for (let i = 0; i <= n; i++) {
      const f = (i / STEPS) * 1;
      if (f > ease) break;
      const q = slerp(a, b, f);
      const lift = 1 + 0.18 * Math.sin(Math.PI * f); // Bogen hebt sich über die Oberfläche
      const p = project([q[0] * lift, q[1] * lift, q[2] * lift], rot, tilt);
      // sichtbar, wenn vor der Kugel oder ausserhalb der Kugelscheibe
      const front = p.z > 0 || p.x * p.x + p.y * p.y > 1;
      if (prev && front) {
        ctx.strokeStyle = `rgba(236, 219, 166, ${0.55 * fade * (0.4 + 0.6 * f)})`;
        ctx.lineWidth = 1.1;
        ctx.beginPath();
        ctx.moveTo(cx + prev.x * R, cy - prev.y * R);
        ctx.lineTo(cx + p.x * R, cy - p.y * R);
        ctx.stroke();
      }
      prev = front ? p : null;
    }
    // Lichtpunkt an der Spitze, beim Ziel ein kurzer Ring
    const tip = project(
      slerp(a, b, ease).map(
        (v) => v * (1 + 0.18 * Math.sin(Math.PI * ease)),
      ) as V3,
      rot,
      tilt,
    );
    if (tip.z > 0 || tip.x * tip.x + tip.y * tip.y > 1) {
      const glow = ctx.createRadialGradient(
        cx + tip.x * R,
        cy - tip.y * R,
        0,
        cx + tip.x * R,
        cy - tip.y * R,
        6,
      );
      glow.addColorStop(0, `rgba(255, 244, 214, ${0.9 * fade})`);
      glow.addColorStop(1, "rgba(255, 244, 214, 0)");
      ctx.fillStyle = glow;
      ctx.fillRect(cx + tip.x * R - 6, cy - tip.y * R - 6, 12, 12);
    }
    if (grow >= 1) {
      const end = project(b, rot, tilt);
      if (end.z > 0) {
        const r = 2 + (age - 1.4) * 6;
        ctx.strokeStyle = `rgba(236, 219, 166, ${Math.max(0, 0.6 - (age - 1.4) * 0.5) * fade})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(cx + end.x * R, cy - end.y * R, r, 0, Math.PI * 2);
        ctx.stroke();
      }
    }
  }
  // Ausgangspunkt Europa: ruhiger, heller Punkt
  const o = project(a, rot, tilt);
  if (o.z > 0) {
    ctx.fillStyle = "rgba(255, 244, 214, 0.95)";
    ctx.beginPath();
    ctx.arc(cx + o.x * R, cy - o.y * R, 2, 0, Math.PI * 2);
    ctx.fill();
  }
}
