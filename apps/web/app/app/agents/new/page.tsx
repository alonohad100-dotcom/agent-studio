import { requireAuth } from '@/lib/auth'
import { CreateAgentForm } from './create-agent-form'
import { Breadcrumbs } from '@/components/ui/breadcrumbs'

export default async function NewAgentPage() {
  await requireAuth()

  return (
    <div className="space-y-6">
      <div>
        <Breadcrumbs
          items={[
            { label: 'Agents', href: '/app/agents' },
            { label: 'New Agent' },
          ]}
        />
        <h1 className="text-3xl font-bold mt-2">Create New Agent</h1>
        <p className="text-muted-foreground mt-1">
          Start by giving your agent a name and description
        </p>
      </div>

      <CreateAgentForm />
    </div>
  )
}

