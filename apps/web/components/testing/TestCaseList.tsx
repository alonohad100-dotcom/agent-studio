'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Edit, Trash2, Play, FlaskConical, Shield, RotateCcw } from 'lucide-react'
import type { TestCase, TestCaseType } from '@core/types/test'

interface TestCaseListProps {
  testCases: TestCase[]
  onEdit: (testCase: TestCase) => void
  onDelete: (testCaseId: string) => void
  onRun: (testCaseId: string) => void
}

const typeConfig: Record<TestCaseType, { label: string; icon: typeof FlaskConical; variant: 'default' | 'secondary' | 'destructive'; color: string }> = {
  functional: { label: 'Functional', icon: FlaskConical, variant: 'default', color: 'primary' },
  safety: { label: 'Safety', icon: Shield, variant: 'destructive', color: 'destructive' },
  regression: { label: 'Regression', icon: RotateCcw, variant: 'secondary', color: 'secondary' },
}

export function TestCaseList({ testCases, onEdit, onDelete, onRun }: TestCaseListProps) {
  if (testCases.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Test Cases</CardTitle>
          <CardDescription>No test cases yet</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-8">
            Create test cases to validate your agent&apos;s behavior
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Test Cases</CardTitle>
        <CardDescription>{testCases.length} test case{testCases.length !== 1 ? 's' : ''}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {testCases.map((testCase) => {
            const config = typeConfig[testCase.type]
            const Icon = config.icon

            return (
              <div
                key={testCase.id}
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent transition-colors"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className={`p-2 rounded-lg ${
                    config.variant === 'default' ? 'bg-primary/10' :
                    config.variant === 'destructive' ? 'bg-destructive/10' :
                    'bg-secondary/10'
                  }`}>
                    <Icon className={`h-4 w-4 ${
                      config.variant === 'default' ? 'text-primary' :
                      config.variant === 'destructive' ? 'text-destructive' :
                      'text-secondary'
                    }`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium truncate">{testCase.name}</p>
                      <Badge variant={config.variant}>{config.label}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {testCase.input.messages.length} message{testCase.input.messages.length !== 1 ? 's' : ''} •{' '}
                      {testCase.expected.must_include.length} required •{' '}
                      {testCase.expected.must_not_include.length} forbidden
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" onClick={() => onRun(testCase.id)}>
                    <Play className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => onEdit(testCase)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      if (confirm('Are you sure you want to delete this test case?')) {
                        onDelete(testCase.id)
                      }
                    }}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

