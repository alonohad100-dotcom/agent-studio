import { createClient } from '@/lib/supabase/server'
import { requireAuth } from '@/lib/auth'
import { uploadKnowledgeFile } from '@/lib/actions/knowledge'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    await requireAuth()

    const formData = await req.formData()
    const file = formData.get('file') as File
    const agentId = formData.get('agentId') as string
    const name = formData.get('name') as string
    const tagsJson = formData.get('tags') as string

    if (!file || !agentId || !name) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const tags = tagsJson ? JSON.parse(tagsJson) : []

    const result = await uploadKnowledgeFile(agentId, file, { name, tags })

    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}

