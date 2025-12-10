# Agent Studio (AI Agent Generator)
## Full E2E Technical Specification for Implementation
### Spec-first, no-mock, real DB + real storage, Cursor Agent on VS Code

Version: 1.0  
Date: 2025-12-10  
Target: V1 production-grade MVP with premium UI and strict quality gates.

---

## 1. Product Definition

### 1.1 One-line
A specification-driven web platform that **compiles user requirements into high-quality AI agent prompt packages**, validates them with lint + tests, versions them immutably, and exports deployable artifacts.

### 1.2 Primary outcomes
Users can:
- Create an agent from a structured spec in minutes.
- Receive a professional multi-layer instruction set automatically.
- Attach knowledge files.
- Run functional + safety tests.
- Publish immutable versions with scores.
- Export configs and prompt packages.

### 1.3 Non-negotiables
- **No mock data** in any user-visible flow.
- All CRUD uses real persistence.
- All uploads go to real storage.
- All AI generation calls a real provider abstraction (even if a single provider is configured initially).
- Publish creates immutable snapshots.

---

## 2. Target Technology Stack

### 2.1 Frontend
- Next.js 14+ App Router
- TypeScript
- Tailwind CSS
- shadcn/ui primitives
- Framer Motion (micro-interactions)
- react-hook-form
- Zod
- lucide-react icons
- next-themes (theme switching)
- Monaco Editor (read-focused advanced views)
- Optional: TanStack Query if not using Server Actions for all writes

### 2.2 Backend
Preferred:
- Next.js Server Actions for authenticated CRUD.
- Route Handlers for:
  - OAuth callbacks
  - Signed URL endpoints
  - Streaming AI responses
  - Webhooks

### 2.3 DB + Auth + Storage
Primary single-provider option:
- Supabase (Postgres + Auth + Storage + RLS)

Hybrid option:
- Supabase (DB + Auth)
- Cloudflare R2 (large object storage)

### 2.4 Testing
- Vitest (unit)
- Playwright (E2E)
- MSW only for **test environment**, never production UI demos.

### 2.5 Observability
- Sentry (frontend + backend)
- Structured server logs.
- Audit logs table in DB.

---

## 3. High-level Architecture

### 3.1 Modules
1. **App Shell**
2. **Auth**
3. **Agent Domain**
4. **Spec System**
5. **Capability System**
6. **Prompt Compiler**
7. **Lint + Quality Scoring**
8. **Knowledge Domain**
9. **Testing Lab**
10. **Versioning**
11. **Export/Deploy**
12. **Telemetry + Audit**

### 3.2 Data flow
1. User edits structured spec blocks.
2. Autosave writes to `agent_drafts`.
3. Compiler generates:
   - Prompt layers
   - Lint findings
   - Score
   - Suggested fixes
4. User runs tests.
5. Publish:
   - Freeze spec snapshot
   - Freeze prompt package
   - Freeze knowledge map
   - Create new `agent_versions`

---

## 4. Routing Specification

### 4.1 Public routes
- `/` Landing
- `/templates` Marketing preview
- `/pricing` Optional
- `/auth/sign-in`
- `/auth/callback`

### 4.2 App routes
- `/app`
- `/app/dashboard`
- `/app/agents`
- `/app/agents/new`
- `/app/templates`
- `/app/test-lab`
- `/app/settings`

### 4.3 Agent scoped routes
- `/app/agents/[agentId]/overview`
- `/app/agents/[agentId]/spec`
- `/app/agents/[agentId]/capabilities`
- `/app/agents/[agentId]/instructions`
- `/app/agents/[agentId]/knowledge`
- `/app/agents/[agentId]/tools`
- `/app/agents/[agentId]/testing`
- `/app/agents/[agentId]/versions`
- `/app/agents/[agentId]/deploy`

### 4.4 Version scoped routes
- `/app/agents/[agentId]/versions/[versionId]`
- `/app/agents/[agentId]/versions/[versionId]/diff`

### 4.5 Routing rules
- All `/app/**` routes require auth.
- Agent routes verify ownership server-side.
- 404 on unauthorized access without leaking existence.

---

## 5. App Shell and Global Layout

### 5.1 AppShell structure
- **Desktop**
  - Left sidebar (primary nav)
  - Top bar (search, command palette, user menu)
  - Main content with page-level header
- **Mobile**
  - Top bar with hamburger
  - Slide-in drawer for nav
  - Sticky primary action button in high-action pages

### 5.2 Global nav items
- Dashboard
- Agents
- Templates
- Test Lab
- Settings

### 5.3 Agent context sidebar
Visible when inside an agent.
Steps with status badge:
1. Overview
2. Specification
3. Capabilities
4. Instructions
5. Knowledge
6. Tools
7. Testing
8. Versions
9. Deploy

