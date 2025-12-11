'use client'

import { useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import type { AgentVersion } from '@core/types/version'

interface ScoreTrendMiniChartProps {
  versions: AgentVersion[]
  scoreType: 'quality' | 'test'
}

export function ScoreTrendMiniChart({ versions, scoreType }: ScoreTrendMiniChartProps) {
  const data = useMemo(() => {
    return versions
      .slice()
      .reverse()
      .map((v) => ({
        version: v.version_number,
        score: scoreType === 'quality' ? v.quality_score : v.test_pass_rate || 0,
      }))
      .filter((d) => d.score > 0)
  }, [versions, scoreType])

  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">
            {scoreType === 'quality' ? 'Quality Score' : 'Test Pass Rate'} Trend
          </CardTitle>
          <CardDescription>No data available</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  const maxScore = Math.max(...data.map((d) => d.score))
  const minScore = Math.min(...data.map((d) => d.score))
  const range = maxScore - minScore || 1

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">
          {scoreType === 'quality' ? 'Quality Score' : 'Test Pass Rate'} Trend
        </CardTitle>
        <CardDescription>
          {data.length} version{data.length !== 1 ? 's' : ''}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-24 flex items-end gap-1">
          {data.map((point, index) => {
            const height = ((point.score - minScore) / range) * 100
            return (
              <div
                key={index}
                className="flex-1 bg-primary rounded-t transition-all hover:bg-primary/80"
                style={{ height: `${Math.max(height, 5)}%` }}
                title={`Version ${point.version}: ${point.score.toFixed(1)}${scoreType === 'quality' ? '' : '%'}`}
              />
            )
          })}
        </div>
        <div className="flex justify-between text-xs text-muted-foreground mt-2">
          <span>v{data[0]?.version}</span>
          <span>v{data[data.length - 1]?.version}</span>
        </div>
      </CardContent>
    </Card>
  )
}

