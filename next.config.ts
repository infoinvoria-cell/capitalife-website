import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/partner", destination: "/partner-program", permanent: true },
      { source: "/tippgeber", destination: "/partner-program", permanent: true },
    ];
  },
};

export default nextConfig;
