# Site EasyDigia — Plan d'implémentation

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Construire le site vitrine trilingue (FR/EN/AR) d'EasyDigia en Next.js, avec 4 pages et un formulaire de contact relié à Supabase.

**Architecture:** Next.js 15 App Router avec routing localisé (`app/[locale]/`) via next-intl. Tous les textes dans `messages/{fr,en,ar}.json`. Le formulaire de contact envoie un POST à une route API serveur qui insère dans la table Supabase `leads`. Tailwind pour le style, mode sombre par défaut, `dir=rtl` appliqué pour l'arabe.

**Tech Stack:** Next.js 15, TypeScript, Tailwind CSS, next-intl, Supabase (@supabase/supabase-js), Vitest + Testing Library, déploiement Vercel.

## Global Constraints

- Node ≥ 18.18, Next.js 15 (App Router), TypeScript strict.
- Aucun texte en dur dans les composants : tout passe par `useTranslations` / `messages/*.json`.
- Locales supportées : `fr` (défaut), `en`, `ar`. `ar` ⇒ `dir="rtl"`, sinon `ltr`.
- Domaine cible : www.EasyDigia.com. Hébergement Vercel.
- Aucune vraie clé secrète commitée. Secrets uniquement dans `.env.local` (ignoré) ; `.env.example` documente les noms.
- Charte par défaut : fond `#0B1120`, accent `#4F46E5`, accent 2 `#22D3EE`, texte `#E2E8F0`, titres `Space Grotesk`, corps `Inter`.
- Commits fréquents, un par tâche minimum.

---

### Task 1: Initialiser le projet Next.js + Tailwind + outillage de test

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.ts`, `postcss.config.mjs`, `tailwind.config.ts`, `app/globals.css`, `vitest.config.ts`, `test/setup.ts`, `test/smoke.test.ts`
- Modify: `.gitignore`

**Interfaces:**
- Consumes: rien.
- Produces: projet Next.js buildable ; commandes `npm run dev`, `npm run build`, `npm test` fonctionnelles.

- [ ] **Step 1: Scaffold Next.js**

```bash
cd "c:/A__MON PC/3_PROJETS DIGITAUX/15_SITEWEB_ESAYDIGIA"
npx create-next-app@latest . --ts --tailwind --app --eslint --no-src-dir --import-alias "@/*" --use-npm --no-turbopack
```
Répondre « No » si on propose d'écraser des fichiers existants (`docs/`, `.git`). Si le dossier n'est pas vide bloque la commande, scaffolder dans un sous-dossier temporaire puis déplacer les fichiers générés à la racine.

- [ ] **Step 2: Installer les dépendances de test**

```bash
npm install -D vitest @vitejs/plugin-react @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
```

- [ ] **Step 3: Configurer Vitest**

`vitest.config.ts` :
```ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  test: { environment: "jsdom", setupFiles: ["./test/setup.ts"], globals: true },
  resolve: { alias: { "@": path.resolve(__dirname, ".") } },
});
```

`test/setup.ts` :
```ts
import "@testing-library/jest-dom/vitest";
```

Ajouter à `package.json` scripts : `"test": "vitest run"`, `"test:watch": "vitest"`.

- [ ] **Step 4: Écrire un test smoke**

`test/smoke.test.ts` :
```ts
import { describe, it, expect } from "vitest";

describe("smoke", () => {
  it("runs", () => {
    expect(1 + 1).toBe(2);
  });
});
```

- [ ] **Step 5: Lancer le test**

Run: `npm test`
Expected: PASS (1 test).

- [ ] **Step 6: Build de vérification**

Run: `npm run build`
Expected: build réussi, aucune erreur TypeScript.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "chore: init Next.js + Tailwind + Vitest"
```

---

### Task 2: Internationalisation next-intl (routing FR/EN/AR + layout localisé)

