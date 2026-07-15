# Blog Auto-Publisher Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Créer un Vercel Cron Job qui génère automatiquement 3 articles SEO/GEO par semaine, les sauvegarde en draft dans Supabase, et envoie un email de notification via Resend.

**Architecture:** Vercel Cron déclenche `GET /api/blog/cron` (lundi/mercredi/vendredi 08h UTC). La route lit le thème suivant dans `config/blog-topics.ts`, demande à Claude de générer un angle précis, appelle `lib/blog-generator.ts` (logique extraite de `/api/blog/generate`) pour créer l'article FR/EN/AR, met à jour la table `blog_scheduler` dans Supabase, et notifie par email via `lib/blog-notifier.ts`.

**Tech Stack:** Next.js 15 App Router, Supabase (service role), Resend, `@anthropic-ai/sdk` (via `lib/ai-providers.ts` existant), Vitest.

## Global Constraints

- Tous les fichiers en TypeScript strict — zéro `any` implicite
- Réutiliser `lib/ai-providers.ts` (generateWithAI, detectProvider) sans modification
- Réutiliser `lib/supabase.ts` (getSupabaseAdmin) sans modification
- Réutiliser le pattern Resend de `app/api/lead/route.ts` pour les emails
- Email `from`: `"EasyDigia <noreply@easydigia.com>"`, `to`: `process.env.RESEND_TO_EMAIL ?? "ezzouhir2122@gmail.com"`
- Articles sauvegardés avec `published: false` — jamais auto-publiés
- Le cron ne bloque jamais sur l'email : une erreur Resend est loguée mais ne renvoie pas 500
- `CRON_SECRET` doit être vérifié avant toute action
- Tests dans des fichiers `*.test.ts` à la racine ou dans `tests/`

---

## Carte des fichiers

| Fichier | Action | Responsabilité |
|---------|--------|----------------|
| `config/blog-topics.ts` | Créer | Banque de 10 thèmes + prompt génération d'angle |
| `lib/blog-generator.ts` | Créer | Logique generateAndSaveArticle (extraite de generate/route.ts) |
| `lib/blog-notifier.ts` | Créer | Emails Resend succès + erreur |
| `app/api/blog/generate/route.ts` | Modifier | Wrapper fin autour de generateAndSaveArticle |
| `app/api/blog/cron/route.ts` | Créer | Handler cron : auth, rotation, génération, notification |
| `vercel.json` | Modifier | Ajouter 3 entrées cron |
| Supabase migration | Appliquer | Table `blog_scheduler` via MCP |
| `tests/blog-generator.test.ts` | Créer | Tests unitaires generateAndSaveArticle |
| `tests/blog-notifier.test.ts` | Créer | Tests unitaires emails Resend |
| `tests/blog-cron.test.ts` | Créer | Tests unitaires handler cron |

---

## Task 1 : Supabase migration + config/blog-topics.ts

**Files:**
- Créer via MCP Supabase : table `blog_scheduler`
- Create: `config/blog-topics.ts`

**Interfaces:**
- Consumes: rien
- Produces:
  - `BLOG_THEMES: readonly string[]` (10 éléments)
  - `TOPIC_GENERATION_PROMPT(theme: string): string`
  - Table Supabase `blog_scheduler` avec colonnes `id, theme_index, last_run_at, last_slug, last_title, run_count`

- [ ] **Step 1 : Appliquer la migration Supabase via MCP**

Utiliser l'outil MCP `mcp__claude_ai_Supabase__apply_migration` avec ce SQL :

```sql
CREATE TABLE IF NOT EXISTS blog_scheduler (
  id           INTEGER PRIMARY KEY DEFAULT 1,
  theme_index  INTEGER NOT NULL DEFAULT 0,
  last_run_at  TIMESTAMPTZ,
  last_slug    TEXT,
  last_title   TEXT,
  run_count    INTEGER NOT NULL DEFAULT 0
);

-- Ligne unique initialisée (contrainte id=1 garantit une seule ligne)
INSERT INTO blog_scheduler (id, theme_index, run_count)
VALUES (1, 0, 0)
ON CONFLICT (id) DO NOTHING;
```

Résultat attendu : `{ "ok": true }` sans erreur.

- [ ] **Step 2 : Vérifier la table via MCP**

Appeler `mcp__claude_ai_Supabase__execute_sql` :
```sql
SELECT * FROM blog_scheduler;
```
Résultat attendu : 1 ligne avec `id=1, theme_index=0, run_count=0`.

