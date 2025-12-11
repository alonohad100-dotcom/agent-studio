'use client'

import { Progress } from '@/components/ui/progress'
import { calculateCompleteness } from '@core/spec/completeness'
import type { SpecJSON } from '@core/types/spec'
import { cn } from '@/lib/utils'

interface CompletionMeterProps {
  spec: SpecJSON
  className?: string
  showLabel?: boolean
}

export function CompletionMeter({ spec, className, showLabel = true }: CompletionMeterProps) {
  const completeness = calculateCompleteness(spec)

  const getColorClass = (percentage: number) => {
    if (percentage >= 80) return 'bg-success'
    if (percentage >= 50) return 'bg-warning'
    return 'bg-destructive'
  }

  return (
    <div className={cn('space-y-2', className)}>
      {showLabel && (
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium">Completeness</span>
          <span className={cn('font-semibold', {
            'text-success': completeness.overall >= 80,
            'text-warning': completeness.overall >= 50 && completeness.overall < 80,
            'text-destructive': completeness.overall < 50,
          })}>
            {completeness.overall}%
          </span>
        </div>
      )}
      <Progress
        value={completeness.overall}
        className={cn('h-2', getColorClass(completeness.overall))}
      />
    </div>
  )
}

