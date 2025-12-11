'use client'

import * as ProgressPrimitive from '@radix-ui/react-progress'
import { Progress } from './progress'
import { AnimatedCounter } from './animated-counter'
import { cn } from '@/lib/utils'

interface ProgressAnimatedProps extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> {
  value?: number
  showPercentage?: boolean
  animated?: boolean
}

export function ProgressAnimated({
  value = 0,
  showPercentage = false,
  animated = true,
  className,
  ...props
}: ProgressAnimatedProps) {
  return (
    <div className={cn('space-y-2', className)}>
      <div className="relative">
        <Progress value={animated ? value : 0} {...props} />
      </div>
      {showPercentage && (
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Progress</span>
          <AnimatedCounter value={value} suffix="%" />
        </div>
      )}
    </div>
  )
}

