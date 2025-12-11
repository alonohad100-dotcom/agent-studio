import { notFound } from 'next/navigation'
import { requireAuth } from '@/lib/auth'
import { getAgent } from '@/lib/actions/agents'
import { getPromptPackage } from '@/lib/actions/prompts'
import { compileDraftFull } from '@/lib/actions/compiler-full'
import { InstructionsPageClient } from './instructions-page-client'
import { Breadcrumbs } from '@/components/ui/breadcrumbs'

interface InstructionsPageProps {
  params: {
    agentId: string
  }
}

export default async function InstructionsPage({ params }: InstructionsPageProps) {
  await requireAuth()

  let agent
  try {
    agent = await getAgent(params.agentId)
  } catch (error) {
    notFound()
  }

  // Get existing prompt package if available
  const promptPackage = await getPromptPackage(params.agentId)
  
  // Try to get full compilation result if available
  let compilationResult = null
  try {
    compilationResult = await compileDraftFull(params.agentId)
  } catch {
    // Compilation may fail if spec is incomplete - user can regenerate
    compilationResult = null
  }

  return (
    <div className="space-y-6">
      <div>
        <Breadcrumbs
          items={[
            { label: 'Agents', href: '/app/agents' },
            { label: agent.name, href: `/app/agents/${agent.id}/overview` },
            { label: 'Instructions' },
          ]}
        />
        <h1 className="text-3xl font-bold mt-2">Compiled Instructions</h1>
        <p className="text-muted-foreground mt-1">
          View the generated prompt package from your specification
        </p>
      </div>

      <InstructionsPageClient
        agentId={params.agentId}
        initialPromptPackage={promptPackage}
        initialResult={compilationResult}
      />
    </div>
  )
}

