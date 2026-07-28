# Spec : Pages Géo SEO — Phase 2

**Date :** 2026-07-28
**Périmètre :** Ajouter 200 pages géographiques (5 services × 8 secteurs × 5 villes marocaines)

---

## Objectif

Capturer le trafic de recherche local au Maroc sur des requêtes du type :
- "chatbot IA pour restaurants Casablanca"
- "automatisation pour cliniques Marrakech"
- "agent IA pour immobilier Rabat"

## Architecture

### Approche retenue : Approche 1 — Étendre `[slug]/page.tsx`

Le fichier existant `app/[locale]/solutions/[slug]/page.tsx` gère les deux formats :
- **National** : `chatbot-ia-pour-restaurants`
- **Géo** : `chatbot-ia-pour-restaurants-a-casablanca`

La détection se fait via split sur `-a-` dans le slug.

---

## 1. Data — `config/pseo-data.ts`

### Nouveau type

```ts
export type PseoCity = {
  slug: string;
  label: string;
  region: string;
  context: string; // phrase de contexte économique pour l'intro paragraph
};
```

### 5 villes

```ts
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

### Nouvelles fonctions

```ts
// Récupère une ville par son slug
export function getPseoCity(slug: string): PseoCity | null

// Retourne les 200 slugs géo
export function getAllPseoGeoSlugs(): string[]
// Format : "{service}-pour-{sector}-a-{city}"

// Parse un slug géo et retourne service + sector + city
export function getPseoGeoPage(slug: string): {
  service: PseoService;
  sector: PseoSector;
  city: PseoCity;
} | null
```

### Logique de parsing

```
slug: "chatbot-ia-pour-restaurants-a-casablanca"
  → split sur "-a-" → partie1="chatbot-ia-pour-restaurants", partie2="casablanca"
  → getPseoPage(partie1) → { service, sector }
  → getPseoCity(partie2) → city
  → si tout trouvé → retourne { service, sector, city }
```

---

## 2. Template page géo — `[slug]/page.tsx`

### Métadonnées

```
title: "{service.label} pour {sector.labelFull} à {city.label} | EasyDigia"
description: "Déployez un {service.label.toLowerCase()} pour {sector.label} à {city.label}. {service.description.slice(0,100)}… Résultats mesurables dès 30 jours."
canonical: https://www.easydigia.com/fr/solutions/{slug}
```

### Breadcrumb

```
Accueil → Solutions → {service.label} pour {sector.labelFull} → {city.label}
```

Le lien "Solutions" pointe vers la page nationale : `/solutions/{service}-pour-{sector}`

### 7 points de personnalisation ville

| # | Zone | Contenu |
|---|------|---------|
| 1 | `<title>` + meta description | `... à {city.label}` |
| 2 | H1 | `{service.label} pour {sector.label} **à {city.label}**` |
| 3 | Badge secteur | `{sector.icon} {sector.labelFull} — {city.label}` |
| 4 | Intro paragraph | `Les {sector.label} de **{city.label}**, {city.context}, font face à des défis croissants...` |
| 5 | FAQ géo | Q: "Intervenez-vous à {city.label} ?" A: "Oui, EasyDigia intervient à {city.label} et dans toute la région {city.region}..." |
| 6 | CTA | `Démarrer votre projet à {city.label} →` |
| 7 | Liens internes géo | Autres villes + page nationale + autres services dans cette ville |

### Bloc maillage géo (bas de page, avant CTA final)

**Lien retour national :**
```
← Voir tous les {sector.label} au Maroc
   href: /solutions/{service}-pour-{sector}
```

**Autres villes (4 liens) :**
```
{service.label} à : Casablanca · Rabat · Marrakech · Tanger · Agadir
(la ville courante est exclue et affichée en texte actif)
```

**Autres services à {city.label} (4 liens) :**
```
Aussi à {city.label} : Automatisation · Agent IA · CRM Intelligent · Analyse de données
(le service courant est exclu)
```

---

## 3. Sitemap — `app/sitemap.ts`

Pages géo ajoutées avec priorité et fréquence distinctes :

```ts
// Pages nationales (existantes)
priority: 0.75, changeFrequency: "monthly"

// Pages géo (nouvelles)
priority: 0.65, changeFrequency: "monthly"
```

Total sitemap après déploiement : **~278 URLs**

---

## 4. `generateStaticParams`

```ts
export async function generateStaticParams() {
  return [
    ...getAllPseoSlugs(),     // 40 slugs nationaux
    ...getAllPseoGeoSlugs(),  // 200 slugs géo
  ].map((slug) => ({ slug }));
}
```

---

## 5. Impact build

| Métrique | Avant | Après |
|----------|-------|-------|
| Pages statiques solutions | 40 | 240 |
| Total pages du site | ~178 | ~378 |
| Temps de build estimé | ~30s | ~50s |

---

## Fichiers à modifier

| Fichier | Action |
|---------|--------|
| `config/pseo-data.ts` | Ajouter `PseoCity`, `PSEO_CITIES`, `getPseoCity()`, `getAllPseoGeoSlugs()`, `getPseoGeoPage()` |
| `app/[locale]/solutions/[slug]/page.tsx` | Étendre pour gérer les slugs géo, ajouter le bloc maillage géo |
| `app/sitemap.ts` | Ajouter les 200 URLs géo |

## Fichiers non modifiés

- `components/` — aucun nouveau composant nécessaire
- `i18n/` — les pages géo sont uniquement en `/fr/` pour l'instant
- `middleware.ts` — aucun changement de routing

---

## Contraintes

- Les pages géo sont générées **uniquement en français** (`/fr/solutions/...`) — pas de version `en` ou `ar` pour la Phase 2
- Le contenu des pages géo est **programmatique** (template + données) — pas de rédaction manuelle
- La page nationale reste la page de référence (canonical authority)
