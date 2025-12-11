/**
 * Quality Scoring
 * Stage 7: Compute score
 */

import type { SpecJSON, PromptPackageJSON, LintFinding, QualityScore } from '../types'
import { calculateCompleteness } from '../spec/completeness'

export function computeQualityScore(
  spec: SpecJSON,
  layers: PromptPackageJSON,
  findings: LintFinding[]
): QualityScore {
  const completeness = calculateCompleteness(spec)

  // Spec completeness (30%)
  const specCompleteness = completeness.overall

  // Instruction clarity (25%)
  // Based on length and detail of layers
  const totalLength =
    layers.system_backbone.length +
    layers.domain_manual.length +
    layers.output_contracts.length +
    layers.tool_policy.length +
    layers.examples.length
  const instructionClarity = Math.min(100, (totalLength / 2000) * 100)

  // Safety clarity (15%)
  const safetyClarity =
    spec.safety.refusals.length > 0 && spec.safety.sensitive_topics.length > 0
      ? 100
      : spec.safety.refusals.length > 0
        ? 70
        : 30

  // Output contract strength (15%)
  const outputContractStrength =
    spec.io_contracts.outputs.format.length > 0 &&
    spec.io_contracts.outputs.sections.length > 0 &&
    spec.io_contracts.outputs.style_rules.length > 0
      ? 100
      : spec.io_contracts.outputs.format.length > 0 &&
          spec.io_contracts.outputs.sections.length > 0
        ? 80
        : spec.io_contracts.outputs.format.length > 0
          ? 60
          : 0

  // Test coverage (15%) - Placeholder, will be enhanced when test system is implemented
  const testCoverage = 0

  // Calculate overall score with weights
  const overall =
    specCompleteness * 0.3 +
    instructionClarity * 0.25 +
    safetyClarity * 0.15 +
    outputContractStrength * 0.15 +
    testCoverage * 0.15

  // Penalize for critical findings
  const criticalCount = findings.filter((f) => f.severity === 'critical').length
  const highCount = findings.filter((f) => f.severity === 'high').length
  const penalty = criticalCount * 10 + highCount * 5

  return {
    overall: Math.max(0, Math.round(overall - penalty)),
    spec_completeness: specCompleteness,
    instruction_clarity: Math.round(instructionClarity),
    safety_clarity: safetyClarity,
    output_contract_strength: outputContractStrength,
    test_coverage: testCoverage,
  }
}

