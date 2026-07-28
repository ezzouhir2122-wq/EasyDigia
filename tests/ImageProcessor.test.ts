import { describe, it, expect, vi, beforeEach } from 'vitest'

const mockSharpInstance = {
  webp: vi.fn().mockReturnThis(),
  toFile: vi.fn().mockResolvedValue({ size: 200 * 1024 }),
}
vi.mock('sharp', () => ({ default: vi.fn(() => mockSharpInstance) }))

const MOCK_CONFIG = {
  webp: { quality: 85, maxKb: 300 },
  wp: { url: 'https://x.com', username: 'u', appPassword: 'p' },
  anthropic: { apiKey: 'sk' },
  imagesPerArticle: 3,
  defaultStatus: 'draft' as const,
  claudeModel: 'claude-sonnet-5',
}

describe('ImageProcessor', () => {
  beforeEach(() => vi.clearAllMocks())

  it('convertit en webp et retourne le chemin', async () => {
    const { ImageProcessor } = await import('../src/services/image/ImageProcessor')
    const processor = new ImageProcessor(MOCK_CONFIG as any)
    const result = await processor.process('assets/images/original/test-001.jpg', 'test', 0)
    expect(result.webpPath).toContain('test-001.webp')
    expect(result.webpSizeKb).toBeLessThanOrEqual(300)
  })

  it('réduit la qualité si le fichier dépasse maxKb', async () => {
    mockSharpInstance.toFile
      .mockResolvedValueOnce({ size: 400 * 1024 })
      .mockResolvedValue({ size: 200 * 1024 })
    const { ImageProcessor } = await import('../src/services/image/ImageProcessor')
    const processor = new ImageProcessor(MOCK_CONFIG as any)
    const result = await processor.process('assets/images/original/big-001.jpg', 'big', 0)
    expect(mockSharpInstance.webp).toHaveBeenCalledTimes(2)
    expect(result.webpSizeKb).toBeLessThanOrEqual(300)
  })
})
