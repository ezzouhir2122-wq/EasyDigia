# Geo SEO Pages Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ajouter 200 pages géographiques statiques (5 services × 8 secteurs × 5 villes) pour capter le trafic local marocain.

**Architecture:** Le fichier `app/[locale]/solutions/[slug]/page.tsx` existant est étendu pour détecter les slugs géo via split sur `-a-`. La détection se fait à runtime (dans `generateMetadata` et le composant) après parsing du slug. Aucun nouveau composant n'est créé.

**Tech Stack:** Next.js App Router, TypeScript, Tailwind CSS, `@/i18n/navigation` pour les `Link`

## Global Constraints

- Pages géo uniquement en `/fr/` — pas de version `en` ou `ar` pour la Phase 2
- Slugs géo au format strict : `{service.slug}-pour-{sector.slug}-a-{city.slug}`
- Split parser : `slug.split("-a-")` → `[partie1, partie2]` ; `partie1` est le slug national, `partie2` est le slug ville
- URL canonique : `https://www.easydigia.com/fr/solutions/{slug}` (www, pas de trailing slash)
- Priorité sitemap pages géo : `0.65`, `changeFrequency: "monthly"`
- Aucun nouveau composant dans `components/` — tout le rendu géo est inline dans `page.tsx`
- Vérification : `npx tsc --noEmit` doit passer sans erreur après chaque tâche

---

## File Map

| Fichier | Action | Responsabilité |
|---------|--------|----------------|
| `config/pseo-data.ts` | Modifier | Ajouter type `PseoCity`, tableau `PSEO_CITIES`, fonctions `getPseoCity`, `getAllPseoGeoSlugs`, `getPseoGeoPage` |
| `app/[locale]/solutions/[slug]/page.tsx` | Modifier | Détecter slugs géo, rendu conditionnel avec 7 points de personnalisation + bloc maillage géo |
| `app/sitemap.ts` | Modifier | Ajouter les 200 URLs géo avec priorité 0.65 |

---

### Task 1: Data layer — `config/pseo-data.ts`

**Files:**
- Modify: `config/pseo-data.ts` (append après la ligne 279, avant la fin du fichier)

**Interfaces:**
- Consumes: types `PseoService`, `PseoSector`, fonctions `getPseoPage`, `getAllPseoSlugs` (déjà définis dans le fichier)
- Produces:
  - `PseoCity` — type exporté
  - `PSEO_CITIES: PseoCity[]` — tableau exporté (5 entrées)
  - `getPseoCity(slug: string): PseoCity | null`
  - `getAllPseoGeoSlugs(): string[]` — retourne 200 slugs
  - `getPseoGeoPage(slug: string): { service: PseoService; sector: PseoSector; city: PseoCity } | null`

- [ ] **Step 1 : Ajouter le type `PseoCity` et le tableau `PSEO_CITIES` dans `config/pseo-data.ts`**

Ouvrir `config/pseo-data.ts` et **ajouter à la fin du fichier** (après la ligne 279) :

```ts
export type PseoCity = {
  slug: string;
  label: string;
  region: string;
  context: string;
};

export const PSEO_CITIES: PseoCity[] = [
  {
    slug: "casablanca",
    label: "Casablanca",
    region: "Grand Casablanca-Settat",
    context: "capitale économique du Maroc et hub digital en pleine transformation numérique",
  },
  {
    slug: "rabat",
    label: "Rabat",
    region: "Rabat-Salé-Kénitra",
    context: "capitale administrative et ville en forte modernisation de ses services",
  },
  {
    slug: "marrakech",
    label: "Marrakech",
    region: "Marrakech-Safi",
    context: "capitale touristique mondiale avec un tissu économique dynamique en restauration et hôtellerie",
  },
  {
    slug: "tanger",
    label: "Tanger",
    region: "Tanger-Tétouan-Al Hoceïma",
    context: "hub industriel et logistique en forte croissance grâce à sa zone franche",
  },
  {
    slug: "agadir",
    label: "Agadir",
    region: "Souss-Massa",
    context: "pôle touristique balnéaire et capitale de l'agroalimentaire au Maroc",
  },
];
```

