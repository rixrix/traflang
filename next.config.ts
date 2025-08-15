import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // TrafLang IDE configuration
  experimental: {
    turbo: {
      // Enable Turbopack for faster development builds
    },
  },
  // Optimize for Monaco Editor and transpiler performance
  webpack: (config) => {
    // Optimize for web workers (transpiler-worker.js)
    config.output.globalObject = 'self';
    return config;
  },
};

export default nextConfig;
