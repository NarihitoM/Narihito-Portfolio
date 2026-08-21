import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "narihito-server.vercel.app",
      },
    ],
  },
};

export default nextConfig;
