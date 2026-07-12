# Site EasyDigia — Document de conception

**Date :** 2026-07-12
**Domaine :** www.EasyDigia.com
**Activité :** Agence d'automatisation & d'intelligence artificielle pour entreprises

## 1. Objectif

Site vitrine multi-pages, trilingue (FR/EN/AR), destiné à présenter les services
d'automatisation et d'IA d'EasyDigia et à générer des leads via un formulaire de
contact relié à une base de données.

Objectif de conversion principal : **le visiteur envoie une demande via le
formulaire de contact.**

## 2. Stack technique

| Besoin | Choix |
|---|---|
| Framework | Next.js 15 (App Router) |
| Langage | TypeScript |
| Style | Tailwind CSS |
| Internationalisation | next-intl — routes `/fr`, `/en`, `/ar` (RTL pour `ar`) |
| Base de données | Supabase (table `leads`) |
| Hébergement | Vercel, domaine www.EasyDigia.com |

## 3. Pages

Quatre pages, déclinées dans les trois langues via `app/[locale]/` :

1. **Accueil** (`/`) — hero (promesse + CTA), aperçu des services, preuve
   sociale / bénéfices, CTA final vers Contact.
2. **Services** (`/services`) — détail des offres d'automatisation & IA.
   **Base : le code HTML de `Services.dc.html` fourni par le client, converti en
   composants React et internationalisé.** À intégrer avant de coder cette page.
3. **À propos** (`/about`) — mission, approche, valeurs d'EasyDigia.
4. **Contact** (`/contact`) — formulaire de contact relié à Supabase.

## 4. Structure des fichiers

```
easydigia/
├── app/
│   ├── [locale]/
│   │   ├── layout.tsx          # header, footer, LangSwitcher, dir=rtl/ltr
│   │   ├── page.tsx            # Accueil
│   │   ├── services/page.tsx   # Services (depuis HTML fourni)
│   │   ├── about/page.tsx      # À propos
│   │   └── contact/page.tsx    # Contact
│   └── api/
│       └── lead/route.ts       # POST formulaire -> Supabase
├── components/
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── LangSwitcher.tsx
│   ├── Hero.tsx
│   ├── ServiceCard.tsx
│   └── ContactForm.tsx
├── messages/
│   ├── fr.json
│   ├── en.json
│   └── ar.json
├── lib/supabase.ts
├── i18n.ts / middleware.ts     # config next-intl + routing localisé
├── tailwind.config.ts
├── .env.example                # clés Supabase (jamais commit des vraies clés)
└── package.json
```

**Principe :** aucun texte en dur dans le code. Tous les libellés vivent dans
`messages/{fr,en,ar}.json`. Traduire = éditer trois fichiers JSON.

## 5. Internationalisation (FR/EN/AR)

- Routing localisé via next-intl : `/fr/...`, `/en/...`, `/ar/...`.
- Langue par défaut : **français** (`fr`).
- L'arabe (`ar`) applique `dir="rtl"` sur le `<html>` ; FR/EN restent en `ltr`.
  Le layout lit la locale et pose l'attribut `dir` en conséquence.
- Le composant `LangSwitcher` permet de basculer de langue en conservant la page
  courante.

## 6. Formulaire de contact & base de données

**Flux :** saisie visiteur → validation client → `POST /api/lead` → validation
serveur → insertion Supabase → message de confirmation (ou d'erreur).

**Table Supabase `leads` :**

| Colonne | Type | Contrainte |
|---|---|---|
| `id` | uuid | clé primaire, défaut `gen_random_uuid()` |
| `created_at` | timestamptz | défaut `now()` |
| `name` | text | requis |
| `email` | text | requis, format email validé |
| `company` | text | optionnel |
| `service` | text | optionnel (ex. « Automatisation », « Agent IA ») |
| `message` | text | requis |
| `locale` | text | `fr` \| `en` \| `ar` |

- Insertion faite côté serveur (route API) avec la clé service Supabase — jamais
  exposée au client.
- Row Level Security activée ; aucune lecture publique de la table.
- Structure pensée pour brancher plus tard une automatisation (email auto,
  notification, n8n). **Non implémenté dans cette version (YAGNI).**

**Gestion des erreurs :**
- Champ invalide → message sous le champ concerné (validation client + serveur).
- Échec Supabase → message d'erreur clair à l'utilisateur ; l'erreur est journalisée
  côté serveur pour ne pas perdre le lead.

## 7. Identité visuelle (valeurs par défaut, ajustables)

Palette et typographie adaptées à une agence IA/automatisation, en attendant les
préférences finales du client :

- **Couleurs :** fond sombre profond (`#0B1120`), accent principal bleu/indigo
  (`#4F46E5`), accent secondaire cyan électrique (`#22D3EE`), texte clair
  (`#E2E8F0`). Mode sombre par défaut.
- **Typographie :** titres en `Space Grotesk`, corps en `Inter`.
- Ces valeurs seront confirmées/ajustées quand le client fournira son logo et ses
  couleurs de marque (et/ou le HTML de Services, qui peut porter la charte).

## 8. Tests & vérification

- Vérifier le rendu des trois locales (FR/EN/AR) et le passage `ltr`/`rtl`.
- Vérifier la soumission du formulaire de bout en bout : insertion réelle dans
  Supabase + message de confirmation.
- Vérifier la validation (champs requis, email invalide) côté client et serveur.
- Build de production (`next build`) sans erreur avant déploiement Vercel.

## 9. Hors périmètre (cette version)

- Blog / actualités.
- Automatisations déclenchées par les leads (email auto, n8n).
- Espace client / authentification.
- Prise de rendez-vous type Calendly (le formulaire + DB suffit pour démarrer).

Ces éléments pourront faire l'objet de specs ultérieures.
