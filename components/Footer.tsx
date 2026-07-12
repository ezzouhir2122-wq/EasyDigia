import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Logo } from "./Logo";

export function Footer() {
  const nav = useTranslations("nav");
  const t = useTranslations("footer");
  return (
    <footer className="relative z-[5] border-t border-white/[0.07] px-[6vw] pb-[34px] pt-14">
      <div className="mx-auto mb-10 flex max-w-[1200px] flex-wrap justify-between gap-10">
        <div className="max-w-[280px]">
          <div className="mb-3.5 flex items-center gap-2.5">
            <Logo className="h-12" />
            <span className="font-heading text-[18px] font-bold tracking-[-0.02em] text-ink">
              EasyDigia
            </span>
          </div>
          <p className="text-[13.5px] leading-[1.6] text-muted">{t("tagline")}</p>
        </div>
        <div className="flex flex-wrap gap-[60px]">
          <div>
            <div className="mb-4 font-mono text-[11.5px] uppercase tracking-[0.06em] text-muted/70">
              {t("navLabel")}
            </div>
            <div className="flex flex-col gap-2.5">
              <Link href="/" className="text-[14px] text-muted hover:text-ink">
                {nav("home")}
              </Link>
              <Link href="/services" className="text-[14px] text-muted hover:text-ink">
                {nav("services")}
              </Link>
              <Link href="/about" className="text-[14px] text-muted hover:text-ink">
                {nav("about")}
              </Link>
              <Link href="/contact" className="text-[14px] text-muted hover:text-ink">
                {nav("contact")}
              </Link>
            </div>
          </div>
          <div>
            <div className="mb-4 font-mono text-[11.5px] uppercase tracking-[0.06em] text-muted/70">
              {t("contactLabel")}
            </div>
            <div className="flex flex-col gap-2.5">
              <a
                href="mailto:Contact@EasyDigia.com"
                className="text-[14px] text-muted hover:text-ink"
              >
                Contact@EasyDigia.com
              </a>
              <span className="text-[14px] text-muted">+212 781 995 665</span>
              <span className="text-[14px] text-muted">{t("city")}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="mx-auto flex max-w-[1200px] flex-wrap justify-between gap-3 border-t border-white/[0.06] pt-[26px]">
        <span className="text-[12.5px] text-muted/70">{t("copy")}</span>
        <span className="text-[12.5px] text-muted/70">{t("made")}</span>
      </div>
    </footer>
  );
}
