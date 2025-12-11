/**
 * Suggestions Generator
 * Stage 8: Produce suggested actions
 */

import type { LintFinding, QualityScore, Suggestion } from '../types'

export function generateSuggestions(
  findings: LintFinding[],
  score: QualityScore
): Suggestion[] {
  const suggestions: Suggestion[] = []

  // Convert critical findings to high-priority suggestions
  for (const finding of findings.filter((f) => f.severity === 'critical')) {
    suggestions.push({
      type: 'fix',
      message: finding.message,
      priority: 'high',
      actionable: true,
    })
  }

  // Convert high findings to medium-priority suggestions
  for (const finding of findings.filter((f) => f.severity === 'high')) {
    suggestions.push({
      type: 'fix',
      message: finding.message,
      priority: 'medium',
      actionable: true,
    })
  }

  // Score-based suggestions
  if (score.overall < 50) {
    suggestions.push({
      type: 'improve',
      message: 'Overall quality score is below 50%. Focus on completing required fields.',
      priority: 'high',
      actionable: true,
    })
  }

  if (score.spec_completeness < 80) {
    suggestions.push({
      type: 'improve',
      message: 'Specification completeness is low. Fill in missing required fields.',
      priority: 'high',
      actionable: true,
    })
  }

  if (score.instruction_clarity < 70) {
    suggestions.push({
      type: 'improve',
      message: 'Instruction clarity could be improved. Add more detail to your specification.',
      priority: 'medium',
      actionable: true,
    })
  }

  if (score.safety_clarity < 70) {
    suggestions.push({
      type: 'add',
      message: 'Safety boundaries need more clarity. Add refusal scenarios and sensitive topics.',
      priority: 'high',
      actionable: true,
    })
  }

  if (score.output_contract_strength < 80) {
    suggestions.push({
      type: 'improve',
      message: 'Output contracts need strengthening. Add sections and style rules.',
      priority: 'medium',
      actionable: true,
    })
  }

  return suggestions
}

