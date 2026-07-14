import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { FAQAccordion } from "@/components/FAQAccordion";
import { Orbs } from "@/components/Orbs";

export const metadata: Metadata = {
  title: "FAQ — Automatisation, IA & Digital | EasyDigia",
  description: "Réponses à vos questions sur l'automatisation, les agents IA, les délais, les paiements au Maroc et le processus de collaboration avec EasyDigia.",
  openGraph: {
    title: "FAQ — Automatisation, IA & Digital | EasyDigia",
    description: "Toutes les réponses sur nos services d'automatisation et d'IA pour entreprises marocaines.",
    images: [{ url: "https://easydigia.com/og-image.png", width: 1200, height: 630 }],
  },
};

type Question = { q: string; a: string };
type Category = { label: string; questions: Question[] };

export default function FAQ() {
  const t = useTranslations("faq");
  const categories = t.raw("categories") as Category[];

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: categories.flatMap((cat) =>
      cat.questions.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: { "@type": "Answer", text: item.a },
      }))
    ),
  };

  return (
    <div className="relative overflow-hidden bg-[#0A0B10]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <Orbs />
      {/* Hero */}
      <section className="relative z-[5] mx-auto max-w-[860px] px-[6vw] pb-12 pt-20 text-center">
        <div className="mb-4 font-mono text-[12px] uppercase tracking-[0.1em] text-[#8FD400]">
          {t("kicker")}
        </div>
        <h1 className="font-heading text-[clamp(32px,5vw,52px)] font-bold leading-[1.08] tracking-[-0.02em] text-[#F5F6FA]">
          {t("title")}
        </h1>
        <p className="mx-auto mt-5 max-w-[580px] text-[17px] leading-[1.65] text-[#9BA1B0]">
          {t("sub")}
        </p>
      </section>

      {/* Accordion */}
      <section className="relative z-[5] mx-auto max-w-[820px] px-[6vw] pb-20">
        <FAQAccordion categories={categories} />
      </section>

      {/* CTA */}
      <section className="relative z-[5] pb-24">
        <div className="mx-auto max-w-[620px] px-[6vw] text-center">
          <div className="rounded-[24px] border border-[#8FD400]/20 bg-gradient-to-b from-[#8FD400]/[0.06] to-transparent px-8 py-12">
            <h2 className="mb-4 font-heading text-[22px] font-bold text-[#F5F6FA]">
              {t("ctaTitle")}
            </h2>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-[12px] bg-gradient-to-br from-[#8FD400] to-[#C6FF00] px-8 py-3.5 text-[15px] font-bold text-[#0A0B10] shadow-[0_4px_24px_rgba(143,212,0,0.4)] transition hover:opacity-90"
            >
              {t("ctaButton")} →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
