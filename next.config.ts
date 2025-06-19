import nextPWA from "next-pwa";
import runtimeCache from "next-pwa/cache";
import { i18n } from "./next-i18next.config";

const withPWA = nextPWA({
  dest: "public",
  disable: process.env.NODE_ENV !== "production",
  runtimeCaching: runtimeCache,
});

const nextConfig = {
  i18n,
  images: {
    domains: ["admin.silsilaeiftekhari.in"],
    minimumCacheTTL: 2678400, // ✅ 31 days
    formats: ["image/webp"], // ✅ limits transformation formats
    deviceSizes: [640, 768, 828],
    imageSizes: [300, 600],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "admin.silsilaeiftekhari.in",
      },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default withPWA(nextConfig);
