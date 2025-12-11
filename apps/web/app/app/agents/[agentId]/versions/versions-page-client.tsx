'use client'

import { useState } from 'react'
import { VersionTimeline } from '@/components/versions/VersionTimeline'
import { ScoreTrendMiniChart } from '@/components/versions/ScoreTrendMiniChart'
import { PublishDialog } from '@/components/versions/PublishDialog'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import type { AgentVersion } from '@core/types/version'

interface VersionsPageClientProps {
  agentId: string
  initialVersions: AgentVersion[]
}

export function VersionsPageClient({ agentId, initialVersions }: VersionsPageClientProps) {
  const [versions] = useState<AgentVersion[]>(initialVersions)
  const [publishDialogOpen, setPublishDialogOpen] = useState(false)

  const handlePublished = () => {
    // Refresh versions list
    window.location.reload()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Version History</h2>
          <p className="text-sm text-muted-foreground">
            {versions.length} published version{versions.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Button onClick={() => setPublishDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Publish New Version
        </Button>
      </div>

      {versions.length > 0 && (
        <div className="grid gap-6 md:grid-cols-2">
          <ScoreTrendMiniChart versions={versions} scoreType="quality" />
          <ScoreTrendMiniChart versions={versions} scoreType="test" />
        </div>
      )}

      <VersionTimeline versions={versions} agentId={agentId} />

      <PublishDialog
        agentId={agentId}
        open={publishDialogOpen}
        onOpenChange={setPublishDialogOpen}
        onPublished={handlePublished}
      />
    </div>
  )
}

