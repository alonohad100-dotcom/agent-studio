'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PromptLayerTabs } from '@/components/prompts/PromptLayerTabs'
import { Badge } from '@/components/ui/badge'
import type { AgentVersion } from '@core/types/version'

interface VersionDetailClientProps {
  version: AgentVersion
  allVersions: AgentVersion[]
  agentId: string
}

export function VersionDetailClient({ version, allVersions, agentId }: VersionDetailClientProps) {
  const [compareVersionId, setCompareVersionId] = useState<string | null>(null)

  const compareVersion = compareVersionId
    ? allVersions.find((v) => v.id === compareVersionId)
    : null

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Quality Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{version.quality_score}</div>
            <p className="text-sm text-muted-foreground mt-1">
              {version.quality_score >= 70 ? 'Meets threshold' : 'Below threshold'}
            </p>
          </CardContent>
        </Card>

        {version.test_pass_rate !== null && version.test_pass_rate !== undefined && (
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Test Pass Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{version.test_pass_rate.toFixed(1)}%</div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Knowledge Files</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {version.knowledge_map?.files?.length || 0}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Compare with Another Version</CardTitle>
          <CardDescription>Select a version to compare changes</CardDescription>
        </CardHeader>
        <CardContent>
          <Select
            value={compareVersionId || ''}
            onValueChange={(value) => setCompareVersionId(value || null)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select version to compare" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">None</SelectItem>
              {allVersions
                .filter((v) => v.id !== version.id)
                .map((v) => (
                  <SelectItem key={v.id} value={v.id}>
                    Version {v.version_number}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>

          {compareVersion && (
            <div className="mt-4 space-y-2">
              <div className="flex items-center gap-4">
                <div>
                  <span className="text-sm font-medium">Quality Score:</span>
                  <span className="ml-2">
                    {compareVersion.quality_score} → {version.quality_score}
                    {version.quality_score - compareVersion.quality_score > 0 ? (
                      <Badge variant="default" className="ml-2">
                        +{version.quality_score - compareVersion.quality_score}
                      </Badge>
                    ) : version.quality_score - compareVersion.quality_score < 0 ? (
                      <Badge variant="destructive" className="ml-2">
                        {version.quality_score - compareVersion.quality_score}
                      </Badge>
                    ) : null}
                  </span>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Tabs defaultValue="prompt" className="w-full">
        <TabsList>
          <TabsTrigger value="prompt">Prompt Package</TabsTrigger>
          <TabsTrigger value="spec">Specification</TabsTrigger>
          <TabsTrigger value="capabilities">Capabilities</TabsTrigger>
        </TabsList>

        <TabsContent value="prompt" className="mt-4">
          <PromptLayerTabs promptPackage={version.prompt_package} />
        </TabsContent>

        <TabsContent value="spec" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Specification Snapshot</CardTitle>
              <CardDescription>
                This is the specification as it was when this version was published
              </CardDescription>
            </CardHeader>
            <CardContent>
              <pre className="text-sm bg-muted p-4 rounded-lg overflow-auto max-h-[600px]">
                {JSON.stringify(version.spec_snapshot, null, 2)}
              </pre>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="capabilities" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Capabilities</CardTitle>
              <CardDescription>
                Capabilities enabled when this version was published
              </CardDescription>
            </CardHeader>
            <CardContent>
              <pre className="text-sm bg-muted p-4 rounded-lg overflow-auto">
                {JSON.stringify(version.capabilities, null, 2)}
              </pre>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

