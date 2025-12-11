'use client'

import { useState } from 'react'
import { CapabilityCard } from './CapabilityCard'
import type { CapabilitiesJSON } from '@core/types/capabilities'
import { checkAllCapabilityRequirements } from '@core/capabilities/rules'
import type { SpecJSON } from '@core/types/spec'

interface CapabilityMatrixProps {
  capabilities: CapabilitiesJSON
  spec: SpecJSON
  onUpdate: (capabilities: CapabilitiesJSON) => void
}

export function CapabilityMatrix({ capabilities, spec, onUpdate }: CapabilityMatrixProps) {
  const [localCapabilities, setLocalCapabilities] = useState<CapabilitiesJSON>(capabilities)

  const handleCategoryToggle = (category: keyof CapabilitiesJSON, enabled: boolean) => {
    const updated = {
      ...localCapabilities,
      [category]: {
        ...localCapabilities[category],
        enabled,
      },
    }
    setLocalCapabilities(updated)
    onUpdate(updated)
  }

  const handleSubCapabilityToggle = (
    category: keyof CapabilitiesJSON,
    subKey: string,
    enabled: boolean
  ) => {
    const categoryData = localCapabilities[category] as Record<string, unknown>
    const updated = {
      ...localCapabilities,
      [category]: {
        ...categoryData,
        [subKey]: enabled,
      },
    }
    setLocalCapabilities(updated)
    onUpdate(updated)
  }

  const requirementChecks = checkAllCapabilityRequirements(localCapabilities, spec)
  const blockersMap = new Map(requirementChecks.map((check) => [check.capability, check.blockers]))
  const messagesMap = new Map(requirementChecks.map((check) => [check.capability, check.message]))

  return (
    <div className="space-y-6">
      <CapabilityCard
        title="Information"
        description="Access and retrieve information from various sources"
        enabled={localCapabilities.information.enabled}
        onToggle={(enabled) => handleCategoryToggle('information', enabled)}
        subCapabilities={[
          {
            key: 'web_search',
            label: 'Web Search',
            enabled: localCapabilities.information.web_search || false,
            onToggle: (enabled) => handleSubCapabilityToggle('information', 'web_search', enabled),
          },
          {
            key: 'knowledge_base',
            label: 'Knowledge Base',
            enabled: localCapabilities.information.knowledge_base || false,
            onToggle: (enabled) => handleSubCapabilityToggle('information', 'knowledge_base', enabled),
          },
        ]}
        blockers={blockersMap.get('web_search') || blockersMap.get('knowledge_base') || []}
        blockerMessage={messagesMap.get('web_search') || messagesMap.get('knowledge_base')}
      />

      <CapabilityCard
        title="Production"
        description="Generate code, content, and other outputs"
        enabled={localCapabilities.production.enabled}
        onToggle={(enabled) => handleCategoryToggle('production', enabled)}
        subCapabilities={[
          {
            key: 'code_generation',
            label: 'Code Generation',
            enabled: localCapabilities.production.code_generation || false,
            onToggle: (enabled) => handleSubCapabilityToggle('production', 'code_generation', enabled),
          },
          {
            key: 'content_creation',
            label: 'Content Creation',
            enabled: localCapabilities.production.content_creation || false,
            onToggle: (enabled) => handleSubCapabilityToggle('production', 'content_creation', enabled),
          },
        ]}
        blockers={
          blockersMap.get('code_generation') || blockersMap.get('content_creation') || []
        }
        blockerMessage={messagesMap.get('code_generation') || messagesMap.get('content_creation')}
      />

      <CapabilityCard
        title="Decision Support"
        description="Analyze data and provide recommendations"
        enabled={localCapabilities.decision_support.enabled}
        onToggle={(enabled) => handleCategoryToggle('decision_support', enabled)}
        subCapabilities={[
          {
            key: 'analysis',
            label: 'Analysis',
            enabled: localCapabilities.decision_support.analysis || false,
            onToggle: (enabled) => handleSubCapabilityToggle('decision_support', 'analysis', enabled),
          },
          {
            key: 'recommendations',
            label: 'Recommendations',
            enabled: localCapabilities.decision_support.recommendations || false,
            onToggle: (enabled) => handleSubCapabilityToggle('decision_support', 'recommendations', enabled),
          },
        ]}
        blockers={blockersMap.get('analysis') || blockersMap.get('recommendations') || []}
        blockerMessage={messagesMap.get('analysis') || messagesMap.get('recommendations')}
      />

      <CapabilityCard
        title="Automation"
        description="Perform automated tasks and operations"
        enabled={localCapabilities.automation.enabled}
        onToggle={(enabled) => handleCategoryToggle('automation', enabled)}
        subCapabilities={[
          {
            key: 'api_calls',
            label: 'API Calls',
            enabled: localCapabilities.automation.api_calls || false,
            onToggle: (enabled) => handleSubCapabilityToggle('automation', 'api_calls', enabled),
          },
          {
            key: 'file_operations',
            label: 'File Operations',
            enabled: localCapabilities.automation.file_operations || false,
            onToggle: (enabled) => handleSubCapabilityToggle('automation', 'file_operations', enabled),
          },
        ]}
        blockers={blockersMap.get('api_calls') || blockersMap.get('file_operations') || []}
        blockerMessage={messagesMap.get('api_calls') || messagesMap.get('file_operations')}
      />

      <CapabilityCard
        title="Domain Specific"
        description="Specialized capabilities for specific domains"
        enabled={localCapabilities.domain_specific.enabled}
        onToggle={(enabled) => handleCategoryToggle('domain_specific', enabled)}
        blockers={[]}
      />
    </div>
  )
}

