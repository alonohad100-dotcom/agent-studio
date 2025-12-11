import { notFound } from 'next/navigation'
import { requireAuth } from '@/lib/auth'
import { getAgent } from '@/lib/actions/agents'
import { listTestCases } from '@/lib/actions/testing'
import { TestingPageClient } from './testing-page-client'
import { Breadcrumbs } from '@/components/ui/breadcrumbs'

interface TestingPageProps {
  params: {
    agentId: string
  }
}

export default async function TestingPage({ params }: TestingPageProps) {
  await requireAuth()

  let agent
  try {
    agent = await getAgent(params.agentId)
  } catch (error) {
    notFound()
  }

  const testCases = await listTestCases(params.agentId)

  return (
    <div className="space-y-6">
      <div>
        <Breadcrumbs
          items={[
            { label: 'Agents', href: '/app/agents' },
            { label: agent.name, href: `/app/agents/${agent.id}/overview` },
            { label: 'Testing' },
          ]}
        />
        <h1 className="text-3xl font-bold mt-2">Testing Lab</h1>
        <p className="text-muted-foreground mt-1">
          Test and validate your agent&apos;s behavior
        </p>
      </div>

      <TestingPageClient agentId={params.agentId} initialTestCases={testCases} />
    </div>
  )
}

