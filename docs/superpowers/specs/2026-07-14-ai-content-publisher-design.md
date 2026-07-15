# EasyDigia AI Content Publisher — Document de conception

**Date :** 2026-07-14
**Projet :** `easydigia-publisher` (repo autonome)
**Objectif :** Pipeline CLI autonome qui recherche des images, génère des articles SEO via Claude, et publie automatiquement sur WordPress.

---

## 1. Objectif

Une seule commande `npm run publish` doit :

1. Rechercher les meilleures images libres de droits (Unsplash → Pexels → Pixabay)
2. Télécharger et convertir en WebP (<300 KB)
3. Générer un article SEO complet en français via Claude Sonnet
4. Publier automatiquement sur WordPress (www.easydigia.com)
5. Sauvegarder toutes les données en SQLite
6. Générer un rapport PDF basique

---

## 2. Architecture — Approche B : Services modulaires

Chaque responsabilité vit dans son propre service. Un orchestrateur `Publisher` les appelle en séquence. SQLite persiste l'état pour reprendre après échec.

### Structure du projet

```
easydigia-publisher/
├── src/
│   ├── cli/
│   │   └── index.ts                 ← commander : publish + schedule
│   ├── orchestrator/
│   │   └── Publisher.ts             ← coordonne les services étape par étape
│   ├── services/
│   │   ├── image/
│   │   │   ├── ImageSearcher.ts     ← Unsplash → Pexels → Pixabay
│   │   │   ├── ImageDownloader.ts   ← téléchargement HD
│   │   │   └── ImageProcessor.ts   ← Sharp : → WebP, <300 KB
│   │   ├── seo/
│   │   │   └── SeoGenerator.ts     ← alt, caption, title, meta, slug, schema
│   │   ├── ai/
│   │   │   └── ArticleGenerator.ts ← Claude Sonnet : article 1500–2500 mots
│   │   ├── wordpress/
│   │   │   └── WordPressPublisher.ts ← REST API : upload image + créer post
│   │   ├── report/
│   │   │   └── ReportGenerator.ts  ← PDF basique via pdfkit
│   │   └── scheduler/
│   │       └── Scheduler.ts        ← node-cron : publication quotidienne
│   ├── database/
│   │   └── Database.ts             ← better-sqlite3 : articles, images, logs
│   ├── config/
│   │   └── config.ts               ← lecture .env + validation zod
│   └── utils/
│       └── logger.ts               ← logs colorés console
├── assets/
│   ├── images/original/
│   └── images/webp/
├── database/
│   └── articles.db
├── reports/
├── .env                             ← jamais committé
├── .env.example
├── package.json
└── tsconfig.json
```

---

## 3. Stack technique

| Besoin | Package |
|---|---|
| CLI | `commander` |
| HTTP / images | `axios` |
| Traitement image | `sharp` |
| IA | `@anthropic-ai/sdk` (Claude Sonnet) |
| WordPress | `axios` (REST API) |
| SQLite | `better-sqlite3` |
| Scheduler | `node-cron` |
| PDF | `pdfkit` |
| Config | `dotenv` + `zod` |
| Exécution TS | `tsx` |
| Types | `typescript` strict |

---

## 4. Pipeline détaillé

```
CLI input : sujet, nombre d'articles, draft/publish
        ↓
Publisher.run(job)
        ↓
Étape 1 — ImageSearcher
   └─ Unsplash API → si 0 résultat → Pexels → si 0 → Pixabay
   └─ Filtre : ≥1920×1080, orientation paysage, sans watermark
   └─ Sélectionne les 10 meilleures, retient N selon config
   └─ Collecte : url, author, source_url, licence, width, height

Étape 2 — ImageDownloader
   └─ Télécharge chaque image dans assets/images/original/
   └─ Nom : {slug-sujet}-{index:003}.jpg

Étape 3 — ImageProcessor
   └─ Sharp → WebP qualité 85%
   └─ Si poids >300 KB : réduit qualité par paliers jusqu'à passer le seuil
   └─ Sauvegarde dans assets/images/webp/

Étape 4 — SeoGenerator (Claude)
   └─ Par image : alt text, caption, title, description, nom fichier SEO
   └─ Pour l'article : meta title (≤60 car), meta description (≤160 car),
      slug, tags, catégorie, keywords

Étape 5 — ArticleGenerator (Claude Sonnet)
   └─ Prompt structuré → H1, intro, H2/H3, FAQ, conclusion, CTA
   └─ 1500–2500 mots, français, ton expert
   └─ Images insérées dans le corps à intervalles réguliers (HTML)

Étape 6 — WordPressPublisher
   └─ Upload chaque image via /wp-json/wp/v2/media → obtient media_id + URL
   └─ Crée le post via /wp-json/wp/v2/posts avec :
      contenu HTML, featured_media, meta SEO (Yoast/RankMath si actif)
   └─ Statut : draft | publish selon config

Étape 7 — Database.save()
   └─ Insère dans articles, images, logs

Étape 8 — ReportGenerator
   └─ PDF : titre, URL publiée, image mise en avant, meta title, meta description, slug
   └─ Sauvegarde dans reports/{YYYY-MM-DD}-{slug}.pdf

Étape 9 — Logger
   └─ ✓ Succès / ✗ Erreur avec détail à chaque étape
```

