import { useTranslations } from "next-intl";
import { Container } from "@/components/Container";
import { ServiceCard } from "@/components/ServiceCard";
import { Button } from "@/components/Button";

export default function Services() {
  const t = useTranslations("services");
  return (
    <Container className="py-24">
      <h1 className="font-heading text-4xl font-bold text-ink">{t("title")}</h1>
      <p className="mt-6 max-w-2xl text-lg text-ink/70">{t("intro")}</p>
      <div className="mt-12 grid gap-6 md:grid-cols-2">
        <ServiceCard title={t("s1Title")} description={t("s1Desc")} />
        <ServiceCard title={t("s2Title")} description={t("s2Desc")} />
        <ServiceCard title={t("s3Title")} description={t("s3Desc")} />
        <ServiceCard title={t("s4Title")} description={t("s4Desc")} />
      </div>
      <div className="mt-12">
        <Button href="/contact">{t("cta")}</Button>
      </div>
    </Container>
  );
}
