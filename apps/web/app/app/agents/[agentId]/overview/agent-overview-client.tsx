'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { deleteAgent } from '@/lib/actions/agents'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { BlockersList } from '@/components/spec/BlockersList'
import { FadeIn, StaggerList } from '@/components/ui'
import { FileText, Settings, Trash2, Calendar, Clock, FlaskConical, BookOpen, GitBranch, Download } from 'lucide-react'
import { toast } from 'sonner'
import { formatDistanceToNow } from 'date-fns'
import type { Database } from '@db/types'
import type { SpecJSON } from '@core/types/spec'
import { EMPTY_SPEC } from '@core/types/spec'

type Agent = Database['public']['Tables']['agents']['Row']

interface AgentOverviewClientProps {
  agent: Agent
  spec?: SpecJSON
}

export function AgentOverviewClient({ agent, spec }: AgentOverviewClientProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const currentSpec = spec || EMPTY_SPEC

  const handleDelete = async () => {
    if (
      !confirm(
        'Are you sure you want to delete this agent? This action cannot be undone and will delete all associated data.'
      )
    ) {
      return
    }

    startTransition(async () => {
      try {
        await deleteAgent(agent.id)
        toast.success('Agent deleted successfully')
        router.push('/app/agents')
        router.refresh()
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Failed to delete agent')
      }
    })
  }

  return (
    <StaggerList className="grid gap-6 md:grid-cols-2">
      <FadeIn>
        <Card hoverable>
          <CardHeader>
            <CardTitle>Agent Information</CardTitle>
            <CardDescription>Basic details about your agent</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Calendar className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Status</p>
                <p className="text-sm mt-1 capitalize font-semibold">{agent.status}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-success/10">
                <Clock className="h-4 w-4 text-success" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Created</p>
                <p className="text-sm mt-1">
                  {formatDistanceToNow(new Date(agent.created_at), { addSuffix: true })}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-warning/10">
                <Clock className="h-4 w-4 text-warning" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Last Updated</p>
                <p className="text-sm mt-1">
                  {formatDistanceToNow(new Date(agent.updated_at), { addSuffix: true })}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </FadeIn>

      <FadeIn delay={0.1}>
        <Card hoverable>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks for this agent</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" className="w-full justify-start" asChild>
              <a href={`/app/agents/${agent.id}/spec`}>
                <FileText className="mr-2 h-4 w-4" />
                Edit Specification
              </a>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <a href={`/app/agents/${agent.id}/capabilities`}>
                <Settings className="mr-2 h-4 w-4" />
                Capabilities
              </a>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <a href={`/app/agents/${agent.id}/knowledge`}>
                <BookOpen className="mr-2 h-4 w-4" />
                Knowledge
              </a>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <a href={`/app/agents/${agent.id}/testing`}>
                <FlaskConical className="mr-2 h-4 w-4" />
                Testing Lab
              </a>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <a href={`/app/agents/${agent.id}/versions`}>
                <GitBranch className="mr-2 h-4 w-4" />
                Versions
              </a>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <a href={`/app/agents/${agent.id}/deploy`}>
                <Download className="mr-2 h-4 w-4" />
                Export & Deploy
              </a>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <a href={`/app/agents/${agent.id}/settings`}>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </a>
            </Button>
            <Button
              variant="destructive"
              className="w-full justify-start"
              onClick={handleDelete}
              disabled={isPending}
              loading={isPending}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Agent
            </Button>
          </CardContent>
        </Card>
      </FadeIn>

      <FadeIn delay={0.2}>
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Specification Status</CardTitle>
            <CardDescription>Current specification blockers and readiness</CardDescription>
          </CardHeader>
          <CardContent>
            <BlockersList spec={currentSpec} />
          </CardContent>
        </Card>
      </FadeIn>
    </StaggerList>
  )
}

