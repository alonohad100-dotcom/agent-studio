'use client'

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle2, XCircle, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"

export interface TextareaEnhancedProps extends React.ComponentProps<"textarea"> {
  label?: string
  error?: string
  success?: boolean
  helperText?: string
  showCharacterCount?: boolean
  maxLength?: number
  rows?: number
}

const TextareaEnhanced = React.forwardRef<HTMLTextAreaElement, TextareaEnhancedProps>(
  (
    {
      className,
      label,
      error,
      success,
      helperText,
      showCharacterCount,
      maxLength,
      rows = 4,
      value,
      onChange,
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = React.useState(false)
    const [hasValue, setHasValue] = React.useState(!!value && String(value).length > 0)

    React.useEffect(() => {
      setHasValue(!!value && String(value).length > 0)
    }, [value])

    const characterCount = value ? String(value).length : 0

    return (
      <div className="w-full">
        <div className="relative">
          <textarea
            ref={ref}
            value={value}
            onChange={(e) => {
              setHasValue(e.target.value.length > 0)
              onChange?.(e)
            }}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            maxLength={maxLength}
            rows={rows}
            className={cn(
              "flex min-h-[80px] w-full rounded-md border bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm transition-all duration-200 resize-y",
              error && "border-destructive focus-visible:ring-destructive",
              success && "border-success focus-visible:ring-success",
              isFocused && !error && !success && "border-primary ring-primary",
              className
            )}
            {...props}
          />

          {(success || error) && (
            <div className="absolute right-3 top-3">
              {success && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  <CheckCircle2 className="h-4 w-4 text-success" />
                </motion.div>
              )}

              {error && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  <XCircle className="h-4 w-4 text-destructive" />
                </motion.div>
              )}
            </div>
          )}

          {label && (
            <motion.label
              className={cn(
                "absolute left-3 pointer-events-none transition-all duration-200 text-muted-foreground",
                (isFocused || hasValue) && "top-2 text-xs",
                !isFocused && !hasValue && "top-3 text-sm"
              )}
              animate={{
                y: isFocused || hasValue ? 0 : '0%',
                fontSize: isFocused || hasValue ? '0.75rem' : '0.875rem',
              }}
              transition={{ duration: 0.2 }}
            >
              {label}
            </motion.label>
          )}
        </div>

        <AnimatePresence>
          {(error || helperText || (showCharacterCount && maxLength)) && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="mt-1.5 flex items-center justify-between text-xs"
            >
              <div className="flex items-center gap-1">
                {error && (
                  <>
                    <AlertCircle className="h-3 w-3 text-destructive" />
                    <span className="text-destructive">{error}</span>
                  </>
                )}
                {!error && helperText && (
                  <span className="text-muted-foreground">{helperText}</span>
                )}
              </div>
              {showCharacterCount && maxLength && (
                <span
                  className={cn(
                    "text-muted-foreground",
                    characterCount >= maxLength && "text-warning"
                  )}
                >
                  {characterCount}/{maxLength}
                </span>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    )
  }
)
TextareaEnhanced.displayName = "TextareaEnhanced"

export { TextareaEnhanced }

