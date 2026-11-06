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

    const prompt = `Tu écris pour EasyDigia, une agence marocaine d'IA et d'automatisation (plus de 50 projets livrés en 3 ans pour des PME en immobilier, retail, restauration, santé, logistique, etc.). Tu rédiges au nom de l'équipe EasyDigia, avec une vraie expérience terrain.

Rédige un article complet en HTML pour le sujet : "${subject}"

Contraintes de fond (qualité & E-E-A-T) :
- Langue : français professionnel, clair, concret. Écris pour un dirigeant de PME, pas pour un moteur de recherche.
- Expérience terrain : illustre avec au moins 2 exemples concrets ou mini-cas d'usage (secteurs réels : immobilier, restauration, e-commerce, santé, logistique…). Montre comment EasyDigia procède réellement.
- Sources : n'avance une statistique QUE si tu peux l'attribuer à une source crédible avec l'année (ex. « selon McKinsey, 2024 »). Si tu n'as pas de source fiable, exprime l'idée qualitativement SANS chiffre inventé. N'invente jamais de données.
- Apport original : donne un angle, un conseil actionnable ou une nuance qu'on ne trouve pas partout. Pas de remplissage.

Interdits (anti-contenu générique) :
- Pas d'introductions creuses type « Dans un monde en constante évolution… », pas de généralités vagues, pas de transitions vides.
- Varie la longueur des phrases. Sois spécifique plutôt que grandiloquent.

Structure obligatoire :
- H1 unique et accrocheur.
- Dès le premier paragraphe : une réponse directe et synthétique à l'intention de recherche (answer-first).
- Un encadré « Points clés » (<ul>) juste après l'intro (3–5 puces).
- Table des matières (<nav id="toc">).
- Au minimum 5 H2 ; formule-les autant que possible comme des questions réelles, avec une réponse directe en début de section.
- FAQ (<dl><dt><dd>) de 3–5 questions concrètes (prix, délai, intégration, ROI).
- Conclusion + Call To Action vers EasyDigia.

SEO & maillage :
- Longueur : 1500 à 2500 mots.
- Utilise ces mots-clés naturellement : ${seo.keywords.join(', ')}
- Catégorie : ${seo.category}
- Insère 2 à 4 liens internes pertinents parmi : /services, /tarifs, /contact, /realisations, et une page solution du type /solutions/chatbot-ia-pour-restaurants (choisis le secteur le plus proche du sujet).
- À chaque H2, insère une de ces balises image au moment le plus pertinent :
${imageInsertions}
- Remplace les balises [INSÉRER_IMAGE_N: ...] par de vraies balises HTML <figure><img src="..." alt="..." /><figcaption>...</figcaption></figure>

Réponds UNIQUEMENT avec le HTML de l'article, sans markdown, sans balises html/body/head.`

    const htmlContent = await withRetry(async () => {
      const res = await this.client.messages.create({
        model: this.config.claudeModel,
        max_tokens: 8192,
        messages: [{ role: 'user', content: prompt }],
      })
      const block = res.content[0]
      if (!block || block.type !== 'text') throw new ArticleGenerationError(subject, 'réponse non textuelle')
      // Un article de 1500-2500 mots en HTML dépasse 4096 tokens : si la sortie
      // est coupée par la limite, on relance (via withRetry) plutôt que de
      // publier un article tronqué (FAQ/conclusion/CTA manquants).
      if (res.stop_reason === 'max_tokens') {
        throw new ArticleGenerationError(subject, 'réponse tronquée (max_tokens atteint)')
      }
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
