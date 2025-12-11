'use client'

import { motion, AnimatePresence } from "framer-motion"
import { Spinner } from "./spinner"
import { cn } from "@/lib/utils"

interface LoadingOverlayProps {
  isLoading: boolean
  children: React.ReactNode
  spinner?: React.ReactNode
  message?: string
  className?: string
}

export function LoadingOverlay({
  isLoading,
  children,
  spinner,
  message,
  className,
}: LoadingOverlayProps) {
  return (
    <div className={cn("relative", className)}>
      {children}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-50 rounded-md"
          >
            <div className="flex flex-col items-center gap-2">
              {spinner || <Spinner size="lg" />}
              {message && (
                <p className="text-sm text-muted-foreground">{message}</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

