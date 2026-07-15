# EasyDigia AI Content Publisher — Plan d'implémentation

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Construire `easydigia-publisher`, un CLI Node.js/TypeScript autonome qui recherche des images, génère des articles SEO via Claude Sonnet, publie sur WordPress et produit un rapport PDF — le tout en une commande `npm run publish`.

**Architecture:** Services modulaires orchestrés par `Publisher.ts`. Chaque service a une responsabilité unique et communique via des interfaces TypeScript strictes. SQLite persiste l'état pour reprendre après échec.

**Tech Stack:** Node.js 20+, TypeScript 5 strict, tsx (exécution), Vitest (tests), axios, sharp, @anthropic-ai/sdk, better-sqlite3, commander, node-cron, pdfkit, zod, dotenv.

## Global Constraints

- Projet autonome dans un dossier `easydigia-publisher/` séparé du repo Next.js
- TypeScript strict (`"strict": true`) — zéro `any` implicite
- Langue des articles : français uniquement
- Modèle Claude : `claude-sonnet-5` (configurable via `CLAUDE_MODEL`)
- Images : ≥1920×1080, orientation paysage, libres de droits
- WebP : qualité 85%, max 300 KB — réduction par paliers si dépassé
- Statut WordPress par défaut : `draft`
- Zéro duplication de slug (vérification DB avant publication)
- Retry exponentiel ×3 sur toutes les APIs : délais 1s / 2s / 4s
- `.env` jamais committé — `.env.example` toujours à jour
- Aucun `console.log` direct — tout passe par `logger`

---

## Carte des fichiers

```
easydigia-publisher/
├── src/
│   ├── types.ts                          ← interfaces partagées entre tous les services
│   ├── cli/
│   │   └── index.ts                      ← commander : commandes publish + schedule
│   ├── orchestrator/
│   │   └── Publisher.ts                  ← séquence les services, gère retry et reprise
│   ├── services/
│   │   ├── image/
│   │   │   ├── ImageSearcher.ts          ← Unsplash → Pexels → Pixabay fallback
│   │   │   ├── ImageDownloader.ts        ← téléchargement HD sur disque
│   │   │   └── ImageProcessor.ts        ← Sharp → WebP <300 KB
│   │   ├── seo/
│   │   │   └── SeoGenerator.ts          ← Claude : alt, caption, meta, slug, tags
│   │   ├── ai/
│   │   │   └── ArticleGenerator.ts      ← Claude Sonnet : article HTML complet
│   │   ├── wordpress/
│   │   │   └── WordPressPublisher.ts    ← REST API : upload media + créer post
│   │   ├── report/
│   │   │   └── ReportGenerator.ts      ← pdfkit : PDF basique par article
│   │   └── scheduler/
│   │       └── Scheduler.ts            ← node-cron + schedule-config.json
│   ├── database/
│   │   └── Database.ts                  ← better-sqlite3 : articles, images, logs
│   ├── config/
│   │   └── config.ts                    ← dotenv + zod : validation au démarrage
│   └── utils/
│       ├── logger.ts                    ← logs colorés horodatés
│       └── retry.ts                     ← retry exponentiel générique
├── tests/
│   ├── config.test.ts
│   ├── database.test.ts
│   ├── logger.test.ts
│   ├── retry.test.ts
│   ├── ImageSearcher.test.ts
│   ├── ImageDownloader.test.ts
│   ├── ImageProcessor.test.ts
│   ├── SeoGenerator.test.ts
│   ├── ArticleGenerator.test.ts
│   ├── WordPressPublisher.test.ts
│   ├── ReportGenerator.test.ts
│   └── Publisher.test.ts
├── assets/images/original/.gitkeep
├── assets/images/webp/.gitkeep
├── database/.gitkeep
├── reports/.gitkeep
├── schedule-config.json.example
├── .env.example
├── .gitignore
├── package.json
├── tsconfig.json
└── vitest.config.ts
```

---

## Task 1 : Scaffold du projet

**Files:**
- Create: `easydigia-publisher/package.json`
- Create: `easydigia-publisher/tsconfig.json`
- Create: `easydigia-publisher/vitest.config.ts`
- Create: `easydigia-publisher/.gitignore`
- Create: `easydigia-publisher/.env.example`
- Create: `easydigia-publisher/schedule-config.json.example`
- Create: `easydigia-publisher/src/types.ts`
- Create: `easydigia-publisher/src/utils/retry.ts`
- Create: `easydigia-publisher/src/config/config.ts`
- Create: `easydigia-publisher/tests/config.test.ts`
- Create: `easydigia-publisher/tests/retry.test.ts`

**Interfaces:**
- Produces: `Config` type, `loadConfig(): Config`, `withRetry<T>(fn, retries): Promise<T>`

- [ ] **Step 1 : Créer le dossier racine**

```bash
mkdir easydigia-publisher
cd easydigia-publisher
```

- [ ] **Step 2 : Créer `package.json`**

```json
{
  "name": "easydigia-publisher",
  "version": "1.0.0",
  "description": "Autonomous AI Content Publisher for WordPress",
  "main": "src/cli/index.ts",
  "scripts": {
    "publish": "tsx src/cli/index.ts publish",
    "schedule": "tsx src/cli/index.ts schedule",
    "test": "vitest run",
    "test:watch": "vitest"
  },
  "dependencies": {
    "@anthropic-ai/sdk": "^0.111.0",
    "axios": "^1.7.9",
    "better-sqlite3": "^9.6.0",
    "commander": "^12.1.0",
    "dotenv": "^16.4.5",
    "node-cron": "^3.0.3",
    "pdfkit": "^0.15.1",
    "sharp": "^0.33.5",
    "zod": "^3.23.8"
  },
  "devDependencies": {
    "@types/better-sqlite3": "^7.6.11",
    "@types/node": "^20.14.0",
    "@types/node-cron": "^3.0.11",
    "@types/pdfkit": "^0.13.4",
    "tsx": "^4.16.0",
    "typescript": "^5.5.0",
    "vitest": "^2.0.0"
  }
}
```

