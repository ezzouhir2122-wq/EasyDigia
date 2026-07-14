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
