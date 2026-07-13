import axios from 'axios'
import type { Config } from '../../config/config'
import type { ImageCandidate } from '../../types'
import { withRetry } from '../../utils/retry'
import { logger } from '../../utils/logger'

export class ImageNotFoundError extends Error {
  constructor(subject: string) {
    super(`Aucune image trouvée pour : "${subject}"`)
    this.name = 'ImageNotFoundError'
  }
}

const QUERIES_FROM_SUBJECT = (subject: string): string[] => [
  subject,
  `${subject} professionnel`,
  `technology business`,
  `digital innovation`,
  `modern office`,
]

export class ImageSearcher {
  constructor(private config: Config) {}

  async search(subject: string, count: number): Promise<ImageCandidate[]> {
    const queries = QUERIES_FROM_SUBJECT(subject)

    for (const query of queries) {
      if (this.config.unsplash) {
        logger.step('Recherche Unsplash', query)
        const results = await withRetry(
          () => this.searchUnsplash(query, count),
          3,
          'Unsplash'
        )
        if (results.length > 0) return results.slice(0, count)
      }

      if (this.config.pexels) {
        logger.step('Recherche Pexels', query)
        const results = await withRetry(
          () => this.searchPexels(query, count),
          3,
          'Pexels'
        )
        if (results.length > 0) return results.slice(0, count)
      }

      if (this.config.pixabay) {
        logger.step('Recherche Pixabay', query)
        const results = await withRetry(
          () => this.searchPixabay(query, count),
          3,
          'Pixabay'
        )
        if (results.length > 0) return results.slice(0, count)
      }
    }

    throw new ImageNotFoundError(subject)
  }

  private async searchUnsplash(query: string, count: number): Promise<ImageCandidate[]> {
    const res = await axios.get('https://api.unsplash.com/search/photos', {
      headers: { Authorization: `Client-ID ${this.config.unsplash!.accessKey}` },
      params: { query, per_page: Math.max(count, 10), orientation: 'landscape' },
    })
    const items: any[] = res?.data?.results
    if (!Array.isArray(items)) return []
    return items
      .filter((p: any) => p.width >= 1920 && p.height >= 1080)
      .map((p: any): ImageCandidate => ({
        url: p.urls.full,
        author: p.user.name,
        sourceUrl: p.links.html,
        licence: 'Unsplash License',
        width: p.width,
        height: p.height,
        provider: 'unsplash',
      }))
  }

  private async searchPexels(query: string, count: number): Promise<ImageCandidate[]> {
    const res = await axios.get('https://api.pexels.com/v1/search', {
      headers: { Authorization: this.config.pexels!.apiKey },
      params: { query, per_page: Math.max(count, 10), orientation: 'landscape' },
    })
    const items: any[] = res?.data?.photos
    if (!Array.isArray(items)) return []
    return items
      .filter((p: any) => p.width >= 1920 && p.height >= 1080)
      .map((p: any): ImageCandidate => ({
        url: p.src.original,
        author: p.photographer,
        sourceUrl: p.photographer_url,
        licence: 'Pexels License',
        width: p.width,
        height: p.height,
        provider: 'pexels',
      }))
  }

  private async searchPixabay(query: string, count: number): Promise<ImageCandidate[]> {
    const res = await axios.get('https://pixabay.com/api/', {
      params: {
        key: this.config.pixabay!.apiKey,
        q: query,
        per_page: Math.max(count, 10),
        orientation: 'horizontal',
        image_type: 'photo',
        min_width: 1920,
        min_height: 1080,
      },
    })
    const items: any[] = res?.data?.hits
    if (!Array.isArray(items)) return []
    return items.map((p: any): ImageCandidate => ({
      url: p.largeImageURL,
      author: p.user,
      sourceUrl: p.pageURL,
      licence: 'Pixabay License',
      width: p.imageWidth,
      height: p.imageHeight,
      provider: 'pixabay',
    }))
  }
}
