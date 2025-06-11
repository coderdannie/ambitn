import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ['https://res.cloudinary.com'],
    unoptimized: true,
  },
  // pathname: '/src/assets/**',

  // Fix for Vercel build error with client reference manifest
  experimental: {
    // Disable problematic features that cause manifest issues
    ppr: false,
    dynamicIO: false,
  },

  // Ensure proper client component handling
  transpilePackages: [],

  // Fix for client reference manifest issues
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };
    }
    return config;
  },
};

export default nextConfig;
