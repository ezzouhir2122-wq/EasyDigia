# EasyDigia — Site web

Site vitrine trilingue (FR / EN / AR) pour **EasyDigia**, agence d'automatisation
et d'intelligence artificielle. Domaine cible : **www.EasyDigia.com**.

## Stack

- **Next.js 16** (App Router) + **TypeScript**
- **Tailwind CSS v3** (mode sombre par défaut)
- **next-intl** — routes localisées `/fr`, `/en`, `/ar` (RTL automatique pour l'arabe)
- **Supabase** — stockage des leads du formulaire de contact
- **Vitest** + Testing Library — tests

## Démarrage

```bash
npm install
cp .env.example .env.local   # puis renseigner les clés Supabase
npm run dev                  # http://localhost:3000 (redirige vers /fr)
```

Autres commandes :

```bash
npm test        # lance les tests (Vitest)
npm run build   # build de production
npm start       # sert le build de production
```

## Variables d'environnement

Définies dans `.env.local` en local, et dans les **Environment Variables** du projet
Vercel en production :

| Variable | Description |
|---|---|
| `SUPABASE_URL` | URL du projet Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | Clé service (serveur uniquement — jamais exposée au client) |

Tant que ces variables ne sont pas définies, le formulaire de contact renvoie une
erreur 500 propre (les autres pages fonctionnent normalement).

## Base de données (Supabase)

Appliquer la migration dans le projet Supabase (SQL Editor ou CLI) :

```
supabase/migrations/0001_leads.sql
```

Elle crée la table `public.leads` (avec RLS activée, aucune lecture publique). Les
leads sont insérés côté serveur via la route `POST /api/lead`.

## Internationalisation

- Tous les textes sont dans `messages/fr.json`, `messages/en.json`, `messages/ar.json`.
  Pour modifier un texte : éditer ces trois fichiers (mêmes clés).
- L'arabe applique automatiquement `dir="rtl"` ; FR et EN restent en `ltr`.

## Structure

```
app/[locale]/        Accueil, services, about, contact (+ layout localisé)
app/api/lead/        Route API du formulaire -> Supabase
components/           Header, Footer, LangSwitcher, Hero, ServiceCard, Button, Container, ContactForm
i18n/                 routing, request, navigation (next-intl)
messages/             fr.json, en.json, ar.json
lib/                  supabase.ts, leadSchema.ts
supabase/migrations/  0001_leads.sql
```

## Page Services

La page `app/[locale]/services/page.tsx` est actuellement une **version provisoire**.
Elle sera remplacée par le design `Services.dc.html` fourni par le client (conversion
en JSX + externalisation des textes dans `messages/*.json`).

## Déploiement Vercel

1. Pousser le dépôt sur GitHub.
2. Importer le projet dans Vercel (framework détecté : Next.js).
3. Renseigner `SUPABASE_URL` et `SUPABASE_SERVICE_ROLE_KEY` dans les variables
   d'environnement Vercel.
4. Rattacher le domaine **www.EasyDigia.com** dans Vercel (Settings → Domains).

> Note Next.js 16 : le fichier `middleware.ts` déclenche un avertissement de
> dépréciation (« use proxy instead »). Il reste fonctionnel ; migration possible
> plus tard.
