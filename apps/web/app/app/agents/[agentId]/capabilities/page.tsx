import { notFound } from 'next/navigation'
import { requireAuth } from '@/lib/auth'
import { getAgent } from '@/lib/actions/agents'
import { getDraftSpec, getDraftCapabilities } from '@/lib/actions/drafts'
import { CapabilitiesPageClient } from './capabilities-page-client'
import { Breadcrumbs } from '@/components/ui/breadcrumbs'
import { EMPTY_SPEC } from '@core/types/spec'
import { DEFAULT_CAPABILITIES } from '@core/types/capabilities'

interface CapabilitiesPageProps {
  params: {
    agentId: string
  }
}

export default async function CapabilitiesPage({ params }: CapabilitiesPageProps) {
  await requireAuth()

  let agent
  try {
    agent = await getAgent(params.agentId)
  } catch (error) {
    notFound()
  }

  const draftSpec = await getDraftSpec(params.agentId)
  const spec = draftSpec || EMPTY_SPEC
  const capabilities = await getDraftCapabilities(params.agentId) || DEFAULT_CAPABILITIES

  return (
    <div className="space-y-6">
      <div>
        <Breadcrumbs
          items={[
            { label: 'Agents', href: '/app/agents' },
            { label: agent.name, href: `/app/agents/${agent.id}/overview` },
            { label: 'Capabilities' },
          ]}
        />
        <h1 className="text-3xl font-bold mt-2">Capabilities</h1>
        <p className="text-muted-foreground mt-1">
          Configure what your agent can do
        </p>
      </div>

      <CapabilitiesPageClient agentId={params.agentId} initialSpec={spec} initialCapabilities={capabilities} />
    </div>
  )
}

