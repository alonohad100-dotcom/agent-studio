import { runSingleTest } from '@/lib/actions/test-runner'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { agentId, testCaseId } = await req.json()

    if (!agentId || !testCaseId) {
      return NextResponse.json({ error: 'Missing agentId or testCaseId' }, { status: 400 })
    }

    const result = await runSingleTest(agentId, testCaseId)
    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}