---

## 5. Base de données SQLite

```sql
-- articles
CREATE TABLE articles (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  slug            TEXT UNIQUE NOT NULL,
  title           TEXT NOT NULL,
  meta_title      TEXT,
  meta_description TEXT,
  category        TEXT,
  tags            TEXT,          -- JSON array
  content         TEXT,
  word_count      INTEGER,
  wp_post_id      INTEGER,
  wp_url          TEXT,
  status          TEXT DEFAULT 'pending', -- pending|published|draft|failed
  created_at      TEXT DEFAULT (datetime('now'))
);

-- images
CREATE TABLE images (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  article_id      INTEGER REFERENCES articles(id),
  original_path   TEXT,
  webp_path       TEXT,
  wp_media_id     INTEGER,
  wp_url          TEXT,
  alt             TEXT,
  caption         TEXT,
  author          TEXT,
  source_url      TEXT,
  licence         TEXT,
  width           INTEGER,
  height          INTEGER
);

-- logs
CREATE TABLE logs (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  article_id      INTEGER REFERENCES articles(id),
  step            TEXT,          -- image_search|download|process|seo|article|wordpress|report
  status          TEXT,          -- ok|error
  message         TEXT,
  created_at      TEXT DEFAULT (datetime('now'))
);
```

---

## 6. Gestion des erreurs

- Chaque service `throw` une erreur typée : `ImageNotFoundError`, `WordPressApiError`, `ArticleGenerationError`, etc.
- L'orchestrateur catch → log en DB → affiche message clair → continue avec l'article suivant.
- Rate limits : retry exponentiel ×3, délais 1s / 2s / 4s.
- **Reprise après échec :** si le process est interrompu, la prochaine exécution détecte via DB les étapes déjà complétées et reprend là où c'était arrêté.
- **Détection des doublons :** avant de lancer, Publisher vérifie si le slug existe en DB → skip avec avertissement.

---

## 7. CLI

```bash
# Publication manuelle interactive
npm run publish
> Sujet : Intelligence Artificielle en Comptabilité
> Nombre d'articles : 3
> Statut WordPress : draft | publish

# Scheduler — démarre le daemon cron
npm run schedule
> Heure de publication quotidienne (ex: 08:00) : 08:00
```

Le scheduler lit une liste de sujets dans `schedule-config.json` (ignoré par git) et publie à l'heure configurée avec rotation des sujets.

---

## 8. Configuration (.env)

```env
# WordPress
WP_URL=https://www.easydigia.com
WP_USERNAME=
WP_APP_PASSWORD=

# Sources d'images
UNSPLASH_ACCESS_KEY=
PEXELS_API_KEY=
PIXABAY_API_KEY=

# IA
ANTHROPIC_API_KEY=

# Options
WEBP_QUALITY=85
WEBP_MAX_KB=300
IMAGES_PER_ARTICLE=3
DEFAULT_STATUS=draft          # draft | publish
CLAUDE_MODEL=claude-sonnet-5
```

---

## 9. Rapport PDF

Contenu par article :
- Titre de l'article
- URL WordPress publiée
- Image mise en avant (miniature)
- Meta title
- Meta description
- Slug

Bibliothèque : `pdfkit`. Fichier : `reports/YYYY-MM-DD-{slug}.pdf`.

---

## 10. Fonctionnalités bonus V1 incluses

| Fonctionnalité | Implémentation |
|---|---|
| Scheduler quotidien | `node-cron` + `schedule-config.json` |
| Détection doublons | Vérification slug en DB avant publication |
| Compression intelligente | Sharp : paliers de qualité jusqu'à <300 KB |
| Liens internes | ArticleGenerator : prompt inclut instruction d'ajouter liens internes |
| Table of Contents | ArticleGenerator : génère `<nav>` TOC HTML en tête d'article |
| Catégories auto | SeoGenerator : génère catégorie, WordPressPublisher crée si inexistante |
| Balises ALT | SeoGenerator : alt text pour chaque image |

---

## 11. Fonctionnalités bonus V2 (hors scope initial)

- Images OG (Open Graph) générées via Sharp
- Sitemap mis à jour après publication
- Rapport PDF étendu avec statistiques
