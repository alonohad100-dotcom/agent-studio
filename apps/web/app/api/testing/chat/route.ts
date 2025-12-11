import { requireAuth } from '@/lib/auth'
import { PromptCompiler } from '@core/compiler'
import { getDraftSpec } from '@/lib/actions/drafts'
import { createClient } from '@/lib/supabase/server'
import { createAIProvider } from '@core/ai'
import { NextResponse } from 'next/server'
import type { CapabilitiesJSON } from '@core/types/capabilities'

export async function POST(req: Request) {
  try {
    await requireAuth()
    const { agentId, messages } = await req.json()

    if (!agentId || !messages) {
      return NextResponse.json({ error: 'Missing agentId or messages' }, { status: 400 })
    }

    // Get prompt package (compile from draft)
    const spec = await getDraftSpec(agentId)
    if (!spec) {
      return NextResponse.json({ error: 'No draft specification found' }, { status: 400 })
    }

    const supabase = await createClient()
    const { data: draft } = await supabase
      .from('agent_drafts')
      .select('capabilities_json')
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

    const compiler = new PromptCompiler()
    const compiled = await compiler.compile({
      spec,
      capabilities,
      knowledgeMap,
    })

    // Build prompt
    const systemPrompt = `${compiled.promptPackage.system_backbone}

${compiled.promptPackage.domain_manual}

${compiled.promptPackage.output_contracts}

${compiled.promptPackage.tool_policy}

${compiled.promptPackage.examples}`

    const conversation = messages
      .map((msg: { role: string; content: string }) => {
        if (msg.role === 'user') {
          return `User: ${msg.content}`
        } else {
          return `Assistant: ${msg.content}`
        }
      })
      .join('\n\n')

    const fullPrompt = `${systemPrompt}

---

Conversation:
${conversation}

Assistant:`

    // Get AI response
    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: 'OPENAI_API_KEY not configured' }, { status: 500 })
    }

    const provider = createAIProvider(apiKey)
    const response = await provider.generateText(fullPrompt, {
      temperature: 0.7,
      maxTokens: 2000,
    })

    return NextResponse.json({ response })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}