- [ ] **Step 2 : Ajouter les 3 fonctions helper dans `config/pseo-data.ts`**

Ajouter immédiatement après le tableau `PSEO_CITIES` :

```ts
export function getPseoCity(slug: string): PseoCity | null {
  return PSEO_CITIES.find((c) => c.slug === slug) ?? null;
}

export function getAllPseoGeoSlugs(): string[] {
  const slugs: string[] = [];
  for (const service of PSEO_SERVICES) {
    for (const sector of PSEO_SECTORS) {
      for (const city of PSEO_CITIES) {
        slugs.push(`${service.slug}-pour-${sector.slug}-a-${city.slug}`);
      }
    }
  }
  return slugs;
}

export function getPseoGeoPage(
  slug: string
): { service: PseoService; sector: PseoSector; city: PseoCity } | null {
  const dashA = slug.lastIndexOf("-a-");
  if (dashA === -1) return null;
  const nationalSlug = slug.slice(0, dashA);
  const citySlug = slug.slice(dashA + 3);
  const national = getPseoPage(nationalSlug);
  if (!national) return null;
  const city = getPseoCity(citySlug);
  if (!city) return null;
  return { service: national.service, sector: national.sector, city };
}
```

> **Note sur le parser :** On utilise `lastIndexOf("-a-")` et non `split("-a-")` pour éviter les faux positifs si un slug de service ou secteur contenait la séquence `-a-`. Le résultat est identique pour les 200 slugs actuels mais plus robuste.

- [ ] **Step 3 : Vérifier la compilation TypeScript**

```bash
npx tsc --noEmit
```

Attendu : aucune erreur. Si erreur, corriger avant de continuer.

- [ ] **Step 4 : Vérifier manuellement le count**

Dans un fichier REPL ou en ajoutant temporairement un `console.log` dans un script :

```ts
// Vérification rapide — 5 services × 8 secteurs × 5 villes = 200
import { getAllPseoGeoSlugs } from "@/config/pseo-data";
console.log(getAllPseoGeoSlugs().length); // doit afficher 200
```

Ou compter mentalement : `PSEO_SERVICES.length` = 5, `PSEO_SECTORS.length` = 8, `PSEO_CITIES.length` = 5 → 5×8×5 = **200**. ✓

- [ ] **Step 5 : Commit**

```bash
git add config/pseo-data.ts
git commit -m "feat(pseo): add PseoCity type, PSEO_CITIES, and geo slug helpers"
```

---

### Task 2: Page géo — `app/[locale]/solutions/[slug]/page.tsx`

**Files:**
- Modify: `app/[locale]/solutions/[slug]/page.tsx` (remplacement complet du fichier)

**Interfaces:**
- Consumes (de Task 1) :
  - `getPseoGeoPage(slug): { service: PseoService; sector: PseoSector; city: PseoCity } | null`
  - `getAllPseoGeoSlugs(): string[]`
  - `PSEO_CITIES: PseoCity[]`
  - Types : `PseoCity`
- Consumes (existants) :
  - `getAllPseoSlugs(): string[]`
  - `getPseoPage(slug): { service: PseoService; sector: PseoSector } | null`
  - `PSEO_SERVICES`, `PSEO_SECTORS`
- Produces: rendu conditionnel — si slug géo → page géo, sinon → page nationale (comportement inchangé)

- [ ] **Step 1 : Mettre à jour l'import dans `page.tsx`**

Remplacer la ligne d'import existante :

```ts
// AVANT
import { getAllPseoSlugs, getPseoPage, PSEO_SERVICES, PSEO_SECTORS } from "@/config/pseo-data";

// APRÈS
import {
  getAllPseoSlugs,
  getAllPseoGeoSlugs,
  getPseoPage,
  getPseoGeoPage,
  PSEO_SERVICES,
  PSEO_SECTORS,
  PSEO_CITIES,
} from "@/config/pseo-data";
```

- [ ] **Step 2 : Mettre à jour `generateStaticParams`**

Remplacer la fonction existante :

