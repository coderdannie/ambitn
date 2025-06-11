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
};

export default nextConfig;
