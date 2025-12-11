/**
 * AI Provider Factory
 * Creates the appropriate AI provider based on configuration
 */

import type { AIProvider } from './types'
import { OpenAIProvider } from './openai'

export function createAIProvider(apiKey?: string, provider?: string): AIProvider {
  const providerName = provider || (typeof process !== 'undefined' ? process.env.AI_PROVIDER : 'openai') || 'openai'
  const key = apiKey || (typeof process !== 'undefined' ? process.env.OPENAI_API_KEY : undefined)

  if (!key) {
    throw new Error('OpenAI API key is required')
  }

  switch (providerName) {
    case 'openai':
      return new OpenAIProvider(key)
    default:
      throw new Error(`Unsupported AI provider: ${providerName}`)
  }
}

