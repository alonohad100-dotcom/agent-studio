'use client'

import { useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Mail, CheckCircle2, AlertCircle } from 'lucide-react'
import Link from 'next/link'

function VerifyEmailContent() {
  const searchParams = useSearchParams()
  const email = searchParams.get('email') || ''
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const handleResend = async () => {
    if (!email) {
      setMessage({ type: 'error', text: 'Email address is required' })
      return
    }

    setLoading(true)
    setMessage(null)

    try {
      const supabase = createClient()
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
      })

      if (error) {
        setMessage({ type: 'error', text: error.message })
      } else {
        setMessage({
          type: 'success',
          text: 'Verification email sent! Please check your inbox.',
        })
      }
    } catch (err) {
      setMessage({
        type: 'error',
        text: err instanceof Error ? err.message : 'An unexpected error occurred',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-background to-muted/20 px-4 py-12">
      <Card className="w-full max-w-md mx-auto shadow-xl">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 rounded-full bg-primary/10">
              <Mail className="h-8 w-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Verify Your Email</CardTitle>
          <CardDescription>
            We&apos;ve sent a verification link to {email || 'your email address'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert>
            <CheckCircle2 className="h-4 w-4 text-success" />
            <AlertDescription>
              Please check your email inbox and click the verification link to activate your
              account.
            </AlertDescription>
          </Alert>

          {message && (
            <Alert variant={message.type === 'error' ? 'destructive' : 'default'}>
              {message.type === 'success' ? (
                <CheckCircle2 className="h-4 w-4 text-success" />
              ) : (
                <AlertCircle className="h-4 w-4" />
              )}
              <AlertDescription>{message.text}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-3">
            <Button
              onClick={handleResend}
              disabled={loading || !email}
              loading={loading}
              variant="outline"
              className="w-full"
            >
              {loading ? 'Sending...' : 'Resend Verification Email'}
            </Button>

            <Button asChild variant="ghost" className="w-full">
              <Link href="/auth/login">Back to Sign In</Link>
            </Button>
          </div>

          <div className="text-center text-sm text-muted-foreground">
            <p>Didn&apos;t receive the email?</p>
            <p className="mt-1">Check your spam folder or try resending.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <Card className="w-full max-w-md mx-auto">
            <CardContent className="p-6">
              <div className="space-y-4 animate-pulse">
                <div className="h-8 bg-muted rounded" />
                <div className="h-4 bg-muted rounded" />
                <div className="h-10 bg-muted rounded" />
              </div>
            </CardContent>
          </Card>
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  )
}
