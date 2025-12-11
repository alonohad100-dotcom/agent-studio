'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface ShakeProps {
  children: ReactNode
  trigger?: boolean
  className?: string
}

const shakeVariants = {
  shake: {
    x: [0, -10, 10, -10, 10, 0],
    transition: {
      duration: 0.5,
      ease: 'easeInOut',
    },
  },
  rest: {
    x: 0,
  },
}

export function Shake({ children, trigger, className }: ShakeProps) {
  return (
    <motion.div
      variants={shakeVariants}
      animate={trigger ? 'shake' : 'rest'}
      className={className}
    >
      {children}
    </motion.div>
  )
}

