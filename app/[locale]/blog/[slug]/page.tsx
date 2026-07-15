import { getTranslations, getLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Orbs } from "@/components/Orbs";
import { getSupabaseAdmin } from "@/lib/supabase";
import { notFound } from "next/navigation";
import { ReadingProgress } from "@/components/ReadingProgress";
import { ShareButtons } from "@/components/ShareButtons";
import { TableOfContents } from "@/components/TableOfContents";
import Image from "next/image";

export const dynamic = "force-dynamic";

const CATEGORY_ICONS: Record<string, string> = {
  ai: "🤖",
  automation: "⚙️",
  strategy: "📊",
  tutorial: "🎓",
};

function formatDate(iso: string, locale: string) {
  return new Date(iso).toLocaleDateString(
    locale === "ar" ? "ar-MA" : locale === "en" ? "en-GB" : "fr-FR",
    { day: "numeric", month: "long", year: "numeric" }
  );
}

type ArticleRow = {
  id: string;
  slug: string;
  category: string;
  read_min: number;
  published_at: string;
  image_url?: string;
  content: Record<string, { title: string; excerpt: string; tag: string; body: string }>;
};

export default async function BlogArticle({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [t, locale] = await Promise.all([
    getTranslations("blog"),
    getLocale(),
  ]);

  const supabase = getSupabaseAdmin();

  const [{ data: article }, { data: relatedRaw }] = await Promise.all([
    supabase
      .from("blog_articles")
      .select("*")
      .eq("slug", slug)
      .eq("published", true)
      .single(),
    supabase
      .from("blog_articles")
      .select("id, slug, category, read_min, published_at, content")
      .eq("published", true)
      .neq("slug", slug)
      .order("published_at", { ascending: false })
      .limit(6),
  ]);

  if (!article) notFound();

  const loc =
    (article.content as Record<string, { title: string; excerpt: string; tag: string; body: string }>)[locale] ??
    article.content["fr"];

  if (!loc) notFound();

  // Prefer same category, fill up to 3 with others
  const allRelated = (relatedRaw ?? []) as ArticleRow[];
  const sameCategory = allRelated.filter((a) => a.category === article.category);
  const others = allRelated.filter((a) => a.category !== article.category);
  const related = [...sameCategory, ...others].slice(0, 3);

  return (
    <div className="relative overflow-hidden">
      <ReadingProgress />
      <Orbs />

      {/* Article header */}
      <section className="relative z-[5] mx-auto max-w-[780px] px-[6vw] pb-10 pt-[70px]">
        <Link
          href="/blog"
          className="mb-8 inline-flex items-center gap-2 text-[13.5px] text-muted transition hover:text-ink"
        >
          <span aria-hidden="true">←</span>
          {t("kicker")}
        </Link>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <span className="flex items-center gap-1.5 rounded-[20px] border border-brand/20 bg-brand/[0.08] px-3 py-[4px] text-[12px] font-medium text-brand-bright">
            <span>{CATEGORY_ICONS[article.category as string] ?? "✏️"}</span>
            {loc.tag}
          </span>
          <span className="text-[13px] text-muted/60">
            {formatDate(article.published_at as string, locale)}
          </span>
          <span className="text-[13px] text-muted/60">·</span>
          <span className="text-[13px] text-muted/60">
            {article.read_min} {t("minRead")}
          </span>
        </div>

        <h1 className="mt-5 font-heading text-[clamp(28px,4.5vw,44px)] font-bold leading-[1.15] tracking-[-0.02em] text-ink">
          {loc.title}
        </h1>

        <p className="mt-4 text-[18px] leading-[1.65] text-muted">{loc.excerpt}</p>

        <div className="mt-8 h-px bg-gradient-to-r from-brand/40 via-brand-bright/20 to-transparent" />
      </section>

      {/* Cover image */}
      {article.image_url && (
        <section className="relative z-[5] mx-auto max-w-[780px] px-[6vw] pb-8">
          <div className="relative h-[320px] w-full overflow-hidden rounded-[16px] md:h-[420px]">
            <Image
              src={article.image_url as string}
              alt={loc.title}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 780px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0B10]/60 to-transparent" />
          </div>
        </section>
      )}

      {/* Article body with sticky TOC */}
      <section className="relative z-[5] mx-auto max-w-[1200px] px-[6vw] pb-4">
        <div className="flex gap-12">
          <div className="min-w-0 flex-1">
            <div
              id="article-body"
              className="prose-blog"
              dangerouslySetInnerHTML={{ __html: loc.body }}
            />
            <ShareButtons title={loc.title} />
          </div>
          <aside className="hidden xl:block w-[220px] shrink-0">
            <TableOfContents />
          </aside>
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-[5] mx-auto max-w-[780px] px-[6vw] pt-10 pb-16">
        <div className="rounded-[20px] border border-brand/20 bg-surface p-10 text-center">
          <h2 className="mb-4 font-heading text-[clamp(20px,3vw,28px)] font-bold tracking-[-0.01em]">
            {t("ctaTitle")}
          </h2>
          <Link
            href="/contact"
            className="inline-block rounded-[10px] bg-gradient-to-br from-brand to-brand-bright px-8 py-3.5 text-[15px] font-bold text-base shadow-[0_8px_34px_rgba(143,212,0,0.4)] transition hover:opacity-90"
          >
            {t("ctaButton")}
          </Link>
        </div>
      </section>

      {/* Related articles */}
      {related.length > 0 && (
        <section className="relative z-[5] border-t border-white/[0.06] bg-[#0D0F17]">
          <div className="mx-auto max-w-[1100px] px-[6vw] py-16">
            <div className="mb-8 flex items-center gap-3">
              <div className="h-px flex-1 bg-white/[0.06]" />
              <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-[#9BA1B0]/60">
                Articles similaires
              </span>
              <div className="h-px flex-1 bg-white/[0.06]" />
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              {related.map((a) => {
                const content =
                  (a.content as ArticleRow["content"])[locale] ?? a.content["fr"];
                if (!content) return null;
                return (
                  <Link
                    key={a.id}
                    href={`/blog/${a.slug}`}
                    className="group flex flex-col overflow-hidden rounded-[18px] border border-white/[0.07] bg-[#12141C] p-6 transition hover:border-[#8FD400]/30"
                  >
                    <div className="mb-3 flex items-center gap-2">
                      <span className="text-[16px]">
                        {CATEGORY_ICONS[a.category] ?? "✏️"}
                      </span>
                      <span className="rounded-full border border-[#8FD400]/20 bg-[#8FD400]/[0.06] px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.06em] text-[#C6FF00]">
                        {content.tag}
                      </span>
                    </div>
                    <h3 className="mb-2 flex-1 font-heading text-[15px] font-bold leading-[1.3] text-[#F5F6FA] transition group-hover:text-[#C6FF00]">
                      {content.title}
                    </h3>
                    <p className="mb-4 line-clamp-2 text-[13px] leading-[1.6] text-[#9BA1B0]">
                      {content.excerpt}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-[12px] text-[#9BA1B0]/60">
                        {a.read_min} {t("minRead")}
                      </span>
                      <span className="text-[13px] font-semibold text-[#8FD400] transition group-hover:translate-x-1">
                        Lire →
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
