import { describe, it, expect, vi } from 'vitest'

// vi.hoisted ensures this value is available when vi.mock factory runs (hoisted before const declarations)
const { MOCK_ARTICLE_HTML, mockCreate } = vi.hoisted(() => {
  const html = `<h1>L'Intelligence Artificielle Révolutionne la Comptabilité</h1>
<nav id="toc"><ul><li><a href="#intro">Introduction</a></li><li><a href="#avantages">Avantages</a></li></ul></nav>
<h2 id="intro">Introduction</h2>
<p>L'intelligence artificielle transforme profondément les métiers comptables.</p>
<h2 id="avantages">Les Principaux Avantages</h2>
<p>Les bénéfices sont multiples : gain de temps, réduction des erreurs humaines.</p>
<h2>FAQ</h2>
<dl><dt>L'IA remplace-t-elle les comptables ?</dt><dd>Non, elle les augmente.</dd></dl>
<h2>Conclusion</h2>
<p>L'adoption de l'IA en comptabilité est incontournable.</p>
<p><strong>Contactez EasyDigia pour automatiser votre cabinet dès aujourd'hui.</strong></p>`
  const create = vi.fn().mockResolvedValue({ content: [{ type: 'text', text: html }] })
  return { MOCK_ARTICLE_HTML: html, mockCreate: create }
})

vi.mock('@anthropic-ai/sdk', () => ({
  default: vi.fn().mockImplementation(() => ({
    messages: { create: mockCreate },
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
  metaDescription: "Guide complet sur l'IA en comptabilité",
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
  it('génère un article HTML avec H1, TOC, au moins 4 H2, FAQ, CTA', async () => {
    const { ArticleGenerator } = await import('../src/services/ai/ArticleGenerator')
    const gen = new ArticleGenerator(MOCK_CONFIG as any)
    const article = await gen.generate(
      'Intelligence Artificielle en Comptabilité',
      MOCK_SEO,
      MOCK_IMAGES
    )
    expect(article.h1).toContain('Intelligence Artificielle')
    expect((article.htmlContent.match(/<h2/gi) ?? []).length).toBeGreaterThanOrEqual(4)
    expect(article.htmlContent).toContain('id="toc"')
    expect(article.wordCount).toBeGreaterThan(0)
    expect(article.seo).toEqual(MOCK_SEO)
  })

  it('lève ArticleGenerationError si la réponse Claude n\'est pas textuelle', async () => {
    mockCreate.mockResolvedValueOnce({ content: [{ type: 'image', source: {} }] })
    const { ArticleGenerator, ArticleGenerationError } = await import('../src/services/ai/ArticleGenerator')
    const gen = new ArticleGenerator(MOCK_CONFIG as any)
    await expect(gen.generate('IA', MOCK_SEO, [])).rejects.toThrow(ArticleGenerationError)
  })
})
