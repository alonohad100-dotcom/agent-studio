'use client'

import * as React from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { InputEnhanced, type InputEnhancedProps } from '@/components/ui/input-enhanced'
import { cn } from '@/lib/utils'

export interface PasswordInputProps extends Omit<InputEnhancedProps, 'type'> {
  showStrengthIndicator?: boolean
}

export const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ showStrengthIndicator = false, className, value, onChange, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false)
    const [passwordStrength, setPasswordStrength] = React.useState<'weak' | 'medium' | 'strong'>(
      'weak'
    )

    React.useEffect(() => {
      if (showStrengthIndicator && value) {
        const password = String(value)
        let strength: 'weak' | 'medium' | 'strong' = 'weak'

        // Calculate strength
        const hasLength = password.length >= 8
        const hasLower = /[a-z]/.test(password)
        const hasUpper = /[A-Z]/.test(password)
        const hasNumber = /[0-9]/.test(password)
        const hasSpecial = /[^a-zA-Z0-9]/.test(password)

        const criteriaMet = [hasLength, hasLower, hasUpper, hasNumber, hasSpecial].filter(
          Boolean
        ).length

        if (criteriaMet >= 4 && password.length >= 12) {
          strength = 'strong'
        } else if (criteriaMet >= 3 && password.length >= 8) {
          strength = 'medium'
        } else {
          strength = 'weak'
        }

        setPasswordStrength(strength)
      }
    }, [value, showStrengthIndicator])

    return (
      <div className="space-y-2">
        <div className="relative">
          <InputEnhanced
            {...props}
            ref={ref}
            type={showPassword ? 'text' : 'password'}
            value={value}
            onChange={onChange}
            className={cn(className)}
            rightIcon={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            }
          />
        </div>
        {showStrengthIndicator && value && (
          <div className="space-y-1">
            <div className="flex gap-2">
              <div
                className={cn(
                  'h-1 flex-1 rounded-full transition-colors',
                  passwordStrength === 'weak' && 'bg-destructive',
                  passwordStrength === 'medium' && 'bg-warning',
                  passwordStrength === 'strong' && 'bg-success'
                )}
              />
              <span className="text-xs text-muted-foreground capitalize">{passwordStrength}</span>
            </div>
            <div className="text-xs text-muted-foreground space-y-0.5">
              <p>Password requirements:</p>
              <ul className="list-disc list-inside space-y-0.5">
                <li className={String(value).length >= 8 ? 'text-success' : ''}>
                  At least 8 characters
                </li>
                <li className={/[a-z]/.test(String(value)) ? 'text-success' : ''}>
                  One lowercase letter
                </li>
                <li className={/[0-9]/.test(String(value)) ? 'text-success' : ''}>One number</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    )
  }
)

PasswordInput.displayName = 'PasswordInput'
