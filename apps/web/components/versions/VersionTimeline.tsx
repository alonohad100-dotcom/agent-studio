'use client'

import { VersionCard } from './VersionCard'
import type { AgentVersion } from '@core/types/version'

interface VersionTimelineProps {
  versions: AgentVersion[]
  agentId: string
}

export function VersionTimeline({ versions, agentId }: VersionTimelineProps) {
  if (versions.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p className="text-lg font-medium mb-2">No versions yet</p>
        <p className="text-sm">Publish your first version to get started</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {versions.map((version, index) => (
        <VersionCard
          key={version.id}
          version={version}
          previousVersion={index < versions.length - 1 ? versions[index + 1] : undefined}
          agentId={agentId}
        />
      ))}
    </div>
  )
}

