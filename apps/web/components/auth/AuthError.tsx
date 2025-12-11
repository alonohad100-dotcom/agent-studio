'use client'

import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle, AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface AuthErrorProps {
  error: string | null
  type?: 'error' | 'warning'
  className?: string
}

/**
 * Maps Supabase error messages to user-friendly messages
 */
function mapErrorToUserMessage(error: string): string {
  const lowerError = error.toLowerCase()

  if (
    lowerError.includes('invalid login credentials') ||
    lowerError.includes('invalid credentials')
  ) {
    return 'Invalid email or password. Please check your credentials and try again.'
  }

  if (lowerError.includes('user already registered') || lowerError.includes('already registered')) {
    return 'An account with this email already exists. Please sign in instead.'
  }

  if (lowerError.includes('email not confirmed') || lowerError.includes('email not verified')) {
    return 'Please verify your email address before signing in. Check your inbox for a verification link.'
  }

  if (lowerError.includes('password') && lowerError.includes('weak')) {
    return 'Password is too weak. Please use a stronger password with at least 8 characters.'
  }

  if (lowerError.includes('network') || lowerError.includes('fetch')) {
    return 'Network error. Please check your connection and try again.'
  }

  if (lowerError.includes('rate limit') || lowerError.includes('too many')) {
    return 'Too many attempts. Please wait a moment and try again.'
  }

  // Return original error if no mapping found
  return error
}

export function AuthError({ error, type = 'error', className }: AuthErrorProps) {
  if (!error) return null

  const userMessage = mapErrorToUserMessage(error)

  return (
    <Alert
      variant={type === 'error' ? 'destructive' : 'default'}
      className={cn(type === 'warning' && 'border-warning bg-warning/10', className)}
    >
      {type === 'error' ? (
        <AlertCircle className="h-4 w-4" />
      ) : (
        <AlertTriangle className="h-4 w-4 text-warning" />
      )}
      <AlertDescription>{userMessage}</AlertDescription>
    </Alert>
  )
}