**Files:**
- Create: `i18n/routing.ts`, `i18n/request.ts`, `middleware.ts`, `app/[locale]/layout.tsx`, `app/[locale]/page.tsx`, `messages/fr.json`, `messages/en.json`, `messages/ar.json`, `test/i18n.test.tsx`
- Modify: `next.config.ts`
- Delete: `app/page.tsx`, `app/layout.tsx` (remplacés par la version `[locale]`)

**Interfaces:**
- Consumes: projet de Task 1.
- Produces: `routing` (locales `["fr","en","ar"]`, défaut `fr`) ; helper `getMessages()` ; layout qui pose `lang` et `dir`. Les pages suivantes vivent sous `app/[locale]/`.

- [ ] **Step 1: Installer next-intl**

```bash
npm install next-intl
```

- [ ] **Step 2: Écrire le test de routing/dir**

`test/i18n.test.tsx` :
```tsx
import { describe, it, expect } from "vitest";
import { routing } from "@/i18n/routing";

describe("routing", () => {
  it("supports fr, en, ar with fr default", () => {
    expect(routing.locales).toEqual(["fr", "en", "ar"]);
    expect(routing.defaultLocale).toBe("fr");
  });
});
```

- [ ] **Step 3: Run test (échec attendu)**

Run: `npx vitest run test/i18n.test.tsx`
Expected: FAIL — module `@/i18n/routing` introuvable.

- [ ] **Step 4: Créer la config next-intl**

`i18n/routing.ts` :
```ts
import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["fr", "en", "ar"],
  defaultLocale: "fr",
});
```

`i18n/request.ts` :
```ts
import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;
  if (!locale || !routing.locales.includes(locale as never)) {
    locale = routing.defaultLocale;
  }
  return { locale, messages: (await import(`../messages/${locale}.json`)).default };
});
```

`middleware.ts` :
```ts
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = { matcher: ["/", "/(fr|en|ar)/:path*"] };
```

`next.config.ts` :
```ts
import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");
const nextConfig: NextConfig = {};
export default withNextIntl(nextConfig);
```

- [ ] **Step 5: Créer le layout localisé et supprimer les fichiers root**

Supprimer `app/page.tsx` et `app/layout.tsx`.

`app/[locale]/layout.tsx` :
```tsx
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import "../globals.css";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as never)) notFound();
  setRequestLocale(locale);
  const messages = await getMessages();
  const dir = locale === "ar" ? "rtl" : "ltr";
  return (
    <html lang={locale} dir={dir}>
      <body>
        <NextIntlClientProvider messages={messages}>{children}</NextIntlClientProvider>
      </body>
    </html>
  );
}
```

- [ ] **Step 6: Créer les fichiers de messages (base) et la home minimale**

`messages/fr.json` :
```json
{ "home": { "title": "Automatisez. Accélérez. Grandissez." } }
```
`messages/en.json` :
```json
{ "home": { "title": "Automate. Accelerate. Grow." } }
```
`messages/ar.json` :
```json
{ "home": { "title": "أتمتة. تسريع. نمو." } }
```

`app/[locale]/page.tsx` :
```tsx
import { useTranslations } from "next-intl";

export default function Home() {
  const t = useTranslations("home");
  return <h1>{t("title")}</h1>;
}
```

- [ ] **Step 7: Run tests + build**

Run: `npx vitest run test/i18n.test.tsx && npm run build`
Expected: test PASS ; build génère les routes `/fr`, `/en`, `/ar`.

- [ ] **Step 8: Vérification manuelle RTL**

Run: `npm run dev`, ouvrir `/ar` et confirmer `dir="rtl"` sur `<html>` (DevTools), `/fr` et `/en` en `ltr`.

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "feat: i18n FR/EN/AR avec next-intl et layout RTL"
```

---

### Task 3: Charte visuelle (tokens Tailwind + polices) et primitives UI

**Files:**
- Modify: `tailwind.config.ts`, `app/globals.css`, `app/[locale]/layout.tsx`
- Create: `components/Container.tsx`, `components/Button.tsx`, `test/button.test.tsx`

**Interfaces:**
- Consumes: layout de Task 2.
- Produces: classes de thème (`bg-base`, `text-ink`, couleurs `brand`/`accent`) ; `<Container>` (wrapper largeur max) ; `<Button href? variant?>` réutilisable par toutes les pages.

- [ ] **Step 1: Écrire le test du Button**

`test/button.test.tsx` :
```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Button } from "@/components/Button";

