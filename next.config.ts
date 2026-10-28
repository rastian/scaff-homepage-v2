import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  // The largest screenshots are 2880px wide; cap generated widths at 2048.
  images: {
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
