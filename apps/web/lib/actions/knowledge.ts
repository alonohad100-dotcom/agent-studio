'use server'

import { createClient } from '@/lib/supabase/server'
import { requireAuth } from '@/lib/auth'
import { revalidatePath } from 'next/cache'
import { createHash } from 'crypto'

export async function uploadKnowledgeFile(
  agentId: string,
  file: File,
  metadata: { name: string; tags?: string[] }
) {
  const user = await requireAuth()
  const supabase = await createClient()

  // Verify ownership
  const { data: agent, error: checkError } = await supabase
    .from('agents')
    .select('owner_id')
    .eq('id', agentId)
    .single()

  if (checkError || !agent) {
    throw new Error('Agent not found')
  }

  if (agent.owner_id !== user.id) {
    throw new Error('Unauthorized')
  }

  // Generate file ID and path
  const fileId = crypto.randomUUID()
  const fileExt = file.name.split('.').pop() || 'bin'
  const fileName = `${fileId}.${fileExt}`
  const storagePath = `${user.id}/${agentId}/${fileId}/${fileName}`

  // Calculate checksum
  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)
  const checksum = createHash('sha256').update(buffer).digest('hex')

  // Upload to storage
  const { error: uploadError } = await supabase.storage
    .from('agent-knowledge')
    .upload(storagePath, buffer, {
      contentType: file.type,
      upsert: false,
    })

  if (uploadError) {
    throw new Error(`Failed to upload file: ${uploadError.message}`)
  }

  // Save metadata to database
  const { data, error } = await supabase
    .from('files')
    .insert({
      id: fileId,
      agent_id: agentId,
      name: metadata.name,
      provider: 'supabase',
      object_key: storagePath,
      mime: file.type,
      checksum,
      size: file.size,
      tags: metadata.tags || [],
      created_by: user.id,
    })
    .select()
    .single()

  if (error) {
    // Try to clean up uploaded file if DB insert fails
    await supabase.storage.from('agent-knowledge').remove([storagePath])
    throw new Error(`Failed to save file metadata: ${error.message}`)
  }

  revalidatePath(`/app/agents/${agentId}/knowledge`)
  return data
}

export async function deleteKnowledgeFile(agentId: string, fileId: string) {
  const user = await requireAuth()
  const supabase = await createClient()

  // Verify ownership
  const { data: agent, error: checkError } = await supabase
    .from('agents')
    .select('owner_id')
    .eq('id', agentId)
    .single()

  if (checkError || !agent) {
    throw new Error('Agent not found')
  }

  if (agent.owner_id !== user.id) {
    throw new Error('Unauthorized')
  }

  // Get file metadata
  const { data: file, error: fileError } = await supabase
    .from('files')
    .select('object_key')
    .eq('id', fileId)
    .eq('agent_id', agentId)
    .single()

  if (fileError || !file) {
    throw new Error('File not found')
  }

  // Delete from storage
  const { error: storageError } = await supabase.storage
    .from('agent-knowledge')
    .remove([file.object_key])

  if (storageError) {
    throw new Error(`Failed to delete file from storage: ${storageError.message}`)
  }

  // Delete knowledge sources
  await supabase.from('knowledge_sources').delete().eq('file_id', fileId)

  // Delete file metadata
  const { error: deleteError } = await supabase.from('files').delete().eq('id', fileId)

  if (deleteError) {
    throw new Error(`Failed to delete file metadata: ${deleteError.message}`)
  }

  revalidatePath(`/app/agents/${agentId}/knowledge`)
}

export async function listKnowledgeFiles(agentId: string) {
  const user = await requireAuth()
  const supabase = await createClient()

  // Verify ownership
  const { data: agent, error: checkError } = await supabase
    .from('agents')
    .select('owner_id')
    .eq('id', agentId)
    .single()

  if (checkError || !agent) {
    throw new Error('Agent not found')
  }

  if (agent.owner_id !== user.id) {
    throw new Error('Unauthorized')
  }

  // Get files
  const { data, error } = await supabase
    .from('files')
    .select('*')
    .eq('agent_id', agentId)
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error(`Failed to list files: ${error.message}`)
  }

  return data || []
}

export async function getKnowledgeSource(agentId: string, fileId: string) {
  const user = await requireAuth()
  const supabase = await createClient()

  // Verify ownership
  const { data: agent, error: checkError } = await supabase
    .from('agents')
    .select('owner_id')
    .eq('id', agentId)
    .single()

  if (checkError || !agent) {
    throw new Error('Agent not found')
  }

  if (agent.owner_id !== user.id) {
    throw new Error('Unauthorized')
  }

  const { data, error } = await supabase
    .from('knowledge_sources')
    .select('*')
    .eq('agent_id', agentId)
    .eq('file_id', fileId)
    .single()

  if (error && error.code !== 'PGRST116') {
    throw new Error(`Failed to get knowledge source: ${error.message}`)
  }

  return data
}

export async function linkKnowledgeToSpecBlocks(
  agentId: string,
  fileId: string,
  specBlockTags: string[]
) {
  const user = await requireAuth()
  const supabase = await createClient()

  // Verify ownership
  const { data: agent, error: checkError } = await supabase
    .from('agents')
    .select('owner_id')
    .eq('id', agentId)
    .single()

  if (checkError || !agent) {
    throw new Error('Agent not found')
  }

  if (agent.owner_id !== user.id) {
    throw new Error('Unauthorized')
  }

  // Check if knowledge source exists
  const existing = await getKnowledgeSource(agentId, fileId)

  if (existing) {
    // Update existing
    const { data, error } = await supabase
      .from('knowledge_sources')
      .update({ spec_block_tags: specBlockTags })
      .eq('id', existing.id)
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to update knowledge source: ${error.message}`)
    }

    return data
  } else {
    // Create new
    const { data, error } = await supabase
      .from('knowledge_sources')
      .insert({
        agent_id: agentId,
        file_id: fileId,
        spec_block_tags: specBlockTags,
      })
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to create knowledge source: ${error.message}`)
    }

    return data
  }
}

