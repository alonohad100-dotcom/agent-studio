# Supabase Keys Setup Instructions

Based on your Supabase dashboard, here's what you need to do:

## ✅ Already Configured

1. **Project URL** - ✅ Added to `.env.local`
   - Value: `https://lmjvqwmzvwlxjjhgegaq.supabase.co`

## 🔑 Keys You Need to Copy

### Step 1: Get the Anon/Public Key

1. In your Supabase dashboard, go to **Settings** → **API**
2. Click on the tab: **"Legacy anon, service_role API keys"**
3. Find the **"Anonymous (anon) / Public Key"** section
4. Click the **Copy** button (two overlapping squares icon) next to the key
5. The key starts with `eyJhbGci...` and is very long
6. Paste it into `.env.local` as `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Step 2: Get the Service Role Key

1. Still on the **"Legacy anon, service_role API keys"** tab
2. Scroll down to **"Service Role / Secret Key"** section
3. ⚠️ **IMPORTANT:** Click the **eye icon** to reveal the full key
4. Click the **Copy** button to copy the complete key
5. Paste it into `.env.local` as `SUPABASE_SERVICE_ROLE_KEY`
6. ⚠️ **SECURITY WARNING:** This key can bypass Row Level Security - keep it secret!

## 📝 Quick Copy Checklist

- [ ] Copy **anon/public** key from "Legacy anon, service_role API keys" tab
- [ ] Paste into `.env.local` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] Click eye icon to reveal **service_role** key
- [ ] Copy **service_role** key
- [ ] Paste into `.env.local` → `SUPABASE_SERVICE_ROLE_KEY`
- [ ] Save `.env.local` file

## 🔍 How to Verify

After adding the keys, verify they're correct:

```bash
# Check that .env.local exists and has values
cat .env.local | grep SUPABASE

# Start the dev server (should not show missing env var errors)
pnpm dev
```

## ⚠️ Important Notes

1. **Never commit `.env.local`** - It's already in `.gitignore`
2. **Service Role Key is SECRET** - Never expose in client-side code
3. **Anon Key is Public** - Safe to use in browser (with RLS enabled)
4. **Keys are Long** - Make sure you copy the complete key (starts with `eyJhbGci...`)

## 🎯 Next Steps

Once you've added both keys:

1. ✅ Verify `.env.local` has all three Supabase values
2. ✅ Add your OpenAI API key (if you have it)
3. ✅ Run `pnpm dev` to test the connection
4. ✅ Proceed to Phase 1.2 (Database Schema) in [`../implementation/IMPLEMENTATION_PLAN.md`](../implementation/IMPLEMENTATION_PLAN.md)

