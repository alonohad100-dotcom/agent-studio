'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { fadeInVariants, slideUpVariants, slideLeftVariants, slideRightVariants } from '@/lib/utils/animations'

interface ScrollRevealProps {
  children: React.ReactNode
  variant?: 'fade' | 'slideUp' | 'slideLeft' | 'slideRight'
  delay?: number
  className?: string
}

export function ScrollReveal({ 
  children, 
  variant = 'fade', 
  delay = 0,
  className 
}: ScrollRevealProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  const variants = {
    fade: fadeInVariants,
    slideUp: slideUpVariants,
    slideLeft: slideLeftVariants,
    slideRight: slideRightVariants,
  }[variant]

  return (
    <motion.div
      ref={ref}
      variants={variants}
      initial="initial"
      animate={isInView ? 'animate' : 'initial'}
      transition={{ delay, duration: 0.5 }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

