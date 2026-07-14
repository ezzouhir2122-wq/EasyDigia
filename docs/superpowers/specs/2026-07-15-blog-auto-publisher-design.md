# EasyDigia Blog Auto-Publisher — Document de conception

**Date :** 2026-07-15
**Projet :** Routine automatisée de création et publication d'articles SEO/GEO
**Objectif :** Générer 3 articles par semaine en draft, notifier par email pour validation manuelle.

---

## 1. Objectif

Automatiser la création d'articles de blog SEO/GEO pour easydigia.com via un Vercel Cron Job.
Chaque lundi, mercredi et vendredi à 9h (Maroc) :

1. Sélectionner le thème suivant dans la rotation
2. Claude génère un angle d'article précis et inédit
3. L'article complet FR/EN/AR est généré et sauvegardé en **draft** dans Supabase
4. Un email de notification est envoyé via Resend pour validation manuelle
5. L'administrateur valide et publie depuis `/admin/blog`

---

## 2. Architecture

```
vercel.json (crons lundi/mercredi/vendredi 08:00 UTC)
        ↓
GET /api/blog/cron
  └─ Vérification CRON_SECRET (header Authorization: Bearer)
  └─ Lecture theme_index depuis Supabase (table blog_scheduler)
  └─ Claude : génère un angle précis à partir du thème
  └─ generateArticle() : appel logique de /api/blog/generate
        └─ Génère article FR/EN/AR
        └─ INSERT dans blog_articles (published: false)
  └─ UPDATE blog_scheduler (theme_index + 1)
  └─ Resend : email de notification → /admin/blog
  └─ Retourne { ok: true, slug, title }
```

Aucun nouveau service externe. Tout réutilise l'existant :
- `lib/ai-providers.ts` → génération IA (Claude/Gemini/Grok)
- `lib/supabase.ts` → persistance
- `resend` → notifications email
- `vercel.json` → scheduling natif Vercel

---

## 3. Fichiers à créer / modifier

| Fichier | Action | Description |
|---------|--------|-------------|
| `vercel.json` | Créer | Cron schedule 3x/semaine |
| `config/blog-topics.ts` | Créer | Banque de 10 thèmes + prompt angle |
| `app/api/blog/cron/route.ts` | Créer | Handler cron principal |
| `lib/blog-generator.ts` | Extraire | Logique de génération extraite de `/api/blog/generate` |
| `lib/blog-notifier.ts` | Créer | Email Resend de notification |
| Supabase migration | Appliquer | Table `blog_scheduler` |

---

## 4. Banque de sujets

Fichier `config/blog-topics.ts` :

```ts
export const BLOG_THEMES = [
  "Automatisation des processus pour PME marocaines",
  "Agents IA et chatbots pour entreprises",
  "Intégration API et connecteurs métier",
  "Intelligence artificielle pour dirigeants",
  "Transformation digitale au Maroc",
  "Outils no-code et automatisation (Make, n8n, Zapier)",
  "IA pour le service client et WhatsApp",
  "Tableaux de bord et pilotage par la data",
  "Formation et adoption de l'IA en entreprise",
  "ROI et mesure de l'automatisation",
]
```

À chaque run, Claude reçoit le thème courant et génère un sujet d'article précis optimisé SEO/GEO (question longue traîne, angle inédit, incluant "Maroc" ou "PME" quand pertinent).

Exemple :
> Thème : "Automatisation des processus pour PME marocaines"
> → Sujet généré : "Comment automatiser ses relances clients avec Make : guide pas-à-pas pour PME marocaines"

---

## 5. Table Supabase `blog_scheduler`

```sql
CREATE TABLE blog_scheduler (
  id           INTEGER PRIMARY KEY DEFAULT 1,
  theme_index  INTEGER NOT NULL DEFAULT 0,
  last_run_at  TIMESTAMPTZ,
  last_slug    TEXT,
  last_title   TEXT,
  run_count    INTEGER NOT NULL DEFAULT 0
);

-- Ligne unique initialisée au déploiement
INSERT INTO blog_scheduler (id, theme_index, run_count)
VALUES (1, 0, 0)
ON CONFLICT (id) DO NOTHING;
```

