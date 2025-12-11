'use server'

import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { measureServerAction } from '@/lib/telemetry/server'

const createAgentSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be 100 characters or less'),
  description: z.string().max(500, 'Description must be 500 characters or less').optional(),
})

const updateAgentSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().max(500).optional(),
  status: z.enum(['draft', 'published', 'archived']).optional(),
})

export async function createAgent(input: z.infer<typeof createAgentSchema>) {
  return measureServerAction('createAgent', async () => {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      throw new Error('Unauthorized')
    }

    const validated = createAgentSchema.parse(input)

    // Create agent
    const { data: agent, error: agentError } = await supabase
      .from('agents')
      .insert({
        owner_id: user.id,
        name: validated.name,
        description: validated.description,
      })
      .select()
      .single()

    if (agentError) {
      throw new Error(`Failed to create agent: ${agentError.message}`)
    }

    // Create initial draft
    const { error: draftError } = await supabase.from('agent_drafts').insert({
      agent_id: agent.id,
      spec_json: {},
      capabilities_json: {},
    })

    if (draftError) {
      // If draft creation fails, delete the agent to maintain consistency
      await supabase.from('agents').delete().eq('id', agent.id)
      throw new Error(`Failed to create draft: ${draftError.message}`)
    }

    // Create audit log
    await supabase.from('audit_logs').insert({
      agent_id: agent.id,
      user_id: user.id,
      action: 'agent_created',
      metadata: { name: validated.name },
    })

    revalidatePath('/app/agents')
    return agent
  })
}

export async function updateAgentMeta(
  agentId: string,
  updates: z.infer<typeof updateAgentSchema>
) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Unauthorized')
  }

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

  const validated = updateAgentSchema.parse(updates)

  const { data, error } = await supabase
    .from('agents')
    .update({
      ...validated,
      updated_at: new Date().toISOString(),
    })
    .eq('id', agentId)
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to update agent: ${error.message}`)
  }

  // Create audit log
  await supabase.from('audit_logs').insert({
    agent_id: agentId,
    user_id: user.id,
    action: 'agent_updated',
    metadata: { updates: validated },
  })

  revalidatePath('/app/agents')
  revalidatePath(`/app/agents/${agentId}/overview`)
  return data
}

export async function deleteAgent(agentId: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Unauthorized')
  }

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

  // Delete agent (cascade will delete drafts, versions, etc.)
  const { error } = await supabase.from('agents').delete().eq('id', agentId)

  if (error) {
    throw new Error(`Failed to delete agent: ${error.message}`)
  }

  // Create audit log
  await supabase.from('audit_logs').insert({
    agent_id: agentId,
    user_id: user.id,
    action: 'agent_deleted',
    metadata: {},
  })

  revalidatePath('/app/agents')
  redirect('/app/agents')
}

export async function getAgent(agentId: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Unauthorized')
  }

  const { data, error } = await supabase
    .from('agents')
    .select('*')
    .eq('id', agentId)
    .single()

  if (error || !data) {
    throw new Error('Agent not found')
  }

  // Verify ownership (RLS should handle this, but double-check)
  if (data.owner_id !== user.id) {
    throw new Error('Unauthorized')
  }

  return data
}

export interface ListAgentsFilters {
  status?: 'draft' | 'published' | 'archived'
  search?: string
}

export async function listAgents(filters: ListAgentsFilters = {}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Unauthorized')
  }

  let query = supabase.from('agents').select('*').eq('owner_id', user.id)

  // Apply status filter
  if (filters.status) {
    query = query.eq('status', filters.status)
  }

  // Apply search filter
  if (filters.search) {
    query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`)
  }

  // Order by updated_at descending
  query = query.order('updated_at', { ascending: false })

  const { data, error } = await query

  if (error) {
    throw new Error(`Failed to list agents: ${error.message}`)
  }

  return data || []
}

