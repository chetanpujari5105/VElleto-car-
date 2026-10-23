import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  trailingSlash: true,
  // The parent folder holds another project with its own lockfile.
  turbopack: { root: process.cwd() },
};

export default nextConfig;
