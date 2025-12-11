'use client'

import { useState, useTransition } from 'react'
import { TestCaseList } from '@/components/testing/TestCaseList'
import { TestCaseForm } from '@/components/testing/TestCaseForm'
import { TestRunnerPanel } from '@/components/testing/TestRunnerPanel'
import { SandboxChat } from '@/components/testing/SandboxChat'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Plus, Sparkles } from 'lucide-react'
import { createTestCase, updateTestCase, deleteTestCase } from '@/lib/actions/testing'
import { generateTestSuite, generateSafetyTestSuite } from '@/lib/actions/test-generation'
import { trackEvent } from '@/lib/telemetry/events'
import { toast } from 'sonner'
import type { TestCase, TestCaseInput } from '@core/types/test'

interface TestingPageClientProps {
  agentId: string
  initialTestCases: TestCase[]
}

export function TestingPageClient({ agentId, initialTestCases }: TestingPageClientProps) {
  const [testCases, setTestCases] = useState<TestCase[]>(initialTestCases)
  const [editingCase, setEditingCase] = useState<TestCase | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [isGenerating, startGeneration] = useTransition()

  const handleCreate = async (data: TestCaseInput) => {
    try {
      const result = await createTestCase(agentId, data)
      setTestCases((prev) => [result, ...prev])
      setShowForm(false)
      toast.success('Test case created')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to create test case')
      throw error
    }
  }

  const handleUpdate = async (data: TestCaseInput) => {
    if (!editingCase) return

    try {
      const result = await updateTestCase(agentId, editingCase.id, data)
      setTestCases((prev) => prev.map((tc) => (tc.id === editingCase.id ? result : tc)))
      setEditingCase(null)
      setShowForm(false)
      toast.success('Test case updated')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update test case')
      throw error
    }
  }

  const handleDelete = async (testCaseId: string) => {
    try {
      await deleteTestCase(agentId, testCaseId)
      setTestCases((prev) => prev.filter((tc) => tc.id !== testCaseId))
      toast.success('Test case deleted')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to delete test case')
    }
  }

  const handleEdit = (testCase: TestCase) => {
    setEditingCase(testCase)
    setShowForm(true)
  }

  const handleRun = async (testCaseId: string) => {
    try {
      const response = await fetch('/api/testing/run-single', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agentId, testCaseId }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to run test')
      }

      const result = await response.json()
      toast.success(result.passed ? 'Test passed!' : `Test failed: ${result.failures.join(', ')}`)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to run test')
    }
  }

  const handleGenerateSuite = () => {
    startGeneration(async () => {
      try {
        const result = await generateTestSuite(agentId)
        trackEvent({
          type: 'tests_generated',
          agentId,
          count: result.created,
        })
        toast.success(`Generated ${result.created} test cases`)
        // Refresh test cases
        const response = await fetch(`/api/testing/list?agentId=${agentId}`)
        if (response.ok) {
          const updated = await response.json()
          setTestCases(updated)
        }
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Failed to generate test suite')
      }
    })
  }

  const handleGenerateSafety = () => {
    startGeneration(async () => {
      try {
        const result = await generateSafetyTestSuite(agentId)
        trackEvent({
          type: 'tests_generated',
          agentId,
          count: result.created,
        })
        toast.success(`Generated ${result.created} safety test cases`)
        // Refresh test cases
        const response = await fetch(`/api/testing/list?agentId=${agentId}`)
        if (response.ok) {
          const updated = await response.json()
          setTestCases(updated)
        }
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Failed to generate safety tests')
      }
    })
  }

  return (
    <Tabs defaultValue="cases" className="space-y-6">
      <div className="flex items-center justify-between">
        <TabsList>
          <TabsTrigger value="cases">Test Cases</TabsTrigger>
          <TabsTrigger value="runner">Test Runner</TabsTrigger>
          <TabsTrigger value="sandbox">Sandbox</TabsTrigger>
        </TabsList>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleGenerateSafety} disabled={isGenerating}>
            <Sparkles className="h-4 w-4 mr-2" />
            Generate Safety Tests
          </Button>
          <Button variant="outline" onClick={handleGenerateSuite} disabled={isGenerating}>
            <Sparkles className="h-4 w-4 mr-2" />
            Generate Test Suite
          </Button>
          <Button onClick={() => { setEditingCase(null); setShowForm(true) }}>
            <Plus className="h-4 w-4 mr-2" />
            New Test Case
          </Button>
        </div>
      </div>

      <TabsContent value="cases" className="space-y-6">
        {showForm ? (
          <TestCaseForm
            initialData={editingCase || undefined}
            onSubmit={editingCase ? handleUpdate : handleCreate}
            onCancel={() => {
              setShowForm(false)
              setEditingCase(null)
            }}
          />
        ) : (
          <TestCaseList
            testCases={testCases}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onRun={handleRun}
          />
        )}
      </TabsContent>

      <TabsContent value="runner">
        <TestRunnerPanel agentId={agentId} testCaseCount={testCases.length} />
      </TabsContent>

      <TabsContent value="sandbox">
        <SandboxChat agentId={agentId} />
      </TabsContent>
    </Tabs>
  )
}

