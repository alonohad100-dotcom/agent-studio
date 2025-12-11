#!/bin/bash

# Database Migration Script
# Applies the initial schema to Supabase

set -e

echo "🚀 Applying database migration to Supabase..."
echo ""

# Check if .env.local exists
if [ ! -f .env.local ]; then
  echo "❌ .env.local file not found!"
  echo "Please create .env.local with your Supabase credentials"
  exit 1
fi

# Load environment variables
set -a
source .env.local
set +a

# Check required variables
if [ -z "$NEXT_PUBLIC_SUPABASE_URL" ] || [ -z "$SUPABASE_SERVICE_ROLE_KEY" ]; then
  echo "❌ Missing required environment variables!"
  echo "Need: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY"
  exit 1
fi

# Extract project reference from URL
PROJECT_REF=$(echo $NEXT_PUBLIC_SUPABASE_URL | sed 's|https://\([^.]*\)\.supabase\.co|\1|')

echo "📋 Project: $PROJECT_REF"
echo ""

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
  echo "⚠️  Supabase CLI not found"
  echo ""
  echo "Please apply the migration manually:"
  echo "1. Go to: https://supabase.com/dashboard/project/$PROJECT_REF/sql"
  echo "2. Copy contents of: packages/db/schema/001_initial_schema.sql"
  echo "3. Paste and run in SQL Editor"
  echo ""
  exit 0
fi

# Check if linked
if [ ! -f .supabase/config.toml ]; then
  echo "📌 Linking to Supabase project..."
  supabase link --project-ref "$PROJECT_REF" --password "$SUPABASE_SERVICE_ROLE_KEY" || {
    echo "❌ Failed to link project"
    echo "Please link manually: supabase link --project-ref $PROJECT_REF"
    exit 1
  }
fi

echo "✅ Applying migration..."
supabase db push || {
  echo "❌ Migration failed"
  exit 1
}

echo ""
echo "✅ Migration applied successfully!"
echo ""
echo "Next steps:"
echo "1. Verify tables in Supabase dashboard"
echo "2. Generate TypeScript types: supabase gen types typescript --project-id $PROJECT_REF > packages/db/types.ts"
echo "3. Test connection: pnpm dev -> http://localhost:3000/test-connection"

