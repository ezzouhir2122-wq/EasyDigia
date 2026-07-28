import axios from 'axios'
import fs from 'fs'
import type { Config } from '../../config/config'
import type { ProcessedImage, SeoImageMeta, GeneratedArticle, WpMedia, WpPost } from '../../types'
import { withRetry } from '../../utils/retry'
import { logger } from '../../utils/logger'

export class WordPressApiError extends Error {
  constructor(action: string, detail: string) {
    super(`WordPress API error (${action}): ${detail}`)
    this.name = 'WordPressApiError'
  }
}

export class WordPressPublisher {
  private authHeader: string
  private baseUrl: string

  constructor(private config: Config) {
    const token = Buffer.from(
      `${config.wp.username}:${config.wp.appPassword}`
    ).toString('base64')
    this.authHeader = `Basic ${token}`
    this.baseUrl = config.wp.url.replace(/\/$/, '')
  }

  async uploadImage(img: ProcessedImage, meta: SeoImageMeta): Promise<WpMedia> {
    logger.step('Upload image WordPress', meta.seoFilename)
    const fileData = fs.readFileSync(img.webpPath)

    // Fix 4: Separate retry blocks — upload and metadata update are independent
    // so a metadata failure doesn't re-trigger the upload POST.
    const uploadRes = await withRetry(async () => {
      try {
        const res = await axios.post(`${this.baseUrl}/wp-json/wp/v2/media`, fileData, {
          headers: {
            Authorization: this.authHeader,
            'Content-Type': 'image/webp',
            'Content-Disposition': `attachment; filename="${meta.seoFilename}"`,
          },
        })
        if (!res.data.id) throw new WordPressApiError('uploadImage', 'no id in response')
        return res
      } catch (err: unknown) {
        const wpMsg = (err as any)?.response?.data?.message
        throw new Error(wpMsg ?? `uploadImage failed: ${String(err)}`)
      }
    }, 3, 'uploadImage:upload')

    await withRetry(async () => {
      try {
        await axios.post(`${this.baseUrl}/wp-json/wp/v2/media/${uploadRes.data.id}`, {
          alt_text: meta.alt,
          caption: meta.caption,
          title: meta.seoTitle,
          description: meta.description,
        }, { headers: { Authorization: this.authHeader } })
      } catch (err: unknown) {
        const wpMsg = (err as any)?.response?.data?.message
        throw new Error(wpMsg ?? `uploadImage metadata update failed: ${String(err)}`)
      }
    }, 3, 'uploadImage:metadata')

    return { id: uploadRes.data.id, url: uploadRes.data.source_url }
  }

  async ensureCategory(name: string): Promise<number> {
    return withRetry(async () => {
      try {
        const searchRes = await axios.get(`${this.baseUrl}/wp-json/wp/v2/categories`, {
          headers: { Authorization: this.authHeader },
          params: { search: name, per_page: 1 },
        })
        if (searchRes?.data?.length > 0) return searchRes.data[0].id as number

        const createRes = await axios.post(`${this.baseUrl}/wp-json/wp/v2/categories`,
          { name },
          { headers: { Authorization: this.authHeader } }
        )
        return createRes.data.id as number
      } catch (err: unknown) {
        const wpMsg = (err as any)?.response?.data?.message
        throw new Error(wpMsg ?? `ensureCategory failed: ${String(err)}`)
      }
    }, 3, 'ensureCategory')
  }

  async createPost(
    article: GeneratedArticle,
    featuredMediaId: number,
    wpStatus: string
  ): Promise<WpPost> {
    logger.step('Publication WordPress', article.seo.slug)

    const categoryId = await this.ensureCategory(article.seo.category)

    const tagIds = await this.ensureTags(article.seo.tags)

    return withRetry(async () => {
      try {
        const res = await axios.post(`${this.baseUrl}/wp-json/wp/v2/posts`, {
          title: article.h1,
          content: article.htmlContent,
          status: wpStatus,
          slug: article.seo.slug,
          featured_media: featuredMediaId,
          categories: [categoryId],
          tags: tagIds,
          excerpt: article.seo.metaDescription,
        }, { headers: { Authorization: this.authHeader } })

        if (!res.data.id) throw new WordPressApiError('createPost', 'no id in response')
        return { id: res.data.id, link: res.data.link, status: res.data.status, slug: res.data.slug }
      } catch (err: unknown) {
        const wpMsg = (err as any)?.response?.data?.message
        throw new Error(wpMsg ?? `createPost failed: ${String(err)}`)
      }
    }, 3, 'createPost')
  }

  private async ensureTags(tagNames: string[]): Promise<number[]> {
    const ids: number[] = []
    for (const name of tagNames) {
      try {
        await withRetry(async () => {
          const searchRes = await axios.get(`${this.baseUrl}/wp-json/wp/v2/tags`, {
            headers: { Authorization: this.authHeader },
            params: { search: name, per_page: 1 },
          })
          if (searchRes?.data?.length > 0) {
            ids.push(searchRes.data[0].id as number)
          } else {
            const createRes = await axios.post(`${this.baseUrl}/wp-json/wp/v2/tags`,
              { name },
              { headers: { Authorization: this.authHeader } }
            )
            ids.push(createRes.data.id as number)
          }
        }, 3, `ensureTags:${name}`)
      } catch (err: unknown) {
        const wpMsg = (err as any)?.response?.data?.message
        logger.warn(`ensureTags: tag "${name}" failed — ${wpMsg ?? String(err)}`)
        // tag creation failure is non-fatal — continue without this tag
      }
    }
    return ids
  }
}
