import { notFound } from 'next/navigation'
import { requireAuth } from '@/lib/auth'
import { getAgent } from '@/lib/actions/agents'
import { getDraftSpec } from '@/lib/actions/drafts'
import { SpecPageClient } from './spec-page-client'
import { Breadcrumbs } from '@/components/ui/breadcrumbs'
import { EMPTY_SPEC } from '@core/types/spec'

interface SpecPageProps {
  params: {
    agentId: string
  }
}

export default async function SpecPage({ params }: SpecPageProps) {
  await requireAuth()

  let agent
  try {
    agent = await getAgent(params.agentId)
  } catch (error) {
    notFound()
  }

  const draftSpec = await getDraftSpec(params.agentId)
  const spec = draftSpec || EMPTY_SPEC

  return (
    <div className="space-y-6">
      <div>
        <Breadcrumbs
          items={[
            { label: 'Agents', href: '/app/agents' },
            { label: agent.name, href: `/app/agents/${agent.id}/overview` },
            { label: 'Specification' },
          ]}
        />
        <h1 className="text-3xl font-bold mt-2">Specification</h1>
        <p className="text-muted-foreground mt-1">
          Define your agent&apos;s requirements and behavior
        </p>
      </div>

      <SpecPageClient agentId={params.agentId} initialSpec={spec} />
    </div>
  )
}

