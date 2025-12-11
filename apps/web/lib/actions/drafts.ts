'use server'

import { createClient } from '@/lib/supabase/server'
import { requireAuth } from '@/lib/auth'
import { revalidatePath } from 'next/cache'
import type { SpecJSON } from '@core/types/spec'
import type { CapabilitiesJSON } from '@core/types/capabilities'

export async function saveDraftSpec(agentId: string, specJson: Partial<SpecJSON>) {
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

  // Get current draft
  const { data: currentDraft } = await supabase
    .from('agent_drafts')
    .select('spec_json')
    .eq('agent_id', agentId)
    .single()

  // Merge with existing spec
  const currentSpec = (currentDraft?.spec_json as SpecJSON) || {}
  const updatedSpec = { ...currentSpec, ...specJson }

  // Update draft
  const { data, error } = await supabase
    .from('agent_drafts')
    .update({
      spec_json: updatedSpec,
      updated_at: new Date().toISOString(),
    })
    .eq('agent_id', agentId)
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to save draft: ${error.message}`)
  }

  revalidatePath(`/app/agents/${agentId}/spec`)
  revalidatePath(`/app/agents/${agentId}/overview`)

  return data
}

export async function getDraftSpec(agentId: string): Promise<SpecJSON | null> {
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

  // Get draft
  const { data: draft, error } = await supabase
    .from('agent_drafts')
    .select('spec_json')
    .eq('agent_id', agentId)
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      // No draft found, return empty spec
      return null
    }
    throw new Error(`Failed to get draft: ${error.message}`)
  }

  return (draft?.spec_json as SpecJSON) || null
}

export async function saveDraftCapabilities(agentId: string, capabilitiesJson: Partial<CapabilitiesJSON>) {
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

  // Get current draft
  const { data: currentDraft } = await supabase
    .from('agent_drafts')
    .select('capabilities_json')
    .eq('agent_id', agentId)
    .single()

  // Merge with existing capabilities
  const currentCapabilities = (currentDraft?.capabilities_json as CapabilitiesJSON) || {}
  const updatedCapabilities = { ...currentCapabilities, ...capabilitiesJson }

  // Update draft
  const { data, error } = await supabase
    .from('agent_drafts')
    .update({
      capabilities_json: updatedCapabilities,
      updated_at: new Date().toISOString(),
    })
    .eq('agent_id', agentId)
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to save capabilities: ${error.message}`)
  }

  revalidatePath(`/app/agents/${agentId}/capabilities`)
  revalidatePath(`/app/agents/${agentId}/overview`)

  return data
}

export async function getDraftCapabilities(agentId: string): Promise<CapabilitiesJSON | null> {
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

  // Get draft
  const { data: draft, error } = await supabase
    .from('agent_drafts')
    .select('capabilities_json')
    .eq('agent_id', agentId)
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      // No draft found, return null
      return null
    }
    throw new Error(`Failed to get capabilities: ${error.message}`)
  }

  return (draft?.capabilities_json as CapabilitiesJSON) || null
}

