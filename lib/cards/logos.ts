// Vereinfachte, einfarbige Zeichen der Tools für Karte 2 (nachgezeichnet, weiss).
// ACHTUNG: geschützte Marken. Vor dem Livegang Erlaubnis bzw. offizielle Markenrichtlinien prüfen.
type Painter = (c: CanvasRenderingContext2D) => void;

const poly = (c: CanvasRenderingContext2D, pts: number[]) => {
  c.beginPath();
  for (let i = 0; i < pts.length; i += 2) c.lineTo(pts[i]!, pts[i + 1]!);
  c.closePath();
  c.fill();
};
const dot = (c: CanvasRenderingContext2D, x: number, y: number, r: number) => {
  c.beginPath();
  c.arc(x, y, r, 0, Math.PI * 2);
  c.fill();
};

// Alle Zeichen im Feld 0..1
const PAINTERS: Record<string, Painter> = {
  "Interactive Brokers": (c) => {
    poly(c, [0.3, 0.49, 0.65, 0.08, 0.41, 0.63, 0.65, 0.88, 0.3, 0.88]);
    dot(c, 0.6, 0.59, 0.105);
  },
  Nasdaq: (c) => {
    poly(c, [0.35, 0.36, 0.5, 0.36, 0.35, 0.77, 0.21, 0.77]);
    poly(c, [0.5, 0.39, 0.555, 0.48, 0.5, 0.62, 0.45, 0.53]);
    poly(c, [0.66, 0.23, 0.8, 0.23, 0.66, 0.64, 0.52, 0.64]);
  },
  TradingView: (c) => {
    poly(
      c,
      [0.05, 0.27, 0.41, 0.27, 0.41, 0.73, 0.23, 0.73, 0.23, 0.45, 0.05, 0.45],
    );
    dot(c, 0.55, 0.36, 0.09);
    poly(c, [0.74, 0.27, 0.95, 0.27, 0.76, 0.73, 0.55, 0.73]);
  },
  Python: (c) => {
    c.beginPath();
    c.roundRect(0.27, 0.03, 0.46, 0.46, 0.1);
    c.roundRect(0.03, 0.26, 0.47, 0.47, 0.1);
    c.fill();
    c.globalAlpha = 0.6;
    c.beginPath();
    c.roundRect(0.27, 0.51, 0.46, 0.46, 0.1);
    c.roundRect(0.5, 0.27, 0.47, 0.47, 0.1);
    c.fill();
    c.globalAlpha = 1;
    c.globalCompositeOperation = "destination-out";
    dot(c, 0.37, 0.12, 0.045);
    dot(c, 0.63, 0.88, 0.045);
    c.fillRect(0.27, 0.49, 0.46, 0.025);
    c.globalCompositeOperation = "source-over";
  },
  "CME Group": (c) => {
    poly(
      c,
      [
        0.29, 0.02, 0.71, 0.02, 0.98, 0.29, 0.98, 0.71, 0.71, 0.98, 0.29, 0.98,
        0.02, 0.71, 0.02, 0.29,
      ],
    );
    c.globalCompositeOperation = "destination-out";
    c.lineWidth = 0.035;
    c.beginPath();
    for (const y of [0.22, 0.5, 0.78]) {
      c.moveTo(0, y);
      c.lineTo(1, y);
    }
    c.moveTo(0.5, 0);
    c.lineTo(0.5, 1);
    c.stroke();
    c.beginPath();
    c.ellipse(0.5, 0.5, 0.27, 0.52, 0, 0, Math.PI * 2);
    c.stroke();
    c.globalCompositeOperation = "source-over";
  },
};

// Zeichen aus Bilddateien (weiss, transparent), z. B. Levantis-Baum aus public/Levantis_partner.png
const IMAGE_MARKS: Record<string, string> = {
  Levantis: "/hero/levantis-icon.png",
};

const cache = new Map<string, HTMLCanvasElement>();
const loadingImg = new Set<string>();
const SIZE = 128;
const OPTICAL = 0.55; // Ziel-Grösse (Anteil der Kachel), gemessen als optische Grösse

/** Gleicht ein Zeichen optisch an: auf den sichtbaren Inhalt zuschneiden und so skalieren, dass
 *  sichtbare Fläche und Ausdehnung zusammen bei allen Zeichen gleich wirken. */
function normalize(src: HTMLCanvasElement): HTMLCanvasElement {
  const d = src.getContext("2d")?.getImageData(0, 0, SIZE, SIZE).data;
  if (!d) return src;
  let x0 = SIZE,
    y0 = SIZE,
    x1 = 0,
    y1 = 0,
    ink = 0;
  for (let y = 0; y < SIZE; y++) {
    for (let x = 0; x < SIZE; x++) {
      const a = (d[(y * SIZE + x) * 4 + 3] ?? 0) / 255;
      if (a <= 0.05) continue;
      ink += a;
      x0 = Math.min(x0, x);
      x1 = Math.max(x1, x);
      y0 = Math.min(y0, y);
      y1 = Math.max(y1, y);
    }
  }
  if (!ink) return src;
  const bw = x1 - x0 + 1;
  const bh = y1 - y0 + 1;
  const optical = Math.sqrt(Math.sqrt(ink) * Math.sqrt(bw * bh));
  const k = Math.min((OPTICAL * SIZE) / optical, SIZE / bw, SIZE / bh);
  const out = document.createElement("canvas");
  out.width = SIZE;
  out.height = SIZE;
  out
    .getContext("2d")
    ?.drawImage(
      src,
      x0,
      y0,
      bw,
      bh,
      (SIZE - bw * k) / 2,
      (SIZE - bh * k) / 2,
      bw * k,
      bh * k,
    );
  return out;
}

/** Liefert das Zeichen als kleine Grafik (128 px, weiss, transparent). */
export function logoMark(name: string): HTMLCanvasElement | null {
  if (typeof document === "undefined") return null;
  const hit = cache.get(name);
  if (hit) return hit;
  const src = IMAGE_MARKS[name];
  if (src) {
    if (!loadingImg.has(name)) {
      loadingImg.add(name);
      const img = new Image();
      img.onload = () => {
        const cv = document.createElement("canvas");
        cv.width = SIZE;
        cv.height = SIZE;
        const k = Math.min(SIZE / img.naturalWidth, SIZE / img.naturalHeight);
        const w = img.naturalWidth * k;
        const h = img.naturalHeight * k;
        cv.getContext("2d")?.drawImage(
          img,
          (SIZE - w) / 2,
          (SIZE - h) / 2,
          w,
          h,
        );
        cache.set(name, normalize(cv));
      };
      img.src = src;
    }
    return null;
  }
  const paint = PAINTERS[name];
  if (!paint) return null;
  const cv = document.createElement("canvas");
  cv.width = SIZE;
  cv.height = SIZE;
  const c = cv.getContext("2d");
  if (!c) return null;
  c.scale(SIZE, SIZE);
  c.fillStyle = "#fff";
  c.strokeStyle = "#fff";
  paint(c);
  const done = normalize(cv);
  cache.set(name, done);
  return done;
}
