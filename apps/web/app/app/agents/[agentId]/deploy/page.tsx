import { notFound } from 'next/navigation'
import { requireAuth } from '@/lib/auth'
import { getAgent } from '@/lib/actions/agents'
import { getAgentVersions } from '@/lib/actions/versions'
import { DeployPageClient } from './deploy-page-client'
import { Breadcrumbs } from '@/components/ui/breadcrumbs'

interface DeployPageProps {
  params: {
    agentId: string
  }
}

export default async function DeployPage({ params }: DeployPageProps) {
  await requireAuth()

  let agent
  try {
    agent = await getAgent(params.agentId)
  } catch (error) {
    notFound()
  }

  const versions = await getAgentVersions(params.agentId)

  return (
    <div className="space-y-6">
      <div>
        <Breadcrumbs
          items={[
            { label: 'Agents', href: '/app/agents' },
            { label: agent.name, href: `/app/agents/${agent.id}/overview` },
            { label: 'Export & Deploy' },
          ]}
        />
        <h1 className="text-3xl font-bold mt-2">Export & Deploy</h1>
        <p className="text-muted-foreground mt-1">
          Export your agent configuration and prompt package for deployment
        </p>
      </div>

      <DeployPageClient agentId={params.agentId} versions={versions} />
    </div>
  )
}

