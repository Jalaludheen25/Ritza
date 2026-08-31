import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [70, 75, 82, 86, 88],
    deviceSizes: [420, 640, 828, 1080, 1280, 1600, 1920, 2560],
  },
};

export default nextConfig;
