'use client'

import { useState, useTransition } from 'react'
import { PromptLayerTabs } from '@/components/prompts/PromptLayerTabs'
import { LintPanel } from '@/components/lint/LintPanel'
import { QualityScoreCard } from '@/components/quality/QualityScoreCard'
import { Button } from '@/components/ui/button'
import { RefreshCw, AlertCircle } from 'lucide-react'
import { compileDraft } from '@/lib/actions/compiler'
import { toast } from 'sonner'
import type { PromptPackageJSON } from '@core/types/prompt'
import type { CompilerOutput } from '@core/compiler'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface InstructionsPageClientProps {
  agentId: string
  initialPromptPackage: PromptPackageJSON | null
  initialResult?: CompilerOutput | null
}

export function InstructionsPageClient({
  agentId,
  initialPromptPackage,
  initialResult,
}: InstructionsPageClientProps) {
  const [compilationResult, setCompilationResult] = useState<CompilerOutput | null>(initialResult || null)
  const [promptPackage, setPromptPackage] = useState<PromptPackageJSON | null>(initialPromptPackage)
  const [isCompiling, startTransition] = useTransition()

  const handleRegenerate = () => {
    startTransition(async () => {
      try {
        const result = await compileDraft(agentId)
        setCompilationResult(result)
        setPromptPackage(result.promptPackage)
        toast.success('Prompt package regenerated successfully')
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Failed to regenerate')
      }
    })
  }

  if (!promptPackage && !compilationResult) {
    return (
      <div className="space-y-4">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>No Prompt Package</AlertTitle>
          <AlertDescription>
            No compiled prompt package found. Click the button below to compile your specification.
          </AlertDescription>
        </Alert>
        <Button onClick={handleRegenerate} disabled={isCompiling}>
          {isCompiling ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Compiling...
            </>
          ) : (
            <>
              <RefreshCw className="mr-2 h-4 w-4" />
              Compile Specification
            </>
          )}
        </Button>
      </div>
    )
  }

  const currentPackage = promptPackage || compilationResult?.promptPackage || null
  const currentResult = compilationResult

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Compiled Instructions</h2>
          <p className="text-sm text-muted-foreground">
            View your prompt package, lint findings, and quality score
          </p>
        </div>
        <Button onClick={handleRegenerate} disabled={isCompiling}>
          {isCompiling ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Compiling...
            </>
          ) : (
            <>
              <RefreshCw className="mr-2 h-4 w-4" />
              Regenerate
            </>
          )}
        </Button>
      </div>

      {currentResult && (
        <div className="grid gap-6 md:grid-cols-2">
          <QualityScoreCard score={currentResult.qualityScore} />
          <LintPanel findings={currentResult.lintFindings} />
        </div>
      )}

      {currentPackage && (
        <Tabs defaultValue="prompts" className="w-full">
          <TabsList>
            <TabsTrigger value="prompts">Prompt Layers</TabsTrigger>
            {currentResult && (
              <>
                <TabsTrigger value="lint">Lint Findings</TabsTrigger>
                <TabsTrigger value="quality">Quality Score</TabsTrigger>
              </>
            )}
          </TabsList>

          <TabsContent value="prompts" className="mt-4">
            <PromptLayerTabs promptPackage={currentPackage} />
          </TabsContent>

          {currentResult && (
            <>
              <TabsContent value="lint" className="mt-4">
                <LintPanel findings={currentResult.lintFindings} />
              </TabsContent>

              <TabsContent value="quality" className="mt-4">
                <QualityScoreCard score={currentResult.qualityScore} showBreakdown />
              </TabsContent>
            </>
          )}
        </Tabs>
      )}
    </div>
  )
}

