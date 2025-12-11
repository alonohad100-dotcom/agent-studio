'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { InputEnhanced } from '@/components/ui/input-enhanced'
import { PasswordInput } from './PasswordInput'
import { AuthError } from './AuthError'
import { Mail, Lock } from 'lucide-react'
import Link from 'next/link'

export function RegisterForm() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const validateForm = (): string | null => {
    if (!email || !email.includes('@')) {
      return 'Please enter a valid email address'
    }

    if (password.length < 8) {
      return 'Password must be at least 8 characters long'
    }

    if (!/[a-z]/.test(password) || !/[0-9]/.test(password)) {
      return 'Password must contain at least one letter and one number'
    }

    if (password !== confirmPassword) {
      return 'Passwords do not match'
    }

    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    // Client-side validation
    const validationError = validateForm()
    if (validationError) {
      setError(validationError)
      setLoading(false)
      return
    }

    try {
      const supabase = createClient()
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      })

      if (signUpError) {
        setError(signUpError.message)
        setLoading(false)
        return
      }

      // Check if email verification is required
      if (data.user && !data.session) {
        // Email verification required
        setSuccess(true)
        setError(null)
        // Redirect to verify-email page or show message
        setTimeout(() => {
          router.push('/auth/verify-email?email=' + encodeURIComponent(email))
        }, 2000)
      } else if (data.session) {
        // Auto-logged in (email verification disabled)
        router.push('/app/dashboard')
        router.refresh()
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred')
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="space-y-4">
        <div className="text-center space-y-2">
          <h3 className="text-lg font-semibold">Registration successful!</h3>
          <p className="text-sm text-muted-foreground">
            Please check your email to verify your account before signing in.
          </p>
        </div>
        <Button asChild className="w-full" variant="outline">
          <Link href="/auth/login">Go to Sign In</Link>
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <InputEnhanced
            type="email"
            label="Email address"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            disabled={loading}
            placeholder="you@example.com"
            leftIcon={<Mail className="h-4 w-4" />}
          />
        </div>

        <div className="space-y-2">
          <PasswordInput
            label="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            disabled={loading}
            placeholder="Create a password"
            leftIcon={<Lock className="h-4 w-4" />}
            showStrengthIndicator
          />
        </div>

        <div className="space-y-2">
          <PasswordInput
            label="Confirm Password"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            required
            disabled={loading}
            placeholder="Confirm your password"
            leftIcon={<Lock className="h-4 w-4" />}
            error={
              confirmPassword && password !== confirmPassword ? 'Passwords do not match' : undefined
            }
          />
        </div>
      </div>

      <AuthError error={error} />

      <Button
        type="submit"
        disabled={loading || !email || !password || !confirmPassword}
        loading={loading}
        className="w-full"
        size="lg"
      >
        {loading ? 'Creating account...' : 'Create account'}
      </Button>

      <div className="text-center text-sm">
        <p className="text-muted-foreground">
          Already have an account?{' '}
          <Link href="/auth/login" className="text-primary hover:underline font-medium">
            Sign in here
          </Link>
        </p>
      </div>
    </form>
  )
}
