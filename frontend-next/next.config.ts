import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        pathname: '/**',
      },
    ],
  },
  async rewrites() {
    return [
      // 重写/@vite/client请求到空响应
      {
        source: '/@vite/client',
        destination: '/_next/static/chunks/main.js',
      },
    ];
  },
};

export default nextConfig;
