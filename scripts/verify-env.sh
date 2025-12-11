#!/bin/bash

# Environment Variables Verification Script
# Checks that all required environment variables are set

echo "🔍 Verifying Environment Variables..."
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Required variables
REQUIRED_VARS=(
  "NEXT_PUBLIC_SUPABASE_URL"
  "NEXT_PUBLIC_SUPABASE_ANON_KEY"
  "SUPABASE_SERVICE_ROLE_KEY"
  "OPENAI_API_KEY"
  "AI_PROVIDER"
  "NEXT_PUBLIC_APP_URL"
  "NODE_ENV"
)

# Optional variables
OPTIONAL_VARS=(
  "SENTRY_DSN"
)

# Check if .env.local exists
if [ ! -f .env.local ]; then
  echo -e "${RED}❌ .env.local file not found!${NC}"
  echo "Run: ./setup-env.sh to create it"
  exit 1
fi

echo -e "${GREEN}✅ .env.local file found${NC}"
echo ""

# Load environment variables
set -a
source .env.local
set +a

# Check required variables
MISSING=()
PRESENT=()

for var in "${REQUIRED_VARS[@]}"; do
  if [ -z "${!var}" ] || [ "${!var}" = "your-*-key-here" ] || [ "${!var}" = "your-*-url-here" ]; then
    MISSING+=("$var")
  else
    PRESENT+=("$var")
  fi
done

# Display results
if [ ${#MISSING[@]} -eq 0 ]; then
  echo -e "${GREEN}✅ All required environment variables are set!${NC}"
  echo ""
  echo "Configured variables:"
  for var in "${PRESENT[@]}"; do
    value="${!var}"
    # Mask sensitive values
    if [[ "$var" == *"KEY"* ]] || [[ "$var" == *"SECRET"* ]]; then
      masked="${value:0:10}...${value: -4}"
      echo -e "  ${GREEN}✓${NC} $var = $masked"
    else
      echo -e "  ${GREEN}✓${NC} $var = $value"
    fi
  done
else
  echo -e "${RED}❌ Missing or incomplete environment variables:${NC}"
  for var in "${MISSING[@]}"; do
    echo -e "  ${RED}✗${NC} $var"
  done
  echo ""
  echo "Please update .env.local with the correct values."
  exit 1
fi

# Check optional variables
echo ""
echo "Optional variables:"
for var in "${OPTIONAL_VARS[@]}"; do
  if [ -z "${!var}" ]; then
    echo -e "  ${YELLOW}○${NC} $var (not set)"
  else
    echo -e "  ${GREEN}✓${NC} $var (set)"
  fi
done

echo ""
echo -e "${GREEN}🎉 Environment configuration looks good!${NC}"
echo ""
echo "Next steps:"
echo "1. Start the dev server: pnpm dev"
echo "2. Test Supabase connection: http://localhost:3000/test-connection"
echo "3. Proceed to Phase 1.2: Database Schema setup"