describe("Button", () => {
  it("renders a link when href is provided", () => {
    render(<Button href="/contact">Contact</Button>);
    const el = screen.getByRole("link", { name: "Contact" });
    expect(el).toHaveAttribute("href", "/contact");
  });
  it("renders a button element otherwise", () => {
    render(<Button>Envoyer</Button>);
    expect(screen.getByRole("button", { name: "Envoyer" })).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test (échec attendu)**

Run: `npx vitest run test/button.test.tsx`
Expected: FAIL — `@/components/Button` introuvable.

- [ ] **Step 3: Config Tailwind (tokens) + polices**

`tailwind.config.ts` (fusionner avec l'existant) :
```ts
import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        base: "#0B1120",
        ink: "#E2E8F0",
        brand: { DEFAULT: "#4F46E5" },
        accent: { DEFAULT: "#22D3EE" },
      },
      fontFamily: {
        heading: ["var(--font-space-grotesk)", "sans-serif"],
        body: ["var(--font-inter)", "sans-serif"],
      },
    },
  },
  plugins: [],
} satisfies Config;
```

Dans `app/[locale]/layout.tsx`, charger les polices via `next/font/google` :
```tsx
import { Inter, Space_Grotesk } from "next/font/google";
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-space-grotesk" });
```
Appliquer `className={`${inter.variable} ${spaceGrotesk.variable}`}` sur `<html>` et `className="bg-base text-ink font-body"` sur `<body>`.

`app/globals.css` : garder les directives `@tailwind base; @tailwind components; @tailwind utilities;` et retirer les couleurs par défaut générées par create-next-app qui entrent en conflit.

- [ ] **Step 4: Créer Container et Button**

`components/Container.tsx` :
```tsx
export function Container({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-6xl px-6 ${className}`}>{children}</div>;
}
```

`components/Button.tsx` :
```tsx
import Link from "next/link";

type Props = {
  children: React.ReactNode;
  href?: string;
  variant?: "primary" | "ghost";
  type?: "button" | "submit";
};

export function Button({ children, href, variant = "primary", type = "button" }: Props) {
  const base = "inline-flex items-center justify-center rounded-lg px-5 py-3 font-medium transition";
  const styles =
    variant === "primary"
      ? "bg-brand text-white hover:opacity-90"
      : "border border-ink/20 text-ink hover:bg-ink/10";
  const cls = `${base} ${styles}`;
  if (href) return <Link href={href} className={cls}>{children}</Link>;
  return <button type={type} className={cls}>{children}</button>;
}
```

- [ ] **Step 5: Run test + build**

Run: `npx vitest run test/button.test.tsx && npm run build`
Expected: tests PASS, build OK.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: charte visuelle Tailwind + Button/Container"
```

---

### Task 4: Header, Footer et sélecteur de langue

**Files:**
- Create: `components/Header.tsx`, `components/Footer.tsx`, `components/LangSwitcher.tsx`, `i18n/navigation.ts`, `test/langswitcher.test.tsx`
- Modify: `app/[locale]/layout.tsx`, `messages/fr.json`, `messages/en.json`, `messages/ar.json`

**Interfaces:**
- Consumes: `routing` (Task 2), `Container`/`Button` (Task 3).
- Produces: `<Header>` (nav vers Accueil/Services/À propos/Contact + LangSwitcher), `<Footer>`, helpers de navigation localisée (`Link`, `usePathname`, `useRouter`) exportés depuis `i18n/navigation.ts`.

- [ ] **Step 1: Créer les helpers de navigation localisée**

`i18n/navigation.ts` :
```ts
import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing);
```

- [ ] **Step 2: Ajouter les clés de nav aux messages**

Dans chaque `messages/*.json`, ajouter un objet `nav`. FR :
```json
"nav": { "home": "Accueil", "services": "Services", "about": "À propos", "contact": "Contact", "cta": "Discutons de votre projet" }
```
EN :
```json
"nav": { "home": "Home", "services": "Services", "about": "About", "contact": "Contact", "cta": "Let's talk" }
```
AR :
```json
"nav": { "home": "الرئيسية", "services": "الخدمات", "about": "من نحن", "contact": "اتصل بنا", "cta": "لنتحدث عن مشروعك" }
```

- [ ] **Step 3: Écrire le test du LangSwitcher**

`test/langswitcher.test.tsx` :
```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { LangSwitcher } from "@/components/LangSwitcher";

describe("LangSwitcher", () => {
  it("shows the three locales", () => {
    render(
      <NextIntlClientProvider locale="fr" messages={{}}>
        <LangSwitcher />
      </NextIntlClientProvider>
    );
    expect(screen.getByText("FR")).toBeInTheDocument();
    expect(screen.getByText("EN")).toBeInTheDocument();
    expect(screen.getByText("ع")).toBeInTheDocument();
  });
});
```

- [ ] **Step 4: Run test (échec attendu)**

Run: `npx vitest run test/langswitcher.test.tsx`
Expected: FAIL — composant introuvable.

- [ ] **Step 5: Créer LangSwitcher**

`components/LangSwitcher.tsx` :
```tsx
"use client";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";

const LOCALES = [
  { code: "fr", label: "FR" },
  { code: "en", label: "EN" },
  { code: "ar", label: "ع" },
] as const;

export function LangSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  return (
    <div className="flex gap-2 text-sm">
      {LOCALES.map((l) => (
        <button
          key={l.code}
          onClick={() => router.replace(pathname, { locale: l.code })}
          className={l.code === locale ? "font-bold text-accent" : "text-ink/70 hover:text-ink"}
          aria-current={l.code === locale ? "true" : undefined}
        >
          {l.label}
        </button>
      ))}
    </div>
  );
}
```

- [ ] **Step 6: Créer Header et Footer**

`components/Header.tsx` :
```tsx
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Container } from "./Container";
import { LangSwitcher } from "./LangSwitcher";

export function Header() {
  const t = useTranslations("nav");
  return (
    <header className="border-b border-ink/10">
      <Container className="flex items-center justify-between py-4">
        <Link href="/" className="font-heading text-xl font-bold text-ink">EasyDigia</Link>
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
```

`components/Footer.tsx` :
```tsx
import { Container } from "./Container";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-ink/10 py-8 text-sm text-ink/60">
      <Container>© {new Date().getFullYear()} EasyDigia — www.EasyDigia.com</Container>
    </footer>
  );
}
```

- [ ] **Step 7: Monter Header/Footer dans le layout**

Dans `app/[locale]/layout.tsx`, entourer `{children}` :
```tsx
<Header />
<main>{children}</main>
<Footer />
```
(importer `Header` et `Footer`).

- [ ] **Step 8: Run tests + build**

Run: `npx vitest run && npm run build`
Expected: tous les tests PASS, build OK sur les 3 locales.

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "feat: Header, Footer et sélecteur de langue"
```

---

### Task 5: Page Accueil

**Files:**
- Create: `components/Hero.tsx`, `components/ServiceCard.tsx`, `test/servicecard.test.tsx`
- Modify: `app/[locale]/page.tsx`, `messages/fr.json`, `messages/en.json`, `messages/ar.json`

**Interfaces:**
- Consumes: `Container`, `Button` (Task 3), i18n.
- Produces: `<Hero>` et `<ServiceCard title description>` réutilisables (ServiceCard servira aussi à la page Services).

- [ ] **Step 1: Ajouter les clés `home` aux messages**

FR (remplacer/étendre l'objet `home`) :
```json
"home": {
  "title": "Automatisez. Accélérez. Grandissez.",
  "subtitle": "EasyDigia conçoit des automatisations et des agents IA sur mesure pour votre entreprise.",
  "cta": "Discutons de votre projet",
  "servicesTitle": "Ce que nous faisons",
  "s1Title": "Automatisation des processus",
  "s1Desc": "Éliminez les tâches répétitives avec des workflows automatisés.",
  "s2Title": "Agents IA",
  "s2Desc": "Des assistants intelligents intégrés à vos outils.",
  "s3Title": "Intégrations sur mesure",
  "s3Desc": "Connectez vos applications et vos données sans friction."
}
```
Fournir les équivalents EN et AR avec les mêmes clés (traductions naturelles).

- [ ] **Step 2: Écrire le test ServiceCard**

`test/servicecard.test.tsx` :
```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ServiceCard } from "@/components/ServiceCard";

describe("ServiceCard", () => {
  it("renders title and description", () => {
    render(<ServiceCard title="Agents IA" description="Assistants intelligents." />);
    expect(screen.getByRole("heading", { name: "Agents IA" })).toBeInTheDocument();
    expect(screen.getByText("Assistants intelligents.")).toBeInTheDocument();
  });
});
```

- [ ] **Step 3: Run test (échec attendu)**

Run: `npx vitest run test/servicecard.test.tsx`
Expected: FAIL — composant introuvable.

- [ ] **Step 4: Créer Hero et ServiceCard**

`components/ServiceCard.tsx` :
```tsx
export function ServiceCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-xl border border-ink/10 bg-white/5 p-6">
      <h3 className="font-heading text-lg font-semibold text-ink">{title}</h3>
      <p className="mt-2 text-ink/70">{description}</p>
    </div>
  );
}
```

`components/Hero.tsx` :
```tsx
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
        <div className="mt-8"><Button href="/contact">{t("cta")}</Button></div>
      </Container>
    </section>
  );
}
```

- [ ] **Step 5: Composer la page Accueil**

`app/[locale]/page.tsx` :
```tsx
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
```

- [ ] **Step 6: Run tests + build**

Run: `npx vitest run && npm run build`
Expected: PASS, build OK.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: page Accueil (Hero + services)"
```

