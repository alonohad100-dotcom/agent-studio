import type { ExportBundle } from '@/lib/actions/export'

/**
 * Generate downloadable JSON files from export bundle
 * This is a utility function, not a server action
 */
export function generateExportFiles(bundle: ExportBundle): {
  agentConfig: string
  promptPackage: string
  testReport: string
} {
  return {
    agentConfig: JSON.stringify(bundle.agentConfig, null, 2),
    promptPackage: JSON.stringify(bundle.promptPackage, null, 2),
    testReport: JSON.stringify(bundle.testReport, null, 2),
  }
}

