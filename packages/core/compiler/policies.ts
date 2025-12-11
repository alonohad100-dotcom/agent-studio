/**
 * Policy Expansion
 * Stage 4: Expand into policy statements
 */

import type { RequirementGraph, Policy } from './types'
import type { CapabilitiesJSON } from '../types/capabilities'

export function expandPolicies(
  graph: RequirementGraph,
  capabilities: CapabilitiesJSON
): Policy[] {
  const policies: Policy[] = []

  for (const node of graph.nodes) {
    for (const requirement of node.requirements) {
      if (!requirement) continue

      let priority: Policy['priority'] = 'should'
      let statement = requirement

      if (requirement.startsWith('MUST:')) {
        priority = 'must'
        statement = requirement.replace('MUST:', '').trim()
      } else if (requirement.startsWith('SHOULD:')) {
        priority = 'should'
        statement = requirement.replace('SHOULD:', '').trim()
      } else if (requirement.startsWith('NICE:')) {
        priority = 'nice_to_have'
        statement = requirement.replace('NICE:', '').trim()
      } else if (requirement.startsWith('OUT:')) {
        priority = 'must_not'
        statement = requirement.replace('OUT:', '').trim()
      } else if (requirement.startsWith('NOT:')) {
        priority = 'must_not'
        statement = requirement.replace('NOT:', '').trim()
      } else if (requirement.startsWith('REFUSE:')) {
        priority = 'must'
        statement = `You must refuse requests related to: ${requirement.replace('REFUSE:', '').trim()}`
      } else if (requirement.startsWith('AVOID:')) {
        priority = 'should'
        statement = `Avoid discussing: ${requirement.replace('AVOID:', '').trim()}`
      }

      policies.push({
        id: `${node.id}-${policies.length}`,
        type: node.type,
        statement,
        source: node.type,
        priority,
      })
    }
  }

  // Add capability policies if capabilities are provided
  const enabledCapabilities: string[] = []
  
  if (capabilities.information?.enabled) {
    if (capabilities.information.web_search) enabledCapabilities.push('Web Search')
    if (capabilities.information.knowledge_base) enabledCapabilities.push('Knowledge Base')
  }
  if (capabilities.production?.enabled) {
    if (capabilities.production.code_generation) enabledCapabilities.push('Code Generation')
    if (capabilities.production.content_creation) enabledCapabilities.push('Content Creation')
  }
  if (capabilities.decision_support?.enabled) {
    if (capabilities.decision_support.analysis) enabledCapabilities.push('Analysis')
    if (capabilities.decision_support.recommendations) enabledCapabilities.push('Recommendations')
  }
  if (capabilities.automation?.enabled) {
    if (capabilities.automation.api_calls) enabledCapabilities.push('API Calls')
    if (capabilities.automation.file_operations) enabledCapabilities.push('File Operations')
  }

  for (const capability of enabledCapabilities) {
    policies.push({
      id: `capability-${capability.toLowerCase().replace(/\s+/g, '-')}`,
      type: 'capability',
      statement: `You have access to the ${capability} capability`,
      source: 'metadata',
      priority: 'should',
    })
  }

  return policies
}

