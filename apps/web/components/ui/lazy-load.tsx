'use client'

import { lazy, Suspense, ComponentType, ReactNode } from 'react'
import { Skeleton } from './skeleton'

interface LazyLoadProps {
  children: ReactNode
  fallback?: ReactNode
}

/**
 * Lazy load wrapper with loading fallback
 */
export function LazyLoad({ children, fallback }: LazyLoadProps) {
  return (
    <Suspense fallback={fallback || <Skeleton className="h-64 w-full" />}>
      {children}
    </Suspense>
  )
}

/**
 * Create a lazy-loaded component with default fallback
 */
export function createLazyComponent<P extends Record<string, unknown> = Record<string, never>>(
  importFunc: () => Promise<{ default: ComponentType<P> }>,
  fallback?: ReactNode
) {
  const LazyComponent = lazy(importFunc)
  
  return function LazyWrapper(props: P & React.ComponentPropsWithoutRef<ComponentType<P>>) {
    return (
      <Suspense fallback={fallback || <Skeleton className="h-64 w-full" />}>
        <LazyComponent {...props} />
      </Suspense>
    )
  }
}

