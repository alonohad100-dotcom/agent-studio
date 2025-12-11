'use server'

import { requireAuth } from '@/lib/auth'
import { getDraftSpec } from './drafts'
import { PromptCompiler } from '@core/compiler'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { CapabilitiesJSON } from '@core/types/capabilities'

export async function compileDraft(agentId: string) {
  const user = await requireAuth()

  const supabase = await createClient()

  // Verify ownership
  const { data: agent, error: checkError } = await supabase
    .from('agents')
    .select('owner_id')
    .eq('id', agentId)
    .single()

  if (checkError || !agent) {
    throw new Error('Agent not found')
  }

  if (agent.owner_id !== user.id) {
    throw new Error('Unauthorized')
  }

  // Get draft spec
  const spec = await getDraftSpec(agentId)
  if (!spec) {
    throw new Error('No draft specification found')
  }

  // Get draft capabilities
  const { data: draft } = await supabase
    .from('agent_drafts')
    .select('id, capabilities_json')
    .eq('agent_id', agentId)
    .single()

  const capabilities: CapabilitiesJSON = (draft?.capabilities_json as CapabilitiesJSON) || {
    information: { enabled: false },
    production: { enabled: false },
    decision_support: { enabled: false },
    automation: { enabled: false },
    domain_specific: { enabled: false, tags: [] },
  }

  // Get knowledge map
  const { data: files } = await supabase
    .from('files')
    .select('id, name, mime')
    .eq('agent_id', agentId)

  const { data: knowledgeSources } = await supabase
    .from('knowledge_sources')
    .select('file_id, spec_block_tags')
    .eq('agent_id', agentId)

  const knowledgeMap = files && files.length > 0
    ? {
        files: files.map((file) => ({
          id: file.id,
          name: file.name,
          type: file.mime || 'unknown',
          spec_blocks: knowledgeSources
            ?.filter((ks) => ks.file_id === file.id)
            .flatMap((ks) => ks.spec_block_tags || []) || [],
        })),
      }
    : undefined

  // Compile
  const compiler = new PromptCompiler()
  const result = await compiler.compile({
    spec,
    capabilities,
    knowledgeMap,
  })

  // Save prompt package to prompt_packages table
  if (!draft?.id) {
    throw new Error('Draft not found')
  }

  // Get or create prompt package record
  const { data: existingPackage } = await supabase
    .from('prompt_packages')
    .select('id')
    .eq('agent_draft_id', draft.id)
    .single()

  let packageId: string

  if (existingPackage?.id) {
    // Update existing package
    const { data: updatedPackage, error: updateError } = await supabase
      .from('prompt_packages')
      .update({
        package_json: result.promptPackage,
      })
      .eq('id', existingPackage.id)
      .select('id')
      .single()

    if (updateError) {
      throw new Error(`Failed to update prompt package: ${updateError.message}`)
    }

    packageId = updatedPackage.id
  } else {
    // Create new package
    const { data: newPackage, error: createError } = await supabase
      .from('prompt_packages')
      .insert({
        agent_draft_id: draft.id,
        package_json: result.promptPackage,
      })
      .select('id')
      .single()

    if (createError) {
      throw new Error(`Failed to create prompt package: ${createError.message}`)
    }

    packageId = newPackage.id
  }

  // Save lint findings
  if (result.lintFindings.length > 0) {
    // Delete old findings
    await supabase.from('prompt_lint_findings').delete().eq('prompt_package_id', packageId)

    // Insert new findings
    await supabase.from('prompt_lint_findings').insert(
      result.lintFindings.map((finding) => ({
        prompt_package_id: packageId,
        rule_id: finding.rule_id,
        severity: finding.severity,
        message: finding.message,
        block: finding.block,
        field: finding.field,
        suggestion: finding.suggestion,
      }))
    )
  }

  // Save quality score (check if table exists, if not skip for now)
  try {
    await supabase.from('quality_scores').upsert({
      prompt_package_id: packageId,
      overall_score: result.qualityScore.overall,
      spec_completeness: result.qualityScore.spec_completeness,
      instruction_clarity: result.qualityScore.instruction_clarity,
      safety_clarity: result.qualityScore.safety_clarity,
      output_contract_strength: result.qualityScore.output_contract_strength,
      test_coverage: result.qualityScore.test_coverage,
      computed_at: new Date().toISOString(),
    })
  } catch {
    // Quality scores table may not exist yet, skip for now
  }

  revalidatePath(`/app/agents/${agentId}/instructions`)
  revalidatePath(`/app/agents/${agentId}/overview`)

  return result
}

