import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@stack/ui"],
  cacheComponents: true,
  partialPrefetching: true,
  experimental: {
    useTypeScriptCli: false,
  },
};

export default nextConfig;
