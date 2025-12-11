'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Search,
  Bot,
  FileText,
  FlaskConical,
  Plus,
  Sparkles,
  Play,
  GitBranch,
  Download,
  Settings,
  BookOpen,
  Zap,
} from 'lucide-react'
import { listAgents } from '@/lib/actions/agents'
import type { Agent } from '@db/types'

export function CommandPalette() {
  const [open, setOpen] = useState(false)
  const [agents, setAgents] = useState<Agent[]>([])
  const [_isLoadingAgents, setIsLoadingAgents] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  // Extract agentId from pathname if we're on an agent page
  const agentIdMatch = pathname.match(/\/app\/agents\/([^/]+)/)
  const agentId = agentIdMatch ? agentIdMatch[1] : undefined

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  useEffect(() => {
    if (open) {
      setIsLoadingAgents(true)
      listAgents()
        .then((data) => {
          setAgents(data || [])
        })
        .catch(() => {
          setAgents([])
        })
        .finally(() => {
          setIsLoadingAgents(false)
        })
    }
  }, [open])

  const handleSelect = (href: string) => {
    router.push(href)
    setOpen(false)
  }

  const handleAction = async (action: string) => {
    if (!agentId) {
      setOpen(false)
      return
    }

    if (action === 'publish-version') {
      router.push(`/app/agents/${agentId}/versions`)
      setOpen(false)
      return
    }
    if (action === 'export-package') {
      router.push(`/app/agents/${agentId}/deploy`)
      setOpen(false)
      return
    }
    if (action === 'run-tests') {
      router.push(`/app/agents/${agentId}/testing`)
      setOpen(false)
      return
    }
    if (action === 'generate-spec') {
      router.push(`/app/agents/${agentId}/spec`)
      setOpen(false)
      return
    }
    setOpen(false)
  }

  const navigationCommands = [
    { id: 'dashboard', label: 'Go to Dashboard', href: '/app/dashboard', icon: Search },
    { id: 'agents', label: 'Go to Agents', href: '/app/agents', icon: Bot },
    { id: 'templates', label: 'Go to Templates', href: '/app/templates', icon: FileText },
    { id: 'test-lab', label: 'Go to Test Lab', href: '/app/test-lab', icon: FlaskConical },
  ]

  const actionCommands = [
    { id: 'create-agent', label: 'Create Agent', href: '/app/agents/new', icon: Plus },
    { id: 'create-template', label: 'Create from Template', href: '/app/templates', icon: FileText },
  ]

  const agentCommands = agentId
    ? [
        { id: 'spec', label: 'Edit Specification', href: `/app/agents/${agentId}/spec`, icon: FileText },
        { id: 'capabilities', label: 'Manage Capabilities', href: `/app/agents/${agentId}/capabilities`, icon: Zap },
        { id: 'knowledge', label: 'Knowledge Base', href: `/app/agents/${agentId}/knowledge`, icon: BookOpen },
        { id: 'testing', label: 'Testing Lab', href: `/app/agents/${agentId}/testing`, icon: FlaskConical },
        { id: 'versions', label: 'Versions', href: `/app/agents/${agentId}/versions`, icon: GitBranch },
        { id: 'export', label: 'Export & Deploy', href: `/app/agents/${agentId}/deploy`, icon: Download },
        { id: 'settings', label: 'Settings', href: `/app/agents/${agentId}/settings`, icon: Settings },
      ]
    : []

  const quickActionCommands = agentId
    ? [
        { id: 'generate-spec', label: 'Generate Missing Spec Blocks', action: 'generate-spec', icon: Sparkles },
        { id: 'run-tests', label: 'Run Test Suite', action: 'run-tests', icon: Play },
        { id: 'publish-version', label: 'Publish Version', action: 'publish-version', icon: GitBranch },
        { id: 'export-package', label: 'Export Package', action: 'export-package', icon: Download },
      ]
    : []

  const agentNavCommands = agents.slice(0, 10).map((agent) => ({
    id: `agent-${agent.id}`,
    label: agent.name,
    href: `/app/agents/${agent.id}/overview`,
    icon: Bot,
  }))

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex h-9 w-full items-center gap-2 rounded-md border border-input bg-background px-3 text-sm text-muted-foreground shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground md:w-64"
      >
        <Search className="h-4 w-4" />
        <span className="flex-1 text-left">Search...</span>
        <kbd className="pointer-events-none hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="overflow-hidden p-0 max-w-2xl">
          <Command shouldFilter={true}>
            <CommandInput placeholder="Type a command or search..." />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>

              {navigationCommands.length > 0 && (
                <CommandGroup heading="Navigation">
                  {navigationCommands.map((item) => {
                    const Icon = item.icon
                    return (
                      <CommandItem
                        key={item.id}
                        onSelect={() => handleSelect(item.href)}
                        className="cursor-pointer"
                      >
                        <Icon className="mr-2 h-4 w-4" />
                        {item.label}
                      </CommandItem>
                    )
                  })}
                </CommandGroup>
              )}

              {actionCommands.length > 0 && (
                <CommandGroup heading="Actions">
                  {actionCommands.map((item) => {
                    const Icon = item.icon
                    return (
                      <CommandItem
                        key={item.id}
                        onSelect={() => handleSelect(item.href)}
                        className="cursor-pointer"
                      >
                        <Icon className="mr-2 h-4 w-4" />
                        {item.label}
                      </CommandItem>
                    )
                  })}
                </CommandGroup>
              )}

              {agentNavCommands.length > 0 && (
                <CommandGroup heading="Agents">
                  {agentNavCommands.map((item) => {
                    const Icon = item.icon
                    return (
                      <CommandItem
                        key={item.id}
                        onSelect={() => handleSelect(item.href)}
                        className="cursor-pointer"
                      >
                        <Icon className="mr-2 h-4 w-4" />
                        {item.label}
                      </CommandItem>
                    )
                  })}
                  {agents.length > 10 && (
                    <CommandItem
                      onSelect={() => handleSelect('/app/agents')}
                      className="cursor-pointer"
                    >
                      <Bot className="mr-2 h-4 w-4" />
                      View all agents...
                    </CommandItem>
                  )}
                </CommandGroup>
              )}

              {agentCommands.length > 0 && (
                <CommandGroup heading="Current Agent">
                  {agentCommands.map((item) => {
                    const Icon = item.icon
                    return (
                      <CommandItem
                        key={item.id}
                        onSelect={() => handleSelect(item.href)}
                        className="cursor-pointer"
                      >
                        <Icon className="mr-2 h-4 w-4" />
                        {item.label}
                      </CommandItem>
                    )
                  })}
                </CommandGroup>
              )}

              {quickActionCommands.length > 0 && (
                <CommandGroup heading="Quick Actions">
                  {quickActionCommands.map((item) => {
                    const Icon = item.icon
                    return (
                      <CommandItem
                        key={item.id}
                        onSelect={() => handleAction(item.action)}
                        className="cursor-pointer"
                      >
                        <Icon className="mr-2 h-4 w-4" />
                        {item.label}
                      </CommandItem>
                    )
                  })}
                </CommandGroup>
              )}
            </CommandList>
          </Command>
        </DialogContent>
      </Dialog>
    </>
  )
}
