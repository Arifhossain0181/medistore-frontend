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
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

    return [
      {
        source: "/payment/:path*",
        destination: "/Payment/:path*"
      },
      {
        source: "/api/:path*",
        destination: `${backendUrl}/api/:path*`
      },
      {
        source: "/auth/:path*",
        destination: `${backendUrl}/api/:path*`
      }
    ]
  }
};


export default nextConfig;
