import type { MetadataRoute } from "next";
import { getAllPseoSlugs } from "@/config/pseo-data";
import { getSupabaseAdmin } from "@/lib/supabase";

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

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [];
  for (const locale of LOCALES) {
    for (const route of ROUTES) {
      entries.push({
        url: `${BASE_URL}/${locale}${route.path}`,
        lastModified: new Date(),
        changeFrequency: route.changeFrequency,
        priority: route.priority,
        alternates: {
          languages: Object.fromEntries(
            LOCALES.map((l) => [l, `${BASE_URL}/${l}${route.path}`])
          ),
        },
      });
    }
  }
  // Landing page guide IA
  entries.push({
    url: `${BASE_URL}/fr/guide-ia`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.85,
  });

  // Programmatic SEO pages (solutions)
  for (const slug of getAllPseoSlugs()) {
    entries.push({
      url: `${BASE_URL}/fr/solutions/${slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.75,
    });
  }
  // NOTE : les pages géo (service×secteur×ville) sont volontairement EXCLUES du
  // sitemap et marquées noindex (voir solutions/[slug]/page.tsx) car quasi-dupliquées.
  // Les réintégrer uniquement après enrichissement en contenu local unique.

  // Blog articles (published) — pulled from Supabase, multilingual with hreflang
  try {
    const supabase = getSupabaseAdmin();
    const { data: articles } = await supabase
      .from("blog_articles")
      .select("slug, published_at")
      .eq("published", true);

    for (const article of articles ?? []) {
      entries.push({
        url: `${BASE_URL}/fr/blog/${article.slug}`,
        lastModified: article.published_at
          ? new Date(article.published_at as string)
          : new Date(),
        changeFrequency: "monthly",
        priority: 0.7,
        alternates: {
          languages: Object.fromEntries(
            LOCALES.map((l) => [l, `${BASE_URL}/${l}/blog/${article.slug}`])
          ),
        },
      });
    }
  } catch {
    // If the DB is unreachable at build/request time, skip blog URLs
    // rather than failing the entire sitemap.
  }

  return entries;
}
