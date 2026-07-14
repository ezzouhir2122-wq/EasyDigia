// node:sqlite is a Node 22+ built-in; use require() to avoid Vite's static resolver
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { DatabaseSync } = require('node:sqlite') as typeof import('node:sqlite')
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
  article_id: number | null
  step: string
  status: 'ok' | 'error'
  message: string
  created_at?: string
}

export class Db {
  private db: DatabaseSync

  constructor(dbPath = DEFAULT_DB_PATH) {
    fs.mkdirSync(path.dirname(dbPath), { recursive: true })
    this.db = new DatabaseSync(dbPath)
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
    const stmt = this.db.prepare(`
      INSERT INTO articles (slug, title, meta_title, meta_description, category, tags, content, word_count, wp_post_id, wp_url, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `)
    const result = stmt.run(
      row.slug,
      row.title,
      row.meta_title ?? null,
      row.meta_description ?? null,
      row.category ?? null,
      row.tags ?? null,
      row.content ?? null,
      row.word_count ?? null,
      row.wp_post_id ?? null,
      row.wp_url ?? null,
      row.status
    )
    return Number(result.lastInsertRowid)
  }

  updateArticle(id: number, data: Partial<Omit<ArticleRow, 'id' | 'created_at'>>): void {
    const keys = Object.keys(data)
    if (keys.length === 0) return
    const fields = keys.map(k => `${k} = ?`).join(', ')
    const values = keys.map(k => (data as Record<string, unknown>)[k] ?? null)
    this.db.prepare(`UPDATE articles SET ${fields} WHERE id = ?`).run(...values, id)
  }

  getArticleById(id: number): ArticleRow | undefined {
    const row = this.db.prepare('SELECT * FROM articles WHERE id = ?').get(id)
    return row as ArticleRow | undefined
  }

  articleExistsBySlug(slug: string): boolean {
    const row = this.db.prepare('SELECT id FROM articles WHERE slug = ?').get(slug)
    return row !== undefined
  }

  insertImage(row: Omit<ImageRow, 'id'>): number {
    const stmt = this.db.prepare(`
      INSERT INTO images (article_id, original_path, webp_path, wp_media_id, wp_url, alt, caption, author, source_url, licence, width, height)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `)
    const result = stmt.run(
      row.article_id,
      row.original_path ?? null,
      row.webp_path ?? null,
      row.wp_media_id ?? null,
      row.wp_url ?? null,
      row.alt ?? null,
      row.caption ?? null,
      row.author ?? null,
      row.source_url ?? null,
      row.licence ?? null,
      row.width ?? null,
      row.height ?? null
    )
    return Number(result.lastInsertRowid)
  }

  updateImage(id: number, data: Partial<Omit<ImageRow, 'id'>>): void {
    const keys = Object.keys(data)
    if (keys.length === 0) return
    const fields = keys.map(k => `${k} = ?`).join(', ')
    const values = keys.map(k => (data as Record<string, unknown>)[k] ?? null)
    this.db.prepare(`UPDATE images SET ${fields} WHERE id = ?`).run(...values, id)
  }

  insertLog(row: Omit<LogRow, 'id' | 'created_at'>): void {
    this.db.prepare(`
      INSERT INTO logs (article_id, step, status, message)
      VALUES (?, ?, ?, ?)
    `).run(row.article_id, row.step, row.status, row.message)
  }

  close(): void {
    this.db.close()
  }
}
