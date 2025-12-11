/**
 * Spec Normalization
 * Stage 1: Normalize text and lists
 */

import type { SpecJSON } from '../types/spec'
import type { NormalizedSpec } from './types'

export function normalizeSpec(spec: SpecJSON): NormalizedSpec {
  return {
    ...spec,
    mission: {
      problem: spec.mission.problem.trim(),
      success_criteria: spec.mission.success_criteria.map((c: string) => c.trim()).filter(Boolean),
      non_goals: spec.mission.non_goals.map((g: string) => g.trim()).filter(Boolean),
    },
    audience: {
      persona: spec.audience.persona.trim(),
      skill_level: spec.audience.skill_level.trim(),
      language: spec.audience.language.trim(),
      tone: spec.audience.tone.trim(),
    },
    scope: {
      must_do: spec.scope.must_do.map((item: string) => item.trim()).filter(Boolean),
      should_do: spec.scope.should_do.map((item: string) => item.trim()).filter(Boolean),
      nice_to_have: spec.scope.nice_to_have.map((item: string) => item.trim()).filter(Boolean),
      out_of_scope: spec.scope.out_of_scope.map((item: string) => item.trim()).filter(Boolean),
    },
    io_contracts: {
      inputs: spec.io_contracts.inputs.map((input: { name: string; format: string; constraints: string[] }) => ({
        name: input.name.trim(),
        format: input.format.trim(),
        constraints: input.constraints.map((c: string) => c.trim()).filter(Boolean),
      })),
      outputs: {
        format: spec.io_contracts.outputs.format.trim(),
        sections: spec.io_contracts.outputs.sections.map((s: string) => s.trim()).filter(Boolean),
        style_rules: spec.io_contracts.outputs.style_rules.map((r: string) => r.trim()).filter(Boolean),
      },
    },
    constraints: {
      length: spec.constraints.length.trim(),
      citation_policy: spec.constraints.citation_policy.trim(),
      verification: spec.constraints.verification.trim(),
    },
    safety: {
      refusals: spec.safety.refusals.map((r: string) => r.trim()).filter(Boolean),
      sensitive_topics: spec.safety.sensitive_topics.map((t: string) => t.trim()).filter(Boolean),
    },
    examples: {
      good: spec.examples.good.map((e: string) => e.trim()).filter(Boolean),
      bad: spec.examples.bad.map((e: string) => e.trim()).filter(Boolean),
    },
    metadata: {
      domain_tags: spec.metadata.domain_tags.map((t: string) => t.trim()).filter(Boolean),
      template_id: spec.metadata.template_id,
    },
    _normalized: true,
  }
}

