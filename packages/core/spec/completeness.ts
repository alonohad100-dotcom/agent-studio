/**
 * Spec Completeness Calculator
 * 
 * Calculates how complete a specification is based on required fields
 */

import type { SpecJSON } from '../types/spec'

export interface CompletenessResult {
  overall: number
  byBlock: Record<string, number>
  missingFields: string[]
}

export function calculateCompleteness(spec: SpecJSON): CompletenessResult {
  const byBlock: Record<string, number> = {}
  const missingFields: string[] = []

  // Mission block (20% weight)
  const missionScore = calculateBlockCompleteness(
    spec.mission,
    {
      problem: true,
      success_criteria: true,
      non_goals: false,
    },
    'mission'
  )
  byBlock.mission = missionScore.score
  missingFields.push(...missionScore.missing)

  // Audience block (15% weight)
  const audienceScore = calculateBlockCompleteness(
    spec.audience,
    {
      persona: true,
      skill_level: true,
      language: false,
      tone: false,
    },
    'audience'
  )
  byBlock.audience = audienceScore.score
  missingFields.push(...audienceScore.missing)

  // Scope block (15% weight)
  const scopeScore = calculateBlockCompleteness(
    spec.scope,
    {
      must_do: true,
      out_of_scope: true,
      should_do: false,
      nice_to_have: false,
    },
    'scope'
  )
  byBlock.scope = scopeScore.score
  missingFields.push(...scopeScore.missing)

  // IO Contracts block (20% weight)
  const ioScore = calculateIOCompleteness(spec.io_contracts)
  byBlock.io_contracts = ioScore.score
  missingFields.push(...ioScore.missing)

  // Constraints block (10% weight)
  const constraintsScore = calculateBlockCompleteness(
    spec.constraints,
    {
      length: true,
      citation_policy: false,
      verification: false,
    },
    'constraints'
  )
  byBlock.constraints = constraintsScore.score
  missingFields.push(...constraintsScore.missing)

  // Safety block (10% weight)
  const safetyScore = calculateBlockCompleteness(
    spec.safety,
    {
      refusals: true,
      sensitive_topics: false,
    },
    'safety'
  )
  byBlock.safety = safetyScore.score
  missingFields.push(...safetyScore.missing)

  // Examples block (10% weight)
  const examplesScore = calculateBlockCompleteness(
    spec.examples,
    {
      good: false,
      bad: false,
    },
    'examples'
  )
  byBlock.examples = examplesScore.score
  missingFields.push(...examplesScore.missing)

  // Calculate overall score with weights
  const overall =
    missionScore.score * 0.2 +
    audienceScore.score * 0.15 +
    scopeScore.score * 0.15 +
    ioScore.score * 0.2 +
    constraintsScore.score * 0.1 +
    safetyScore.score * 0.1 +
    examplesScore.score * 0.1

  return {
    overall: Math.round(overall),
    byBlock,
    missingFields,
  }
}

function calculateBlockCompleteness(
  block: Record<string, unknown>,
  requiredFields: Record<string, boolean>,
  blockName: string
): { score: number; missing: string[] } {
  const missing: string[] = []
  let totalFields = 0
  let filledFields = 0

  for (const [field, required] of Object.entries(requiredFields)) {
    totalFields++
    const value = block[field]
    const isFilled = Array.isArray(value)
      ? value.length > 0
      : typeof value === 'string'
        ? value.trim() !== ''
        : value !== null && value !== undefined

    if (required && !isFilled) {
      missing.push(`${blockName}.${field}`)
    }
    if (isFilled) {
      filledFields++
    }
  }

  const score = totalFields > 0 ? (filledFields / totalFields) * 100 : 0
  return { score: Math.round(score), missing }
}

function calculateIOCompleteness(io: SpecJSON['io_contracts']): {
  score: number
  missing: string[]
} {
  const missing: string[] = []
  let score = 0

  // Check inputs (at least one input required)
  if (io.inputs.length === 0) {
    missing.push('io_contracts.inputs')
  } else {
    score += 50
  }

  // Check outputs
  if (!io.outputs.format || io.outputs.format.trim() === '') {
    missing.push('io_contracts.outputs.format')
  } else {
    score += 50
  }

  return { score, missing }
}

