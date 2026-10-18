import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Fully static site: `next build` emits ./out, deployable anywhere.
  output: "export",
  trailingSlash: true,
  turbopack: {
    root: __dirname,
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
