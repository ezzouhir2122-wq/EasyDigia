import { useTranslations } from "next-intl";
import { Container } from "@/components/Container";
import { ContactForm } from "@/components/ContactForm";

export default function Contact() {
  const t = useTranslations("contact");
  return (
    <Container className="py-24">
      <h1 className="font-heading text-4xl font-bold text-ink">{t("title")}</h1>
      <ContactForm />
    </Container>
  );
}
