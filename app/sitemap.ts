import type { MetadataRoute } from "next";
import { getAllPseoSlugs, getAllPseoGeoSlugs } from "@/config/pseo-data";

const BASE_URL = "https://www.easydigia.com";
const LOCALES = ["fr", "en", "ar"];
const ROUTES = [
  { path: "", priority: 1.0, changeFrequency: "weekly" as const },
  { path: "/services", priority: 0.9, changeFrequency: "monthly" as const },
  { path: "/realisations", priority: 0.9, changeFrequency: "monthly" as const },
  { path: "/about", priority: 0.8, changeFrequency: "monthly" as const },
  { path: "/tarifs", priority: 0.8, changeFrequency: "monthly" as const },
  { path: "/blog", priority: 0.8, changeFrequency: "weekly" as const },
  { path: "/faq", priority: 0.7, changeFrequency: "monthly" as const },
  { path: "/contact", priority: 0.7, changeFrequency: "yearly" as const },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];
  for (const locale of LOCALES) {
    for (const route of ROUTES) {
      entries.push({
        url: `${BASE_URL}/${locale}${route.path}`,
        lastModified: new Date(),
        changeFrequency: route.changeFrequency,
        priority: route.priority,
      });
    }
  }
  // Programmatic SEO pages (solutions)
  for (const slug of getAllPseoSlugs()) {
    entries.push({
      url: `${BASE_URL}/fr/solutions/${slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.75,
    });
  }
  // Pages géo (nouvelles)
  for (const slug of getAllPseoGeoSlugs()) {
    entries.push({
      url: `${BASE_URL}/fr/solutions/${slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.65,
    });
  }

  return entries;
}
