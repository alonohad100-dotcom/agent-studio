/**
 * Zod Validation Schemas for Spec Blocks
 */

import { z } from 'zod'
import type { SpecJSON } from '../../types/spec'

export const missionBlockSchema = z.object({
  problem: z.string().min(1, 'Problem statement is required').max(1000, 'Problem statement must be 1000 characters or less'),
  success_criteria: z.array(z.string().min(1, 'Success criteria cannot be empty')).min(1, 'At least one success criterion is required'),
  non_goals: z.array(z.string().min(1, 'Non-goal cannot be empty')),
})

export const audienceBlockSchema = z.object({
  persona: z.string().min(1, 'Persona description is required').max(500, 'Persona must be 500 characters or less'),
  skill_level: z.enum(['beginner', 'intermediate', 'advanced', 'expert'], {
    required_error: 'Skill level is required',
  }),
  language: z.string().max(100, 'Language must be 100 characters or less'),
  tone: z.string().max(100, 'Tone must be 100 characters or less'),
})

export const scopeBlockSchema = z.object({
  must_do: z.array(z.string().min(1, 'Must-do item cannot be empty')).min(1, 'At least one must-do item is required'),
  should_do: z.array(z.string().min(1, 'Should-do item cannot be empty')),
  nice_to_have: z.array(z.string().min(1, 'Nice-to-have item cannot be empty')),
  out_of_scope: z.array(z.string().min(1, 'Out-of-scope item cannot be empty')).min(1, 'At least one out-of-scope item is required'),
})

export const ioContractsBlockSchema = z.object({
  inputs: z.array(
    z.object({
      name: z.string().min(1, 'Input name is required'),
      format: z.string().min(1, 'Input format is required'),
      constraints: z.array(z.string().min(1, 'Constraint cannot be empty')),
    })
  ).min(1, 'At least one input is required'),
  outputs: z.object({
    format: z.string().min(1, 'Output format is required'),
    sections: z.array(z.string().min(1, 'Section cannot be empty')),
    style_rules: z.array(z.string().min(1, 'Style rule cannot be empty')),
  }),
})

export const constraintsBlockSchema = z.object({
  length: z.string().min(1, 'Length constraint is required').max(200, 'Length constraint must be 200 characters or less'),
  citation_policy: z.string().max(500, 'Citation policy must be 500 characters or less'),
  verification: z.string().max(500, 'Verification must be 500 characters or less'),
})

export const safetyBlockSchema = z.object({
  refusals: z.array(z.string().min(1, 'Refusal scenario cannot be empty')).min(1, 'At least one refusal scenario is required'),
  sensitive_topics: z.array(z.string().min(1, 'Sensitive topic cannot be empty')),
})

export const examplesBlockSchema = z.object({
  good: z.array(z.string().min(1, 'Good example cannot be empty')),
  bad: z.array(z.string().min(1, 'Bad example cannot be empty')),
})

export const metadataBlockSchema = z.object({
  domain_tags: z.array(z.string().min(1, 'Domain tag cannot be empty')),
  template_id: z.string().nullable(),
})

export const specSchema: z.ZodType<SpecJSON> = z.object({
  mission: missionBlockSchema,
  audience: audienceBlockSchema,
  scope: scopeBlockSchema,
  io_contracts: ioContractsBlockSchema,
  constraints: constraintsBlockSchema,
  safety: safetyBlockSchema,
  examples: examplesBlockSchema,
  metadata: metadataBlockSchema,
})

export type ValidatedSpecJSON = z.infer<typeof specSchema>

