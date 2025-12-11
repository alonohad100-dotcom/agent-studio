import { AlertCircle, CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ReactNode } from 'react'

interface SpecBlockHeaderProps {
  title: string
  description: string
  required?: boolean
  completed?: boolean
  className?: string
  actions?: ReactNode
}

export function SpecBlockHeader({
  title,
  description,
  required = false,
  completed = false,
  className,
  actions,
}: SpecBlockHeaderProps) {
  return (
    <div className={cn('space-y-1', className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold">{title}</h3>
          {required && (
            <span className="text-xs text-destructive font-medium">Required</span>
          )}
          {completed && (
            <CheckCircle2 className="h-4 w-4 text-success" aria-label="Completed" />
          )}
          {required && !completed && (
            <AlertCircle className="h-4 w-4 text-warning" aria-label="Incomplete" />
          )}
        </div>
        {actions && <div>{actions}</div>}
      </div>
      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
    </div>
  )
}

