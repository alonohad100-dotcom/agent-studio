'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Download, FileJson, Package } from 'lucide-react'

interface ExportCardProps {
  title: string
  description: string
  fileName: string
  content: string
  onDownload: () => void
}

export function ExportCard({ title, description, fileName, content, onDownload }: ExportCardProps) {
  const handleDownload = () => {
    const blob = new Blob([content], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = fileName
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    onDownload()
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <FileJson className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle>{title}</CardTitle>
              <CardDescription>{description}</CardDescription>
            </div>
          </div>
          <Button onClick={handleDownload} variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="bg-muted rounded-lg p-4 max-h-48 overflow-auto">
          <pre className="text-xs font-mono">{content.substring(0, 500)}...</pre>
        </div>
      </CardContent>
    </Card>
  )
}

