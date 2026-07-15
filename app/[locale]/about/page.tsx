import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { Orbs } from "@/components/Orbs";

export const metadata: Metadata = {
  title: "À propos d'EasyDigia — Notre histoire & nos valeurs",
  description: "EasyDigia est né à Marrakech pour rendre l'automatisation et l'IA accessibles aux PME marocaines. 50+ projets livrés, 3+ ans d'expérience.",
  openGraph: {
    title: "À propos d'EasyDigia — Notre histoire & nos valeurs",
    description: "50+ projets livrés, 3+ ans d'expérience en automatisation et IA pour les entreprises marocaines.",
    images: [{ url: "https://easydigia.com/og-image.png", width: 1200, height: 630 }],
  },
};

type Stat = { value: string; label: string };
type Value = { icon: string; title: string; desc: string };

export default function About() {
  const t = useTranslations("about");
  const stats = t.raw("stats") as Stat[];
  const values = t.raw("values") as Value[];

  return (
    <div className="relative overflow-hidden bg-[#0A0B10]">
      <Orbs />

      {/* Hero */}
      <section className="relative z-[5] mx-auto grid max-w-[1100px] items-center gap-12 px-[6vw] pb-12 pt-[70px] lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <div className="mb-4 font-mono text-[12.5px] uppercase tracking-[0.08em] text-[#8FD400]">
            {t("kicker")}
          </div>
          <h1 className="font-heading text-[clamp(32px,5vw,50px)] font-bold leading-[1.1] tracking-[-0.02em] text-[#F5F6FA]">
            {t("title")}
          </h1>
          <p className="mt-5 max-w-[580px] text-[17px] leading-[1.65] text-[#9BA1B0]">
            {t("intro")}
          </p>
        </div>
        <div className="relative hidden lg:block">
          <div className="absolute -inset-6 rounded-3xl bg-[#8FD400]/10 blur-3xl" />
          <Image
            src="/about-illustration.png"
            alt="EasyDigia — croissance et optimisation par l'IA"
            width={580}
            height={430}
            className="relative z-10 w-full rounded-2xl border border-white/10 shadow-[0_24px_80px_rgba(143,212,0,0.18)]"
          />
        </div>
      </section>

      {/* Stats */}
      <section className="relative z-[5] border-y border-white/[0.06] bg-[#0D0F17]">
        <div className="mx-auto max-w-[1000px] px-[6vw] py-12">
          <p className="mb-8 text-center font-mono text-[11px] uppercase tracking-[0.1em] text-[#9BA1B0]/60">
            {t("statsLabel")}
          </p>
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <p className="font-heading text-[clamp(32px,5vw,44px)] font-bold leading-none text-[#C6FF00]">
                  {s.value}
                </p>
                <p className="mt-2 text-[13px] text-[#9BA1B0]">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission + Approach */}
      <section className="relative z-[5] mx-auto grid max-w-[1000px] gap-6 px-[6vw] py-16 md:grid-cols-2">
        <div className="rounded-[18px] border border-white/[0.08] bg-[#12141C] p-9">
          <div className="mb-4 flex h-[52px] w-[52px] items-center justify-center rounded-[13px] bg-[#8FD400]/10 text-2xl">
            🎯
          </div>
          <h2 className="font-heading text-2xl font-semibold text-[#F5F6FA]">{t("missionTitle")}</h2>
          <p className="mt-3 text-[15px] leading-[1.7] text-[#9BA1B0]">{t("mission")}</p>
        </div>
        <div className="rounded-[18px] border border-white/[0.08] bg-[#12141C] p-9">
          <div className="mb-4 flex h-[52px] w-[52px] items-center justify-center rounded-[13px] bg-[#8FD400]/10 text-2xl">
            🧭
          </div>
          <h2 className="font-heading text-2xl font-semibold text-[#F5F6FA]">{t("approachTitle")}</h2>
          <p className="mt-3 text-[15px] leading-[1.7] text-[#9BA1B0]">{t("approach")}</p>
        </div>
      </section>

      {/* Story */}
      <section className="relative z-[5] border-t border-white/[0.06] bg-[#0D0F17]">
        <div className="mx-auto max-w-[760px] px-[6vw] py-16 text-center">
          <div className="mb-3 font-mono text-[12px] uppercase tracking-[0.1em] text-[#8FD400]">
            {t("storyTitle")}
          </div>
          <p className="text-[17px] leading-[1.8] text-[#9BA1B0]">{t("story")}</p>
        </div>
      </section>

      {/* Values */}
      <section className="relative z-[5] mx-auto max-w-[1000px] px-[6vw] py-16">
        <div className="mb-2 font-mono text-[12px] uppercase tracking-[0.1em] text-[#8FD400]">
          {t("valuesTitle")}
        </div>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {values.map((v) => (
            <div
              key={v.title}
              className="rounded-[18px] border border-white/[0.07] bg-[#12141C] p-7"
            >
              <div className="mb-4 flex h-[48px] w-[48px] items-center justify-center rounded-[12px] bg-[#8FD400]/10 text-[22px]">
                {v.icon}
              </div>
              <h3 className="mb-2 font-heading text-[17px] font-bold text-[#F5F6FA]">{v.title}</h3>
              <p className="text-[14px] leading-[1.7] text-[#9BA1B0]">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-[5] pb-24">
        <div className="mx-auto max-w-[620px] px-[6vw] text-center">
          <div className="rounded-[24px] border border-[#8FD400]/20 bg-gradient-to-b from-[#8FD400]/[0.06] to-transparent px-8 py-12">
            <h3 className="mb-4 font-heading text-[22px] font-bold text-[#F5F6FA]">
              Travaillons ensemble
            </h3>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-[12px] bg-gradient-to-br from-[#8FD400] to-[#C6FF00] px-8 py-3.5 text-[15px] font-bold text-[#0A0B10] shadow-[0_4px_24px_rgba(143,212,0,0.4)] transition hover:opacity-90"
            >
              Discuter de mon projet →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