Contrainte `id = 1` garantit une ligne unique. `theme_index` tourne modulo `BLOG_THEMES.length`.

---

## 6. Route cron `/api/blog/cron`

```ts
// Flux complet
export async function GET(req: Request) {
  // 1. Auth
  if (!isAuthorized(req)) return 401

  // 2. Lire état scheduler
  const { theme_index } = await getSchedulerState()
  const theme = BLOG_THEMES[theme_index % BLOG_THEMES.length]

  // 3. Générer angle précis via Claude
  const topic = await generateTopic(theme)

  // 4. Générer article complet (FR/EN/AR)
  const article = await generateArticle({ topic, category: "automation" })

  // 5. Sauvegarder draft en Supabase
  // (déjà fait dans generateArticle via lib/blog-generator.ts)

  // 6. Mettre à jour scheduler
  await updateSchedulerState({ theme_index: theme_index + 1, slug: article.slug, title })

  // 7. Envoyer email de notification
  await sendNotificationEmail({ title, excerpt, slug, category })

  return { ok: true, slug: article.slug }
}
```

---

## 7. Sécurité

- Header `Authorization: Bearer $CRON_SECRET` vérifié à chaque requête
- `CRON_SECRET` : variable d'environnement dans Vercel Settings (valeur UUID aléatoire)
- Vercel injecte automatiquement ce header sur les crons — les appels manuels sans le secret retournent 401
- La route est en `GET` (convention Vercel Cron)

---

## 8. Email de notification (Resend)

**Succès :**
```
De      : no-reply@easydigia.com
À       : ezzouhir2122@gmail.com
Sujet   : 📝 Nouvel article prêt — [Titre]

Corps :
- Titre : ...
- Extrait (FR) : ...
- Catégorie / Temps de lecture : ...
- Thème : ...
- [→ Valider et publier] https://easydigia.com/fr/admin/blog
```

**Échec :**
```
Sujet   : ❌ Erreur génération article — [Thème]
Corps   : Message d'erreur + thème concerné
```

---

## 9. Schedule Vercel

Fichier `vercel.json` à la racine :

```json
{
  "crons": [
    { "path": "/api/blog/cron", "schedule": "0 8 * * 1" },
    { "path": "/api/blog/cron", "schedule": "0 8 * * 3" },
    { "path": "/api/blog/cron", "schedule": "0 8 * * 5" }
  ]
}
```

`0 8 * * 1,3,5` = lundi/mercredi/vendredi à 08:00 UTC (09:00 heure du Maroc).

---

## 10. Refactoring : extraction de `lib/blog-generator.ts`

La logique de génération dans `/api/blog/generate/route.ts` est extraite dans `lib/blog-generator.ts` pour être réutilisable par le cron sans appel HTTP interne.

Interface :
```ts
export async function generateAndSaveArticle(params: {
  topic: string
  category?: string
  provider?: Provider
}): Promise<{ slug: string; title: string; excerpt: string }>
```

`/api/blog/generate/route.ts` devient un wrapper fin autour de cette fonction.

---

## 11. Variables d'environnement requises

| Variable | Existante | Usage |
|----------|-----------|-------|
| `ANTHROPIC_API_KEY` | ✅ | Génération IA |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ | Accès DB |
| `RESEND_API_KEY` | ✅ | Emails |
| `CRON_SECRET` | ❌ À créer | Auth cron |

Seule `CRON_SECRET` est nouvelle. Valeur : UUID v4 généré une fois (`crypto.randomUUID()`).

---

## 12. Gestion des erreurs

| Erreur | Comportement |
|--------|-------------|
| Génération IA échoue | Email d'erreur → retry au prochain run |
| Supabase inaccessible | Email d'erreur, theme_index non incrémenté |
| Resend échoue | Log console, ne bloque pas (article déjà sauvegardé) |
| Slug déjà existant | Suffixe timestamp ajouté (comportement actuel conservé) |

---

## 13. Périmètre V1 (hors scope)

- Images automatiques dans les articles (V2)
- Choix de l'heure de publication par l'admin (V2)
- Tableau de bord des runs de la routine (V2)
- Approbation par lien direct dans l'email (V2)
