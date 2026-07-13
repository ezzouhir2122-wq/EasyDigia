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

  it('cree les tables sans erreur', () => {
    db = new Db(TEST_DB)
    expect(db).toBeDefined()
  })

  it('insere et retrouve un article par slug', () => {
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

  it("met a jour le statut d'un article", () => {
    db = new Db(TEST_DB)
    const id = db.insertArticle({ slug: 'up-test', title: 'Up', status: 'pending' })
    db.updateArticle(id, { status: 'published', wp_post_id: 42, wp_url: 'https://example.com/up-test' })
    const row = db.getArticleById(id)
    expect(row?.status).toBe('published')
    expect(row?.wp_post_id).toBe(42)
  })

  it('insere une image liee a un article', () => {
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

  it('insere un log', () => {
    db = new Db(TEST_DB)
    const articleId = db.insertArticle({ slug: 'log-test', title: 'Log', status: 'pending' })
    expect(() => db.insertLog({
      article_id: articleId,
      step: 'image_search',
      status: 'ok',
      message: 'Trouve 10 images',
    })).not.toThrow()
  })
})
