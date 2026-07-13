import { describe, it, expect, vi } from 'vitest'
import { withRetry } from '../src/utils/retry'

describe('withRetry', () => {
  it('retourne le résultat immédiatement si succès au 1er essai', async () => {
    const fn = vi.fn().mockResolvedValue('ok')
    const result = await withRetry(fn, 3, 'test')
    expect(result).toBe('ok')
    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('réessaie et réussit au 2ème essai', async () => {
    const fn = vi.fn()
      .mockRejectedValueOnce(new Error('fail'))
      .mockResolvedValue('ok')
    vi.useFakeTimers()
    const promise = withRetry(fn, 3, 'test')
    await vi.runAllTimersAsync()
    const result = await promise
    expect(result).toBe('ok')
    expect(fn).toHaveBeenCalledTimes(2)
    vi.useRealTimers()
  })

  it('lève une erreur après tous les essais épuisés', async () => {
    const fn = vi.fn().mockRejectedValue(new Error('always fail'))
    vi.useFakeTimers()
    const promise = withRetry(fn, 2, 'test')
    // Attach rejection handler before running timers to avoid unhandled rejection
    const assertion = expect(promise).rejects.toThrow('test failed after 3 attempts')
    await vi.runAllTimersAsync()
    await assertion
    vi.useRealTimers()
  })
})
