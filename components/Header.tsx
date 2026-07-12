import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Container } from "./Container";
import { LangSwitcher } from "./LangSwitcher";

export function Header() {
  const t = useTranslations("nav");
  return (
    <header className="border-b border-ink/10">
      <Container className="flex items-center justify-between py-4">
        <Link href="/" className="font-heading text-xl font-bold text-ink">
          EasyDigia
        </Link>
        <nav className="hidden gap-6 md:flex">
          <Link href="/">{t("home")}</Link>
          <Link href="/services">{t("services")}</Link>
          <Link href="/about">{t("about")}</Link>
          <Link href="/contact">{t("contact")}</Link>
        </nav>
        <LangSwitcher />
      </Container>
    </header>
  );
}
