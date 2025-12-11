'use server'

import { requireAuth } from '@/lib/auth'
import { getDraftSpec } from './drafts'
import { PromptCompiler } from '@core/compiler'
import { createClient } from '@/lib/supabase/server'
import type { CapabilitiesJSON } from '@core/types/capabilities'
import type { CompilerOutput } from '@core/compiler'

export async function compileDraftFull(agentId: string): Promise<CompilerOutput> {
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
    throw new Error('No draft specification found')
  }

  // Get draft capabilities
  const { data: draft } = await supabase
    .from('agent_drafts')
    .select('id, capabilities_json')
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

  // Compile
  const compiler = new PromptCompiler()
  const result = await compiler.compile({
    spec,
    capabilities,
    knowledgeMap,
  })

  return result
}

