import { useTranslations } from "next-intl";
import { Hero } from "@/components/Hero";
import { Container } from "@/components/Container";
import { ServiceCard } from "@/components/ServiceCard";

export default function Home() {
  const t = useTranslations("home");
  return (
    <>
      <Hero />
      <Container className="py-12">
        <h2 className="font-heading text-3xl font-bold text-ink">{t("servicesTitle")}</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          <ServiceCard title={t("s1Title")} description={t("s1Desc")} />
          <ServiceCard title={t("s2Title")} description={t("s2Desc")} />
          <ServiceCard title={t("s3Title")} description={t("s3Desc")} />
        </div>
      </Container>
    </>
  );
}
