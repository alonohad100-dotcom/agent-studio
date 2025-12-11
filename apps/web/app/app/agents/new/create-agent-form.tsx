'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { createAgent } from '@/lib/actions/agents'
import { trackEvent } from '@/lib/telemetry/events'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

const createAgentSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be 100 characters or less'),
  description: z.string().max(500, 'Description must be 500 characters or less').optional(),
})

type CreateAgentFormData = z.infer<typeof createAgentSchema>

export function CreateAgentForm() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateAgentFormData>({
    resolver: zodResolver(createAgentSchema),
  })

  const onSubmit = (data: CreateAgentFormData) => {
    startTransition(async () => {
      try {
      const agent = await createAgent(data)
      trackEvent({
        type: 'agent_created',
        agentId: agent.id,
        name: agent.name,
      })
      toast.success('Agent created successfully!')
      router.push(`/app/agents/${agent.id}/overview`)
        router.refresh()
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Failed to create agent')
      }
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Agent Details</CardTitle>
        <CardDescription>Enter basic information about your agent</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="name" className="text-sm font-medium mb-2 block">
              Name <span className="text-destructive">*</span>
            </label>
            <Input
              id="name"
              {...register('name')}
              placeholder="My AI Agent"
              disabled={isPending}
              aria-invalid={errors.name ? 'true' : 'false'}
            />
            {errors.name && (
              <p className="text-sm text-destructive mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="description" className="text-sm font-medium mb-2 block">
              Description
            </label>
            <Textarea
              id="description"
              {...register('description')}
              placeholder="A brief description of what this agent does..."
              rows={4}
              disabled={isPending}
              aria-invalid={errors.description ? 'true' : 'false'}
            />
            {errors.description && (
              <p className="text-sm text-destructive mt-1">{errors.description.message}</p>
            )}
            <p className="text-xs text-muted-foreground mt-1">
              Optional. Maximum 500 characters.
            </p>
          </div>

          <div className="flex gap-2">
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Agent
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isPending}
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

