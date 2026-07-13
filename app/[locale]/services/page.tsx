import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Orbs } from "@/components/Orbs";

type ServiceItem = {
  icon: string;
  tag: string;
  title: string;
  desc: string;
  points: string[];
};

const SERVICE_IMAGES: Record<string, string> = {
  WEB: "/service-web.svg",
  CHATBOT: "/service-ai-agents.png",
  AUTOMATION: "/service-automation.png",
  "AGENT IA": "/service-ai-agents-2.svg",
  ASSISTANT: "/service-assistant.svg",
  DASHBOARD: "/service-dashboard.svg",
  APP: "/service-app.svg",
  API: "/service-integrations.png",
  FORMATION: "/service-training.png",
};

export default function Services() {
  const t = useTranslations("services");
  const items = t.raw("items") as ServiceItem[];

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
        <p className="mx-auto mt-5 max-w-[620px] text-[17px] leading-[1.6] text-muted">
          {t("sub")}
        </p>
      </section>

      {/* Services list */}
      <section className="relative z-[5] mx-auto flex max-w-[1100px] flex-col gap-5 px-[6vw] pb-[100px] pt-5">
        {items.map((svc) => {
          const img = SERVICE_IMAGES[svc.tag];
          return (
            <div
              key={svc.tag + svc.title}
              className="flex overflow-hidden rounded-[18px] border border-white/10 bg-surface transition hover:border-brand/30"
            >
              {/* Main content */}
              <div className="flex flex-1 items-start gap-6 p-9 max-sm:flex-col">
                <div className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-[13px] bg-brand/10 text-2xl">
                  {svc.icon}
                </div>
                <div>
                  <div className="mb-2.5 flex flex-wrap items-baseline gap-3">
                    <h3 className="font-heading text-[21px] font-semibold text-ink">
                      {svc.title}
                    </h3>
                    <span className="font-mono text-[11.5px] text-muted/70">{svc.tag}</span>
                  </div>
                  <p className="mb-4 max-w-[680px] text-[15px] leading-[1.7] text-muted">
                    {svc.desc}
                  </p>
                  <div className="flex flex-wrap gap-2.5">
                    {svc.points.map((pt) => (
                      <span
                        key={pt}
                        className="rounded-[20px] border border-brand/20 bg-brand/[0.08] px-3 py-[5px] text-[13px] text-brand-bright"
                      >
                        {pt}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Service image */}
              {img && (
                <div className="relative hidden w-[220px] shrink-0 md:block">
                  <img
                    src={img}
                    alt={svc.title}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-surface via-surface/40 to-transparent" />
                </div>
              )}
            </div>
          );
        })}
      </section>

      {/* CTA banner */}
      <section className="relative z-[5] mx-auto max-w-[1100px] px-[6vw] pb-[120px] pt-5 text-center">
        <h2 className="mb-5 font-heading text-[clamp(26px,4vw,38px)] font-bold tracking-[-0.01em]">
          {t("ctaTitle")}
        </h2>
        <Link
          href="/contact"
          className="inline-block rounded-[10px] bg-gradient-to-br from-brand to-brand-bright px-[34px] py-4 text-[16px] font-bold text-base shadow-[0_8px_34px_rgba(143,212,0,0.4)]"
        >
          {t("ctaButton")}
        </Link>
      </section>
    </div>
  );
}
