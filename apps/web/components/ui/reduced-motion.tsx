'use client'

import { useEffect, useState } from 'react'

/**
 * Hook to detect if user prefers reduced motion
 */
export function useReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches)
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  return prefersReducedMotion
}

/**
 * Component that conditionally renders children based on reduced motion preference
 */
interface ReducedMotionProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function ReducedMotion({ children, fallback }: ReducedMotionProps) {
  const prefersReducedMotion = useReducedMotion()
  
  if (prefersReducedMotion && fallback) {
    return <>{fallback}</>
  }
  
  return <>{children}</>
}

