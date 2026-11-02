import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    agentFeedback: true,
  },
  // Fonts and artwork read from disk when rendering shared profile cards.
  outputFileTracingIncludes: {
    "/p/[slug]/opengraph-image": ["./lib/og/**"],
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