---

### Task 6: Page À propos

**Files:**
- Create: `app/[locale]/about/page.tsx`
- Modify: `messages/fr.json`, `messages/en.json`, `messages/ar.json`

**Interfaces:**
- Consumes: `Container` (Task 3), i18n.
- Produces: route `/[locale]/about`.

- [ ] **Step 1: Ajouter les clés `about` aux messages**

FR :
```json
"about": {
  "title": "À propos d'EasyDigia",
  "intro": "Nous aidons les entreprises à gagner du temps grâce à l'automatisation et à l'IA.",
  "missionTitle": "Notre mission",
  "mission": "Rendre l'automatisation intelligente accessible à toutes les entreprises.",
  "approachTitle": "Notre approche",
  "approach": "Comprendre vos processus, identifier les gains rapides, livrer des solutions mesurables."
}
```
Fournir EN et AR avec les mêmes clés.

- [ ] **Step 2: Créer la page**

`app/[locale]/about/page.tsx` :
```tsx
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
          <h2 className="font-heading text-2xl font-semibold text-ink">{t("missionTitle")}</h2>
          <p className="mt-3 text-ink/70">{t("mission")}</p>
        </div>
        <div>
          <h2 className="font-heading text-2xl font-semibold text-ink">{t("approachTitle")}</h2>
          <p className="mt-3 text-ink/70">{t("approach")}</p>
        </div>
      </div>
    </Container>
  );
}
```

