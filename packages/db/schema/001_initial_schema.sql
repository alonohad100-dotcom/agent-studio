-- Agent Studio Database Schema
-- Version: 1.0
-- Date: 2025-12-10
-- Description: Initial database schema for Agent Studio

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- CORE TABLES
-- ============================================================================

-- Agents table
-- Stores agent metadata and ownership
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

-- Agent drafts table
-- Stores working draft of agent spec and capabilities
-- One active draft per agent
CREATE TABLE agent_drafts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
  spec_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  capabilities_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(agent_id)
);

-- Agent versions table
-- Immutable snapshots of published agents
CREATE TABLE agent_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
  version_number INTEGER NOT NULL,
  spec_snapshot JSONB NOT NULL,
  prompt_package JSONB NOT NULL,
  capabilities JSONB NOT NULL,
  knowledge_map JSONB,
  quality_score INTEGER NOT NULL CHECK (quality_score >= 0 AND quality_score <= 100),
  test_pass_rate DECIMAL(5,2),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by UUID NOT NULL REFERENCES auth.users(id),
  UNIQUE(agent_id, version_number)
);

-- Agent spec snapshots table
-- Historical snapshots of specs (for versioning)
CREATE TABLE agent_spec_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
  version_id UUID REFERENCES agent_versions(id) ON DELETE SET NULL,
  spec_json JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by UUID NOT NULL REFERENCES auth.users(id)
);

-- Prompt packages table
-- Stores compiled prompt packages
CREATE TABLE prompt_packages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_version_id UUID REFERENCES agent_versions(id) ON DELETE CASCADE,
  agent_draft_id UUID REFERENCES agent_drafts(id) ON DELETE CASCADE,
  package_json JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CHECK (
    (agent_version_id IS NOT NULL AND agent_draft_id IS NULL) OR
    (agent_version_id IS NULL AND agent_draft_id IS NOT NULL)
  )
);

-- Prompt lint findings table
-- Stores lint results for prompt packages
CREATE TABLE prompt_lint_findings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prompt_package_id UUID NOT NULL REFERENCES prompt_packages(id) ON DELETE CASCADE,
  rule_id TEXT NOT NULL,
  severity TEXT NOT NULL CHECK (severity IN ('critical', 'high', 'medium', 'low')),
  message TEXT NOT NULL,
  block TEXT,
  field TEXT,
  suggestion TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Quality scores table
-- Stores quality score calculations
CREATE TABLE quality_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_version_id UUID REFERENCES agent_versions(id) ON DELETE CASCADE,
  agent_draft_id UUID REFERENCES agent_drafts(id) ON DELETE CASCADE,
  overall_score INTEGER NOT NULL CHECK (overall_score >= 0 AND overall_score <= 100),
  spec_completeness INTEGER NOT NULL CHECK (spec_completeness >= 0 AND spec_completeness <= 100),
  instruction_clarity INTEGER NOT NULL CHECK (instruction_clarity >= 0 AND instruction_clarity <= 100),
  safety_clarity INTEGER NOT NULL CHECK (safety_clarity >= 0 AND safety_clarity <= 100),
  output_contract_strength INTEGER NOT NULL CHECK (output_contract_strength >= 0 AND output_contract_strength <= 100),
  test_coverage INTEGER NOT NULL CHECK (test_coverage >= 0 AND test_coverage <= 100),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CHECK (
    (agent_version_id IS NOT NULL AND agent_draft_id IS NULL) OR
    (agent_version_id IS NULL AND agent_draft_id IS NOT NULL)
  )
);

-- ============================================================================
-- KNOWLEDGE & FILES
-- ============================================================================

-- Files table
-- Stores metadata for uploaded files
CREATE TABLE files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  provider TEXT NOT NULL DEFAULT 'supabase',
  object_key TEXT NOT NULL,
  mime TEXT,
  checksum TEXT,
  size BIGINT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by UUID NOT NULL REFERENCES auth.users(id)
);

-- Knowledge sources table
-- Links files to agents and spec blocks
CREATE TABLE knowledge_sources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
  file_id UUID NOT NULL REFERENCES files(id) ON DELETE CASCADE,
  spec_block_tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- TESTING
-- ============================================================================

-- Test cases table
-- Stores test case definitions
CREATE TABLE test_cases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('functional', 'safety', 'regression')),
  input JSONB NOT NULL,
  expected JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by UUID NOT NULL REFERENCES auth.users(id)
);

