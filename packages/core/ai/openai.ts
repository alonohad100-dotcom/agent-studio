/**
 * OpenAI Provider Implementation
 */

import OpenAI from 'openai'
import type { AIProvider, GenerateOptions } from './types'

export class OpenAIProvider implements AIProvider {
  private client: OpenAI

  constructor(apiKey: string) {
    if (!apiKey) {
      throw new Error('OpenAI API key is required')
    }
    this.client = new OpenAI({ apiKey })
  }

  async generateText(prompt: string, options?: GenerateOptions): Promise<string> {
    try {
      const response = await this.client.chat.completions.create({
        model: options?.model || 'gpt-4-turbo-preview',
        messages: [{ role: 'user', content: prompt }],
        temperature: options?.temperature ?? 0.7,
        max_tokens: options?.maxTokens ?? 2000,
      })

      return response.choices[0]?.message?.content || ''
    } catch (error) {
      throw new Error(`OpenAI API error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  async *streamText(prompt: string, options?: GenerateOptions): AsyncIterable<string> {
    try {
      const stream = await this.client.chat.completions.create({
        model: options?.model || 'gpt-4-turbo-preview',
        messages: [{ role: 'user', content: prompt }],
        temperature: options?.temperature ?? 0.7,
        max_tokens: options?.maxTokens ?? 2000,
        stream: true,
      })

      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content
        if (content) {
          yield content
        }
      }
    } catch (error) {
      throw new Error(`OpenAI streaming error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }
}

