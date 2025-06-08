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
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ["admin.silsilaeiftekhari.in"], // ✅ Add your external image host
  },
};

export default withPWA(nextConfig);
