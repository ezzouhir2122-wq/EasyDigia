import { useTranslations } from "next-intl";
import { Container } from "@/components/Container";

export default function About() {
  const t = useTranslations("about");
  return (
    <Container className="py-24">
      <h1 className="font-heading text-4xl font-bold text-ink">{t("title")}</h1>
      <p className="mt-6 max-w-2xl text-lg text-ink/70">{t("intro")}</p>
      <div className="mt-12 grid gap-8 md:grid-cols-2">
        <div>
          <h2 className="font-heading text-2xl font-semibold text-ink">
            {t("missionTitle")}
          </h2>
          <p className="mt-3 text-ink/70">{t("mission")}</p>
        </div>
        <div>
          <h2 className="font-heading text-2xl font-semibold text-ink">
            {t("approachTitle")}
          </h2>
          <p className="mt-3 text-ink/70">{t("approach")}</p>
        </div>
      </div>
    </Container>
  );
}