### 5.4 Command palette
Hotkey: `Ctrl/Cmd + K`
Actions:
- Create agent
- Create from template
- Jump to agent step
- Generate missing spec blocks
- Run test suite
- Publish version
- Export package

---

## 6. Design System Specification

### 6.1 Tokens
- Color tokens:
  - `bg`, `fg`, `muted`, `accent`, `success`, `warning`, `danger`
- Elevation ladder:
  - `shadow-xs` to `shadow-lg`
- Radius scale:
  - `rounded-lg`, `rounded-xl`, `rounded-2xl`
- Spacing scale:
  - 2, 4, 6, 8, 12, 16, 24, 32

### 6.2 Typography
- Display
- H1, H2, H3
- Body
- Caption
- Code

### 6.3 Motion
- Micro transitions only.
- Respect reduced-motion.

### 6.4 State design
Every interactive component must define:
- Loading
- Empty
- Error
- Success

---

## 7. Component Registry

### 7.1 Shared UI components
- `AppShell`
- `SidebarNav`
- `TopBar`
- `Breadcrumbs`
- `CommandPalette`
- `SmartStepper`
- `AutosaveIndicator`
- `CompletionMeter`
- `QualityGauge`
- `StatusPill`
- `EmptyState`
- `InlineAIButton`
- `ConfirmDialog`
- `ToastSystem`

### 7.2 Spec system components
- `SpecBlockForm`
- `SpecBlockHeader`
- `SpecCoachPanel`
- `SpecCompletenessCard`
- `SpecConflictBanner`
- `SpecExampleEditor`

### 7.3 Capabilities components
- `CapabilityMatrix`
- `CapabilityCard`
- `CapabilityRuleHints`

### 7.4 Instructions components
- `PromptLayerTabs`
- `PromptReadView`
- `PromptTraceMap`
- `LintPanel`
- `DiffViewer`

### 7.5 Knowledge components
- `KnowledgeUploadZone`
- `KnowledgeSourceList`
- `FilePreviewModal`
- `CoverageIndicator`

### 7.6 Testing components
- `SandboxChat`
- `TestCaseList`
- `TestRunnerPanel`
- `RunSummaryCard`

### 7.7 Versions components
- `VersionTimeline`
- `VersionCard`
- `ScoreTrendMiniChart`

### 7.8 Deploy components
- `ExportCard`
- `SharingPanel`
- `APIKeyPlaceholderPanel` (V1 schema-only)

---

## 8. Page-by-Page UX and Layout Specification

Each page includes purpose, primary components, automation, desktop and mobile layout rules.

### 8.1 Landing
**Purpose**
- Explain spec-to-prompt compiler.
- Drive sign-up.

**Components**
- Hero with two CTAs.
- Pipeline visual: Spec → Prompt → Tests → Version.
- Template highlights.

**Automation**
- “Try example spec” preview.

**Layout**
- Desktop: two-column hero.
- Mobile: stacked blocks, pipeline collapses to cards.

---

### 8.2 Dashboard
**Purpose**
- Show next best actions.
- Reduce user planning.

**Components**
- Drafts needing edits.
- Publish readiness alerts.
- Recent test failures.
- Quick create.

**Automation**
- 3-question quick start:
  - Goal
  - Audience
  - Output type
  Produces a full draft spec.

**Layout**
- Desktop: 12-column grid.
- Mobile: stacked cards + sticky Create.

---

### 8.3 Agents list
**Purpose**
- Manage inventory.

**Components**
- Search.
- Status filters.
- Grid/List toggle.

**Automation**
- One-click “Duplicate with new goal”.

**Layout**
- Desktop: table header with bulk actions.
- Mobile: filter bottom sheet.

---

### 8.4 Agent Overview
**Purpose**
- Single pane of truth.

**Components**
- Spec completeness gauge.
- Quality score summary.
- Knowledge status.
- Latest version preview.
- Blockers list.

**Automation**
- “Fix top 3 blockers” guided micro-flow.

**Layout**
- Desktop: two-column.
- Mobile: stacked.

---

### 8.5 Specification page
**Purpose**
- High-quality requirements capture.

**Spec blocks**
1. Mission
2. Audience
3. Scope
4. Inputs
5. Outputs
6. Constraints
7. Safety boundaries
8. Examples

**Components**
- Block forms.
- Side “Spec Coach”.
- Completeness meter.

**Automation**
- Generate each block.
- Tighten scope.
- Auto-detect contradictions.

**Layout**
- Desktop: form + coach side panel.
- Mobile: coach as drawer.

---

