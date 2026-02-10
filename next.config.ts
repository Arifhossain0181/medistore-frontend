import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'example.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'image2url.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  async rewrites(){
    return [
      {
        source: "/api/:path*",
        destination: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/:path*`
      },
      {
        source: "/auth/:path*",
        destination: `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/:path*`
      }
    ]
  }
};


export default nextConfig;
