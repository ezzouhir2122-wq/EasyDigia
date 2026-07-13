import { getTranslations, getLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Orbs } from "@/components/Orbs";
import { getSupabaseAdmin } from "@/lib/supabase";
import { notFound } from "next/navigation";

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
  const { data: article } = await supabase
    .from("blog_articles")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .single();

  if (!article) notFound();

  const loc =
    (article.content as Record<string, { title: string; excerpt: string; tag: string; body: string }>)[locale] ??
    article.content["fr"];

  if (!loc) notFound();

  return (
    <div className="relative overflow-hidden">
      <Orbs />

      {/* Article header */}
      <section className="relative z-[5] mx-auto max-w-[780px] px-[6vw] pb-10 pt-[70px]">
        {/* Back link */}
        <Link
          href="/blog"
          className="mb-8 inline-flex items-center gap-2 text-[13.5px] text-muted transition hover:text-ink"
        >
          <span aria-hidden="true">←</span>
          {t("kicker")}
        </Link>

        {/* Meta */}
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

        {/* Title */}
        <h1 className="mt-5 font-heading text-[clamp(28px,4.5vw,44px)] font-bold leading-[1.15] tracking-[-0.02em] text-ink">
          {loc.title}
        </h1>

        {/* Excerpt */}
        <p className="mt-4 text-[18px] leading-[1.65] text-muted">{loc.excerpt}</p>

        {/* Divider */}
        <div className="mt-8 h-px bg-gradient-to-r from-brand/40 via-brand-bright/20 to-transparent" />
      </section>

      {/* Article body */}
      <section className="relative z-[5] mx-auto max-w-[780px] px-[6vw] pb-[80px]">
        <div
          className="prose-blog"
          dangerouslySetInnerHTML={{ __html: loc.body }}
        />
      </section>

      {/* CTA */}
      <section className="relative z-[5] mx-auto max-w-[780px] px-[6vw] pb-[120px]">
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
    </div>
  );
}
