/**
 * Lint Rules Engine
 * Comprehensive lint rules for spec validation
 */

import type { SpecJSON } from '../types/spec'
import type { PromptPackageJSON, LintFinding } from '../types/prompt'

export interface LintRule {
  id: string
  name: string
  severity: 'critical' | 'high' | 'medium' | 'low'
  check: (spec: SpecJSON, layers: PromptPackageJSON) => LintFinding | null
  fixable?: boolean
  fix?: (spec: SpecJSON) => Partial<SpecJSON>
}

// Critical rules (block publish)
export const CRITICAL_RULES: LintRule[] = [
  {
    id: 'missing-mission-problem',
    name: 'Missing Mission Problem',
    severity: 'critical',
    check: (spec) => {
      if (!spec.mission?.problem || spec.mission.problem.trim() === '') {
        return {
          rule_id: 'missing-mission-problem',
          severity: 'critical',
          message: 'Mission problem statement is required',
          block: 'mission',
          field: 'problem',
          suggestion: 'Add a clear problem statement describing what the agent should solve',
        }
      }
      return null
    },
  },
  {
    id: 'no-success-criteria',
    name: 'No Success Criteria',
    severity: 'critical',
    check: (spec) => {
      if (!spec.mission?.success_criteria || spec.mission.success_criteria.length === 0) {
        return {
          rule_id: 'no-success-criteria',
          severity: 'critical',
          message: 'At least one success criterion is required',
          block: 'mission',
          field: 'success_criteria',
          suggestion: 'Define measurable success criteria',
        }
      }
      return null
    },
  },
  {
    id: 'no-out-of-scope',
    name: 'No Out-of-Scope List',
    severity: 'critical',
    check: (spec) => {
      if (!spec.scope?.out_of_scope || spec.scope.out_of_scope.length === 0) {
        return {
          rule_id: 'no-out-of-scope',
          severity: 'critical',
          message: 'At least one out-of-scope item is required',
          block: 'scope',
          field: 'out_of_scope',
          suggestion: 'Define what the agent should NOT do to prevent scope creep',
        }
      }
      return null
    },
  },
  {
    id: 'no-output-contract',
    name: 'No Output Contract',
    severity: 'critical',
    check: (spec) => {
      if (!spec.io_contracts?.outputs?.format || spec.io_contracts.outputs.format.trim() === '') {
        return {
          rule_id: 'no-output-contract',
          severity: 'critical',
          message: 'Output format is required',
          block: 'io_contracts',
          field: 'outputs.format',
          suggestion: 'Define the expected output format (e.g., JSON, Markdown, Plain Text)',
        }
      }
      return null
    },
  },
  {
    id: 'no-input-contracts',
    name: 'No Input Contracts',
    severity: 'critical',
    check: (spec) => {
      if (!spec.io_contracts?.inputs || spec.io_contracts.inputs.length === 0) {
        return {
          rule_id: 'no-input-contracts',
          severity: 'critical',
          message: 'At least one input contract is required',
          block: 'io_contracts',
          field: 'inputs',
          suggestion: 'Define the expected input formats and constraints',
        }
      }
      return null
    },
  },
]

