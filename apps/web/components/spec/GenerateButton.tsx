'use client'

import { useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { Wand2, Loader2 } from 'lucide-react'
import { generateSpecBlock } from '@/lib/actions/ai'
import { trackEvent } from '@/lib/telemetry/events'
import { toast } from 'sonner'
import type { SpecBlockName } from '@core/types/spec'

interface GenerateButtonProps {
  agentId: string
  blockName: SpecBlockName
  onGenerated: (content: string) => void
  context?: string
}

export function GenerateButton({ agentId, blockName, onGenerated, context }: GenerateButtonProps) {
  const [isGenerating, startTransition] = useTransition()

  const handleGenerate = () => {
    startTransition(async () => {
      try {
        const generated = await generateSpecBlock(agentId, blockName, context)
        onGenerated(generated)
        trackEvent({
          type: 'spec_block_generated',
          agentId,
          blockName,
        })
        toast.success('Content generated successfully')
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Failed to generate content')
      }
    })
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={handleGenerate}
      disabled={isGenerating}
    >
      {isGenerating ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Generating...
        </>
      ) : (
        <>
          <Wand2 className="mr-2 h-4 w-4" />
          Generate
        </>
      )}
    </Button>
  )
}

