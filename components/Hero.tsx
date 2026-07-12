import { useTranslations } from "next-intl";
import { Container } from "./Container";
import { Button } from "./Button";

export function Hero() {
  const t = useTranslations("home");
  return (
    <section className="py-24">
      <Container>
        <h1 className="font-heading text-5xl font-bold text-ink">{t("title")}</h1>
        <p className="mt-6 max-w-2xl text-xl text-ink/70">{t("subtitle")}</p>
        <div className="mt-8">
          <Button href="/contact">{t("cta")}</Button>
        </div>
      </Container>
    </section>
  );
}
