'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle2, XCircle, Clock } from 'lucide-react'
import type { TestRunResult } from '@core/types/test'

interface RunSummaryCardProps {
  result: TestRunResult
}

export function RunSummaryCard({ result }: RunSummaryCardProps) {
  const passRate = result.passRate
  const statusColor =
    passRate >= 80 ? 'text-success' : passRate >= 50 ? 'text-warning' : 'text-destructive'
  const statusBadge =
    passRate >= 80 ? 'default' : passRate >= 50 ? 'secondary' : 'destructive'

  return (
    <Card>
      <CardHeader>
        <CardTitle>Test Run Summary</CardTitle>
        <CardDescription>Results from the latest test run</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Pass Rate</p>
            <p className={`text-3xl font-bold ${statusColor}`}>{passRate.toFixed(1)}%</p>
          </div>
          <Badge variant={statusBadge} className="text-lg px-4 py-2">
            {result.passedTests} / {result.totalTests}
          </Badge>
        </div>

        <div className="grid grid-cols-3 gap-4 pt-4 border-t">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-success mb-1">
              <CheckCircle2 className="h-5 w-5" />
              <span className="text-2xl font-bold">{result.passedTests}</span>
            </div>
            <p className="text-xs text-muted-foreground">Passed</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-destructive mb-1">
              <XCircle className="h-5 w-5" />
              <span className="text-2xl font-bold">{result.failedTests}</span>
            </div>
            <p className="text-xs text-muted-foreground">Failed</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
              <Clock className="h-5 w-5" />
              <span className="text-2xl font-bold">{(result.duration / 1000).toFixed(1)}s</span>
            </div>
            <p className="text-xs text-muted-foreground">Duration</p>
          </div>
        </div>

        {result.failedTests > 0 && (
          <div className="pt-4 border-t">
            <p className="text-sm font-medium mb-2">Failed Tests:</p>
            <div className="space-y-1">
              {result.results
                .filter((r) => !r.passed)
                .map((r) => (
                  <div key={r.testCaseId} className="text-sm">
                    <p className="font-medium">{r.testCaseName}</p>
                    {r.failures.length > 0 && (
                      <ul className="text-xs text-muted-foreground list-disc list-inside ml-2">
                        {r.failures.map((failure, idx) => (
                          <li key={idx}>{failure}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