-- Test runs table
-- Stores test execution results
CREATE TABLE test_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
  agent_version_id UUID REFERENCES agent_versions(id) ON DELETE SET NULL,
  agent_draft_id UUID REFERENCES agent_drafts(id) ON DELETE SET NULL,
  results JSONB NOT NULL,
  pass_rate DECIMAL(5,2) NOT NULL CHECK (pass_rate >= 0 AND pass_rate <= 100),
  total_tests INTEGER NOT NULL CHECK (total_tests >= 0),
  passed_tests INTEGER NOT NULL CHECK (passed_tests >= 0),
  failed_tests INTEGER NOT NULL CHECK (failed_tests >= 0),
  duration_ms INTEGER NOT NULL CHECK (duration_ms >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by UUID NOT NULL REFERENCES auth.users(id),
  CHECK (
    (agent_version_id IS NOT NULL AND agent_draft_id IS NULL) OR
    (agent_version_id IS NULL AND agent_draft_id IS NOT NULL)
  )
);

-- ============================================================================
-- AUDIT & LOGGING
-- ============================================================================

-- Audit logs table
-- Stores audit trail for important actions
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID REFERENCES agents(id) ON DELETE SET NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  action TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- INDEXES
-- ============================================================================

-- Agents indexes
CREATE INDEX idx_agents_owner_updated ON agents(owner_id, updated_at DESC);
CREATE INDEX idx_agents_status ON agents(status);
CREATE INDEX idx_agents_created ON agents(created_at DESC);

-- Agent drafts indexes
CREATE INDEX idx_agent_drafts_agent ON agent_drafts(agent_id);
CREATE INDEX idx_agent_drafts_updated ON agent_drafts(updated_at DESC);

-- Agent versions indexes
CREATE INDEX idx_agent_versions_agent ON agent_versions(agent_id, version_number DESC);
CREATE INDEX idx_agent_versions_created ON agent_versions(created_at DESC);

-- Prompt packages indexes
CREATE INDEX idx_prompt_packages_version ON prompt_packages(agent_version_id);
CREATE INDEX idx_prompt_packages_draft ON prompt_packages(agent_draft_id);

-- Lint findings indexes
CREATE INDEX idx_lint_findings_package ON prompt_lint_findings(prompt_package_id);
CREATE INDEX idx_lint_findings_severity ON prompt_lint_findings(severity);

-- Quality scores indexes
CREATE INDEX idx_quality_scores_version ON quality_scores(agent_version_id);
CREATE INDEX idx_quality_scores_draft ON quality_scores(agent_draft_id);

-- Files indexes
CREATE INDEX idx_files_agent ON files(agent_id);
CREATE INDEX idx_files_created ON files(created_at DESC);

-- Knowledge sources indexes
CREATE INDEX idx_knowledge_sources_agent ON knowledge_sources(agent_id);
CREATE INDEX idx_knowledge_sources_file ON knowledge_sources(file_id);

-- Test cases indexes
CREATE INDEX idx_test_cases_agent ON test_cases(agent_id);
CREATE INDEX idx_test_cases_type ON test_cases(type);

-- Test runs indexes
CREATE INDEX idx_test_runs_agent_version ON test_runs(agent_version_id, created_at DESC);
CREATE INDEX idx_test_runs_agent_draft ON test_runs(agent_draft_id, created_at DESC);
CREATE INDEX idx_test_runs_agent ON test_runs(agent_id, created_at DESC);

-- Audit logs indexes
CREATE INDEX idx_audit_logs_agent ON audit_logs(agent_id, created_at DESC);
CREATE INDEX idx_audit_logs_user ON audit_logs(user_id, created_at DESC);
CREATE INDEX idx_audit_logs_action ON audit_logs(action, created_at DESC);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_drafts ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_spec_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE prompt_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE prompt_lint_findings ENABLE ROW LEVEL SECURITY;
ALTER TABLE quality_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE files ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Agents policies
CREATE POLICY "Users can read own agents"
  ON agents FOR SELECT
  USING (auth.uid() = owner_id);

CREATE POLICY "Users can insert own agents"
  ON agents FOR INSERT
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can update own agents"
  ON agents FOR UPDATE
  USING (auth.uid() = owner_id);

CREATE POLICY "Users can delete own agents"
  ON agents FOR DELETE
  USING (auth.uid() = owner_id);

