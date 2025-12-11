'use client'

import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Upload, File, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

interface KnowledgeUploadZoneProps {
  agentId: string
  onUploadComplete?: () => void
}

export function KnowledgeUploadZone({ agentId, onUploadComplete }: KnowledgeUploadZoneProps) {
  const [uploading, setUploading] = useState(false)
  const [_uploadProgress, setUploadProgress] = useState<Record<string, number>>({})

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      setUploading(true)

      for (const file of acceptedFiles) {
        try {
          setUploadProgress((prev) => ({ ...prev, [file.name]: 0 }))

          // Create FormData
          const formData = new FormData()
          formData.append('file', file)
          formData.append('agentId', agentId)
          formData.append('name', file.name)
          formData.append('tags', JSON.stringify([]))

          // Upload file
          const response = await fetch('/api/knowledge/upload', {
            method: 'POST',
            body: formData,
          })

          if (!response.ok) {
            const error = await response.json()
            throw new Error(error.error || 'Upload failed')
          }

          setUploadProgress((prev) => ({ ...prev, [file.name]: 100 }))
          toast.success(`Uploaded ${file.name}`)
        } catch (error) {
          toast.error(`Failed to upload ${file.name}: ${error instanceof Error ? error.message : 'Unknown error'}`)
        } finally {
          setTimeout(() => {
            setUploadProgress((prev) => {
              const next = { ...prev }
              delete next[file.name]
              return next
            })
          }, 1000)
        }
      }

      setUploading(false)
      onUploadComplete?.()
    },
    [agentId, onUploadComplete]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    disabled: uploading,
    maxSize: 50 * 1024 * 1024, // 50MB
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Knowledge Files</CardTitle>
        <CardDescription>Add files to enhance your agent&apos;s knowledge base</CardDescription>
      </CardHeader>
      <CardContent>
        <div
          {...getRootProps()}
          className={`
            border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
            ${isDragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'}
            ${uploading ? 'opacity-50 cursor-not-allowed' : 'hover:border-primary/50'}
          `}
        >
          <input {...getInputProps()} />
          {uploading ? (
            <div className="space-y-2">
              <Loader2 className="h-8 w-8 mx-auto animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Uploading files...</p>
            </div>
          ) : (
            <div className="space-y-2">
              <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
              <p className="text-sm font-medium">
                {isDragActive ? 'Drop files here' : 'Drag & drop files here, or click to select'}
              </p>
              <p className="text-xs text-muted-foreground">Maximum file size: 50MB</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