### 8.6 Capabilities page
**Purpose**
- Declare and constrain agent power.

**Categories**
- Information
- Production
- Decision support
- Automation
- Domain-specific

**Rules**
- Enabling a capability requires specific spec fields.
- Missing requirements produce blockers.

**Automation**
- Recommend capabilities from spec + templates.

**Layout**
- Desktop: matrix + rule hints panel.
- Mobile: card list.

---

### 8.7 Instructions page
**Purpose**
- Show trusted generated prompt package.

**Layers**
- System backbone
- Domain manual
- Output contracts
- Tool policy
- Examples

**Components**
- Layer tabs.
- Trace map.
- Lint panel.
- Expert edit gate.

**Automation**
- Regenerate with improvements.
- Apply suggested fixes.

**Layout**
- Desktop: split view.
- Mobile: tab-first.

---

### 8.8 Knowledge page
**Purpose**
- Attach real sources.

**Components**
- Upload zone.
- Source list with tags.
- Preview modal.

**Automation**
- Auto-tag.
- Auto-summary preview.

**Layout**
- Desktop: two-pane.
- Mobile: list + modal.

---

### 8.9 Tools page
**Purpose**
- Define tool policy now.
- Enable easy V2 integrations.

**Components**
- Tool toggles (schema-backed).
- Policy blocks.

**Automation**
- Generate tool rules from capabilities.

**Layout**
- Simple cards.

---

### 8.10 Testing page
**Purpose**
- Validate behavior.

**Components**
- Sandbox chat tied to draft or version.
- Test case builder.
- Run output.

**Automation**
- Generate test suite from spec.
- Add safety tests automatically.

**Layout**
- Desktop: tri-pane.
- Mobile: segmented tabs.

---

### 8.11 Versions page
**Purpose**
- Control release lifecycle.

**Components**
- Timeline.
- Version cards.
- Score trends.

**Automation**
- “Promote latest passing version”.

**Layout**
- Desktop: timeline with detail panel.
- Mobile: stacked timeline.

---

### 8.12 Deploy and Export page
**Purpose**
- Provide usable artifacts.

**Exports**
- Agent config JSON.
- Prompt package JSON.
- Test report JSON/MD.

**Automation**
- “Export full bundle”.

**Layout**
- Desktop: export cards.
- Mobile: stacked.

---

## 9. Spec Schema

### 9.1 `spec_json` canonical structure
```json
{
  "mission": {
    "problem": "",
    "success_criteria": [],
    "non_goals": []
  },
  "audience": {
    "persona": "",
    "skill_level": "",
    "language": "",
    "tone": ""
  },
  "scope": {
    "must_do": [],
    "should_do": [],
    "nice_to_have": [],
    "out_of_scope": []
  },
  "io_contracts": {
    "inputs": [
      {"name": "", "format": "", "constraints": []}
    ],
    "outputs": {
      "format": "",
      "sections": [],
      "style_rules": []
    }
  },
  "constraints": {
    "length": "",
    "citation_policy": "",
    "verification": ""
  },
  "safety": {
    "refusals": [],
    "sensitive_topics": []
  },
  "examples": {
    "good": [],
    "bad": []
  },
  "metadata": {
    "domain_tags": [],
    "template_id": null
  }
}
```

---

## 10. Prompt Compiler Specification

### 10.1 Inputs
- `spec_json`
- `capabilities_json`
- knowledge map
- tool toggles

### 10.2 Outputs
- `prompt_package_json`:
  - `system_backbone`
  - `domain_manual`
  - `output_contracts`
  - `tool_policy`
  - `examples`

### 10.3 Compilation stages
1. Normalize text and lists.
2. Validate minimal completeness.
3. Build requirement graph.
4. Expand into policy statements.
5. Generate layered prompts.
6. Run lint rules.
7. Compute score.
8. Produce suggested actions.

### 10.4 Determinism controls
- Use stable templates for system layers.
- Only inject spec-specific deltas.

---

## 11. Lint Rules and Quality Scoring

### 11.1 Lint severity
- Critical
- High
- Medium
- Low

### 11.2 Critical rules
- Missing mission problem.
- No success criteria.
- No out-of-scope list.
- No output contract.
- Contradictory constraints.

### 11.3 Score rubric
Weights:
- Spec completeness 30%
- Instruction clarity 25%
- Safety clarity 15%
- Output contract strength 15%
- Test coverage 15%

Block publish under threshold.

---

## 12. Testing Specification

### 12.1 Test case model
```json
{
  "name": "",
  "type": "functional|safety|regression",
  "input": {"messages": []},
  "expected": {
    "must_include": [],
    "must_not_include": [],
    "traits": []
  }
}
```