- [ ] **Step 3: Build**

Run: `npm run build`
Expected: route `/fr/about`, `/en/about`, `/ar/about` générées.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: page À propos"
```

---

### Task 7: Supabase — client, table `leads` et route API

**Files:**
- Create: `lib/supabase.ts`, `lib/leadSchema.ts`, `app/api/lead/route.ts`, `supabase/migrations/0001_leads.sql`, `.env.example`, `test/leadSchema.test.ts`

**Interfaces:**
- Consumes: rien du front (indépendant).
- Produces: `leadSchema` (validation Zod) + type `LeadInput` ; `getSupabaseAdmin()` ; endpoint `POST /api/lead` acceptant `{ name, email, company?, service?, message, locale }` et renvoyant `{ ok: true }` (200) ou `{ ok: false, error }` (400/500).

- [ ] **Step 1: Installer les dépendances**

```bash
npm install @supabase/supabase-js zod
```

- [ ] **Step 2: Écrire le test de validation**

`test/leadSchema.test.ts` :
```ts
import { describe, it, expect } from "vitest";
import { leadSchema } from "@/lib/leadSchema";

describe("leadSchema", () => {
  it("accepts a valid lead", () => {
    const r = leadSchema.safeParse({
      name: "Ali", email: "ali@test.com", message: "Bonjour", locale: "fr",
    });
    expect(r.success).toBe(true);
  });
  it("rejects an invalid email", () => {
    const r = leadSchema.safeParse({
      name: "Ali", email: "not-an-email", message: "Bonjour", locale: "fr",
    });
    expect(r.success).toBe(false);
  });
  it("rejects an empty message", () => {
    const r = leadSchema.safeParse({
      name: "Ali", email: "ali@test.com", message: "", locale: "fr",
    });
    expect(r.success).toBe(false);
  });
});
```

- [ ] **Step 3: Run test (échec attendu)**

Run: `npx vitest run test/leadSchema.test.ts`
Expected: FAIL — `@/lib/leadSchema` introuvable.

- [ ] **Step 4: Créer le schéma et le client**

`lib/leadSchema.ts` :
```ts
import { z } from "zod";

