/**
 * Prompt Templates
 * Templates for generating prompt layers
 */

import type { SpecJSON } from '../types/spec'
import type { CapabilitiesJSON } from '../types/capabilities'

export function generateSystemBackbone(spec: SpecJSON): string {
  return `You are an AI agent designed to help users with the following mission:

${spec.mission.problem}

Success Criteria:
${spec.mission.success_criteria.map((c) => `- ${c}`).join('\n')}

Non-Goals (what you should NOT do):
${spec.mission.non_goals.length > 0
    ? spec.mission.non_goals.map((g) => `- ${g}`).join('\n')
    : '- None specified'}

Your audience is: ${spec.audience.persona} (${spec.audience.skill_level} level)
${spec.audience.language ? `Language: ${spec.audience.language}\n` : ''}${spec.audience.tone ? `Communication style: ${spec.audience.tone}` : ''}`
}

export function generateDomainManual(spec: SpecJSON, knowledgeMap?: import('../types/knowledge').KnowledgeMap): string {
  let knowledgeSection = ''
  
  if (knowledgeMap?.files && knowledgeMap.files.length > 0) {
    knowledgeSection = `\n\n## Knowledge Sources

The following knowledge sources are available to inform your responses:
${knowledgeMap.files.map((file) => `- ${file.name}${file.summary ? `: ${file.summary}` : ''}`).join('\n')}`
  }

  return `## Domain Context

Scope - Must Do:
${spec.scope.must_do.map((item) => `- ${item}`).join('\n')}

Scope - Should Do:
${spec.scope.should_do.length > 0
    ? spec.scope.should_do.map((item) => `- ${item}`).join('\n')
    : '- None specified'}

Scope - Nice to Have:
${spec.scope.nice_to_have.length > 0
    ? spec.scope.nice_to_have.map((item) => `- ${item}`).join('\n')
    : '- None specified'}

Out of Scope (what you should NOT do):
${spec.scope.out_of_scope.map((item) => `- ${item}`).join('\n')}

Constraints:
${spec.constraints.length ? `- Length: ${spec.constraints.length}` : ''}
${spec.constraints.citation_policy ? `- Citation Policy: ${spec.constraints.citation_policy}` : ''}
${spec.constraints.verification ? `- Verification: ${spec.constraints.verification}` : ''}${knowledgeSection}`
}

export function generateOutputContracts(spec: SpecJSON): string {
  const inputs = spec.io_contracts.inputs
    .map(
      (input) => `- ${input.name} (${input.format})${input.constraints.length > 0 ? `\n  Constraints: ${input.constraints.join(', ')}` : ''}`
    )
    .join('\n')

  const outputs = `Format: ${spec.io_contracts.outputs.format}
${spec.io_contracts.outputs.sections.length > 0
      ? `Sections:\n${spec.io_contracts.outputs.sections.map((s) => `- ${s}`).join('\n')}`
      : ''}
${spec.io_contracts.outputs.style_rules.length > 0
      ? `Style Rules:\n${spec.io_contracts.outputs.style_rules.map((r) => `- ${r}`).join('\n')}`
      : ''}`

  return `## Input/Output Contracts

Inputs:
${inputs || '- None specified'}

Outputs:
${outputs}`
}

export function generateToolPolicy(capabilities: CapabilitiesJSON): string {
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

  if (enabledCapabilities.length === 0) {
    return `## Tool Policy

No capabilities are currently enabled for this agent.`
  }

  return `## Tool Policy

Available Capabilities:
${enabledCapabilities.map((cap) => `- ${cap}`).join('\n')}

Use these capabilities when appropriate to fulfill user requests.`
}

export function generateExamples(spec: SpecJSON): string {
  const goodExamples = spec.examples.good
    .map((example, i) => `Example ${i + 1} (Good):\n${example}`)
    .join('\n\n')

  const badExamples = spec.examples.bad
    .map((example, i) => `Example ${i + 1} (Bad - Avoid):\n${example}`)
    .join('\n\n')

  if (goodExamples.length === 0 && badExamples.length === 0) {
    return `## Examples

No examples provided. Consider adding examples to improve clarity.`
  }

  return `## Examples

${goodExamples}

${badExamples}`
}

