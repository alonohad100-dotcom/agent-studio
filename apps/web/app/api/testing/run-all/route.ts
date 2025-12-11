import { runAllTests } from '@/lib/actions/test-runner'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { agentId } = await req.json()

    if (!agentId) {
      return NextResponse.json({ error: 'Missing agentId' }, { status: 400 })
    }

    const result = await runAllTests(agentId)
    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}

