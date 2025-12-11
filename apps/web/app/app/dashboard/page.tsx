import { Suspense } from 'react'
import { requireAuth } from '@/lib/auth'
import { listAgents } from '@/lib/actions/agents'
import { DashboardClient } from './dashboard-client'
import DashboardLoading from './loading'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'

export default async function DashboardPage() {
  const user = await requireAuth()

  return (
    <div className="space-y-8" role="main" aria-label="Dashboard">
      <Suspense fallback={<DashboardLoading />}>
        <DashboardDataLoader user={user} />
      </Suspense>
    </div>
  )
}

async function DashboardDataLoader({ user }: { user: { id: string; email?: string | null } }) {
  let allAgents: Awaited<ReturnType<typeof listAgents>> = []
  let error: Error | null = null

  try {
    allAgents = await listAgents({})
  } catch (err) {
    error = err instanceof Error ? err : new Error('Unknown error')
    console.error('Failed to load agents:', error)

    // Log to error tracking service (if available)
    // Could send to Sentry, etc. here
  }

  const recentAgents = Array.isArray(allAgents) ? allAgents.slice(0, 6) : []

  return (
    <>
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Failed to load agents</AlertTitle>
          <AlertDescription>{error.message}</AlertDescription>
        </Alert>
      )}
      <DashboardClient user={user} recentAgents={recentAgents} />
    </>
  )
}
