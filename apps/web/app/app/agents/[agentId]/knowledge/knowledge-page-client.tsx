'use client'

import { useState } from 'react'
import { KnowledgeUploadZone } from '@/components/knowledge/KnowledgeUploadZone'
import { KnowledgeSourceList } from '@/components/knowledge/KnowledgeSourceList'
import { CoverageIndicator } from '@/components/knowledge/CoverageIndicator'
import { deleteKnowledgeFile } from '@/lib/actions/knowledge'
import { toast } from 'sonner'
import type { Database } from '@db/types'

type FileRow = Database['public']['Tables']['files']['Row']
type KnowledgeSource = Database['public']['Tables']['knowledge_sources']['Row']

interface KnowledgePageClientProps {
  agentId: string
  initialFiles: FileRow[]
  initialKnowledgeSources: KnowledgeSource[]
}

export function KnowledgePageClient({
  agentId,
  initialFiles,
  initialKnowledgeSources,
}: KnowledgePageClientProps) {
  const [files, setFiles] = useState<FileRow[]>(initialFiles)
  const [knowledgeSources, setKnowledgeSources] = useState<KnowledgeSource[]>(initialKnowledgeSources)

  const handleUploadComplete = async () => {
    // Refresh files list
    const response = await fetch(`/api/knowledge/list?agentId=${agentId}`)
    if (response.ok) {
      const updatedFiles = await response.json()
      setFiles(updatedFiles)
    }
  }

  const handleDelete = async (fileId: string) => {
    try {
      await deleteKnowledgeFile(agentId, fileId)
      setFiles((prev) => prev.filter((f) => f.id !== fileId))
      setKnowledgeSources((prev) => prev.filter((ks) => ks.file_id !== fileId))
      toast.success('File deleted successfully')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to delete file')
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <KnowledgeUploadZone agentId={agentId} onUploadComplete={handleUploadComplete} />
        <KnowledgeSourceList files={files} agentId={agentId} onDelete={handleDelete} />
      </div>

      <div className="space-y-6">
        <CoverageIndicator files={files} knowledgeSources={knowledgeSources} />
      </div>
    </div>
  )
}

