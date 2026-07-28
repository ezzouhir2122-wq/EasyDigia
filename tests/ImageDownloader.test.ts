import { describe, it, expect, vi, afterEach } from 'vitest'
import fs from 'fs'

describe('ImageDownloader', () => {
  afterEach(() => {
    vi.restoreAllMocks()
    vi.useRealTimers()
  })

  it('télécharge et retourne le chemin local', async () => {
    // Create a fake write stream that emits 'finish' immediately
    const fakeWriter = {
      on: vi.fn().mockImplementation(function(this: any, event: string, cb: () => void) {
        if (event === 'finish') setTimeout(cb, 0)
        return this
      }),
      write: vi.fn(),
      end: vi.fn(),
    }
    vi.spyOn(fs, 'mkdirSync').mockImplementation(() => undefined)
    vi.spyOn(fs, 'createWriteStream').mockReturnValue(fakeWriter as any)

    // Fake HTTP response stream
    const fakeResponseStream = {
      pipe: vi.fn().mockImplementation(() => fakeWriter),
      on: vi.fn().mockReturnThis(),
    }

    const { default: axios } = await import('axios')
    vi.spyOn(axios, 'get').mockResolvedValue({ data: fakeResponseStream })

    const { ImageDownloader } = await import('../src/services/image/ImageDownloader')
    const downloader = new ImageDownloader({
      wp: { url: 'https://x.com', username: 'u', appPassword: 'p' },
      anthropic: { apiKey: 'sk' },
      unsplash: { accessKey: 'uk' },
      webp: { quality: 85, maxKb: 300 },
      imagesPerArticle: 3,
      defaultStatus: 'draft',
      claudeModel: 'claude-sonnet-5',
    } as any)

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
    expect(fs.createWriteStream).toHaveBeenCalled()
  })

  it('rejette si le stream HTTP emet une erreur', async () => {
    vi.useFakeTimers()

    const fakeWriter = {
      on: vi.fn().mockReturnThis(),
      write: vi.fn(),
      end: vi.fn(),
    }
    vi.spyOn(fs, 'mkdirSync').mockImplementation(() => undefined)
    vi.spyOn(fs, 'createWriteStream').mockReturnValue(fakeWriter as any)

    // Error is emitted synchronously so it fires before withRetry can delay
    const fakeResponseStream = {
      pipe: vi.fn(),
      on: vi.fn().mockImplementation(function(this: any, event: string, cb: (err: Error) => void) {
        if (event === 'error') cb(new Error('network error'))
        return this
      }),
    }

    const { default: axios } = await import('axios')
    vi.spyOn(axios, 'get').mockResolvedValue({ data: fakeResponseStream })

    const { ImageDownloader } = await import('../src/services/image/ImageDownloader')
    const downloader = new ImageDownloader({
      wp: { url: 'https://x.com', username: 'u', appPassword: 'p' },
      anthropic: { apiKey: 'sk' },
      unsplash: { accessKey: 'uk' },
      webp: { quality: 85, maxKb: 300 },
      imagesPerArticle: 3,
      defaultStatus: 'draft',
      claudeModel: 'claude-sonnet-5',
    } as any)

    const candidate = {
      url: 'https://x.com/1.jpg', author: 'A', sourceUrl: 'https://x.com', licence: 'L',
      width: 1920, height: 1080, provider: 'unsplash' as const,
    }

    const downloadPromise = downloader.download(candidate, 'err-slug', 0)
    // Attach rejection handler before advancing timers to avoid unhandled rejection warning
    const expectation = expect(downloadPromise).rejects.toThrow()
    // Advance all fake timers to skip withRetry's retry delays (1s + 2s + 4s)
    await vi.runAllTimersAsync()
    await expectation
  })
})
