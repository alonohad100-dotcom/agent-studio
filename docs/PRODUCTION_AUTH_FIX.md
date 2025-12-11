# Production Authentication Fix - Magic Link Redirect Issue

## Problem Summary

Magic link authentication redirects to `localhost:3000` instead of the production domain after deployment to Vercel.

## Root Causes Identified

1. **Supabase Dashboard Configuration**: Missing production URL in allowed redirect URLs
2. **Supabase Site URL**: May be set to localhost instead of production domain
3. **Environment Variables**: `NEXT_PUBLIC_APP_URL` not configured in Vercel
4. **Code Implementation**: Using `window.location.origin` (correct) but needs fallback for edge cases

---

## ✅ Code Fixes Applied

### 1. Created `getAppUrl()` Utility Function

**File**: `apps/web/lib/utils.ts`

Added a robust utility function that handles URL detection with proper fallback logic:

```typescript
export function getAppUrl(): string {
  // Client-side: use window.location.origin (most reliable)
  if (typeof window !== 'undefined') {
    return window.location.origin
  }

  // Server-side: check environment variables
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL
  }

  // Vercel provides VERCEL_URL automatically
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`
  }

  // Fallback for development
  return process.env.NODE_ENV === 'production'
    ? 'https://your-production-domain.com'
    : 'http://localhost:3000'
}
```

### 2. Updated Sign-In Page

**File**: `apps/web/app/auth/sign-in/page.tsx`

Changed from:

```typescript
const redirectTo = new URL('/auth/callback', window.location.origin)
```

To:

```typescript
const appUrl = getAppUrl()
const redirectTo = new URL('/auth/callback', appUrl)
```

### 3. Updated Dev-Login Page

**File**: `apps/web/app/auth/dev-login/page.tsx`

Changed from:

```typescript
emailRedirectTo: `${window.location.origin}/auth/callback?next=/app/dashboard`
```

To:

```typescript
const appUrl = getAppUrl()
emailRedirectTo: `${appUrl}/auth/callback?next=/app/dashboard`
```

---

## 🔧 Required Configuration Steps

### Step 1: Configure Vercel Environment Variables

1. **Go to Vercel Dashboard**:
   - Navigate to: https://vercel.com/dashboard
   - Select your project: `agent-studio`
   - Go to **Settings** → **Environment Variables**

2. **Add/Update Environment Variables**:

   ```env
   NEXT_PUBLIC_APP_URL=https://your-vercel-domain.vercel.app
   ```

   **OR** if you have a custom domain:

   ```env
   NEXT_PUBLIC_APP_URL=https://your-custom-domain.com
   ```

   **Important**:
   - Set this for **Production**, **Preview**, and **Development** environments
   - Replace `your-vercel-domain.vercel.app` with your actual Vercel deployment URL
   - You can find your deployment URL in Vercel dashboard → Deployments → Production

3. **Verify Other Required Variables**:
   Ensure these are also set (they should already be configured):

   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://lmjvqwmzvwlxjjhgegaq.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   OPENAI_API_KEY=your-openai-key
   ```

4. **Redeploy**:
   - After adding environment variables, trigger a new deployment
   - Or wait for the next automatic deployment

---

### Step 2: Configure Supabase Dashboard

#### 2.1 Update Site URL

1. **Go to Supabase Dashboard**:
   - Navigate to: https://supabase.com/dashboard
   - Select your project

2. **Update Site URL**:
   - Go to: **Authentication** → **URL Configuration**
   - **Site URL**: Set to your production URL:
     ```
     https://your-vercel-domain.vercel.app
     ```
     OR if you have a custom domain:
     ```
     https://your-custom-domain.com
     ```

#### 2.2 Add Redirect URLs

1. **Still in Authentication → URL Configuration**:

2. **Redirect URLs** section:
   Add the following URLs (one per line):

   ```
   https://your-vercel-domain.vercel.app/auth/callback
   https://your-vercel-domain.vercel.app/**
   ```

   **If you have a custom domain**, also add:

   ```
   https://your-custom-domain.com/auth/callback
   https://your-custom-domain.com/**
   ```

   **For development** (optional but recommended):

   ```
   http://localhost:3000/auth/callback
   http://localhost:3000/**
   ```

3. **Save Changes**

#### 2.3 Verify Email Template (Optional)

1. **Go to**: **Authentication** → **Email Templates**

2. **Magic Link Template**:
   - Verify the template doesn't have hardcoded localhost URLs
   - The redirect URL should be dynamic (Supabase handles this automatically)

---

### Step 3: Verify Configuration

#### 3.1 Test Locally First

