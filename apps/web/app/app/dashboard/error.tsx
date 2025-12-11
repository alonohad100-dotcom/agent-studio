'use client'

import { useEffect } from 'react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { AlertCircle, RefreshCw, Home } from 'lucide-react'
import Link from 'next/link'

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log error for debugging
    console.error('Dashboard error:', error)
  }, [error])

  return (
    <div className="flex min-h-[400px] items-center justify-center p-8">
      <Alert variant="destructive" className="max-w-md">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Unable to load dashboard</AlertTitle>
        <AlertDescription className="mt-2">
          {error.message || 'An unexpected error occurred while loading the dashboard.'}
        </AlertDescription>
        <div className="mt-4 flex flex-col sm:flex-row gap-2">
          <Button onClick={reset} variant="outline" size="sm">
            <RefreshCw className="mr-2 h-4 w-4" />
            Try Again
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link href="/app/dashboard">
              <Home className="mr-2 h-4 w-4" />
              Go to Dashboard
            </Link>
          </Button>
        </div>
      </Alert>
    </div>
  )
}
