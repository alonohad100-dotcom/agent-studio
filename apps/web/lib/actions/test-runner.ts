'use server'

import { requireAuth } from '@/lib/auth'
import { listTestCases } from './testing'
import { getPromptPackage } from './prompts'
import { PromptCompiler } from '@core/compiler'
import { getDraftSpec } from './drafts'
import { createClient } from '@/lib/supabase/server'
import { createAIProvider } from '@core/ai'
import { runTestSuite } from '@core/testing/runner'
import type { TestRunResult } from '@core/types/test'
import type { CapabilitiesJSON } from '@core/types/capabilities'

export async function runAllTests(agentId: string, useDraft: boolean = true): Promise<TestRunResult> {
  const user = await requireAuth()
  const supabase = await createClient()

  // Verify ownership
  const { data: agent, error: checkError } = await supabase
    .from('agents')
    .select('owner_id')
    .eq('id', agentId)
    .single()

  if (checkError || !agent) {
    throw new Error('Agent not found')
  }

  if (agent.owner_id !== user.id) {
    throw new Error('Unauthorized')
  }

  // Get test cases
  const testCases = await listTestCases(agentId)
  if (testCases.length === 0) {
    throw new Error('No test cases found')
  }

  // Get prompt package
  let promptPackage
  if (useDraft) {
    // Compile from draft
    const spec = await getDraftSpec(agentId)
    if (!spec) {
      throw new Error('No draft specification found')
    }

    const { data: draft } = await supabase
      .from('agent_drafts')
      .select('capabilities_json')
      .eq('agent_id', agentId)
      .single()

    const capabilities: CapabilitiesJSON = (draft?.capabilities_json as CapabilitiesJSON) || {
      information: { enabled: false },
      production: { enabled: false },
      decision_support: { enabled: false },
      automation: { enabled: false },
      domain_specific: { enabled: false, tags: [] },
    }

    // Get knowledge map
    const { data: files } = await supabase
      .from('files')
      .select('id, name, mime')
      .eq('agent_id', agentId)

    const { data: knowledgeSources } = await supabase
      .from('knowledge_sources')
      .select('file_id, spec_block_tags')
      .eq('agent_id', agentId)

    const knowledgeMap = files && files.length > 0
      ? {
          files: files.map((file) => ({
            id: file.id,
            name: file.name,
            type: file.mime || 'unknown',
            spec_blocks: knowledgeSources
              ?.filter((ks) => ks.file_id === file.id)
              .flatMap((ks) => ks.spec_block_tags || []) || [],
          })),
        }
      : undefined

    const compiler = new PromptCompiler()
    const compiled = await compiler.compile({
      spec,
      capabilities,
      knowledgeMap,
    })
    promptPackage = compiled.promptPackage
  } else {
    // Get from published version (for future implementation)
    const packageData = await getPromptPackage(agentId)
    if (!packageData) {
      throw new Error('No prompt package found')
    }
    promptPackage = packageData
  }

  // Get AI provider
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY environment variable is required')
  }

  const provider = createAIProvider(apiKey)

  // Run test suite
  const result = await runTestSuite(testCases, promptPackage, provider)

  // Save test run to database
  const { error: saveError } = await supabase.from('test_runs').insert({
    agent_id: agentId,
    agent_draft_id: useDraft ? (await supabase.from('agent_drafts').select('id').eq('agent_id', agentId).single()).data?.id : null,
    results: result.results,
    pass_rate: result.passRate,
    total_tests: result.totalTests,
    passed_tests: result.passedTests,
    failed_tests: result.failedTests,
    duration_ms: result.duration,
    created_by: user.id,
  })

  if (saveError) {
    console.error('Failed to save test run:', saveError)
  }

  return result
}

export async function runSingleTest(agentId: string, testCaseId: string, useDraft: boolean = true) {
  const user = await requireAuth()
  const supabase = await createClient()

  // Verify ownership
  const { data: agent, error: checkError } = await supabase
    .from('agents')
    .select('owner_id')
    .eq('id', agentId)
    .single()

  if (checkError || !agent) {
    throw new Error('Agent not found')
  }

  if (agent.owner_id !== user.id) {
    throw new Error('Unauthorized')
  }

  // Get test case
  const { data: testCase, error: testError } = await supabase
    .from('test_cases')
    .select('*')
    .eq('id', testCaseId)
    .eq('agent_id', agentId)
    .single()

  if (testError || !testCase) {
    throw new Error('Test case not found')
  }

  // Get prompt package (same logic as runAllTests)
  let promptPackage
  if (useDraft) {
    const spec = await getDraftSpec(agentId)
    if (!spec) {
      throw new Error('No draft specification found')
    }

    const { data: draft } = await supabase
      .from('agent_drafts')
      .select('capabilities_json')
      .eq('agent_id', agentId)
      .single()

    const capabilities: CapabilitiesJSON = (draft?.capabilities_json as CapabilitiesJSON) || {
      information: { enabled: false },
      production: { enabled: false },
      decision_support: { enabled: false },
      automation: { enabled: false },
      domain_specific: { enabled: false, tags: [] },
    }

    const compiler = new PromptCompiler()
    const compiled = await compiler.compile({
      spec,
      capabilities,
    })
    promptPackage = compiled.promptPackage
  } else {
    const packageData = await getPromptPackage(agentId)
    if (!packageData) {
      throw new Error('No prompt package found')
    }
    promptPackage = packageData
  }

  // Get AI provider
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY environment variable is required')
  }

  const provider = createAIProvider(apiKey)

  // Run single test
  const { runTest } = await import('@core/testing/runner')
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const result = await runTest(testCase as any, promptPackage, provider)

  return result
}

