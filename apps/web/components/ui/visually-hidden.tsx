'use client'

import { cn } from '@/lib/utils'

interface VisuallyHiddenProps {
  children: React.ReactNode
  className?: string
}

/**
 * Visually hides content but keeps it accessible to screen readers
 */
export function VisuallyHidden({ children, className }: VisuallyHiddenProps) {
  return (
    <span className={cn('sr-only', className)}>
      {children}
    </span>
  )
}

