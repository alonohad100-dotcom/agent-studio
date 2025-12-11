import { requireAuth } from '@/lib/auth'
import { listAgents } from '@/lib/actions/agents'
import { AgentsListPageClient } from './agents-list-client'
import { Breadcrumbs } from '@/components/ui/breadcrumbs'
import { Button } from '@/components/ui/button'
import { FadeIn } from '@/components/ui'
import Link from 'next/link'
import { Plus } from 'lucide-react'

interface AgentsPageProps {
  searchParams: {
    status?: string
    search?: string
  }
}

export default async function AgentsPage({ searchParams }: AgentsPageProps) {
  await requireAuth()

  const filters = {
    status: searchParams.status as 'draft' | 'published' | 'archived' | undefined,
    search: searchParams.search,
  }

  const agents = await listAgents(filters)

  return (
    <div className="space-y-6">
      <FadeIn>
        <div className="flex items-center justify-between">
          <div>
            <Breadcrumbs items={[{ label: 'Agents' }]} />
            <h1 className="text-3xl font-bold mt-2">Agents</h1>
            <p className="text-muted-foreground mt-1">
              Manage your AI agents and their configurations
            </p>
          </div>
          <Button asChild size="lg">
            <Link href="/app/agents/new">
              <Plus className="mr-2 h-4 w-4" />
              Create Agent
            </Link>
          </Button>
        </div>
      </FadeIn>

      <AgentsListPageClient initialAgents={agents} initialFilters={filters} />
    </div>
  )
}
