import { describe, it, expect, vi, afterEach } from 'vitest'
import fs from 'fs'

const mockDoc = {
  pipe: vi.fn().mockReturnThis(),
  fontSize: vi.fn().mockReturnThis(),
  fillColor: vi.fn().mockReturnThis(),
  font: vi.fn().mockReturnThis(),
  text: vi.fn().mockReturnThis(),
  moveDown: vi.fn().mockReturnThis(),
  moveTo: vi.fn().mockReturnThis(),
  lineTo: vi.fn().mockReturnThis(),
  stroke: vi.fn().mockReturnThis(),
  image: vi.fn().mockReturnThis(),
  end: vi.fn(),
  y: 100,
}

vi.mock('pdfkit', () => ({ default: vi.fn(() => mockDoc) }))

describe('ReportGenerator', () => {
  afterEach(() => vi.clearAllMocks())

  it('génère un PDF et retourne le chemin', async () => {
    vi.spyOn(fs, 'mkdirSync').mockReturnValue(undefined as any)
    vi.spyOn(fs, 'existsSync').mockReturnValue(true)
    vi.spyOn(fs, 'createWriteStream').mockReturnValue({
      on: vi.fn().mockImplementation(function(this: any, event: string, cb: () => void) {
        if (event === 'finish') setTimeout(cb, 0)
        return this
      }),
    } as any)

    const { ReportGenerator } = await import('../src/services/report/ReportGenerator')
    const gen = new ReportGenerator()
    const result = {
      articleId: 1,
      slug: 'ia-comptabilite',
      title: 'IA en Comptabilité',
      wpUrl: 'https://easydigia.com/ia-comptabilite',
      wpPostId: 42,
      wpStatus: 'draft' as const,
      pdfPath: '',
    }
    const seo = {
      metaTitle: 'IA en Comptabilité | EasyDigia',
      metaDescription: 'Découvrez comment l\'IA transforme la comptabilité.',
      slug: 'ia-comptabilite',
      tags: ['IA', 'comptabilité', 'finance'],
      category: 'Technologie',
      keywords: ['intelligence artificielle', 'comptabilité'],
    }
    const pdfPath = await gen.generate(result, seo, 'assets/images/webp/test-001.webp')
    expect(pdfPath).toContain('ia-comptabilite')
    expect(pdfPath).toContain('report-')
    expect(pdfPath.endsWith('.pdf')).toBe(true)
    expect(pdfPath).toContain('assets')
    expect(mockDoc.text).toHaveBeenCalled()
    expect(mockDoc.end).toHaveBeenCalled()
  })

  it('rejette si le stream écrit une erreur', async () => {
    vi.spyOn(fs, 'mkdirSync').mockReturnValue(undefined as any)
    vi.spyOn(fs, 'existsSync').mockReturnValue(false)
    vi.spyOn(fs, 'createWriteStream').mockReturnValue({
      on: vi.fn().mockImplementation(function(this: any, event: string, cb: (err?: Error) => void) {
        if (event === 'error') setTimeout(() => cb(new Error('disk full')), 0)
        return this
      }),
    } as any)

    const { ReportGenerator } = await import('../src/services/report/ReportGenerator')
    const gen = new ReportGenerator()
    const result = {
      articleId: 2,
      slug: 'test-error',
      title: 'Test Error',
      wpUrl: 'https://easydigia.com/test-error',
      wpPostId: 99,
      wpStatus: 'draft' as const,
      pdfPath: '',
    }
    const seo = {
      metaTitle: 'Test Error',
      metaDescription: 'Test.',
      slug: 'test-error',
      tags: ['test'],
      category: 'Test',
      keywords: ['test'],
    }
    await expect(gen.generate(result, seo, 'assets/images/webp/test-002.webp')).rejects.toThrow('disk full')
  })
})