- [ ] **Step 3 : Créer `config/blog-topics.ts`**

```typescript
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
] as const;

export type BlogTheme = (typeof BLOG_THEMES)[number];

export function topicGenerationPrompt(theme: string): string {
  return `Tu es un expert SEO francophone spécialisé en IA et automatisation pour PME.
Génère UN sujet d'article de blog précis, optimisé pour les moteurs de recherche et les IA (GEO/SEO),
basé sur ce thème : "${theme}"

Règles :
- Sujet sous forme de question ou titre actionnable (ex: "Comment automatiser ses relances clients avec Make")
- Inclure "Maroc" ou "PME" si pertinent naturellement
- Longue traîne : 6 à 12 mots
- Inédit, différent des angles évidents
- En français uniquement

Réponds UNIQUEMENT avec le sujet, sans guillemets, sans explication.`;
}
```

- [ ] **Step 4 : Commit**

```bash
git add config/blog-topics.ts
git commit -m "feat(cron): add blog-topics config and blog_scheduler Supabase table"
```

---

## Task 2 : lib/blog-generator.ts + refactor generate/route.ts

**Files:**
- Create: `lib/blog-generator.ts`
- Create: `tests/blog-generator.test.ts`
- Modify: `app/api/blog/generate/route.ts`

**Interfaces:**
- Consumes:
  - `generateWithAI(prompt: string, provider: Provider): Promise<string>` depuis `lib/ai-providers.ts`
  - `detectProvider(): Provider` depuis `lib/ai-providers.ts`
  - `getSupabaseAdmin()` depuis `lib/supabase.ts`
- Produces:
  - `generateAndSaveArticle(params: { topic: string; category?: string; provider?: Provider }): Promise<GeneratedArticleResult>`
  - `interface GeneratedArticleResult { id: number; slug: string; title: string; excerpt: string }`

- [ ] **Step 1 : Écrire le test qui échoue**

Créer `tests/blog-generator.test.ts` :

```typescript
import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock des dépendances externes
vi.mock("@/lib/ai-providers", () => ({
  generateWithAI: vi.fn(),
  detectProvider: vi.fn().mockReturnValue("claude"),
}));

vi.mock("@/lib/supabase", () => ({
  getSupabaseAdmin: vi.fn(),
}));

const MOCK_AI_RESPONSE = JSON.stringify({
  slug: "automatiser-relances-clients-pme",
  read_min: 6,
  fr: {
    title: "Comment automatiser ses relances clients dans une PME marocaine",
    tag: "Automatisation",
    excerpt: "Découvrez comment automatiser vos relances clients et récupérer 3h par semaine.",
    body: "<h2>Introduction</h2><p>L'automatisation des relances clients est un levier puissant.</p>",
  },
  en: {
    title: "How to automate client follow-ups in a Moroccan SME",
    tag: "Automation",
    excerpt: "Learn how to automate client follow-ups and save 3 hours per week.",
    body: "<h2>Introduction</h2><p>Automating client follow-ups is a powerful lever.</p>",
  },
  ar: {
    title: "كيفية أتمتة متابعة العملاء في المؤسسة الصغيرة المغربية",
    tag: "أتمتة",
    excerpt: "اكتشف كيفية أتمتة متابعة عملائك وتوفير 3 ساعات أسبوعياً.",
    body: "<h2>مقدمة</h2><p>أتمتة متابعة العملاء رافعة قوية.</p>",
  },
});

describe("generateAndSaveArticle", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("génère et sauvegarde un article, retourne id/slug/title/excerpt", async () => {
    const { generateWithAI } = await import("@/lib/ai-providers");
    const { getSupabaseAdmin } = await import("@/lib/supabase");

    vi.mocked(generateWithAI).mockResolvedValue(MOCK_AI_RESPONSE);
    vi.mocked(getSupabaseAdmin).mockReturnValue({
      from: vi.fn().mockReturnValue({
        insert: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: { id: 42, slug: "automatiser-relances-clients-pme-abc123" },
              error: null,
            }),
          }),
        }),
      }),
    } as any);

    const { generateAndSaveArticle } = await import("@/lib/blog-generator");
    const result = await generateAndSaveArticle({ topic: "Automatiser les relances clients PME" });

    expect(result.id).toBe(42);
    expect(result.slug).toContain("automatiser-relances-clients-pme");
    expect(result.title).toBe("Comment automatiser ses relances clients dans une PME marocaine");
    expect(result.excerpt).toBe("Découvrez comment automatiser vos relances clients et récupérer 3h par semaine.");
  });

  it("utilise le provider fourni en paramètre", async () => {
    const { generateWithAI } = await import("@/lib/ai-providers");
    const { getSupabaseAdmin } = await import("@/lib/supabase");

    vi.mocked(generateWithAI).mockResolvedValue(MOCK_AI_RESPONSE);
    vi.mocked(getSupabaseAdmin).mockReturnValue({
      from: vi.fn().mockReturnValue({
        insert: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: { id: 1, slug: "test-slug-abc" },
              error: null,
            }),
          }),
        }),
      }),
    } as any);

    const { generateAndSaveArticle } = await import("@/lib/blog-generator");
    await generateAndSaveArticle({ topic: "Test", provider: "gemini" });

    expect(vi.mocked(generateWithAI)).toHaveBeenCalledWith(expect.any(String), "gemini");
  });

  it("lève une erreur si Supabase échoue", async () => {
    const { generateWithAI } = await import("@/lib/ai-providers");
    const { getSupabaseAdmin } = await import("@/lib/supabase");

    vi.mocked(generateWithAI).mockResolvedValue(MOCK_AI_RESPONSE);
    vi.mocked(getSupabaseAdmin).mockReturnValue({
      from: vi.fn().mockReturnValue({
        insert: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: null,
              error: { message: "duplicate key" },
            }),
          }),
        }),
      }),
    } as any);

    const { generateAndSaveArticle } = await import("@/lib/blog-generator");
    await expect(generateAndSaveArticle({ topic: "Test" })).rejects.toThrow("duplicate key");
  });
});
```

