'use client'

import { useEffect, useRef } from 'react'

interface LiveRegionProps {
  message: string
  priority?: 'polite' | 'assertive'
  className?: string
}

/**
 * Live region component for screen reader announcements
 */
export function LiveRegion({ message, priority = 'polite', className }: LiveRegionProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (ref.current && message) {
      // Clear and set message to trigger announcement
      ref.current.textContent = ''
      setTimeout(() => {
        if (ref.current) {
          ref.current.textContent = message
        }
      }, 100)
    }
  }, [message])

  return (
    <div
      ref={ref}
      role="status"
      aria-live={priority}
      aria-atomic="true"
      className={className || 'sr-only'}
    />
  )
}

