'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { InputEnhanced } from '@/components/ui/input-enhanced'
import { PasswordInput } from './PasswordInput'
import { AuthError } from './AuthError'
import { Mail, Lock } from 'lucide-react'
import Link from 'next/link'

interface LoginFormProps {
  redirectTo?: string
}

function LoginFormContent({ redirectTo }: LoginFormProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const supabase = createClient()
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (signInError) {
        setError(signInError.message)
        setLoading(false)
        return
      }

      // Success - redirect to dashboard or requested page
      const redirect = redirectTo || searchParams.get('redirect') || '/app/dashboard'
      router.push(redirect)
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred')
      setLoading(false)
    }
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
            error={error && error.includes('email') ? error : undefined}
          />
        </div>

        <div className="space-y-2">
          <PasswordInput
            label="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            disabled={loading}
            placeholder="Enter your password"
            leftIcon={<Lock className="h-4 w-4" />}
          />
        </div>
      </div>

      <AuthError error={error} />

      <Button
        type="submit"
        disabled={loading || !email || !password}
        loading={loading}
        className="w-full"
        size="lg"
      >
        {loading ? 'Signing in...' : 'Sign in'}
      </Button>

      <div className="text-center text-sm space-y-2">
        <p className="text-muted-foreground">
          Don&apos;t have an account?{' '}
          <Link href="/auth/register" className="text-primary hover:underline font-medium">
            Register here
          </Link>
        </p>
        {/* Future: Add forgot password link */}
        {/* <Link href="/auth/forgot-password" className="text-sm text-muted-foreground hover:underline">
          Forgot password?
        </Link> */}
      </div>
    </form>
  )
}

export function LoginForm(props: LoginFormProps) {
  return (
    <Suspense
      fallback={
        <div className="space-y-4 animate-pulse">
          <div className="h-10 bg-muted rounded" />
          <div className="h-10 bg-muted rounded" />
        </div>
      }
    >
      <LoginFormContent {...props} />
    </Suspense>
  )
}
