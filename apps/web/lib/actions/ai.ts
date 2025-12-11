'use server'

import { createAIProvider } from '@core/ai'
import { requireAuth } from '@/lib/auth'
import { getDraftSpec } from './drafts'
import type { SpecBlockName, SpecJSON } from '@core/types/spec'

export async function generateSpecBlock(
  agentId: string,
  blockName: SpecBlockName,
  context?: string
): Promise<string> {
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

  // Get current spec for context
  const currentSpec = await getDraftSpec(agentId)

  // Build prompt based on block type
  const prompt = buildSpecBlockPrompt(blockName, currentSpec as SpecJSON | null, context)

  // Generate content
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY environment variable is required')
  }
  const provider = createAIProvider(apiKey)
  const generated = await provider.generateText(prompt, {
    temperature: 0.7,
    maxTokens: 2000,
  })

  return generated
}

export async function tightenScope(agentId: string): Promise<string> {
  const user = await requireAuth()

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

  const currentSpec = await getDraftSpec(agentId)
  if (!currentSpec) {
    throw new Error('No specification found')
  }

  const prompt = `You are a specification refinement assistant. Review the following agent specification and suggest ways to tighten the scope. Focus on:
1. Removing vague or overly broad statements
2. Making "must do" items more specific
3. Moving items from "should do" to "must do" if critical
4. Identifying items that should be moved to "out of scope"

Current specification:
${JSON.stringify(currentSpec, null, 2)}

Provide specific, actionable recommendations to tighten the scope.`

  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY environment variable is required')
  }
  const provider = createAIProvider(apiKey)
  return await provider.generateText(prompt, {
    temperature: 0.5,
    maxTokens: 1500,
  })
}

export async function detectContradictions(agentId: string): Promise<string> {
  const user = await requireAuth()

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

  const currentSpec = await getDraftSpec(agentId)
  if (!currentSpec) {
    throw new Error('No specification found')
  }

  const prompt = `You are a specification quality checker. Review the following agent specification and identify any contradictions, conflicts, or inconsistencies between different blocks.

Current specification:
${JSON.stringify(currentSpec, null, 2)}

Look for:
1. Conflicts between mission and scope
2. Contradictions between constraints and outputs
3. Safety boundaries that conflict with scope
4. Examples that contradict the stated requirements

List any contradictions found, or state "No contradictions detected" if the specification is consistent.`

  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY environment variable is required')
  }
  const provider = createAIProvider(apiKey)
  return await provider.generateText(prompt, {
    temperature: 0.3,
    maxTokens: 1500,
  })
}

function buildSpecBlockPrompt(
  blockName: SpecBlockName,
  currentSpec: SpecJSON | null,
  context?: string
): string {
  const blockDescriptions: Record<SpecBlockName, string> = {
    mission: `Generate a mission block for an AI agent specification. Include:
- A clear problem statement
- 3-5 success criteria
- 2-3 non-goals (what the agent should NOT do)`,
    audience: `Generate an audience block for an AI agent specification. Include:
- A detailed persona description
- Skill level (beginner/intermediate/advanced/expert)
- Preferred language
- Communication tone`,
    scope: `Generate a scope block for an AI agent specification. Include:
- 3-5 "must do" items (critical requirements)
- 2-3 "should do" items (important but not critical)
- 1-2 "nice to have" items (optional enhancements)
- 2-3 "out of scope" items (explicitly excluded)`,
    io_contracts: `Generate input/output contracts for an AI agent specification. Include:
- At least one input definition with format and constraints
- Output format specification
- Output sections/structure
- Style rules for outputs`,
    constraints: `Generate constraints for an AI agent specification. Include:
- Length constraints (word/character limits)
- Citation policy
- Verification requirements`,
    safety: `Generate safety boundaries for an AI agent specification. Include:
- 3-5 refusal scenarios (when the agent should refuse)
- 2-3 sensitive topics to avoid`,
    examples: `Generate examples for an AI agent specification. Include:
- 2-3 good examples (what good outputs look like)
- 1-2 bad examples (what to avoid)`,
    metadata: `Generate metadata for an AI agent specification. Include:
- 3-5 relevant domain tags
- Template ID (if applicable)`,
  }

  const basePrompt = blockDescriptions[blockName]

  let prompt = `You are an AI specification expert. ${basePrompt}`

  if (context) {
    prompt += `\n\nAdditional context: ${context}`
  }

  if (currentSpec) {
    prompt += `\n\nCurrent specification (for reference):\n${JSON.stringify(currentSpec, null, 2)}`
  }

  prompt += `\n\nGenerate the ${blockName} block content in JSON format matching the specification schema.`

  return prompt
}

