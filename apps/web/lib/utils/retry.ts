/**
 * Retry utility for handling transient failures
 * Useful for network requests and database operations
 */

export interface RetryOptions {
  maxRetries?: number
  delay?: number
  onRetry?: (error: unknown, attempt: number) => void
}

/**
 * Retry a function with exponential backoff
 * @param fn Function to retry
 * @param options Retry configuration
 * @returns Result of the function
 * @throws Last error if all retries fail
 */
export async function retry<T>(fn: () => Promise<T>, options: RetryOptions = {}): Promise<T> {
  const { maxRetries = 3, delay = 1000, onRetry } = options

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn()
    } catch (error) {
      // If this is the last retry, throw the error
      if (i === maxRetries - 1) {
        throw error
      }

      // Call onRetry callback if provided
      if (onRetry) {
        onRetry(error, i + 1)
      }

      // Wait before retrying with exponential backoff
      const waitTime = delay * Math.pow(2, i)
      await new Promise(resolve => setTimeout(resolve, waitTime))
    }
  }

  // This should never be reached, but TypeScript needs it
  throw new Error('Retry failed')
}
