import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // GitHub Pages (junginsu-make.github.io) static export
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  // user repo (<username>.github.io) — root path. basePath 불필요.
};

export default nextConfig;
