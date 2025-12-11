import { notFound } from 'next/navigation'
import { requireAuth } from '@/lib/auth'
import { getAgent } from '@/lib/actions/agents'
import { getVersion, getAgentVersions } from '@/lib/actions/versions'
import { VersionDetailClient } from './version-detail-client'
import { Breadcrumbs } from '@/components/ui/breadcrumbs'

interface VersionDetailPageProps {
  params: {
    agentId: string
    versionId: string
  }
}

export default async function VersionDetailPage({ params }: VersionDetailPageProps) {
  await requireAuth()

  let agent
  try {
    agent = await getAgent(params.agentId)
  } catch (error) {
    notFound()
  }

  const version = await getVersion(params.versionId)
  if (!version) {
    notFound()
  }

  const allVersions = await getAgentVersions(params.agentId)

  return (
    <div className="space-y-6">
      <div>
        <Breadcrumbs
          items={[
            { label: 'Agents', href: '/app/agents' },
            { label: agent.name, href: `/app/agents/${agent.id}/overview` },
            { label: 'Versions', href: `/app/agents/${agent.id}/versions` },
            { label: `Version ${version.version_number}` },
          ]}
        />
        <h1 className="text-3xl font-bold mt-2">Version {version.version_number}</h1>
        <p className="text-muted-foreground mt-1">
          Published {new Date(version.created_at).toLocaleDateString()}
        </p>
      </div>

      <VersionDetailClient version={version} allVersions={allVersions} agentId={params.agentId} />
    </div>
  )
}

