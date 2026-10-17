import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Kein "N"-Symbol unten links im Entwicklungsmodus (live erscheint es ohnehin nie)
  devIndicators: false,
  // Reine statische Seite (Ordner out/), gehostet auf Cloudflare Pages. Kein eigener Server nötig.
  output: "export",
  // Ohne Server keine Bild-Optimierung durch Next: Bilder werden so ausgeliefert, wie sie in public/ liegen.
  images: { unoptimized: true },
};

export default nextConfig;