1. **Update local `.env.local`**:

   ```env
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

2. **Test magic link**:
   ```bash
   pnpm dev
   ```

   - Go to http://localhost:3000/auth/sign-in
   - Enter your email
   - Check email for magic link
   - Verify link points to `http://localhost:3000/auth/callback`

#### 3.2 Test in Production

1. **After deploying to Vercel**:
   - Go to your production URL: `https://your-vercel-domain.vercel.app/auth/sign-in`
   - Enter your email
   - Check email for magic link
   - **Verify the link points to your production domain**, not localhost

2. **Click the magic link**:
   - Should redirect to: `https://your-vercel-domain.vercel.app/auth/callback`
   - Then redirect to: `https://your-vercel-domain.vercel.app/app/dashboard`
   - You should be logged in successfully

---

## 🔍 Troubleshooting

### Issue: Magic link still redirects to localhost

**Possible Causes**:

1. Supabase redirect URLs not configured correctly
2. Environment variable `NEXT_PUBLIC_APP_URL` not set in Vercel
3. Old magic link email cached (try requesting a new one)

**Solutions**:

1. Double-check Supabase redirect URLs include your production domain
2. Verify `NEXT_PUBLIC_APP_URL` is set in Vercel environment variables
3. Request a new magic link after configuration changes
4. Clear browser cache and cookies

### Issue: "Invalid redirect URL" error

**Cause**: The redirect URL in the magic link doesn't match any URL in Supabase's allowed list.

**Solution**:

- Add the exact redirect URL to Supabase's Redirect URLs list
- Format: `https://your-domain.com/auth/callback`
- Also add wildcard: `https://your-domain.com/**`

### Issue: Environment variable not updating

**Cause**: Vercel caches environment variables.

**Solution**:

1. Go to Vercel → Settings → Environment Variables
2. Verify the variable is set correctly
3. Trigger a new deployment (or wait for next commit)
4. Clear Vercel build cache if needed

---

## 📋 Checklist

Use this checklist to ensure everything is configured:

### Vercel Configuration

- [ ] `NEXT_PUBLIC_APP_URL` set to production domain
- [ ] `NEXT_PUBLIC_SUPABASE_URL` configured
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` configured
- [ ] `SUPABASE_SERVICE_ROLE_KEY` configured
- [ ] `OPENAI_API_KEY` configured
- [ ] New deployment triggered after adding variables

### Supabase Configuration

- [ ] Site URL set to production domain
- [ ] Redirect URLs include production callback URL
- [ ] Redirect URLs include wildcard pattern (`/**`)
- [ ] Development URLs added (optional)
- [ ] Changes saved

### Code Verification

- [ ] `getAppUrl()` function added to `lib/utils.ts`
- [ ] Sign-in page uses `getAppUrl()`
- [ ] Dev-login page uses `getAppUrl()`
- [ ] Code committed and pushed to repository

### Testing

- [ ] Local magic link works (redirects to localhost)
- [ ] Production magic link works (redirects to production domain)
- [ ] Authentication flow completes successfully
- [ ] User redirected to dashboard after login

---

## 🎯 Best Practices

### 1. Environment-Specific Configuration

Always use environment variables for URLs:

```typescript
// ✅ Good
const appUrl = getAppUrl() // Uses env var or detects automatically

// ❌ Bad
const appUrl = 'https://hardcoded-domain.com'
```

### 2. Supabase Redirect URLs Pattern

Use wildcard patterns for flexibility:

```
https://your-domain.com/**
```

This allows all paths under your domain, preventing future issues when adding new routes.

### 3. Multiple Environment Support

Configure separate Supabase projects or use environment-specific redirect URLs:

- **Development**: `http://localhost:3000/**`
- **Staging**: `https://staging.your-domain.com/**`
- **Production**: `https://your-domain.com/**`

### 4. Regular Verification

After each deployment:

1. Test magic link authentication
2. Verify redirect URLs are correct
3. Check environment variables are set
4. Monitor error logs for authentication issues

---

## 📚 Additional Resources

- [Supabase Auth Configuration](https://supabase.com/docs/guides/auth/auth-redirects)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)

---

## ✅ Summary

The code fixes ensure proper URL detection with fallback logic. However, **the critical step is configuring Supabase Dashboard** to allow your production domain as a redirect URL. Without this configuration, Supabase will reject the authentication request, causing the redirect to fail or default to localhost.

**Priority Actions**:

1. ✅ Code fixes applied (already done)
2. ⚠️ **Configure Supabase redirect URLs** (REQUIRED)
3. ⚠️ **Set NEXT_PUBLIC_APP_URL in Vercel** (REQUIRED)
4. ⚠️ **Test magic link in production** (VERIFY)

After completing steps 2-4, the authentication flow should work correctly in production.
