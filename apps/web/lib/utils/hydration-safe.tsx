'use client'

import { useEffect, useState } from 'react'

/**
 * Hook to check if component is mounted (client-side)
 * Prevents hydration mismatches by ensuring client-only rendering
 */
export function useIsMounted() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return mounted
}

/**
 * Component wrapper that only renders children after hydration
 * Prevents hydration mismatches for components that differ between server and client
 */
export function HydrationSafe({
  children,
  fallback = null,
}: {
  children: React.ReactNode
  fallback?: React.ReactNode
}) {
  const mounted = useIsMounted()

  if (!mounted) {
    return <>{fallback}</>
  }

  return <>{children}</>
}
