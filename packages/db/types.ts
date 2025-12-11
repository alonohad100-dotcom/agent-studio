/**
 * Database Types
 * 
 * TypeScript types for the Agent Studio database schema
 * 
 * Note: These types should be generated from the actual Supabase schema
 * using: supabase gen types typescript --project-id <project-id> > types.ts
 * 
 * For now, we define them manually based on the schema.
 */

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type AgentStatus = 'draft' | 'published' | 'archived'
export type LintSeverity = 'critical' | 'high' | 'medium' | 'low'
export type TestCaseType = 'functional' | 'safety' | 'regression'

export interface Database {
  public: {
    Tables: {
      agents: {
        Row: {
          id: string
          owner_id: string
          name: string
          description: string | null
          status: AgentStatus
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          owner_id: string
          name: string
          description?: string | null
          status?: AgentStatus
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          owner_id?: string
          name?: string
          description?: string | null
          status?: AgentStatus
          created_at?: string
          updated_at?: string
        }
      }
      agent_drafts: {
        Row: {
          id: string
          agent_id: string
          spec_json: Json
          capabilities_json: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          agent_id: string
          spec_json?: Json
          capabilities_json?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          agent_id?: string
          spec_json?: Json
          capabilities_json?: Json
          created_at?: string
          updated_at?: string
        }
      }
      agent_versions: {
        Row: {
          id: string
          agent_id: string
          version_number: number
          spec_snapshot: Json
          prompt_package: Json
          capabilities: Json
          knowledge_map: Json | null
          quality_score: number
          test_pass_rate: number | null
          created_at: string
          created_by: string
        }
        Insert: {
          id?: string
          agent_id: string
          version_number: number
          spec_snapshot: Json
          prompt_package: Json
          capabilities: Json
          knowledge_map?: Json | null
          quality_score: number
          test_pass_rate?: number | null
          created_at?: string
          created_by: string
        }
        Update: {
          id?: string
          agent_id?: string
          version_number?: number
          spec_snapshot?: Json
          prompt_package?: Json
          capabilities?: Json
          knowledge_map?: Json | null
          quality_score?: number
          test_pass_rate?: number | null
          created_at?: string
          created_by?: string
        }
      }
      agent_spec_snapshots: {
        Row: {
          id: string
          agent_id: string
          version_id: string | null
          spec_json: Json
          created_at: string
          created_by: string
        }
        Insert: {
          id?: string
          agent_id: string
          version_id?: string | null
          spec_json: Json
          created_at?: string
          created_by: string
        }
        Update: {
          id?: string
          agent_id?: string
          version_id?: string | null
          spec_json?: Json
          created_at?: string
          created_by?: string
        }
      }
      prompt_packages: {
        Row: {
          id: string
          agent_version_id: string | null
          agent_draft_id: string | null
          package_json: Json
          created_at: string
        }
        Insert: {
          id?: string
          agent_version_id?: string | null
          agent_draft_id?: string | null
          package_json: Json
          created_at?: string
        }
        Update: {
          id?: string
          agent_version_id?: string | null
          agent_draft_id?: string | null
          package_json?: Json
          created_at?: string
        }
      }
      prompt_lint_findings: {
        Row: {
          id: string
          prompt_package_id: string
          rule_id: string
          severity: LintSeverity
          message: string
          block: string | null
          field: string | null
          suggestion: string | null
          created_at: string
        }
        Insert: {
          id?: string
          prompt_package_id: string
          rule_id: string
          severity: LintSeverity
          message: string
          block?: string | null
          field?: string | null
          suggestion?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          prompt_package_id?: string
          rule_id?: string
          severity?: LintSeverity
          message?: string
          block?: string | null
          field?: string | null
          suggestion?: string | null
          created_at?: string
        }
      }
      quality_scores: {
        Row: {
          id: string
          agent_version_id: string | null
          agent_draft_id: string | null
          overall_score: number
          spec_completeness: number
          instruction_clarity: number
          safety_clarity: number
          output_contract_strength: number
          test_coverage: number
          created_at: string
        }
        Insert: {
          id?: string
          agent_version_id?: string | null
          agent_draft_id?: string | null
          overall_score: number
          spec_completeness: number
          instruction_clarity: number
          safety_clarity: number
          output_contract_strength: number
          test_coverage: number
          created_at?: string
        }
        Update: {
          id?: string
          agent_version_id?: string | null
          agent_draft_id?: string | null
          overall_score?: number
          spec_completeness?: number
          instruction_clarity?: number
          safety_clarity?: number
          output_contract_strength?: number
          test_coverage?: number
          created_at?: string
        }
      }
      files: {
        Row: {
          id: string
          agent_id: string
          name: string
          provider: string
          object_key: string
          mime: string | null
          checksum: string | null
          size: number
          tags: string[]
          created_at: string
          created_by: string
        }
        Insert: {
          id?: string
          agent_id: string
          name: string
          provider?: string
          object_key: string
          mime?: string | null
          checksum?: string | null
          size: number
          tags?: string[]
          created_at?: string
          created_by: string
        }
        Update: {
          id?: string
          agent_id?: string
          name?: string
          provider?: string
          object_key?: string
          mime?: string | null
          checksum?: string | null
          size?: number
          tags?: string[]
          created_at?: string
          created_by?: string
        }
      }
      knowledge_sources: {
        Row: {
          id: string
          agent_id: string
          file_id: string
          spec_block_tags: string[]
          created_at: string
        }
        Insert: {
          id?: string
          agent_id: string
          file_id: string
          spec_block_tags?: string[]
          created_at?: string
        }
        Update: {
          id?: string
          agent_id?: string
          file_id?: string
          spec_block_tags?: string[]
          created_at?: string
        }
      }
      test_cases: {
        Row: {
          id: string
          agent_id: string
          name: string
          type: TestCaseType
          input: Json
          expected: Json
          created_at: string
          updated_at: string
          created_by: string
        }
        Insert: {
          id?: string
          agent_id: string
          name: string
          type: TestCaseType
          input: Json
          expected: Json
          created_at?: string
          updated_at?: string
          created_by: string
        }
        Update: {
          id?: string
          agent_id?: string
          name?: string
          type?: TestCaseType
          input?: Json
          expected?: Json
          created_at?: string
          updated_at?: string
          created_by?: string
        }
      }
      test_runs: {
        Row: {
          id: string
          agent_id: string
          agent_version_id: string | null
          agent_draft_id: string | null
          results: Json
          pass_rate: number
          total_tests: number
          passed_tests: number
          failed_tests: number
          duration_ms: number
          created_at: string
          created_by: string
        }
        Insert: {
          id?: string
          agent_id: string
          agent_version_id?: string | null
          agent_draft_id?: string | null
          results: Json
          pass_rate: number
          total_tests: number
          passed_tests: number
          failed_tests: number
          duration_ms: number
          created_at?: string
          created_by: string
        }
        Update: {
          id?: string
          agent_id?: string
          agent_version_id?: string | null
          agent_draft_id?: string | null
          results?: Json
          pass_rate?: number
          total_tests?: number
          passed_tests?: number
          failed_tests?: number
          duration_ms?: number
          created_at?: string
          created_by?: string
        }
      }
      audit_logs: {
        Row: {
          id: string
          agent_id: string | null
          user_id: string
          action: string
          metadata: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          agent_id?: string | null
          user_id: string
          action: string
          metadata?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          agent_id?: string | null
          user_id?: string
          action?: string
          metadata?: Json | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      agent_status: AgentStatus
      lint_severity: LintSeverity
      test_case_type: TestCaseType
    }
  }
}

// Convenience type exports
export type Agent = Database['public']['Tables']['agents']['Row']
export type AgentInsert = Database['public']['Tables']['agents']['Insert']
export type AgentUpdate = Database['public']['Tables']['agents']['Update']

export type AgentDraft = Database['public']['Tables']['agent_drafts']['Row']
export type AgentDraftInsert = Database['public']['Tables']['agent_drafts']['Insert']
export type AgentDraftUpdate = Database['public']['Tables']['agent_drafts']['Update']

export type AgentVersion = Database['public']['Tables']['agent_versions']['Row']
export type AgentVersionInsert = Database['public']['Tables']['agent_versions']['Insert']

export type File = Database['public']['Tables']['files']['Row']
export type FileInsert = Database['public']['Tables']['files']['Insert']
export type FileUpdate = Database['public']['Tables']['files']['Update']

export type TestCase = Database['public']['Tables']['test_cases']['Row']
export type TestCaseInsert = Database['public']['Tables']['test_cases']['Insert']
export type TestCaseUpdate = Database['public']['Tables']['test_cases']['Update']

export type TestRun = Database['public']['Tables']['test_runs']['Row']
export type TestRunInsert = Database['public']['Tables']['test_runs']['Insert']

export type AuditLog = Database['public']['Tables']['audit_logs']['Row']
export type AuditLogInsert = Database['public']['Tables']['audit_logs']['Insert']

