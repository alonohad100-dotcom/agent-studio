import { notFound } from 'next/navigation'
import { requireAuth } from '@/lib/auth'
import { getAgent } from '@/lib/actions/agents'
import { listKnowledgeFiles } from '@/lib/actions/knowledge'
import { createClient } from '@/lib/supabase/server'
import { KnowledgePageClient } from './knowledge-page-client'
import { Breadcrumbs } from '@/components/ui/breadcrumbs'

interface KnowledgePageProps {
  params: {
    agentId: string
  }
}

export default async function KnowledgePage({ params }: KnowledgePageProps) {
  await requireAuth()

  let agent
  try {
    agent = await getAgent(params.agentId)
  } catch (error) {
    notFound()
  }

  const files = await listKnowledgeFiles(params.agentId)
  
  // Get knowledge sources
  const supabase = await createClient()
  const { data: knowledgeSources } = await supabase
    .from('knowledge_sources')
    .select('*')
    .eq('agent_id', params.agentId)

  return (
    <div className="space-y-6">
      <div>
        <Breadcrumbs
          items={[
            { label: 'Agents', href: '/app/agents' },
            { label: agent.name, href: `/app/agents/${agent.id}/overview` },
            { label: 'Knowledge' },
          ]}
        />
        <h1 className="text-3xl font-bold mt-2">Knowledge</h1>
        <p className="text-muted-foreground mt-1">
          Upload and manage knowledge files for your agent
        </p>
      </div>

      <KnowledgePageClient
        agentId={params.agentId}
        initialFiles={files || []}
        initialKnowledgeSources={knowledgeSources || []}
      />
    </div>
  )
}

