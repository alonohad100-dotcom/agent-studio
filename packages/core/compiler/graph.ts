/**
 * Requirement Graph Builder
 * Stage 3: Build requirement graph
 */

import type { NormalizedSpec, RequirementGraph } from './types'

export function buildRequirementGraph(spec: NormalizedSpec): RequirementGraph {
  const nodes: RequirementGraph['nodes'] = []
  const edges: RequirementGraph['edges'] = []

  // Mission node
  nodes.push({
    id: 'mission',
    type: 'mission',
    requirements: [
      spec.mission.problem,
      ...spec.mission.success_criteria,
      ...spec.mission.non_goals.map((g) => `NOT: ${g}`),
    ],
    dependencies: [],
  })

  // Audience node
  nodes.push({
    id: 'audience',
    type: 'audience',
    requirements: [
      spec.audience.persona,
      `Skill level: ${spec.audience.skill_level}`,
      spec.audience.language ? `Language: ${spec.audience.language}` : '',
      spec.audience.tone ? `Tone: ${spec.audience.tone}` : '',
    ].filter(Boolean),
    dependencies: ['mission'],
  })

  // Scope nodes
  nodes.push({
    id: 'scope',
    type: 'scope',
    requirements: [
      ...spec.scope.must_do.map((item) => `MUST: ${item}`),
      ...spec.scope.should_do.map((item) => `SHOULD: ${item}`),
      ...spec.scope.nice_to_have.map((item) => `NICE: ${item}`),
      ...spec.scope.out_of_scope.map((item) => `OUT: ${item}`),
    ],
    dependencies: ['mission', 'audience'],
  })

  // IO Contracts node
  nodes.push({
    id: 'io_contracts',
    type: 'io_contracts',
    requirements: [
      ...spec.io_contracts.inputs.map(
        (input) => `INPUT: ${input.name} (${input.format})`
      ),
      `OUTPUT: ${spec.io_contracts.outputs.format}`,
      ...spec.io_contracts.outputs.sections.map((s) => `SECTION: ${s}`),
    ],
    dependencies: ['scope'],
  })

  // Constraints node
  nodes.push({
    id: 'constraints',
    type: 'constraints',
    requirements: [
      spec.constraints.length ? `Length: ${spec.constraints.length}` : '',
      spec.constraints.citation_policy
        ? `Citation: ${spec.constraints.citation_policy}`
        : '',
      spec.constraints.verification
        ? `Verification: ${spec.constraints.verification}`
        : '',
    ].filter(Boolean),
    dependencies: ['io_contracts'],
  })

  // Safety node
  nodes.push({
    id: 'safety',
    type: 'safety',
    requirements: [
      ...spec.safety.refusals.map((r) => `REFUSE: ${r}`),
      ...spec.safety.sensitive_topics.map((t) => `AVOID: ${t}`),
    ],
    dependencies: ['scope', 'constraints'],
  })

  // Examples node
  nodes.push({
    id: 'examples',
    type: 'examples',
    requirements: [
      ...spec.examples.good.map((e) => `GOOD: ${e.substring(0, 100)}...`),
      ...spec.examples.bad.map((e) => `BAD: ${e.substring(0, 100)}...`),
    ],
    dependencies: ['io_contracts'],
  })

  // Build edges based on dependencies
  for (const node of nodes) {
    for (const dep of node.dependencies) {
      edges.push({
        from: dep,
        to: node.id,
        type: 'requires',
      })
    }
  }

  return { nodes, edges }
}

