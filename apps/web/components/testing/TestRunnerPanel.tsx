'use client'

import { useState, useTransition } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Play, Loader2 } from 'lucide-react'
import { RunSummaryCard } from './RunSummaryCard'
import { trackEvent } from '@/lib/telemetry/events'
import { toast } from 'sonner'
import type { TestRunResult } from '@core/types/test'

interface TestRunnerPanelProps {
  agentId: string
  testCaseCount: number
}

export function TestRunnerPanel({ agentId, testCaseCount }: TestRunnerPanelProps) {
  const [result, setResult] = useState<TestRunResult | null>(null)
  const [isRunning, startTransition] = useTransition()

  const handleRunAll = () => {
    if (testCaseCount === 0) {
      toast.error('No test cases to run')
      return
    }

    startTransition(async () => {
      try {
        const response = await fetch('/api/testing/run-all', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ agentId }),
        })

        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.error || 'Failed to run tests')
        }

        const data = await response.json()
        setResult(data)
        trackEvent({
          type: 'tests_run',
          agentId,
          passRate: data.passRate,
        })
        toast.success(`Tests completed: ${data.passedTests}/${data.totalTests} passed`)
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Failed to run tests')
      }
    })
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Test Runner</CardTitle>
          <CardDescription>Run all test cases against your agent</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">
                {testCaseCount} test case{testCaseCount !== 1 ? 's' : ''} ready to run
              </p>
            </div>
            <Button onClick={handleRunAll} disabled={isRunning || testCaseCount === 0}>
              {isRunning ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Running...
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Run All Tests
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {result && <RunSummaryCard result={result} />}
    </div>
  )
}

