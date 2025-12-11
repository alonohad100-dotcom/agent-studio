'use client'

import * as React from 'react'
import { Check, Loader2, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

export type AutosaveStatus = 'idle' | 'saving' | 'saved' | 'error'

interface AutosaveIndicatorProps {
  status: AutosaveStatus
  className?: string
}

const statusConfig: Record<AutosaveStatus, { icon: React.ComponentType<{ className?: string }>; text: string; className: string }> = {
  idle: {
    icon: Check,
    text: '',
    className: 'text-muted-foreground',
  },
  saving: {
    icon: Loader2,
    text: 'Saving...',
    className: 'text-muted-foreground',
  },
  saved: {
    icon: Check,
    text: 'Saved',
    className: 'text-success',
  },
  error: {
    icon: AlertCircle,
    text: 'Error',
    className: 'text-danger',
  },
}

export function AutosaveIndicator({ status, className }: AutosaveIndicatorProps) {
  const config = statusConfig[status]
  const Icon = config.icon

  if (status === 'idle') {
    return null
  }

  return (
    <div
      className={cn(
        'flex items-center gap-2 text-xs transition-opacity',
        config.className,
        className
      )}
      role="status"
      aria-live="polite"
    >
      <Icon
        className={cn('h-3 w-3', status === 'saving' && 'animate-spin')}
        aria-hidden="true"
      />
      {config.text && <span>{config.text}</span>}
    </div>
  )
}