export const leadSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  company: z.string().optional(),
  service: z.string().optional(),
  message: z.string().min(1),
  locale: z.enum(["fr", "en", "ar"]),
});

export type LeadInput = z.infer<typeof leadSchema>;
```

`lib/supabase.ts` :
```ts
import { createClient } from "@supabase/supabase-js";

export function getSupabaseAdmin() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Supabase env vars manquantes");
  return createClient(url, key, { auth: { persistSession: false } });
}
```

- [ ] **Step 5: Créer la migration SQL**

`supabase/migrations/0001_leads.sql` :
```sql
create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  email text not null,
  company text,
  service text,
  message text not null,
  locale text not null check (locale in ('fr','en','ar'))
);

alter table public.leads enable row level security;
-- Aucune policy publique : seules les clés service (côté serveur) écrivent/lisent.
```

- [ ] **Step 6: Créer la route API**

`app/api/lead/route.ts` :
```ts
import { NextResponse } from "next/server";
import { leadSchema } from "@/lib/leadSchema";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }
  const parsed = leadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "validation" }, { status: 400 });
  }
  try {
    const supabase = getSupabaseAdmin();
    const { error } = await supabase.from("leads").insert(parsed.data);
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("lead insert failed", e);
    return NextResponse.json({ ok: false, error: "server" }, { status: 500 });
  }
}
```

- [ ] **Step 7: Documenter les variables d'environnement**

`.env.example` :
```
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
```
Vérifier que `.env`/`.env.local` sont bien dans `.gitignore` (Task 1).

- [ ] **Step 8: Run tests + build**

Run: `npx vitest run test/leadSchema.test.ts && npm run build`
Expected: PASS, build OK. (La migration s'applique dans Supabase manuellement — voir Task 9.)

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "feat: schéma lead + route API Supabase + migration leads"
```

---

### Task 8: Page Contact (formulaire relié à l'API)

**Files:**
- Create: `components/ContactForm.tsx`, `app/[locale]/contact/page.tsx`, `test/contactform.test.tsx`
- Modify: `messages/fr.json`, `messages/en.json`, `messages/ar.json`

