/**
 * Knowledge Types
 * Defines the structure for knowledge sources and maps
 */

export interface KnowledgeMap {
  files?: Array<{
    id: string
    name: string
    type: string
    summary?: string
    spec_blocks?: string[]
  }>
}

export interface KnowledgeSource {
  id: string
  agent_id: string
  file_id: string
  spec_block_tags: string[]
  created_at: string
}

export interface FileMetadata {
  id: string
  agent_id: string
  name: string
  provider: string
  object_key: string
  mime: string | null
  checksum: string | null
  size: number
  tags: string[]
  created_at: string
  created_by: string
}

