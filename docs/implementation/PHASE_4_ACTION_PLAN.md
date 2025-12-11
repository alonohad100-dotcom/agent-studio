# Phase 4: Capabilities & Knowledge System - Action Plan

**Date:** 2025-12-10  
**Status:** Ready for Implementation  
**Prerequisites:** Phases 1-3 Complete ✅

---

## Overview

Phase 4 focuses on enabling capability selection and knowledge file management. This phase builds upon the solid foundation established in Phases 1-3.

**Estimated Effort:** 11-14 days (2-3 weeks)

---

## Prerequisites Status

✅ **Database Schema**: `files` and `knowledge_sources` tables already exist  
✅ **RLS Policies**: Already implemented for files and knowledge sources  
✅ **Storage Setup**: Supabase Storage bucket needs to be configured  
✅ **File Upload Infrastructure**: Needs to be built  

---

## Task Breakdown

### 4.1 Capabilities System (4-5 days)

#### Tasks

1. **Define Capabilities Schema**
   - [ ] Review and finalize `CapabilitiesJSON` type in `packages/core/types/capabilities.ts`
   - [ ] Ensure schema matches implementation plan requirements
   - [ ] Document capability structure

2. **Create Capabilities Page**
   - [ ] Create route: `/app/agents/[agentId]/capabilities`
   - [ ] Build page component: `apps/web/app/app/agents/[agentId]/capabilities/page.tsx`
   - [ ] Create client component: `apps/web/app/app/agents/[agentId]/capabilities/capabilities-page-client.tsx`

3. **Build Capability Matrix Component**
   - [ ] Create `apps/web/components/capabilities/CapabilityMatrix.tsx`
   - [ ] Implement capability toggle functionality
   - [ ] Display capability categories (information, production, decision_support, automation, domain_specific)
   - [ ] Add visual indicators for enabled/disabled capabilities

4. **Implement Capability Rules Engine**
   - [ ] Create `packages/core/capabilities/rules.ts`
   - [ ] Define capability rules (required spec fields per capability)
   - [ ] Implement `checkCapabilityRequirements()` function
   - [ ] Generate blockers when requirements missing

5. **Create Capability Components**
   - [ ] Build `CapabilityCard` component
   - [ ] Build `CapabilityRuleHints` panel
   - [ ] Display blockers when requirements not met

6. **Implement Recommendation Automation**
   - [ ] Create `recommendCapabilities()` function
   - [ ] Analyze spec to suggest relevant capabilities
   - [ ] Display recommendations in UI

7. **Create Server Actions**
   - [ ] Implement `saveDraftCapabilities(agentId, capabilitiesJson)` in `apps/web/lib/actions/drafts.ts`
   - [ ] Implement `getDraftCapabilities(agentId)` in `apps/web/lib/actions/drafts.ts`
   - [ ] Add validation and error handling

#### Acceptance Criteria

- ✅ Users can enable/disable capabilities
- ✅ Rules engine checks requirements
- ✅ Blockers display when requirements missing
- ✅ Recommendations suggest relevant capabilities
- ✅ Capabilities persist to `agent_drafts.capabilities_json`

#### Files to Create/Modify

**New Files:**
- `apps/web/app/app/agents/[agentId]/capabilities/page.tsx`
- `apps/web/app/app/agents/[agentId]/capabilities/capabilities-page-client.tsx`
- `apps/web/components/capabilities/CapabilityMatrix.tsx`
- `apps/web/components/capabilities/CapabilityCard.tsx`
- `apps/web/components/capabilities/CapabilityRuleHints.tsx`
- `packages/core/capabilities/rules.ts`
- `packages/core/capabilities/recommendations.ts`

**Modify:**
- `apps/web/lib/actions/drafts.ts` - Add capability actions
- `packages/core/types/capabilities.ts` - Ensure schema matches plan
- `apps/web/components/layout/SidebarNav.tsx` - Add capabilities link

