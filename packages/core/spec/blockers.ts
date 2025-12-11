/**
 * Spec Blockers Detection
 * 
 * Identifies blockers that prevent publishing an agent
 */

import type { SpecJSON } from '../types/spec'
import { calculateCompleteness } from './completeness'
import { specSchema } from './validation/schemas'

export interface Blocker {
  type: 'missing_field' | 'validation_error' | 'incomplete_block'
  block: string
  field?: string
  message: string
  severity: 'error' | 'warning'
}

export function detectBlockers(spec: SpecJSON): Blocker[] {
  const blockers: Blocker[] = []
  const completeness = calculateCompleteness(spec)

  // Check completeness blockers
  for (const missingField of completeness.missingFields) {
    const [block, field] = missingField.split('.')
    blockers.push({
      type: 'missing_field',
      block: block || 'unknown',
      field,
      message: `Missing required field: ${field || missingField}`,
      severity: 'error',
    })
  }

  // Check validation errors
  const validationResult = specSchema.safeParse(spec)
  if (!validationResult.success) {
    for (const error of validationResult.error.errors) {
      const path = error.path.join('.')
      const [block] = path.split('.')
      blockers.push({
        type: 'validation_error',
        block: block || 'unknown',
        field: path,
        message: error.message,
        severity: 'error',
      })
    }
  }

  // Check incomplete blocks (less than 50% complete)
  for (const [block, score] of Object.entries(completeness.byBlock)) {
    if (score < 50) {
      blockers.push({
        type: 'incomplete_block',
        block,
        message: `${block.replace('_', ' ')} block is less than 50% complete`,
        severity: 'warning',
      })
    }
  }

  return blockers.sort((a, b) => {
    // Errors first, then warnings
    if (a.severity !== b.severity) {
      return a.severity === 'error' ? -1 : 1
    }
    return a.block.localeCompare(b.block)
  })
}

