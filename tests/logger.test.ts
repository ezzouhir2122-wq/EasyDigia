import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

describe('logger', () => {
  beforeEach(() => {
    vi.spyOn(process.stdout, 'write').mockImplementation(() => true)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('logger.info ecrit sur stdout sans throw', async () => {
    const { logger } = await import('../src/utils/logger')
    expect(() => logger.info('test message')).not.toThrow()
  })

  it('logger.success ecrit sur stdout sans throw', async () => {
    const { logger } = await import('../src/utils/logger')
    expect(() => logger.success('done')).not.toThrow()
  })

  it('logger.error ecrit sur stdout sans throw', async () => {
    const { logger } = await import('../src/utils/logger')
    expect(() => logger.error('oops')).not.toThrow()
  })
})
