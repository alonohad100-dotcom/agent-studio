# Database Migrations

This directory contains SQL migration files for the Agent Studio database schema.

## Migration Files

- `001_initial_schema.sql` - Initial database schema with all tables, indexes, RLS policies, and triggers

## How to Apply Migrations

### Option 1: Using Supabase Dashboard (Recommended for Development)

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Copy the contents of `schema/001_initial_schema.sql`
4. Paste into the SQL Editor
5. Click **Run** to execute

### Option 2: Using Supabase CLI

```bash
# Install Supabase CLI if not already installed
npm install -g supabase

# Link to your project
supabase link --project-ref <your-project-ref>

# Apply migrations
supabase db push
```

### Option 3: Using psql

```bash
# Connect to your Supabase database
psql "postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"

# Run the migration
\i packages/db/schema/001_initial_schema.sql
```

## Verifying Migration

After applying the migration, verify:

1. All tables exist:
   ```sql
   SELECT table_name 
   FROM information_schema.tables 
   WHERE table_schema = 'public' 
   ORDER BY table_name;
   ```

2. RLS is enabled:
   ```sql
   SELECT tablename, rowsecurity 
   FROM pg_tables 
   WHERE schemaname = 'public';
   ```

3. Indexes are created:
   ```sql
   SELECT indexname, tablename 
   FROM pg_indexes 
   WHERE schemaname = 'public' 
   ORDER BY tablename, indexname;
   ```

## Generating TypeScript Types

After applying migrations, generate TypeScript types:

```bash
# Using Supabase CLI
supabase gen types typescript --project-id <your-project-id> > packages/db/types.ts

# Or manually update packages/db/types.ts with the generated types
```

## Rollback

To rollback the initial schema (⚠️ This will delete all data):

```sql
-- Drop all tables (in reverse dependency order)
DROP TABLE IF EXISTS audit_logs CASCADE;
DROP TABLE IF EXISTS test_runs CASCADE;
DROP TABLE IF EXISTS test_cases CASCADE;
DROP TABLE IF EXISTS knowledge_sources CASCADE;
DROP TABLE IF EXISTS files CASCADE;
DROP TABLE IF EXISTS quality_scores CASCADE;
DROP TABLE IF EXISTS prompt_lint_findings CASCADE;
DROP TABLE IF EXISTS prompt_packages CASCADE;
DROP TABLE IF EXISTS agent_spec_snapshots CASCADE;
DROP TABLE IF EXISTS agent_versions CASCADE;
DROP TABLE IF EXISTS agent_drafts CASCADE;
DROP TABLE IF EXISTS agents CASCADE;

-- Drop functions
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;
```

