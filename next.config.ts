import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Kein "N"-Symbol unten links im Entwicklungsmodus (live erscheint es ohnehin nie)
  devIndicators: false,
  async redirects() {
    return [
      { source: "/partner", destination: "/partner-program", permanent: true },
      { source: "/tippgeber", destination: "/partner-program", permanent: true },
    ];
  },
};

export default nextConfig;
