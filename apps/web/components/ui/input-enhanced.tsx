'use client'

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle2, XCircle, X, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"

export interface InputEnhancedProps extends React.ComponentProps<"input"> {
  label?: string
  error?: string
  success?: boolean
  helperText?: string
  showCharacterCount?: boolean
  maxLength?: number
  onClear?: () => void
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

const InputEnhanced = React.forwardRef<HTMLInputElement, InputEnhancedProps>(
  (
    {
      className,
      type,
      label,
      error,
      success,
      helperText,
      showCharacterCount,
      maxLength,
      onClear,
      leftIcon,
      rightIcon,
      value,
      onChange,
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = React.useState(false)
    const [hasValue, setHasValue] = React.useState(!!value)
    const inputRef = React.useRef<HTMLInputElement>(null)

    React.useImperativeHandle(ref, () => inputRef.current!)

    React.useEffect(() => {
      setHasValue(!!value && String(value).length > 0)
    }, [value])

    const characterCount = value ? String(value).length : 0
    const showClearButton = onClear && hasValue && !props.disabled

    const handleClear = () => {
      if (onClear) {
        onClear()
        inputRef.current?.focus()
      }
    }

    return (
      <div className="w-full">
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              {leftIcon}
            </div>
          )}

          <input
            ref={inputRef}
            type={type}
            value={value}
            onChange={(e) => {
              setHasValue(e.target.value.length > 0)
              onChange?.(e)
            }}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            maxLength={maxLength}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={
              error || helperText || (showCharacterCount && maxLength)
                ? `${props.id || 'input'}-description`
                : undefined
            }
            className={cn(
              "flex h-10 w-full rounded-md border bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm transition-all duration-200",
              leftIcon && "pl-10",
              (rightIcon || showClearButton || success || error) && "pr-10",
              error && "border-destructive focus-visible:ring-destructive",
              success && "border-success focus-visible:ring-success",
              isFocused && !error && !success && "border-primary ring-primary",
              className
            )}
            {...props}
          />

          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
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

            {showClearButton && !success && !error && (
              <motion.button
                type="button"
                onClick={handleClear}
                className="text-muted-foreground hover:text-foreground transition-colors"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X className="h-4 w-4" />
              </motion.button>
            )}

            {rightIcon && !showClearButton && !success && !error && (
              <div className="text-muted-foreground">{rightIcon}</div>
            )}
          </div>

          {label && (
            <motion.label
              className={cn(
                "absolute left-3 pointer-events-none transition-all duration-200 text-muted-foreground",
                (isFocused || hasValue) && "top-2 text-xs",
                !isFocused && !hasValue && "top-1/2 -translate-y-1/2 text-sm"
              )}
              animate={{
                y: isFocused || hasValue ? 0 : '50%',
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
              id={`${props.id || 'input'}-description`}
              role="status"
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
InputEnhanced.displayName = "InputEnhanced"

export { InputEnhanced }

