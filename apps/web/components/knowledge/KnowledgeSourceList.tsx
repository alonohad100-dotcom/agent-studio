'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { File, Trash2, Eye, Tag } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import type { Database } from '@db/types'
import { FilePreviewModal } from './FilePreviewModal'

type FileRow = Database['public']['Tables']['files']['Row']

interface KnowledgeSourceListProps {
  files: FileRow[]
  agentId: string
  onDelete: (fileId: string) => void
}

export function KnowledgeSourceList({ files, agentId, onDelete }: KnowledgeSourceListProps) {
  const [previewFile, setPreviewFile] = useState<FileRow | null>(null)

  if (files.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Knowledge Sources</CardTitle>
          <CardDescription>Files uploaded to enhance your agent</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-8">
            No files uploaded yet. Upload files to add knowledge to your agent.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Knowledge Sources</CardTitle>
          <CardDescription>{files.length} file{files.length !== 1 ? 's' : ''} uploaded</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {files.map((file) => (
              <div
                key={file.id}
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent transition-colors"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <File className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{file.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(file.created_at), { addSuffix: true })}
                      </p>
                      <span className="text-xs text-muted-foreground">•</span>
                      <p className="text-xs text-muted-foreground">
                        {(file.size / 1024).toFixed(1)} KB
                      </p>
                      {file.tags && file.tags.length > 0 && (
                        <>
                          <span className="text-xs text-muted-foreground">•</span>
                          <div className="flex items-center gap-1">
                            <Tag className="h-3 w-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">{file.tags.length} tag{file.tags.length !== 1 ? 's' : ''}</span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setPreviewFile(file)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      if (confirm('Are you sure you want to delete this file?')) {
                        onDelete(file.id)
                      }
                    }}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {previewFile && (
        <FilePreviewModal file={previewFile} agentId={agentId} onClose={() => setPreviewFile(null)} />
      )}
    </>
  )
}

