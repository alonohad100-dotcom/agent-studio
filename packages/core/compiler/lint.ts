/**
 * Lint System
 * Stage 6: Run lint rules
 */

import type { PromptPackageJSON, LintFinding, SpecJSON } from '../types'

export function lintPromptPackage(
  layers: PromptPackageJSON,
  spec: SpecJSON
): LintFinding[] {
  const findings: LintFinding[] = []

  // Critical rules
  if (!spec.mission.problem || spec.mission.problem.trim().length === 0) {
    findings.push({
      rule_id: 'missing_mission_problem',
      severity: 'critical',
      message: 'Mission problem statement is missing',
      block: 'mission',
      field: 'problem',
      suggestion: 'Add a clear problem statement describing what the agent solves',
    })
  }

  if (spec.mission.success_criteria.length === 0) {
    findings.push({
      rule_id: 'no_success_criteria',
      severity: 'critical',
      message: 'No success criteria defined',
      block: 'mission',
      field: 'success_criteria',
      suggestion: 'Add at least one success criterion',
    })
  }

  if (spec.scope.out_of_scope.length === 0) {
    findings.push({
      rule_id: 'no_out_of_scope',
      severity: 'critical',
      message: 'No out-of-scope items defined',
      block: 'scope',
      field: 'out_of_scope',
      suggestion: 'Define what the agent should NOT do',
    })
  }

  if (spec.io_contracts.inputs.length === 0) {
    findings.push({
      rule_id: 'no_input_contract',
      severity: 'critical',
      message: 'No input contracts defined',
      block: 'io_contracts',
      field: 'inputs',
      suggestion: 'Define at least one input contract',
    })
  }

  if (!spec.io_contracts.outputs.format || spec.io_contracts.outputs.format.trim().length === 0) {
    findings.push({
      rule_id: 'no_output_contract',
      severity: 'critical',
      message: 'Output format is not defined',
      block: 'io_contracts',
      field: 'outputs.format',
      suggestion: 'Define the expected output format',
    })
  }

  // High severity rules
  if (spec.safety.refusals.length === 0) {
    findings.push({
      rule_id: 'no_refusals',
      severity: 'high',
      message: 'No refusal scenarios defined',
      block: 'safety',
      field: 'refusals',
      suggestion: 'Define scenarios where the agent should refuse',
    })
  }

  if (spec.examples.good.length === 0) {
    findings.push({
      rule_id: 'no_good_examples',
      severity: 'high',
      message: 'No good examples provided',
      block: 'examples',
      field: 'good',
      suggestion: 'Add examples of good outputs',
    })
  }

  // Medium severity rules
  if (layers.system_backbone.length < 100) {
    findings.push({
      rule_id: 'short_system_backbone',
      severity: 'medium',
      message: 'System backbone is too short',
      block: 'system_backbone',
      suggestion: 'Expand the system backbone with more detail',
    })
  }

  if (spec.scope.must_do.length < 3) {
    findings.push({
      rule_id: 'few_must_do_items',
      severity: 'medium',
      message: 'Few must-do items defined',
      block: 'scope',
      field: 'must_do',
      suggestion: 'Consider adding more must-do items for clarity',
    })
  }

  // Low severity rules
  if (!spec.audience.tone || spec.audience.tone.trim().length === 0) {
    findings.push({
      rule_id: 'missing_tone',
      severity: 'low',
      message: 'Communication tone not specified',
      block: 'audience',
      field: 'tone',
      suggestion: 'Specify the desired communication tone',
    })
  }

  if (spec.examples.bad.length === 0) {
    findings.push({
      rule_id: 'no_bad_examples',
      severity: 'low',
      message: 'No bad examples provided',
      block: 'examples',
      field: 'bad',
      suggestion: 'Add examples of what to avoid',
    })
  }

  return findings
}

