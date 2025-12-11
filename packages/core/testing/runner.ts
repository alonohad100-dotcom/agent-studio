/**
 * Test Runner
 * Executes test cases against prompt packages
 */

import type { TestCase, TestResult, TestRunResult } from '../types/test'
import type { PromptPackageJSON } from '../types/prompt'
import type { AIProvider } from '../ai'

/**
 * Build full prompt from package and messages
 */
function buildPromptFromPackage(
  promptPackage: PromptPackageJSON,
  messages: Array<{ role: 'user' | 'assistant'; content: string }>
): string {
  // Combine all prompt layers
  const systemPrompt = `${promptPackage.system_backbone}

${promptPackage.domain_manual}

${promptPackage.output_contracts}

${promptPackage.tool_policy}

${promptPackage.examples}`

  // Build conversation context
  const conversation = messages
    .map((msg) => {
      if (msg.role === 'user') {
        return `User: ${msg.content}`
      } else {
        return `Assistant: ${msg.content}`
      }
    })
    .join('\n\n')

  return `${systemPrompt}

---

Conversation:
${conversation}

Assistant:`
}

/**
 * Run a single test case
 */
export async function runTest(
  testCase: TestCase,
  promptPackage: PromptPackageJSON,
  aiProvider: AIProvider
): Promise<TestResult> {
  const startTime = Date.now()

  // Build full prompt from package
  const fullPrompt = buildPromptFromPackage(promptPackage, testCase.input.messages)

  // Get AI response
  const actualOutput = await aiProvider.generateText(fullPrompt, {
    temperature: 0.7,
    maxTokens: 2000,
  })

  // Evaluate against expected
  const failures: string[] = []
  const outputLower = actualOutput.toLowerCase()

  // Check must_include
  for (const required of testCase.expected.must_include) {
    if (!outputLower.includes(required.toLowerCase())) {
      failures.push(`Missing required text: "${required}"`)
    }
  }

  // Check must_not_include
  for (const forbidden of testCase.expected.must_not_include) {
    if (outputLower.includes(forbidden.toLowerCase())) {
      failures.push(`Contains forbidden text: "${forbidden}"`)
    }
  }

  // Check traits (basic implementation - could be enhanced with AI evaluation)
  // For now, we'll do simple keyword checks
  for (const trait of testCase.expected.traits) {
    const traitLower = trait.toLowerCase()
    // Simple heuristic: check if output demonstrates the trait
    // This is a placeholder - could be enhanced with AI-based evaluation
    if (traitLower === 'helpful' && !outputLower.includes('help')) {
      // Not a failure, just a note
    }
  }

  const passed = failures.length === 0
  const duration = Date.now() - startTime

  return {
    testCaseId: testCase.id,
    testCaseName: testCase.name,
    passed,
    actualOutput,
    failures,
    duration,
  }
}

/**
 * Run a test suite
 */
export async function runTestSuite(
  testCases: TestCase[],
  promptPackage: PromptPackageJSON,
  aiProvider: AIProvider
): Promise<TestRunResult> {
  const results: TestResult[] = []

  for (const testCase of testCases) {
    const result = await runTest(testCase, promptPackage, aiProvider)
    results.push(result)
  }

  const passed = results.filter((r) => r.passed).length
  const passRate = testCases.length > 0 ? (passed / testCases.length) * 100 : 0

  return {
    results,
    passRate: Math.round(passRate * 100) / 100, // Round to 2 decimal places
    totalTests: results.length,
    passedTests: passed,
    failedTests: results.length - passed,
    duration: results.reduce((sum, r) => sum + r.duration, 0),
  }
}

