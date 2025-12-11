# Quick Fix: Magic Link Authentication Redirect Issue

## 🎯 Problem

Magic link redirects to `localhost:3000` instead of production domain.

## ✅ Code Fixes (COMPLETED)

- ✅ Added `getAppUrl()` utility function with proper fallback logic
- ✅ Updated sign-in page to use environment-aware URL detection
- ✅ Updated dev-login page for consistency
- ✅ Code committed and pushed to GitHub

## ⚠️ REQUIRED: Configuration Steps

### 1. Vercel Environment Variables (5 minutes)

1. Go to: https://vercel.com/dashboard → Your Project → **Settings** → **Environment Variables**

2. Add/Update:

   ```
   NEXT_PUBLIC_APP_URL=https://your-vercel-domain.vercel.app
   ```

   Replace with your actual Vercel deployment URL (found in Deployments tab)

3. Set for: **Production**, **Preview**, **Development**

4. **Redeploy** (or wait for next commit)

---

### 2. Supabase Dashboard Configuration (5 minutes)

#### A. Update Site URL

1. Go to: https://supabase.com/dashboard → Your Project
2. **Authentication** → **URL Configuration**
3. **Site URL**: Set to `https://your-vercel-domain.vercel.app`

#### B. Add Redirect URLs

1. Same page: **Redirect URLs** section
2. Add these URLs (one per line):
   ```
   https://your-vercel-domain.vercel.app/auth/callback
   https://your-vercel-domain.vercel.app/**
   ```
3. **Save**

---

### 3. Test (2 minutes)

1. Go to: `https://your-vercel-domain.vercel.app/auth/sign-in`
2. Enter your email
3. Check email for magic link
4. **Verify link points to production domain** (not localhost)
5. Click link → Should redirect to dashboard ✅

---

## 🔍 If Still Not Working

1. **Request a NEW magic link** (old ones may be cached)
2. **Clear browser cache/cookies**
3. **Verify**:
   - Vercel env var `NEXT_PUBLIC_APP_URL` is set correctly
   - Supabase redirect URLs include your exact production domain
   - New deployment completed after adding env vars

---

## 📚 Full Documentation

See `docs/PRODUCTION_AUTH_FIX.md` for complete details, troubleshooting, and best practices.
