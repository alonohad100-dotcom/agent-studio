'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar, CheckCircle2, XCircle, TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import Link from 'next/link'
import type { AgentVersion } from '@core/types/version'

interface VersionCardProps {
  version: AgentVersion
  previousVersion?: AgentVersion
  agentId: string
}

export function VersionCard({ version, previousVersion, agentId }: VersionCardProps) {
  const scoreDelta = previousVersion
    ? version.quality_score - previousVersion.quality_score
    : null

  const testRateDelta = previousVersion && version.test_pass_rate && previousVersion.test_pass_rate
    ? version.test_pass_rate - previousVersion.test_pass_rate
    : null

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              Version {version.version_number}
              {version.version_number === 1 && (
                <Badge variant="secondary">Initial</Badge>
              )}
            </CardTitle>
            <CardDescription className="flex items-center gap-2 mt-1">
              <Calendar className="h-3 w-3" />
              {formatDistanceToNow(new Date(version.created_at), { addSuffix: true })}
            </CardDescription>
          </div>
          <Link href={`/app/agents/${agentId}/versions/${version.id}`}>
            <Button variant="outline" size="sm">
              View Details
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Quality Score</p>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold">{version.quality_score}</span>
              {scoreDelta !== null && (
                <div className="flex items-center gap-1">
                  {scoreDelta > 0 ? (
                    <TrendingUp className="h-4 w-4 text-success" />
                  ) : scoreDelta < 0 ? (
                    <TrendingDown className="h-4 w-4 text-destructive" />
                  ) : (
                    <Minus className="h-4 w-4 text-muted-foreground" />
                  )}
                  <span className={`text-sm ${scoreDelta > 0 ? 'text-success' : scoreDelta < 0 ? 'text-destructive' : 'text-muted-foreground'}`}>
                    {scoreDelta > 0 ? '+' : ''}{scoreDelta}
                  </span>
                </div>
              )}
            </div>
          </div>
          {version.test_pass_rate !== null && version.test_pass_rate !== undefined && (
            <div>
              <p className="text-sm text-muted-foreground mb-1">Test Pass Rate</p>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold">{version.test_pass_rate.toFixed(1)}%</span>
                {testRateDelta !== null && testRateDelta !== undefined && (
                  <div className="flex items-center gap-1">
                    {testRateDelta > 0 ? (
                      <TrendingUp className="h-4 w-4 text-success" />
                    ) : testRateDelta < 0 ? (
                      <TrendingDown className="h-4 w-4 text-destructive" />
                    ) : (
                      <Minus className="h-4 w-4 text-muted-foreground" />
                    )}
                    <span className={`text-sm ${testRateDelta > 0 ? 'text-success' : testRateDelta < 0 ? 'text-destructive' : 'text-muted-foreground'}`}>
                      {testRateDelta > 0 ? '+' : ''}{testRateDelta.toFixed(1)}%
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-4 pt-2 border-t">
          <div className="flex items-center gap-1">
            {version.quality_score >= 70 ? (
              <CheckCircle2 className="h-4 w-4 text-success" />
            ) : (
              <XCircle className="h-4 w-4 text-destructive" />
            )}
            <span className="text-sm text-muted-foreground">
              {version.quality_score >= 70 ? 'Meets threshold' : 'Below threshold'}
            </span>
          </div>
          {version.knowledge_map && version.knowledge_map.files && version.knowledge_map.files.length > 0 && (
            <div className="text-sm text-muted-foreground">
              {version.knowledge_map.files.length} knowledge file{version.knowledge_map.files.length !== 1 ? 's' : ''}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

