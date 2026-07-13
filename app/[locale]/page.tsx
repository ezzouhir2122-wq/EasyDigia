import { useTranslations } from "next-intl";
import { Hero } from "@/components/Hero";
import { ServiceCard } from "@/components/ServiceCard";
import { Link } from "@/i18n/navigation";

export default function Home() {
  const t = useTranslations("home");
  const testimonials = t.raw("testimonials") as Array<{
    quote: string; name: string; role: string; company: string; stat: string;
  }>;

  return (
    <>
      <Hero />

      {/* Services */}
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

      {/* Testimonials */}
      <section className="border-t border-white/[0.06] bg-[#0D0F17]">
        <div className="mx-auto max-w-[1200px] px-[6vw] py-20">
          <div className="mb-2 font-mono text-[12px] uppercase tracking-[0.1em] text-[#8FD400]">
            {t("testimonialsKicker")}
          </div>
          <h2 className="mb-12 font-heading text-[28px] font-bold text-[#F5F6FA]">
            {t("testimonialsTitle")}
          </h2>

          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((item, i) => (
              <div
                key={i}
                className="flex flex-col rounded-[20px] border border-white/[0.07] bg-[#12141C] p-7"
              >
                {/* Stat badge */}
                <div className="mb-5 self-start rounded-full border border-[#8FD400]/30 bg-[#8FD400]/[0.08] px-3.5 py-1.5 font-mono text-[12px] font-semibold text-[#C6FF00]">
                  {item.stat}
                </div>

                {/* Quote */}
                <p className="mb-6 flex-1 text-[15px] leading-[1.7] text-[#F5F6FA]/90">
                  &ldquo;{item.quote}&rdquo;
                </p>

                {/* Author */}
                <div className="flex items-center gap-3 border-t border-white/[0.06] pt-5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#8FD400]/30 to-[#8FD400]/10 font-bold text-[#8FD400]">
                    {item.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-[13.5px] font-semibold text-[#F5F6FA]">{item.name}</p>
                    <p className="text-[12px] text-[#9BA1B0]">{item.role} · {item.company}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Link to pricing */}
          <div className="mt-10 text-center">
            <Link
              href="/tarifs"
              className="inline-flex items-center gap-2 rounded-[10px] border border-[#8FD400]/30 px-6 py-3 text-[14px] font-semibold text-[#8FD400] transition hover:bg-[#8FD400]/10"
            >
              Voir nos tarifs →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
