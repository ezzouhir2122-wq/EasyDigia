import { useTranslations } from "next-intl";
import { Container } from "@/components/Container";
import { ContactForm } from "@/components/ContactForm";

export default function Contact() {
  const t = useTranslations("contact");
  return (
    <Container className="py-24">
      <h1 className="font-heading text-4xl font-bold text-ink">{t("title")}</h1>

      {/* Infos de contact */}
      <div className="mt-6 flex flex-wrap gap-4">
        <a
          href="mailto:contact@easydigia.com"
          className="flex items-center gap-2.5 rounded-[10px] border border-white/10 bg-white/[0.03] px-4 py-3 text-[14px] text-muted transition hover:border-brand/40 hover:text-ink"
        >
          <span className="text-[16px]">✉️</span>
          contact@easydigia.com
        </a>
        <a
          href="tel:+212781995665"
          className="flex items-center gap-2.5 rounded-[10px] border border-white/10 bg-white/[0.03] px-4 py-3 text-[14px] text-muted transition hover:border-brand/40 hover:text-ink"
        >
          <span className="text-[16px]">📞</span>
          +212 781 995 665
        </a>
        <span className="flex items-center gap-2.5 rounded-[10px] border border-white/10 bg-white/[0.03] px-4 py-3 text-[14px] text-muted">
          <span className="text-[16px]">📍</span>
          Marrakech, Maroc
        </span>
      </div>

      <ContactForm />
    </Container>
  );
}
