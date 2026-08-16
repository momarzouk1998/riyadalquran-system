import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  allowedDevOrigins: ['127.0.0.1'],
  images: {
    remotePatterns: [
      {
        // Cloudflare Images CDN
        protocol: "https",
        hostname: "imagedelivery.net",
        pathname: "/**",
      },
      {
        // Cloudflare R2 / custom domain fallback
        protocol: "https",
        hostname: "*.cloudflareimages.com",
        pathname: "/**",
      },
      {
        // Emirates Charity Association
        protocol: "https",
        hostname: "emch.ae",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