- [ ] **Step 2 : Lancer le test pour vérifier qu'il échoue**

```bash
npm test -- tests/blog-generator.test.ts
```

Résultat attendu : FAIL — `Cannot find module '@/lib/blog-generator'`

- [ ] **Step 3 : Créer `lib/blog-generator.ts`**

```typescript
import { generateWithAI, detectProvider, type Provider } from "@/lib/ai-providers";
import { getSupabaseAdmin } from "@/lib/supabase";

export interface GeneratedArticleResult {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function buildArticlePrompt(topic: string): string {
  return `Tu es un rédacteur expert pour EasyDigia, une agence digitale spécialisée en IA et automatisation basée à Marrakech, Maroc.

Génère un article de blog professionnel sur le sujet : "${topic}"

Réponds UNIQUEMENT avec un objet JSON valide (pas de markdown, pas d'explication, pas de \`\`\`json) avec cette structure exacte :
{
  "slug": "slug-url-en-francais-avec-tirets",
  "read_min": 6,
  "fr": {
    "title": "Titre accrocheur en français",
    "tag": "Catégorie courte (ex: IA & Agents, Automatisation, Stratégie digitale)",
    "excerpt": "Résumé en 1-2 phrases percutantes (max 180 caractères)",
    "body": "<h2>Titre section</h2><p>Paragraphe...</p><h2>...</h2><p>...</p>"
  },
  "en": {
    "title": "Catchy English title",
    "tag": "Short category (e.g. AI & Agents, Automation, Digital strategy)",
    "excerpt": "1-2 sentence summary (max 180 chars)",
    "body": "<h2>Section title</h2><p>Paragraph...</p>"
  },
  "ar": {
    "title": "عنوان جذاب بالعربية",
    "tag": "فئة قصيرة",
    "excerpt": "ملخص بجملة أو جملتين (أقل من 180 حرف)",
    "body": "<h2>عنوان القسم</h2><p>فقرة...</p>"
  }
}

Règles impératives :
- body : 4 à 6 sections h2, 3-4 paragraphes chacune, ~500 mots par langue
- HTML uniquement : h2, p, strong, ul, li (pas de h1, div, script, style)
- Mention naturelle d'EasyDigia dans la conclusion avec invitation à contacter
- Ton professionnel mais accessible, adapté aux dirigeants de PME
- JSON strictement valide, sans échappements inutiles`;
}

export async function generateAndSaveArticle(params: {
  topic: string;
  category?: string;
  provider?: Provider;
}): Promise<GeneratedArticleResult> {
  const { topic, category = "ai", provider } = params;

  const selectedProvider = provider ?? detectProvider();
  const raw = await generateWithAI(buildArticlePrompt(topic), selectedProvider);

  const jsonStr = raw.includes("{")
    ? raw.slice(raw.indexOf("{"), raw.lastIndexOf("}") + 1)
    : raw;
  const article = JSON.parse(jsonStr);

  const baseSlug = article.slug || slugify(topic);
  const slug = `${baseSlug}-${Date.now().toString(36)}`;

  const record = {
    slug,
    category,
    read_min: article.read_min ?? 6,
    published: false,
    content: {
      fr: article.fr,
      en: article.en,
      ar: article.ar,
    },
  };

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("blog_articles")
    .insert(record)
    .select()
    .single();

  if (error) throw new Error(error.message ?? JSON.stringify(error));

  return {
    id: data.id,
    slug: data.slug,
    title: article.fr?.title ?? topic,
    excerpt: article.fr?.excerpt ?? "",
  };
}
```

- [ ] **Step 4 : Lancer les tests**

```bash
npm test -- tests/blog-generator.test.ts
```

Résultat attendu : 3 PASS

- [ ] **Step 5 : Refactorer `app/api/blog/generate/route.ts`**

Remplacer le contenu par :

```typescript
import { NextResponse } from "next/server";
import { detectProvider, type Provider } from "@/lib/ai-providers";
import { generateAndSaveArticle } from "@/lib/blog-generator";

export async function POST(req: Request) {
  let body: { topic?: string; category?: string; provider?: Provider };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const { topic, category = "ai", provider } = body;
  if (!topic?.trim()) {
    return NextResponse.json({ ok: false, error: "topic requis" }, { status: 400 });
  }

  let selectedProvider: Provider;
  try {
    selectedProvider = provider ?? detectProvider();
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 });
  }

  try {
    const result = await generateAndSaveArticle({ topic, category, provider: selectedProvider });
    return NextResponse.json({ ok: true, article: { id: result.id, slug: result.slug }, provider: selectedProvider });
  } catch (e) {
    console.error(`blog generate error [${selectedProvider}]`, e);
    const msg = e instanceof Error ? e.message : JSON.stringify(e);
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
```

- [ ] **Step 6 : Vérifier que l'admin blog fonctionne toujours**

Lancer `npm run build` — s'assurer que ça compile sans erreur.

```bash
npm run build
```

Résultat attendu : build réussi, aucune erreur TypeScript.

- [ ] **Step 7 : Commit**

```bash
git add lib/blog-generator.ts tests/blog-generator.test.ts app/api/blog/generate/route.ts
git commit -m "feat(cron): extract generateAndSaveArticle into lib/blog-generator"
```

---

## Task 3 : lib/blog-notifier.ts

**Files:**
- Create: `lib/blog-notifier.ts`
- Create: `tests/blog-notifier.test.ts`

**Interfaces:**
- Consumes: `resend` npm package (déjà installé), `RESEND_API_KEY` env var, `RESEND_TO_EMAIL` env var
- Produces:
  - `sendArticleReadyEmail(params: { title: string; excerpt: string; slug: string; category: string }): Promise<void>`
  - `sendArticleErrorEmail(params: { theme: string; error: string }): Promise<void>`

- [ ] **Step 1 : Écrire le test qui échoue**

Créer `tests/blog-notifier.test.ts` :

```typescript
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

vi.mock("resend", () => ({
  Resend: vi.fn().mockImplementation(() => ({
    emails: {
      send: vi.fn().mockResolvedValue({ id: "mock-email-id" }),
    },
  })),
}));

describe("blog-notifier", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv, RESEND_API_KEY: "re_test_key" };
    vi.resetAllMocks();
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it("sendArticleReadyEmail appelle Resend avec le bon sujet", async () => {
    const { Resend } = await import("resend");
    const { sendArticleReadyEmail } = await import("@/lib/blog-notifier");

    await sendArticleReadyEmail({
      title: "Comment automatiser ses relances",
      excerpt: "Découvrez comment...",
      slug: "automatiser-relances-abc",
      category: "Automatisation",
    });

    const mockInstance = vi.mocked(Resend).mock.results[0].value;
    expect(mockInstance.emails.send).toHaveBeenCalledWith(
      expect.objectContaining({
        subject: expect.stringContaining("Comment automatiser ses relances"),
        from: "EasyDigia <noreply@easydigia.com>",
      })
    );
  });

  it("sendArticleReadyEmail inclut le lien admin dans le HTML", async () => {
    const { Resend } = await import("resend");
    const { sendArticleReadyEmail } = await import("@/lib/blog-notifier");

    await sendArticleReadyEmail({
      title: "Test",
      excerpt: "Extrait test",
      slug: "test-slug",
      category: "IA",
    });

    const mockInstance = vi.mocked(Resend).mock.results[0].value;
    const callArg = mockInstance.emails.send.mock.calls[0][0];
    expect(callArg.html).toContain("easydigia.com/fr/admin/blog");
  });

  it("sendArticleErrorEmail envoie un email avec ❌ dans le sujet", async () => {
    const { Resend } = await import("resend");
    const { sendArticleErrorEmail } = await import("@/lib/blog-notifier");

    await sendArticleErrorEmail({
      theme: "Automatisation PME",
      error: "API timeout",
    });

    const mockInstance = vi.mocked(Resend).mock.results[0].value;
    expect(mockInstance.emails.send).toHaveBeenCalledWith(
      expect.objectContaining({
        subject: expect.stringContaining("❌"),
      })
    );
  });

  it("ne lève pas d'erreur si RESEND_API_KEY est absent", async () => {
    delete process.env.RESEND_API_KEY;
    const { sendArticleReadyEmail } = await import("@/lib/blog-notifier");

    await expect(
      sendArticleReadyEmail({ title: "T", excerpt: "E", slug: "s", category: "c" })
    ).resolves.toBeUndefined();
  });
});
```

- [ ] **Step 2 : Lancer le test pour vérifier qu'il échoue**

```bash
npm test -- tests/blog-notifier.test.ts
```

Résultat attendu : FAIL — `Cannot find module '@/lib/blog-notifier'`

- [ ] **Step 3 : Créer `lib/blog-notifier.ts`**

```typescript
import { Resend } from "resend";

const FROM = "EasyDigia <noreply@easydigia.com>";
const ADMIN_URL = "https://easydigia.com/fr/admin/blog";

function getTo(): string {
  return process.env.RESEND_TO_EMAIL ?? "ezzouhir2122@gmail.com";
}

function getResend(): Resend | null {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.warn("[blog-notifier] RESEND_API_KEY absent — email non envoyé");
    return null;
  }
  return new Resend(key);
}

export async function sendArticleReadyEmail(params: {
  title: string;
  excerpt: string;
  slug: string;
  category: string;
}): Promise<void> {
  const resend = getResend();
  if (!resend) return;

  await resend.emails.send({
    from: FROM,
    to: getTo(),
    subject: `📝 Nouvel article prêt — ${params.title}`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#0A0B10;color:#F5F6FA;padding:32px;border-radius:12px">
        <h2 style="color:#8FD400;margin:0 0 24px">Nouvel article généré ✅</h2>
        <table style="width:100%;border-collapse:collapse">
          <tr>
            <td style="padding:8px 0;color:#9BA1B0;width:120px">Titre</td>
            <td style="padding:8px 0;font-weight:600">${params.title}</td>
          </tr>
          <tr>
            <td style="padding:8px 0;color:#9BA1B0">Catégorie</td>
            <td style="padding:8px 0">${params.category}</td>
          </tr>
          <tr>
            <td style="padding:8px 0;color:#9BA1B0">Extrait</td>
            <td style="padding:8px 0;color:#9BA1B0">${params.excerpt}</td>
          </tr>
        </table>
        <div style="margin-top:28px;text-align:center">
          <a href="${ADMIN_URL}"
             style="display:inline-block;background:linear-gradient(135deg,#8FD400,#C6FF00);color:#0A0B10;font-weight:700;padding:14px 32px;border-radius:10px;text-decoration:none;font-size:15px">
            → Valider et publier
          </a>
        </div>
        <p style="margin-top:24px;font-size:12px;color:#9BA1B0;text-align:center">
          Slug : <code>${params.slug}</code>
        </p>
      </div>
    `,
  });
}

