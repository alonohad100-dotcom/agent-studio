'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { FadeIn, StaggerList } from '@/components/ui'
import { staggerItemVariants } from '@/lib/utils/animations'
import { Bot, Plus, FileText, Sparkles, TrendingUp, Clock, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import type { Database } from '@db/types'

type Agent = Database['public']['Tables']['agents']['Row']

interface DashboardClientProps {
  user: { email?: string | null; id: string }
  recentAgents: Agent[]
}

export function DashboardClient({ user, recentAgents }: DashboardClientProps) {
  const stats = [
    {
      label: 'Total Agents',
      value: recentAgents.length,
      icon: Bot,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      label: 'Draft Agents',
      value: recentAgents.filter(a => a.status === 'draft').length,
      icon: FileText,
      color: 'text-warning',
      bgColor: 'bg-warning/10',
    },
    {
      label: 'Published',
      value: recentAgents.filter(a => a.status === 'published').length,
      icon: CheckCircle2,
      color: 'text-success',
      bgColor: 'bg-success/10',
    },
    {
      label: 'In Progress',
      value: recentAgents.filter(a => a.status === 'draft').length,
      icon: TrendingUp,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
    },
  ]

  return (
    <div className="space-y-8" role="region" aria-label="Dashboard content">
      {/* Header with animation */}
      <FadeIn>
        <header>
          <h1 className="text-4xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Welcome back, {user.email?.split('@')[0] || 'Developer'}! Here&apos;s what&apos;s
            happening with your agents.
          </p>
        </header>
      </FadeIn>

      {/* Stats Cards */}
      <section aria-label="Agent statistics">
        <StaggerList className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <motion.div key={index} variants={staggerItemVariants}>
              <Card hoverable className="h-full" role="article" aria-label={stat.label}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">{stat.label}</p>
                      <p className="text-3xl font-bold">{stat.value}</p>
                    </div>
                    <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                      <stat.icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </StaggerList>
      </section>

      {/* Quick Actions */}
      <section aria-label="Quick actions">
        <FadeIn delay={0.2}>
          <Card className="bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 border-primary/20">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Get started quickly with these actions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                <Button asChild>
                  <Link href="/app/agents/new">
                    <Plus className="mr-2 h-4 w-4" />
                    Create New Agent
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/app/agents">
                    <Bot className="mr-2 h-4 w-4" />
                    View All Agents
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/app/templates">
                    <Sparkles className="mr-2 h-4 w-4" />
                    Browse Templates
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </FadeIn>
      </section>

      {/* Recent Agents */}
      <section aria-label="Recent agents">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <FadeIn>
              <h2 className="text-2xl font-semibold">Recent Agents</h2>
            </FadeIn>
            <Button asChild variant="ghost" size="sm">
              <Link href="/app/agents">View All</Link>
            </Button>
          </div>

          {recentAgents.length > 0 ? (
            <StaggerList className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recentAgents.map(agent => (
                <motion.div key={agent.id} variants={staggerItemVariants}>
                  <Link href={`/app/agents/${agent.id}/overview`} className="block h-full">
                    <Card hoverable className="cursor-pointer h-full">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-lg">{agent.name}</CardTitle>
                            {agent.description && (
                              <CardDescription className="mt-1 line-clamp-2">
                                {agent.description}
                              </CardDescription>
                            )}
                          </div>
                          <Badge
                            variant={
                              agent.status === 'published'
                                ? 'default'
                                : agent.status === 'draft'
                                  ? 'secondary'
                                  : 'outline'
                            }
                          >
                            {agent.status}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          <span>
                            Updated{' '}
                            {formatDistanceToNow(new Date(agent.updated_at), { addSuffix: true })}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </StaggerList>
          ) : (
            <FadeIn>
              <Card>
                <CardContent className="p-12 text-center">
                  <Bot className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No agents yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Get started by creating your first AI agent
                  </p>
                  <Button asChild>
                    <Link href="/app/agents/new">
                      <Plus className="mr-2 h-4 w-4" />
                      Create Agent
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </FadeIn>
          )}
        </div>
      </section>
    </div>
  )
}
