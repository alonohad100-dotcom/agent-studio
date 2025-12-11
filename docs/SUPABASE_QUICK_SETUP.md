# Supabase Quick Setup - Your Exact Values

## 🎯 Quick Reference

### Your Supabase Project

- **Dashboard:** https://supabase.com/dashboard/project/lmjvqwmzvwlxjjhgegaq
- **Project URL:** `https://lmjvqwmzvwlxjjhgegaq.supabase.co`

### Your Vercel Domain

**Production Domain:**

```
https://agent-studio-qgoqjpj0g-pro-dev-f5f79272.vercel.app
```

---

## ✅ Step-by-Step Setup (5 Minutes)

### STEP 1: Enable Email Provider

1. Go to: https://supabase.com/dashboard/project/lmjvqwmzvwlxjjhgegaq
2. Click: **"Authentication"** (left sidebar)
3. Click: **"Providers"**
4. Find: **"Email"** in the list
5. Toggle: **"Enable Email Signup"** → **ON** ✅
6. Toggle: **"Confirm email"** → **OFF** ❌ (disable email verification - users login immediately)
7. Click: **"Save"**

### STEP 2: Set Site URL

1. Still in Authentication section
2. Click: **"URL Configuration"**
3. Find: **"Site URL"** field
4. Enter: `https://agent-studio-qgoqjpj0g-pro-dev-f5f79272.vercel.app`
5. Click: **"Save"**

### STEP 3: Add Redirect URLs

1. Still in **"URL Configuration"**
2. Find: **"Redirect URLs"** section
3. Add these URLs:

   ```
   https://agent-studio-qgoqjpj0g-pro-dev-f5f79272.vercel.app/auth/callback
   https://agent-studio-qgoqjpj0g-pro-dev-f5f79272.vercel.app/**
   ```

4. **How to add:**
   - If you see a text area: Paste URLs one per line
   - If you see "Add URL" button: Click it, enter URL, click "Add", repeat
   - If you see a list: Click "+" or "Add" for each URL

5. Click: **"Save"**

### STEP 4: Skip Email Templates (Not Needed)

Since email verification is disabled, you don't need to configure email templates.
Users will be automatically logged in after registration.

---

## 🔍 Finding Your Exact Vercel Domain

### Method 1: Vercel Dashboard

1. Go to: https://vercel.com/dashboard
2. Click: **"agent-studio"** project
3. Go to: **"Settings"** tab
4. Scroll to: **"Domains"** section
5. Copy the production domain listed

### Method 2: Latest Deployment

1. Go to: https://vercel.com/dashboard
2. Click: **"agent-studio"** project
3. Go to: **"Deployments"** tab
4. Find the latest **Production** deployment (green checkmark)
5. Click on it
6. Copy the URL shown

### Method 3: Check Environment Variables

Your Vercel domain might be in your environment variables as `VERCEL_URL`

---

## 📋 Configuration Checklist

Before testing, verify:

- [ ] **Authentication → Providers → Email**: "Enable Email Signup" = ON
- [ ] **Authentication → Providers → Email**: "Confirm email" = OFF (no verification)
- [ ] **Authentication → URL Configuration → Site URL**: Your Vercel domain (https://...)
- [ ] **Authentication → URL Configuration → Redirect URLs**:
  - [ ] Your domain + `/auth/callback` (optional, only if you enable verification later)
  - [ ] Your domain + `/**`

---

## 🧪 Test Your Setup

### Test 1: Registration

1. Go to: `https://agent-studio-qgoqjpj0g-pro-dev-f5f79272.vercel.app/auth/register`
2. Enter email and password
3. Click "Create account"
4. You should be **automatically logged in** and redirected to `/app/dashboard`
5. No email verification needed!

### Test 2: Login

1. Go to: `https://agent-studio-qgoqjpj0g-pro-dev-f5f79272.vercel.app/auth/login`
2. Enter email and password
3. Click "Sign in"
4. You should be redirected to `/app/dashboard`

---

## ⚠️ Common Issues

### "I don't see URL Configuration"

- Look for "Settings" → "Authentication" → "URLs"
- Or expand the Authentication menu (click arrow)

### "Redirect URLs field looks different"

- **Text area:** Paste URLs one per line
- **Add button:** Click "Add" for each URL
- **List format:** Click "+" to add new rows

### "Email verification is enabled but I don't want it"

- Go to Authentication → Providers → Email
- Toggle "Confirm email" to OFF
- Click Save

### "I don't know my Vercel domain"

- Check Vercel dashboard → Settings → Domains
- Or check latest deployment URL
- Or check Vercel environment variables

---

## 📞 Need Help?

If the Supabase dashboard looks different:

1. **Tell me what you see:**
   - What menu items are under "Authentication"?
   - What does "URL Configuration" look like?
   - What format are the Redirect URLs in?

2. **I'll provide specific instructions** based on what you see

The key is:

- Enable email provider
- Set Site URL to your production domain
- Add Redirect URLs for your domain
- Ensure email template has verification link variable

---

## 🎯 Your Exact Values

**Supabase Site URL:**

```
https://agent-studio-qgoqjpj0g-pro-dev-f5f79272.vercel.app
```

**Supabase Redirect URLs:**

```
https://agent-studio-qgoqjpj0g-pro-dev-f5f79272.vercel.app/**
```

**Note:** `/auth/callback` is optional since email verification is disabled.