export async function sendArticleErrorEmail(params: {
  theme: string;
  error: string;
}): Promise<void> {
  const resend = getResend();
  if (!resend) return;

  await resend.emails.send({
    from: FROM,
    to: getTo(),
    subject: `❌ Erreur génération article — ${params.theme}`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#0A0B10;color:#F5F6FA;padding:32px;border-radius:12px">
        <h2 style="color:#FF4444;margin:0 0 24px">Erreur de génération ❌</h2>
        <table style="width:100%;border-collapse:collapse">
          <tr>
            <td style="padding:8px 0;color:#9BA1B0;width:120px">Thème</td>
            <td style="padding:8px 0;font-weight:600">${params.theme}</td>
          </tr>
        </table>
        <div style="margin-top:16px;padding:16px;background:#12141C;border-radius:8px;border-left:3px solid #FF4444">
          <p style="margin:0;color:#9BA1B0;font-size:12px;text-transform:uppercase;letter-spacing:0.08em">Erreur</p>
          <p style="margin:8px 0 0;font-family:monospace;font-size:13px;color:#FF8888">${params.error}</p>
        </div>
        <p style="margin-top:16px;font-size:13px;color:#9BA1B0">
          Le compteur de thème n'a pas été incrémenté. Le prochain run reprendra sur ce thème.
        </p>
      </div>
    `,
  });
}
```

- [ ] **Step 4 : Lancer les tests**

```bash
npm test -- tests/blog-notifier.test.ts
```

Résultat attendu : 4 PASS

- [ ] **Step 5 : Commit**

```bash
git add lib/blog-notifier.ts tests/blog-notifier.test.ts
git commit -m "feat(cron): add blog-notifier (Resend emails success + error)"
```

---

## Task 4 : app/api/blog/cron/route.ts

**Files:**
- Create: `app/api/blog/cron/route.ts`
- Create: `tests/blog-cron.test.ts`

**Interfaces:**
- Consumes:
  - `BLOG_THEMES: readonly string[]` et `topicGenerationPrompt(theme: string): string` depuis `@/config/blog-topics`
  - `generateAndSaveArticle(params): Promise<GeneratedArticleResult>` depuis `@/lib/blog-generator`
  - `sendArticleReadyEmail(params): Promise<void>` et `sendArticleErrorEmail(params): Promise<void>` depuis `@/lib/blog-notifier`
  - `generateWithAI(prompt, provider): Promise<string>` et `detectProvider(): Provider` depuis `@/lib/ai-providers`
  - `getSupabaseAdmin()` depuis `@/lib/supabase`
  - `CRON_SECRET` env var
- Produces: `GET /api/blog/cron` → `{ ok: true, slug, title }` ou `{ ok: false, error }` avec status 401/500

- [ ] **Step 1 : Écrire le test qui échoue**

Créer `tests/blog-cron.test.ts` :

```typescript
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

vi.mock("@/config/blog-topics", () => ({
  BLOG_THEMES: ["Automatisation PME", "Agents IA"],
  topicGenerationPrompt: vi.fn().mockReturnValue("génère un sujet sur Automatisation PME"),
}));

vi.mock("@/lib/ai-providers", () => ({
  generateWithAI: vi.fn().mockResolvedValue("Comment automatiser ses relances avec Make"),
  detectProvider: vi.fn().mockReturnValue("claude"),
}));

vi.mock("@/lib/blog-generator", () => ({
  generateAndSaveArticle: vi.fn().mockResolvedValue({
    id: 42,
    slug: "automatiser-relances-make-abc123",
    title: "Comment automatiser ses relances avec Make",
    excerpt: "Découvrez comment...",
  }),
}));

vi.mock("@/lib/blog-notifier", () => ({
  sendArticleReadyEmail: vi.fn().mockResolvedValue(undefined),
  sendArticleErrorEmail: vi.fn().mockResolvedValue(undefined),
}));

vi.mock("@/lib/supabase", () => ({
  getSupabaseAdmin: vi.fn(),
}));

function makeRequest(authHeader?: string): Request {
  return new Request("https://easydigia.com/api/blog/cron", {
    headers: authHeader ? { authorization: authHeader } : {},
  });
}

describe("GET /api/blog/cron", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv, CRON_SECRET: "test-secret-123" };

    const { getSupabaseAdmin } = require("@/lib/supabase");
    vi.mocked(getSupabaseAdmin).mockReturnValue({
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: { theme_index: 0, run_count: 5 },
              error: null,
            }),
          }),
        }),
        update: vi.fn().mockReturnValue({
          eq: vi.fn().mockResolvedValue({ error: null }),
        }),
      }),
    });
  });

  afterEach(() => {
    process.env = originalEnv;
    vi.resetAllMocks();
  });

  it("retourne 401 si Authorization manquant", async () => {
    const { GET } = await import("@/app/api/blog/cron/route");
    const res = await GET(makeRequest());
    expect(res.status).toBe(401);
    const body = await res.json();
    expect(body.error).toBe("unauthorized");
  });

  it("retourne 401 si secret incorrect", async () => {
    const { GET } = await import("@/app/api/blog/cron/route");
    const res = await GET(makeRequest("Bearer wrong-secret"));
    expect(res.status).toBe(401);
  });

  it("retourne 200 avec slug et title si tout réussit", async () => {
    const { GET } = await import("@/app/api/blog/cron/route");
    const res = await GET(makeRequest("Bearer test-secret-123"));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.ok).toBe(true);
    expect(body.slug).toBe("automatiser-relances-make-abc123");
    expect(body.title).toBe("Comment automatiser ses relances avec Make");
  });

  it("appelle sendArticleReadyEmail après génération réussie", async () => {
    const { sendArticleReadyEmail } = await import("@/lib/blog-notifier");
    const { GET } = await import("@/app/api/blog/cron/route");

    await GET(makeRequest("Bearer test-secret-123"));

    expect(vi.mocked(sendArticleReadyEmail)).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "Comment automatiser ses relances avec Make",
        slug: "automatiser-relances-make-abc123",
      })
    );
  });

  it("retourne 500 et envoie email d'erreur si generateAndSaveArticle échoue", async () => {
    const { generateAndSaveArticle } = await import("@/lib/blog-generator");
    const { sendArticleErrorEmail } = await import("@/lib/blog-notifier");

    vi.mocked(generateAndSaveArticle).mockRejectedValueOnce(new Error("AI timeout"));

    const { GET } = await import("@/app/api/blog/cron/route");
    const res = await GET(makeRequest("Bearer test-secret-123"));

    expect(res.status).toBe(500);
    expect(vi.mocked(sendArticleErrorEmail)).toHaveBeenCalledWith(
      expect.objectContaining({ error: "AI timeout" })
    );
  });
});
```

- [ ] **Step 2 : Lancer le test pour vérifier qu'il échoue**

```bash
npm test -- tests/blog-cron.test.ts
```

Résultat attendu : FAIL — `Cannot find module '@/app/api/blog/cron/route'`

- [ ] **Step 3 : Créer `app/api/blog/cron/route.ts`**

```typescript
import { NextResponse } from "next/server";
import { BLOG_THEMES, topicGenerationPrompt } from "@/config/blog-topics";
import { generateAndSaveArticle } from "@/lib/blog-generator";
import { sendArticleReadyEmail, sendArticleErrorEmail } from "@/lib/blog-notifier";
import { generateWithAI, detectProvider } from "@/lib/ai-providers";
import { getSupabaseAdmin } from "@/lib/supabase";

function isAuthorized(req: Request): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  return req.headers.get("authorization") === `Bearer ${secret}`;
}

async function getSchedulerState(): Promise<{ theme_index: number; run_count: number }> {
  const supabase = getSupabaseAdmin();
  const { data } = await supabase
    .from("blog_scheduler")
    .select("theme_index, run_count")
    .eq("id", 1)
    .single();
  return { theme_index: data?.theme_index ?? 0, run_count: data?.run_count ?? 0 };
}

async function updateSchedulerState(params: {
  theme_index: number;
  run_count: number;
  slug: string;
  title: string;
}): Promise<void> {
  const supabase = getSupabaseAdmin();
  await supabase
    .from("blog_scheduler")
    .update({
      theme_index: params.theme_index,
      run_count: params.run_count + 1,
      last_run_at: new Date().toISOString(),
      last_slug: params.slug,
      last_title: params.title,
    })
    .eq("id", 1);
}

export async function GET(req: Request): Promise<NextResponse> {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  let currentTheme = "";

  try {
    // 1. Lire l'état du scheduler
    const { theme_index, run_count } = await getSchedulerState();
    const nextIndex = theme_index % BLOG_THEMES.length;
    currentTheme = BLOG_THEMES[nextIndex];

    // 2. Générer un angle précis via IA
    const provider = detectProvider();
    const topicRaw = await generateWithAI(topicGenerationPrompt(currentTheme), provider);
    const topic = topicRaw.trim();

    // 3. Générer et sauvegarder l'article (draft)
    const article = await generateAndSaveArticle({ topic, category: "ai", provider });

    // 4. Mettre à jour le scheduler
    await updateSchedulerState({
      theme_index: theme_index + 1,
      run_count,
      slug: article.slug,
      title: article.title,
    });

    // 5. Notifier par email (non bloquant sur erreur)
    await sendArticleReadyEmail({
      title: article.title,
      excerpt: article.excerpt,
      slug: article.slug,
      category: "ai",
    }).catch((e) => console.error("[cron] sendArticleReadyEmail failed:", e));

    return NextResponse.json({ ok: true, slug: article.slug, title: article.title });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("[cron] error:", msg);

    // Envoyer email d'erreur (non bloquant)
    await sendArticleErrorEmail({ theme: currentTheme, error: msg }).catch(() => {});

    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
```

- [ ] **Step 4 : Lancer les tests**

```bash
npm test -- tests/blog-cron.test.ts
```

Résultat attendu : 5 PASS

- [ ] **Step 5 : Lancer tous les tests du projet**

```bash
npm test
```

Résultat attendu : tous les tests passent.

- [ ] **Step 6 : Commit**

```bash
git add app/api/blog/cron/route.ts tests/blog-cron.test.ts
git commit -m "feat(cron): add /api/blog/cron route with auth, rotation, generation, notification"
```

---

## Task 5 : vercel.json + CRON_SECRET + déploiement

**Files:**
- Modify: `vercel.json`

**Interfaces:**
- Consumes: `CRON_SECRET` env var dans Vercel Settings
- Produces: cron actif lundi/mercredi/vendredi à 09h00 heure du Maroc (08:00 UTC)

- [ ] **Step 1 : Modifier `vercel.json`**

Remplacer le contenu actuel (`{"framework":"nextjs"}`) par :

```json
{
  "framework": "nextjs",
  "crons": [
    { "path": "/api/blog/cron", "schedule": "0 8 * * 1" },
    { "path": "/api/blog/cron", "schedule": "0 8 * * 3" },
    { "path": "/api/blog/cron", "schedule": "0 8 * * 5" }
  ]
}
```

- [ ] **Step 2 : Générer CRON_SECRET**

Dans le terminal, générer une valeur aléatoire :

```bash
node -e "console.log(require('crypto').randomUUID())"
```

Copier la valeur (ex: `f47ac10b-58cc-4372-a567-0e02b2c3d479`).

- [ ] **Step 3 : Ajouter CRON_SECRET dans Vercel**

Aller dans **Vercel Dashboard → easydigia → Settings → Environment Variables**.
Ajouter :
- Key: `CRON_SECRET`
- Value: la valeur générée à l'étape précédente
- Environments: Production, Preview

- [ ] **Step 4 : Vérifier le build**

```bash
npm run build
```

Résultat attendu : build réussi, la route `/api/blog/cron` apparaît dans la liste des routes.

- [ ] **Step 5 : Commit et déploiement**

```bash
git add vercel.json
git commit -m "feat(cron): add Vercel cron schedule (lundi/mercredi/vendredi 08:00 UTC)"
```

Déployer :

```bash
vercel --prod --yes
```

- [ ] **Step 6 : Vérifier les crons dans Vercel**

Aller dans **Vercel Dashboard → easydigia → Cron Jobs**.
Vérifier que 3 crons apparaissent avec les horaires `0 8 * * 1`, `0 8 * * 3`, `0 8 * * 5`.

- [ ] **Step 7 : Test manuel du cron**

Depuis le terminal (remplacer `<CRON_SECRET>` par la valeur réelle) :

```bash
curl -X GET https://easydigia.com/api/blog/cron \
  -H "Authorization: Bearer <CRON_SECRET>" \
  -H "Content-Type: application/json"
```

Résultat attendu :
```json
{ "ok": true, "slug": "...", "title": "..." }
```

Vérifier dans Supabase que l'article est bien en draft (`published: false`).
Vérifier que l'email de notification est bien reçu sur `ezzouhir2122@gmail.com`.

---

## Récap des variables d'environnement

| Variable | Statut | Où l'ajouter |
|----------|--------|--------------|
| `ANTHROPIC_API_KEY` | ✅ Existante | — |
| `SUPABASE_URL` | ✅ Existante | — |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ Existante | — |
| `RESEND_API_KEY` | ✅ Existante | — |
| `RESEND_TO_EMAIL` | ✅ Existante | — |
| `CRON_SECRET` | ❌ À créer | Vercel Settings |
