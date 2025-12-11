'use client'

import { useState } from 'react'
import { Grid3x3, List } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AgentCard } from './AgentCard'
import { EmptyState } from '@/components/ui/empty-state'
import { Bot } from 'lucide-react'
import type { Database } from '@db/types'

type Agent = Database['public']['Tables']['agents']['Row']

interface AgentListProps {
  agents: Agent[]
  onDelete?: (agentId: string) => void
}

type ViewMode = 'grid' | 'list'

export function AgentList({ agents, onDelete }: AgentListProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('grid')

  if (agents.length === 0) {
    return (
      <EmptyState
        icon={Bot}
        title="No agents yet"
        description="Get started by creating your first AI agent."
      />
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-end gap-2">
        <Button
          variant={viewMode === 'grid' ? 'default' : 'outline'}
          size="icon"
          onClick={() => setViewMode('grid')}
          aria-label="Grid view"
        >
          <Grid3x3 className="h-4 w-4" />
        </Button>
        <Button
          variant={viewMode === 'list' ? 'default' : 'outline'}
          size="icon"
          onClick={() => setViewMode('list')}
          aria-label="List view"
        >
          <List className="h-4 w-4" />
        </Button>
      </div>

      <div
        className={
          viewMode === 'grid'
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
            : 'space-y-4'
        }
      >
        {agents.map((agent) => (
          <AgentCard key={agent.id} agent={agent} onDelete={onDelete} />
        ))}
      </div>
    </div>
  )
}

