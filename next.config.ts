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
    domains: ["admin.silsilaeiftekhari.in", "www.silsilaeiftekhari.in", "silsilaeiftekhari.in"],
    minimumCacheTTL: 2678400, // ✅ 31 days
    formats: ["image/webp"], // ✅ Modern format support
    deviceSizes: [640, 768, 828, 1200], // ✅ Added 1200 for Open Graph
    imageSizes: [300, 600, 1200], // ✅ Added 1200 for Open Graph
    remotePatterns: [
      {
        protocol: "https",
        hostname: "admin.silsilaeiftekhari.in",
      },
      {
        protocol: "https",
        hostname: "www.silsilaeiftekhari.in",
      },
      {
        protocol: "https",
        hostname: "silsilaeiftekhari.in",
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
