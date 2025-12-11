/**
 * Layer Generation
 * Stage 5: Generate layered prompts
 */

import type { Policy, CompilerInput } from './types'
import type { PromptPackageJSON } from '../types/prompt'
import {
  generateSystemBackbone,
  generateDomainManual,
  generateOutputContracts,
  generateToolPolicy,
  generateExamples,
} from './templates'

export function generateLayers(
  _policies: Policy[],
  input: CompilerInput
): PromptPackageJSON {
  return {
    system_backbone: generateSystemBackbone(input.spec),
    domain_manual: generateDomainManual(input.spec, input.knowledgeMap),
    output_contracts: generateOutputContracts(input.spec),
    tool_policy: generateToolPolicy(input.capabilities),
    examples: generateExamples(input.spec),
  }
}

