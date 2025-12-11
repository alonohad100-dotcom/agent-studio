'use client'

import { useState, useTransition } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { CheckCircle2, XCircle, Loader2, AlertCircle } from 'lucide-react'
import { publishVersion, checkPublishGates } from '@/lib/actions/versions'
import { trackEvent } from '@/lib/telemetry/events'
import { toast } from 'sonner'
import type { PublishGateResult } from '@core/types/version'

interface PublishDialogProps {
  agentId: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onPublished?: () => void
}

export function PublishDialog({ agentId, open, onOpenChange, onPublished }: PublishDialogProps) {
  const [gateResult, setGateResult] = useState<PublishGateResult | null>(null)
  const [isChecking, startChecking] = useTransition()
  const [isPublishing, startPublishing] = useTransition()

  const handleCheckGates = () => {
    startChecking(async () => {
      try {
        const result = await checkPublishGates(agentId)
        setGateResult(result)
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Failed to check gates')
      }
    })
  }

  const handlePublish = () => {
    if (!gateResult?.passed) {
      toast.error('Cannot publish: gates not passed')
      return
    }

    startPublishing(async () => {
      try {
        const version = await publishVersion(agentId)
        trackEvent({
          type: 'version_published',
          agentId,
          versionId: version.id,
          versionNumber: version.version_number,
        })
        toast.success('Version published successfully!')
        onOpenChange(false)
        onPublished?.()
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Failed to publish version')
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Publish Version</DialogTitle>
          <DialogDescription>
            Create an immutable version snapshot of your agent. This will freeze the current spec,
            prompt package, capabilities, and knowledge map.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {!gateResult && (
            <div className="text-center py-8">
              <Button onClick={handleCheckGates} disabled={isChecking}>
                {isChecking ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Checking...
                  </>
                ) : (
                  'Check Requirements'
                )}
              </Button>
            </div>
          )}

          {gateResult && (
            <>
              {gateResult.passed ? (
                <Alert>
                  <CheckCircle2 className="h-4 w-4" />
                  <AlertTitle>All requirements met</AlertTitle>
                  <AlertDescription>You can proceed with publishing this version.</AlertDescription>
                </Alert>
              ) : (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Publish blocked</AlertTitle>
                  <AlertDescription>
                    <ul className="list-disc list-inside mt-2 space-y-1">
                      {gateResult.reasons.map((reason, index) => (
                        <li key={index}>{reason}</li>
                      ))}
                    </ul>
                  </AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <h4 className="font-medium text-sm">Requirements:</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Quality Score</span>
                    <div className="flex items-center gap-2">
                      <span>{gateResult.details.qualityScore.value} / {gateResult.details.qualityScore.threshold}</span>
                      {gateResult.details.qualityScore.passed ? (
                        <CheckCircle2 className="h-4 w-4 text-success" />
                      ) : (
                        <XCircle className="h-4 w-4 text-destructive" />
                      )}
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Critical Lint Findings</span>
                    <div className="flex items-center gap-2">
                      <span>{gateResult.details.criticalLintFindings.count}</span>
                      {gateResult.details.criticalLintFindings.passed ? (
                        <CheckCircle2 className="h-4 w-4 text-success" />
                      ) : (
                        <XCircle className="h-4 w-4 text-destructive" />
                      )}
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Test Cases</span>
                    <div className="flex items-center gap-2">
                      <span>{gateResult.details.testCasesExist.count}</span>
                      {gateResult.details.testCasesExist.passed ? (
                        <CheckCircle2 className="h-4 w-4 text-success" />
                      ) : (
                        <XCircle className="h-4 w-4 text-destructive" />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          {gateResult?.passed && (
            <Button onClick={handlePublish} disabled={isPublishing}>
              {isPublishing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Publishing...
                </>
              ) : (
                'Publish Version'
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

