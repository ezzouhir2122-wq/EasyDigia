import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export default function Tarifs() {
  const t = useTranslations("tarifs");
  const plans = t.raw("plans") as Array<{
    name: string; price: string; currency: string; period: string;
    desc: string; points: string[]; highlight: boolean;
  }>;
  const faqs = t.raw("faqs") as Array<{ q: string; a: string }>;

  return (
    <main className="min-h-screen bg-[#0A0B10]">
      {/* Hero */}
      <section className="mx-auto max-w-[900px] px-[6vw] pb-10 pt-20 text-center">
        <div className="mb-4 inline-block font-mono text-[12px] uppercase tracking-[0.1em] text-[#8FD400]">
          {t("kicker")}
        </div>
        <h1 className="font-heading text-[clamp(32px,5vw,52px)] font-bold leading-[1.08] tracking-[-0.02em] text-[#F5F6FA]">
          {t("title")}
        </h1>
        <p className="mx-auto mt-5 max-w-[600px] text-[17px] leading-[1.65] text-[#9BA1B0]">
          {t("sub")}
        </p>
      </section>

      {/* Plans */}
      <section className="mx-auto max-w-[1100px] px-[6vw] pb-20">
        <div className="grid gap-6 md:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative flex flex-col rounded-[22px] border p-8 transition ${
                plan.highlight
                  ? "border-[#8FD400]/50 bg-gradient-to-b from-[#8FD400]/[0.07] to-[#12141C] shadow-[0_0_60px_rgba(143,212,0,0.12)]"
                  : "border-white/[0.08] bg-[#12141C]"
              }`}
            >
              {plan.highlight && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="rounded-full bg-gradient-to-r from-[#8FD400] to-[#C6FF00] px-4 py-1 text-[11px] font-bold text-[#0A0B10]">
                    {t("popular")}
                  </span>
                </div>
              )}

              <div className="mb-6">
                <div className="mb-1 text-[13px] font-semibold uppercase tracking-[0.08em] text-[#9BA1B0]">
                  {plan.name}
                </div>
                <div className="flex items-end gap-1.5">
                  {plan.period && (
                    <span className="mb-1 text-[13px] text-[#9BA1B0]">{plan.period}</span>
                  )}
                  <span
                    className={`font-heading text-[36px] font-bold leading-none ${
                      plan.highlight ? "text-[#C6FF00]" : "text-[#F5F6FA]"
                    }`}
                  >
                    {plan.price}
                  </span>
                  {plan.currency && (
                    <span className="mb-1 text-[15px] font-medium text-[#9BA1B0]">
                      {plan.currency}
                    </span>
                  )}
                </div>
                <p className="mt-3 text-[14px] leading-[1.6] text-[#9BA1B0]">{plan.desc}</p>
              </div>

              <ul className="mb-8 flex flex-col gap-2.5">
                {plan.points.map((pt, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-[14px] text-[#F5F6FA]">
                    <span className="mt-0.5 shrink-0 text-[#8FD400]">✓</span>
                    {pt}
                  </li>
                ))}
              </ul>

              <div className="mt-auto">
                <Link
                  href="/contact"
                  className={`flex w-full items-center justify-center rounded-[12px] px-6 py-3.5 text-[14px] font-bold transition ${
                    plan.highlight
                      ? "bg-gradient-to-br from-[#8FD400] to-[#C6FF00] text-[#0A0B10] shadow-[0_4px_20px_rgba(143,212,0,0.35)] hover:opacity-90"
                      : "border border-white/10 text-[#F5F6FA] hover:bg-white/5"
                  }`}
                >
                  {t("cta")}
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Sub CTA */}
        <p className="mt-6 text-center text-[13px] text-[#9BA1B0]/60">{t("ctaSub")}</p>
      </section>

      {/* FAQ */}
      <section className="border-t border-white/[0.06]">
        <div className="mx-auto max-w-[720px] px-[6vw] py-20">
          <h2 className="mb-10 text-center font-heading text-[26px] font-bold text-[#F5F6FA]">
            {t("faqTitle")}
          </h2>
          <div className="flex flex-col gap-5">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="rounded-[16px] border border-white/[0.07] bg-[#12141C] p-6"
              >
                <p className="mb-2 font-semibold text-[#F5F6FA]">{faq.q}</p>
                <p className="text-[14.5px] leading-[1.65] text-[#9BA1B0]">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="pb-24">
        <div className="mx-auto max-w-[600px] px-[6vw] text-center">
          <div className="rounded-[24px] border border-[#8FD400]/20 bg-gradient-to-b from-[#8FD400]/[0.06] to-transparent px-8 py-12">
            <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.1em] text-[#8FD400]">
              {t("kicker")}
            </p>
            <h3 className="mb-4 font-heading text-[24px] font-bold text-[#F5F6FA]">
              {t("title")}
            </h3>
            <p className="mb-7 text-[15px] text-[#9BA1B0]">{t("ctaSub")}</p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-[12px] bg-gradient-to-br from-[#8FD400] to-[#C6FF00] px-8 py-3.5 text-[15px] font-bold text-[#0A0B10] shadow-[0_4px_24px_rgba(143,212,0,0.4)] transition hover:opacity-90"
            >
              {t("cta")} →
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
