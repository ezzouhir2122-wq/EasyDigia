import { useTranslations } from "next-intl";
import { Button } from "./Button";
import { Link } from "@/i18n/navigation";
import { Orbs } from "./Orbs";
import { HeroArt } from "./HeroArt";

export function Hero() {
  const t = useTranslations("home");
  return (
    <section className="relative overflow-hidden">
      <Orbs />
      <div className="relative z-[5] mx-auto grid max-w-[1200px] items-center gap-12 px-[6vw] py-20 md:py-28 lg:grid-cols-[1.05fr_0.95fr]">
        {/* Left: copy */}
        <div>
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-brand/25 bg-brand/[0.08] px-3.5 py-1.5 font-mono text-[12px] uppercase tracking-[0.08em] text-brand-bright">
            <span className="h-1.5 w-1.5 animate-glow rounded-full bg-brand-bright" />
            {t("kicker")}
          </div>
          <h1 className="font-heading text-[clamp(34px,5.5vw,56px)] font-bold leading-[1.05] tracking-[-0.02em]">
            {t("title")}
          </h1>
          <p className="mt-6 max-w-xl text-[18px] leading-[1.6] text-muted">{t("subtitle")}</p>
          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Button href="/contact">{t("cta")}</Button>
            <Link
              href="/services"
              className="inline-flex items-center gap-1.5 rounded-lg border border-white/12 px-5 py-3 font-semibold text-ink transition hover:bg-white/5"
            >
              {t("ctaSecondary")} <span aria-hidden>→</span>
            </Link>
          </div>
        </div>

        {/* Right: custom animated illustration */}
        <HeroArt />
      </div>
    </section>
  );
}
