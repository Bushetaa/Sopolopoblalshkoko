import type { NextConfig } from "next";
import path from "path";
import { fileURLToPath } from "url";

const rootDir = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  reactStrictMode: true,
  typedRoutes: false,
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
  async rewrites() {
    return [
      {
        source: '/api/v1/:path*',
        destination: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/:path*`
      },
      {
        source: '/auth/:path*',
        destination: `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/:path*`
      }
    ];
  },
  turbopack: {
    root: rootDir,
  },
  output: "standalone",
};

export default nextConfig;
