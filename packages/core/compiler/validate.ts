/**
 * Spec Validation
 * Stage 2: Validate minimal completeness
 */

import type { NormalizedSpec, ValidationResult } from './types'
import { calculateCompleteness } from '../spec/completeness'

export function validateSpec(spec: NormalizedSpec): ValidationResult {
  const errors: string[] = []
  const warnings: string[] = []
  const completeness = calculateCompleteness(spec)

  // Critical validations
  if (!spec.mission.problem || spec.mission.problem.length === 0) {
    errors.push('Mission problem statement is required')
  }

  if (spec.mission.success_criteria.length === 0) {
    errors.push('At least one success criterion is required')
  }

  if (spec.scope.must_do.length === 0) {
    errors.push('At least one must-do item is required')
  }

  if (spec.scope.out_of_scope.length === 0) {
    errors.push('At least one out-of-scope item is required')
  }

  if (spec.io_contracts.inputs.length === 0) {
    errors.push('At least one input contract is required')
  }

  if (!spec.io_contracts.outputs.format || spec.io_contracts.outputs.format.length === 0) {
    errors.push('Output format is required')
  }

  if (spec.safety.refusals.length === 0) {
    errors.push('At least one refusal scenario is required')
  }

  // Warnings for completeness
  if (completeness.overall < 50) {
    warnings.push(`Specification is only ${completeness.overall}% complete`)
  }

  if (spec.examples.good.length === 0) {
    warnings.push('Consider adding good examples to improve clarity')
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  }
}

