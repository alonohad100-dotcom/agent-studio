'use client'

import { useState, useTransition } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Sparkles, Wand2, AlertTriangle, Target } from 'lucide-react'
import { tightenScope, detectContradictions } from '@/lib/actions/ai'
import { toast } from 'sonner'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface SpecCoachProps {
  agentId: string
}

export function SpecCoach({ agentId }: SpecCoachProps) {
  const [suggestions, setSuggestions] = useState<string>('')
  const [isGenerating, startTransition] = useTransition()

  const handleTightenScope = () => {
    startTransition(async () => {
      try {
        const result = await tightenScope(agentId)
        setSuggestions(result)
        toast.success('Scope tightening suggestions generated')
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Failed to generate suggestions')
      }
    })
  }

  const handleDetectContradictions = () => {
    startTransition(async () => {
      try {
        const result = await detectContradictions(agentId)
        setSuggestions(result)
        toast.success('Contradiction analysis complete')
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Failed to detect contradictions')
      }
    })
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <CardTitle>Spec Coach</CardTitle>
        </div>
        <CardDescription>Get AI-powered guidance for your specification</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={handleTightenScope}
            disabled={isGenerating}
          >
            <Target className="mr-2 h-4 w-4" />
            Tighten Scope
          </Button>
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={handleDetectContradictions}
            disabled={isGenerating}
          >
            <AlertTriangle className="mr-2 h-4 w-4" />
            Detect Contradictions
          </Button>
        </div>

        {suggestions && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Suggestions:</h4>
            <Textarea
              value={suggestions}
              onChange={(e) => setSuggestions(e.target.value)}
              rows={8}
              className="resize-none text-sm"
              readOnly
            />
          </div>
        )}

        {!suggestions && (
          <Alert>
            <Wand2 className="h-4 w-4" />
            <AlertDescription className="text-xs">
              Use the buttons above to get AI-powered suggestions for improving your specification.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  )
}
