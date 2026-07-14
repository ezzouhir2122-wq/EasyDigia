import { describe, it, expect, vi, beforeEach } from 'vitest'
import axios from 'axios'
import fs from 'fs'

vi.mock('axios')
vi.mock('fs', async (importOriginal) => {
  const actual = await importOriginal<typeof fs>()
  return {
    ...actual,
    createWriteStream: vi.fn().mockReturnValue({
      on: vi.fn().mockImplementation(function(this: any, event: string, cb: () => void) {
        if (event === 'finish') cb()
        return this
      }),
      end: vi.fn(),
    }),
    mkdirSync: vi.fn(),
  }
})

const MOCK_CONFIG = {
  wp: { url: 'https://example.com', username: 'u', appPassword: 'p' },
  anthropic: { apiKey: 'sk' },
  unsplash: { accessKey: 'uk' },
  webp: { quality: 85, maxKb: 300 },
  imagesPerArticle: 3,
  defaultStatus: 'draft' as const,
  claudeModel: 'claude-sonnet-5',
}

describe('ImageDownloader', () => {
  it('télécharge et retourne le chemin local', async () => {
    const mockStream = {
      pipe: vi.fn(),
      on: vi.fn().mockImplementation(function(this: any, _: string, cb: () => void) {
        cb(); return this
      }),
    }
    vi.mocked(axios.get).mockResolvedValue({ data: mockStream })
    const { ImageDownloader } = await import('../src/services/image/ImageDownloader')
    const downloader = new ImageDownloader(MOCK_CONFIG as any)
    const candidate = {
      url: 'https://images.unsplash.com/1.jpg',
      author: 'Alice',
      sourceUrl: 'https://unsplash.com/1',
      licence: 'Unsplash License',
      width: 3000,
      height: 2000,
      provider: 'unsplash' as const,
    }
    const result = await downloader.download(candidate, 'test-slug', 0)
    expect(result).toContain('test-slug-001.jpg')
  })
})
