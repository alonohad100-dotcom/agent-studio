'use client'

import { useState, useTransition } from 'react'
import { ExportCard } from '@/components/export/ExportCard'
import { ExportBundleCard } from '@/components/export/ExportBundleCard'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { exportBundle } from '@/lib/actions/export'
import { generateExportFiles } from '@/lib/utils/export'
import { toast } from 'sonner'
import type { AgentVersion } from '@core/types/version'

interface DeployPageClientProps {
  agentId: string
  versions: AgentVersion[]
}

export function DeployPageClient({ agentId, versions }: DeployPageClientProps) {
  const [selectedVersionId, setSelectedVersionId] = useState<string | undefined>(
    versions.length > 0 ? versions[0].id : undefined
  )
  const [exportData, setExportData] = useState<{
    agentConfig: string
    promptPackage: string
    testReport: string
  } | null>(null)
  const [isLoading, startLoad] = useTransition()

  const handleLoadExport = () => {
    if (!selectedVersionId && versions.length === 0) {
      toast.error('No versions available to export')
      return
    }

    startLoad(async () => {
      try {
        const bundle = await exportBundle(agentId, selectedVersionId)
        const files = generateExportFiles(bundle)
        setExportData(files)
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Failed to load export data')
      }
    })
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Select Version</CardTitle>
          <CardDescription>Choose which version to export</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Select
            value={selectedVersionId || ''}
            onValueChange={(value) => setSelectedVersionId(value || undefined)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select version" />
            </SelectTrigger>
            <SelectContent>
              {versions.length === 0 ? (
                <SelectItem value="" disabled>
                  No versions available
                </SelectItem>
              ) : (
                versions.map((version) => (
                  <SelectItem key={version.id} value={version.id}>
                    Version {version.version_number} (Score: {version.quality_score})
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
          {versions.length === 0 && (
            <p className="text-sm text-muted-foreground">
              You need to publish at least one version before you can export.
            </p>
          )}
        </CardContent>
      </Card>

      {versions.length > 0 && (
        <>
          <ExportBundleCard agentId={agentId} versionId={selectedVersionId} />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Individual Files</h2>
              <Button onClick={handleLoadExport} disabled={isLoading || !selectedVersionId}>
                {isLoading ? 'Loading...' : 'Load Export Data'}
              </Button>
            </div>

            {exportData ? (
              <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-3">
                <ExportCard
                  title="Agent Config"
                  description="Agent metadata and capabilities"
                  fileName="agent-config.json"
                  content={exportData.agentConfig}
                  onDownload={() => toast.success('Agent config downloaded')}
                />
                <ExportCard
                  title="Prompt Package"
                  description="Compiled prompt layers"
                  fileName="prompt-package.json"
                  content={exportData.promptPackage}
                  onDownload={() => toast.success('Prompt package downloaded')}
                />
                <ExportCard
                  title="Test Report"
                  description="Test cases and results"
                  fileName="test-report.json"
                  content={exportData.testReport}
                  onDownload={() => toast.success('Test report downloaded')}
                />
              </div>
            ) : (
              <Card>
                <CardContent className="py-8 text-center text-muted-foreground">
                  <p>Click &quot;Load Export Data&quot; to preview and download individual files</p>
                </CardContent>
              </Card>
            )}
          </div>
        </>
      )}
    </div>
  )
}

