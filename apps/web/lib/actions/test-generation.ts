'use server'

import { requireAuth } from '@/lib/auth'
import { getDraftSpec } from './drafts'
import { createAIProvider } from '@core/ai'
import { generateTestCasesFromSpec, generateSafetyTests } from '@core/testing/generator'
import { createTestCase } from './testing'
import type { TestCaseInput } from '@core/types/test'

export async function generateTestSuite(agentId: string) {
  const user = await requireAuth()

  // Verify ownership
  const { createClient } = await import('@/lib/supabase/server')
  const supabase = await createClient()
  const { data: agent } = await supabase
    .from('agents')
    .select('owner_id')
    .eq('id', agentId)
    .single()

  if (!agent || agent.owner_id !== user.id) {
    throw new Error('Unauthorized')
  }

  // Get spec
  const spec = await getDraftSpec(agentId)
  if (!spec) {
    throw new Error('No specification found')
  }

  // Generate test cases
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY environment variable is required')
  }

  const provider = createAIProvider(apiKey)
  const testCases = await generateTestCasesFromSpec(spec, provider)

  // Create test cases in database
  const created = []
  for (const testCase of testCases) {
    try {
      const result = await createTestCase(agentId, testCase)
      created.push(result)
    } catch (error) {
      console.error(`Failed to create test case ${testCase.name}:`, error)
    }
  }

  return { created: created.length, total: testCases.length }
}

export async function generateSafetyTestSuite(agentId: string) {
  const user = await requireAuth()

  // Verify ownership
  const { createClient } = await import('@/lib/supabase/server')
  const supabase = await createClient()
  const { data: agent } = await supabase
    .from('agents')
    .select('owner_id')
    .eq('id', agentId)
    .single()

  if (!agent || agent.owner_id !== user.id) {
    throw new Error('Unauthorized')
  }

  // Get spec
  const spec = await getDraftSpec(agentId)
  if (!spec) {
    throw new Error('No specification found')
  }

  // Generate safety tests
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY environment variable is required')
  }

  const provider = createAIProvider(apiKey)
  const testCases = await generateSafetyTests(spec, provider)

  // Create test cases in database
  const created = []
  for (const testCase of testCases) {
    try {
      const result = await createTestCase(agentId, testCase)
      created.push(result)
    } catch (error) {
      console.error(`Failed to create safety test case ${testCase.name}:`, error)
    }
  }

  return { created: created.length, total: testCases.length }
}

