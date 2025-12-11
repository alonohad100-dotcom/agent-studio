'use client'

import { motion } from 'framer-motion'
import { fadeInVariants } from '@/lib/utils/animations'
import { useIsMounted } from '@/lib/utils/hydration-safe'

interface FadeInProps {
  children: React.ReactNode
  delay?: number
  duration?: number
  className?: string
}

export function FadeIn({ children, delay = 0, duration = 0.2, className }: FadeInProps) {
  const mounted = useIsMounted()

  // Don't animate on server or before hydration to prevent hydration mismatches
  if (!mounted) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      variants={fadeInVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{
        duration,
        delay,
        ease: 'easeOut',
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
