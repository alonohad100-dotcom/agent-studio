# Agent Studio - Comprehensive Implementation Plan

**Version:** 1.0  
**Date:** 2025-12-10  
**Status:** Initial Development Plan  
**Target:** V1 Production-Grade MVP

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Prerequisites & Setup](#prerequisites--setup)
3. [Development Phases](#development-phases)
4. [Technical Architecture Details](#technical-architecture-details)
5. [Quality Gates & Definition of Done](#quality-gates--definition-of-done)
6. [Risk Management](#risk-management)
7. [Timeline & Resource Estimates](#timeline--resource-estimates)
8. [Appendix: Detailed Task Breakdowns](#appendix-detailed-task-breakdowns)

---

## Executive Summary

This implementation plan provides a comprehensive, phase-by-phase roadmap for building Agent Studio, a specification-driven web platform that compiles user requirements into high-quality AI agent prompt packages.

### Core Principles
- **Spec-first development**: All features must align with the technical specification
- **No mock data**: All user-visible flows use real persistence and storage
- **Real infrastructure**: Supabase (DB + Auth + Storage) from day one
- **Quality gates**: E2E tests, linting, and scoring at every phase
- **Mobile-first**: Responsive design validated for all pages

### Success Metrics
- All 26 routes functional with real data
- E2E test coverage >80% for critical paths
- Mobile layouts validated on iOS/Android
- Zero mock data in production flows
- Publish creates immutable versions
- Export generates valid JSON artifacts

---

## Prerequisites & Setup

### 2.1 Development Environment

#### Required Tools
- Node.js 18+ (LTS recommended)
- pnpm 8+ (or npm 9+)
- Git
- VS Code with Cursor extension
- Docker Desktop (for local Supabase)

#### Recommended VS Code Extensions
- ESLint
- Prettier
- Tailwind CSS IntelliSense
- TypeScript and JavaScript Language Features
- Prisma (if using Prisma client)

### 2.2 Infrastructure Setup

#### Supabase Project
1. Create new Supabase project
2. Enable Email Auth (Magic Links)
3. Configure Storage buckets:
   - `agent-knowledge` (private, RLS enabled)
   - `agent-exports` (private, RLS enabled)
4. Set up RLS policies (see Section 13.4)
5. Generate TypeScript types: `supabase gen types typescript`

#### Environment Variables
```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# AI Provider (initial: OpenAI)
OPENAI_API_KEY=your-openai-key
AI_PROVIDER=openai

# App Config
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development

# Optional: Sentry
SENTRY_DSN=your-sentry-dsn
```

### 2.3 Workspace Structure

```
Agent/
├── apps/
│   └── web/                    # Next.js 14+ App Router
│       ├── app/                # App router pages
│       ├── components/         # Page-specific components
│       ├── lib/               # Utilities, server actions
│       ├── middleware.ts      # Auth guards
│       └── package.json
├── packages/
│   ├── ui/                    # Shared UI components (shadcn/ui)
│   │   ├── components/
│   │   ├── lib/
│   │   └── package.json
│   ├── core/                  # Business logic, compiler
│   │   ├── compiler/
│   │   ├── lint/
│   │   ├── scoring/
│   │   └── package.json
│   └── db/                    # Database client, types
│       ├── schema.sql
│       ├── migrations/
│       ├── types.ts           # Generated Supabase types
│       └── package.json
├── tests/
│   ├── e2e/                   # Playwright tests
│   └── unit/                  # Vitest tests
├── .github/
│   └── workflows/
├── package.json               # Root workspace config
└── README.md
```

### 2.4 Initial Dependencies

#### Root package.json (Workspace)
```json
{
  "name": "agent-studio",
  "private": true,
  "workspaces": ["apps/*", "packages/*"],
  "scripts": {
    "dev": "pnpm --filter web dev",
    "build": "pnpm --filter web build",
    "test": "pnpm --filter web test",
    "test:e2e": "playwright test",
    "lint": "pnpm -r lint",
    "type-check": "pnpm -r type-check"
  }
}
```

#### apps/web/package.json (Core dependencies)
```json
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "@supabase/supabase-js": "^2.38.0",
    "@supabase/ssr": "^0.0.10",
    "zod": "^3.22.0",
    "react-hook-form": "^7.48.0",
    "@hookform/resolvers": "^3.3.0",
    "tailwindcss": "^3.3.0",
    "framer-motion": "^10.16.0",
    "lucide-react": "^0.292.0",
    "next-themes": "^0.2.1",
    "@monaco-editor/react": "^4.6.0",
    "date-fns": "^2.30.0"
  },
  "devDependencies": {
    "typescript": "^5.2.0",
    "@types/node": "^20.8.0",
    "@types/react": "^18.2.0",
    "eslint": "^8.51.0",
    "prettier": "^3.0.0",
    "vitest": "^0.34.0",
    "@playwright/test": "^1.40.0",
    "@sentry/nextjs": "^7.77.0"
  }
}
```

---

## Development Phases

### Phase 1: Foundation & Infrastructure (Weeks 1-2)

**Objective:** Establish core infrastructure, authentication, and basic app shell.

#### 1.1 Project Setup & Tooling

**Tasks:**
- [ ] Initialize monorepo workspace (pnpm workspaces)
- [ ] Set up Next.js 14 App Router in `apps/web`
- [ ] Configure TypeScript with strict mode
- [ ] Set up ESLint + Prettier
- [ ] Configure Tailwind CSS with design tokens
- [ ] Set up shadcn/ui component library
- [ ] Configure path aliases (`@/components`, `@/lib`, etc.)
- [ ] Set up Git hooks (husky + lint-staged)

**Deliverables:**
- Working dev server (`pnpm dev`)
- Linting and formatting on commit
- Design system tokens configured
- shadcn/ui components accessible

**Acceptance Criteria:**
- ✅ `pnpm dev` starts without errors
- ✅ TypeScript compiles with zero errors
- ✅ ESLint passes on all files
- ✅ Tailwind classes work correctly

**Estimated Effort:** 2-3 days

---

#### 1.2 Database Schema & Migrations

**Tasks:**
- [ ] Design complete database schema (expand Section 13)
- [ ] Create Supabase migration files
- [ ] Define all tables with columns, types, constraints:
  - `users` (extends Supabase auth.users)
  - `agents`
  - `agent_drafts`
  - `agent_versions`
  - `agent_spec_snapshots`
  - `prompt_packages`
  - `prompt_lint_findings`
  - `quality_scores`
  - `knowledge_sources`
  - `files`
  - `test_cases`
  - `test_runs`
  - `audit_logs`
- [ ] Set up foreign key relationships
- [ ] Create indexes (Section 13.3)
- [ ] Implement RLS policies (Section 13.4)
- [ ] Generate TypeScript types from schema
- [ ] Create database client wrapper in `packages/db`

**Database Schema Details:**

```sql
-- Example: agents table
CREATE TABLE agents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT agents_owner_fkey FOREIGN KEY (owner_id) REFERENCES auth.users(id)
);

-- RLS Policy
ALTER TABLE agents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own agents"
  ON agents FOR SELECT
  USING (auth.uid() = owner_id);

CREATE POLICY "Users can insert own agents"
  ON agents FOR INSERT
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can update own agents"
  ON agents FOR UPDATE
  USING (auth.uid() = owner_id);

-- Indexes
CREATE INDEX idx_agents_owner_updated ON agents(owner_id, updated_at DESC);
```

**Deliverables:**
- Complete SQL schema file
- Migration scripts
- TypeScript types generated
- RLS policies tested
- Database client package (`packages/db`)

**Acceptance Criteria:**
- ✅ All tables created successfully
- ✅ RLS policies prevent unauthorized access
- ✅ Foreign keys enforce referential integrity
- ✅ Indexes improve query performance
- ✅ TypeScript types match schema

**Estimated Effort:** 3-4 days

---

#### 1.3 Authentication System

**Tasks:**
- [ ] Set up Supabase Auth client (server + client)
- [ ] Implement email magic link flow
- [ ] Create auth middleware (`middleware.ts`)
- [ ] Build sign-in page (`/auth/sign-in`)
- [ ] Build callback handler (`/auth/callback`)
- [ ] Create auth utilities (`lib/auth.ts`):
  - `getServerSession()`
  - `requireAuth()` helper
  - `getUser()` helper
- [ ] Implement session refresh logic
- [ ] Add auth error handling

**Deliverables:**
- Working sign-in flow
- Protected route middleware
- Session management utilities
- Sign-in page UI

**Acceptance Criteria:**
- ✅ Users can sign in with email magic link
- ✅ Protected routes redirect to sign-in
- ✅ Session persists across page reloads
- ✅ Unauthorized access returns 404 (not 401/403)

**Estimated Effort:** 2-3 days

---

#### 1.4 App Shell & Navigation

**Tasks:**
- [ ] Create `AppShell` component (Section 5.1)
- [ ] Build `SidebarNav` component
- [ ] Build `TopBar` component with:
  - Search placeholder
  - Command palette trigger
  - User menu
- [ ] Implement responsive layout:
  - Desktop: sidebar + top bar
  - Mobile: hamburger menu + drawer
- [ ] Create global layout wrapper (`app/layout.tsx`)
- [ ] Set up theme provider (next-themes)
- [ ] Implement dark/light mode toggle
- [ ] Add loading states (skeleton components)

**Components to Build:**
- `components/layout/AppShell.tsx`
- `components/layout/SidebarNav.tsx`
- `components/layout/TopBar.tsx`
- `components/layout/MobileDrawer.tsx`
- `components/ui/skeleton.tsx` (shadcn)

**Deliverables:**
- Responsive app shell
- Navigation working on desktop and mobile
- Theme switching functional
- Loading states implemented

**Acceptance Criteria:**
- ✅ Desktop layout: sidebar + top bar + content
- ✅ Mobile layout: hamburger + drawer
- ✅ Navigation highlights active route
- ✅ Theme persists across sessions
- ✅ All breakpoints tested (mobile, tablet, desktop)

**Estimated Effort:** 3-4 days

---

#### 1.5 Shared UI Components (Foundation)

**Tasks:**
- [ ] Install and configure shadcn/ui
- [ ] Create base components:
  - `Button`, `Input`, `Textarea`, `Select`
  - `Card`, `Dialog`, `DropdownMenu`
  - `Tabs`, `Badge`, `Alert`
  - `Toast` (sonner or shadcn toast)
- [ ] Create custom components:
  - `Breadcrumbs`
  - `StatusPill`
  - `EmptyState`
  - `AutosaveIndicator`
- [ ] Set up design tokens in Tailwind config
- [ ] Create component documentation (Storybook optional)

**Deliverables:**
- Complete UI component library
- Design system tokens
- Component examples

**Acceptance Criteria:**
- ✅ All shadcn/ui primitives accessible
- ✅ Custom components match design spec
- ✅ Components support dark/light themes
- ✅ Components are accessible (keyboard nav, ARIA)

**Estimated Effort:** 2-3 days

---

**Phase 1 Total Estimated Effort:** 12-17 days (2.5-3.5 weeks)

**Phase 1 Definition of Done:**
- ✅ Database schema deployed to Supabase
- ✅ Authentication flow working end-to-end
- ✅ App shell renders on all devices
- ✅ Navigation between routes works
- ✅ No TypeScript errors
- ✅ All linting passes

---

### Phase 2: Agent Management & Spec System (Weeks 3-5)

**Objective:** Enable users to create agents, manage drafts, and edit specifications.

#### 2.1 Agent CRUD Operations

**Tasks:**
- [ ] Create Server Actions:
  - `createAgent(name, description)`
  - `updateAgentMeta(agentId, updates)`
  - `deleteAgent(agentId)`
  - `getAgent(agentId)` with ownership check
  - `listAgents(userId, filters)`
- [ ] Build agents list page (`/app/agents`)
  - Search functionality
  - Status filters
  - Grid/List toggle
  - Empty state
- [ ] Build agent creation flow (`/app/agents/new`)
  - Form with validation (Zod)
  - Success redirect to overview
- [ ] Build agent overview page (`/app/agents/[agentId]/overview`)
  - Agent metadata display
  - Status indicators
  - Quick actions
  - Empty state for new agents

**Server Action Example:**
```typescript
// app/lib/actions/agents.ts
'use server'

import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'

const createAgentSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
})

export async function createAgent(input: z.infer<typeof createAgentSchema>) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) throw new Error('Unauthorized')
  
  const validated = createAgentSchema.parse(input)
  
  const { data, error } = await supabase
    .from('agents')
    .insert({
      owner_id: user.id,
      name: validated.name,
      description: validated.description,
    })
    .select()
    .single()
  
  if (error) throw error
  
  // Create initial draft
  await supabase.from('agent_drafts').insert({
    agent_id: data.id,
    spec_json: {},
    capabilities_json: {},
  })
  
  return data
}
```

**Deliverables:**
- Agent CRUD operations functional
- Agents list page with search/filter
- Agent creation flow
- Agent overview page

**Acceptance Criteria:**
- ✅ Users can create agents
- ✅ Agents list shows only user's agents (RLS)
- ✅ Search filters agents correctly
- ✅ Agent overview displays correct data
- ✅ All operations use real database (no mocks)

**Estimated Effort:** 4-5 days

---

#### 2.2 Spec System Foundation

**Tasks:**
- [ ] Create spec schema types (from Section 9.1)
- [ ] Build `SpecBlockForm` component
- [ ] Create spec block components:
  - `SpecBlockHeader`
  - `SpecBlockForm` (reusable for all 8 blocks)
- [ ] Implement spec page layout (`/app/agents/[agentId]/spec`)
  - Form sections for each block
  - Side panel for "Spec Coach" (placeholder initially)
  - Completeness meter
- [ ] Create Server Actions:
  - `saveDraftSpec(agentId, specJson)`
  - `getDraftSpec(agentId)`
- [ ] Implement autosave (debounced, optimistic UI)
- [ ] Add `AutosaveIndicator` component

**Spec Schema Types:**
```typescript
// packages/core/types/spec.ts
export interface SpecJSON {
  mission: {
    problem: string
    success_criteria: string[]
    non_goals: string[]
  }
  audience: {
    persona: string
    skill_level: string
    language: string
    tone: string
  }
  scope: {
    must_do: string[]
    should_do: string[]
    nice_to_have: string[]
    out_of_scope: string[]
  }
  io_contracts: {
    inputs: Array<{
      name: string
      format: string
      constraints: string[]
    }>
    outputs: {
      format: string
      sections: string[]
      style_rules: string[]
    }
  }
  constraints: {
    length: string
    citation_policy: string
    verification: string
  }
  safety: {
    refusals: string[]
    sensitive_topics: string[]
  }
  examples: {
    good: string[]
    bad: string[]
  }
  metadata: {
    domain_tags: string[]
    template_id: string | null
  }
}
```

**Autosave Implementation:**
```typescript
// Use react-hook-form with debounced submission
import { useForm } from 'react-hook-form'
import { useDebouncedCallback } from 'use-debounce'

export function SpecBlockForm({ agentId, blockName, initialValue }) {
  const form = useForm({ defaultValues: initialValue })
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle')
  
  const debouncedSave = useDebouncedCallback(async (data) => {
    setSaveStatus('saving')
    await saveDraftSpec(agentId, { [blockName]: data })
    setSaveStatus('saved')
    setTimeout(() => setSaveStatus('idle'), 2000)
  }, 1000)
  
  useEffect(() => {
    const subscription = form.watch((data) => {
      debouncedSave(data)
    })
    return () => subscription.unsubscribe()
  }, [form.watch, debouncedSave])
  
  return (
    <form>
      {/* form fields */}
      <AutosaveIndicator status={saveStatus} />
    </form>
  )
}
```

**Deliverables:**
- Spec schema types defined
- Spec page UI complete
- Autosave functional
- Spec data persists to database

**Acceptance Criteria:**
- ✅ All 8 spec blocks have forms
- ✅ Autosave triggers after 1s of inactivity
- ✅ Data persists to `agent_drafts.spec_json`
- ✅ Completeness meter updates in real-time
- ✅ Form validation prevents invalid data

**Estimated Effort:** 5-6 days

---

#### 2.3 Spec Coach (AI-Powered Assistance)

**Tasks:**
- [ ] Create AI provider abstraction (`packages/core/ai/`)
- [ ] Implement OpenAI client (initial provider)
- [ ] Build `SpecCoachPanel` component
- [ ] Create Server Action: `generateSpecBlock(agentId, blockName, context)`
- [ ] Implement streaming response handler (`/api/ai/stream`)
- [ ] Add "Generate" buttons to each spec block
- [ ] Implement "Tighten scope" automation
- [ ] Add "Detect contradictions" feature

**AI Provider Abstraction:**
```typescript
// packages/core/ai/provider.ts
export interface AIProvider {
  generateText(prompt: string, options?: GenerateOptions): Promise<string>
  streamText(prompt: string, options?: GenerateOptions): AsyncIterable<string>
}

export class OpenAIProvider implements AIProvider {
  constructor(private apiKey: string) {}
  
  async generateText(prompt: string): Promise<string> {
    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [{ role: 'user', content: prompt }],
    })
    return response.choices[0].message.content || ''
  }
  
  async *streamText(prompt: string): AsyncIterable<string> {
    const stream = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [{ role: 'user', content: prompt }],
      stream: true,
    })
    
    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content
      if (content) yield content
    }
  }
}
```

**Streaming Route Handler:**
```typescript
// app/api/ai/stream/route.ts
import { OpenAIProvider } from '@/packages/core/ai'

export async function POST(req: Request) {
  const { prompt } = await req.json()
  const provider = new OpenAIProvider(process.env.OPENAI_API_KEY!)
  
  const stream = new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of provider.streamText(prompt)) {
          controller.enqueue(new TextEncoder().encode(`data: ${chunk}\n\n`))
        }
        controller.close()
      } catch (error) {
        controller.error(error)
      }
    },
  })
  
  return new Response(stream, {
    headers: { 'Content-Type': 'text/event-stream' },
  })
}
```

**Deliverables:**
- AI provider abstraction
- Spec Coach panel functional
- Generate buttons work
- Streaming responses display in UI

**Acceptance Criteria:**
- ✅ Generate button produces relevant content
- ✅ Streaming updates UI in real-time
- ✅ Generated content can be edited
- ✅ Contradiction detection works
- ✅ Rate limiting prevents abuse

**Estimated Effort:** 4-5 days

---

#### 2.4 Spec Completeness & Validation

**Tasks:**
- [ ] Implement completeness calculator:
  - Check required fields per block
  - Calculate percentage complete
- [ ] Build `SpecCompletenessCard` component
- [ ] Create `CompletionMeter` component
- [ ] Add validation rules (Zod schemas per block)
- [ ] Display validation errors inline
- [ ] Show blockers list on overview page

**Completeness Logic:**
```typescript
// packages/core/spec/completeness.ts
export function calculateCompleteness(spec: SpecJSON): number {
  const blocks = [
    { name: 'mission', weight: 0.2, required: ['problem', 'success_criteria'] },
    { name: 'audience', weight: 0.15, required: ['persona', 'skill_level'] },
    { name: 'scope', weight: 0.15, required: ['must_do', 'out_of_scope'] },
    { name: 'io_contracts', weight: 0.2, required: ['inputs', 'outputs'] },
    { name: 'constraints', weight: 0.1, required: ['length'] },
    { name: 'safety', weight: 0.1, required: ['refusals'] },
    { name: 'examples', weight: 0.1, required: ['good'] },
  ]
  
  let totalScore = 0
  for (const block of blocks) {
    const blockData = spec[block.name as keyof SpecJSON]
    const filled = block.required.filter(field => {
      const value = blockData?.[field as keyof typeof blockData]
      return value && (Array.isArray(value) ? value.length > 0 : value !== '')
    }).length
    const blockScore = filled / block.required.length
    totalScore += blockScore * block.weight
  }
  
  return Math.round(totalScore * 100)
}
```

**Deliverables:**
- Completeness calculation working
- Visual indicators (meter, card)
- Validation errors displayed
- Blockers list functional

**Acceptance Criteria:**
- ✅ Completeness updates as user types
- ✅ Meter shows accurate percentage
- ✅ Blockers list identifies missing fields
- ✅ Validation prevents invalid submissions

**Estimated Effort:** 2-3 days

---

**Phase 2 Total Estimated Effort:** 15-19 days (3-4 weeks)

**Phase 2 Definition of Done:**
- ✅ Users can create and manage agents
- ✅ Spec editing with autosave works
- ✅ Spec Coach generates content
- ✅ Completeness tracking functional
- ✅ All data persists to real database

---

### Phase 3: Prompt Compiler & Quality System (Weeks 6-8)

**Objective:** Compile specs into prompt packages, implement linting and scoring.

#### 3.1 Prompt Compiler Core

**Tasks:**
- [ ] Design compiler architecture (`packages/core/compiler/`)
- [ ] Implement compilation stages (Section 10.3):
  1. Normalize text and lists
  2. Validate minimal completeness
  3. Build requirement graph
  4. Expand into policy statements
  5. Generate layered prompts
  6. Run lint rules
  7. Compute score
  8. Produce suggested actions
- [ ] Create prompt templates for each layer:
  - System backbone
  - Domain manual
  - Output contracts
  - Tool policy
  - Examples
- [ ] Implement `compileDraft(agentId)` Server Action
- [ ] Build `PromptLayerTabs` component
- [ ] Create `PromptReadView` component (Monaco Editor)
- [ ] Add "Regenerate" functionality

**Compiler Architecture:**
```typescript
// packages/core/compiler/index.ts
export interface CompilerInput {
  spec: SpecJSON
  capabilities: CapabilitiesJSON
  knowledgeMap?: KnowledgeMap
  toolToggles?: ToolToggles
}

export interface CompilerOutput {
  promptPackage: PromptPackageJSON
  lintFindings: LintFinding[]
  qualityScore: QualityScore
  suggestions: Suggestion[]
}

export class PromptCompiler {
  async compile(input: CompilerInput): Promise<CompilerOutput> {
    // Stage 1: Normalize
    const normalized = this.normalize(input.spec)
    
    // Stage 2: Validate
    const validation = this.validate(normalized)
    if (!validation.valid) {
      throw new Error('Spec incomplete')
    }
    
    // Stage 3: Build graph
    const graph = this.buildRequirementGraph(normalized)
    
    // Stage 4: Expand policies
    const policies = this.expandPolicies(graph, input.capabilities)
    
    // Stage 5: Generate layers
    const layers = this.generateLayers(policies, input)
    
    // Stage 6: Lint
    const lintFindings = this.lint(layers)
    
    // Stage 7: Score
    const score = this.computeScore(normalized, layers, lintFindings)
    
    // Stage 8: Suggestions
    const suggestions = this.generateSuggestions(lintFindings, score)
    
    return {
      promptPackage: layers,
      lintFindings,
      qualityScore: score,
      suggestions,
    }
  }
  
  private normalize(spec: SpecJSON): NormalizedSpec {
    // Clean text, normalize lists, etc.
  }
  
  private validate(spec: NormalizedSpec): ValidationResult {
    // Check required fields
  }
  
  private buildRequirementGraph(spec: NormalizedSpec): RequirementGraph {
    // Build dependency graph
  }
  
  private expandPolicies(graph: RequirementGraph, capabilities: CapabilitiesJSON): Policy[] {
    // Convert requirements to policies
  }
  
  private generateLayers(policies: Policy[], input: CompilerInput): PromptPackageJSON {
    return {
      system_backbone: this.generateSystemBackbone(policies),
      domain_manual: this.generateDomainManual(input.spec, policies),
      output_contracts: this.generateOutputContracts(input.spec.io_contracts),
      tool_policy: this.generateToolPolicy(input.capabilities, input.toolToggles),
      examples: this.generateExamples(input.spec.examples),
    }
  }
  
  private lint(layers: PromptPackageJSON): LintFinding[] {
    // Run lint rules
  }
  
  private computeScore(spec: SpecJSON, layers: PromptPackageJSON, findings: LintFinding[]): QualityScore {
    // Calculate score (Section 11.3)
  }
  
  private generateSuggestions(findings: LintFinding[], score: QualityScore): Suggestion[] {
    // Generate actionable suggestions
  }
}
```

**Prompt Templates:**
```typescript
// packages/core/compiler/templates.ts
export const SYSTEM_BACKBONE_TEMPLATE = `You are an AI agent designed to help users with the following mission:

{{mission.problem}}

Success Criteria:
{{#each mission.success_criteria}}
- {{this}}
{{/each}}

Non-Goals (what you should NOT do):
{{#each mission.non_goals}}
- {{this}}
{{/each}}

Your audience is: {{audience.persona}} ({{audience.skill_level}} level)
Communication style: {{audience.tone}}
Language: {{audience.language}}
`

export const DOMAIN_MANUAL_TEMPLATE = `## Domain Context

Scope - Must Do:
{{#each scope.must_do}}
- {{this}}
{{/each}}

Scope - Should Do:
{{#each scope.should_do}}
- {{this}}
{{/each}}

Out of Scope:
{{#each scope.out_of_scope}}
- {{this}}
{{/each}}

Constraints:
- Length: {{constraints.length}}
- Citation Policy: {{constraints.citation_policy}}
- Verification: {{constraints.verification}}
`
```

**Deliverables:**
- Compiler core implementation
- Prompt templates for all layers
- Compilation Server Action
- Instructions page UI

**Acceptance Criteria:**
- ✅ Compiler generates all 5 prompt layers
- ✅ Prompts are deterministic (same input = same output)
- ✅ Compilation completes in <2s
- ✅ UI displays all layers in tabs
- ✅ Regenerate produces improved output

**Estimated Effort:** 6-7 days

---

#### 3.2 Lint System

**Tasks:**
- [ ] Implement lint rule engine (`packages/core/lint/`)
- [ ] Create lint rules (Section 11.2):
  - Critical rules (block publish)
  - High/Medium/Low severity rules
- [ ] Build `LintPanel` component
- [ ] Implement rule checkers:
  - Missing mission problem
  - No success criteria
  - No out-of-scope list
  - No output contract
  - Contradictory constraints
  - (Add more rules)
- [ ] Add "Apply Fix" functionality
- [ ] Display lint findings with severity badges

**Lint Rule Engine:**
```typescript
// packages/core/lint/rules.ts
export interface LintRule {
  id: string
  name: string
  severity: 'critical' | 'high' | 'medium' | 'low'
  check: (spec: SpecJSON, layers: PromptPackageJSON) => LintFinding | null
}

export const CRITICAL_RULES: LintRule[] = [
  {
    id: 'missing-mission-problem',
    name: 'Missing Mission Problem',
    severity: 'critical',
    check: (spec) => {
      if (!spec.mission?.problem || spec.mission.problem.trim() === '') {
        return {
          ruleId: 'missing-mission-problem',
          severity: 'critical',
          message: 'Mission problem statement is required',
          block: 'mission',
          field: 'problem',
          suggestion: 'Add a clear problem statement describing what the agent should solve',
        }
      }
      return null
    },
  },
  {
    id: 'no-success-criteria',
    name: 'No Success Criteria',
    severity: 'critical',
    check: (spec) => {
      if (!spec.mission?.success_criteria || spec.mission.success_criteria.length === 0) {
        return {
          ruleId: 'no-success-criteria',
          severity: 'critical',
          message: 'At least one success criterion is required',
          block: 'mission',
          field: 'success_criteria',
          suggestion: 'Define measurable success criteria',
        }
      }
      return null
    },
  },
  // ... more rules
]

export function runLintRules(spec: SpecJSON, layers: PromptPackageJSON): LintFinding[] {
  const findings: LintFinding[] = []
  
  for (const rule of CRITICAL_RULES) {
    const finding = rule.check(spec, layers)
    if (finding) findings.push(finding)
  }
  
  // Add high/medium/low rules...
  
  return findings
}
```

**Deliverables:**
- Lint rule engine
- All critical rules implemented
- Lint panel UI
- Apply fix functionality

**Acceptance Criteria:**
- ✅ Critical rules block publish
- ✅ Lint findings display with correct severity
- ✅ Apply fix updates spec correctly
- ✅ Lint runs automatically on compile

**Estimated Effort:** 4-5 days

---

#### 3.3 Quality Scoring

**Tasks:**
- [ ] Implement scoring algorithm (Section 11.3)
- [ ] Create `QualityGauge` component
- [ ] Calculate score components:
  - Spec completeness (30%)
  - Instruction clarity (25%)
  - Safety clarity (15%)
  - Output contract strength (15%)
  - Test coverage (15%)
- [ ] Set publish threshold (e.g., 70%)
- [ ] Display score breakdown
- [ ] Show score trends (when versions exist)

**Scoring Implementation:**
```typescript
// packages/core/scoring/index.ts
export interface QualityScore {
  overall: number
  components: {
    specCompleteness: number
    instructionClarity: number
    safetyClarity: number
    outputContractStrength: number
    testCoverage: number
  }
  breakdown: ScoreBreakdown[]
}

export function computeQualityScore(
  spec: SpecJSON,
  layers: PromptPackageJSON,
  lintFindings: LintFinding[],
  testCoverage: number
): QualityScore {
  // Spec completeness (30%)
  const specCompleteness = calculateCompleteness(spec)
  
  // Instruction clarity (25%)
  const instructionClarity = calculateInstructionClarity(layers)
  
  // Safety clarity (15%)
  const safetyClarity = calculateSafetyClarity(spec.safety, layers)
  
  // Output contract strength (15%)
  const outputContractStrength = calculateOutputContractStrength(spec.io_contracts)
  
  // Test coverage (15%)
  const testCoverageScore = testCoverage
  
  const overall = Math.round(
    specCompleteness * 0.30 +
    instructionClarity * 0.25 +
    safetyClarity * 0.15 +
    outputContractStrength * 0.15 +
    testCoverageScore * 0.15
  )
  
  return {
    overall,
    components: {
      specCompleteness,
      instructionClarity,
      safetyClarity,
      outputContractStrength,
      testCoverage: testCoverageScore,
    },
    breakdown: [
      { name: 'Spec Completeness', score: specCompleteness, weight: 0.30 },
      { name: 'Instruction Clarity', score: instructionClarity, weight: 0.25 },
      { name: 'Safety Clarity', score: safetyClarity, weight: 0.15 },
      { name: 'Output Contract', score: outputContractStrength, weight: 0.15 },
      { name: 'Test Coverage', score: testCoverageScore, weight: 0.15 },
    ],
  }
}

function calculateInstructionClarity(layers: PromptPackageJSON): number {
  // Analyze prompt layers for clarity metrics
  // - Length appropriateness
  // - Structure clarity
  // - Specificity
  // Return 0-100 score
}

function calculateSafetyClarity(safety: SpecJSON['safety'], layers: PromptPackageJSON): number {
  // Check if safety boundaries are clearly defined
  // Return 0-100 score
}

function calculateOutputContractStrength(io: SpecJSON['io_contracts']): number {
  // Evaluate output contract definition
  // Return 0-100 score
}
```

**Deliverables:**
- Scoring algorithm implemented
- Quality gauge component
- Score breakdown display
- Publish threshold enforcement

**Acceptance Criteria:**
- ✅ Score calculates correctly per rubric
- ✅ Score updates on spec/compile changes
- ✅ Publish blocked if score < threshold
- ✅ Score breakdown shows component scores

**Estimated Effort:** 3-4 days

---

**Phase 3 Total Estimated Effort:** 13-16 days (2.5-3 weeks)

**Phase 3 Definition of Done:**
- ✅ Compiler generates all prompt layers
- ✅ Lint system identifies issues
- ✅ Quality scoring works
- ✅ Publish threshold enforced
- ✅ Instructions page fully functional

---

### Phase 4: Capabilities & Knowledge System (Weeks 9-10)

**Objective:** Enable capability selection and knowledge file management.

#### 4.1 Capabilities System

**Tasks:**
- [ ] Define capabilities schema (Section 8.6)
- [ ] Create capabilities page (`/app/agents/[agentId]/capabilities`)
- [ ] Build `CapabilityMatrix` component
- [ ] Implement capability rules engine:
  - Check required spec fields per capability
  - Generate blockers if requirements missing
- [ ] Create `CapabilityCard` component
- [ ] Build `CapabilityRuleHints` panel
- [ ] Implement "Recommend capabilities" automation
- [ ] Create Server Actions:
  - `saveDraftCapabilities(agentId, capabilitiesJson)`
  - `getDraftCapabilities(agentId)`

**Capabilities Schema:**
```typescript
// packages/core/types/capabilities.ts
export interface CapabilitiesJSON {
  information: {
    enabled: boolean
    web_search?: boolean
    knowledge_base?: boolean
  }
  production: {
    enabled: boolean
    code_generation?: boolean
    content_creation?: boolean
  }
  decision_support: {
    enabled: boolean
    analysis?: boolean
    recommendations?: boolean
  }
  automation: {
    enabled: boolean
    api_calls?: boolean
    file_operations?: boolean
  }
  domain_specific: {
    enabled: boolean
    tags: string[]
  }
}
```

**Capability Rules:**
```typescript
// packages/core/capabilities/rules.ts
export interface CapabilityRule {
  capability: string
  requiredSpecFields: string[]
  message: string
}

export const CAPABILITY_RULES: CapabilityRule[] = [
  {
    capability: 'web_search',
    requiredSpecFields: ['scope.out_of_scope', 'safety.refusals'],
    message: 'Web search requires out-of-scope and safety boundaries',
  },
  {
    capability: 'code_generation',
    requiredSpecFields: ['io_contracts.outputs.format', 'constraints.verification'],
    message: 'Code generation requires output format and verification constraints',
  },
  // ... more rules
]

export function checkCapabilityRequirements(
  capability: string,
  spec: SpecJSON
): { valid: boolean; blockers: string[] } {
  const rule = CAPABILITY_RULES.find(r => r.capability === capability)
  if (!rule) return { valid: true, blockers: [] }
  
  const blockers: string[] = []
  for (const field of rule.requiredSpecFields) {
    const [block, ...path] = field.split('.')
    const value = getNestedValue(spec[block as keyof SpecJSON], path)
    if (!value || (Array.isArray(value) && value.length === 0)) {
      blockers.push(`${block}.${path.join('.')}`)
    }
  }
  
  return {
    valid: blockers.length === 0,
    blockers,
  }
}
```

**Deliverables:**
- Capabilities page UI
- Capability matrix component
- Rules engine functional
- Recommendation automation

**Acceptance Criteria:**
- ✅ Users can enable/disable capabilities
- ✅ Rules engine checks requirements
- ✅ Blockers display when requirements missing
- ✅ Recommendations suggest relevant capabilities

**Estimated Effort:** 4-5 days

---

#### 4.2 Knowledge Upload System

**Tasks:**
- [ ] Set up Supabase Storage bucket (`agent-knowledge`)
- [ ] Create `files` table schema
- [ ] Implement file upload Server Action:
  - `uploadKnowledgeFile(agentId, file, metadata)`
- [ ] Create signed URL endpoints:
  - `/api/storage/signed-upload`
  - `/api/storage/signed-download`
- [ ] Build knowledge page (`/app/agents/[agentId]/knowledge`)
- [ ] Create components:
  - `KnowledgeUploadZone` (drag & drop)
  - `KnowledgeSourceList`
  - `FilePreviewModal`
  - `CoverageIndicator`
- [ ] Implement file metadata extraction:
  - File type detection
  - Size calculation
  - Checksum generation
- [ ] Add auto-tagging (basic, AI-enhanced later)
- [ ] Create file deletion functionality

**File Upload Implementation:**
```typescript
// app/lib/actions/knowledge.ts
'use server'

import { createClient } from '@/lib/supabase/server'
import { createHash } from 'crypto'

export async function uploadKnowledgeFile(
  agentId: string,
  file: File,
  metadata: { name: string; tags?: string[] }
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) throw new Error('Unauthorized')
  
  // Verify ownership
  const { data: agent } = await supabase
    .from('agents')
    .select('owner_id')
    .eq('id', agentId)
    .single()
  
  if (agent?.owner_id !== user.id) throw new Error('Unauthorized')
  
  // Generate file ID and path
  const fileId = crypto.randomUUID()
  const fileExt = file.name.split('.').pop()
  const fileName = `${fileId}.${fileExt}`
  const storagePath = `${user.id}/${agentId}/${fileId}/${fileName}`
  
  // Calculate checksum
  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)
  const checksum = createHash('sha256').update(buffer).digest('hex')
  
  // Upload to storage
  const { error: uploadError } = await supabase.storage
    .from('agent-knowledge')
    .upload(storagePath, buffer, {
      contentType: file.type,
      upsert: false,
    })
  
  if (uploadError) throw uploadError
  
  // Save metadata to database
  const { data, error } = await supabase
    .from('files')
    .insert({
      id: fileId,
      agent_id: agentId,
      name: metadata.name,
      provider: 'supabase',
      object_key: storagePath,
      mime: file.type,
      checksum,
      size: file.size,
      tags: metadata.tags || [],
    })
    .select()
    .single()
  
  if (error) throw error
  
  return data
}
```

**Signed URL Endpoint:**
```typescript
// app/api/storage/signed-upload/route.ts
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const { agentId, fileName, fileType } = await req.json()
  const supabase = await createClient()
  
  // Verify auth and ownership...
  
  const fileId = crypto.randomUUID()
  const storagePath = `${userId}/${agentId}/${fileId}/${fileName}`
  
  const { data, error } = await supabase.storage
    .from('agent-knowledge')
    .createSignedUploadUrl(storagePath)
  
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  
  return NextResponse.json({ url: data.signedUrl, path: storagePath, fileId })
}
```

**Deliverables:**
- File upload functional
- Knowledge page UI complete
- File list with preview
- Storage integration working

**Acceptance Criteria:**
- ✅ Users can upload files (drag & drop)
- ✅ Files stored in Supabase Storage
- ✅ Metadata saved to database
- ✅ File list displays correctly
- ✅ Preview modal works
- ✅ RLS prevents unauthorized access

**Estimated Effort:** 5-6 days

---

#### 4.3 Knowledge Map Integration

**Tasks:**
- [ ] Create knowledge map data structure
- [ ] Link knowledge sources to spec blocks
- [ ] Update compiler to include knowledge context
- [ ] Build `CoverageIndicator` component
- [ ] Show knowledge coverage per spec block

**Deliverables:**
- Knowledge map structure
- Compiler integration
- Coverage indicators

**Acceptance Criteria:**
- ✅ Knowledge sources linked to spec blocks
- ✅ Compiler includes knowledge in prompts
- ✅ Coverage indicators show status

**Estimated Effort:** 2-3 days

---

**Phase 4 Total Estimated Effort:** 11-14 days (2-3 weeks)

**Phase 4 Definition of Done:**
- ✅ Capabilities system functional
- ✅ Knowledge uploads work
- ✅ Files stored securely
- ✅ Knowledge integrated into compiler

---

### Phase 5: Testing Lab (Weeks 11-12)

**Objective:** Enable users to test agents and run test suites.

#### 5.1 Test Case Management

**Tasks:**
- [ ] Create test case schema (Section 12.1)
- [ ] Build test cases page (`/app/agents/[agentId]/testing`)
- [ ] Create `TestCaseList` component
- [ ] Implement test case CRUD:
  - Create test case
  - Edit test case
  - Delete test case
- [ ] Build test case form:
  - Name, type (functional/safety/regression)
  - Input messages
  - Expected outputs (must_include, must_not_include, traits)
- [ ] Implement "Generate test suite from spec" automation
- [ ] Add "Add safety tests automatically" feature

**Test Case Schema:**
```typescript
// packages/core/types/test.ts
export interface TestCase {
  id: string
  agent_id: string
  name: string
  type: 'functional' | 'safety' | 'regression'
  input: {
    messages: Array<{ role: 'user' | 'assistant'; content: string }>
  }
  expected: {
    must_include: string[]
    must_not_include: string[]
    traits: string[]
  }
  created_at: string
  updated_at: string
}
```

**Test Generation:**
```typescript
// packages/core/testing/generator.ts
export async function generateTestCasesFromSpec(
  spec: SpecJSON,
  aiProvider: AIProvider
): Promise<TestCase[]> {
  const prompt = `Generate comprehensive test cases for an AI agent with this spec:
${JSON.stringify(spec, null, 2)}

Generate:
1. Functional tests based on success criteria
2. Safety tests based on refusals and sensitive topics
3. Edge case tests based on constraints

Return JSON array of test cases matching this schema:
{
  "name": string,
  "type": "functional" | "safety" | "regression",
  "input": { "messages": [...] },
  "expected": { "must_include": [...], "must_not_include": [...], "traits": [...] }
}`
  
  const response = await aiProvider.generateText(prompt)
  const testCases = JSON.parse(response)
  return testCases
}
```

**Deliverables:**
- Test case management UI
- Test case CRUD operations
- Test generation automation

**Acceptance Criteria:**
- ✅ Users can create/edit/delete test cases
- ✅ Test generation produces relevant cases
- ✅ Safety tests auto-generated
- ✅ Test cases persist to database

**Estimated Effort:** 4-5 days

---

#### 5.2 Test Runner

**Tasks:**
- [ ] Build `TestRunnerPanel` component
- [ ] Create `SandboxChat` component
- [ ] Implement test execution logic:
  - Run test against draft or version prompt package
  - Send messages to AI provider
  - Evaluate response against expected outputs
  - Store results
- [ ] Build `RunSummaryCard` component
- [ ] Create test run results display:
  - Pass/fail per test
  - Aggregated pass rate
  - Failure details
- [ ] Implement streaming for sandbox chat
- [ ] Add "Run all tests" functionality

**Test Execution:**
```typescript
// packages/core/testing/runner.ts
export interface TestResult {
  testCaseId: string
  passed: boolean
  actualOutput: string
  failures: string[]
  duration: number
}

export async function runTest(
  testCase: TestCase,
  promptPackage: PromptPackageJSON,
  aiProvider: AIProvider
): Promise<TestResult> {
  const startTime = Date.now()
  
  // Build full prompt from package
  const fullPrompt = buildPromptFromPackage(promptPackage, testCase.input.messages)
  
  // Get AI response
  const actualOutput = await aiProvider.generateText(fullPrompt)
  
  // Evaluate against expected
  const failures: string[] = []
  
  // Check must_include
  for (const required of testCase.expected.must_include) {
    if (!actualOutput.toLowerCase().includes(required.toLowerCase())) {
      failures.push(`Missing required text: "${required}"`)
    }
  }
  
  // Check must_not_include
  for (const forbidden of testCase.expected.must_not_include) {
    if (actualOutput.toLowerCase().includes(forbidden.toLowerCase())) {
      failures.push(`Contains forbidden text: "${forbidden}"`)
    }
  }
  
  // Check traits (basic implementation)
  // Could be enhanced with AI-based evaluation
  
  const passed = failures.length === 0
  const duration = Date.now() - startTime
  
  return {
    testCaseId: testCase.id,
    passed,
    actualOutput,
    failures,
    duration,
  }
}

export async function runTestSuite(
  testCases: TestCase[],
  promptPackage: PromptPackageJSON,
  aiProvider: AIProvider
): Promise<TestRunResult> {
  const results: TestResult[] = []
  
  for (const testCase of testCases) {
    const result = await runTest(testCase, promptPackage, aiProvider)
    results.push(result)
  }
  
  const passed = results.filter(r => r.passed).length
  const passRate = (passed / results.length) * 100
  
  return {
    results,
    passRate,
    totalTests: results.length,
    passedTests: passed,
    failedTests: results.length - passed,
    duration: results.reduce((sum, r) => sum + r.duration, 0),
  }
}
```

**Deliverables:**
- Test runner functional
- Sandbox chat working
- Test results display
- Run summary card

**Acceptance Criteria:**
- ✅ Tests execute against prompt package
- ✅ Results evaluated correctly
- ✅ Sandbox chat streams responses
- ✅ Pass rate calculated accurately
- ✅ Results persist to database

**Estimated Effort:** 5-6 days

---

**Phase 5 Total Estimated Effort:** 9-11 days (2 weeks)

**Phase 5 Definition of Done:**
- ✅ Test case management works
- ✅ Test runner executes tests
- ✅ Results display correctly
- ✅ Sandbox chat functional

---

### Phase 6: Versioning & Publishing (Weeks 13-14)

**Objective:** Implement immutable versioning and publish workflow.

#### 6.1 Version System

**Tasks:**
- [ ] Design version data model
- [ ] Create versions page (`/app/agents/[agentId]/versions`)
- [ ] Build `VersionTimeline` component
- [ ] Create `VersionCard` component
- [ ] Implement version comparison:
  - Diff view between versions
  - Score comparison
- [ ] Build `ScoreTrendMiniChart` component
- [ ] Create version detail page (`/app/agents/[agentId]/versions/[versionId]`)

**Version Model:**
```typescript
// Database schema addition
CREATE TABLE agent_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
  version_number INTEGER NOT NULL,
  spec_snapshot JSONB NOT NULL,
  prompt_package JSONB NOT NULL,
  capabilities JSONB NOT NULL,
  knowledge_map JSONB,
  quality_score INTEGER NOT NULL,
  test_pass_rate DECIMAL(5,2),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by UUID NOT NULL REFERENCES auth.users(id),
  UNIQUE(agent_id, version_number)
);

-- Immutable: no UPDATE or DELETE allowed
CREATE POLICY "Users can read own versions"
  ON agent_versions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM agents
      WHERE agents.id = agent_versions.agent_id
      AND agents.owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own versions"
  ON agent_versions FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM agents
      WHERE agents.id = agent_versions.agent_id
      AND agents.owner_id = auth.uid()
    )
  );
```

**Deliverables:**
- Version data model
- Versions page UI
- Version timeline
- Diff view

**Acceptance Criteria:**
- ✅ Versions are immutable after creation
- ✅ Version numbers increment automatically
- ✅ Diff view shows changes
- ✅ Score trends display correctly

**Estimated Effort:** 4-5 days

---

#### 6.2 Publish Workflow

**Tasks:**
- [ ] Implement `publishVersion(agentId)` Server Action
- [ ] Create publish gate checks:
  - Quality score >= threshold (70%)
  - No critical lint findings
  - At least one test case exists
  - Test pass rate >= threshold (optional)
- [ ] Build publish confirmation dialog
- [ ] Implement snapshot creation:
  - Freeze spec snapshot
  - Freeze prompt package
  - Freeze knowledge map
  - Create version record
- [ ] Update agent status to "published"
- [ ] Create audit log entry
- [ ] Show success state with next actions

**Publish Implementation:**
```typescript
// app/lib/actions/versions.ts
'use server'

export async function publishVersion(agentId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) throw new Error('Unauthorized')
  
  // Get draft
  const { data: draft } = await supabase
    .from('agent_drafts')
    .select('*')
    .eq('agent_id', agentId)
    .single()
  
  if (!draft) throw new Error('No draft found')
  
  // Compile to get latest prompt package and score
  const compiler = new PromptCompiler()
  const compiled = await compiler.compile({
    spec: draft.spec_json,
    capabilities: draft.capabilities_json,
  })
  
  // Check publish gates
  const gates = await checkPublishGates(agentId, compiled)
  if (!gates.passed) {
    throw new Error(`Publish blocked: ${gates.reasons.join(', ')}`)
  }
  
  // Get next version number
  const { data: latestVersion } = await supabase
    .from('agent_versions')
    .select('version_number')
    .eq('agent_id', agentId)
    .order('version_number', { ascending: false })
    .limit(1)
    .single()
  
  const nextVersion = (latestVersion?.version_number || 0) + 1
  
  // Get knowledge map
  const { data: knowledgeSources } = await supabase
    .from('knowledge_sources')
    .select('*')
    .eq('agent_id', agentId)
  
  const knowledgeMap = buildKnowledgeMap(knowledgeSources || [])
  
  // Get test pass rate
  const { data: latestTestRun } = await supabase
    .from('test_runs')
    .select('pass_rate')
    .eq('agent_id', agentId)
    .order('created_at', { ascending: false })
    .limit(1)
    .single()
  
  // Create version (immutable snapshot)
  const { data: version, error } = await supabase
    .from('agent_versions')
    .insert({
      agent_id: agentId,
      version_number: nextVersion,
      spec_snapshot: draft.spec_json,
      prompt_package: compiled.promptPackage,
      capabilities: draft.capabilities_json,
      knowledge_map: knowledgeMap,
      quality_score: compiled.qualityScore.overall,
      test_pass_rate: latestTestRun?.pass_rate || null,
      created_by: user.id,
    })
    .select()
    .single()
  
  if (error) throw error
  
  // Update agent status
  await supabase
    .from('agents')
    .update({ status: 'published', updated_at: new Date().toISOString() })
    .eq('id', agentId)
  
  // Create audit log
  await supabase.from('audit_logs').insert({
    agent_id: agentId,
    user_id: user.id,
    action: 'version_published',
    metadata: { version_id: version.id, version_number: nextVersion },
  })
  
  return version
}

async function checkPublishGates(
  agentId: string,
  compiled: CompilerOutput
): Promise<{ passed: boolean; reasons: string[] }> {
  const reasons: string[] = []
  
  // Check quality score
  if (compiled.qualityScore.overall < 70) {
    reasons.push(`Quality score ${compiled.qualityScore.overall} below threshold (70)`)
  }
  
  // Check critical lint findings
  const criticalFindings = compiled.lintFindings.filter(f => f.severity === 'critical')
  if (criticalFindings.length > 0) {
    reasons.push(`${criticalFindings.length} critical lint findings`)
  }
  
  // Check test cases exist
  const supabase = await createClient()
  const { count } = await supabase
    .from('test_cases')
    .select('*', { count: 'exact', head: true })
    .eq('agent_id', agentId)
  
  if ((count || 0) === 0) {
    reasons.push('No test cases defined')
  }
  
  return {
    passed: reasons.length === 0,
    reasons,
  }
}
```

**Deliverables:**
- Publish Server Action
- Publish gate checks
- Snapshot creation
- Audit logging

**Acceptance Criteria:**
- ✅ Publish creates immutable version
- ✅ Gates block publish if requirements not met
- ✅ Snapshots freeze all data correctly
- ✅ Version numbers increment
- ✅ Audit logs created

**Estimated Effort:** 4-5 days

---

**Phase 6 Total Estimated Effort:** 8-10 days (1.5-2 weeks)

**Phase 6 Definition of Done:**
- ✅ Versioning system works
- ✅ Publish creates immutable versions
- ✅ Gates enforce quality requirements
- ✅ Diff view functional

---

### Phase 7: Export & Polish (Weeks 15-16)

**Objective:** Enable exports and finalize production readiness.

#### 7.1 Export System

**Tasks:**
- [ ] Create export page (`/app/agents/[agentId]/deploy`)
- [ ] Build `ExportCard` components
- [ ] Implement export Server Action: `exportBundle(agentId, versionId?)`
- [ ] Generate export files (Section 25):
  - `agent-config.json`
  - `prompt-package.json`
  - `test-report.json`
- [ ] Create download functionality
- [ ] Add "Export full bundle" automation
- [ ] Build `SharingPanel` (for future V2)

**Export Implementation:**
```typescript
// app/lib/actions/export.ts
'use server'

export async function exportBundle(agentId: string, versionId?: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) throw new Error('Unauthorized')
  
  // Get agent
  const { data: agent } = await supabase
    .from('agents')
    .select('*')
    .eq('id', agentId)
    .single()
  
  // Get version (or latest)
  let version
  if (versionId) {
    const { data } = await supabase
      .from('agent_versions')
      .select('*')
      .eq('id', versionId)
      .single()
    version = data
  } else {
    const { data } = await supabase
      .from('agent_versions')
      .select('*')
      .eq('agent_id', agentId)
      .order('version_number', { ascending: false })
      .limit(1)
      .single()
    version = data
  }
  
  if (!version) throw new Error('No version found')
  
  // Get test cases and results
  const { data: testCases } = await supabase
    .from('test_cases')
    .select('*')
    .eq('agent_id', agentId)
  
  const { data: testRuns } = await supabase
    .from('test_runs')
    .select('*')
    .eq('agent_version_id', version.id)
    .order('created_at', { ascending: false })
    .limit(1)
  
  // Build export bundle
  const agentConfig = {
    agent: {
      id: agent.id,
      name: agent.name,
      description: agent.description,
      created_at: agent.created_at,
    },
    active_version_id: version.id,
    active_version_number: version.version_number,
    capabilities: version.capabilities,
  }
  
  const promptPackage = version.prompt_package
  
  const testReport = {
    version_id: version.id,
    version_number: version.version_number,
    test_cases: testCases || [],
    latest_run: testRuns?.[0] || null,
    pass_rate: version.test_pass_rate,
    quality_score: version.quality_score,
    generated_at: new Date().toISOString(),
  }
  
  return {
    agentConfig,
    promptPackage,
    testReport,
  }
}
```

**Deliverables:**
- Export page UI
- Export Server Action
- JSON file generation
- Download functionality

**Acceptance Criteria:**
- ✅ Export generates all 3 JSON files
- ✅ Files match schema (Section 25)
- ✅ Download works correctly
- ✅ Export includes correct version data

**Estimated Effort:** 3-4 days

---

#### 7.2 Command Palette

**Tasks:**
- [ ] Install command palette library (cmdk or similar)
- [ ] Build `CommandPalette` component
- [ ] Implement hotkey (`Ctrl/Cmd + K`)
- [ ] Add commands (Section 5.4):
  - Create agent
  - Create from template
  - Jump to agent step
  - Generate missing spec blocks
  - Run test suite
  - Publish version
  - Export package
- [ ] Add search/filter functionality
- [ ] Implement command execution

**Deliverables:**
- Command palette component
- All commands functional
- Keyboard shortcuts working

**Acceptance Criteria:**
- ✅ Command palette opens with Cmd+K
- ✅ All commands execute correctly
- ✅ Search filters commands
- ✅ Keyboard navigation works

**Estimated Effort:** 2-3 days

---

#### 7.3 Telemetry & Observability

**Tasks:**
- [ ] Set up Sentry (frontend + backend)
- [ ] Implement event tracking (Section 21.1):
  - `agent_created`
  - `spec_block_generated`
  - `lint_blocker_resolved`
  - `tests_generated`
  - `tests_run`
  - `version_published`
  - `export_downloaded`
- [ ] Add structured server logs
- [ ] Create error boundary components
- [ ] Set up performance monitoring
- [ ] Add user analytics (privacy-compliant)

**Deliverables:**
- Sentry integration
- Event tracking
- Error boundaries
- Performance monitoring

**Acceptance Criteria:**
- ✅ Errors tracked in Sentry
- ✅ Events logged correctly
- ✅ Error boundaries catch React errors
- ✅ Performance metrics collected

**Estimated Effort:** 3-4 days

---

#### 7.4 Mobile Optimization & Testing

**Tasks:**
- [ ] Test all pages on mobile devices
- [ ] Fix mobile layout issues
- [ ] Optimize touch interactions
- [ ] Test hamburger menu on all pages
- [ ] Validate responsive breakpoints
- [ ] Test file upload on mobile
- [ ] Optimize performance for mobile

**Deliverables:**
- Mobile layouts validated
- Touch interactions optimized
- Performance optimized

**Acceptance Criteria:**
- ✅ All pages work on mobile
- ✅ Touch targets >= 44x44px
- ✅ No horizontal scrolling
- ✅ Performance acceptable on 3G

**Estimated Effort:** 3-4 days

---

#### 7.5 E2E Test Suite

**Tasks:**
- [ ] Set up Playwright
- [ ] Write E2E tests for critical flows (Section 12.3):
  - Sign in
  - Create agent from template
  - Autosave spec
  - Generate prompt
  - Generate tests
  - Run tests
  - Publish
  - Export
- [ ] Add CI/CD integration
- [ ] Set up test data fixtures
- [ ] Add visual regression tests (optional)

**E2E Test Example:**
```typescript
// tests/e2e/agent-creation.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Agent Creation Flow', () => {
  test('user can create agent and edit spec', async ({ page }) => {
    // Sign in
    await page.goto('/auth/sign-in')
    await page.fill('input[type="email"]', 'test@example.com')
    await page.click('button:has-text("Send magic link")')
    // ... handle magic link
    
    // Create agent
    await page.goto('/app/agents/new')
    await page.fill('input[name="name"]', 'Test Agent')
    await page.fill('textarea[name="description"]', 'Test description')
    await page.click('button:has-text("Create")')
    
    // Should redirect to overview
    await expect(page).toHaveURL(/\/app\/agents\/[^/]+\/overview/)
    
    // Navigate to spec
    await page.click('a:has-text("Specification")')
    
    // Edit mission block
    await page.fill('textarea[name="mission.problem"]', 'Test problem')
    await page.fill('textarea[name="mission.success_criteria"]', 'Test criteria')
    
    // Wait for autosave
    await expect(page.locator('[data-testid="autosave-indicator"]')).toHaveText('Saved')
    
    // Verify data persisted
    await page.reload()
    await expect(page.locator('textarea[name="mission.problem"]')).toHaveValue('Test problem')
  })
})
```

**Deliverables:**
- E2E test suite
- CI/CD integration
- Test fixtures

**Acceptance Criteria:**
- ✅ All critical flows have E2E tests
- ✅ Tests pass in CI
- ✅ Tests run on every PR

**Estimated Effort:** 4-5 days

---

**Phase 7 Total Estimated Effort:** 15-20 days (3-4 weeks)

**Phase 7 Definition of Done:**
- ✅ Export system functional
- ✅ Command palette works
- ✅ Telemetry integrated
- ✅ Mobile optimized
- ✅ E2E tests passing

---

## Technical Architecture Details

### Database Schema (Complete)

See Phase 1.2 for initial schema. Additional tables:

```sql
-- Knowledge sources (links files to agents)
CREATE TABLE knowledge_sources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
  file_id UUID NOT NULL REFERENCES files(id) ON DELETE CASCADE,
  spec_block_tags TEXT[], -- Which spec blocks this relates to
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Test runs
CREATE TABLE test_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
  agent_version_id UUID REFERENCES agent_versions(id),
  agent_draft_id UUID REFERENCES agent_drafts(id),
  results JSONB NOT NULL, -- Array of test results
  pass_rate DECIMAL(5,2) NOT NULL,
  total_tests INTEGER NOT NULL,
  passed_tests INTEGER NOT NULL,
  failed_tests INTEGER NOT NULL,
  duration_ms INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by UUID NOT NULL REFERENCES auth.users(id)
);

-- Audit logs
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID REFERENCES agents(id) ON DELETE SET NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  action TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_knowledge_sources_agent ON knowledge_sources(agent_id);
CREATE INDEX idx_test_runs_agent_version ON test_runs(agent_version_id, created_at DESC);
CREATE INDEX idx_audit_logs_agent ON audit_logs(agent_id, created_at DESC);
```

### Server Actions Structure

```
app/lib/actions/
├── agents.ts          # Agent CRUD
├── drafts.ts          # Draft spec/capabilities
├── compiler.ts        # Compile draft
├── knowledge.ts       # File uploads
├── testing.ts         # Test cases & runs
├── versions.ts        # Publish version
└── export.ts          # Export bundle
```

### Component Organization

```
app/components/
├── layout/            # AppShell, Sidebar, TopBar
├── agents/            # Agent-specific components
│   ├── AgentCard.tsx
│   ├── AgentOverview.tsx
│   └── ...
├── spec/              # Spec system components
│   ├── SpecBlockForm.tsx
│   ├── SpecCoachPanel.tsx
│   └── ...
├── capabilities/      # Capabilities components
├── instructions/      # Prompt display components
├── knowledge/         # Knowledge management
├── testing/           # Testing lab components
├── versions/          # Versioning components
└── ui/                # Shared UI (shadcn)
```

---

## Quality Gates & Definition of Done

### Per-Phase Gates

**Phase 1:**
- ✅ Database schema deployed
- ✅ Authentication working
- ✅ App shell renders
- ✅ Zero TypeScript errors

**Phase 2:**
- ✅ Agents CRUD functional
- ✅ Spec editing with autosave
- ✅ Data persists to real DB

**Phase 3:**
- ✅ Compiler generates prompts
- ✅ Lint system works
- ✅ Quality scoring accurate

**Phase 4:**
- ✅ Capabilities system functional
- ✅ File uploads work
- ✅ Storage secure

**Phase 5:**
- ✅ Test runner executes tests
- ✅ Results accurate
- ✅ Sandbox chat works

**Phase 6:**
- ✅ Versions immutable
- ✅ Publish gates enforced
- ✅ Diff view functional

**Phase 7:**
- ✅ Export generates valid JSON
- ✅ E2E tests passing
- ✅ Mobile optimized

### Overall Definition of Done

**Code Quality:**
- ✅ Zero TypeScript errors
- ✅ ESLint passes (no warnings)
- ✅ All components have loading/error/empty states
- ✅ Accessibility: WCAG 2.1 AA compliance
- ✅ Performance: Lighthouse score >90

**Functionality:**
- ✅ All 26 routes functional
- ✅ All Server Actions work
- ✅ Real database (no mocks)
- ✅ Real storage (no mocks)
- ✅ Real AI provider (no mocks)

**Testing:**
- ✅ E2E test coverage >80% for critical paths
- ✅ Unit tests for core logic (compiler, scoring, lint)
- ✅ Integration tests for Server Actions

**Documentation:**
- ✅ README updated
- ✅ API documentation (JSDoc)
- ✅ Component documentation
- ✅ Deployment guide

---

## Risk Management

### Technical Risks

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Supabase RLS complexity | High | Medium | Start with simple policies, test thoroughly |
| AI provider rate limits | High | Medium | Implement rate limiting, caching, fallbacks |
| Compiler performance | Medium | Low | Optimize templates, cache results |
| File upload size limits | Medium | Low | Implement chunking, compression |
| Mobile performance | Medium | Medium | Optimize images, lazy load, code splitting |

### Project Risks

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Scope creep | High | High | Strict adherence to spec, phase gates |
| Timeline delays | Medium | Medium | Buffer time in estimates, prioritize MVP |
| Resource constraints | Medium | Low | Clear task breakdown, parallel work streams |

---

## Timeline & Resource Estimates

### Total Timeline

**Optimistic:** 14 weeks (3.5 months)  
**Realistic:** 16-18 weeks (4-4.5 months)  
**Pessimistic:** 20 weeks (5 months)

### Phase Breakdown

| Phase | Duration | Dependencies |
|-------|----------|--------------|
| Phase 1: Foundation | 2.5-3.5 weeks | None |
| Phase 2: Agent & Spec | 3-4 weeks | Phase 1 |
| Phase 3: Compiler | 2.5-3 weeks | Phase 2 |
| Phase 4: Capabilities & Knowledge | 2-3 weeks | Phase 2 |
| Phase 5: Testing | 2 weeks | Phase 3, 4 |
| Phase 6: Versioning | 1.5-2 weeks | Phase 3, 5 |
| Phase 7: Export & Polish | 3-4 weeks | Phase 6 |

### Resource Requirements

**Team Composition (Recommended):**
- 1 Full-stack Developer (Next.js, TypeScript)
- 1 Backend Developer (Supabase, AI integration)
- 1 Frontend Developer (UI/UX, components)
- 0.5 DevOps (CI/CD, deployment)
- 0.5 QA (Testing, validation)

**Solo Development:**
- Estimated: 16-20 weeks full-time
- With buffer: 20-24 weeks

### Milestones

**M1: Foundation Complete (Week 3)**
- Database, auth, app shell working

**M2: Core Features (Week 8)**
- Agents, spec editing, compiler functional

**M3: Advanced Features (Week 12)**
- Testing lab, knowledge system working

**M4: Production Ready (Week 16)**
- Versioning, export, E2E tests passing

---

## Appendix: Detailed Task Breakdowns

### A.1 Database Migration Checklist

- [ ] Create all tables
- [ ] Add foreign keys
- [ ] Create indexes
- [ ] Set up RLS policies
- [ ] Test RLS with multiple users
- [ ] Generate TypeScript types
- [ ] Create migration rollback scripts
- [ ] Document schema decisions

### A.2 Component Checklist (Per Component)

- [ ] Component created
- [ ] TypeScript types defined
- [ ] Loading state implemented
- [ ] Error state implemented
- [ ] Empty state implemented
- [ ] Success state implemented
- [ ] Accessibility tested (keyboard nav, ARIA)
- [ ] Mobile responsive
- [ ] Dark mode supported
- [ ] Unit tests written (if complex logic)

### A.3 Server Action Checklist (Per Action)

- [ ] Action created
- [ ] Input validation (Zod schema)
- [ ] Auth check
- [ ] Ownership verification (if needed)
- [ ] Error handling
- [ ] Database transaction (if multiple operations)
- [ ] Audit log (if required)
- [ ] Return type defined
- [ ] Error messages user-friendly

### A.4 Page Checklist (Per Page)

- [ ] Page route created
- [ ] Layout matches spec (Section 8)
- [ ] All components integrated
- [ ] Loading skeleton
- [ ] Error boundary
- [ ] Empty state
- [ ] Mobile layout tested
- [ ] E2E test written
- [ ] SEO meta tags (if public)

---

## Next Steps

1. **Review this plan** with stakeholders
2. **Set up development environment** (Section 2.1)
3. **Initialize Supabase project** (Section 2.2)
4. **Create workspace structure** (Section 2.3)
5. **Begin Phase 1.1** (Project Setup)

---

**Document Version:** 1.0  
**Last Updated:** 2025-12-10  
**Status:** Ready for Review

