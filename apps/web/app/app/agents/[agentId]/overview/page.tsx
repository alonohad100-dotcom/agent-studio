import { notFound } from 'next/navigation'
import { requireAuth } from '@/lib/auth'
import { getAgent } from '@/lib/actions/agents'
import { getDraftSpec } from '@/lib/actions/drafts'
import { AgentOverviewClient } from './agent-overview-client'
import { Breadcrumbs } from '@/components/ui/breadcrumbs'
import { StatusPill } from '@/components/ui/status-pill'
import { FadeIn } from '@/components/ui'
import { EMPTY_SPEC } from '@core/types/spec'

interface AgentOverviewPageProps {
  params: {
    agentId: string
  }
}

export default async function AgentOverviewPage({ params }: AgentOverviewPageProps) {
  await requireAuth()

  let agent
  try {
    agent = await getAgent(params.agentId)
  } catch (error) {
    notFound()
  }

  const draftSpec = await getDraftSpec(params.agentId)
  const spec = draftSpec || EMPTY_SPEC

  const getStatusVariant = (status: string): 'success' | 'warning' | 'danger' | 'default' => {
    switch (status) {
      case 'published':
        return 'success'
      case 'draft':
        return 'warning'
      case 'archived':
        return 'default'
      default:
        return 'default'
    }
  }

  return (
    <div className="space-y-6">
      <FadeIn>
        <div>
          <Breadcrumbs
            items={[
              { label: 'Agents', href: '/app/agents' },
              { label: agent.name },
            ]}
          />
          <div className="flex items-start justify-between mt-2">
            <div>
              <h1 className="text-3xl font-bold">{agent.name}</h1>
              {agent.description && (
                <p className="text-muted-foreground mt-1">{agent.description}</p>
              )}
            </div>
            <StatusPill status={agent.status} variant={getStatusVariant(agent.status)} />
          </div>
        </div>
      </FadeIn>

      <AgentOverviewClient agent={agent} spec={spec} />
    </div>
  )
}