**Interfaces:**
- Consumes: `Button`, `Container` (Task 3), endpoint `POST /api/lead` (Task 7).
- Produces: route `/[locale]/contact` avec formulaire fonctionnel.

- [ ] **Step 1: Ajouter les clés `contact` aux messages**

FR :
```json
"contact": {
  "title": "Contactez-nous",
  "name": "Nom",
  "email": "Email",
  "company": "Entreprise",
  "service": "Service souhaité",
  "message": "Votre message",
  "submit": "Envoyer",
  "success": "Merci ! Nous vous répondrons rapidement.",
  "error": "Une erreur est survenue. Réessayez.",
  "required": "Ce champ est requis."
}
```
Fournir EN et AR avec les mêmes clés.

- [ ] **Step 2: Écrire le test du formulaire (succès via fetch mické)**

`test/contactform.test.tsx` :
```tsx
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NextIntlClientProvider } from "next-intl";
import { ContactForm } from "@/components/ContactForm";

const messages = {
  contact: {
    name: "Nom", email: "Email", company: "Entreprise", service: "Service",
    message: "Message", submit: "Envoyer", success: "Merci !", error: "Erreur", required: "Requis",
  },
};

function setup() {
  return render(
    <NextIntlClientProvider locale="fr" messages={messages}>
      <ContactForm />
    </NextIntlClientProvider>
  );
}

describe("ContactForm", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn(async () => new Response(JSON.stringify({ ok: true }), { status: 200 })));
  });

  it("submits and shows success", async () => {
    setup();
    await userEvent.type(screen.getByLabelText("Nom"), "Ali");
    await userEvent.type(screen.getByLabelText("Email"), "ali@test.com");
    await userEvent.type(screen.getByLabelText("Message"), "Bonjour");
    await userEvent.click(screen.getByRole("button", { name: "Envoyer" }));
    await waitFor(() => expect(screen.getByText("Merci !")).toBeInTheDocument());
    expect(fetch).toHaveBeenCalledWith("/api/lead", expect.objectContaining({ method: "POST" }));
  });
});
```

- [ ] **Step 3: Run test (échec attendu)**

Run: `npx vitest run test/contactform.test.tsx`
Expected: FAIL — composant introuvable.

- [ ] **Step 4: Créer ContactForm**

`components/ContactForm.tsx` :
```tsx
"use client";
import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Button } from "./Button";

export function ContactForm() {
  const t = useTranslations("contact");
  const locale = useLocale();
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    const form = new FormData(e.currentTarget);
    const payload = {
      name: String(form.get("name") || ""),
      email: String(form.get("email") || ""),
      company: String(form.get("company") || ""),
      service: String(form.get("service") || ""),
      message: String(form.get("message") || ""),
      locale,
    };
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      setStatus(res.ok ? "ok" : "error");
    } catch {
      setStatus("error");
    }
  }

  const field = "w-full rounded-lg border border-ink/20 bg-transparent px-4 py-3 text-ink";

  return (
    <form onSubmit={onSubmit} className="mt-8 grid max-w-xl gap-4">
      <label className="grid gap-1">{t("name")}
        <input name="name" required className={field} />
      </label>
      <label className="grid gap-1">{t("email")}
        <input name="email" type="email" required className={field} />
      </label>
      <label className="grid gap-1">{t("company")}
        <input name="company" className={field} />
      </label>
      <label className="grid gap-1">{t("service")}
        <input name="service" className={field} />
      </label>
      <label className="grid gap-1">{t("message")}
        <textarea name="message" required rows={5} className={field} />
      </label>
      <Button type="submit">{t("submit")}</Button>
      {status === "ok" && <p className="text-accent">{t("success")}</p>}
      {status === "error" && <p className="text-red-400">{t("error")}</p>}
    </form>
  );
}
```
Note : `<label>` enveloppe l'input, donc `getByLabelText` fonctionne dans le test.

- [ ] **Step 5: Créer la page Contact**