---

### 4.2 Knowledge Upload System (5-6 days)

#### Tasks

1. **Set Up Supabase Storage**
   - [ ] Configure `agent-knowledge` bucket in Supabase
   - [ ] Set bucket to private with RLS enabled
   - [ ] Configure storage policies for file access
   - [ ] Test bucket access

2. **Verify Database Schema**
   - [ ] Confirm `files` table structure matches needs
   - [ ] Confirm `knowledge_sources` table structure
   - [ ] Verify RLS policies are correct

3. **Implement File Upload Server Action**
   - [ ] Create `uploadKnowledgeFile(agentId, file, metadata)` in `apps/web/lib/actions/knowledge.ts`
   - [ ] Implement file validation (type, size)
   - [ ] Generate file ID and storage path
   - [ ] Calculate checksum (SHA-256)
   - [ ] Upload to Supabase Storage
   - [ ] Save metadata to `files` table
   - [ ] Handle errors gracefully

4. **Create Signed URL Endpoints**
   - [ ] Create `/api/storage/signed-upload/route.ts` for upload URLs
   - [ ] Create `/api/storage/signed-download/route.ts` for download URLs
   - [ ] Implement auth and ownership verification
   - [ ] Set appropriate expiration times

5. **Build Knowledge Page**
   - [ ] Create route: `/app/agents/[agentId]/knowledge`
   - [ ] Build page component: `apps/web/app/app/agents/[agentId]/knowledge/page.tsx`
   - [ ] Create client component: `apps/web/app/app/agents/[agentId]/knowledge/knowledge-page-client.tsx`

6. **Create Knowledge Components**
   - [ ] Build `KnowledgeUploadZone` component (drag & drop)
   - [ ] Build `KnowledgeSourceList` component
   - [ ] Build `FilePreviewModal` component
   - [ ] Build `CoverageIndicator` component

7. **Implement File Metadata Extraction**
   - [ ] File type detection
   - [ ] Size calculation
   - [ ] Checksum generation
   - [ ] Basic auto-tagging (enhanced later)

8. **Create File Deletion Functionality**
   - [ ] Implement `deleteKnowledgeFile(fileId)` server action
   - [ ] Delete from storage
   - [ ] Delete metadata from database
   - [ ] Update knowledge sources

#### Acceptance Criteria

- ✅ Users can upload files (drag & drop)
- ✅ Files stored in Supabase Storage
- ✅ Metadata saved to database
- ✅ File list displays correctly
- ✅ Preview modal works
- ✅ RLS prevents unauthorized access
- ✅ File deletion works

#### Files to Create/Modify

**New Files:**
- `apps/web/app/app/agents/[agentId]/knowledge/page.tsx`
- `apps/web/app/app/agents/[agentId]/knowledge/knowledge-page-client.tsx`
- `apps/web/components/knowledge/KnowledgeUploadZone.tsx`
- `apps/web/components/knowledge/KnowledgeSourceList.tsx`
- `apps/web/components/knowledge/FilePreviewModal.tsx`
- `apps/web/components/knowledge/CoverageIndicator.tsx`
- `apps/web/lib/actions/knowledge.ts`
- `apps/web/app/api/storage/signed-upload/route.ts`
- `apps/web/app/api/storage/signed-download/route.ts`

**Modify:**
- `apps/web/components/layout/SidebarNav.tsx` - Add knowledge link

---

### 4.3 Knowledge Map Integration (2-3 days)

#### Tasks

1. **Create Knowledge Map Data Structure**
   - [ ] Define `KnowledgeMap` type in `packages/core/types/knowledge.ts`
   - [ ] Structure linking files to spec blocks
   - [ ] Document knowledge map format

2. **Link Knowledge Sources to Spec Blocks**
   - [ ] Update `knowledge_sources` table usage
   - [ ] Implement tagging system for spec blocks
   - [ ] Create UI for linking files to blocks

