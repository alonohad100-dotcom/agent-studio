'use client'

import { useEffect, useState } from 'react'
import { useForm, FieldValues, UseFormReturn, Path } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useDebouncedCallback } from 'use-debounce'
import { SpecBlockHeader } from './SpecBlockHeader'
import { AutosaveIndicator } from '@/components/ui/autosave-indicator'
import { GenerateButton } from './GenerateButton'
import { saveDraftSpec } from '@/lib/actions/drafts'
import { toast } from 'sonner'
import type { SpecJSON, SpecBlockName } from '@core/types/spec'
import {
  missionBlockSchema,
  audienceBlockSchema,
  scopeBlockSchema,
  ioContractsBlockSchema,
  constraintsBlockSchema,
  safetyBlockSchema,
  examplesBlockSchema,
  metadataBlockSchema,
} from '@core/spec/validation/schemas'

interface SpecBlockFormProps {
  agentId: string
  blockName: SpecBlockName
  title: string
  description: string
  required?: boolean
  initialValue: FieldValues
  children: (form: UseFormReturn<FieldValues>) => React.ReactNode
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const blockSchemas: Record<SpecBlockName, any> = {
  mission: missionBlockSchema,
  audience: audienceBlockSchema,
  scope: scopeBlockSchema,
  io_contracts: ioContractsBlockSchema,
  constraints: constraintsBlockSchema,
  safety: safetyBlockSchema,
  examples: examplesBlockSchema,
  metadata: metadataBlockSchema,
}

export function SpecBlockForm({
  agentId,
  blockName,
  title,
  description,
  required = false,
  initialValue,
  children,
}: SpecBlockFormProps) {
  const schema = blockSchemas[blockName]
  const form = useForm({
    defaultValues: initialValue as FieldValues,
    mode: 'onChange',
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: schema ? zodResolver(schema as any) : undefined,
  })

  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')

  const debouncedSave = useDebouncedCallback(
    async (data: unknown) => {
      setSaveStatus('saving')
      try {
        await saveDraftSpec(agentId, { [blockName]: data } as Partial<SpecJSON>)
        setSaveStatus('saved')
        setTimeout(() => setSaveStatus('idle'), 2000)
      } catch (error) {
        setSaveStatus('error')
        toast.error(error instanceof Error ? error.message : 'Failed to save')
        setTimeout(() => setSaveStatus('idle'), 3000)
      }
    },
    1000 // 1 second debounce
  )

  useEffect(() => {
    const subscription = form.watch((data) => {
      debouncedSave(data)
    })
    return () => subscription.unsubscribe()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSave])

  const isCompleted = form.formState.isDirty && form.formState.isValid
  const hasErrors = Object.keys(form.formState.errors).length > 0

  const handleGenerated = (content: string) => {
    try {
      // Try to parse as JSON if possible, otherwise use as text
      try {
        const parsed = JSON.parse(content) as Record<string, unknown>
        Object.keys(parsed).forEach((key) => {
          form.setValue(key as Path<FieldValues>, parsed[key])
        })
      } catch {
        // If parsing fails, content is plain text - user can copy manually
      }
    } catch {
      // If not JSON, show in toast for user to copy
      toast.info('Generated content ready - please review and apply manually')
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between">
        <SpecBlockHeader
          title={title}
          description={description}
          required={required}
          completed={isCompleted && saveStatus === 'saved'}
          actions={
            <div className="flex items-center gap-2">
              <GenerateButton
                agentId={agentId}
                blockName={blockName}
                onGenerated={handleGenerated}
              />
              <AutosaveIndicator status={saveStatus} />
            </div>
          }
        />
      </div>
      <div className="space-y-4">
        {children(form)}
        {hasErrors && (
          <div className="text-sm text-destructive space-y-1">
            {Object.entries(form.formState.errors).map(([field, error]) => (
              <p key={field}>
                {field}: {error?.message as string}
              </p>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