// High severity rules
export const HIGH_RULES: LintRule[] = [
  {
    id: 'no-refusals',
    name: 'No Refusal Scenarios',
    severity: 'high',
    check: (spec) => {
      if (!spec.safety?.refusals || spec.safety.refusals.length === 0) {
        return {
          rule_id: 'no-refusals',
          severity: 'high',
          message: 'No refusal scenarios defined',
          block: 'safety',
          field: 'refusals',
          suggestion: 'Define scenarios where the agent should refuse to respond',
        }
      }
      return null
    },
  },
  {
    id: 'no-good-examples',
    name: 'No Good Examples',
    severity: 'high',
    check: (spec) => {
      if (!spec.examples?.good || spec.examples.good.length === 0) {
        return {
          rule_id: 'no-good-examples',
          severity: 'high',
          message: 'No good examples provided',
          block: 'examples',
          field: 'good',
          suggestion: 'Add examples of good outputs to guide the agent',
        }
      }
      return null
    },
  },
  {
    id: 'contradictory-constraints',
    name: 'Contradictory Constraints',
    severity: 'high',
    check: (spec) => {
      // Check for contradictory constraints
      const length = spec.constraints?.length || ''
      const citation = spec.constraints?.citation_policy || ''
      
      // Example: Very short length but requiring citations (contradictory)
      if (length.toLowerCase().includes('brief') && citation.toLowerCase().includes('always cite')) {
        return {
          rule_id: 'contradictory-constraints',
          severity: 'high',
          message: 'Constraints may be contradictory',
          block: 'constraints',
          suggestion: 'Review length and citation policy for consistency',
        }
      }
      return null
    },
  },
]

// Medium severity rules
export const MEDIUM_RULES: LintRule[] = [
  {
    id: 'few-must-do-items',
    name: 'Few Must-Do Items',
    severity: 'medium',
    check: (spec) => {
      if (!spec.scope?.must_do || spec.scope.must_do.length < 3) {
        return {
          rule_id: 'few-must-do-items',
          severity: 'medium',
          message: 'Few must-do items defined',
          block: 'scope',
          field: 'must_do',
          suggestion: 'Consider adding more must-do items for clarity',
        }
      }
      return null
    },
  },
  {
    id: 'short-system-backbone',
    name: 'Short System Backbone',
    severity: 'medium',
    check: (_spec, layers) => {
      if (layers.system_backbone.length < 100) {
        return {
          rule_id: 'short-system-backbone',
          severity: 'medium',
          message: 'System backbone is too short',
          block: 'system_backbone',
          suggestion: 'Expand the system backbone with more detail',
        }
      }
      return null
    },
  },
  {
    id: 'missing-audience-tone',
    name: 'Missing Communication Tone',
    severity: 'medium',
    check: (spec) => {
      if (!spec.audience?.tone || spec.audience.tone.trim() === '') {
        return {
          rule_id: 'missing-audience-tone',
          severity: 'medium',
          message: 'Communication tone not specified',
          block: 'audience',
          field: 'tone',
          suggestion: 'Specify the desired communication tone (e.g., professional, friendly, technical)',
        }
      }
      return null
    },
  },
]

// Low severity rules
export const LOW_RULES: LintRule[] = [
  {
    id: 'no-bad-examples',
    name: 'No Bad Examples',
    severity: 'low',
    check: (spec) => {
      if (!spec.examples?.bad || spec.examples.bad.length === 0) {
        return {
          rule_id: 'no-bad-examples',
          severity: 'low',
          message: 'No bad examples provided',
          block: 'examples',
          field: 'bad',
          suggestion: 'Add examples of what to avoid',
        }
      }
      return null
    },
  },
  {
    id: 'no-domain-tags',
    name: 'No Domain Tags',
    severity: 'low',
    check: (spec) => {
      if (!spec.metadata?.domain_tags || spec.metadata.domain_tags.length === 0) {
        return {
          rule_id: 'no-domain-tags',
          severity: 'low',
          message: 'No domain tags specified',
          block: 'metadata',
          field: 'domain_tags',
          suggestion: 'Add domain tags for better categorization',
        }
      }
      return null
    },
  },
]

export const ALL_RULES: LintRule[] = [
  ...CRITICAL_RULES,
  ...HIGH_RULES,
  ...MEDIUM_RULES,
  ...LOW_RULES,
]

export function runLintRules(spec: SpecJSON, layers: PromptPackageJSON): LintFinding[] {
  const findings: LintFinding[] = []

  for (const rule of ALL_RULES) {
    const finding = rule.check(spec, layers)
    if (finding) {
      findings.push(finding)
    }
  }

  return findings.sort((a, b) => {
    const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 }
    return severityOrder[a.severity] - severityOrder[b.severity]
  })
}

