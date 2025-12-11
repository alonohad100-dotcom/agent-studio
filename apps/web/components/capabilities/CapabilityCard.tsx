'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { AlertTriangle, CheckCircle2 } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface CapabilityCardProps {
  title: string
  description: string
  enabled: boolean
  onToggle: (enabled: boolean) => void
  subCapabilities?: Array<{
    key: string
    label: string
    enabled: boolean
    onToggle: (enabled: boolean) => void
  }>
  blockers?: string[]
  blockerMessage?: string
}

export function CapabilityCard({
  title,
  description,
  enabled,
  onToggle,
  subCapabilities = [],
  blockers = [],
  blockerMessage,
}: CapabilityCardProps) {
  const hasBlockers = blockers.length > 0

  return (
    <Card className={hasBlockers && enabled ? 'border-warning' : ''}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg">{title}</CardTitle>
            <CardDescription className="mt-1">{description}</CardDescription>
          </div>
          <Switch checked={enabled} onCheckedChange={onToggle} />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {hasBlockers && enabled && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              {blockerMessage || 'Some requirements are missing:'}
              <ul className="mt-2 list-disc list-inside text-sm">
                {blockers.map((blocker) => (
                  <li key={blocker}>{blocker}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        {!hasBlockers && enabled && (
          <div className="flex items-center gap-2 text-sm text-success">
            <CheckCircle2 className="h-4 w-4" />
            <span>All requirements met</span>
          </div>
        )}

        {enabled && subCapabilities.length > 0 && (
          <div className="space-y-3 pt-2 border-t">
            {subCapabilities.map((sub) => (
              <div key={sub.key} className="flex items-center justify-between">
                <Label htmlFor={`sub-${sub.key}`} className="text-sm font-normal cursor-pointer">
                  {sub.label}
                </Label>
                <Switch id={`sub-${sub.key}`} checked={sub.enabled} onCheckedChange={sub.onToggle} />
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