3. **Update Compiler to Include Knowledge Context**
   - [ ] Modify `PromptCompiler` to accept knowledge map
   - [ ] Update `generateDomainManual()` to include knowledge context
   - [ ] Integrate knowledge into prompt layers

4. **Build Coverage Indicators**
   - [ ] Update `CoverageIndicator` component
   - [ ] Show knowledge coverage per spec block
   - [ ] Display coverage status in spec page

#### Acceptance Criteria

- ✅ Knowledge sources linked to spec blocks
- ✅ Compiler includes knowledge in prompts
- ✅ Coverage indicators show status
- ✅ Knowledge map structure defined

#### Files to Create/Modify

**New Files:**
- `packages/core/types/knowledge.ts`

**Modify:**
- `packages/core/compiler/templates.ts` - Include knowledge in domain manual
- `packages/core/compiler/index.ts` - Accept knowledge map input
- `apps/web/lib/actions/compiler.ts` - Pass knowledge map to compiler
- `apps/web/components/knowledge/CoverageIndicator.tsx` - Show block coverage
- `apps/web/app/app/agents/[agentId]/spec/spec-page-client.tsx` - Display coverage

---

## Implementation Order

### Week 1: Capabilities System
1. Day 1-2: Capabilities schema and page structure
2. Day 3-4: Capability matrix and rules engine
3. Day 5: Recommendations and polish

### Week 2: Knowledge Upload
1. Day 1: Storage setup and file upload server action
2. Day 2-3: Knowledge page and upload components
3. Day 4: File preview and deletion
4. Day 5: Testing and polish

### Week 3: Knowledge Map Integration
1. Day 1: Knowledge map structure and linking
2. Day 2: Compiler integration
3. Day 3: Coverage indicators and testing

---

## Testing Checklist

### Capabilities System
- [ ] Can enable/disable capabilities
- [ ] Rules engine correctly identifies blockers
- [ ] Recommendations appear based on spec
- [ ] Capabilities persist correctly
- [ ] Blockers prevent invalid configurations

### Knowledge Upload
- [ ] Can upload files via drag & drop
- [ ] Files appear in list after upload
- [ ] File preview works for different file types
- [ ] File deletion removes from storage and DB
- [ ] RLS prevents unauthorized access
- [ ] Signed URLs work correctly

### Knowledge Map
- [ ] Can link files to spec blocks
- [ ] Compiler includes knowledge in prompts
- [ ] Coverage indicators show correct status
- [ ] Knowledge appears in domain manual layer

---

## Dependencies

### External
- Supabase Storage bucket configuration
- File type validation libraries (optional)
- File preview libraries (for preview modal)

### Internal
- Database schema (already exists ✅)
- RLS policies (already exist ✅)
- Compiler system (Phase 3 ✅)
- Spec system (Phase 2 ✅)

---

## Risk Mitigation

| Risk | Impact | Mitigation |
|------|--------|------------|
| Storage bucket misconfiguration | High | Test thoroughly, document setup steps |
| File upload size limits | Medium | Implement chunking if needed, validate file sizes |
| Storage costs | Medium | Monitor usage, implement cleanup policies |
| File type compatibility | Low | Support common types, graceful fallbacks |

---

## Definition of Done

**Phase 4 is complete when:**
- ✅ Capabilities system functional
- ✅ Knowledge uploads work
- ✅ Files stored securely
- ✅ Knowledge integrated into compiler
- ✅ All acceptance criteria met
- ✅ E2E tests passing (if applicable)
- ✅ No TypeScript errors
- ✅ No linting errors

---

## Next Phase Preview

**Phase 5: Testing Lab** will build upon Phase 4 and Phase 3 to enable:
- Test case management
- Test runner
- Sandbox chat
- Test results display

---

**Document Status:** Ready for Implementation  
**Last Updated:** 2025-12-10

