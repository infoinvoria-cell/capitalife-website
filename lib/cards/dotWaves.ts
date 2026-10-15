// Hintergrund der Gründer-Box: Punkte auf einer Wellenfläche in leichter 3D-Perspektive,
// langsam bewegt. Sehr dunkel: hinten kaum sichtbar, vorne etwas heller, ganz leicht warm.
import type { Draw } from "@/lib/cards/types";

const COLS = 70;
const ROWS = 26;

export const dotWaves: Draw = (ctx, w, h, t) => {
  const near = 1 / 0.6;
  const far = 1 / 2.2;
  for (let j = 0; j < ROWS; j++) {
    const d = j / (ROWS - 1); // 0 vorne … 1 hinten
    const s = 1 / (0.6 + d * 1.6); // Perspektive
    const k = (s - far) / (near - far); // 0 hinten … 1 vorne
    for (let i = 0; i < COLS; i++) {
      const xN = (i / (COLS - 1)) * 2 - 1; // -1 … 1
      const wave =
        Math.sin(xN * 3.2 + t * 0.6 + d * 2.4) * 0.6 + Math.cos(d * 5.5 - t * 0.45 + xN * 1.3) * 0.4;
      const x = w / 2 + xN * w * 0.85 * s;
      const y = h * 0.06 + h * 1.0 * k - wave * h * 0.07 * s; // Fläche reicht bis nach oben, auch hinter die Köpfe
      if (x < -4 || x > w + 4 || y < -4 || y > h + 4) continue;
      const a = 0.05 + 0.2 * k * (0.75 + 0.25 * wave);
      ctx.fillStyle = `rgba(236, 228, 210, ${a.toFixed(3)})`;
      ctx.beginPath();
      ctx.arc(x, y, 0.6 + 0.9 * k, 0, Math.PI * 2);
      ctx.fill();
    }
  }
};
