import { useTranslations } from "next-intl";
import { Container } from "@/components/Container";
import { ContactForm } from "@/components/ContactForm";
import { GuideCTA } from "@/components/GuideCTA";

export default function Contact() {
  const t = useTranslations("contact");
  return (
    <Container className="py-24">
      <div className="flex flex-col gap-12 lg:flex-row lg:gap-16">
        {/* Panel gauche — infos */}
        <div className="flex flex-col gap-6 lg:w-[38%] lg:border-r lg:border-white/10 lg:pr-16">
          <div>
            <h1 className="font-heading text-4xl font-bold text-ink">{t("title")}</h1>
            <p className="mt-3 text-[15px] leading-relaxed text-muted">
              Décrivez votre projet, on vous répond sous 24h.
            </p>
          </div>

          {/* Badges empilés */}
          <div className="flex flex-col gap-3">
            <a
              href="mailto:contact@easydigia.com"
              className="flex items-center gap-3 rounded-[10px] border border-white/10 bg-white/[0.03] px-4 py-3 text-[14px] text-muted transition hover:border-brand/40 hover:text-ink"
            >
              <span className="text-[16px]">✉️</span>
              contact@easydigia.com
            </a>
            <a
              href="tel:+212781995665"
              className="flex items-center gap-3 rounded-[10px] border border-white/10 bg-white/[0.03] px-4 py-3 text-[14px] text-muted transition hover:border-brand/40 hover:text-ink"
            >
              <span className="text-[16px]">📞</span>
              +212 781 995 665
            </a>
            <span className="flex items-center gap-3 rounded-[10px] border border-white/10 bg-white/[0.03] px-4 py-3 text-[14px] text-muted">
              <span className="text-[16px]">📍</span>
              Marrakech, Maroc
            </span>
          </div>

          {/* Bouton appel CTA */}
          <a
            href="tel:+212781995665"
            className="flex items-center justify-center gap-3 rounded-lg bg-gradient-to-br from-brand to-brand-deep px-6 py-4 text-[15px] font-semibold text-white shadow-[0_4px_20px_rgba(143,212,0,0.35)] transition hover:opacity-90"
          >
            <span className="text-[18px]">📞</span>
            Appeler maintenant
          </a>

          <p className="text-[13px] text-muted/60">Disponible Lun–Ven, 9h–18h</p>
        </div>

        {/* Panel droit — formulaire */}
        <div className="lg:flex-1">
          <ContactForm />
        </div>
      </div>

      <GuideCTA />
    </Container>
  );
}
