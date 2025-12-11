'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertTriangle, CheckCircle2 } from 'lucide-react'
import type { QualityScore } from '@core/types/prompt'
import { cn } from '@/lib/utils'

interface QualityScoreCardProps {
  score: QualityScore
  threshold?: number
  showBreakdown?: boolean
}

export function QualityScoreCard({
  score,
  threshold = 70,
  showBreakdown = true,
}: QualityScoreCardProps) {
  const isAboveThreshold = score.overall >= threshold
  const getScoreColor = (value: number) => {
    if (value >= 80) return 'text-success'
    if (value >= 60) return 'text-warning'
    return 'text-destructive'
  }

  const getProgressColor = (value: number) => {
    if (value >= 80) return 'bg-success'
    if (value >= 60) return 'bg-warning'
    return 'bg-destructive'
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Quality Score</CardTitle>
            <CardDescription>Overall specification quality assessment</CardDescription>
          </div>
          <Badge
            variant={isAboveThreshold ? 'default' : 'destructive'}
            className={cn('text-lg font-semibold', getScoreColor(score.overall))}
          >
            {score.overall}%
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Overall Score */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">Overall Score</span>
            <span className={cn('font-semibold', getScoreColor(score.overall))}>
              {score.overall}%
            </span>
          </div>
          <Progress
            value={score.overall}
            className={cn('h-3', getProgressColor(score.overall))}
          />
        </div>

        {/* Threshold Alert */}
        {!isAboveThreshold && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Quality score is below the publish threshold ({threshold}%). 
              Address critical issues to improve your score.
            </AlertDescription>
          </Alert>
        )}

        {isAboveThreshold && (
          <Alert>
            <CheckCircle2 className="h-4 w-4 text-success" />
            <AlertDescription>
              Quality score meets the publish threshold. Your specification is ready for publishing.
            </AlertDescription>
          </Alert>
        )}

        {/* Score Breakdown */}
        {showBreakdown && (
          <div className="space-y-3 pt-2 border-t">
            <h4 className="text-sm font-semibold">Score Breakdown</h4>
            <div className="space-y-2">
              <ScoreComponent
                label="Spec Completeness"
                score={score.spec_completeness}
                weight={30}
              />
              <ScoreComponent
                label="Instruction Clarity"
                score={score.instruction_clarity}
                weight={25}
              />
              <ScoreComponent
                label="Safety Clarity"
                score={score.safety_clarity}
                weight={15}
              />
              <ScoreComponent
                label="Output Contract Strength"
                score={score.output_contract_strength}
                weight={15}
              />
              <ScoreComponent
                label="Test Coverage"
                score={score.test_coverage}
                weight={15}
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function ScoreComponent({
  label,
  score,
  weight,
}: {
  label: string
  score: number
  weight: number
}) {
  const getScoreColor = (value: number) => {
    if (value >= 80) return 'text-success'
    if (value >= 60) return 'text-warning'
    return 'text-destructive'
  }

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground">
          {label} ({weight}%)
        </span>
        <span className={cn('font-medium', getScoreColor(score))}>
          {score}%
        </span>
      </div>
      <Progress value={score} className="h-1.5" />
    </div>
  )
}

