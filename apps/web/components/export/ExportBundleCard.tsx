'use client'

import { useState, useTransition } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Download, Loader2, Package, CheckCircle2 } from 'lucide-react'
import { exportBundle, generateExportFiles } from '@/lib/actions/export'
import { trackEvent } from '@/lib/telemetry/events'
import { toast } from 'sonner'
import JSZip from 'jszip'

interface ExportBundleCardProps {
  agentId: string
  versionId?: string
}

export function ExportBundleCard({ agentId, versionId }: ExportBundleCardProps) {
  const [isExporting, startExport] = useTransition()
  const [exported, setExported] = useState(false)

  const handleExportBundle = () => {
    startExport(async () => {
      try {
        const bundle = await exportBundle(agentId, versionId)
        const files = generateExportFiles(bundle)

        // Create ZIP file
        const zip = new JSZip()
        zip.file('agent-config.json', files.agentConfig)
        zip.file('prompt-package.json', files.promptPackage)
        zip.file('test-report.json', files.testReport)

        // Generate ZIP blob
        const zipBlob = await zip.generateAsync({ type: 'blob' })

        // Download ZIP
        const url = URL.createObjectURL(zipBlob)
        const a = document.createElement('a')
        a.href = url
        a.download = `agent-export-${bundle.agentConfig.agent.name.replace(/\s+/g, '-').toLowerCase()}-v${bundle.agentConfig.active_version_number}.zip`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)

        setExported(true)
        trackEvent({
          type: 'export_downloaded',
          agentId,
          versionId: bundle.agentConfig.active_version_id,
          format: 'zip',
        })
        toast.success('Export bundle downloaded successfully!')
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Failed to export bundle')
      }
    })
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Package className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle>Export Full Bundle</CardTitle>
              <CardDescription>
                Download all export files as a ZIP archive
              </CardDescription>
            </div>
          </div>
          {exported && (
            <div className="flex items-center gap-2 text-success">
              <CheckCircle2 className="h-5 w-5" />
              <span className="text-sm font-medium">Exported</span>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <Button onClick={handleExportBundle} disabled={isExporting} className="w-full">
          {isExporting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Exporting...
            </>
          ) : (
            <>
              <Download className="mr-2 h-4 w-4" />
              Download ZIP Bundle
            </>
          )}
        </Button>
        <p className="text-xs text-muted-foreground mt-2">
          Includes: agent-config.json, prompt-package.json, test-report.json
        </p>
      </CardContent>
    </Card>
  )
}

