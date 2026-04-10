import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // standalone only for local production server; Vercel manages its own output
  output: process.env.VERCEL ? undefined : "standalone",
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    workerThreads: true,
    staticGenerationMaxConcurrency: 1,
    staticGenerationMinPagesPerWorker: 1000,
    staticGenerationRetryCount: 1,
  },
};

export default nextConfig;