### 12.2 Test run logic
- Runs against:
  - Draft prompt package or
  - Version prompt package
- Stores:
  - pass/fail per case
  - aggregated pass rate

### 12.3 E2E flows
- Sign in.
- Create agent from template.
- Autosave spec.
- Generate prompt.
- Generate tests.
- Run tests.
- Publish.
- Export.

---

## 13. Database Specification

### 13.1 Tables overview
- `users`
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

### 13.2 Key constraints
- `agent_versions` immutable after publish.
- `agent_drafts` single active per agent.

### 13.3 Indexing
- `agents(owner_id, updated_at)`
- `agent_versions(agent_id, version_number)`
- `test_runs(agent_version_id, created_at)`

### 13.4 RLS policy spec
- Users can read/write only their own rows.
- Version rows are read-only for owners.

---

## 14. Storage Specification

### 14.1 Buckets
- `agent-knowledge`
- `agent-exports`

### 14.2 Path schema
- `{userId}/{agentId}/{fileId}/{filename}`

### 14.3 Metadata
Store in `files`:
- provider
- object_key
- mime
- checksum
- size

---

## 15. Authentication Specification

### 15.1 Methods
- Email magic link
- OAuth optional

### 15.2 Session
- Server-side session validation.
- Route guard in middleware.

---

## 16. API Contracts

### 16.1 Server Actions
- `createAgent`
- `updateAgentMeta`
- `saveDraftSpec`
- `saveDraftCapabilities`
- `compileDraft`
- `createTestCasesFromSpec`
- `runTests`
- `publishVersion`
- `exportBundle`
- `uploadKnowledgeFile`

### 16.2 Route handlers
- `/api/storage/signed-upload`
- `/api/storage/signed-download`
- `/api/ai/stream`
- `/api/webhooks/*` reserved

---

## 17. State Management Rules

- Prefer server components for read.
- Use client components only for:
  - Forms
  - Live editors
  - Chat
- Autosave:
  - Debounced
  - Idempotent
  - With optimistic UI

---

## 18. Performance Budgets

- First contentful paint under 2s on mid devices.
- Avoid blocking AI calls on navigation.
- Lazy-load Monaco.
- Virtualize lists for agents and tests.

---

## 19. Accessibility Specification

- Keyboard nav for all flows.
- Visible focus ring.
- Skip-to-content.
- ARIA labels for icon buttons.
- Contrast checks.
- Reduced motion support.

---

## 20. Security Specification

- RLS enforced.
- Validate all user input with Zod.
- Strip HTML from spec fields unless explicitly allowed.
- Rate-limit AI routes.
- Signed URLs for private files.
- Audit logs for:
  - publish
  - export
  - knowledge changes

---

## 21. Telemetry

### 21.1 Events
- `agent_created`
- `spec_block_generated`
- `lint_blocker_resolved`
- `tests_generated`
- `tests_run`
- `version_published`
- `export_downloaded`

### 21.2 목적
- Identify drop-off.
- Improve automation prompts.

---

## 22. Cursor Agent on VS Code
### 22.1 Workspace layout
- `apps/web`
- `packages/ui`
- `packages/core`
- `packages/db`

### 22.2 Agent instructions
- Implement strictly from this spec.
- Use Supabase first.
- Do not create mock repositories.
- Do not seed fake data for UI previews.
- Every page must be wired to real data.

### 22.3 Definition of done
- E2E tests passing.
- Publish locks version.
- Export returns valid JSON files.
- Mobile layouts validated per page.

---

## 23. Rollout Plan

### Phase 1
- App shell
- Auth
- Agents list + overview
- DB schema + RLS

### Phase 2
- Spec system + autosave
- Basic compiler

### Phase 3
- Capabilities + rules engine
- Lint + scoring

### Phase 4
- Knowledge uploads

### Phase 5
- Testing lab

### Phase 6
- Versions + diff + publish gate

### Phase 7
- Export bundle
- Telemetry polish

---

## 24. Appendix. Required UI states per page

For each page:
- Skeleton loading state
- Empty state with one-click action
- Error state with retry
- Success state with next recommended action

---

## 25. Appendix. Export bundle format

### `agent-config.json`
- agent meta
- active version id
- capabilities

### `prompt-package.json`
- layered prompts
- tool policy
- examples

### `test-report.json`
- cases
- results
- pass rate
- score snapshot

---

## 26. Summary

This specification defines:
- Full routes and navigation model.
- Premium design system and component registry.
- Spec schema, compiler pipeline, lint rules, and scoring.
- Real DB, real storage, real auth.
- Page-by-page desktop and mobile layouts.
- Cursor Agent development constraints with strict no-mock enforcement.
