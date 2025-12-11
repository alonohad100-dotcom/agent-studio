'use server'

import { requireAuth } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import type { PromptPackageJSON } from '@core/types/prompt'

export async function getPromptPackage(agentId: string): Promise<PromptPackageJSON | null> {
  const user = await requireAuth()

  const supabase = await createClient()

  // Verify ownership
  const { data: agent } = await supabase
    .from('agents')
    .select('owner_id')
    .eq('id', agentId)
    .single()

  if (!agent || agent.owner_id !== user.id) {
    throw new Error('Unauthorized')
  }

  // Get draft
  const { data: draft } = await supabase
    .from('agent_drafts')
    .select('id')
    .eq('agent_id', agentId)
    .single()

  if (!draft) {
    return null
  }

  // Get prompt package
  const { data: promptPackage } = await supabase
    .from('prompt_packages')
    .select('package_json')
    .eq('agent_draft_id', draft.id)
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  if (!promptPackage) {
    return null
  }

  return promptPackage.package_json as PromptPackageJSON
}

