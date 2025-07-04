import { DefaultSeo as NextDefaultSeo } from "next-seo";
import { siteSettings } from "@settings/site-settings";

export const DefaultSeo = () => {
  return (
    <NextDefaultSeo
      title={siteSettings.name}
      description={siteSettings.description}
      openGraph={{
        type: "website",
        locale: "en_IE",
        site_name: siteSettings.name,
        url: "https://www.silsilaeiftekhari.in", // Optional but good for SEO
        images: [
          {
            url: "https://www.silsilaeiftekhari.in/assets/images/logo.png", // ✅ Default logo for sharing
            width: 1200,
            height: 630,
            alt: "Iftekhari Silsila - Sufi Books, Music, Videos, Poetry & Articles",
            type: "image/png",
          },
          {
            url: "https://www.silsilaeiftekhari.in/assets/images/og-default.jpg", // ✅ Fallback Open Graph image
            width: 1200,
            height: 630,
            alt: "Iftekhari Silsila",
            type: "image/jpeg",
          },
        ],
      }}
      twitter={{
        handle: "@handle",
        site: "@site",
        cardType: "summary_large_image",
      }}
      additionalMetaTags={[
        {
          name: "viewport",
          content: "width=device-width, initial-scale=1 maximum-scale=1",
        },
        {
          name: "apple-mobile-web-app-capable",
          content: "yes",
        },
        {
          name: "theme-color",
          content: "#ffffff",
        },
      ]}
      additionalLinkTags={[
        {
          rel: "apple-touch-icon",
          href: "icons/apple-icon-180.png",
        },
        {
          rel: "manifest",
          href: "/manifest.json",
        },
      ]}
    />
  );
};
