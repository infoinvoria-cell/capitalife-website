import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Kein "N"-Symbol unten links im Entwicklungsmodus (live erscheint es ohnehin nie)
  devIndicators: false,
};

export default nextConfig;
