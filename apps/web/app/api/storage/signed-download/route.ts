import { createClient } from '@/lib/supabase/server'
import { requireAuth } from '@/lib/auth'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const user = await requireAuth()
    const { agentId, fileId } = await req.json()

    if (!agentId || !fileId) {
      return NextResponse.json({ error: 'Missing agentId or fileId' }, { status: 400 })
    }

    const supabase = await createClient()

    // Verify ownership
    const { data: agent, error: checkError } = await supabase
      .from('agents')
      .select('owner_id')
      .eq('id', agentId)
      .single()

    if (checkError || !agent) {
      return NextResponse.json({ error: 'Agent not found' }, { status: 404 })
    }

    if (agent.owner_id !== user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    // Get file metadata
    const { data: file, error: fileError } = await supabase
      .from('files')
      .select('object_key')
      .eq('id', fileId)
      .eq('agent_id', agentId)
      .single()

    if (fileError || !file) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 })
    }

    // Create signed URL (valid for 1 hour)
    const { data, error } = await supabase.storage
      .from('agent-knowledge')
      .createSignedUrl(file.object_key, 3600)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ url: data.signedUrl })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}

