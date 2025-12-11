'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { pageTransitionVariants } from '@/lib/utils/animations'

interface PageWrapperSafeProps {
  children: React.ReactNode
}

/**
 * Safe PageWrapper component with error handling and fallback rendering
 * Prevents blank pages if animations fail
 */
export function PageWrapperSafe({ children }: PageWrapperSafeProps) {
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)
  const [animationError, setAnimationError] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Fallback if animations fail or component not mounted
  if (animationError || !mounted) {
    return <div className="w-full">{children}</div>
  }

  try {
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key={pathname}
          variants={pageTransitionVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="w-full"
        >
          {children}
        </motion.div>
      </AnimatePresence>
    )
  } catch (error) {
    console.error('PageWrapper animation error:', error)
    setAnimationError(true)
    return <div className="w-full">{children}</div>
  }
}
