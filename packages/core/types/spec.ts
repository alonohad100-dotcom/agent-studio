/**
 * Spec Schema Types
 * 
 * TypeScript types for the Agent Studio specification schema
 * Based on Section 9.1 of the technical specification
 */

export interface SpecJSON {
  mission: {
    problem: string
    success_criteria: string[]
    non_goals: string[]
  }
  audience: {
    persona: string
    skill_level: string
    language: string
    tone: string
  }
  scope: {
    must_do: string[]
    should_do: string[]
    nice_to_have: string[]
    out_of_scope: string[]
  }
  io_contracts: {
    inputs: Array<{
      name: string
      format: string
      constraints: string[]
    }>
    outputs: {
      format: string
      sections: string[]
      style_rules: string[]
    }
  }
  constraints: {
    length: string
    citation_policy: string
    verification: string
  }
  safety: {
    refusals: string[]
    sensitive_topics: string[]
  }
  examples: {
    good: string[]
    bad: string[]
  }
  metadata: {
    domain_tags: string[]
    template_id: string | null
  }
}

export const EMPTY_SPEC: SpecJSON = {
  mission: {
    problem: '',
    success_criteria: [],
    non_goals: [],
  },
  audience: {
    persona: '',
    skill_level: '',
    language: '',
    tone: '',
  },
  scope: {
    must_do: [],
    should_do: [],
    nice_to_have: [],
    out_of_scope: [],
  },
  io_contracts: {
    inputs: [],
    outputs: {
      format: '',
      sections: [],
      style_rules: [],
    },
  },
  constraints: {
    length: '',
    citation_policy: '',
    verification: '',
  },
  safety: {
    refusals: [],
    sensitive_topics: [],
  },
  examples: {
    good: [],
    bad: [],
  },
  metadata: {
    domain_tags: [],
    template_id: null,
  },
}

export type SpecBlockName =
  | 'mission'
  | 'audience'
  | 'scope'
  | 'io_contracts'
  | 'constraints'
  | 'safety'
  | 'examples'
  | 'metadata'

export interface SpecBlockConfig {
  name: SpecBlockName
  title: string
  description: string
  required: boolean
}

export const SPEC_BLOCKS: SpecBlockConfig[] = [
  {
    name: 'mission',
    title: 'Mission',
    description: 'Define the problem and success criteria',
    required: true,
  },
  {
    name: 'audience',
    title: 'Audience',
    description: 'Describe your target audience',
    required: true,
  },
  {
    name: 'scope',
    title: 'Scope',
    description: 'Define what the agent should and should not do',
    required: true,
  },
  {
    name: 'io_contracts',
    title: 'Input/Output Contracts',
    description: 'Specify input formats and output structure',
    required: true,
  },
  {
    name: 'constraints',
    title: 'Constraints',
    description: 'Set length, citation, and verification rules',
    required: true,
  },
  {
    name: 'safety',
    title: 'Safety Boundaries',
    description: 'Define refusal scenarios and sensitive topics',
    required: true,
  },
  {
    name: 'examples',
    title: 'Examples',
    description: 'Provide good and bad examples',
    required: false,
  },
  {
    name: 'metadata',
    title: 'Metadata',
    description: 'Add domain tags and template references',
    required: false,
  },
]

