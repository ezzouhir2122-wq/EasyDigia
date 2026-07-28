import { describe, it, expect, vi, beforeEach } from 'vitest'
import axios from 'axios'
import fs from 'fs'

vi.mock('axios')
vi.mock('fs', async (importOriginal) => {
  const actual = await importOriginal<typeof fs>()
  return { ...actual, readFileSync: vi.fn().mockReturnValue(Buffer.from('fake-image-data')) }
})
// Mock withRetry to call the function once with no delays — keeps tests fast
// while still exercising all the real error-surfacing and branching logic.
vi.mock('../src/utils/retry', () => ({
  withRetry: (fn: () => Promise<unknown>) => fn(),
}))

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

  // Fix 3: error-path test for uploadImage
  it('uploadImage rejette si axios.post échoue', async () => {
    vi.mocked(axios.post).mockRejectedValue(
      Object.assign(new Error('Network error'), { response: { data: { message: 'Upload failed' } } })
    )
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
    await expect(publisher.uploadImage(img, meta)).rejects.toThrow('Upload failed')
  })

  it('crée un post WordPress et retourne id + lien', async () => {
    // Fix 5: mock axios.get so ensureCategory and ensureTags see empty results
    vi.mocked(axios.get).mockResolvedValue({ data: [] })
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

  // Fix 3: error-path test for createPost
  it('createPost rejette si axios.post échoue lors de la création du post', async () => {
    // Mock axios.get for ensureCategory/ensureTags (returns existing entries)
    vi.mocked(axios.get).mockResolvedValue({ data: [{ id: 5, name: 'IA' }] })
    vi.mocked(axios.post).mockRejectedValue(
      Object.assign(new Error('Server error'), { response: { data: { message: 'Post creation failed' } } })
    )
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
    await expect(publisher.createPost(article, 42, 'draft')).rejects.toThrow('Post creation failed')
  })

  it('crée une catégorie si elle n\'existe pas', async () => {
    vi.mocked(axios.get).mockResolvedValue({ data: [] })
    vi.mocked(axios.post).mockResolvedValue({ data: { id: 5 } })
    const { WordPressPublisher } = await import('../src/services/wordpress/WordPressPublisher')
    const publisher = new WordPressPublisher(MOCK_CONFIG as any)
    const id = await publisher.ensureCategory('Nouvelle Catégorie')
    expect(id).toBe(5)
  })

  // Fix 3: error-path test for ensureCategory
  it('ensureCategory rejette si axios.get échoue', async () => {
    vi.mocked(axios.get).mockRejectedValue(
      Object.assign(new Error('Network error'), { response: { data: { message: 'Unauthorized' } } })
    )
    const { WordPressPublisher } = await import('../src/services/wordpress/WordPressPublisher')
    const publisher = new WordPressPublisher(MOCK_CONFIG as any)
    await expect(publisher.ensureCategory('IA')).rejects.toThrow('Unauthorized')
  })

  // Fix 6: "category already exists" branch test
  it('ensureCategory retourne l\'id existant sans créer si la catégorie existe déjà', async () => {
    vi.mocked(axios.get).mockResolvedValue({ data: [{ id: 5, name: 'IA' }] })
    const { WordPressPublisher } = await import('../src/services/wordpress/WordPressPublisher')
    const publisher = new WordPressPublisher(MOCK_CONFIG as any)
    const id = await publisher.ensureCategory('IA')
    expect(id).toBe(5)
    expect(axios.post).not.toHaveBeenCalled()
  })
})
