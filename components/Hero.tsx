import { useTranslations } from "next-intl";
import { Button } from "./Button";
import { Link } from "@/i18n/navigation";
import { Orbs } from "./Orbs";

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

        {/* Right: animated visual */}
        <HeroVisual />
      </div>
    </section>
  );
}

function HeroVisual() {
  const bars = [
    { w: "82%", d: "0s" },
    { w: "64%", d: "0.4s" },
    { w: "73%", d: "0.8s" },
    { w: "50%", d: "1.2s" },
  ];
  const chips = ["🌐 Web", "💬 Chatbot", "⚙️ Automation", "🤖 Agent IA", "🎓 Formation"];
  return (
    <div className="animate-float relative mx-auto w-full max-w-[440px]">
      {/* glow behind card */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 animate-glow rounded-[28px] blur-2xl"
        style={{ background: "radial-gradient(circle, rgba(143,212,0,0.28), transparent 70%)" }}
      />
      <div className="rounded-[22px] border border-white/10 bg-surface/90 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.45)]">
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-brand" />
            <span className="font-mono text-[11px] uppercase tracking-[0.06em] text-muted">
              agent · live
            </span>
          </div>
          <span className="font-mono text-[11px] text-muted/60">EasyDigia</span>
        </div>

        {/* animated activity bars */}
        <div className="space-y-3">
          {bars.map((b, i) => (
            <div key={i} className="h-2.5 w-full overflow-hidden rounded-full bg-white/[0.06]">
              <div
                className="animate-shimmer h-full rounded-full bg-gradient-to-r from-brand to-brand-bright"
                style={{ width: b.w, animationDelay: b.d }}
              />
            </div>
          ))}
        </div>

        {/* chips */}
        <div className="mt-6 flex flex-wrap gap-2">
          {chips.map((c) => (
            <span
              key={c}
              className="rounded-full border border-brand/20 bg-brand/[0.08] px-3 py-1.5 text-[12.5px] text-brand-bright"
            >
              {c}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
