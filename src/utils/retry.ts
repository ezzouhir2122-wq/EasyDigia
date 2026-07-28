export async function withRetry<T>(
  fn: () => Promise<T>,
  retries = 3,
  label = 'operation'
): Promise<T> {
  const delays = [1000, 2000, 4000]
  let lastError: unknown

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fn()
    } catch (err) {
      lastError = err
      if (attempt < retries) {
        await new Promise(resolve => setTimeout(resolve, delays[attempt] ?? 4000))
      }
    }
  }

  throw lastError
}
