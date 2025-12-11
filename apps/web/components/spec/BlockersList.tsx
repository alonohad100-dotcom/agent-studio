'use client'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle, AlertTriangle, CheckCircle2 } from 'lucide-react'
import { detectBlockers } from '@core/spec/blockers'
import type { SpecJSON } from '@core/types/spec'

interface BlockersListProps {
  spec: SpecJSON
}

export function BlockersList({ spec }: BlockersListProps) {
  const blockers = detectBlockers(spec)
  const errors = blockers.filter((b) => b.severity === 'error')
  const warnings = blockers.filter((b) => b.severity === 'warning')

  if (blockers.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Publish Readiness</CardTitle>
          <CardDescription>Specification status</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <CheckCircle2 className="h-4 w-4 text-success" />
            <AlertTitle>Ready to Publish</AlertTitle>
            <AlertDescription>
              Your specification is complete and valid. You can proceed to publish.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Blockers</CardTitle>
        <CardDescription>
          {errors.length > 0 && `${errors.length} error${errors.length > 1 ? 's' : ''}`}
          {errors.length > 0 && warnings.length > 0 && ', '}
          {warnings.length > 0 && `${warnings.length} warning${warnings.length > 1 ? 's' : ''}`}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {errors.map((blocker, index) => (
          <Alert key={index} variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle className="capitalize">{blocker.block.replace('_', ' ')}</AlertTitle>
            <AlertDescription>{blocker.message}</AlertDescription>
          </Alert>
        ))}

        {warnings.map((blocker, index) => (
          <Alert key={`warning-${index}`}>
            <AlertTriangle className="h-4 w-4 text-warning" />
            <AlertTitle className="capitalize">{blocker.block.replace('_', ' ')}</AlertTitle>
            <AlertDescription>{blocker.message}</AlertDescription>
          </Alert>
        ))}
      </CardContent>
    </Card>
  )
}

