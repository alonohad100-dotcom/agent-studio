# Supabase Configuration - Quick Reference

Based on your Supabase dashboard screenshots, here's what you need:

## ✅ Project URL (Already Identified)

```
NEXT_PUBLIC_SUPABASE_URL=https://lmjvqwmzvwlxjjhgegaq.supabase.co
```

## 🔑 API Keys to Copy

### 1. Anon/Public Key (Client-Side)

**Location in Dashboard:**
- Settings → API → Tab: **"Legacy anon, service_role API keys"**
- Section: **"Anonymous (anon) / Public Key"**

**What to do:**
1. Click the **Copy** button (two overlapping squares icon)
2. Copy the complete key (it's very long, starts with `eyJhbGci...`)
3. Paste into `.env.local` as `NEXT_PUBLIC_SUPABASE_ANON_KEY`

**Note:** This key is safe to use in browser code (with RLS enabled)

---

### 2. Service Role Key (Server-Side Only)

**Location in Dashboard:**
- Settings → API → Tab: **"Legacy anon, service_role API keys"**
- Section: **"Service Role / Secret Key"**

**What to do:**
1. Click the **eye icon** 👁️ to reveal the full key
2. Click the **Copy** button to copy the complete key
3. Paste into `.env.local` as `SUPABASE_SERVICE_ROLE_KEY`

**⚠️ CRITICAL WARNING:**
- This key can **bypass Row Level Security**
- **NEVER** expose it in client-side code
- **NEVER** commit it to git
- If leaked, regenerate it immediately

---

## 📝 Complete .env.local Template

Create `.env.local` in the root directory with:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://lmjvqwmzvwlxjjhgegaq.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=paste-your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=paste-your-service-role-key-here

# AI Provider (OpenAI)
OPENAI_API_KEY=your-openai-key-here
AI_PROVIDER=openai

# App Config
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

---

## 🚀 Quick Setup

Run the setup script:

```bash
./setup-env.sh
```

Then edit `.env.local` and add your keys.

---

## ✅ Verification

After adding keys, verify:

```bash
# Check environment variables are loaded
pnpm dev

# Should start without "Missing environment variable" errors
```

---

## 🔍 Where Keys Are Used in Code

### Client-Side (Browser)
- File: `apps/web/lib/supabase/client.ts`
- Uses: `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Server-Side (API Routes, Server Actions)
- File: `apps/web/lib/supabase/server.ts`
- Uses: `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Note: Service role key is used only for admin operations (not in current code)

### Middleware
- File: `apps/web/middleware.ts`
- Uses: `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

## 📸 Reference from Your Screenshots

**Screenshot 1:** Shows new API keys format (Publishable & Secret keys)
- You can use these, but the code is configured for legacy keys

**Screenshot 2:** Shows Legacy keys tab ← **USE THIS TAB**
- Anon/Public key section
- Service Role/Secret key section

**Screenshot 3:** Shows Project API page
- Project URL: `https://lmjvqwmzvwlxjjhgegaq.supabase.co` ✅
- Anon key (partially visible): `eyJhbGci...`

---

## 🎯 Next Steps

1. ✅ Run `./setup-env.sh` to create `.env.local`
2. ✅ Copy anon key from Supabase dashboard
3. ✅ Copy service_role key (click eye icon first)
4. ✅ Paste both keys into `.env.local`
5. ✅ Run `pnpm dev` to verify connection
6. ✅ Proceed to Phase 1.2 (Database Schema)

