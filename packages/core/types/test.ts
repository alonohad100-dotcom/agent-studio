/**
 * Test Types
 * Defines the structure for test cases and test runs
 */

export type TestCaseType = 'functional' | 'safety' | 'regression'

export interface TestCase {
  id: string
  agent_id: string
  name: string
  type: TestCaseType
  input: {
    messages: Array<{ role: 'user' | 'assistant'; content: string }>
  }
  expected: {
    must_include: string[]
    must_not_include: string[]
    traits: string[]
  }
  created_at: string
  updated_at: string
}

export interface TestCaseInput {
  name: string
  type: TestCaseType
  input: {
    messages: Array<{ role: 'user' | 'assistant'; content: string }>
  }
  expected: {
    must_include: string[]
    must_not_include: string[]
    traits: string[]
  }
}

export interface TestResult {
  testCaseId: string
  testCaseName: string
  passed: boolean
  actualOutput: string
  failures: string[]
  duration: number
}

export interface TestRunResult {
  results: TestResult[]
  passRate: number
  totalTests: number
  passedTests: number
  failedTests: number
  duration: number
}

