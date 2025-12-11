'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle, AlertTriangle, Info, CheckCircle2, Wrench } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { LintFinding } from '@core/types/prompt'

interface LintPanelProps {
  findings: LintFinding[]
  onApplyFix?: (ruleId: string) => void
  showFixButtons?: boolean
}

export function LintPanel({ findings, onApplyFix, showFixButtons = false }: LintPanelProps) {
  const critical = findings.filter((f) => f.severity === 'critical')
  const high = findings.filter((f) => f.severity === 'high')
  const medium = findings.filter((f) => f.severity === 'medium')
  const low = findings.filter((f) => f.severity === 'low')

  const getSeverityIcon = (severity: LintFinding['severity']) => {
    switch (severity) {
      case 'critical':
        return <AlertCircle className="h-4 w-4 text-destructive" />
      case 'high':
        return <AlertTriangle className="h-4 w-4 text-warning" />
      case 'medium':
        return <Info className="h-4 w-4 text-blue-500" />
      case 'low':
        return <Info className="h-4 w-4 text-muted-foreground" />
      default:
        return <Info className="h-4 w-4" />
    }
  }

  const getSeverityVariant = (severity: LintFinding['severity']) => {
    switch (severity) {
      case 'critical':
        return 'destructive'
      case 'high':
        return 'default'
      case 'medium':
        return 'default'
      case 'low':
        return 'default'
      default:
        return 'default'
    }
  }

  if (findings.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Lint Results</CardTitle>
          <CardDescription>Specification validation</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <CheckCircle2 className="h-4 w-4 text-success" />
            <AlertTitle>All Clear</AlertTitle>
            <AlertDescription>
              No lint issues found. Your specification is ready for compilation.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lint Findings</CardTitle>
        <CardDescription>
          {findings.length} issue{findings.length > 1 ? 's' : ''} found
          {critical.length > 0 && (
            <span className="text-destructive ml-2">
              ({critical.length} critical{critical.length > 1 ? 's' : ''})
            </span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Summary */}
        <div className="flex flex-wrap gap-2">
          {critical.length > 0 && (
            <Badge variant="destructive">
              {critical.length} Critical
            </Badge>
          )}
          {high.length > 0 && (
            <Badge variant="secondary" className="bg-warning/20 text-warning">
              {high.length} High
            </Badge>
          )}
          {medium.length > 0 && (
            <Badge variant="secondary">
              {medium.length} Medium
            </Badge>
          )}
          {low.length > 0 && (
            <Badge variant="outline">
              {low.length} Low
            </Badge>
          )}
        </div>

        {/* Findings List */}
        <div className="space-y-3">
          {findings.map((finding, index) => (
            <Alert
              key={index}
              variant={getSeverityVariant(finding.severity)}
            >
              <div className="flex items-start gap-3">
                {getSeverityIcon(finding.severity)}
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <AlertTitle className="capitalize">
                      {finding.severity}: {finding.block?.replace('_', ' ') || 'Unknown Block'}
                    </AlertTitle>
                    {finding.field && (
                      <Badge variant="outline" className="text-xs">
                        {finding.field}
                      </Badge>
                    )}
                  </div>
                  <AlertDescription>
                    <p className="font-medium">{finding.message}</p>
                    {finding.suggestion && (
                      <p className="mt-2 text-sm text-muted-foreground">
                        <strong>Suggestion:</strong> {finding.suggestion}
                      </p>
                    )}
                    {showFixButtons && onApplyFix && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="mt-2"
                        onClick={() => onApplyFix(finding.rule_id)}
                      >
                        <Wrench className="mr-2 h-3 w-3" />
                        Apply Fix
                      </Button>
                    )}
                  </AlertDescription>
                </div>
              </div>
            </Alert>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

