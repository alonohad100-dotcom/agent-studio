/**
 * Version Types
 * Types for agent versioning and publishing
 */

import type { SpecJSON } from './spec'
import type { PromptPackageJSON } from './prompt'
import type { CapabilitiesJSON } from './capabilities'
import type { KnowledgeMap } from './knowledge'

export interface AgentVersion {
  id: string
  agent_id: string
  version_number: number
  spec_snapshot: SpecJSON
  prompt_package: PromptPackageJSON
  capabilities: CapabilitiesJSON
  knowledge_map?: KnowledgeMap
  quality_score: number
  test_pass_rate?: number | null
  created_at: string
  created_by: string
}

export interface VersionDiff {
  version1: AgentVersion
  version2: AgentVersion
  specChanges: SpecDiff
  scoreChanges: {
    quality_score: { from: number; to: number; delta: number }
    test_pass_rate?: { from: number | null; to: number | null; delta: number | null }
  }
}

export interface SpecDiff {
  added: string[]
  removed: string[]
  modified: Array<{
    field: string
    oldValue: unknown
    newValue: unknown
  }>
}

export interface PublishGateResult {
  passed: boolean
  reasons: string[]
  details: {
    qualityScore: { value: number; threshold: number; passed: boolean }
    criticalLintFindings: { count: number; passed: boolean }
    testCasesExist: { count: number; passed: boolean }
    testPassRate?: { value: number | null; threshold: number; passed: boolean }
  }
}

