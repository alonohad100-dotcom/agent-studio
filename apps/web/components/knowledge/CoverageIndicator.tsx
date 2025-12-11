'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle2, Circle } from 'lucide-react'
import type { Database } from '@db/types'

type KnowledgeSource = Database['public']['Tables']['knowledge_sources']['Row']
type FileRow = Database['public']['Tables']['files']['Row']

interface CoverageIndicatorProps {
  files: FileRow[]
  knowledgeSources: KnowledgeSource[]
}

const SPEC_BLOCKS = [
  'mission',
  'audience',
  'scope',
  'io_contracts',
  'constraints',
  'safety',
  'examples',
  'metadata',
]

export function CoverageIndicator({ files, knowledgeSources }: CoverageIndicatorProps) {
  const blockCoverage = SPEC_BLOCKS.map((block) => {
    const sources = knowledgeSources.filter((ks) => ks.spec_block_tags?.includes(block))
    return {
      block,
      count: sources.length,
      hasCoverage: sources.length > 0,
    }
  })

  const totalCoverage = blockCoverage.filter((bc) => bc.hasCoverage).length
  const coveragePercentage = Math.round((totalCoverage / SPEC_BLOCKS.length) * 100)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Knowledge Coverage</CardTitle>
        <CardDescription>Files linked to spec blocks</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Overall Coverage</span>
            <Badge variant={coveragePercentage >= 50 ? 'default' : 'secondary'}>
              {coveragePercentage}%
            </Badge>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {blockCoverage.map(({ block, count, hasCoverage }) => (
              <div
                key={block}
                className="flex items-center gap-2 p-2 rounded border text-sm"
              >
                {hasCoverage ? (
                  <CheckCircle2 className="h-4 w-4 text-success" />
                ) : (
                  <Circle className="h-4 w-4 text-muted-foreground" />
                )}
                <span className="capitalize flex-1">{block.replace('_', ' ')}</span>
                {count > 0 && <Badge variant="outline">{count}</Badge>}
              </div>
            ))}
          </div>
        </div>

        {files.length === 0 && (
          <p className="text-xs text-muted-foreground text-center py-2">
            Upload files and link them to spec blocks to improve coverage
          </p>
        )}
      </CardContent>
    </Card>
  )
}

