'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PromptReadView } from './PromptReadView'
import type { PromptPackageJSON } from '@core/types/prompt'

interface PromptLayerTabsProps {
  promptPackage: PromptPackageJSON
}

export function PromptLayerTabs({ promptPackage }: PromptLayerTabsProps) {
  return (
    <Tabs defaultValue="system_backbone" className="w-full">
      <TabsList className="grid w-full grid-cols-5">
        <TabsTrigger value="system_backbone">System</TabsTrigger>
        <TabsTrigger value="domain_manual">Domain</TabsTrigger>
        <TabsTrigger value="output_contracts">Outputs</TabsTrigger>
        <TabsTrigger value="tool_policy">Tools</TabsTrigger>
        <TabsTrigger value="examples">Examples</TabsTrigger>
      </TabsList>

      <TabsContent value="system_backbone" className="mt-4">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">System Backbone</h3>
          <p className="text-sm text-muted-foreground">
            Core mission, audience, and fundamental instructions
          </p>
          <PromptReadView content={promptPackage.system_backbone} />
        </div>
      </TabsContent>

      <TabsContent value="domain_manual" className="mt-4">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Domain Manual</h3>
          <p className="text-sm text-muted-foreground">
            Scope, constraints, and domain-specific context
          </p>
          <PromptReadView content={promptPackage.domain_manual} />
        </div>
      </TabsContent>

      <TabsContent value="output_contracts" className="mt-4">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Output Contracts</h3>
          <p className="text-sm text-muted-foreground">
            Input/output specifications and format requirements
          </p>
          <PromptReadView content={promptPackage.output_contracts} />
        </div>
      </TabsContent>

      <TabsContent value="tool_policy" className="mt-4">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Tool Policy</h3>
          <p className="text-sm text-muted-foreground">
            Available tools and their usage policies
          </p>
          <PromptReadView content={promptPackage.tool_policy} />
        </div>
      </TabsContent>

      <TabsContent value="examples" className="mt-4">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Examples</h3>
          <p className="text-sm text-muted-foreground">
            Good and bad examples for guidance
          </p>
          <PromptReadView content={promptPackage.examples} />
        </div>
      </TabsContent>
    </Tabs>
  )
}

