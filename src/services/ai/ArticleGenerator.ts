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
      if (!block || block.type !== 'text') throw new ArticleGenerationError(subject, 'réponse non textuelle')
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