-- Agent drafts policies
CREATE POLICY "Users can read own agent drafts"
  ON agent_drafts FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM agents
      WHERE agents.id = agent_drafts.agent_id
      AND agents.owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own agent drafts"
  ON agent_drafts FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM agents
      WHERE agents.id = agent_drafts.agent_id
      AND agents.owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own agent drafts"
  ON agent_drafts FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM agents
      WHERE agents.id = agent_drafts.agent_id
      AND agents.owner_id = auth.uid()
    )
  );

-- Agent versions policies (read-only for owners)
CREATE POLICY "Users can read own agent versions"
  ON agent_versions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM agents
      WHERE agents.id = agent_versions.agent_id
      AND agents.owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own agent versions"
  ON agent_versions FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM agents
      WHERE agents.id = agent_versions.agent_id
      AND agents.owner_id = auth.uid()
    )
    AND created_by = auth.uid()
  );

-- Agent spec snapshots policies
CREATE POLICY "Users can read own spec snapshots"
  ON agent_spec_snapshots FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM agents
      WHERE agents.id = agent_spec_snapshots.agent_id
      AND agents.owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own spec snapshots"
  ON agent_spec_snapshots FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM agents
      WHERE agents.id = agent_spec_snapshots.agent_id
      AND agents.owner_id = auth.uid()
    )
    AND created_by = auth.uid()
  );

-- Prompt packages policies
CREATE POLICY "Users can read own prompt packages"
  ON prompt_packages FOR SELECT
  USING (
    (agent_version_id IS NOT NULL AND EXISTS (
      SELECT 1 FROM agent_versions
      JOIN agents ON agents.id = agent_versions.agent_id
      WHERE agent_versions.id = prompt_packages.agent_version_id
      AND agents.owner_id = auth.uid()
    )) OR
    (agent_draft_id IS NOT NULL AND EXISTS (
      SELECT 1 FROM agent_drafts
      JOIN agents ON agents.id = agent_drafts.agent_id
      WHERE agent_drafts.id = prompt_packages.agent_draft_id
      AND agents.owner_id = auth.uid()
    ))
  );

CREATE POLICY "Users can insert own prompt packages"
  ON prompt_packages FOR INSERT
  WITH CHECK (
    (agent_version_id IS NOT NULL AND EXISTS (
      SELECT 1 FROM agent_versions
      JOIN agents ON agents.id = agent_versions.agent_id
      WHERE agent_versions.id = prompt_packages.agent_version_id
      AND agents.owner_id = auth.uid()
    )) OR
    (agent_draft_id IS NOT NULL AND EXISTS (
      SELECT 1 FROM agent_drafts
      JOIN agents ON agents.id = agent_drafts.agent_id
      WHERE agent_drafts.id = prompt_packages.agent_draft_id
      AND agents.owner_id = auth.uid()
    ))
  );

-- Prompt lint findings policies
CREATE POLICY "Users can read own lint findings"
  ON prompt_lint_findings FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM prompt_packages
      WHERE prompt_packages.id = prompt_lint_findings.prompt_package_id
      AND (
        (prompt_packages.agent_version_id IS NOT NULL AND EXISTS (
          SELECT 1 FROM agent_versions
          JOIN agents ON agents.id = agent_versions.agent_id
          WHERE agent_versions.id = prompt_packages.agent_version_id
          AND agents.owner_id = auth.uid()
        )) OR
        (prompt_packages.agent_draft_id IS NOT NULL AND EXISTS (
          SELECT 1 FROM agent_drafts
          JOIN agents ON agents.id = agent_drafts.agent_id
          WHERE agent_drafts.id = prompt_packages.agent_draft_id
          AND agents.owner_id = auth.uid()
        ))
      )
    )
  );

CREATE POLICY "Users can insert own lint findings"
  ON prompt_lint_findings FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM prompt_packages
      WHERE prompt_packages.id = prompt_lint_findings.prompt_package_id
      AND (
        (prompt_packages.agent_version_id IS NOT NULL AND EXISTS (
          SELECT 1 FROM agent_versions
          JOIN agents ON agents.id = agent_versions.agent_id
          WHERE agent_versions.id = prompt_packages.agent_version_id
          AND agents.owner_id = auth.uid()
        )) OR
        (prompt_packages.agent_draft_id IS NOT NULL AND EXISTS (
          SELECT 1 FROM agent_drafts
          JOIN agents ON agents.id = agent_drafts.agent_id
          WHERE agent_drafts.id = prompt_packages.agent_draft_id
          AND agents.owner_id = auth.uid()
        ))
      )
    )
  );

