/**
 * Capability Rules Engine
 * Checks if spec requirements are met for each capability
 */

import type { SpecJSON } from '../types/spec'
import type { CapabilitiesJSON } from '../types/capabilities'

export interface CapabilityRule {
  capability: string
  requiredSpecFields: string[]
  message: string
}

export const CAPABILITY_RULES: CapabilityRule[] = [
  {
    capability: 'web_search',
    requiredSpecFields: ['scope.out_of_scope', 'safety.refusals'],
    message: 'Web search requires out-of-scope and safety boundaries',
  },
  {
    capability: 'knowledge_base',
    requiredSpecFields: ['scope.must_do'],
    message: 'Knowledge base requires defined scope',
  },
  {
    capability: 'code_generation',
    requiredSpecFields: ['io_contracts.outputs.format', 'constraints.verification'],
    message: 'Code generation requires output format and verification constraints',
  },
  {
    capability: 'content_creation',
    requiredSpecFields: ['io_contracts.outputs.format', 'constraints.length'],
    message: 'Content creation requires output format and length constraints',
  },
  {
    capability: 'analysis',
    requiredSpecFields: ['io_contracts.outputs.format', 'mission.success_criteria'],
    message: 'Analysis requires output format and success criteria',
  },
  {
    capability: 'recommendations',
    requiredSpecFields: ['io_contracts.outputs.format', 'scope.must_do'],
    message: 'Recommendations require output format and scope definition',
  },
  {
    capability: 'api_calls',
    requiredSpecFields: ['safety.refusals', 'constraints.verification'],
    message: 'API calls require safety boundaries and verification constraints',
  },
  {
    capability: 'file_operations',
    requiredSpecFields: ['safety.refusals', 'scope.out_of_scope'],
    message: 'File operations require safety boundaries and out-of-scope definition',
  },
]

/**
 * Get nested value from object using dot notation path
 */
function getNestedValue(obj: unknown, path: string[]): unknown {
  let current: unknown = obj
  for (const key of path) {
    if (current && typeof current === 'object' && key in current) {
      current = (current as Record<string, unknown>)[key]
    } else {
      return undefined
    }
  }
  return current
}

/**
 * Check if a capability's requirements are met
 */
export function checkCapabilityRequirements(
  capability: string,
  spec: SpecJSON
): { valid: boolean; blockers: string[] } {
  const rule = CAPABILITY_RULES.find((r) => r.capability === capability)
  if (!rule) return { valid: true, blockers: [] }

  const blockers: string[] = []
  for (const field of rule.requiredSpecFields) {
    const [block, ...path] = field.split('.')
    const blockData = spec[block as keyof SpecJSON]
    const value = getNestedValue(blockData, path)

    if (!value || (Array.isArray(value) && value.length === 0)) {
      blockers.push(`${block}.${path.join('.')}`)
    }
  }

  return {
    valid: blockers.length === 0,
    blockers,
  }
}

/**
 * Check all enabled capabilities for requirements
 */
export function checkAllCapabilityRequirements(
  capabilities: CapabilitiesJSON,
  spec: SpecJSON
): Array<{ capability: string; valid: boolean; blockers: string[]; message: string }> {
  const results: Array<{ capability: string; valid: boolean; blockers: string[]; message: string }> = []

  // Check information capabilities
  if (capabilities.information?.enabled) {
    if (capabilities.information.web_search) {
      const check = checkCapabilityRequirements('web_search', spec)
      const rule = CAPABILITY_RULES.find((r) => r.capability === 'web_search')
      results.push({
        capability: 'web_search',
        valid: check.valid,
        blockers: check.blockers,
        message: rule?.message || '',
      })
    }
    if (capabilities.information.knowledge_base) {
      const check = checkCapabilityRequirements('knowledge_base', spec)
      const rule = CAPABILITY_RULES.find((r) => r.capability === 'knowledge_base')
      results.push({
        capability: 'knowledge_base',
        valid: check.valid,
        blockers: check.blockers,
        message: rule?.message || '',
      })
    }
  }

  // Check production capabilities
  if (capabilities.production?.enabled) {
    if (capabilities.production.code_generation) {
      const check = checkCapabilityRequirements('code_generation', spec)
      const rule = CAPABILITY_RULES.find((r) => r.capability === 'code_generation')
      results.push({
        capability: 'code_generation',
        valid: check.valid,
        blockers: check.blockers,
        message: rule?.message || '',
      })
    }
    if (capabilities.production.content_creation) {
      const check = checkCapabilityRequirements('content_creation', spec)
      const rule = CAPABILITY_RULES.find((r) => r.capability === 'content_creation')
      results.push({
        capability: 'content_creation',
        valid: check.valid,
        blockers: check.blockers,
        message: rule?.message || '',
      })
    }
  }

  // Check decision_support capabilities
  if (capabilities.decision_support?.enabled) {
    if (capabilities.decision_support.analysis) {
      const check = checkCapabilityRequirements('analysis', spec)
      const rule = CAPABILITY_RULES.find((r) => r.capability === 'analysis')
      results.push({
        capability: 'analysis',
        valid: check.valid,
        blockers: check.blockers,
        message: rule?.message || '',
      })
    }
    if (capabilities.decision_support.recommendations) {
      const check = checkCapabilityRequirements('recommendations', spec)
      const rule = CAPABILITY_RULES.find((r) => r.capability === 'recommendations')
      results.push({
        capability: 'recommendations',
        valid: check.valid,
        blockers: check.blockers,
        message: rule?.message || '',
      })
    }
  }

  // Check automation capabilities
  if (capabilities.automation?.enabled) {
    if (capabilities.automation.api_calls) {
      const check = checkCapabilityRequirements('api_calls', spec)
      const rule = CAPABILITY_RULES.find((r) => r.capability === 'api_calls')
      results.push({
        capability: 'api_calls',
        valid: check.valid,
        blockers: check.blockers,
        message: rule?.message || '',
      })
    }
    if (capabilities.automation.file_operations) {
      const check = checkCapabilityRequirements('file_operations', spec)
      const rule = CAPABILITY_RULES.find((r) => r.capability === 'file_operations')
      results.push({
        capability: 'file_operations',
        valid: check.valid,
        blockers: check.blockers,
        message: rule?.message || '',
      })
    }
  }

  return results
}

