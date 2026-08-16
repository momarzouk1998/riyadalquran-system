import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
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
    ],
  },
};

export default nextConfig;
