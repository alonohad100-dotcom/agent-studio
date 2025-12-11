/**
 * Prompt Compiler
 * Main compiler class that orchestrates all compilation stages
 */

import type { CompilerInput, CompilerOutput } from './types'
import { normalizeSpec } from './normalize'
import { validateSpec } from './validate'
import { buildRequirementGraph } from './graph'
import { expandPolicies } from './policies'
import { generateLayers } from './layers'
import { lintPromptPackage } from './lint'
import { computeQualityScore } from './score'
import { generateSuggestions } from './suggestions'

export class PromptCompiler {
  async compile(input: CompilerInput): Promise<CompilerOutput> {
    // Stage 1: Normalize
    const normalized = normalizeSpec(input.spec)

    // Stage 2: Validate
    const validation = validateSpec(normalized)
    if (!validation.valid) {
      throw new Error(`Spec incomplete: ${validation.errors.join(', ')}`)
    }

    // Stage 3: Build graph
    const graph = buildRequirementGraph(normalized)

    // Stage 4: Expand policies
    const policies = expandPolicies(graph, input.capabilities)

    // Stage 5: Generate layers
    const layers = generateLayers(policies, input)

    // Stage 6: Lint
    const lintFindings = lintPromptPackage(layers, normalized)

    // Stage 7: Score
    const qualityScore = computeQualityScore(normalized, layers, lintFindings)

    // Stage 8: Suggestions
    const suggestions = generateSuggestions(lintFindings, qualityScore)

    return {
      promptPackage: layers,
      lintFindings,
      qualityScore,
      suggestions,
    }
  }
}

export * from './types'
export * from './normalize'
export * from './validate'
export * from './graph'
export * from './policies'
export * from './layers'
export * from './lint'
export * from './score'
export * from './suggestions'
export * from './templates'

