/**
 * AI Provider Types
 */

export interface GenerateOptions {
  temperature?: number
  maxTokens?: number
  model?: string
}

export interface AIProvider {
  generateText(prompt: string, options?: GenerateOptions): Promise<string>
  streamText(prompt: string, options?: GenerateOptions): AsyncIterable<string>
}

