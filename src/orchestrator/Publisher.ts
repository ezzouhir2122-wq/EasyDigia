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
import { withRetry } from '../utils/retry'
import { logger } from '../utils/logger'

// Extends ProcessedImage with SEO metadata and the WordPress media id/url already
// uploaded — storing wpMediaId here avoids calling uploadImage a second time when
// setting the post's featured_media.
type ImageWithMeta = ProcessedImage & { meta: SeoImageMeta; wpMediaId: number; wpUrl: string }

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
      logger.info(`\n--- Article ${i + 1}/${job.articleCount} : "${job.subject}" ---`)
      try {
        const result = await this.publishOne(job)
        if (result) results.push(result)
      } catch (err) {
        logger.error(`Article ${i + 1} echoue : ${err instanceof Error ? err.message : String(err)}`)
        this.db.insertLog({
          article_id: null as unknown as number,
          step: `pipeline:${job.subject}`,
          status: 'error',
          message: err instanceof Error ? err.message : String(err),
        })
      }
    }

    return results
  }

  private async publishOne(job: PublishJob): Promise<PublicationResult | null> {
    // Step 1 — Article SEO (slug needed for duplicate check)
    logger.step('Generation SEO article')
    const articleSeo = await this.seoGen.generateArticleSeo(job.subject)

    let slug = articleSeo.slug
    let n = 2
    while (this.db.articleExistsBySlug(slug)) {
      logger.warn(`Doublon detecte — slug "${slug}" existe deja. Tentative avec suffixe -${n}.`)
      slug = `${articleSeo.slug}-${n++}`
    }
    articleSeo.slug = slug

    const articleId = this.db.insertArticle({ slug: articleSeo.slug, title: job.subject, status: 'pending' })
    this.db.insertLog({ article_id: articleId, step: 'seo', status: 'ok', message: `slug: ${articleSeo.slug}` })

    // Step 2 — Images: search → download → process → SEO → upload (store wpMediaId)
    logger.step('Recherche images', job.subject)
    const candidates = await this.searcher.search(job.subject, this.config.imagesPerArticle)
    this.db.insertLog({
      article_id: articleId,
      step: 'image_search',
      status: 'ok',
      message: `${candidates.length} images trouvees`,
    })

    const imagesWithMeta: ImageWithMeta[] = []

    for (let idx = 0; idx < candidates.length; idx++) {
      const candidate = candidates[idx]

      const originalPath = await this.downloader.download(candidate, articleSeo.slug, idx)
      this.db.insertLog({ article_id: articleId, step: 'download', status: 'ok', message: originalPath })

      const { webpPath, webpSizeKb } = await withRetry(() => this.processor.process(originalPath, articleSeo.slug, idx), 3, 'Publisher:process')
      this.db.insertLog({ article_id: articleId, step: 'process', status: 'ok', message: `${webpSizeKb} KB` })

      const processed: ProcessedImage = { ...candidate, originalPath, webpPath, webpSizeKb }

      const meta = await this.seoGen.generateImageMeta(processed, job.subject)
      this.db.insertLog({ article_id: articleId, step: 'seo_image', status: 'ok', message: meta.seoFilename })

      // Upload to WordPress once — the returned id is kept in wpMediaId so we can
      // reference the same media when setting the post's featured_media later.
      const wpMedia = await this.wpPublisher.uploadImage(processed, meta)
      this.db.insertLog({
        article_id: articleId,
        step: 'wp_media',
        status: 'ok',
        message: `media_id: ${wpMedia.id}`,
      })

      this.db.insertImage({
        article_id: articleId,
        original_path: originalPath,
        webp_path: webpPath,
        wp_media_id: wpMedia.id,
        wp_url: wpMedia.url,
        alt: meta.alt,
        caption: meta.caption,
        author: candidate.author,
        source_url: candidate.sourceUrl,
        licence: candidate.licence,
        width: candidate.width,
        height: candidate.height,
      })

      imagesWithMeta.push({ ...processed, meta, wpMediaId: wpMedia.id, wpUrl: wpMedia.url })
    }

    // Step 3 — Article generation
    logger.step('Generation article', job.subject)
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
    this.db.insertLog({
      article_id: articleId,
      step: 'article',
      status: 'ok',
      message: `${article.wordCount} mots`,
    })

    // Step 4 — WordPress post — reuse stored wpMediaId, no second upload
    const featuredMediaId = imagesWithMeta[0]?.wpMediaId ?? 0

    logger.step('Publication WordPress', articleSeo.slug)
    const wpPost = await this.wpPublisher.createPost(article, featuredMediaId, job.wpStatus)
    this.db.updateArticle(articleId, { wp_post_id: wpPost.id, wp_url: wpPost.link, status: job.wpStatus })
    this.db.insertLog({ article_id: articleId, step: 'wordpress', status: 'ok', message: wpPost.link })

    // Step 5 — PDF report
    const partialResult: PublicationResult = {
      articleId,
      slug: articleSeo.slug,
      title: article.h1,
      wpUrl: wpPost.link,
      wpPostId: wpPost.id,
      wpStatus: job.wpStatus,
      pdfPath: '',
    }

    const coverWebp = imagesWithMeta[0]?.webpPath
    const pdfPath = await this.reportGen.generate(partialResult, articleSeo, coverWebp)
    this.db.insertLog({ article_id: articleId, step: 'report', status: 'ok', message: pdfPath })

    logger.success(`Article publie : ${wpPost.link}`)
    logger.success(`PDF : ${pdfPath}`)

    return { ...partialResult, pdfPath }
  }
}