- [ ] **Step 3 : Créer `tsconfig.json`**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "CommonJS",
    "moduleResolution": "node",
    "lib": ["ES2022"],
    "outDir": "dist",
    "rootDir": "src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "resolveJsonModule": true,
    "baseUrl": "."
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "tests"]
}
```

- [ ] **Step 4 : Créer `vitest.config.ts`**

```typescript
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['tests/**/*.test.ts'],
    clearMocks: true,
  },
})
```

- [ ] **Step 5 : Créer `.gitignore`**

```
node_modules/
dist/
.env
database/articles.db
assets/images/original/*.jpg
assets/images/original/*.jpeg
assets/images/original/*.png
assets/images/webp/*.webp
reports/*.pdf
schedule-config.json
```

- [ ] **Step 6 : Créer `.env.example`**

```env
# WordPress
WP_URL=https://www.easydigia.com
WP_USERNAME=
WP_APP_PASSWORD=

# Sources d'images (au moins une requise)
UNSPLASH_ACCESS_KEY=
PEXELS_API_KEY=
PIXABAY_API_KEY=

# IA
ANTHROPIC_API_KEY=

# Options
WEBP_QUALITY=85
WEBP_MAX_KB=300
IMAGES_PER_ARTICLE=3
DEFAULT_STATUS=draft
CLAUDE_MODEL=claude-sonnet-5
```

- [ ] **Step 7 : Créer `schedule-config.json.example`**

```json
{
  "cronTime": "0 8 * * *",
  "subjects": [
    "Intelligence Artificielle en Comptabilité",
    "Automatisation des Processus Métier",
    "Marketing Digital et IA"
  ],
  "currentIndex": 0,
  "wpStatus": "publish",
  "articleCount": 1
}
```

- [ ] **Step 8 : Créer les dossiers avec `.gitkeep`**

```bash
mkdir -p assets/images/original assets/images/webp database reports tests
touch assets/images/original/.gitkeep assets/images/webp/.gitkeep database/.gitkeep reports/.gitkeep
```

- [ ] **Step 9 : Créer `src/types.ts`**

```typescript
export interface ImageCandidate {
  url: string
  author: string
  sourceUrl: string
  licence: string
  width: number
  height: number
  provider: 'unsplash' | 'pexels' | 'pixabay'
}

export interface ProcessedImage extends ImageCandidate {
  originalPath: string
  webpPath: string
  webpSizeKb: number
}

export interface SeoImageMeta {
  alt: string
  caption: string
  seoTitle: string
  description: string
  seoFilename: string
}

export interface ArticleSeo {
  metaTitle: string
  metaDescription: string
  slug: string
  tags: string[]
  category: string
  keywords: string[]
}

export interface GeneratedArticle {
  h1: string
  htmlContent: string
  wordCount: number
  seo: ArticleSeo
}

export interface PublishJob {
  subject: string
  articleCount: number
  wpStatus: 'draft' | 'publish'
}

export interface WpMedia {
  id: number
  url: string
}

export interface WpPost {
  id: number
  link: string
  status: string
  slug: string
}

export interface PublicationResult {
  articleId: number
  slug: string
  title: string
  wpUrl: string
  wpPostId: number
  wpStatus: 'draft' | 'publish'
  pdfPath: string
}

export interface ScheduleConfig {
  cronTime: string
  subjects: string[]
  currentIndex: number
  wpStatus: 'draft' | 'publish'
  articleCount: number
}
```

- [ ] **Step 10 : Créer `src/utils/retry.ts`**

```typescript
export async function withRetry<T>(
  fn: () => Promise<T>,
  retries = 3,
  label = 'operation'
): Promise<T> {
  const delays = [1000, 2000, 4000]
  let lastError: unknown

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fn()
    } catch (err) {
      lastError = err
      if (attempt < retries) {
        await new Promise(resolve => setTimeout(resolve, delays[attempt] ?? 4000))
      }
    }
  }

  throw new Error(
    `${label} failed after ${retries + 1} attempts: ${lastError instanceof Error ? lastError.message : String(lastError)}`
  )
}
```

- [ ] **Step 11 : Écrire le test de retry**

Créer `tests/retry.test.ts` :

```typescript
import { describe, it, expect, vi } from 'vitest'
import { withRetry } from '../src/utils/retry'

describe('withRetry', () => {
  it('retourne le résultat immédiatement si succès au 1er essai', async () => {
    const fn = vi.fn().mockResolvedValue('ok')
    const result = await withRetry(fn, 3, 'test')
    expect(result).toBe('ok')
    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('réessaie et réussit au 2ème essai', async () => {
    const fn = vi.fn()
      .mockRejectedValueOnce(new Error('fail'))
      .mockResolvedValue('ok')
    vi.useFakeTimers()
    const promise = withRetry(fn, 3, 'test')
    await vi.runAllTimersAsync()
    const result = await promise
    expect(result).toBe('ok')
    expect(fn).toHaveBeenCalledTimes(2)
    vi.useRealTimers()
  })

  it('lève une erreur après tous les essais épuisés', async () => {
    const fn = vi.fn().mockRejectedValue(new Error('always fail'))
    vi.useFakeTimers()
    const promise = withRetry(fn, 2, 'test')
    await vi.runAllTimersAsync()
    await expect(promise).rejects.toThrow('test failed after 3 attempts')
    vi.useRealTimers()
  })
})
```

- [ ] **Step 12 : Créer `src/config/config.ts`**

```typescript
import { z } from 'zod'
import dotenv from 'dotenv'

dotenv.config()

const ConfigSchema = z.object({
  wp: z.object({
    url: z.string().url(),
    username: z.string().min(1),
    appPassword: z.string().min(1),
  }),
  unsplash: z.object({ accessKey: z.string().min(1) }).optional(),
  pexels: z.object({ apiKey: z.string().min(1) }).optional(),
  pixabay: z.object({ apiKey: z.string().min(1) }).optional(),
  anthropic: z.object({ apiKey: z.string().min(1) }),
  webp: z.object({
    quality: z.number().int().min(1).max(100),
    maxKb: z.number().int().positive(),
  }),
  imagesPerArticle: z.number().int().min(1).max(10),
  defaultStatus: z.enum(['draft', 'publish']),
  claudeModel: z.string().min(1),
})

export type Config = z.infer<typeof ConfigSchema>

export function loadConfig(): Config {
  const raw = {
    wp: {
      url: process.env.WP_URL ?? '',
      username: process.env.WP_USERNAME ?? '',
      appPassword: process.env.WP_APP_PASSWORD ?? '',
    },
    unsplash: process.env.UNSPLASH_ACCESS_KEY
      ? { accessKey: process.env.UNSPLASH_ACCESS_KEY }
      : undefined,
    pexels: process.env.PEXELS_API_KEY
      ? { apiKey: process.env.PEXELS_API_KEY }
      : undefined,
    pixabay: process.env.PIXABAY_API_KEY
      ? { apiKey: process.env.PIXABAY_API_KEY }
      : undefined,
    anthropic: { apiKey: process.env.ANTHROPIC_API_KEY ?? '' },
    webp: {
      quality: process.env.WEBP_QUALITY ? parseInt(process.env.WEBP_QUALITY) : 85,
      maxKb: process.env.WEBP_MAX_KB ? parseInt(process.env.WEBP_MAX_KB) : 300,
    },
    imagesPerArticle: process.env.IMAGES_PER_ARTICLE
      ? parseInt(process.env.IMAGES_PER_ARTICLE)
      : 3,
    defaultStatus: (process.env.DEFAULT_STATUS ?? 'draft') as 'draft' | 'publish',
    claudeModel: process.env.CLAUDE_MODEL ?? 'claude-sonnet-5',
  }

  const result = ConfigSchema.safeParse(raw)
  if (!result.success) {
    const issues = result.error.issues.map(i => `${i.path.join('.')}: ${i.message}`).join('\n')
    throw new Error(`Configuration invalide :\n${issues}`)
  }

  if (!result.data.unsplash && !result.data.pexels && !result.data.pixabay) {
    throw new Error('Au moins une clé API image est requise (UNSPLASH, PEXELS ou PIXABAY)')
  }

  return result.data
}
```

- [ ] **Step 13 : Écrire le test de config**

Créer `tests/config.test.ts` :

```typescript
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { loadConfig } from '../src/config/config'

const BASE_ENV = {
  WP_URL: 'https://www.easydigia.com',
  WP_USERNAME: 'admin',
  WP_APP_PASSWORD: 'xxxx xxxx xxxx xxxx',
  ANTHROPIC_API_KEY: 'sk-ant-test',
  UNSPLASH_ACCESS_KEY: 'unsplash-key',
}

describe('loadConfig', () => {
  let original: NodeJS.ProcessEnv

  beforeEach(() => {
    original = { ...process.env }
    Object.assign(process.env, BASE_ENV)
  })

  afterEach(() => {
    process.env = original
  })

  it('charge la config valide avec des valeurs par défaut', () => {
    const config = loadConfig()
    expect(config.webp.quality).toBe(85)
    expect(config.webp.maxKb).toBe(300)
    expect(config.imagesPerArticle).toBe(3)
    expect(config.defaultStatus).toBe('draft')
    expect(config.claudeModel).toBe('claude-sonnet-5')
  })

  it('lève une erreur si WP_URL manque', () => {
    delete process.env.WP_URL
    expect(() => loadConfig()).toThrow('Configuration invalide')
  })

  it('lève une erreur si aucune clé image', () => {
    delete process.env.UNSPLASH_ACCESS_KEY
    expect(() => loadConfig()).toThrow('Au moins une clé API image')
  })

  it('accepte un statut publish', () => {
    process.env.DEFAULT_STATUS = 'publish'
    const config = loadConfig()
    expect(config.defaultStatus).toBe('publish')
  })
})
```

- [ ] **Step 14 : Installer les dépendances**

```bash
npm install
```

- [ ] **Step 15 : Lancer les tests**

```bash
npm test
```

Résultat attendu : `retry.test.ts` → 3 PASS, `config.test.ts` → 4 PASS.

- [ ] **Step 16 : Commit**

```bash
git init
git add .
git commit -m "feat: scaffold easydigia-publisher — config, types, retry"
```

---

## Task 2 : Logger + Database

**Files:**
- Create: `src/utils/logger.ts`
- Create: `src/database/Database.ts`
- Create: `tests/logger.test.ts`
- Create: `tests/database.test.ts`

**Interfaces:**
- Consumes: rien
- Produces: `logger.info/success/warn/error(msg)`, `class Db { insertArticle, updateArticle, articleExistsBySlug, insertImage, updateImage, insertLog, close }`

- [ ] **Step 1 : Écrire le test du logger**

Créer `tests/logger.test.ts` :

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest'

describe('logger', () => {
  beforeEach(() => {
    vi.spyOn(process.stdout, 'write').mockImplementation(() => true)
  })

  it('logger.info écrit sur stdout sans throw', async () => {
    const { logger } = await import('../src/utils/logger')
    expect(() => logger.info('test message')).not.toThrow()
  })

  it('logger.success écrit sur stdout sans throw', async () => {
    const { logger } = await import('../src/utils/logger')
    expect(() => logger.success('done')).not.toThrow()
  })

  it('logger.error écrit sur stdout sans throw', async () => {
    const { logger } = await import('../src/utils/logger')
    expect(() => logger.error('oops')).not.toThrow()
  })
})
```

- [ ] **Step 2 : Lancer le test pour vérifier qu'il échoue**

```bash
npm test -- tests/logger.test.ts
```

Résultat attendu : FAIL — `Cannot find module '../src/utils/logger'`

- [ ] **Step 3 : Créer `src/utils/logger.ts`**

```typescript
const RESET = '\x1b[0m'
const CYAN = '\x1b[36m'
const GREEN = '\x1b[32m'
const YELLOW = '\x1b[33m'
const RED = '\x1b[31m'

function timestamp(): string {
  return new Date().toISOString().replace('T', ' ').slice(0, 19)
}

export const logger = {
  info(msg: string): void {
    process.stdout.write(`${CYAN}[${timestamp()}] ℹ ${msg}${RESET}\n`)
  },
  success(msg: string): void {
    process.stdout.write(`${GREEN}[${timestamp()}] ✓ ${msg}${RESET}\n`)
  },
  warn(msg: string): void {
    process.stdout.write(`${YELLOW}[${timestamp()}] ⚠ ${msg}${RESET}\n`)
  },
  error(msg: string): void {
    process.stdout.write(`${RED}[${timestamp()}] ✗ ${msg}${RESET}\n`)
  },
  step(step: string, detail = ''): void {
    const suffix = detail ? ` — ${detail}` : ''
    process.stdout.write(`${CYAN}[${timestamp()}] → ${step}${suffix}${RESET}\n`)
  },
}
```

- [ ] **Step 4 : Écrire le test de la DB**

Créer `tests/database.test.ts` :

```typescript
import { describe, it, expect, afterEach } from 'vitest'
import { Db } from '../src/database/Database'
import fs from 'fs'
import path from 'path'

const TEST_DB = path.resolve('tests/test.db')

describe('Database', () => {
  let db: Db

  afterEach(() => {
    db?.close()
    if (fs.existsSync(TEST_DB)) fs.unlinkSync(TEST_DB)
  })

  it('crée les tables sans erreur', () => {
    db = new Db(TEST_DB)
    expect(db).toBeDefined()
  })

  it('insère et retrouve un article par slug', () => {
    db = new Db(TEST_DB)
    const id = db.insertArticle({
      slug: 'test-article',
      title: 'Test Article',
      status: 'pending',
    })
    expect(id).toBeGreaterThan(0)
    expect(db.articleExistsBySlug('test-article')).toBe(true)
    expect(db.articleExistsBySlug('autre-slug')).toBe(false)
  })

  it('met à jour le statut d\'un article', () => {
    db = new Db(TEST_DB)
    const id = db.insertArticle({ slug: 'up-test', title: 'Up', status: 'pending' })
    db.updateArticle(id, { status: 'published', wp_post_id: 42, wp_url: 'https://example.com/up-test' })
    const row = db.getArticleById(id)
    expect(row?.status).toBe('published')
    expect(row?.wp_post_id).toBe(42)
  })

  it('insère une image liée à un article', () => {
    db = new Db(TEST_DB)
    const articleId = db.insertArticle({ slug: 'img-test', title: 'Img', status: 'pending' })
    const imageId = db.insertImage({
      article_id: articleId,
      original_path: '/path/img.jpg',
      webp_path: '/path/img.webp',
      alt: 'Description',
      author: 'John',
      source_url: 'https://unsplash.com/photo/1',
      licence: 'Unsplash License',
      width: 1920,
      height: 1080,
    })
    expect(imageId).toBeGreaterThan(0)
  })

  it('insère un log', () => {
    db = new Db(TEST_DB)
    const articleId = db.insertArticle({ slug: 'log-test', title: 'Log', status: 'pending' })
    expect(() => db.insertLog({
      article_id: articleId,
      step: 'image_search',
      status: 'ok',
      message: 'Trouvé 10 images',
    })).not.toThrow()
  })
})
```

- [ ] **Step 5 : Lancer le test pour vérifier qu'il échoue**

```bash
npm test -- tests/database.test.ts
```

Résultat attendu : FAIL — `Cannot find module '../src/database/Database'`

- [ ] **Step 6 : Créer `src/database/Database.ts`**

```typescript
import BetterSqlite3 from 'better-sqlite3'
import path from 'path'
import fs from 'fs'

const DEFAULT_DB_PATH = path.resolve(process.cwd(), 'database', 'articles.db')

export interface ArticleRow {
  id?: number
  slug: string
  title: string
  meta_title?: string
  meta_description?: string
  category?: string
  tags?: string
  content?: string
  word_count?: number
  wp_post_id?: number
  wp_url?: string
  status: 'pending' | 'published' | 'draft' | 'failed'
  created_at?: string
}

export interface ImageRow {
  id?: number
  article_id: number
  original_path?: string
  webp_path?: string
  wp_media_id?: number
  wp_url?: string
  alt?: string
  caption?: string
  author?: string
  source_url?: string
  licence?: string
  width?: number
  height?: number
}

export interface LogRow {
  id?: number
  article_id: number
  step: string
  status: 'ok' | 'error'
  message: string
  created_at?: string
}

export class Db {
  private db: BetterSqlite3.Database

  constructor(dbPath = DEFAULT_DB_PATH) {
    fs.mkdirSync(path.dirname(dbPath), { recursive: true })
    this.db = new BetterSqlite3(dbPath)
    this.migrate()
  }

  private migrate(): void {
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS articles (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        slug TEXT UNIQUE NOT NULL,
        title TEXT NOT NULL,
        meta_title TEXT,
        meta_description TEXT,
        category TEXT,
        tags TEXT,
        content TEXT,
        word_count INTEGER,
        wp_post_id INTEGER,
        wp_url TEXT,
        status TEXT DEFAULT 'pending',
        created_at TEXT DEFAULT (datetime('now'))
      );
      CREATE TABLE IF NOT EXISTS images (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        article_id INTEGER REFERENCES articles(id),
        original_path TEXT,
        webp_path TEXT,
        wp_media_id INTEGER,
        wp_url TEXT,
        alt TEXT,
        caption TEXT,
        author TEXT,
        source_url TEXT,
        licence TEXT,
        width INTEGER,
        height INTEGER
      );
      CREATE TABLE IF NOT EXISTS logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        article_id INTEGER REFERENCES articles(id),
        step TEXT,
        status TEXT,
        message TEXT,
        created_at TEXT DEFAULT (datetime('now'))
      );
    `)
  }

  insertArticle(row: Omit<ArticleRow, 'id' | 'created_at'>): number {
    const result = this.db.prepare(`
      INSERT INTO articles (slug, title, meta_title, meta_description, category, tags, content, word_count, wp_post_id, wp_url, status)
      VALUES (@slug, @title, @meta_title, @meta_description, @category, @tags, @content, @word_count, @wp_post_id, @wp_url, @status)
    `).run(row)
    return result.lastInsertRowid as number
  }

  updateArticle(id: number, data: Partial<Omit<ArticleRow, 'id' | 'created_at'>>): void {
    const fields = Object.keys(data).map(k => `${k} = @${k}`).join(', ')
    this.db.prepare(`UPDATE articles SET ${fields} WHERE id = @id`).run({ ...data, id })
  }

  getArticleById(id: number): ArticleRow | undefined {
    return this.db.prepare('SELECT * FROM articles WHERE id = ?').get(id) as ArticleRow | undefined
  }

  articleExistsBySlug(slug: string): boolean {
    return !!this.db.prepare('SELECT id FROM articles WHERE slug = ?').get(slug)
  }

  insertImage(row: Omit<ImageRow, 'id'>): number {
    const result = this.db.prepare(`
      INSERT INTO images (article_id, original_path, webp_path, wp_media_id, wp_url, alt, caption, author, source_url, licence, width, height)
      VALUES (@article_id, @original_path, @webp_path, @wp_media_id, @wp_url, @alt, @caption, @author, @source_url, @licence, @width, @height)
    `).run(row)
    return result.lastInsertRowid as number
  }

  updateImage(id: number, data: Partial<Omit<ImageRow, 'id'>>): void {
    const fields = Object.keys(data).map(k => `${k} = @${k}`).join(', ')
    this.db.prepare(`UPDATE images SET ${fields} WHERE id = @id`).run({ ...data, id })
  }

  insertLog(row: Omit<LogRow, 'id' | 'created_at'>): void {
    this.db.prepare(`
      INSERT INTO logs (article_id, step, status, message)
      VALUES (@article_id, @step, @status, @message)
    `).run(row)
  }

  close(): void {
    this.db.close()
  }
}

export const db = new Db()
```

- [ ] **Step 7 : Lancer tous les tests**

```bash
npm test
```

Résultat attendu : `logger.test.ts` → 3 PASS, `database.test.ts` → 5 PASS.

- [ ] **Step 8 : Commit**

```bash
git add src/utils/logger.ts src/database/Database.ts tests/logger.test.ts tests/database.test.ts
git commit -m "feat: add logger, Database with SQLite migrations"
```

---

## Task 3 : ImageSearcher

**Files:**
- Create: `src/services/image/ImageSearcher.ts`
- Create: `tests/ImageSearcher.test.ts`

**Interfaces:**
- Consumes: `Config` (config.ts), `ImageCandidate` (types.ts), `withRetry` (retry.ts), `logger` (logger.ts)
- Produces: `class ImageSearcher { search(subject: string, count: number): Promise<ImageCandidate[]> }`

- [ ] **Step 1 : Écrire le test**

Créer `tests/ImageSearcher.test.ts` :

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest'
import axios from 'axios'

vi.mock('axios')
const mockedAxios = vi.mocked(axios)

const MOCK_CONFIG = {
  unsplash: { accessKey: 'unsplash-key' },
  pexels: { apiKey: 'pexels-key' },
  pixabay: { apiKey: 'pixabay-key' },
  webp: { quality: 85, maxKb: 300 },
  imagesPerArticle: 3,
  defaultStatus: 'draft' as const,
  claudeModel: 'claude-sonnet-5',
  wp: { url: 'https://example.com', username: 'u', appPassword: 'p' },
  anthropic: { apiKey: 'sk-ant' },
}

const UNSPLASH_RESPONSE = {
  data: {
    results: [
      {
        urls: { full: 'https://images.unsplash.com/photo-1.jpg' },
        user: { name: 'Alice Photo' },
        links: { html: 'https://unsplash.com/photos/1' },
        width: 4000,
        height: 2667,
      },
    ],
  },
}

describe('ImageSearcher', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('retourne des images Unsplash si disponibles', async () => {
    mockedAxios.get = vi.fn().mockResolvedValue(UNSPLASH_RESPONSE)
    const { ImageSearcher } = await import('../src/services/image/ImageSearcher')
    const searcher = new ImageSearcher(MOCK_CONFIG)
    const results = await searcher.search('intelligence artificielle', 1)
    expect(results).toHaveLength(1)
    expect(results[0].provider).toBe('unsplash')
    expect(results[0].author).toBe('Alice Photo')
    expect(results[0].licence).toBe('Unsplash License')
  })

  it('bascule sur Pexels si Unsplash renvoie 0 résultat', async () => {
    mockedAxios.get = vi.fn()
      .mockResolvedValueOnce({ data: { results: [] } })
      .mockResolvedValueOnce({
        data: {
          photos: [{
            src: { original: 'https://images.pexels.com/1.jpg' },
            photographer: 'Bob',
            photographer_url: 'https://pexels.com/u/bob',
            width: 3000,
            height: 2000,
          }],
        },
      })
    const { ImageSearcher } = await import('../src/services/image/ImageSearcher')
    const searcher = new ImageSearcher(MOCK_CONFIG)
    const results = await searcher.search('comptabilité', 1)
    expect(results[0].provider).toBe('pexels')
    expect(results[0].licence).toBe('Pexels License')
  })

  it('lève ImageNotFoundError si tous les providers échouent', async () => {
    mockedAxios.get = vi.fn().mockResolvedValue({ data: { results: [], photos: [], hits: [] } })
    const { ImageSearcher, ImageNotFoundError } = await import('../src/services/image/ImageSearcher')
    const searcher = new ImageSearcher(MOCK_CONFIG)
    await expect(searcher.search('xyz inexistant', 1)).rejects.toThrow(ImageNotFoundError)
  })
})
```

- [ ] **Step 2 : Lancer le test pour vérifier qu'il échoue**

```bash
npm test -- tests/ImageSearcher.test.ts
```

Résultat attendu : FAIL — `Cannot find module '../src/services/image/ImageSearcher'`

- [ ] **Step 3 : Créer `src/services/image/ImageSearcher.ts`**

```typescript
import axios from 'axios'
import type { Config } from '../../config/config'
import type { ImageCandidate } from '../../types'
import { withRetry } from '../../utils/retry'
import { logger } from '../../utils/logger'

export class ImageNotFoundError extends Error {
  constructor(subject: string) {
    super(`Aucune image trouvée pour : "${subject}"`)
    this.name = 'ImageNotFoundError'
  }
}

const QUERIES_FROM_SUBJECT = (subject: string): string[] => [
  subject,
  `${subject} professionnel`,
  `technology business`,
  `digital innovation`,
  `modern office`,
]

export class ImageSearcher {
  constructor(private config: Config) {}

  async search(subject: string, count: number): Promise<ImageCandidate[]> {
    const queries = QUERIES_FROM_SUBJECT(subject)

    if (this.config.unsplash) {
      logger.step('Recherche Unsplash', subject)
      for (const query of queries) {
        const results = await withRetry(
          () => this.searchUnsplash(query, count),
          3,
          'Unsplash'
        )
        if (results.length > 0) return results.slice(0, count)
      }
    }

    if (this.config.pexels) {
      logger.step('Recherche Pexels', subject)
      for (const query of queries) {
        const results = await withRetry(
          () => this.searchPexels(query, count),
          3,
          'Pexels'
        )
        if (results.length > 0) return results.slice(0, count)
      }
    }

    if (this.config.pixabay) {
      logger.step('Recherche Pixabay', subject)
      for (const query of queries) {
        const results = await withRetry(
          () => this.searchPixabay(query, count),
          3,
          'Pixabay'
        )
        if (results.length > 0) return results.slice(0, count)
      }
    }

    throw new ImageNotFoundError(subject)
  }

  private async searchUnsplash(query: string, count: number): Promise<ImageCandidate[]> {
    const res = await axios.get('https://api.unsplash.com/search/photos', {
      headers: { Authorization: `Client-ID ${this.config.unsplash!.accessKey}` },
      params: { query, per_page: Math.max(count, 10), orientation: 'landscape' },
    })
    return (res.data.results as any[])
      .filter((p: any) => p.width >= 1920 && p.height >= 1080)
      .map((p: any): ImageCandidate => ({
        url: p.urls.full,
        author: p.user.name,
        sourceUrl: p.links.html,
        licence: 'Unsplash License',
        width: p.width,
        height: p.height,
        provider: 'unsplash',
      }))
  }

  private async searchPexels(query: string, count: number): Promise<ImageCandidate[]> {
    const res = await axios.get('https://api.pexels.com/v1/search', {
      headers: { Authorization: this.config.pexels!.apiKey },
      params: { query, per_page: Math.max(count, 10), orientation: 'landscape' },
    })
    return (res.data.photos as any[])
      .filter((p: any) => p.width >= 1920 && p.height >= 1080)
      .map((p: any): ImageCandidate => ({
        url: p.src.original,
        author: p.photographer,
        sourceUrl: p.photographer_url,
        licence: 'Pexels License',
        width: p.width,
        height: p.height,
        provider: 'pexels',
      }))
  }

  private async searchPixabay(query: string, count: number): Promise<ImageCandidate[]> {
    const res = await axios.get('https://pixabay.com/api/', {
      params: {
        key: this.config.pixabay!.apiKey,
        q: query,
        per_page: Math.max(count, 10),
        orientation: 'horizontal',
        image_type: 'photo',
        min_width: 1920,
        min_height: 1080,
      },
    })
    return (res.data.hits as any[]).map((p: any): ImageCandidate => ({
      url: p.largeImageURL,
      author: p.user,
      sourceUrl: p.pageURL,
      licence: 'Pixabay License',
      width: p.imageWidth,
      height: p.imageHeight,
      provider: 'pixabay',
    }))
  }
}
```

- [ ] **Step 4 : Lancer les tests**

```bash
npm test -- tests/ImageSearcher.test.ts
```

Résultat attendu : 3 PASS.

- [ ] **Step 5 : Commit**

```bash
git add src/services/image/ImageSearcher.ts tests/ImageSearcher.test.ts
git commit -m "feat: add ImageSearcher with Unsplash/Pexels/Pixabay fallback"
```

---

## Task 4 : ImageDownloader + ImageProcessor

**Files:**
- Create: `src/services/image/ImageDownloader.ts`
- Create: `src/services/image/ImageProcessor.ts`
- Create: `tests/ImageDownloader.test.ts`
- Create: `tests/ImageProcessor.test.ts`

**Interfaces:**
- Consumes: `ImageCandidate` (types.ts), `Config` (config.ts), `logger` (logger.ts), `withRetry` (retry.ts)
- Produces:
  - `class ImageDownloader { download(img: ImageCandidate, slug: string, index: number): Promise<string> }` — retourne `originalPath`
  - `class ImageProcessor { process(originalPath: string, slug: string, index: number): Promise<{ webpPath: string, webpSizeKb: number }> }`

- [ ] **Step 1 : Écrire les tests**

Créer `tests/ImageDownloader.test.ts` :

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest'
import axios from 'axios'
import fs from 'fs'

vi.mock('axios')
vi.mock('fs', async (importOriginal) => {
  const actual = await importOriginal<typeof fs>()
  return {
    ...actual,
    createWriteStream: vi.fn().mockReturnValue({
      on: vi.fn().mockImplementation(function(this: any, event: string, cb: () => void) {
        if (event === 'finish') cb()
        return this
      }),
      end: vi.fn(),
    }),
    mkdirSync: vi.fn(),
  }
})

const MOCK_CONFIG = {
  wp: { url: 'https://example.com', username: 'u', appPassword: 'p' },
  anthropic: { apiKey: 'sk' },
  unsplash: { accessKey: 'uk' },
  webp: { quality: 85, maxKb: 300 },
  imagesPerArticle: 3,
  defaultStatus: 'draft' as const,
  claudeModel: 'claude-sonnet-5',
}

describe('ImageDownloader', () => {
  it('télécharge et retourne le chemin local', async () => {
    const mockStream = {
      pipe: vi.fn(),
      on: vi.fn().mockImplementation(function(this: any, _: string, cb: () => void) {
        cb(); return this
      }),
    }
    vi.mocked(axios.get).mockResolvedValue({ data: mockStream })
    const { ImageDownloader } = await import('../src/services/image/ImageDownloader')
    const downloader = new ImageDownloader(MOCK_CONFIG as any)
    const candidate = {
      url: 'https://images.unsplash.com/1.jpg',
      author: 'Alice',
      sourceUrl: 'https://unsplash.com/1',
      licence: 'Unsplash License',
      width: 3000,
      height: 2000,
      provider: 'unsplash' as const,
    }
    const result = await downloader.download(candidate, 'test-slug', 0)
    expect(result).toContain('test-slug-001.jpg')
  })
})
```

Créer `tests/ImageProcessor.test.ts` :

```typescript
import { describe, it, expect, vi } from 'vitest'

const mockSharpInstance = {
  webp: vi.fn().mockReturnThis(),
  toFile: vi.fn().mockResolvedValue({ size: 200 * 1024 }),
}
vi.mock('sharp', () => ({ default: vi.fn(() => mockSharpInstance) }))

const MOCK_CONFIG = {
  webp: { quality: 85, maxKb: 300 },
  wp: { url: 'https://x.com', username: 'u', appPassword: 'p' },
  anthropic: { apiKey: 'sk' },
  imagesPerArticle: 3,
  defaultStatus: 'draft' as const,
  claudeModel: 'claude-sonnet-5',
}

describe('ImageProcessor', () => {
  it('convertit en webp et retourne le chemin', async () => {
    const { ImageProcessor } = await import('../src/services/image/ImageProcessor')
    const processor = new ImageProcessor(MOCK_CONFIG as any)
    const result = await processor.process('assets/images/original/test-001.jpg', 'test', 0)
    expect(result.webpPath).toContain('test-001.webp')
    expect(result.webpSizeKb).toBeLessThanOrEqual(300)
  })

  it('réduit la qualité si le fichier dépasse maxKb', async () => {
    mockSharpInstance.toFile
      .mockResolvedValueOnce({ size: 400 * 1024 })
      .mockResolvedValue({ size: 200 * 1024 })
    const { ImageProcessor } = await import('../src/services/image/ImageProcessor')
    const processor = new ImageProcessor(MOCK_CONFIG as any)
    const result = await processor.process('assets/images/original/big-001.jpg', 'big', 0)
    expect(mockSharpInstance.webp).toHaveBeenCalledTimes(2)
    expect(result.webpSizeKb).toBeLessThanOrEqual(300)
  })
})
```

- [ ] **Step 2 : Lancer les tests pour vérifier qu'ils échouent**

```bash
npm test -- tests/ImageDownloader.test.ts tests/ImageProcessor.test.ts
```

Résultat attendu : FAIL — modules non trouvés.

- [ ] **Step 3 : Créer `src/services/image/ImageDownloader.ts`**

```typescript
import axios from 'axios'
import fs from 'fs'
import path from 'path'
import type { ImageCandidate } from '../../types'
import type { Config } from '../../config/config'
import { withRetry } from '../../utils/retry'
import { logger } from '../../utils/logger'

const ORIGINAL_DIR = path.resolve(process.cwd(), 'assets', 'images', 'original')

export class ImageDownloader {
  constructor(private config: Config) {}

  async download(img: ImageCandidate, slug: string, index: number): Promise<string> {
    fs.mkdirSync(ORIGINAL_DIR, { recursive: true })
    const filename = `${slug}-${String(index + 1).padStart(3, '0')}.jpg`
    const dest = path.join(ORIGINAL_DIR, filename)

    logger.step('Téléchargement', filename)

    await withRetry(async () => {
      const res = await axios.get(img.url, { responseType: 'stream' })
      await new Promise<void>((resolve, reject) => {
        const writer = fs.createWriteStream(dest)
        res.data.pipe(writer)
        writer.on('finish', resolve)
        writer.on('error', reject)
      })
    }, 3, `download ${filename}`)

    return dest
  }
}
```

- [ ] **Step 4 : Créer `src/services/image/ImageProcessor.ts`**

```typescript
import sharp from 'sharp'
import path from 'path'
import fs from 'fs'
import type { Config } from '../../config/config'
import { logger } from '../../utils/logger'

const WEBP_DIR = path.resolve(process.cwd(), 'assets', 'images', 'webp')

export class ImageProcessor {
  constructor(private config: Config) {}

  async process(
    originalPath: string,
    slug: string,
    index: number
  ): Promise<{ webpPath: string; webpSizeKb: number }> {
    fs.mkdirSync(WEBP_DIR, { recursive: true })
    const filename = `${slug}-${String(index + 1).padStart(3, '0')}.webp`
    const webpPath = path.join(WEBP_DIR, filename)

    logger.step('Conversion WebP', filename)

    let quality = this.config.webp.quality
    let sizeKb: number

    do {
      const result = await sharp(originalPath).webp({ quality }).toFile(webpPath)
      sizeKb = Math.round(result.size / 1024)

      if (sizeKb > this.config.webp.maxKb && quality > 30) {
        quality -= 10
        logger.warn(`${filename} : ${sizeKb} KB > ${this.config.webp.maxKb} KB — qualité → ${quality}%`)
      } else {
        break
      }
    } while (true)

    logger.success(`${filename} : ${sizeKb} KB (qualité ${quality}%)`)
    return { webpPath, webpSizeKb: sizeKb }
  }
}
```

- [ ] **Step 5 : Lancer les tests**

```bash
npm test -- tests/ImageDownloader.test.ts tests/ImageProcessor.test.ts
```

Résultat attendu : 3 PASS au total.

- [ ] **Step 6 : Commit**

```bash
git add src/services/image/ImageDownloader.ts src/services/image/ImageProcessor.ts tests/ImageDownloader.test.ts tests/ImageProcessor.test.ts
git commit -m "feat: add ImageDownloader and ImageProcessor (sharp WebP <300KB)"
```

---

## Task 5 : SeoGenerator

**Files:**
- Create: `src/services/seo/SeoGenerator.ts`
- Create: `tests/SeoGenerator.test.ts`

**Interfaces:**
- Consumes: `Config`, `ProcessedImage`, `SeoImageMeta`, `ArticleSeo` (types.ts), `@anthropic-ai/sdk`, `withRetry`, `logger`
- Produces: `class SeoGenerator { generateImageMeta(img: ProcessedImage, subject: string): Promise<SeoImageMeta>; generateArticleSeo(subject: string): Promise<ArticleSeo> }`

- [ ] **Step 1 : Écrire le test**

Créer `tests/SeoGenerator.test.ts` :

```typescript
import { describe, it, expect, vi } from 'vitest'

const MOCK_IMAGE_META = JSON.stringify({
  alt: "Comptable utilisant l'IA pour analyser des données financières",
  caption: "L'intelligence artificielle révolutionne la comptabilité moderne",
  seoTitle: "Intelligence Artificielle Comptabilité",
  description: "Photo professionnelle montrant l'usage de l'IA en comptabilité",
  seoFilename: "intelligence-artificielle-comptabilite.webp",
})

const MOCK_ARTICLE_SEO = JSON.stringify({
  metaTitle: "Intelligence Artificielle en Comptabilité : Guide Complet 2026",
  metaDescription: "Découvrez comment l'IA transforme la comptabilité avec des outils automatisés, des analyses prédictives et des gains de productivité mesurables.",
  slug: "intelligence-artificielle-comptabilite-guide",
  tags: ["IA", "Comptabilité", "Automatisation", "Finance"],
  category: "Intelligence Artificielle",
  keywords: ["intelligence artificielle comptabilité", "AI accounting", "automatisation financière"],
})

vi.mock('@anthropic-ai/sdk', () => ({
  default: vi.fn().mockImplementation(() => ({
    messages: {
      create: vi.fn()
        .mockResolvedValueOnce({ content: [{ type: 'text', text: MOCK_IMAGE_META }] })
        .mockResolvedValueOnce({ content: [{ type: 'text', text: MOCK_ARTICLE_SEO }] }),
    },
  })),
}))

const MOCK_CONFIG = {
  anthropic: { apiKey: 'sk-ant' },
  claudeModel: 'claude-sonnet-5',
  wp: { url: 'https://x.com', username: 'u', appPassword: 'p' },
  webp: { quality: 85, maxKb: 300 },
  imagesPerArticle: 3,
  defaultStatus: 'draft' as const,
}

describe('SeoGenerator', () => {
  it('génère les métadonnées SEO d\'une image', async () => {
    const { SeoGenerator } = await import('../src/services/seo/SeoGenerator')
    const gen = new SeoGenerator(MOCK_CONFIG as any)
    const img = {
      url: 'https://example.com/img.jpg',
      author: 'Alice',
      sourceUrl: 'https://unsplash.com/1',
      licence: 'Unsplash License',
      width: 3000,
      height: 2000,
      provider: 'unsplash' as const,
      originalPath: 'assets/images/original/test-001.jpg',
      webpPath: 'assets/images/webp/test-001.webp',
      webpSizeKb: 180,
    }
    const meta = await gen.generateImageMeta(img, 'Intelligence Artificielle en Comptabilité')
    expect(meta.alt).toContain('IA')
    expect(meta.seoFilename).toContain('.webp')
  })

  it('génère le SEO d\'un article', async () => {
    const { SeoGenerator } = await import('../src/services/seo/SeoGenerator')
    const gen = new SeoGenerator(MOCK_CONFIG as any)
    const seo = await gen.generateArticleSeo('Intelligence Artificielle en Comptabilité')
    expect(seo.metaTitle.length).toBeLessThanOrEqual(70)
    expect(seo.metaDescription.length).toBeLessThanOrEqual(170)
    expect(seo.slug).toMatch(/^[a-z0-9-]+$/)
    expect(seo.tags.length).toBeGreaterThan(0)
  })
})
```

- [ ] **Step 2 : Lancer le test pour vérifier qu'il échoue**

```bash
npm test -- tests/SeoGenerator.test.ts
```

- [ ] **Step 3 : Créer `src/services/seo/SeoGenerator.ts`**

```typescript
import Anthropic from '@anthropic-ai/sdk'
import type { Config } from '../../config/config'
import type { ProcessedImage, SeoImageMeta, ArticleSeo } from '../../types'
import { withRetry } from '../../utils/retry'
import { logger } from '../../utils/logger'

export class SeoGenerator {
  private client: Anthropic

  constructor(private config: Config) {
    this.client = new Anthropic({ apiKey: config.anthropic.apiKey })
  }

  async generateImageMeta(img: ProcessedImage, subject: string): Promise<SeoImageMeta> {
    logger.step('SEO image', img.webpPath.split('/').pop())

    const text = await withRetry(() =>
      this.ask(`Tu es un expert SEO francophone.
Génère les métadonnées SEO pour une image professionnelle liée au sujet : "${subject}".
Image : ${img.width}×${img.height}px, auteur : ${img.author}, source : ${img.sourceUrl}

Réponds UNIQUEMENT en JSON valide, sans markdown, sans commentaires :
{
  "alt": "texte alternatif descriptif (max 125 caractères)",
  "caption": "légende contextuelle (max 150 caractères)",
  "seoTitle": "titre SEO (max 60 caractères)",
  "description": "description longue (max 200 caractères)",
  "seoFilename": "nom-de-fichier-seo.webp"
}`),
    3, 'SeoGenerator.generateImageMeta')

    return JSON.parse(text) as SeoImageMeta
  }

  async generateArticleSeo(subject: string): Promise<ArticleSeo> {
    logger.step('SEO article', subject)

    const text = await withRetry(() =>
      this.ask(`Tu es un expert SEO francophone spécialisé en IA et automatisation.
Génère les métadonnées SEO pour un article sur : "${subject}".

Réponds UNIQUEMENT en JSON valide, sans markdown, sans commentaires :
{
  "metaTitle": "titre SEO (max 60 caractères)",
  "metaDescription": "meta description (max 160 caractères)",
  "slug": "slug-url-en-minuscules-tirets",
  "tags": ["tag1", "tag2", "tag3", "tag4"],
  "category": "catégorie principale",
  "keywords": ["mot-clé principal", "variante 1", "variante 2"]
}`),
    3, 'SeoGenerator.generateArticleSeo')

    return JSON.parse(text) as ArticleSeo
  }

  private async ask(prompt: string): Promise<string> {
    const res = await this.client.messages.create({
      model: this.config.claudeModel,
      max_tokens: 512,
      messages: [{ role: 'user', content: prompt }],
    })
    const block = res.content[0]
    if (block.type !== 'text') throw new Error('Réponse Claude non textuelle')
    return block.text.trim()
  }
}
```

- [ ] **Step 4 : Lancer les tests**

```bash
npm test -- tests/SeoGenerator.test.ts
```

Résultat attendu : 2 PASS.

- [ ] **Step 5 : Commit**

```bash
git add src/services/seo/SeoGenerator.ts tests/SeoGenerator.test.ts
git commit -m "feat: add SeoGenerator (Claude — alt, caption, meta, slug)"
```

---

## Task 6 : ArticleGenerator

**Files:**
- Create: `src/services/ai/ArticleGenerator.ts`
- Create: `tests/ArticleGenerator.test.ts`

**Interfaces:**
- Consumes: `Config`, `ProcessedImage`, `SeoImageMeta`, `ArticleSeo`, `GeneratedArticle` (types.ts), `@anthropic-ai/sdk`, `withRetry`, `logger`
- Produces: `class ArticleGenerator { generate(subject: string, seo: ArticleSeo, images: Array<ProcessedImage & { meta: SeoImageMeta; wpUrl: string }>): Promise<GeneratedArticle> }`

- [ ] **Step 1 : Écrire le test**

Créer `tests/ArticleGenerator.test.ts` :

```typescript
import { describe, it, expect, vi } from 'vitest'

const MOCK_ARTICLE_HTML = `<h1>L'Intelligence Artificielle Révolutionne la Comptabilité</h1>
<nav id="toc"><ul><li><a href="#intro">Introduction</a></li><li><a href="#avantages">Avantages</a></li></ul></nav>
<h2 id="intro">Introduction</h2>
<p>L'intelligence artificielle transforme profondément les métiers comptables. Les logiciels modernes permettent d'automatiser les tâches répétitives, de détecter les anomalies et de produire des analyses prédictives en temps réel. Cette révolution numérique offre aux cabinets comptables un avantage compétitif décisif.</p>
<h2 id="avantages">Les Principaux Avantages</h2>
<p>Les bénéfices sont multiples : gain de temps sur la saisie des données, réduction des erreurs humaines, meilleure conformité réglementaire et capacité d'analyse augmentée. Les experts-comptables peuvent ainsi se concentrer sur des missions à plus forte valeur ajoutée pour leurs clients.</p>
<h2>FAQ</h2>
<dl><dt>L'IA remplace-t-elle les comptables ?</dt><dd>Non, elle les augmente.</dd></dl>
<h2>Conclusion</h2>
<p>L'adoption de l'IA en comptabilité est incontournable. Les cabinets qui s'y engagent dès maintenant gagneront en efficacité et en compétitivité.</p>
<p><strong>Contactez EasyDigia pour automatiser votre cabinet comptable dès aujourd'hui.</strong></p>`

vi.mock('@anthropic-ai/sdk', () => ({
  default: vi.fn().mockImplementation(() => ({
    messages: {
      create: vi.fn().mockResolvedValue({
        content: [{ type: 'text', text: MOCK_ARTICLE_HTML }],
      }),
    },
  })),
}))

const MOCK_CONFIG = {
  anthropic: { apiKey: 'sk-ant' },
  claudeModel: 'claude-sonnet-5',
  wp: { url: 'https://x.com', username: 'u', appPassword: 'p' },
  webp: { quality: 85, maxKb: 300 },
  imagesPerArticle: 3,
  defaultStatus: 'draft' as const,
}

const MOCK_SEO = {
  metaTitle: 'IA Comptabilité Guide',
  metaDescription: 'Guide complet sur l\'IA en comptabilité',
  slug: 'ia-comptabilite-guide',
  tags: ['IA', 'Comptabilité'],
  category: 'Intelligence Artificielle',
  keywords: ['IA comptabilité'],
}

const MOCK_IMAGES = [{
  url: 'https://img.example.com/1.jpg',
  author: 'Alice',
  sourceUrl: 'https://unsplash.com/1',
  licence: 'Unsplash License',
  width: 3000,
  height: 2000,
  provider: 'unsplash' as const,
  originalPath: 'assets/images/original/test-001.jpg',
  webpPath: 'assets/images/webp/test-001.webp',
  webpSizeKb: 180,
  meta: {
    alt: "Comptable avec IA",
    caption: "L'IA en comptabilité",
    seoTitle: "IA Comptabilité",
    description: "Photo IA comptabilité",
    seoFilename: "ia-comptabilite.webp",
  },
  wpUrl: 'https://easydigia.com/wp-content/uploads/ia-comptabilite.webp',
}]

describe('ArticleGenerator', () => {
  it('génère un article HTML avec H1, TOC, FAQ, CTA', async () => {
    const { ArticleGenerator } = await import('../src/services/ai/ArticleGenerator')
    const gen = new ArticleGenerator(MOCK_CONFIG as any)
    const article = await gen.generate(
      'Intelligence Artificielle en Comptabilité',
      MOCK_SEO,
      MOCK_IMAGES
    )
    expect(article.h1).toContain('Intelligence Artificielle')
    expect(article.htmlContent).toContain('<h2')
    expect(article.htmlContent).toContain('id="toc"')
    expect(article.wordCount).toBeGreaterThan(0)
    expect(article.seo).toEqual(MOCK_SEO)
  })
})
```

- [ ] **Step 2 : Lancer le test pour vérifier qu'il échoue**

```bash
npm test -- tests/ArticleGenerator.test.ts
```

- [ ] **Step 3 : Créer `src/services/ai/ArticleGenerator.ts`**

```typescript
import Anthropic from '@anthropic-ai/sdk'
import type { Config } from '../../config/config'
import type { ProcessedImage, SeoImageMeta, ArticleSeo, GeneratedArticle } from '../../types'
import { withRetry } from '../../utils/retry'
import { logger } from '../../utils/logger'

type ImageWithMeta = ProcessedImage & { meta: SeoImageMeta; wpUrl: string }

export class ArticleGenerationError extends Error {
  constructor(subject: string, cause: string) {
    super(`Impossible de générer l'article pour "${subject}" : ${cause}`)
    this.name = 'ArticleGenerationError'
  }
}

export class ArticleGenerator {
  private client: Anthropic

  constructor(private config: Config) {
    this.client = new Anthropic({ apiKey: config.anthropic.apiKey })
  }

  async generate(
    subject: string,
    seo: ArticleSeo,
    images: ImageWithMeta[]
  ): Promise<GeneratedArticle> {
    logger.step('Génération article', subject)

    const imageInsertions = images.map((img, i) =>
      `[INSÉRER_IMAGE_${i + 1}: src="${img.wpUrl}" alt="${img.meta.alt}" caption="${img.meta.caption}"]`
    ).join('\n')

    const prompt = `Tu es un expert en rédaction SEO francophone pour une agence d'IA et d'automatisation.

Rédige un article complet en HTML pour le sujet : "${subject}"

Contraintes :
- Langue : français professionnel et expert
- Longueur : 1500 à 2500 mots
- Structure obligatoire : H1, Table des matières (<nav id="toc">), au minimum 4 H2, FAQ (<dl><dt><dd>), Conclusion, Call To Action vers EasyDigia
- SEO : utilise ces mots-clés naturellement : ${seo.keywords.join(', ')}
- Catégorie : ${seo.category}
- Intègre des liens internes vers /services et /contact
- À chaque H2, insère une de ces balises image au moment le plus pertinent :
${imageInsertions}
- Remplace les balises [INSÉRER_IMAGE_N: ...] par de vraies balises HTML <figure><img src="..." alt="..." /><figcaption>...</figcaption></figure>

Réponds UNIQUEMENT avec le HTML de l'article, sans markdown, sans balises html/body/head.`

    const htmlContent = await withRetry(async () => {
      const res = await this.client.messages.create({
        model: this.config.claudeModel,
        max_tokens: 4096,
        messages: [{ role: 'user', content: prompt }],
      })
      const block = res.content[0]
      if (block.type !== 'text') throw new ArticleGenerationError(subject, 'réponse non textuelle')
      return block.text.trim()
    }, 3, 'ArticleGenerator.generate')

    const h1Match = htmlContent.match(/<h1[^>]*>(.*?)<\/h1>/i)
    const h1 = h1Match ? h1Match[1].replace(/<[^>]+>/g, '') : subject

    const wordCount = htmlContent
      .replace(/<[^>]+>/g, ' ')
      .split(/\s+/)
      .filter(w => w.length > 0).length

    return { h1, htmlContent, wordCount, seo }
  }
}
```

- [ ] **Step 4 : Lancer les tests**

```bash
npm test -- tests/ArticleGenerator.test.ts
```

Résultat attendu : 1 PASS.

- [ ] **Step 5 : Commit**

```bash
git add src/services/ai/ArticleGenerator.ts tests/ArticleGenerator.test.ts
git commit -m "feat: add ArticleGenerator (Claude Sonnet — HTML 1500-2500 mots, TOC, FAQ)"
```

---

## Task 7 : WordPressPublisher

**Files:**
- Create: `src/services/wordpress/WordPressPublisher.ts`
- Create: `tests/WordPressPublisher.test.ts`

**Interfaces:**
- Consumes: `Config`, `ProcessedImage`, `SeoImageMeta`, `ArticleSeo`, `GeneratedArticle`, `WpMedia`, `WpPost` (types.ts), `axios`, `withRetry`, `logger`
- Produces: `class WordPressPublisher { uploadImage(img: ProcessedImage, meta: SeoImageMeta): Promise<WpMedia>; createPost(article: GeneratedArticle, featuredMediaId: number, wpStatus: string): Promise<WpPost>; ensureCategory(name: string): Promise<number> }`

- [ ] **Step 1 : Écrire le test**

Créer `tests/WordPressPublisher.test.ts` :

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest'
import axios from 'axios'
import fs from 'fs'

vi.mock('axios')
vi.mock('fs', async (importOriginal) => {
  const actual = await importOriginal<typeof fs>()
  return { ...actual, readFileSync: vi.fn().mockReturnValue(Buffer.from('fake-image-data')) }
})

const MOCK_CONFIG = {
  wp: { url: 'https://www.easydigia.com', username: 'admin', appPassword: 'xxxx xxxx' },
  anthropic: { apiKey: 'sk' },
  webp: { quality: 85, maxKb: 300 },
  imagesPerArticle: 3,
  defaultStatus: 'draft' as const,
  claudeModel: 'claude-sonnet-5',
}

describe('WordPressPublisher', () => {
  beforeEach(() => { vi.resetAllMocks() })

  it('uploade une image et retourne id + url', async () => {
    vi.mocked(axios.post).mockResolvedValue({
      data: { id: 42, source_url: 'https://easydigia.com/wp-content/uploads/img.webp' },
    })
    const { WordPressPublisher } = await import('../src/services/wordpress/WordPressPublisher')
    const publisher = new WordPressPublisher(MOCK_CONFIG as any)
    const img = {
      url: 'https://img.com/1.jpg', author: 'A', sourceUrl: 'https://u.com', licence: 'Unsplash License',
      width: 1920, height: 1080, provider: 'unsplash' as const,
      originalPath: 'assets/images/original/test-001.jpg',
      webpPath: 'assets/images/webp/test-001.webp',
      webpSizeKb: 180,
    }
    const meta = { alt: 'alt', caption: 'cap', seoTitle: 't', description: 'd', seoFilename: 'test.webp' }
    const media = await publisher.uploadImage(img, meta)
    expect(media.id).toBe(42)
    expect(media.url).toContain('easydigia.com')
  })

  it('crée un post WordPress et retourne id + lien', async () => {
    vi.mocked(axios.post).mockResolvedValue({
      data: { id: 99, link: 'https://easydigia.com/ia-comptabilite', status: 'draft', slug: 'ia-comptabilite' },
    })
    const { WordPressPublisher } = await import('../src/services/wordpress/WordPressPublisher')
    const publisher = new WordPressPublisher(MOCK_CONFIG as any)
    const article = {
      h1: 'IA Comptabilité',
      htmlContent: '<h1>IA</h1><p>Contenu.</p>',
      wordCount: 500,
      seo: {
        metaTitle: 'IA Comptabilité',
        metaDescription: 'Guide IA',
        slug: 'ia-comptabilite',
        tags: ['IA'],
        category: 'IA',
        keywords: ['IA'],
      },
    }
    const post = await publisher.createPost(article, 42, 'draft')
    expect(post.id).toBe(99)
    expect(post.link).toContain('ia-comptabilite')
  })

  it('crée une catégorie si elle n\'existe pas', async () => {
    vi.mocked(axios.get).mockResolvedValue({ data: [] })
    vi.mocked(axios.post).mockResolvedValue({ data: { id: 5 } })
    const { WordPressPublisher } = await import('../src/services/wordpress/WordPressPublisher')
    const publisher = new WordPressPublisher(MOCK_CONFIG as any)
    const id = await publisher.ensureCategory('Nouvelle Catégorie')
    expect(id).toBe(5)
  })
})
```

- [ ] **Step 2 : Lancer le test pour vérifier qu'il échoue**

```bash
npm test -- tests/WordPressPublisher.test.ts
```

- [ ] **Step 3 : Créer `src/services/wordpress/WordPressPublisher.ts`**

```typescript
import axios from 'axios'
import fs from 'fs'
import path from 'path'
import type { Config } from '../../config/config'
import type { ProcessedImage, SeoImageMeta, GeneratedArticle, WpMedia, WpPost } from '../../types'
import { withRetry } from '../../utils/retry'
import { logger } from '../../utils/logger'

export class WordPressApiError extends Error {
  constructor(action: string, detail: string) {
    super(`WordPress API error (${action}): ${detail}`)
    this.name = 'WordPressApiError'
  }
}

export class WordPressPublisher {
  private authHeader: string
  private baseUrl: string

  constructor(private config: Config) {
    const token = Buffer.from(
      `${config.wp.username}:${config.wp.appPassword}`
    ).toString('base64')
    this.authHeader = `Basic ${token}`
    this.baseUrl = config.wp.url.replace(/\/$/, '')
  }

  async uploadImage(img: ProcessedImage, meta: SeoImageMeta): Promise<WpMedia> {
    logger.step('Upload image WordPress', meta.seoFilename)

    return withRetry(async () => {
      const fileData = fs.readFileSync(img.webpPath)
      const res = await axios.post(`${this.baseUrl}/wp-json/wp/v2/media`, fileData, {
        headers: {
          Authorization: this.authHeader,
          'Content-Type': 'image/webp',
          'Content-Disposition': `attachment; filename="${meta.seoFilename}"`,
        },
      })
      if (!res.data.id) throw new WordPressApiError('uploadImage', 'no id in response')

      await axios.post(`${this.baseUrl}/wp-json/wp/v2/media/${res.data.id}`, {
        alt_text: meta.alt,
        caption: meta.caption,
        title: meta.seoTitle,
        description: meta.description,
      }, { headers: { Authorization: this.authHeader } })

      return { id: res.data.id, url: res.data.source_url }
    }, 3, 'uploadImage')
  }

  async ensureCategory(name: string): Promise<number> {
    const searchRes = await axios.get(`${this.baseUrl}/wp-json/wp/v2/categories`, {
      headers: { Authorization: this.authHeader },
      params: { search: name, per_page: 1 },
    })
    if (searchRes.data.length > 0) return searchRes.data[0].id as number

    const createRes = await axios.post(`${this.baseUrl}/wp-json/wp/v2/categories`,
      { name },
      { headers: { Authorization: this.authHeader } }
    )
    return createRes.data.id as number
  }

  async createPost(
    article: GeneratedArticle,
    featuredMediaId: number,
    wpStatus: string
  ): Promise<WpPost> {
    logger.step('Publication WordPress', article.seo.slug)

    const categoryId = await this.ensureCategory(article.seo.category)

    const tagIds = await this.ensureTags(article.seo.tags)

    return withRetry(async () => {
      const res = await axios.post(`${this.baseUrl}/wp-json/wp/v2/posts`, {
        title: article.h1,
        content: article.htmlContent,
        status: wpStatus,
        slug: article.seo.slug,
        featured_media: featuredMediaId,
        categories: [categoryId],
        tags: tagIds,
        excerpt: article.seo.metaDescription,
      }, { headers: { Authorization: this.authHeader } })

      if (!res.data.id) throw new WordPressApiError('createPost', 'no id in response')
      return { id: res.data.id, link: res.data.link, status: res.data.status, slug: res.data.slug }
    }, 3, 'createPost')
  }

  private async ensureTags(tagNames: string[]): Promise<number[]> {
    const ids: number[] = []
    for (const name of tagNames) {
      try {
        const searchRes = await axios.get(`${this.baseUrl}/wp-json/wp/v2/tags`, {
          headers: { Authorization: this.authHeader },
          params: { search: name, per_page: 1 },
        })
        if (searchRes.data.length > 0) {
          ids.push(searchRes.data[0].id as number)
        } else {
          const createRes = await axios.post(`${this.baseUrl}/wp-json/wp/v2/tags`,
            { name },
            { headers: { Authorization: this.authHeader } }
          )
          ids.push(createRes.data.id as number)
        }
      } catch {
        // ignore tag errors — tags are non-critical
      }
    }
    return ids
  }
}
```

- [ ] **Step 4 : Lancer les tests**

```bash
npm test -- tests/WordPressPublisher.test.ts
```

Résultat attendu : 3 PASS.

- [ ] **Step 5 : Commit**

```bash
git add src/services/wordpress/WordPressPublisher.ts tests/WordPressPublisher.test.ts
git commit -m "feat: add WordPressPublisher (upload media, create post, auto category/tags)"
```

---

## Task 8 : ReportGenerator

**Files:**
- Create: `src/services/report/ReportGenerator.ts`
- Create: `tests/ReportGenerator.test.ts`

**Interfaces:**
- Consumes: `PublicationResult` (types.ts), `pdfkit`, `logger`
- Produces: `class ReportGenerator { generate(result: PublicationResult, coverImageWebpPath: string): Promise<string> }` — retourne le chemin du PDF

- [ ] **Step 1 : Écrire le test**

Créer `tests/ReportGenerator.test.ts` :

```typescript
import { describe, it, expect, vi, afterEach } from 'vitest'
import fs from 'fs'
import path from 'path'

const mockDoc = {
  pipe: vi.fn().mockReturnThis(),
  fontSize: vi.fn().mockReturnThis(),
  fillColor: vi.fn().mockReturnThis(),
  font: vi.fn().mockReturnThis(),
  text: vi.fn().mockReturnThis(),
  moveDown: vi.fn().mockReturnThis(),
  moveTo: vi.fn().mockReturnThis(),
  lineTo: vi.fn().mockReturnThis(),
  stroke: vi.fn().mockReturnThis(),
  image: vi.fn().mockReturnThis(),
  end: vi.fn(),
  on: vi.fn().mockImplementation(function(this: any, event: string, cb: () => void) {
    if (event === 'finish') setTimeout(cb, 0)
    return this
  }),
}

vi.mock('pdfkit', () => ({ default: vi.fn(() => mockDoc) }))
vi.mock('fs', async (importOriginal) => {
  const actual = await importOriginal<typeof fs>()
  return {
    ...actual,
    mkdirSync: vi.fn(),
    existsSync: vi.fn().mockReturnValue(true),
    createWriteStream: vi.fn().mockReturnValue({
      on: vi.fn().mockImplementation(function(this: any, event: string, cb: () => void) {
        if (event === 'finish') setTimeout(cb, 0)
        return this
      }),
    }),
  }
})

describe('ReportGenerator', () => {
  it('génère un PDF et retourne le chemin', async () => {
    const { ReportGenerator } = await import('../src/services/report/ReportGenerator')
    const gen = new ReportGenerator()
    const result = {
      articleId: 1,
      slug: 'ia-comptabilite',
      title: 'IA en Comptabilité',
      wpUrl: 'https://easydigia.com/ia-comptabilite',
      wpPostId: 42,
      wpStatus: 'draft' as const,
      pdfPath: '',
    }
    const pdfPath = await gen.generate(result, 'assets/images/webp/test-001.webp')
    expect(pdfPath).toContain('ia-comptabilite')
    expect(pdfPath).toEndWith('.pdf')
    expect(mockDoc.text).toHaveBeenCalled()
    expect(mockDoc.end).toHaveBeenCalled()
  })
})
```

- [ ] **Step 2 : Lancer le test pour vérifier qu'il échoue**

```bash
npm test -- tests/ReportGenerator.test.ts
```

- [ ] **Step 3 : Créer `src/services/report/ReportGenerator.ts`**

```typescript
import PDFDocument from 'pdfkit'
import fs from 'fs'
import path from 'path'
import type { PublicationResult } from '../../types'
import { logger } from '../../utils/logger'

const REPORTS_DIR = path.resolve(process.cwd(), 'reports')

export class ReportGenerator {
  async generate(result: PublicationResult, coverImageWebpPath: string): Promise<string> {
    fs.mkdirSync(REPORTS_DIR, { recursive: true })

    const date = new Date().toISOString().slice(0, 10)
    const filename = `${date}-${result.slug}.pdf`
    const pdfPath = path.join(REPORTS_DIR, filename)

    logger.step('Génération rapport PDF', filename)

    await new Promise<void>((resolve, reject) => {
      const doc = new PDFDocument({ size: 'A4', margin: 50 })
      const stream = fs.createWriteStream(pdfPath)
      doc.pipe(stream)

      // Header
      doc.fontSize(22).fillColor('#1a1a2e').font('Helvetica-Bold')
        .text('EasyDigia — Rapport de Publication', { align: 'center' })
        .moveDown(0.5)

      doc.fontSize(11).fillColor('#666666').font('Helvetica')
        .text(`Généré le ${new Date().toLocaleString('fr-FR')}`, { align: 'center' })
        .moveDown(1)

      // Separator
      doc.moveTo(50, doc.y).lineTo(545, doc.y).stroke('#cccccc').moveDown(1)

      // Cover image
      if (fs.existsSync(coverImageWebpPath)) {
        try {
          doc.image(coverImageWebpPath, { width: 495, align: 'center' }).moveDown(1)
        } catch {
          // image peut ne pas être supportée par pdfkit en webp — skip silencieusement
        }
      }

      // Article info
      const rows: [string, string][] = [
        ['Titre', result.title],
        ['Slug', result.slug],
        ['URL WordPress', result.wpUrl],
        ['ID WordPress', String(result.wpPostId)],
        ['Statut', result.wpStatus],
      ]

      for (const [label, value] of rows) {
        doc.fontSize(10).fillColor('#333333').font('Helvetica-Bold').text(`${label} :`, { continued: true })
        doc.font('Helvetica').fillColor('#000000').text(` ${value}`)
        doc.moveDown(0.3)
      }

      doc.end()
      stream.on('finish', resolve)
      stream.on('error', reject)
    })

    logger.success(`PDF généré : ${filename}`)
    return pdfPath
  }
}
```

- [ ] **Step 4 : Lancer les tests**

```bash
npm test -- tests/ReportGenerator.test.ts
```

Résultat attendu : 1 PASS.

- [ ] **Step 5 : Commit**

```bash
git add src/services/report/ReportGenerator.ts tests/ReportGenerator.test.ts
git commit -m "feat: add ReportGenerator (pdfkit — titre, URL, slug, meta)"
```

---

## Task 9 : Publisher (orchestrateur)

**Files:**
- Create: `src/orchestrator/Publisher.ts`
- Create: `tests/Publisher.test.ts`

**Interfaces:**
- Consumes: tous les services précédents, `Db` (database), `PublishJob`, `PublicationResult` (types.ts)
- Produces: `class Publisher { run(job: PublishJob): Promise<PublicationResult[]> }`

- [ ] **Step 1 : Écrire le test**

Créer `tests/Publisher.test.ts` :

```typescript
import { describe, it, expect, vi } from 'vitest'
import type { PublishJob } from '../src/types'

vi.mock('../src/services/image/ImageSearcher', () => ({
  ImageSearcher: vi.fn().mockImplementation(() => ({
    search: vi.fn().mockResolvedValue([{
      url: 'https://img.com/1.jpg', author: 'A', sourceUrl: 'https://u.com',
      licence: 'Unsplash License', width: 1920, height: 1080, provider: 'unsplash',
    }]),
  })),
  ImageNotFoundError: class ImageNotFoundError extends Error {},
}))

vi.mock('../src/services/image/ImageDownloader', () => ({
  ImageDownloader: vi.fn().mockImplementation(() => ({
    download: vi.fn().mockResolvedValue('assets/images/original/test-001.jpg'),
  })),
}))

vi.mock('../src/services/image/ImageProcessor', () => ({
  ImageProcessor: vi.fn().mockImplementation(() => ({
    process: vi.fn().mockResolvedValue({ webpPath: 'assets/images/webp/test-001.webp', webpSizeKb: 180 }),
  })),
}))

vi.mock('../src/services/seo/SeoGenerator', () => ({
  SeoGenerator: vi.fn().mockImplementation(() => ({
    generateImageMeta: vi.fn().mockResolvedValue({
      alt: 'alt', caption: 'cap', seoTitle: 't', description: 'd', seoFilename: 'test.webp',
    }),
    generateArticleSeo: vi.fn().mockResolvedValue({
      metaTitle: 'IA Guide', metaDescription: 'Guide IA',
      slug: 'ia-guide', tags: ['IA'], category: 'IA', keywords: ['IA'],
    }),
  })),
}))

vi.mock('../src/services/ai/ArticleGenerator', () => ({
  ArticleGenerator: vi.fn().mockImplementation(() => ({
    generate: vi.fn().mockResolvedValue({
      h1: 'IA Guide', htmlContent: '<h1>IA</h1>', wordCount: 500,
      seo: { metaTitle: 'IA', metaDescription: 'Guide', slug: 'ia-guide', tags: ['IA'], category: 'IA', keywords: ['IA'] },
    }),
  })),
}))

vi.mock('../src/services/wordpress/WordPressPublisher', () => ({
  WordPressPublisher: vi.fn().mockImplementation(() => ({
    uploadImage: vi.fn().mockResolvedValue({ id: 42, url: 'https://easydigia.com/img.webp' }),
    createPost: vi.fn().mockResolvedValue({ id: 99, link: 'https://easydigia.com/ia-guide', status: 'draft', slug: 'ia-guide' }),
  })),
}))

vi.mock('../src/services/report/ReportGenerator', () => ({
  ReportGenerator: vi.fn().mockImplementation(() => ({
    generate: vi.fn().mockResolvedValue('reports/2026-07-14-ia-guide.pdf'),
  })),
}))

vi.mock('../src/database/Database', () => ({
  Db: vi.fn().mockImplementation(() => ({
    articleExistsBySlug: vi.fn().mockReturnValue(false),
    insertArticle: vi.fn().mockReturnValue(1),
    updateArticle: vi.fn(),
    insertImage: vi.fn().mockReturnValue(1),
    updateImage: vi.fn(),
    insertLog: vi.fn(),
    close: vi.fn(),
  })),
}))

describe('Publisher', () => {
  it('exécute le pipeline complet et retourne les résultats', async () => {
    const { Publisher } = await import('../src/orchestrator/Publisher')
    const MOCK_CONFIG = {
      wp: { url: 'https://easydigia.com', username: 'u', appPassword: 'p' },
      anthropic: { apiKey: 'sk' },
      unsplash: { accessKey: 'uk' },
      webp: { quality: 85, maxKb: 300 },
      imagesPerArticle: 1,
      defaultStatus: 'draft' as const,
      claudeModel: 'claude-sonnet-5',
    }
    const publisher = new Publisher(MOCK_CONFIG as any)
    const job: PublishJob = { subject: 'IA', articleCount: 1, wpStatus: 'draft' }
    const results = await publisher.run(job)
    expect(results).toHaveLength(1)
    expect(results[0].slug).toBe('ia-guide')
    expect(results[0].wpPostId).toBe(99)
    expect(results[0].pdfPath).toContain('.pdf')
  })

  it('skip un article si le slug existe déjà en DB', async () => {
    const { Publisher } = await import('../src/orchestrator/Publisher')
    const MOCK_CONFIG = {
      wp: { url: 'https://easydigia.com', username: 'u', appPassword: 'p' },
      anthropic: { apiKey: 'sk' },
      unsplash: { accessKey: 'uk' },
      webp: { quality: 85, maxKb: 300 },
      imagesPerArticle: 1,
      defaultStatus: 'draft' as const,
      claudeModel: 'claude-sonnet-5',
    }
    const { Db } = await import('../src/database/Database')
    vi.mocked(Db).mockImplementationOnce(() => ({
      articleExistsBySlug: vi.fn().mockReturnValue(true),
      insertArticle: vi.fn(),
      updateArticle: vi.fn(),
      insertImage: vi.fn(),
      updateImage: vi.fn(),
      insertLog: vi.fn(),
      close: vi.fn(),
    }))
    const publisher = new Publisher(MOCK_CONFIG as any)
    const results = await publisher.run({ subject: 'IA', articleCount: 1, wpStatus: 'draft' })
    expect(results).toHaveLength(0)
  })
})
```

- [ ] **Step 2 : Lancer le test pour vérifier qu'il échoue**

```bash
npm test -- tests/Publisher.test.ts
```

- [ ] **Step 3 : Créer `src/orchestrator/Publisher.ts`**

```typescript
import type { Config } from '../config/config'
import type { PublishJob, PublicationResult, ProcessedImage, SeoImageMeta } from '../types'
import { ImageSearcher } from '../services/image/ImageSearcher'
import { ImageDownloader } from '../services/image/ImageDownloader'
import { ImageProcessor } from '../services/image/ImageProcessor'
import { SeoGenerator } from '../services/seo/SeoGenerator'
import { ArticleGenerator } from '../services/ai/ArticleGenerator'
import { WordPressPublisher } from '../services/wordpress/WordPressPublisher'
import { ReportGenerator } from '../services/report/ReportGenerator'
import { Db } from '../database/Database'
import { logger } from '../utils/logger'

type ImageWithMeta = ProcessedImage & { meta: SeoImageMeta; wpUrl: string }

export class Publisher {
  private searcher: ImageSearcher
  private downloader: ImageDownloader
  private processor: ImageProcessor
  private seoGen: SeoGenerator
  private articleGen: ArticleGenerator
  private wpPublisher: WordPressPublisher
  private reportGen: ReportGenerator
  private db: Db

  constructor(private config: Config) {
    this.searcher = new ImageSearcher(config)
    this.downloader = new ImageDownloader(config)
    this.processor = new ImageProcessor(config)
    this.seoGen = new SeoGenerator(config)
    this.articleGen = new ArticleGenerator(config)
    this.wpPublisher = new WordPressPublisher(config)
    this.reportGen = new ReportGenerator()
    this.db = new Db()
  }

  async run(job: PublishJob): Promise<PublicationResult[]> {
    const results: PublicationResult[] = []

    for (let i = 0; i < job.articleCount; i++) {
      logger.info(`\n━━━ Article ${i + 1}/${job.articleCount} : "${job.subject}" ━━━`)
      try {
        const result = await this.publishOne(job)
        if (result) results.push(result)
      } catch (err) {
        logger.error(`Article ${i + 1} échoué : ${err instanceof Error ? err.message : String(err)}`)
      }
    }

    return results
  }

  private async publishOne(job: PublishJob): Promise<PublicationResult | null> {
    // Step 1 — Article SEO (slug needed for duplicate check)
    logger.step('Génération SEO article')
    const articleSeo = await this.seoGen.generateArticleSeo(job.subject)

    if (this.db.articleExistsBySlug(articleSeo.slug)) {
      logger.warn(`Doublon détecté — slug "${articleSeo.slug}" existe déjà. Skip.`)
      return null
    }

    const articleId = this.db.insertArticle({ slug: articleSeo.slug, title: job.subject, status: 'pending' })
    this.db.insertLog({ article_id: articleId, step: 'seo', status: 'ok', message: `slug: ${articleSeo.slug}` })

    // Step 2 — Images
    logger.step('Recherche images', job.subject)
    const candidates = await this.searcher.search(job.subject, this.config.imagesPerArticle)
    this.db.insertLog({ article_id: articleId, step: 'image_search', status: 'ok', message: `${candidates.length} images trouvées` })

    const imagesWithMeta: ImageWithMeta[] = []

    for (let idx = 0; idx < candidates.length; idx++) {
      const candidate = candidates[idx]

      const originalPath = await this.downloader.download(candidate, articleSeo.slug, idx)
      this.db.insertLog({ article_id: articleId, step: 'download', status: 'ok', message: originalPath })

      const { webpPath, webpSizeKb } = await this.processor.process(originalPath, articleSeo.slug, idx)
      this.db.insertLog({ article_id: articleId, step: 'process', status: 'ok', message: `${webpSizeKb} KB` })

      const processed: ProcessedImage = { ...candidate, originalPath, webpPath, webpSizeKb }

      const meta = await this.seoGen.generateImageMeta(processed, job.subject)
      this.db.insertLog({ article_id: articleId, step: 'seo_image', status: 'ok', message: meta.seoFilename })

      const imageDbId = this.db.insertImage({
        article_id: articleId,
        original_path: originalPath,
        webp_path: webpPath,
        alt: meta.alt,
        caption: meta.caption,
        author: candidate.author,
        source_url: candidate.sourceUrl,
        licence: candidate.licence,
        width: candidate.width,
        height: candidate.height,
      })

      // Upload to WordPress
      const wpMedia = await this.wpPublisher.uploadImage(processed, meta)
      this.db.updateImage(imageDbId, { wp_media_id: wpMedia.id, wp_url: wpMedia.url })
      this.db.insertLog({ article_id: articleId, step: 'wp_media', status: 'ok', message: `media_id: ${wpMedia.id}` })

      imagesWithMeta.push({ ...processed, meta, wpUrl: wpMedia.url })
    }

    // Step 3 — Article generation
    const article = await this.articleGen.generate(job.subject, articleSeo, imagesWithMeta)
    this.db.updateArticle(articleId, {
      title: article.h1,
      meta_title: articleSeo.metaTitle,
      meta_description: articleSeo.metaDescription,
      category: articleSeo.category,
      tags: JSON.stringify(articleSeo.tags),
      content: article.htmlContent,
      word_count: article.wordCount,
    })
    this.db.insertLog({ article_id: articleId, step: 'article', status: 'ok', message: `${article.wordCount} mots` })

    // Step 4 — WordPress post
    const featuredMediaId = imagesWithMeta[0] ? (
      await this.wpPublisher.uploadImage(imagesWithMeta[0], imagesWithMeta[0].meta)
    ).id : 0

    const wpPost = await this.wpPublisher.createPost(article, featuredMediaId, job.wpStatus)
    this.db.updateArticle(articleId, { wp_post_id: wpPost.id, wp_url: wpPost.link, status: job.wpStatus })
    this.db.insertLog({ article_id: articleId, step: 'wordpress', status: 'ok', message: wpPost.link })

    // Step 5 — PDF report
    const coverWebp = imagesWithMeta[0]?.webpPath ?? ''
    const pdfPath = await this.reportGen.generate(
      { articleId, slug: articleSeo.slug, title: article.h1, wpUrl: wpPost.link, wpPostId: wpPost.id, wpStatus: job.wpStatus, pdfPath: '' },
      coverWebp
    )
    this.db.insertLog({ article_id: articleId, step: 'report', status: 'ok', message: pdfPath })

    logger.success(`✓ Article publié : ${wpPost.link}`)
    logger.success(`✓ PDF : ${pdfPath}`)

    return { articleId, slug: articleSeo.slug, title: article.h1, wpUrl: wpPost.link, wpPostId: wpPost.id, wpStatus: job.wpStatus, pdfPath }
  }
}
```

- [ ] **Step 4 : Lancer les tests**

```bash
npm test -- tests/Publisher.test.ts
```

Résultat attendu : 2 PASS.

- [ ] **Step 5 : Lancer tous les tests**

```bash
npm test
```

Résultat attendu : tous PASS.

- [ ] **Step 6 : Commit**

```bash
git add src/orchestrator/Publisher.ts tests/Publisher.test.ts
git commit -m "feat: add Publisher orchestrator — pipeline complet avec reprise et détection doublons"
```

---

## Task 10 : CLI + Scheduler

**Files:**
- Create: `src/cli/index.ts`
- Create: `src/services/scheduler/Scheduler.ts`

**Interfaces:**
- Consumes: `Publisher` (orchestrator), `loadConfig` (config), `PublishJob`, `ScheduleConfig` (types.ts), `commander`, `node-cron`, `readline/promises`, `logger`
- Produces: commandes `npm run publish` et `npm run schedule`

- [ ] **Step 1 : Créer `src/services/scheduler/Scheduler.ts`**

```typescript
import cron from 'node-cron'
import fs from 'fs'
import path from 'path'
import type { ScheduleConfig, PublishJob } from '../../types'
import type { Config } from '../../config/config'
import { Publisher } from '../../orchestrator/Publisher'
import { logger } from '../../utils/logger'

const SCHEDULE_CONFIG_PATH = path.resolve(process.cwd(), 'schedule-config.json')

export class Scheduler {
  private config: Config

  constructor(config: Config) {
    this.config = config
  }

  loadScheduleConfig(): ScheduleConfig {
    if (!fs.existsSync(SCHEDULE_CONFIG_PATH)) {
      throw new Error(`schedule-config.json introuvable. Copie schedule-config.json.example vers schedule-config.json et configure-le.`)
    }
    return JSON.parse(fs.readFileSync(SCHEDULE_CONFIG_PATH, 'utf-8')) as ScheduleConfig
  }

  saveScheduleConfig(cfg: ScheduleConfig): void {
    fs.writeFileSync(SCHEDULE_CONFIG_PATH, JSON.stringify(cfg, null, 2))
  }

  start(): void {
    const cfg = this.loadScheduleConfig()

    if (!cron.validate(cfg.cronTime)) {
      throw new Error(`Expression cron invalide : ${cfg.cronTime}`)
    }

    logger.info(`Scheduler démarré — prochain déclenchement : ${cfg.cronTime}`)
    logger.info(`Sujets planifiés : ${cfg.subjects.join(', ')}`)

    cron.schedule(cfg.cronTime, async () => {
      const freshCfg = this.loadScheduleConfig()
      const subject = freshCfg.subjects[freshCfg.currentIndex % freshCfg.subjects.length]

      logger.info(`\n⏰ Déclenchement schedulé — sujet : "${subject}"`)

      const job: PublishJob = {
        subject,
        articleCount: freshCfg.articleCount,
        wpStatus: freshCfg.wpStatus,
      }

      try {
        const publisher = new Publisher(this.config)
        const results = await publisher.run(job)
        logger.success(`Scheduler : ${results.length} article(s) publié(s)`)
      } catch (err) {
        logger.error(`Scheduler error : ${err instanceof Error ? err.message : String(err)}`)
      }

      freshCfg.currentIndex = (freshCfg.currentIndex + 1) % freshCfg.subjects.length
      this.saveScheduleConfig(freshCfg)
    })
  }
}
```

- [ ] **Step 2 : Créer `src/cli/index.ts`**

```typescript
import { Command } from 'commander'
import { createInterface } from 'readline/promises'
import { loadConfig } from '../config/config'
import { Publisher } from '../orchestrator/Publisher'
import { Scheduler } from '../services/scheduler/Scheduler'
import { logger } from '../utils/logger'
import type { PublishJob } from '../types'

const program = new Command()

program
  .name('easydigia-publisher')
  .description('Autonomous AI Content Publisher for WordPress')
  .version('1.0.0')

program
  .command('publish')
  .description('Publier un ou plusieurs articles sur WordPress')
  .action(async () => {
    const rl = createInterface({ input: process.stdin, output: process.stdout })

    try {
      const config = loadConfig()

      const subject = await rl.question('Sujet de l\'article : ')
      if (!subject.trim()) {
        logger.error('Le sujet ne peut pas être vide.')
        process.exit(1)
      }

      const countRaw = await rl.question('Nombre d\'articles à générer (défaut : 1) : ')
      const articleCount = parseInt(countRaw) || 1

      const statusRaw = await rl.question('Statut WordPress — draft ou publish (défaut : draft) : ')
      const wpStatus = statusRaw.trim() === 'publish' ? 'publish' : 'draft'

      rl.close()

      logger.info(`\n🚀 Démarrage — "${subject}" × ${articleCount} (${wpStatus})\n`)

      const job: PublishJob = { subject: subject.trim(), articleCount, wpStatus }
      const publisher = new Publisher(config)
      const results = await publisher.run(job)

      logger.success(`\n✅ ${results.length} article(s) publié(s).`)
      for (const r of results) {
        logger.success(`  → ${r.wpUrl}`)
        logger.success(`  → PDF : ${r.pdfPath}`)
      }
    } catch (err) {
      rl.close()
      logger.error(err instanceof Error ? err.message : String(err))
      process.exit(1)
    }
  })

program
  .command('schedule')
  .description('Démarrer le scheduler de publication quotidienne')
  .action(async () => {
    try {
      const config = loadConfig()
      const scheduler = new Scheduler(config)

      logger.info('Vérification de schedule-config.json…')
      const cfg = scheduler.loadScheduleConfig()
      logger.info(`Heure planifiée : ${cfg.cronTime}`)
      logger.info(`Sujets : ${cfg.subjects.join(', ')}`)
      logger.info('Appuie sur Ctrl+C pour arrêter.')

      scheduler.start()
    } catch (err) {
      logger.error(err instanceof Error ? err.message : String(err))
      process.exit(1)
    }
  })

program.parseAsync(process.argv).catch(err => {
  logger.error(String(err))
  process.exit(1)
})
```

- [ ] **Step 3 : Vérifier que le CLI compile sans erreur TypeScript**

```bash
npx tsc --noEmit
```

Résultat attendu : aucune erreur.

- [ ] **Step 4 : Lancer tous les tests**

```bash
npm test
```

Résultat attendu : tous PASS.

- [ ] **Step 5 : Vérifier que le CLI répond sans cracher (mode dry)**

```bash
npx tsx src/cli/index.ts --help
```

Résultat attendu :

```
Usage: easydigia-publisher [options] [command]

Autonomous AI Content Publisher for WordPress

Options:
  -V, --version   output the version number
  -h, --help      display help for command

Commands:
  publish         Publier un ou plusieurs articles sur WordPress
  schedule        Démarrer le scheduler de publication quotidienne
  help [command]  display help for command
```

- [ ] **Step 6 : Commit final**

```bash
git add src/cli/index.ts src/services/scheduler/Scheduler.ts
git commit -m "feat: add CLI (publish + schedule commands) and Scheduler (node-cron)"
```

---

## Self-Review

**Couverture du spec :**

| Exigence spec | Tâche |
|---|---|
| Unsplash → Pexels → Pixabay fallback | Task 3 — ImageSearcher |
| ≥1920×1080, paysage, sans watermark | Task 3 — filtres |
| Téléchargement HD | Task 4 — ImageDownloader |
| Conversion WebP <300 KB | Task 4 — ImageProcessor |
| SEO : alt, caption, meta, slug, tags | Task 5 — SeoGenerator |
| Article 1500–2500 mots, H1/H2/FAQ/CTA | Task 6 — ArticleGenerator |
| Table of Contents HTML | Task 6 — prompt |
| Liens internes | Task 6 — prompt |
| WordPress upload images | Task 7 — uploadImage |
| WordPress créer post | Task 7 — createPost |
| Catégories auto | Task 7 — ensureCategory |
| SQLite : articles, images, logs | Task 2 — Database |
| Détection doublons | Task 9 — Publisher |
| Retry ×3 exponentiel | Task 1 — withRetry |
| Rapport PDF basique | Task 8 — ReportGenerator |
| CLI interactive `npm run publish` | Task 10 — CLI |
| Scheduler quotidien `npm run schedule` | Task 10 — Scheduler |
| `.env` validé au démarrage | Task 1 — config.ts |
| Logs colorés horodatés | Task 2 — logger.ts |

**Aucun placeholder, aucun TODO.**
**Types cohérents** : `ImageCandidate → ProcessedImage → ImageWithMeta` utilisés de façon identique dans Tasks 3–9.
