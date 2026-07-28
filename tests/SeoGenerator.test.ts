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

// vi.hoisted runs before module imports, so we define constants inline
const { createMock } = vi.hoisted(() => {
  const imageMeta = JSON.stringify({
    alt: "Comptable utilisant l'IA pour analyser des données financières",
    caption: "L'intelligence artificielle révolutionne la comptabilité moderne",
    seoTitle: "Intelligence Artificielle Comptabilité",
    description: "Photo professionnelle montrant l'usage de l'IA en comptabilité",
    seoFilename: "intelligence-artificielle-comptabilite.webp",
  })
  const articleSeo = JSON.stringify({
    metaTitle: "Intelligence Artificielle en Comptabilité 2026",
    metaDescription: "Découvrez comment l'IA transforme la comptabilité avec des outils automatisés, des analyses prédictives et des gains de productivité mesurables.",
    slug: "intelligence-artificielle-comptabilite-guide",
    tags: ["IA", "Comptabilité", "Automatisation", "Finance"],
    category: "Intelligence Artificielle",
    keywords: ["intelligence artificielle comptabilité", "AI accounting", "automatisation financière"],
  })
  const createMock = vi.fn()
    .mockResolvedValueOnce({ content: [{ type: 'text', text: imageMeta }] })
    .mockResolvedValueOnce({ content: [{ type: 'text', text: articleSeo }] })
  return { createMock }
})

vi.mock('@anthropic-ai/sdk', () => ({
  default: vi.fn().mockImplementation(() => ({
    messages: {
      create: createMock,
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
    expect(seo.metaTitle.length).toBeLessThanOrEqual(60)
    expect(seo.metaDescription.length).toBeLessThanOrEqual(160)
    expect(seo.slug).toMatch(/^[a-z0-9-]+$/)
    expect(seo.tags.length).toBeGreaterThan(0)
  })
})
