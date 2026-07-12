import { useTranslations } from "next-intl";
import { Hero } from "@/components/Hero";
import { ServiceCard } from "@/components/ServiceCard";
import { Link } from "@/i18n/navigation";

export default function Home() {
  const t = useTranslations("home");
  return (
    <>
      <Hero />

      <section className="relative mx-auto max-w-[1200px] px-[6vw] py-16">
        <div className="mb-2 font-mono text-[12.5px] uppercase tracking-[0.08em] text-brand-bright">
          {t("kicker")}
        </div>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="font-heading text-3xl font-bold text-ink">{t("servicesTitle")}</h2>
          <Link
            href="/services"
            className="text-[14.5px] font-medium text-brand-bright transition hover:text-brand"
          >
            {t("ctaSecondary")} →
          </Link>
        </div>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          <ServiceCard icon="⚙️" title={t("s1Title")} description={t("s1Desc")} />
          <ServiceCard icon="🤖" title={t("s2Title")} description={t("s2Desc")} />
          <ServiceCard icon="🔗" title={t("s3Title")} description={t("s3Desc")} />
        </div>
      </section>
    </>
  );
}