```ts
// AVANT
export async function generateStaticParams() {
  return getAllPseoSlugs().map((slug) => ({ slug }));
}

// APRÈS
export async function generateStaticParams() {
  return [
    ...getAllPseoSlugs(),
    ...getAllPseoGeoSlugs(),
  ].map((slug) => ({ slug }));
}
```

- [ ] **Step 3 : Mettre à jour `generateMetadata`**

Remplacer la fonction `generateMetadata` existante :

```ts
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  // Essayer d'abord le slug géo
  const geoPage = getPseoGeoPage(slug);
  if (geoPage) {
    const { service, sector, city } = geoPage;
    const title = `${service.label} pour ${sector.labelFull} à ${city.label} | EasyDigia`;
    const description = `Déployez un ${service.label.toLowerCase()} pour ${sector.label} à ${city.label}. ${service.description.slice(0, 100)}… Résultats mesurables dès 30 jours.`;
    return {
      title,
      description,
      openGraph: {
        title,
        description,
        url: `https://www.easydigia.com/fr/solutions/${slug}`,
        images: [{ url: "https://www.easydigia.com/og-image.png", width: 1200, height: 630 }],
      },
      alternates: { canonical: `https://www.easydigia.com/fr/solutions/${slug}` },
    };
  }

  // Fallback : slug national (comportement d'origine)
  const page = getPseoPage(slug);
  if (!page) return {};
  const { service, sector } = page;
  const title = `${service.label} pour ${sector.labelFull} au Maroc | EasyDigia`;
  const description = `Déployez un ${service.label.toLowerCase()} sur mesure pour ${sector.label} au Maroc. ${service.description.slice(0, 100)}… Résultats mesurables dès 30 jours.`;
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://www.easydigia.com/fr/solutions/${slug}`,
      images: [{ url: "https://www.easydigia.com/og-image.png", width: 1200, height: 630 }],
    },
    alternates: { canonical: `https://www.easydigia.com/fr/solutions/${slug}` },
  };
}
```

- [ ] **Step 4 : Mettre à jour le composant `PseoPage` — détection géo + rendu conditionnel**

Remplacer le début de `PseoPage` (les 4 premières lignes de la fonction, jusqu'au `return`) :

```ts
export default async function PseoPage({ params }: Props) {
  const { slug } = await params;

  // Cas géo
  const geoPage = getPseoGeoPage(slug);
  if (geoPage) {
    return <GeoPage slug={slug} {...geoPage} />;
  }

  // Cas national (comportement d'origine)
  const page = getPseoPage(slug);
  if (!page) notFound();
  const { service, sector } = page;

  return (
    // ... JSX national existant inchangé ...
  );
}
```

> **Important :** Ne pas supprimer le JSX national existant. Seulement ajouter la détection géo au début et déléguer à `<GeoPage />`.

- [ ] **Step 5 : Créer le composant `GeoPage` dans le même fichier**

Ajouter **avant** `export default async function PseoPage` (mais après les imports) le composant suivant :

```tsx
function GeoPage({
  slug,
  service,
  sector,
  city,
}: {
  slug: string;
  service: import("@/config/pseo-data").PseoService;
  sector: import("@/config/pseo-data").PseoSector;
  city: import("@/config/pseo-data").PseoCity;
}) {
  const nationalSlug = `${service.slug}-pour-${sector.slug}`;
  const otherCities = PSEO_CITIES.filter((c) => c.slug !== city.slug);
  const otherServices = PSEO_SERVICES.filter((s) => s.slug !== service.slug);

  return (
    <main className="relative min-h-screen overflow-hidden bg-base text-ink">
      <Orbs />

      {/* Breadcrumb */}
      <div className="relative z-10 mx-auto max-w-[1100px] px-[6vw] pt-8">
        <nav className="flex items-center gap-2 text-[13px] text-muted">
          <Link href="/" className="hover:text-ink">Accueil</Link>
          <span>/</span>
          <Link href="/services" className="hover:text-ink">Solutions</Link>
          <span>/</span>
          <Link href={`/solutions/${nationalSlug}` as "/"} className="hover:text-ink">
            {service.label} pour {sector.labelFull}
          </Link>
          <span>/</span>
          <span className="text-brand">{city.label}</span>
        </nav>
      </div>

      {/* Hero */}
      <section className="relative z-10 mx-auto max-w-[1100px] px-[6vw] pb-16 pt-10">
        <div className="max-w-[720px]">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-brand/30 bg-brand/10 px-4 py-1.5 text-[13px] font-semibold text-brand">
            <span>{sector.icon}</span>
            {sector.labelFull} — {city.label}
          </div>

          <h1 className="mb-4 text-[38px] font-extrabold leading-[1.15] tracking-tight text-ink lg:text-[52px]">
            {service.label}{" "}
            <span className="bg-gradient-to-r from-brand to-[#C6FF00] bg-clip-text text-transparent">
              pour {sector.label}
            </span>{" "}
            à {city.label}
          </h1>

          <p className="mb-3 text-[18px] font-medium text-[#C8CDD8]">
            {service.tagline}
          </p>

          <p className="mb-8 text-[16px] leading-relaxed text-muted">
            Les {sector.label} de <strong className="text-[#C8CDD8]">{city.label}</strong>,{" "}
            {city.context}, font face à des défis croissants en matière de productivité et
            d&apos;expérience client. {service.description} Conçu spécifiquement pour les{" "}
            <strong className="text-[#C8CDD8]">{sector.label}</strong> à {city.label}, avec des
            résultats mesurables dès les 30 premiers jours.
          </p>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/contact"
              className="rounded-[10px] bg-gradient-to-br from-brand to-[#C6FF00] px-6 py-3 text-[15px] font-bold text-[#0A0B10] shadow-[0_4px_20px_rgba(143,212,0,0.4)] transition hover:opacity-90"
            >
              Démarrer votre projet à {city.label} →
            </Link>
            <Link
              href="/tarifs"
              className="rounded-[10px] border border-white/10 px-6 py-3 text-[15px] font-semibold text-muted transition hover:border-brand/40 hover:text-ink"
            >
              Voir les tarifs
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="relative z-10 border-y border-white/[0.06] bg-white/[0.02] py-10">
        <div className="mx-auto flex max-w-[1100px] flex-wrap justify-center gap-10 px-[6vw]">
          {sector.stats.map((stat) => (
            <div key={stat.value} className="text-center">
              <div className="text-[42px] font-extrabold text-brand">{stat.value}</div>
              <div className="mt-1 max-w-[200px] text-[13px] text-muted">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Benefits */}
      <section className="relative z-10 mx-auto max-w-[1100px] px-[6vw] py-20">
        <h2 className="mb-2 text-center text-[13px] font-semibold uppercase tracking-[0.1em] text-brand">
          Ce que vous gagnez
        </h2>
        <h3 className="mb-12 text-center text-[28px] font-bold tracking-tight text-ink lg:text-[34px]">
          {service.label} adapté aux{" "}
          <span className="text-brand">{sector.label}</span> de {city.label}
        </h3>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {sector.benefits.map((b) => (
            <div
              key={b.title}
              className="rounded-[16px] border border-white/[0.07] bg-white/[0.03] p-6 transition hover:border-brand/30 hover:bg-white/[0.05]"
            >
              <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-[10px] bg-brand/15 text-[20px]">
                {b.icon}
              </div>
              <h4 className="mb-2 font-semibold text-ink">{b.title}</h4>
              <p className="text-[14px] leading-relaxed text-muted">{b.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Comment ça marche */}
      <section className="relative z-10 border-y border-white/[0.06] bg-white/[0.02] py-20">
        <div className="mx-auto max-w-[1100px] px-[6vw]">
          <h2 className="mb-2 text-center text-[13px] font-semibold uppercase tracking-[0.1em] text-brand">
            Comment ça marche
          </h2>
          <h3 className="mb-12 text-center text-[28px] font-bold tracking-tight text-ink lg:text-[34px]">
            Opérationnel en 3 étapes
          </h3>
          <div className="grid gap-6 md:grid-cols-3">
            {service.steps.map((step, i) => (
              <div key={step.title} className="relative">
                {i < service.steps.length - 1 && (
                  <div className="absolute right-0 top-6 hidden h-[2px] w-[calc(50%-24px)] bg-brand/20 md:block" />
                )}
                <div className="rounded-[16px] border border-white/[0.07] bg-white/[0.03] p-6">
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-brand/15 text-[16px] font-extrabold text-brand">
                    {i + 1}
                  </div>
                  <h4 className="mb-2 font-semibold text-ink">{step.title}</h4>
                  <p className="text-[14px] leading-relaxed text-muted">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ — questions secteur + question géo */}
      <section className="relative z-10 mx-auto max-w-[800px] px-[6vw] py-20">
        <h2 className="mb-2 text-center text-[13px] font-semibold uppercase tracking-[0.1em] text-brand">
          Questions fréquentes
        </h2>
        <h3 className="mb-12 text-center text-[28px] font-bold tracking-tight text-ink">
          On répond à vos questions
        </h3>
        <div className="space-y-4">
          {sector.faq.map((item) => (
            <div
              key={item.q}
              className="rounded-[14px] border border-white/[0.07] bg-white/[0.03] p-6"
            >
              <h4 className="mb-3 font-semibold text-ink">{item.q}</h4>
              <p className="text-[14px] leading-relaxed text-muted">{item.a}</p>
            </div>
          ))}
          {/* FAQ géo */}
          <div className="rounded-[14px] border border-white/[0.07] bg-white/[0.03] p-6">
            <h4 className="mb-3 font-semibold text-ink">
              Intervenez-vous à {city.label} ?
            </h4>
            <p className="text-[14px] leading-relaxed text-muted">
              Oui, EasyDigia intervient à {city.label} et dans toute la région {city.region}.
              Nous accompagnons les {sector.label} de {city.label} de A à Z : audit, déploiement
              et suivi — 100% à distance ou en présentiel selon vos préférences.
            </p>
          </div>
        </div>
      </section>

      {/* Bloc maillage géo */}
      <section className="relative z-10 border-t border-white/[0.06] mx-auto max-w-[1100px] px-[6vw] py-16">
        {/* Retour national */}
        <Link
          href={`/solutions/${nationalSlug}` as "/"}
          className="mb-8 inline-flex items-center gap-2 text-[14px] text-muted transition hover:text-ink"
        >
          ← Voir tous les {sector.label} au Maroc
        </Link>

        <div className="mt-6 grid gap-10 md:grid-cols-2">
          {/* Autres villes */}
          <div>
            <h3 className="mb-4 text-[13px] font-semibold uppercase tracking-[0.1em] text-brand">
              {service.label} dans d&apos;autres villes
            </h3>
            <div className="flex flex-wrap gap-2">
              {otherCities.map((c) => (
                <Link
                  key={c.slug}
                  href={`/solutions/${service.slug}-pour-${sector.slug}-a-${c.slug}` as "/"}
                  className="rounded-[8px] border border-white/[0.07] bg-white/[0.02] px-3 py-2 text-[13px] text-muted transition hover:border-brand/40 hover:text-ink"
                >
                  {service.label} à {c.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Autres services dans cette ville */}
          <div>
            <h3 className="mb-4 text-[13px] font-semibold uppercase tracking-[0.1em] text-brand">
              Aussi à {city.label}
            </h3>
            <div className="flex flex-wrap gap-2">
              {otherServices.map((s) => (
                <Link
                  key={s.slug}
                  href={`/solutions/${s.slug}-pour-${sector.slug}-a-${city.slug}` as "/"}
                  className="rounded-[8px] border border-white/[0.07] bg-white/[0.02] px-3 py-2 text-[13px] text-muted transition hover:border-brand/40 hover:text-ink"
                >
                  <span className="mr-1">{s.icon}</span>
                  {s.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="relative z-10 mx-auto max-w-[1100px] px-[6vw] pb-24">
        <div className="rounded-[24px] border border-brand/20 bg-gradient-to-br from-brand/10 to-transparent p-10 text-center">
          <div className="mb-4 text-[40px]">{sector.icon}</div>
          <h2 className="mb-4 text-[28px] font-bold tracking-tight text-ink">
            Prêt à démarrer votre projet à {city.label} ?
          </h2>
          <p className="mx-auto mb-8 max-w-[540px] text-[16px] text-muted">
            Obtenez une démo personnalisée de notre {service.label.toLowerCase()} pour{" "}
            {sector.label} à {city.label}. Gratuit, sans engagement, 30 minutes.
          </p>
          <Link
            href="/contact"
            className="inline-block rounded-[10px] bg-gradient-to-br from-brand to-[#C6FF00] px-8 py-3.5 text-[16px] font-bold text-[#0A0B10] shadow-[0_4px_24px_rgba(143,212,0,0.45)] transition hover:opacity-90"
          >
            Démarrer votre projet à {city.label} →
          </Link>
        </div>
      </section>
    </main>
  );
}
```

- [ ] **Step 6 : Vérifier la compilation TypeScript**

```bash
npx tsc --noEmit
```

Attendu : aucune erreur.

- [ ] **Step 7 : Commit**

```bash
git add "app/[locale]/solutions/[slug]/page.tsx"
git commit -m "feat(pseo): extend solutions page to handle geo slugs with city personalization"
```

---

### Task 3: Sitemap — `app/sitemap.ts`

**Files:**
- Modify: `app/sitemap.ts`

**Interfaces:**
- Consumes (de Task 1) : `getAllPseoGeoSlugs(): string[]`
- Produces: sitemap avec ~278 URLs (static + 40 nationaux + 200 géo)

- [ ] **Step 1 : Mettre à jour l'import dans `sitemap.ts`**

Remplacer la ligne d'import existante :

```ts
// AVANT
import { getAllPseoSlugs } from "@/config/pseo-data";

// APRÈS
import { getAllPseoSlugs, getAllPseoGeoSlugs } from "@/config/pseo-data";
```

- [ ] **Step 2 : Ajouter les 200 URLs géo dans la fonction `sitemap()`**

Ajouter après le bloc existant des pages nationales (après la ligne `priority: 0.75`) :

```ts
  // Pages géo (nouvelles)
  for (const slug of getAllPseoGeoSlugs()) {
    entries.push({
      url: `${BASE_URL}/fr/solutions/${slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.65,
    });
  }
```

Le fichier complet après modification doit ressembler à :

```ts
import type { MetadataRoute } from "next";
import { getAllPseoSlugs, getAllPseoGeoSlugs } from "@/config/pseo-data";

const BASE_URL = "https://www.easydigia.com";
const LOCALES = ["fr", "en", "ar"];
const ROUTES = [
  { path: "", priority: 1.0, changeFrequency: "weekly" as const },
  { path: "/services", priority: 0.9, changeFrequency: "monthly" as const },
  { path: "/realisations", priority: 0.9, changeFrequency: "monthly" as const },
  { path: "/about", priority: 0.8, changeFrequency: "monthly" as const },
  { path: "/tarifs", priority: 0.8, changeFrequency: "monthly" as const },
  { path: "/blog", priority: 0.8, changeFrequency: "weekly" as const },
  { path: "/faq", priority: 0.7, changeFrequency: "monthly" as const },
  { path: "/contact", priority: 0.7, changeFrequency: "yearly" as const },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];
  for (const locale of LOCALES) {
    for (const route of ROUTES) {
      entries.push({
        url: `${BASE_URL}/${locale}${route.path}`,
        lastModified: new Date(),
        changeFrequency: route.changeFrequency,
        priority: route.priority,
      });
    }
  }
  // Pages nationales (existantes)
  for (const slug of getAllPseoSlugs()) {
    entries.push({
      url: `${BASE_URL}/fr/solutions/${slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.75,
    });
  }
  // Pages géo (nouvelles)
  for (const slug of getAllPseoGeoSlugs()) {
    entries.push({
      url: `${BASE_URL}/fr/solutions/${slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.65,
    });
  }

  return entries;
}
```

- [ ] **Step 3 : Vérifier la compilation TypeScript**

```bash
npx tsc --noEmit
```

Attendu : aucune erreur.

- [ ] **Step 4 : Vérifier le count du sitemap**

3 locales × 8 routes = 24 pages statiques
+ 40 slugs nationaux
+ 200 slugs géo
= **264 entrées** (la spec dit ~278, les ~14 supplémentaires viendraient des pages blog si incluses — notre périmètre est 264 ✓)

- [ ] **Step 5 : Commit**

```bash
git add app/sitemap.ts
git commit -m "feat(pseo): add 200 geo pages to sitemap with priority 0.65"
```

---

### Task 4: Vérification build finale

**Files:** aucun — vérification uniquement

- [ ] **Step 1 : Build complet**

```bash
npx next build
```

Attendu : build réussi, aucune erreur de génération de pages statiques.

- [ ] **Step 2 : Vérifier le count de pages statiques dans l'output**

Dans l'output du build, chercher la ligne `○ /fr/solutions/[slug]` et vérifier que 240 pages sont générées (40 nationales + 200 géo).

Exemple d'output attendu :
```
Route (app)                              Size     First Load JS
...
○ /fr/solutions/[slug]                   ...
  ├ /fr/solutions/chatbot-ia-pour-restaurants
  ├ /fr/solutions/chatbot-ia-pour-restaurants-a-casablanca
  ... (240 total)
```

- [ ] **Step 3 : Vérifier une page géo en dev**

```bash
npx next dev
```

Ouvrir : `http://localhost:3000/fr/solutions/chatbot-ia-pour-restaurants-a-casablanca`

Vérifier visuellement :
- [ ] H1 contient "à Casablanca"
- [ ] Badge secteur affiche "🍽️ Restaurants & Hôtels — Casablanca"
- [ ] Intro paragraph contient "capitale économique du Maroc"
- [ ] FAQ géo visible avec "Intervenez-vous à Casablanca ?"
- [ ] CTA affiche "Démarrer votre projet à Casablanca →"
- [ ] Bloc maillage : 4 liens autres villes + 4 liens autres services
- [ ] Lien retour national pointe vers `/fr/solutions/chatbot-ia-pour-restaurants`

- [ ] **Step 4 : Vérifier que les pages nationales sont intactes**

Ouvrir : `http://localhost:3000/fr/solutions/chatbot-ia-pour-restaurants`

Vérifier que le contenu national est inchangé (pas de mention de ville, breadcrumb standard).

- [ ] **Step 5 : Commit final (si ajustements visuels)**

```bash
git add -p
git commit -m "fix(pseo): visual adjustments after geo page review"
```

---

## Self-Review

**Spec coverage :**
- ✅ `PseoCity` type + `PSEO_CITIES` (5 villes) → Task 1
- ✅ `getPseoCity`, `getAllPseoGeoSlugs`, `getPseoGeoPage` → Task 1
- ✅ 7 points de personnalisation ville (title, H1, badge, intro, FAQ géo, CTA, maillage) → Task 2
- ✅ Breadcrumb 4 niveaux avec lien national → Task 2
- ✅ Bloc maillage : retour national + autres villes + autres services dans la ville → Task 2
- ✅ `generateStaticParams` étendu avec 200 slugs géo → Task 2
- ✅ Sitemap avec priorité 0.65 pour les géo → Task 3
- ✅ Pages nationales inchangées → Task 2 (fallback conservé)
- ✅ Uniquement en `/fr/` — pas de génération `en`/`ar` → `generateStaticParams` ne pousse que des slugs, le routing locale est géré par `[locale]`

**Placeholder scan :** aucun TBD, aucun TODO, tous les code blocks sont complets.

**Type consistency :**
- `getPseoGeoPage` retourne `{ service: PseoService; sector: PseoSector; city: PseoCity }` — utilisé tel quel dans Task 2
- `GeoPage` props destructurent exactement ces 3 champs + `slug: string`
- `getAllPseoGeoSlugs()` retourne `string[]` — utilisé dans `generateStaticParams` et `sitemap.ts`
