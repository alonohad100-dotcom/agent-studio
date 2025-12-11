'use client'

import { Progress } from '@/components/ui/progress'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { calculateCompleteness } from '@core/spec/completeness'
import type { SpecJSON } from '@core/types/spec'

interface SpecCompletenessMeterProps {
  spec: SpecJSON
}

export function SpecCompletenessMeter({ spec }: SpecCompletenessMeterProps) {
  const completeness = calculateCompleteness(spec)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Specification Completeness</CardTitle>
        <CardDescription>Track your progress</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">Overall</span>
            <span className="text-muted-foreground">{completeness.overall}%</span>
          </div>
          <Progress value={completeness.overall} className="h-2" />
        </div>

        <div className="space-y-2 pt-2 border-t">
          {Object.entries(completeness.byBlock).map(([block, score]) => (
            <div key={block} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="capitalize">{block.replace('_', ' ')}</span>
                <span className="text-muted-foreground">{score}%</span>
              </div>
              <Progress value={score} className="h-1" />
            </div>
          ))}
        </div>

        {completeness.missingFields.length > 0 && (
          <div className="pt-2 border-t">
            <p className="text-xs font-medium text-muted-foreground mb-1">
              Missing required fields:
            </p>
            <ul className="text-xs text-muted-foreground space-y-1">
              {completeness.missingFields.slice(0, 5).map((field) => (
                <li key={field} className="flex items-center gap-1">
                  <span className="text-destructive">•</span>
                  <span>{field}</span>
                </li>
              ))}
              {completeness.missingFields.length > 5 && (
                <li className="text-muted-foreground">
                  +{completeness.missingFields.length - 5} more
                </li>
              )}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

