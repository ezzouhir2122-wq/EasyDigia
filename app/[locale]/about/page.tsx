import { useTranslations } from "next-intl";
import { Orbs } from "@/components/Orbs";

export default function About() {
  const t = useTranslations("about");
  return (
    <div className="relative overflow-hidden">
      <Orbs />
      <section className="relative z-[5] mx-auto max-w-[900px] px-[6vw] pb-10 pt-[70px] text-center">
        <div className="mb-4 font-mono text-[12.5px] uppercase tracking-[0.08em] text-brand-bright">
          {t("kicker")}
        </div>
        <h1 className="font-heading text-[clamp(32px,5vw,50px)] font-bold leading-[1.1] tracking-[-0.02em]">
          {t("title")}
        </h1>
        <p className="mx-auto mt-5 max-w-[620px] text-[17px] leading-[1.6] text-muted">
          {t("intro")}
        </p>
      </section>

      <section className="relative z-[5] mx-auto grid max-w-[1000px] gap-6 px-[6vw] pb-24 md:grid-cols-2">
        <div className="rounded-[18px] border border-white/10 bg-surface p-9">
          <div className="mb-4 flex h-[52px] w-[52px] items-center justify-center rounded-[13px] bg-brand/10 text-2xl">
            🎯
          </div>
          <h2 className="font-heading text-2xl font-semibold text-ink">{t("missionTitle")}</h2>
          <p className="mt-3 text-[15px] leading-[1.7] text-muted">{t("mission")}</p>
        </div>
        <div className="rounded-[18px] border border-white/10 bg-surface p-9">
          <div className="mb-4 flex h-[52px] w-[52px] items-center justify-center rounded-[13px] bg-brand/10 text-2xl">
            🧭
          </div>
          <h2 className="font-heading text-2xl font-semibold text-ink">{t("approachTitle")}</h2>
          <p className="mt-3 text-[15px] leading-[1.7] text-muted">{t("approach")}</p>
        </div>
      </section>
    </div>
  );
}
