'use client'

import { useEffect } from 'react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { AlertCircle, RefreshCw, Home, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function RegisterError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log error for debugging
    console.error('Register page error:', error)
  }, [error])

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-background to-muted/20 px-4 py-12">
      <div className="w-full max-w-md">
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Unable to load registration page</AlertTitle>
          <AlertDescription className="mt-2">
            {error.message || 'An unexpected error occurred while loading the registration page.'}
          </AlertDescription>
        </Alert>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button onClick={reset} variant="outline" className="flex-1">
            <RefreshCw className="mr-2 h-4 w-4" />
            Try Again
          </Button>
          <Button asChild variant="outline" className="flex-1">
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Go Home
            </Link>
          </Button>
          <Button asChild variant="outline" className="flex-1">
            <Link href="/auth/login">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Sign In
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
