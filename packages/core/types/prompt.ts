/**
 * Prompt Package Types
 */

export interface PromptPackageJSON {
  system_backbone: string
  domain_manual: string
  output_contracts: string
  tool_policy: string
  examples: string
}

// CapabilitiesJSON and KnowledgeMap are now exported from their own modules
// Keeping these for backward compatibility, but they should be imported from:
// - CapabilitiesJSON: from '../types/capabilities'
// - KnowledgeMap: from '../types/knowledge'
export type { CapabilitiesJSON } from './capabilities'
export type { KnowledgeMap } from './knowledge'

export interface ToolToggles {
  [toolName: string]: boolean
}

export interface LintFinding {
  rule_id: string
  severity: 'critical' | 'high' | 'medium' | 'low'
  message: string
  block?: string
  field?: string
  suggestion?: string
}

export interface QualityScore {
  overall: number
  spec_completeness: number
  instruction_clarity: number
  safety_clarity: number
  output_contract_strength: number
  test_coverage: number
}

export interface Suggestion {
  type: 'fix' | 'improve' | 'add'
  message: string
  priority: 'high' | 'medium' | 'low'
  actionable: boolean
}


