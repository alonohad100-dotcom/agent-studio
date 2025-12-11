'use client'

import { cn } from "@/lib/utils"

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'text' | 'circular' | 'rectangular'
  animated?: boolean
}

function Skeleton({
  className,
  variant = 'default',
  animated = true,
  ...props
}: SkeletonProps) {
  return (
    <div
      className={cn(
        "bg-muted",
        variant === 'text' && "h-4 rounded",
        variant === 'circular' && "rounded-full aspect-square",
        variant === 'rectangular' && "rounded-md",
        variant === 'default' && "rounded-md",
        animated && "animate-pulse",
        className
      )}
      {...props}
    />
  )
}

function SkeletonText({ lines = 3, className }: { lines?: number; className?: string }) {
  return (
    <div className={cn("space-y-2", className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          variant="text"
          className={cn(
            i === lines - 1 && "w-3/4" // Last line shorter
          )}
        />
      ))}
    </div>
  )
}

function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={cn("rounded-lg border bg-card p-6 space-y-4", className)}>
      <Skeleton variant="text" className="h-6 w-1/3" />
      <SkeletonText lines={3} />
      <div className="flex gap-2">
        <Skeleton className="h-9 w-20" />
        <Skeleton className="h-9 w-20" />
      </div>
    </div>
  )
}

export { Skeleton, SkeletonText, SkeletonCard }
