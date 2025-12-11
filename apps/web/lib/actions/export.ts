'use server'

import { requireAuth } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import { measureServerAction } from '@/lib/telemetry/server'
import type { AgentVersion } from '@core/types/version'

export interface ExportBundle {
  agentConfig: {
    agent: {
      id: string
      name: string
      description: string | null
      created_at: string
    }
    active_version_id: string
    active_version_number: number
    capabilities: unknown
  }
  promptPackage: unknown
  testReport: {
    version_id: string
    version_number: number
    test_cases: unknown[]
    latest_run: unknown | null
    pass_rate: number | null
    quality_score: number
    generated_at: string
  }
}

/**
 * Export a bundle for an agent (version or latest)
 */
export async function exportBundle(agentId: string, versionId?: string): Promise<ExportBundle> {
  return measureServerAction('exportBundle', async () => {
    const user = await requireAuth()
    const supabase = await createClient()

  // Verify ownership
  const { data: agent, error: agentError } = await supabase
    .from('agents')
    .select('*')
    .eq('id', agentId)
    .single()

  if (agentError || !agent) {
    throw new Error('Agent not found')
  }

  if (agent.owner_id !== user.id) {
    throw new Error('Unauthorized')
  }

  // Get version (or latest)
  let version: AgentVersion | null = null

  if (versionId) {
    const { data, error } = await supabase
      .from('agent_versions')
      .select('*')
      .eq('id', versionId)
      .eq('agent_id', agentId)
      .single()

    if (error || !data) {
      throw new Error('Version not found')
    }
    version = data as AgentVersion
  } else {
    // Get latest version
    const { data, error } = await supabase
      .from('agent_versions')
      .select('*')
      .eq('agent_id', agentId)
      .order('version_number', { ascending: false })
      .limit(1)
      .single()

    if (error || !data) {
      throw new Error('No published version found. Please publish a version first.')
    }
    version = data as AgentVersion
  }

  if (!version) {
    throw new Error('Version not found')
  }

  // Get test cases
  const { data: testCases } = await supabase
    .from('test_cases')
    .select('*')
    .eq('agent_id', agentId)

  // Get latest test run for this version
  const { data: testRuns } = await supabase
    .from('test_runs')
    .select('*')
    .eq('agent_version_id', version.id)
    .order('created_at', { ascending: false })
    .limit(1)

  // Build export bundle
  const agentConfig = {
    agent: {
      id: agent.id,
      name: agent.name,
      description: agent.description,
      created_at: agent.created_at,
    },
    active_version_id: version.id,
    active_version_number: version.version_number,
    capabilities: version.capabilities,
  }

  const promptPackage = version.prompt_package

  const testReport = {
    version_id: version.id,
    version_number: version.version_number,
    test_cases: testCases || [],
    latest_run: testRuns?.[0] || null,
    pass_rate: version.test_pass_rate ?? null,
    quality_score: version.quality_score,
    generated_at: new Date().toISOString(),
  }

    return {
      agentConfig,
      promptPackage,
      testReport,
    }
  })
}

// generateExportFiles moved to lib/utils/export.ts (not a server action)

