import { describe, it, expect, vi, beforeEach } from 'vitest'
import axios from 'axios'

vi.mock('axios')
const mockedAxios = vi.mocked(axios)

const MOCK_CONFIG = {
  unsplash: { accessKey: 'unsplash-key' },
  pexels: { apiKey: 'pexels-key' },
  pixabay: { apiKey: 'pixabay-key' },
  webp: { quality: 85, maxKb: 300 },
  imagesPerArticle: 3,
  defaultStatus: 'draft' as const,
  claudeModel: 'claude-sonnet-5',
  wp: { url: 'https://example.com', username: 'u', appPassword: 'p' },
  anthropic: { apiKey: 'sk-ant' },
}

const UNSPLASH_RESPONSE = {
  data: {
    results: [
      {
        urls: { full: 'https://images.unsplash.com/photo-1.jpg' },
        user: { name: 'Alice Photo' },
        links: { html: 'https://unsplash.com/photos/1' },
        width: 4000,
        height: 2667,
      },
    ],
  },
}

describe('ImageSearcher', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('retourne des images Unsplash si disponibles', async () => {
    mockedAxios.get = vi.fn().mockResolvedValue(UNSPLASH_RESPONSE)
    const { ImageSearcher } = await import('../src/services/image/ImageSearcher')
    const searcher = new ImageSearcher(MOCK_CONFIG)
    const results = await searcher.search('intelligence artificielle', 1)
    expect(results).toHaveLength(1)
    expect(results[0].provider).toBe('unsplash')
    expect(results[0].author).toBe('Alice Photo')
    expect(results[0].licence).toBe('Unsplash License')
  })

  it('bascule sur Pexels si Unsplash renvoie 0 résultat', async () => {
    const QUERIES_COUNT = 5 // QUERIES_FROM_SUBJECT returns 5 queries
    const emptyUnsplash = { data: { results: [] } }
    const pexelsResponse = {
      data: {
        photos: [{
          src: { original: 'https://images.pexels.com/1.jpg' },
          photographer: 'Bob',
          photographer_url: 'https://pexels.com/u/bob',
          width: 3000,
          height: 2000,
        }],
      },
    }
    mockedAxios.get = vi.fn()
      // 5 Unsplash queries all empty
      .mockResolvedValueOnce(emptyUnsplash)
      .mockResolvedValueOnce(emptyUnsplash)
      .mockResolvedValueOnce(emptyUnsplash)
      .mockResolvedValueOnce(emptyUnsplash)
      .mockResolvedValueOnce(emptyUnsplash)
      // First Pexels query returns results
      .mockResolvedValueOnce(pexelsResponse)
    const { ImageSearcher } = await import('../src/services/image/ImageSearcher')
    const searcher = new ImageSearcher(MOCK_CONFIG)
    const results = await searcher.search('comptabilité', 1)
    expect(results[0].provider).toBe('pexels')
    expect(results[0].licence).toBe('Pexels License')
  })

  it('lève ImageNotFoundError si tous les providers échouent', async () => {
    mockedAxios.get = vi.fn().mockResolvedValue({ data: { results: [], photos: [], hits: [] } })
    const { ImageSearcher, ImageNotFoundError } = await import('../src/services/image/ImageSearcher')
    const searcher = new ImageSearcher(MOCK_CONFIG)
    await expect(searcher.search('xyz inexistant', 1)).rejects.toThrow(ImageNotFoundError)
  })
})
