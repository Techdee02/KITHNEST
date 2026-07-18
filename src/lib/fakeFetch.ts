/**
 * Simulates a network round-trip so loading states are real to build
 * against rather than purely cosmetic. No real network call is made —
 * Phase 2 swaps this for an actual API client behind the same call shape.
 */
export function fakeFetch<T>(data: T, opts: { delayMs?: number; failRate?: number } = {}): Promise<T> {
  const { delayMs = 700, failRate = 0 } = opts
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (failRate > 0 && Math.random() < failRate) {
        reject(new Error('Network request failed'))
      } else {
        resolve(data)
      }
    }, delayMs)
  })
}
