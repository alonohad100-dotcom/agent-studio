'use server'

import { requireAuth } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { PromptCompiler } from '@core/compiler'
import { getDraftSpec } from './drafts'
import { measureServerAction } from '@/lib/telemetry/server'
import type { AgentVersion, PublishGateResult } from '@core/types/version'
import type { CapabilitiesJSON } from '@core/types/capabilities'

/**
 * Get all versions for an agent
 */
export async function getAgentVersions(agentId: string): Promise<AgentVersion[]> {
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

  const { data, error } = await supabase
    .from('agent_versions')
    .select('*')
    .eq('agent_id', agentId)
    .order('version_number', { ascending: false })

  if (error) {
    throw new Error(`Failed to get versions: ${error.message}`)
  }

  return (data as AgentVersion[]) || []
}

/**
 * Get a specific version by ID
 */
export async function getVersion(versionId: string): Promise<AgentVersion | null> {
  const user = await requireAuth()
  const supabase = await createClient()

  const { data: version, error: versionError } = await supabase
    .from('agent_versions')
    .select('*, agents!inner(owner_id)')
    .eq('id', versionId)
    .single()

  if (versionError || !version) {
    return null
  }

  // Type assertion needed because Supabase returns nested structure
  const agent = version.agents as { owner_id: string }
  if (agent.owner_id !== user.id) {
    throw new Error('Unauthorized')
  }

  // Remove nested agents data
  const { agents: _agents, ...versionData } = version as unknown as AgentVersion & { agents: unknown }
  return versionData as AgentVersion
}

/**
 * Check publish gates before publishing
 */
export async function checkPublishGates(agentId: string): Promise<PublishGateResult> {
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

  // Get draft spec
  const spec = await getDraftSpec(agentId)
  if (!spec) {
    return {
      passed: false,
      reasons: ['No draft specification found'],
      details: {
        qualityScore: { value: 0, threshold: 70, passed: false },
        criticalLintFindings: { count: 0, passed: true },
        testCasesExist: { count: 0, passed: false },
      },
    }
  }

  // Get draft capabilities
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

  // Compile to get quality score and lint findings
  const compiler = new PromptCompiler()
  const compiled = await compiler.compile({
    spec,
    capabilities,
    knowledgeMap,
  })

  // Check test cases
  const { count: testCaseCount } = await supabase
    .from('test_cases')
    .select('*', { count: 'exact', head: true })
    .eq('agent_id', agentId)

  // Check latest test run pass rate
  const { data: latestTestRun } = await supabase
    .from('test_runs')
    .select('pass_rate')
    .eq('agent_id', agentId)
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  const reasons: string[] = []
  const qualityScore = Math.round(compiled.qualityScore.overall)
  const qualityScorePassed = qualityScore >= 70

  if (!qualityScorePassed) {
    reasons.push(`Quality score ${qualityScore} below threshold (70)`)
  }

  const criticalFindings = compiled.lintFindings.filter((f) => f.severity === 'critical')
  const criticalLintPassed = criticalFindings.length === 0

  if (!criticalLintPassed) {
    reasons.push(`${criticalFindings.length} critical lint finding${criticalFindings.length !== 1 ? 's' : ''}`)
  }

  const testCasesExist = (testCaseCount || 0) > 0
  if (!testCasesExist) {
    reasons.push('No test cases defined')
  }

  return {
    passed: reasons.length === 0,
    reasons,
    details: {
      qualityScore: {
        value: qualityScore,
        threshold: 70,
        passed: qualityScorePassed,
      },
      criticalLintFindings: {
        count: criticalFindings.length,
        passed: criticalLintPassed,
      },
      testCasesExist: {
        count: testCaseCount || 0,
        passed: testCasesExist,
      },
      testPassRate: {
        value: latestTestRun?.pass_rate || null,
        threshold: 80, // Optional threshold
        passed: true, // Optional check, doesn't block
      },
    },
  }
}

/**
 * Publish a new version of an agent
 */
export async function publishVersion(agentId: string): Promise<AgentVersion> {
  return measureServerAction('publishVersion', async () => {
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

  // Check publish gates
  const gates = await checkPublishGates(agentId)
  if (!gates.passed) {
    throw new Error(`Publish blocked: ${gates.reasons.join(', ')}`)
  }

  // Get draft spec
  const spec = await getDraftSpec(agentId)
  if (!spec) {
    throw new Error('No draft specification found')
  }

  // Get draft capabilities
  const { data: draft } = await supabase
    .from('agent_drafts')
    .select('capabilities_json')
    .eq('agent_id', agentId)
    .single()

  if (!draft) {
    throw new Error('No draft found')
  }

  const capabilities: CapabilitiesJSON = (draft.capabilities_json as CapabilitiesJSON) || {
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

  // Compile to get latest prompt package and score
  const compiler = new PromptCompiler()
  const compiled = await compiler.compile({
    spec,
    capabilities,
    knowledgeMap,
  })

  // Get next version number
  const { data: latestVersion } = await supabase
    .from('agent_versions')
    .select('version_number')
    .eq('agent_id', agentId)
    .order('version_number', { ascending: false })
    .limit(1)
    .single()

  const nextVersion = (latestVersion?.version_number || 0) + 1

  // Get latest test run pass rate
  const { data: latestTestRun } = await supabase
    .from('test_runs')
    .select('pass_rate')
    .eq('agent_id', agentId)
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  // Create version (immutable snapshot)
  const { data: version, error } = await supabase
    .from('agent_versions')
    .insert({
      agent_id: agentId,
      version_number: nextVersion,
      spec_snapshot: spec,
      prompt_package: compiled.promptPackage,
      capabilities: capabilities,
      knowledge_map: knowledgeMap || null,
      quality_score: Math.round(compiled.qualityScore.overall),
      test_pass_rate: latestTestRun?.pass_rate || null,
      created_by: user.id,
    })
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to create version: ${error.message}`)
  }

  // Update agent status
  await supabase
    .from('agents')
    .update({ status: 'published', updated_at: new Date().toISOString() })
    .eq('id', agentId)

  // Create audit log
  await supabase.from('audit_logs').insert({
    agent_id: agentId,
    user_id: user.id,
    action: 'version_published',
    metadata: { version_id: version.id, version_number: nextVersion },
  })

    revalidatePath(`/app/agents/${agentId}/versions`)
    revalidatePath(`/app/agents/${agentId}/overview`)

    return version as AgentVersion
  })
}

