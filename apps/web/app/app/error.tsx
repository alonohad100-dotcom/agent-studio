'use client'

import { useEffect } from 'react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { AlertCircle, RefreshCw, Home } from 'lucide-react'
import { trackError } from '@/lib/telemetry/events'

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log error
    console.error('App layout error:', error)
    trackError(error, {
      location: 'app-layout',
      digest: error.digest,
    })
  }, [error])

  return (
    <div className="flex min-h-screen items-center justify-center p-8">
      <Alert variant="destructive" className="max-w-md">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Application Error</AlertTitle>
        <AlertDescription className="mt-2">
          {error.message || 'An unexpected error occurred in the application layout.'}
        </AlertDescription>
        <div className="mt-4 flex flex-col sm:flex-row gap-2">
          <Button onClick={reset} variant="outline" size="sm">
            <RefreshCw className="mr-2 h-4 w-4" />
            Try Again
          </Button>
          <Button
            onClick={() => (window.location.href = '/auth/login')}
            variant="outline"
            size="sm"
          >
            <Home className="mr-2 h-4 w-4" />
            Go to Login
          </Button>
        </div>
      </Alert>
    </div>
  )
}
