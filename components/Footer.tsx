import { Container } from "./Container";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-ink/10 py-8 text-sm text-ink/60">
      <Container>© {new Date().getFullYear()} EasyDigia — www.EasyDigia.com</Container>
    </footer>
  );
}
