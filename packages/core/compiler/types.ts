/**
 * Compiler Types
 */

import type { SpecJSON, SpecBlockName } from '../types/spec'
import type {
  PromptPackageJSON,
  ToolToggles,
  LintFinding,
  QualityScore,
  Suggestion,
} from '../types/prompt'
import type { CapabilitiesJSON } from '../types/capabilities'
import type { KnowledgeMap } from '../types/knowledge'

export interface CompilerInput {
  spec: SpecJSON
  capabilities: CapabilitiesJSON
  knowledgeMap?: KnowledgeMap
  toolToggles?: ToolToggles
}

export interface CompilerOutput {
  promptPackage: PromptPackageJSON
  lintFindings: LintFinding[]
  qualityScore: QualityScore
  suggestions: Suggestion[]
}

export interface NormalizedSpec extends SpecJSON {
  _normalized?: boolean
}

export interface ValidationResult {
  valid: boolean
  errors: string[]
  warnings: string[]
}

export interface RequirementGraph {
  nodes: Array<{
    id: string
    type: SpecBlockName
    requirements: string[]
    dependencies: string[]
  }>
  edges: Array<{
    from: string
    to: string
    type: 'requires' | 'conflicts' | 'enhances'
  }>
}

export interface Policy {
  id: string
  type: string
  statement: string
  source: SpecBlockName
  priority: 'must' | 'should' | 'nice_to_have' | 'must_not'
}

