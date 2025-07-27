import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // This will ignore ESLint errors during builds (Vercel won't fail)
    ignoreDuringBuilds: true,
  },
  /* other config options here */
};

export default nextConfig;
