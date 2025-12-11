'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Loader2, Download } from 'lucide-react'
import type { Database } from '@db/types'

type FileRow = Database['public']['Tables']['files']['Row']

interface FilePreviewModalProps {
  file: FileRow
  agentId: string
  onClose: () => void
}

export function FilePreviewModal({ file, agentId, onClose }: FilePreviewModalProps) {
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDownloadUrl = async () => {
      try {
        const response = await fetch('/api/storage/signed-download', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ agentId, fileId: file.id }),
        })

        if (!response.ok) {
          throw new Error('Failed to get download URL')
        }

        const data = await response.json()
        setDownloadUrl(data.url)
      } catch (error) {
        console.error('Failed to fetch download URL:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchDownloadUrl()
  }, [agentId, file.id])

  const isTextFile = file.mime?.startsWith('text/') || file.mime === 'application/json'
  const isImage = file.mime?.startsWith('image/')

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>{file.name}</DialogTitle>
          <DialogDescription>
            {file.mime} • {(file.size / 1024).toFixed(1)} KB
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : downloadUrl ? (
            <div className="space-y-4">
              {isImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={downloadUrl} alt={file.name} className="max-w-full max-h-[60vh] mx-auto" />
              ) : isTextFile ? (
                <iframe
                  src={downloadUrl}
                  className="w-full h-[60vh] border rounded"
                  title={file.name}
                />
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground mb-4">Preview not available for this file type</p>
                  <Button asChild>
                    <a href={downloadUrl} download={file.name}>
                      <Download className="mr-2 h-4 w-4" />
                      Download File
                    </a>
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Failed to load file preview</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

