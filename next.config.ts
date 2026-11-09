import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.resolve(process.cwd()),
  outputFileTracingIncludes: { "/api/chat": ["./knowledge/aziz.md", "./knowledge/aziz.vectors.json"] },
  images: { unoptimized: true },
};

export default nextConfig;
