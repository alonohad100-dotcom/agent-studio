'use client'

import { useState, useTransition } from 'react'
import { CapabilityMatrix } from '@/components/capabilities/CapabilityMatrix'
import { CapabilityRuleHints } from '@/components/capabilities/CapabilityRuleHints'
import { saveDraftCapabilities } from '@/lib/actions/drafts'
import { toast } from 'sonner'
import { AutosaveIndicator } from '@/components/ui/autosave-indicator'
import type { CapabilitiesJSON } from '@core/types/capabilities'
import type { SpecJSON } from '@core/types/spec'
import { useDebouncedCallback } from 'use-debounce'

interface CapabilitiesPageClientProps {
  agentId: string
  initialSpec: SpecJSON
  initialCapabilities: CapabilitiesJSON
}

export function CapabilitiesPageClient({
  agentId,
  initialSpec,
  initialCapabilities,
}: CapabilitiesPageClientProps) {
  const [capabilities, setCapabilities] = useState<CapabilitiesJSON>(initialCapabilities)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const [isPending, startTransition] = useTransition()

  const debouncedSave = useDebouncedCallback(
    async (updatedCapabilities: CapabilitiesJSON) => {
      setSaveStatus('saving')
      startTransition(async () => {
        try {
          await saveDraftCapabilities(agentId, updatedCapabilities)
          setSaveStatus('saved')
          setTimeout(() => setSaveStatus('idle'), 2000)
        } catch (error) {
          setSaveStatus('error')
          toast.error(error instanceof Error ? error.message : 'Failed to save capabilities')
          setTimeout(() => setSaveStatus('idle'), 3000)
        }
      })
    },
    1000 // 1 second debounce
  )

  const handleUpdate = (updatedCapabilities: CapabilitiesJSON) => {
    setCapabilities(updatedCapabilities)
    debouncedSave(updatedCapabilities)
  }

  const handleApplyRecommendation = (category: string, capability: string) => {
    const updated = { ...capabilities }
    const categoryKey = category as keyof CapabilitiesJSON
    
    if (categoryKey === 'information') {
      updated.information = {
        ...updated.information,
        enabled: true,
        [capability]: true,
      }
    } else if (categoryKey === 'production') {
      updated.production = {
        ...updated.production,
        enabled: true,
        [capability]: true,
      }
    } else if (categoryKey === 'decision_support') {
      updated.decision_support = {
        ...updated.decision_support,
        enabled: true,
        [capability]: true,
      }
    } else if (categoryKey === 'automation') {
      updated.automation = {
        ...updated.automation,
        enabled: true,
        [capability]: true,
      }
    } else if (categoryKey === 'domain_specific') {
      updated.domain_specific = {
        ...updated.domain_specific,
        enabled: true,
      }
    }

    setCapabilities(updated)
    debouncedSave(updated)
    toast.success(`Enabled ${capability.replace('_', ' ')}`)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Capability Matrix</h2>
          <AutosaveIndicator status={saveStatus} />
        </div>
        <CapabilityMatrix capabilities={capabilities} spec={initialSpec} onUpdate={handleUpdate} />
      </div>

      <div className="space-y-6">
        <CapabilityRuleHints spec={initialSpec} onApplyRecommendation={handleApplyRecommendation} />
      </div>
    </div>
  )
}

