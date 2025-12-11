'use server'

import { createClient } from '@/lib/supabase/server'
import { requireAuth } from '@/lib/auth'
import { revalidatePath } from 'next/cache'
import type { TestCase, TestCaseInput } from '@core/types/test'

export async function createTestCase(agentId: string, testCase: TestCaseInput) {
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

  // Create test case
  const { data, error } = await supabase
    .from('test_cases')
    .insert({
      agent_id: agentId,
      name: testCase.name,
      type: testCase.type,
      input: testCase.input,
      expected: testCase.expected,
      created_by: user.id,
    })
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to create test case: ${error.message}`)
  }

  revalidatePath(`/app/agents/${agentId}/testing`)
  return data
}

export async function updateTestCase(agentId: string, testCaseId: string, updates: Partial<TestCaseInput>) {
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

  // Update test case
  const updateData: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  }

  if (updates.name) updateData.name = updates.name
  if (updates.type) updateData.type = updates.type
  if (updates.input) updateData.input = updates.input
  if (updates.expected) updateData.expected = updates.expected

  const { data, error } = await supabase
    .from('test_cases')
    .update(updateData)
    .eq('id', testCaseId)
    .eq('agent_id', agentId)
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to update test case: ${error.message}`)
  }

  revalidatePath(`/app/agents/${agentId}/testing`)
  return data
}

export async function deleteTestCase(agentId: string, testCaseId: string) {
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

  // Delete test case
  const { error } = await supabase
    .from('test_cases')
    .delete()
    .eq('id', testCaseId)
    .eq('agent_id', agentId)

  if (error) {
    throw new Error(`Failed to delete test case: ${error.message}`)
  }

  revalidatePath(`/app/agents/${agentId}/testing`)
}

export async function listTestCases(agentId: string) {
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
  const { data, error } = await supabase
    .from('test_cases')
    .select('*')
    .eq('agent_id', agentId)
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error(`Failed to list test cases: ${error.message}`)
  }

  return (data as TestCase[]) || []
}

export async function getTestCase(agentId: string, testCaseId: string): Promise<TestCase | null> {
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
  const { data, error } = await supabase
    .from('test_cases')
    .select('*')
    .eq('id', testCaseId)
    .eq('agent_id', agentId)
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      return null
    }
    throw new Error(`Failed to get test case: ${error.message}`)
  }

  return data as TestCase
}

