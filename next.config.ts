// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // No detiene el build si hay errores de ESLint
    ignoreDuringBuilds: true,
  },
  typescript: {
    // No detiene el build si hay errores de TypeScript
    ignoreBuildErrors: true,
  },
};

export default nextConfig;