`app/[locale]/contact/page.tsx` :
```tsx
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
```

- [ ] **Step 6: Run tests + build**

Run: `npx vitest run && npm run build`
Expected: tous les tests PASS, build OK.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: page Contact avec formulaire relié à /api/lead"
```

---

### Task 9: Page Services (depuis le HTML fourni) — BLOQUÉE tant que le HTML n'est pas fourni

**Files:**
- Create: `app/[locale]/services/page.tsx`
- Modify: `messages/fr.json`, `messages/en.json`, `messages/ar.json`

**Interfaces:**
- Consumes: `Container`, `ServiceCard`, `Button`, i18n.
- Produces: route `/[locale]/services`.

> **PRÉREQUIS :** le client doit fournir le code HTML de `Services.dc.html`. Sans lui, cette tâche ne peut pas démarrer. Une fois le HTML fourni : extraire la structure et le contenu, convertir en JSX, externaliser tous les textes dans `messages/*.json` (clés sous `services`), réutiliser `ServiceCard`/`Button`/`Container`, adapter les couleurs à la charte (Task 3).

- [ ] **Step 1: Intégrer le HTML fourni**

Convertir le balisage HTML en composant React `app/[locale]/services/page.tsx` :
- remplacer `class=` par `className=`, fermer les balises auto-fermantes,
- remplacer chaque chaîne de texte par `t("...")` avec une clé ajoutée dans `messages/{fr,en,ar}.json` sous `services`,
- réutiliser `ServiceCard` pour les cartes d'offres si la structure s'y prête.

- [ ] **Step 2: Traduire les clés `services` en EN et AR**

Reprendre chaque clé ajoutée en FR et fournir sa traduction EN et AR (même arborescence de clés).

- [ ] **Step 3: Build**

Run: `npm run build`
Expected: routes `/fr/services`, `/en/services`, `/ar/services` générées, aucun texte en dur.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: page Services (depuis le design fourni)"
```

---

### Task 10: Vérification finale & préparation déploiement Vercel

**Files:**
- Create: `README.md`
- Modify: (aucun code)

**Interfaces:**
- Consumes: tout le site.
- Produces: instructions de déploiement + vérification manuelle bout en bout.

- [ ] **Step 1: Appliquer la migration Supabase**

Dans le projet Supabase (dashboard SQL editor ou CLI), exécuter `supabase/migrations/0001_leads.sql`. Renseigner `.env.local` avec `SUPABASE_URL` et `SUPABASE_SERVICE_ROLE_KEY`.

- [ ] **Step 2: Test bout en bout du formulaire (réel)**

Run: `npm run dev`, ouvrir `/fr/contact`, envoyer le formulaire, vérifier dans Supabase (table `leads`) qu'une ligne est créée avec `locale = "fr"`. Répéter en `/ar/contact` (vérifier `dir=rtl` + `locale = "ar"`).

- [ ] **Step 3: Vérifier les 3 langues sur chaque page**

Parcourir Accueil / Services / À propos / Contact en `/fr`, `/en`, `/ar`. Confirmer : aucun texte en dur non traduit, RTL correct en arabe, navigation qui conserve la langue.

- [ ] **Step 4: Build de production**

Run: `npm run build`
Expected: build réussi, toutes les routes localisées listées.

- [ ] **Step 5: Écrire le README (déploiement Vercel)**

`README.md` : instructions install (`npm install`), dev (`npm run dev`), variables d'environnement à définir dans Vercel (`SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`), et rattachement du domaine www.EasyDigia.com dans Vercel.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "docs: README et guide de déploiement Vercel"
```

---

## Ordre d'exécution

Tasks 1 → 8 puis 10 peuvent s'enchaîner sans le HTML. **Task 9 (Services) est bloquée** jusqu'à ce que le client fournisse le code HTML de `Services.dc.html` ; elle s'insère idéalement avant la Task 10 (vérif finale), mais peut être faite après si le HTML arrive plus tard.
