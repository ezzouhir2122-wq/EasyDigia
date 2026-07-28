import { describe, it, expect, vi, afterEach } from 'vitest'
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

afterEach(() => vi.clearAllMocks())

const MOCK_CONFIG = {
  wp: { url: 'https://easydigia.com', username: 'u', appPassword: 'p' },
  anthropic: { apiKey: 'sk' },
  unsplash: { accessKey: 'uk' },
  webp: { quality: 85, maxKb: 300 },
  imagesPerArticle: 1,
  defaultStatus: 'draft' as const,
  claudeModel: 'claude-sonnet-5',
}

describe('Publisher', () => {
  it('exécute le pipeline complet et retourne les résultats', async () => {
    const { Publisher } = await import('../src/orchestrator/Publisher')
    const publisher = new Publisher(MOCK_CONFIG as any)
    const job: PublishJob = { subject: 'IA', articleCount: 1, wpStatus: 'draft' }
    const results = await publisher.run(job)
    expect(results).toHaveLength(1)
    expect(results[0].slug).toBe('ia-guide')
    expect(results[0].wpPostId).toBe(99)
    expect(results[0].pdfPath).toContain('.pdf')
  })

  it('publie un article avec un slug suffixé si le slug initial existe déjà en DB', async () => {
    const { Publisher } = await import('../src/orchestrator/Publisher')
    const { Db } = await import('../src/database/Database')
    vi.mocked(Db).mockImplementationOnce(() => ({
      articleExistsBySlug: vi.fn().mockReturnValueOnce(true).mockReturnValue(false),
      insertArticle: vi.fn().mockReturnValue(1),
      updateArticle: vi.fn(),
      insertImage: vi.fn().mockReturnValue(1),
      updateImage: vi.fn(),
      insertLog: vi.fn(),
      close: vi.fn(),
    }))
    const publisher = new Publisher(MOCK_CONFIG as any)
    const results = await publisher.run({ subject: 'IA', articleCount: 1, wpStatus: 'draft' })
    expect(results).toHaveLength(1)
    expect(results[0].slug).toBe('ia-guide-2')
  })

  it('gère gracieusement une ImageNotFoundError et log l\'erreur en DB', async () => {
    const { Publisher } = await import('../src/orchestrator/Publisher')
    const { ImageSearcher, ImageNotFoundError } = await import('../src/services/image/ImageSearcher')
    const { Db } = await import('../src/database/Database')
    const mockInsertLog = vi.fn()
    vi.mocked(Db).mockImplementationOnce(() => ({
      articleExistsBySlug: vi.fn().mockReturnValue(false),
      insertArticle: vi.fn().mockReturnValue(1),
      updateArticle: vi.fn(),
      insertImage: vi.fn().mockReturnValue(1),
      updateImage: vi.fn(),
      insertLog: mockInsertLog,
      close: vi.fn(),
    }))
    vi.mocked(ImageSearcher).mockImplementationOnce(() => ({
      search: vi.fn().mockRejectedValueOnce(new ImageNotFoundError('IA')),
    }))
    const publisher = new Publisher(MOCK_CONFIG as any)
    const results = await publisher.run({ subject: 'IA', articleCount: 1, wpStatus: 'draft' })
    expect(results).toHaveLength(0)
    expect(mockInsertLog).toHaveBeenCalledWith(
      expect.objectContaining({ status: 'error' })
    )
  })
})
