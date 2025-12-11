import * as React from 'react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'

export type StatusVariant = 'success' | 'warning' | 'danger' | 'info' | 'default'

interface StatusPillProps {
  status: string
  variant?: StatusVariant
  className?: string
}

const variantStyles: Record<StatusVariant, string> = {
  success: 'bg-success/10 text-success border-success/20',
  warning: 'bg-warning/10 text-warning border-warning/20',
  danger: 'bg-danger/10 text-danger border-danger/20',
  info: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  default: 'bg-muted text-muted-foreground border-border',
}

export function StatusPill({ status, variant = 'default', className }: StatusPillProps) {
  return (
    <Badge
      variant="outline"
      className={cn('font-medium', variantStyles[variant], className)}
    >
      {status}
    </Badge>
  )
}

