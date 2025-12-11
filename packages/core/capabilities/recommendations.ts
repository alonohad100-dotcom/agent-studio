/**
 * Capability Recommendations
 * Analyzes spec to suggest relevant capabilities
 */

import type { SpecJSON } from '../types/spec'
import type { CapabilitiesJSON } from '../types/capabilities'

export interface CapabilityRecommendation {
  category: keyof CapabilitiesJSON
  capability: string
  reason: string
  confidence: 'high' | 'medium' | 'low'
}

/**
 * Recommend capabilities based on spec content
 */
export function recommendCapabilities(spec: SpecJSON): CapabilityRecommendation[] {
  const recommendations: CapabilityRecommendation[] = []

  // Check for web search indicators
  if (
    spec.scope.must_do.some((item) =>
      item.toLowerCase().includes('search') || item.toLowerCase().includes('find information')
    )
  ) {
    recommendations.push({
      category: 'information',
      capability: 'web_search',
      reason: 'Spec mentions searching or finding information',
      confidence: 'high',
    })
  }

  // Check for code generation indicators
  if (
    spec.mission.problem.toLowerCase().includes('code') ||
    spec.scope.must_do.some((item) => item.toLowerCase().includes('code') || item.toLowerCase().includes('program'))
  ) {
    recommendations.push({
      category: 'production',
      capability: 'code_generation',
      reason: 'Spec mentions code or programming',
      confidence: 'high',
    })
  }

  // Check for content creation indicators
  if (
    spec.mission.problem.toLowerCase().includes('write') ||
    spec.mission.problem.toLowerCase().includes('create content') ||
    spec.scope.must_do.some((item) => item.toLowerCase().includes('write') || item.toLowerCase().includes('content'))
  ) {
    recommendations.push({
      category: 'production',
      capability: 'content_creation',
      reason: 'Spec mentions writing or content creation',
      confidence: 'high',
    })
  }

  // Check for analysis indicators
  if (
    spec.mission.problem.toLowerCase().includes('analyze') ||
    spec.scope.must_do.some((item) => item.toLowerCase().includes('analyze') || item.toLowerCase().includes('analysis'))
  ) {
    recommendations.push({
      category: 'decision_support',
      capability: 'analysis',
      reason: 'Spec mentions analysis tasks',
      confidence: 'high',
    })
  }

  // Check for recommendation indicators
  if (
    spec.mission.problem.toLowerCase().includes('recommend') ||
    spec.scope.must_do.some((item) => item.toLowerCase().includes('recommend') || item.toLowerCase().includes('suggest'))
  ) {
    recommendations.push({
      category: 'decision_support',
      capability: 'recommendations',
      reason: 'Spec mentions recommendations or suggestions',
      confidence: 'high',
    })
  }

  // Check for API call indicators
  if (
    spec.scope.must_do.some((item) => item.toLowerCase().includes('api') || item.toLowerCase().includes('call'))
  ) {
    recommendations.push({
      category: 'automation',
      capability: 'api_calls',
      reason: 'Spec mentions API calls',
      confidence: 'medium',
    })
  }

  // Check for file operation indicators
  if (
    spec.scope.must_do.some((item) =>
      item.toLowerCase().includes('file') || item.toLowerCase().includes('read') || item.toLowerCase().includes('write')
    )
  ) {
    recommendations.push({
      category: 'automation',
      capability: 'file_operations',
      reason: 'Spec mentions file operations',
      confidence: 'medium',
    })
  }

  // Check for knowledge base indicators
  if (spec.metadata.domain_tags.length > 0) {
    recommendations.push({
      category: 'information',
      capability: 'knowledge_base',
      reason: 'Spec has domain tags, knowledge base may be useful',
      confidence: 'low',
    })
  }

  return recommendations
}

