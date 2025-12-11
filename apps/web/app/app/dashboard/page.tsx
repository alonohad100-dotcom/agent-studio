import { requireAuth } from '@/lib/auth'
import { listAgents } from '@/lib/actions/agents'
import { DashboardClient } from './dashboard-client'
import { FadeIn } from '@/components/ui'

export default async function DashboardPage() {
  const user = await requireAuth()

  // Fetch agents with better error handling
  let allAgents: Awaited<ReturnType<typeof listAgents>> = []
  try {
    allAgents = await listAgents({})
  } catch (error) {
    console.error('Failed to load agents:', error)
    // Continue with empty array - user can still see the dashboard
  }

  const recentAgents = Array.isArray(allAgents) ? allAgents.slice(0, 6) : []

  return (
    <div className="space-y-8" role="main" aria-label="Dashboard">
      <FadeIn>
        <header>
          <h1 className="text-4xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Welcome back, {user.email?.split('@')[0] || 'Developer'}! Here&apos;s what&apos;s
            happening with your agents.
          </p>
        </header>
      </FadeIn>

      <DashboardClient user={user} recentAgents={recentAgents} />
    </div>
  )
}
