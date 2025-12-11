#!/bin/bash

# Supabase Environment Setup Script
# This script helps you set up your .env.local file with Supabase credentials

echo "🔧 Setting up Supabase environment variables..."
echo ""

# Create .env.local if it doesn't exist
if [ ! -f .env.local ]; then
    echo "Creating .env.local file..."
    cat > .env.local << 'EOF'
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://lmjvqwmzvwlxjjhgegaq.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# AI Provider (OpenAI) - Required for AI features
OPENAI_API_KEY=your-openai-api-key-here
AI_PROVIDER=openai

# App Config
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development

# Optional: Sentry (Error Tracking)
# SENTRY_DSN=your-sentry-dsn-here
EOF
    echo "✅ .env.local file created!"
else
    echo "⚠️  .env.local already exists. Skipping creation."
fi

echo ""
echo "📋 Next steps:"
echo "1. Open .env.local in your editor"
echo "2. Copy your anon/public key from Supabase dashboard:"
echo "   - Go to: Settings > API > 'Legacy anon, service_role API keys' tab"
echo "   - Copy the 'Anonymous (anon) / Public Key'"
echo "   - Replace 'your-anon-key-here' with the actual key"
echo ""
echo "3. Copy your service_role key:"
echo "   - Still on the 'Legacy anon, service_role API keys' tab"
echo "   - Click the eye icon to reveal the Service Role key"
echo "   - Copy the full key"
echo "   - Replace 'your-service-role-key-here' with the actual key"
echo ""
echo "4. (Optional) Add your OpenAI API key if you have it"
echo ""
echo "✅ Project URL is already configured: https://lmjvqwmzvwlxjjhgegaq.supabase.co"
echo ""
echo "After updating .env.local, run: pnpm dev"

