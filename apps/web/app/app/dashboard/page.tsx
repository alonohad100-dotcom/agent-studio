import { requireAuth } from '@/lib/auth'
import { listAgents } from '@/lib/actions/agents'
import { DashboardClient } from './dashboard-client'
import { FadeIn } from '@/components/ui'

export default async function DashboardPage() {
  const user = await requireAuth()
  const allAgents = await listAgents({}).catch(() => []) // Handle errors gracefully
  const recentAgents = allAgents.slice(0, 6)

  return (
    <div className="space-y-8">
      <FadeIn>
        <div>
          <h1 className="text-4xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Welcome back, {user.email?.split('@')[0] || 'Developer'}! Here&apos;s what&apos;s happening with your agents.
          </p>
        </div>
      </FadeIn>

      <DashboardClient user={user} recentAgents={recentAgents} />
    </div>
  )
}
