import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { LangSwitcher } from "./LangSwitcher";
import { Logo } from "./Logo";

export function Header() {
  const t = useTranslations("nav");
  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-base/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1440px] items-center gap-6 px-[6vw] py-4">
        <Link href="/" className="flex shrink-0 items-center gap-2.5" aria-label="EasyDigia — accueil">
          <Logo className="h-11" />
          <span className="font-heading text-[20px] font-bold tracking-[-0.02em] text-ink">
            EasyDigia
          </span>
        </Link>

        <nav className="mx-auto hidden items-center gap-8 lg:flex">
          <Link href="/" className="text-[14.5px] font-medium text-muted transition hover:text-ink">
            {t("home")}
          </Link>
          <Link
            href="/services"
            className="text-[14.5px] font-medium text-muted transition hover:text-ink"
          >
            {t("services")}
          </Link>
          <Link
            href="/about"
            className="text-[14.5px] font-medium text-muted transition hover:text-ink"
          >
            {t("about")}
          </Link>
          <Link
            href="/blog"
            className="text-[14.5px] font-medium text-muted transition hover:text-ink"
          >
            {t("blog")}
          </Link>
          <Link
            href="/tarifs"
            className="text-[14.5px] font-medium text-muted transition hover:text-ink"
          >
            {t("tarifs")}
          </Link>
          <Link
            href="/contact"
            className="text-[14.5px] font-medium text-muted transition hover:text-ink"
          >
            {t("contact")}
          </Link>
        </nav>

        <div className="ms-auto flex shrink-0 items-center gap-4 lg:ms-0">
          <LangSwitcher />
          <Link
            href="/contact"
            className="hidden rounded-lg bg-gradient-to-br from-brand to-brand-deep px-5 py-2.5 text-[14px] font-semibold text-white shadow-[0_4px_20px_rgba(143,212,0,0.35)] transition hover:opacity-90 sm:inline-block"
          >
            {t("cta")}
          </Link>
        </div>
      </div>
    </header>
  );
}
