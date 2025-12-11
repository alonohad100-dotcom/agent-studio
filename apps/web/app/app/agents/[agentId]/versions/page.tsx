import { notFound } from 'next/navigation'
import { requireAuth } from '@/lib/auth'
import { getAgent } from '@/lib/actions/agents'
import { getAgentVersions } from '@/lib/actions/versions'
import { VersionsPageClient } from './versions-page-client'
import { Breadcrumbs } from '@/components/ui/breadcrumbs'

interface VersionsPageProps {
  params: {
    agentId: string
  }
}

export default async function VersionsPage({ params }: VersionsPageProps) {
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
            { label: 'Versions' },
          ]}
        />
        <h1 className="text-3xl font-bold mt-2">Versions</h1>
        <p className="text-muted-foreground mt-1">
          View and manage published versions of your agent
        </p>
      </div>

      <VersionsPageClient agentId={params.agentId} initialVersions={versions} />
    </div>
  )
}

