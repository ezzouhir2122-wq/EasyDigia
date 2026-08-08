import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const LOCALE_FREE_ROUTES = [
  "services",
  "realisations",
  "about",
  "tarifs",
  "blog",
  "faq",
  "contact",
  "temoignages",
  "guide-ia",
];

const nextConfig: NextConfig = {
  eslint: { ignoreDuringBuilds: true },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "plus.unsplash.com" },
      { protocol: "https", hostname: "images.pexels.com" },
      { protocol: "https", hostname: "cdn.pixabay.com" },
    ],
  },
  async redirects() {
    return [
      // /solutions/:slug → /fr/solutions/:slug
      {
        source: "/solutions/:slug*",
        destination: "/fr/solutions/:slug*",
        permanent: true,
      },
      // /blog/:slug → /fr/blog/:slug
      {
        source: "/blog/:slug*",
        destination: "/fr/blog/:slug*",
        permanent: true,
      },
      // Top-level pages without locale
      ...LOCALE_FREE_ROUTES.map((route) => ({
        source: `/${route}`,
        destination: `/fr/${route}`,
        permanent: true,
      })),
    ];
  },
};

export default withNextIntl(nextConfig);
