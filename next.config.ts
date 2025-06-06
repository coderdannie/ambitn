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
};

export default nextConfig;
