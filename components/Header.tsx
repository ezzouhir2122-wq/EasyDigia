import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { LangSwitcher } from "./LangSwitcher";

export function Header() {
  const t = useTranslations("nav");
  return (
    <header className="relative z-10 mx-auto flex max-w-[1440px] items-center justify-between px-[6vw] py-[26px]">
      <Link href="/" className="flex items-center gap-2.5">
        <span className="flex h-[34px] w-[34px] items-center justify-center rounded-[9px] bg-gradient-to-br from-brand to-brand-bright font-heading text-base font-bold text-[16px] text-base">
          E
        </span>
        <span className="font-heading text-[19px] font-semibold tracking-[-0.01em] text-ink">
          EasyDigia
        </span>
      </Link>
      <nav className="hidden items-center gap-9 md:flex">
        <Link href="/" className="text-[14.5px] font-medium text-muted hover:text-ink">
          {t("home")}
        </Link>
        <Link href="/services" className="text-[14.5px] font-medium text-muted hover:text-ink">
          {t("services")}
        </Link>
        <Link href="/about" className="text-[14.5px] font-medium text-muted hover:text-ink">
          {t("about")}
        </Link>
        <Link href="/contact" className="text-[14.5px] font-medium text-muted hover:text-ink">
          {t("contact")}
        </Link>
      </nav>
      <div className="flex items-center gap-3.5">
        <LangSwitcher />
        <Link
          href="/contact"
          className="hidden rounded-lg bg-gradient-to-br from-brand to-brand-deep px-5 py-2.5 text-[14px] font-semibold text-white shadow-[0_4px_20px_rgba(143,212,0,0.35)] sm:inline-block"
        >
          {t("cta")}
        </Link>
      </div>
    </header>
  );
}
