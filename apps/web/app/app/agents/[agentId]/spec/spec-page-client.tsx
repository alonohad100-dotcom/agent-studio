'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { SpecBlockForm } from '@/components/spec/SpecBlockForm'
import { SpecCompletenessMeter } from '@/components/spec/SpecCompletenessMeter'
import { SpecCoach } from '@/components/spec/SpecCoach'
import { MissionBlock } from '@/components/spec/blocks/MissionBlock'
import { AudienceBlock } from '@/components/spec/blocks/AudienceBlock'
import { ScopeBlock } from '@/components/spec/blocks/ScopeBlock'
import { IOContractsBlock } from '@/components/spec/blocks/IOContractsBlock'
import { ConstraintsBlock } from '@/components/spec/blocks/ConstraintsBlock'
import { SafetyBlock } from '@/components/spec/blocks/SafetyBlock'
import { ExamplesBlock } from '@/components/spec/blocks/ExamplesBlock'
import { MetadataBlock } from '@/components/spec/blocks/MetadataBlock'
import { SPEC_BLOCKS } from '@core/types/spec'
import type { SpecJSON } from '@core/types/spec'

interface SpecPageClientProps {
  agentId: string
  initialSpec: SpecJSON
}

export function SpecPageClient({ agentId, initialSpec }: SpecPageClientProps) {
  const [spec] = useState<SpecJSON>(initialSpec)

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2 space-y-6">
        <Card>
          <CardContent className="pt-6">
            <SpecBlockForm
              agentId={agentId}
              blockName="mission"
              title={SPEC_BLOCKS[0].title}
              description={SPEC_BLOCKS[0].description}
              required={SPEC_BLOCKS[0].required}
              initialValue={spec.mission}
            >
              {(form) => <MissionBlock form={form} />}
            </SpecBlockForm>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <SpecBlockForm
              agentId={agentId}
              blockName="audience"
              title={SPEC_BLOCKS[1].title}
              description={SPEC_BLOCKS[1].description}
              required={SPEC_BLOCKS[1].required}
              initialValue={spec.audience}
            >
              {(form) => <AudienceBlock form={form} />}
            </SpecBlockForm>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <SpecBlockForm
              agentId={agentId}
              blockName="scope"
              title={SPEC_BLOCKS[2].title}
              description={SPEC_BLOCKS[2].description}
              required={SPEC_BLOCKS[2].required}
              initialValue={spec.scope}
            >
              {(form) => <ScopeBlock form={form} />}
            </SpecBlockForm>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <SpecBlockForm
              agentId={agentId}
              blockName="io_contracts"
              title={SPEC_BLOCKS[3].title}
              description={SPEC_BLOCKS[3].description}
              required={SPEC_BLOCKS[3].required}
              initialValue={spec.io_contracts}
            >
              {(form) => <IOContractsBlock form={form} />}
            </SpecBlockForm>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <SpecBlockForm
              agentId={agentId}
              blockName="constraints"
              title={SPEC_BLOCKS[4].title}
              description={SPEC_BLOCKS[4].description}
              required={SPEC_BLOCKS[4].required}
              initialValue={spec.constraints}
            >
              {(form) => <ConstraintsBlock form={form} />}
            </SpecBlockForm>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <SpecBlockForm
              agentId={agentId}
              blockName="safety"
              title={SPEC_BLOCKS[5].title}
              description={SPEC_BLOCKS[5].description}
              required={SPEC_BLOCKS[5].required}
              initialValue={spec.safety}
            >
              {(form) => <SafetyBlock form={form} />}
            </SpecBlockForm>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <SpecBlockForm
              agentId={agentId}
              blockName="examples"
              title={SPEC_BLOCKS[6].title}
              description={SPEC_BLOCKS[6].description}
              required={SPEC_BLOCKS[6].required}
              initialValue={spec.examples}
            >
              {(form) => <ExamplesBlock form={form} />}
            </SpecBlockForm>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <SpecBlockForm
              agentId={agentId}
              blockName="metadata"
              title={SPEC_BLOCKS[7].title}
              description={SPEC_BLOCKS[7].description}
              required={SPEC_BLOCKS[7].required}
              initialValue={spec.metadata}
            >
              {(form) => <MetadataBlock form={form} />}
            </SpecBlockForm>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <SpecCompletenessMeter spec={spec} />
        <SpecCoach agentId={agentId} />
      </div>
    </div>
  )
}

