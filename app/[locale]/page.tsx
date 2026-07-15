import { useTranslations } from "next-intl";
import { Hero } from "@/components/Hero";
import { ServiceCard } from "@/components/ServiceCard";
import { Link } from "@/i18n/navigation";
import { AnimatedCounter } from "@/components/AnimatedCounter";

export default function Home() {
  const t = useTranslations("home");
  const sectors = t.raw("clientsSectors") as string[];
  const testimonials = t.raw("testimonials") as Array<{
    quote: string; name: string; role: string; company: string; stat: string;
  }>;
  const processSteps = t.raw("processSteps") as Array<{
    num: string; icon: string; title: string; desc: string;
  }>;

  return (
    <>
      <Hero />

      {/* Clients strip */}
      <section className="border-y border-white/[0.05] bg-[#0D0F17]/60 py-6">
        <div className="mx-auto max-w-[1200px] px-[6vw]">
          <p className="mb-5 text-center font-mono text-[11px] uppercase tracking-[0.1em] text-[#9BA1B0]/60">
            {t("clientsKicker")}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {sectors.map((sector) => (
              <span
                key={sector}
                className="rounded-[8px] border border-white/[0.07] bg-white/[0.03] px-4 py-2 text-[13px] font-medium text-[#9BA1B0]"
              >
                {sector}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Stats animées */}
      <section className="border-b border-white/[0.05] bg-[#0D0F17]/80">
        <div className="mx-auto grid max-w-[1100px] grid-cols-2 gap-px px-[6vw] md:grid-cols-4">
          {[
            { to: 50, suffix: "+", label: "Projets livrés" },
            { to: 3, suffix: "h", label: "Économisées / semaine" },
            { to: 100, suffix: "%", label: "Clients satisfaits" },
            { to: 24, suffix: "h", label: "Délai de réponse" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col items-center justify-center gap-1 py-10 text-center"
            >
              <span className="font-heading text-[clamp(36px,5vw,52px)] font-bold leading-none text-[#C6FF00]">
                <AnimatedCounter to={stat.to} suffix={stat.suffix} />
              </span>
              <span className="text-[12px] uppercase tracking-[0.08em] text-[#9BA1B0]/70">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </section>

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

      {/* Process steps */}
      <section className="mx-auto max-w-[1100px] px-[6vw] py-20">
        <div className="mb-2 font-mono text-[12px] uppercase tracking-[0.1em] text-[#8FD400]">
          {t("processKicker")}
        </div>
        <h2 className="mb-12 font-heading text-[28px] font-bold text-[#F5F6FA]">
          {t("processTitle")}
        </h2>
        <div className="relative grid gap-6 md:grid-cols-4">
          {/* Connector line */}
          <div className="absolute left-0 right-0 top-[28px] hidden h-px bg-gradient-to-r from-transparent via-[#8FD400]/20 to-transparent md:block" />
          {processSteps.map((step, i) => (
            <div key={step.num} className="relative flex flex-col gap-4 rounded-[18px] border border-white/[0.07] bg-[#12141C] p-6">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#8FD400]/10 text-xl">
                  {step.icon}
                </span>
                <span className="font-mono text-[11px] font-bold text-[#8FD400]/50">{step.num}</span>
              </div>
              <h3 className="font-heading text-[16px] font-bold text-[#F5F6FA]">{step.title}</h3>
              <p className="text-[13px] leading-[1.7] text-[#9BA1B0]">{step.desc}</p>
              {i < processSteps.length - 1 && (
                <span className="absolute -right-3 top-7 hidden text-[#8FD400]/30 md:block">→</span>
              )}
            </div>
          ))}
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
            {testimonials.map((item, i) => {
              const AVATAR_COLORS = [
                "from-[#8FD400]/40 to-[#8FD400]/10 text-[#8FD400]",
                "from-[#00C2FF]/40 to-[#00C2FF]/10 text-[#00C2FF]",
                "from-[#A855F7]/40 to-[#A855F7]/10 text-[#A855F7]",
              ];
              const initials = item.name
                .split(" ")
                .map((w: string) => w[0])
                .join("")
                .slice(0, 2)
                .toUpperCase();
              const colorClass = AVATAR_COLORS[i % AVATAR_COLORS.length];

              return (
                <div
                  key={i}
                  className="flex flex-col rounded-[20px] border border-white/[0.07] bg-[#12141C] p-7"
                >
                  {/* Stars */}
                  <div className="mb-3 flex gap-0.5 text-[#F5A623]">
                    {"★★★★★".split("").map((s, j) => <span key={j}>{s}</span>)}
                  </div>

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
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-[13px] font-bold ${colorClass}`}>
                      {initials}
                    </div>
                    <div>
                      <p className="text-[13.5px] font-semibold text-[#F5F6FA]">{item.name}</p>
                      <p className="text-[12px] text-[#9BA1B0]">{item.role} · {item.company}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Links */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/realisations"
              className="inline-flex items-center gap-2 rounded-[10px] bg-gradient-to-br from-[#8FD400] to-[#C6FF00] px-6 py-3 text-[14px] font-bold text-[#0A0B10] shadow-[0_4px_20px_rgba(143,212,0,0.3)] transition hover:opacity-90"
            >
              Voir nos réalisations →
            </Link>
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
