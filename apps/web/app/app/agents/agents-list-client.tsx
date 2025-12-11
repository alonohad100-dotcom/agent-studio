'use client'

import { useState, useTransition } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { AgentList } from '@/components/agents/AgentList'
import { AgentSearch } from '@/components/agents/AgentSearch'
import { StatusFilter } from '@/components/agents/StatusFilter'
import { deleteAgent } from '@/lib/actions/agents'
import { toast } from 'sonner'
import type { Database } from '@db/types'

type Agent = Database['public']['Tables']['agents']['Row']

interface AgentsListPageClientProps {
  initialAgents: Agent[]
  initialFilters: {
    status?: 'draft' | 'published' | 'archived'
    search?: string
  }
}

export function AgentsListPageClient({
  initialAgents,
  initialFilters,
}: AgentsListPageClientProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [agents, setAgents] = useState<Agent[]>(initialAgents)
  const [search, setSearch] = useState(initialFilters.search || '')
  const [statusFilter, setStatusFilter] = useState(initialFilters.status)
  const [, startTransition] = useTransition()

  const handleSearchChange = (value: string) => {
    setSearch(value)
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set('search', value)
    } else {
      params.delete('search')
    }
    router.push(`/app/agents?${params.toString()}`)
  }

  const handleStatusFilterChange = (status: 'draft' | 'published' | 'archived' | undefined) => {
    setStatusFilter(status)
    const params = new URLSearchParams(searchParams.toString())
    if (status) {
      params.set('status', status)
    } else {
      params.delete('status')
    }
    router.push(`/app/agents?${params.toString()}`)
  }

  const handleDelete = async (agentId: string) => {
    if (!confirm('Are you sure you want to delete this agent? This action cannot be undone.')) {
      return
    }

    startTransition(async () => {
      try {
        await deleteAgent(agentId)
        setAgents(agents.filter((a) => a.id !== agentId))
        toast.success('Agent deleted successfully')
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Failed to delete agent')
      }
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <AgentSearch value={search} onChange={handleSearchChange} />
        </div>
        <StatusFilter value={statusFilter} onChange={handleStatusFilterChange} />
      </div>

      <AgentList agents={agents} onDelete={handleDelete} />
    </div>
  )
}