-- Quality scores policies
CREATE POLICY "Users can read own quality scores"
  ON quality_scores FOR SELECT
  USING (
    (agent_version_id IS NOT NULL AND EXISTS (
      SELECT 1 FROM agent_versions
      JOIN agents ON agents.id = agent_versions.agent_id
      WHERE agent_versions.id = quality_scores.agent_version_id
      AND agents.owner_id = auth.uid()
    )) OR
    (agent_draft_id IS NOT NULL AND EXISTS (
      SELECT 1 FROM agent_drafts
      JOIN agents ON agents.id = agent_drafts.agent_id
      WHERE agent_drafts.id = quality_scores.agent_draft_id
      AND agents.owner_id = auth.uid()
    ))
  );

CREATE POLICY "Users can insert own quality scores"
  ON quality_scores FOR INSERT
  WITH CHECK (
    (agent_version_id IS NOT NULL AND EXISTS (
      SELECT 1 FROM agent_versions
      JOIN agents ON agents.id = agent_versions.agent_id
      WHERE agent_versions.id = quality_scores.agent_version_id
      AND agents.owner_id = auth.uid()
    )) OR
    (agent_draft_id IS NOT NULL AND EXISTS (
      SELECT 1 FROM agent_drafts
      JOIN agents ON agents.id = agent_drafts.agent_id
      WHERE agent_drafts.id = quality_scores.agent_draft_id
      AND agents.owner_id = auth.uid()
    ))
  );

-- Files policies
CREATE POLICY "Users can read own files"
  ON files FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM agents
      WHERE agents.id = files.agent_id
      AND agents.owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own files"
  ON files FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM agents
      WHERE agents.id = files.agent_id
      AND agents.owner_id = auth.uid()
    )
    AND created_by = auth.uid()
  );

CREATE POLICY "Users can update own files"
  ON files FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM agents
      WHERE agents.id = files.agent_id
      AND agents.owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own files"
  ON files FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM agents
      WHERE agents.id = files.agent_id
      AND agents.owner_id = auth.uid()
    )
  );

-- Knowledge sources policies
CREATE POLICY "Users can read own knowledge sources"
  ON knowledge_sources FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM agents
      WHERE agents.id = knowledge_sources.agent_id
      AND agents.owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own knowledge sources"
  ON knowledge_sources FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM agents
      WHERE agents.id = knowledge_sources.agent_id
      AND agents.owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own knowledge sources"
  ON knowledge_sources FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM agents
      WHERE agents.id = knowledge_sources.agent_id
      AND agents.owner_id = auth.uid()
    )
  );

-- Test cases policies
CREATE POLICY "Users can read own test cases"
  ON test_cases FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM agents
      WHERE agents.id = test_cases.agent_id
      AND agents.owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own test cases"
  ON test_cases FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM agents
      WHERE agents.id = test_cases.agent_id
      AND agents.owner_id = auth.uid()
    )
    AND created_by = auth.uid()
  );

CREATE POLICY "Users can update own test cases"
  ON test_cases FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM agents
      WHERE agents.id = test_cases.agent_id
      AND agents.owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own test cases"
  ON test_cases FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM agents
      WHERE agents.id = test_cases.agent_id
      AND agents.owner_id = auth.uid()
    )
  );

-- Test runs policies
CREATE POLICY "Users can read own test runs"
  ON test_runs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM agents
      WHERE agents.id = test_runs.agent_id
      AND agents.owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own test runs"
  ON test_runs FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM agents
      WHERE agents.id = test_runs.agent_id
      AND agents.owner_id = auth.uid()
    )
    AND created_by = auth.uid()
  );

-- Audit logs policies
CREATE POLICY "Users can read own audit logs"
  ON audit_logs FOR SELECT
  USING (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM agents
      WHERE agents.id = audit_logs.agent_id
      AND agents.owner_id = auth.uid()
    )
  );

CREATE POLICY "System can insert audit logs"
  ON audit_logs FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- ============================================================================
-- FUNCTIONS & TRIGGERS
-- ============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_agents_updated_at
  BEFORE UPDATE ON agents
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_agent_drafts_updated_at
  BEFORE UPDATE ON agent_drafts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_test_cases_updated_at
  BEFORE UPDATE ON test_cases
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

