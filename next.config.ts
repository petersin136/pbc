import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // hostname 명시적 설정으로 시스템 오류 방지
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  // 이미지 최적화
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'czbffjnslwauemngpayh.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: 'img.youtube.com',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
