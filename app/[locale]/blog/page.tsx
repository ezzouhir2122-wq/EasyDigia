import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Orbs } from "@/components/Orbs";

type Article = {
  slug: string;
  category: string;
  date: string;
  readMin: number;
  title: string;
  excerpt: string;
  tag: string;
};

const CATEGORY_ICONS: Record<string, string> = {
  ai: "🤖",
  automation: "⚙️",
  strategy: "📊",
  tutorial: "🎓",
};

export default function Blog() {
  const t = useTranslations("blog");
  const articles = t.raw("articles") as Article[];

  return (
    <div className="relative overflow-hidden">
      <Orbs />

      {/* Page header */}
      <section className="relative z-[5] mx-auto max-w-[900px] px-[6vw] pb-16 pt-[70px] text-center">
        <div className="mb-4 font-mono text-[12.5px] uppercase tracking-[0.08em] text-brand-bright">
          {t("kicker")}
        </div>
        <h1 className="font-heading text-[clamp(32px,5vw,50px)] font-bold leading-[1.1] tracking-[-0.02em]">
          {t("title")}
        </h1>
        <p className="mx-auto mt-5 max-w-[600px] text-[17px] leading-[1.6] text-muted">
          {t("sub")}
        </p>
      </section>

      {/* Articles grid */}
      <section className="relative z-[5] mx-auto grid max-w-[1100px] grid-cols-1 gap-6 px-[6vw] pb-[100px] pt-4 md:grid-cols-2">
        {articles.map((article, i) => (
          <article
            key={article.slug}
            className={`group flex flex-col overflow-hidden rounded-[18px] border border-white/10 bg-surface transition hover:border-brand/30${i === 0 ? " md:col-span-2" : ""}`}
          >
            {/* Top accent bar */}
            <div className="h-[3px] w-full bg-gradient-to-r from-brand to-brand-bright opacity-60" />

            <div className={`flex flex-1 flex-col p-8${i === 0 ? " md:p-10" : ""}`}>
              {/* Meta row */}
              <div className="mb-4 flex flex-wrap items-center gap-3">
                <span className="flex items-center gap-1.5 rounded-[20px] border border-brand/20 bg-brand/[0.08] px-3 py-[4px] text-[12px] font-medium text-brand-bright">
                  <span>{CATEGORY_ICONS[article.category] ?? "✏️"}</span>
                  {article.tag}
                </span>
                <span className="text-[13px] text-muted/60">{article.date}</span>
                <span className="text-[13px] text-muted/60">·</span>
                <span className="text-[13px] text-muted/60">
                  {article.readMin} {t("minRead")}
                </span>
              </div>

              {/* Title */}
              <h2
                className={`font-heading font-semibold leading-[1.25] tracking-[-0.01em] text-ink transition group-hover:text-brand-bright${i === 0 ? " text-[clamp(22px,3vw,30px)]" : " text-[20px]"}`}
              >
                {article.title}
              </h2>

              {/* Excerpt */}
              <p className="mt-3 flex-1 text-[15px] leading-[1.7] text-muted">
                {article.excerpt}
              </p>

              {/* Read more */}
              <div className="mt-6">
                <Link
                  href={`/blog/${article.slug}`}
                  className="inline-flex items-center gap-2 text-[14px] font-semibold text-brand-bright transition hover:gap-3"
                >
                  {t("readMore")}
                  <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>
          </article>
        ))}
      </section>

      {/* CTA banner */}
      <section className="relative z-[5] mx-auto max-w-[1100px] px-[6vw] pb-[120px] pt-5 text-center">
        <div className="rounded-[24px] border border-brand/20 bg-surface p-12">
          <h2 className="mb-5 font-heading text-[clamp(22px,3.5vw,34px)] font-bold tracking-[-0.01em]">
            {t("ctaTitle")}
          </h2>
          <Link
            href="/contact"
            className="inline-block rounded-[10px] bg-gradient-to-br from-brand to-brand-bright px-[34px] py-4 text-[16px] font-bold text-base shadow-[0_8px_34px_rgba(143,212,0,0.4)] transition hover:opacity-90"
          >
            {t("ctaButton")}
          </Link>
        </div>
      </section>
    </div>
  );
}
