# API Keys & External Services Setup Guide

This document provides step-by-step instructions for obtaining all required API keys and setting up external services for Agent Studio.

---

## Required Services

### 1. Supabase (Database + Auth + Storage)
**Required for:** Database, Authentication, File Storage

### 2. OpenAI (AI Provider)
**Required for:** AI-powered features (Spec Coach, Prompt Generation, Test Generation)

---

## 1. Supabase Setup

### Step 1: Create Supabase Account
1. Go to [https://supabase.com](https://supabase.com)
2. Click **"Start your project"** or **"Sign up"**
3. Sign up with GitHub, Google, or email
4. Verify your email if required

### Step 2: Create a New Project
1. After logging in, click **"New Project"**
2. Fill in the project details:
   - **Name:** `agent-studio` (or your preferred name)
   - **Database Password:** Create a strong password (save this securely!)
   - **Region:** Choose the closest region to your users
   - **Pricing Plan:** Free tier is sufficient for development
3. Click **"Create new project"**
4. Wait 2-3 minutes for the project to be provisioned

### Step 3: Get Your API Keys
1. Once your project is ready, go to **Settings** → **API**
2. You'll find the following values:

#### Project URL
- Located under **"Project URL"**
- Example: `https://xxxxxxxxxxxxx.supabase.co`
- Copy this value → `NEXT_PUBLIC_SUPABASE_URL`

#### Anon/Public Key
- Located under **"Project API keys"** → **"anon"** or **"public"**
- This is safe to expose in client-side code
- Copy this value → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

#### Service Role Key
- Located under **"Project API keys"** → **"service_role"**
- ⚠️ **SECRET:** Never expose this in client-side code!
- Copy this value → `SUPABASE_SERVICE_ROLE_KEY`

### Step 4: Configure Storage Buckets
1. Go to **Storage** in the left sidebar
2. Click **"New bucket"**
3. Create bucket: `agent-knowledge`
   - **Name:** `agent-knowledge`
   - **Public bucket:** ❌ Unchecked (Private)
   - Click **"Create bucket"**
4. Create bucket: `agent-exports`
   - **Name:** `agent-exports`
   - **Public bucket:** ❌ Unchecked (Private)
   - Click **"Create bucket"**

### Step 5: Enable Email Auth
1. Go to **Authentication** → **Providers**
2. Find **"Email"** provider
3. Ensure it's **Enabled**
4. Configure email templates (optional for development):
   - Magic Link template
   - Confirmation email template

### Step 6: Set Up Database Schema
The database schema will be set up in Phase 1.2 of development. For now, you just need the connection.

**Summary of Supabase Values Needed:**
```env
NEXT_PUBLIC_SUPABASE_URL=https://lmjvqwmzvwlxjjhgegaq.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Your Project URL:** `https://lmjvqwmzvwlxjjhgegaq.supabase.co` ✅

---

## 2. OpenAI Setup

### Step 1: Create OpenAI Account
1. Go to [https://platform.openai.com](https://platform.openai.com)
2. Click **"Sign up"**
3. Create an account with email or Google
4. Verify your email and phone number

### Step 2: Add Payment Method
1. Go to **Settings** → **Billing**
2. Click **"Add payment method"**
3. Add a credit/debit card
   - ⚠️ **Note:** OpenAI charges per API usage. Monitor your usage!
   - Free tier includes $5 credit for new accounts

### Step 3: Create API Key
1. Go to **Settings** → **API keys**
2. Click **"Create new secret key"**
3. Give it a name (e.g., "Agent Studio Dev")
4. Copy the key immediately (you won't be able to see it again!)
   - Example: `sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`
5. Store it securely

### Step 4: Set Usage Limits (Recommended)
1. Go to **Settings** → **Limits**
2. Set a **Hard limit** to prevent unexpected charges
   - Recommended: $10-20/month for development
3. Set up **Usage alerts** to get notified when approaching limits

**Summary of OpenAI Values Needed:**
```env
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
AI_PROVIDER=openai
```

---

## 3. Optional: Sentry (Error Tracking)

### Step 1: Create Sentry Account
1. Go to [https://sentry.io](https://sentry.io)
2. Sign up for a free account
3. Create a new project:
   - **Platform:** Next.js
   - **Project Name:** `agent-studio`

### Step 2: Get DSN
1. After project creation, you'll see setup instructions
2. Copy the **DSN** value
   - Example: `https://xxxxxxxxxxxxx@xxxxxxxxxxxxx.ingest.sentry.io/xxxxxxxxxxxxx`

**Summary of Sentry Value (Optional):**
```env
SENTRY_DSN=https://xxxxxxxxxxxxx@xxxxxxxxxxxxx.ingest.sentry.io/xxxxxxxxxxxxx
```

---

## 4. Configure Environment Variables

### Step 1: Create `.env.local` File
```bash
cd /home/ohada/dev/Agent
cp .env.example .env.local
```

### Step 2: Add Your Keys
Open `.env.local` and fill in the values:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your-project-url-here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# AI Provider (OpenAI)
OPENAI_API_KEY=your-openai-api-key-here
AI_PROVIDER=openai

# App Config
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development

# Optional: Sentry
# SENTRY_DSN=your-sentry-dsn-here
```

### Step 3: Verify Setup
```bash
# Check that .env.local exists and is not committed to git
cat .env.local
git status  # .env.local should NOT appear in git status
```

---

## 5. Cost Estimates

### Supabase (Free Tier)
- ✅ **Free tier includes:**
  - 500 MB database
  - 1 GB file storage
  - 50,000 monthly active users
  - 2 GB bandwidth
- 💰 **Paid plans start at:** $25/month (if you exceed free tier)

### OpenAI
- 💰 **Pricing:**
  - GPT-4 Turbo: ~$0.01 per 1K input tokens, $0.03 per 1K output tokens
  - GPT-3.5 Turbo: ~$0.0005 per 1K input tokens, $0.0015 per 1K output tokens
- 📊 **Estimated monthly cost for development:** $5-20 (depending on usage)
- ⚠️ **Monitor usage** in OpenAI dashboard regularly!

### Sentry (Free Tier)
- ✅ **Free tier includes:**
  - 5,000 events/month
  - 1 project
- 💰 **Paid plans start at:** $26/month (if you exceed free tier)

---

## 6. Security Best Practices

### ✅ DO:
- ✅ Store API keys in `.env.local` (already in `.gitignore`)
- ✅ Use `NEXT_PUBLIC_` prefix only for client-safe keys
- ✅ Never commit `.env.local` to git
- ✅ Rotate keys if accidentally exposed
- ✅ Use environment-specific keys (dev, staging, prod)

### ❌ DON'T:
- ❌ Commit API keys to git
- ❌ Share API keys in screenshots or public channels
- ❌ Use production keys in development
- ❌ Expose service role keys in client code

---

## 7. Verification Checklist

Before starting development, verify:

- [ ] Supabase project created
- [ ] Supabase API keys obtained (URL, anon key, service role key)
- [ ] Storage buckets created (`agent-knowledge`, `agent-exports`)
- [ ] Email auth enabled in Supabase
- [ ] OpenAI account created
- [ ] OpenAI API key obtained
- [ ] Payment method added to OpenAI (if required)
- [ ] `.env.local` file created with all keys
- [ ] `.env.local` is in `.gitignore` (should not be tracked by git)
- [ ] Sentry account created (optional)

---

## 8. Testing Your Setup

Once you've added all keys to `.env.local`:

```bash
# Start the dev server
pnpm dev

# The server should start without errors
# Check the console for any missing environment variable warnings
```

---

## 9. Troubleshooting

### "Missing environment variable" errors
- Check that `.env.local` exists in the root directory
- Verify all required variables are set
- Restart the dev server after changing `.env.local`

### Supabase connection errors
- Verify `NEXT_PUBLIC_SUPABASE_URL` is correct (no trailing slash)
- Check that API keys are copied completely (no truncation)
- Ensure your Supabase project is active (not paused)

### OpenAI API errors
- Verify your API key is correct
- Check your OpenAI account has credits/balance
- Ensure payment method is added if required
- Check usage limits in OpenAI dashboard

### Storage bucket errors
- Verify buckets are created in Supabase dashboard
- Check bucket names match exactly: `agent-knowledge`, `agent-exports`
- Ensure buckets are set to private (not public)

---

## 10. Next Steps

After obtaining all API keys:

1. ✅ Add keys to `.env.local`
2. ✅ Verify setup with `pnpm dev`
3. ✅ Proceed to **Phase 1.2** of [IMPLEMENTATION_PLAN.md](../implementation/IMPLEMENTATION_PLAN.md) (Database Schema)
4. ✅ Set up database tables and RLS policies

---

## Quick Reference

**Minimum Required:**
- Supabase (URL, anon key, service role key)
- OpenAI (API key)

**Optional:**
- Sentry (DSN)

**Total Setup Time:** ~15-20 minutes

**Cost for Development:** 
- Supabase: Free
- OpenAI: ~$5-20/month
- Sentry: Free

---

**Need Help?**
- Supabase Docs: https://supabase.com/docs
- OpenAI Docs: https://platform.openai.com/docs
- Sentry Docs: https://docs.sentry.io

