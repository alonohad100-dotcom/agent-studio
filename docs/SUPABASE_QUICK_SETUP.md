# Supabase Quick Setup - Your Exact Values

## 🎯 Quick Reference

### Your Supabase Project

- **Dashboard:** https://supabase.com/dashboard/project/lmjvqwmzvwlxjjhgegaq
- **Project URL:** `https://lmjvqwmzvwlxjjhgegaq.supabase.co`

### Your Vercel Domain

Based on your deployments, your production domain pattern is:

```
https://agent-studio-XXXXX-ohadonmicrosofts-projects.vercel.app
```

**To find your EXACT domain:**

1. Go to: https://vercel.com/dashboard
2. Click: **"agent-studio"** project
3. Look at the **"Domains"** section in Settings
4. OR check the latest successful deployment URL

---

## ✅ Step-by-Step Setup (5 Minutes)

### STEP 1: Enable Email Provider

1. Go to: https://supabase.com/dashboard/project/lmjvqwmzvwlxjjhgegaq
2. Click: **"Authentication"** (left sidebar)
3. Click: **"Providers"**
4. Find: **"Email"** in the list
5. Toggle: **"Enable Email Signup"** → **ON** ✅
6. Toggle: **"Confirm email"** → **ON** ✅ (recommended)
7. Click: **"Save"**

### STEP 2: Set Site URL

1. Still in Authentication section
2. Click: **"URL Configuration"**
3. Find: **"Site URL"** field
4. Enter: `https://YOUR-VERCEL-DOMAIN.vercel.app`
   - Replace `YOUR-VERCEL-DOMAIN` with your actual Vercel domain
   - Example: `https://agent-studio-ecv1igz5e-ohadonmicrosofts-projects.vercel.app`
5. Click: **"Save"**

### STEP 3: Add Redirect URLs

1. Still in **"URL Configuration"**
2. Find: **"Redirect URLs"** section
3. Add these URLs (replace with YOUR actual Vercel domain):

   ```
   https://YOUR-VERCEL-DOMAIN.vercel.app/auth/callback
   https://YOUR-VERCEL-DOMAIN.vercel.app/**
   ```

   **Example:**

   ```
   https://agent-studio-ecv1igz5e-ohadonmicrosofts-projects.vercel.app/auth/callback
   https://agent-studio-ecv1igz5e-ohadonmicrosofts-projects.vercel.app/**
   ```

4. **How to add:**
   - If you see a text area: Paste URLs one per line
   - If you see "Add URL" button: Click it, enter URL, click "Add", repeat
   - If you see a list: Click "+" or "Add" for each URL

5. Click: **"Save"**

### STEP 4: Check Email Template

1. Still in Authentication section
2. Click: **"Email Templates"**
3. Click: **"Confirm signup"** template
4. Check the **Body** field
5. Make sure it contains: `{{ .ConfirmationURL }}`
   - This creates the verification link
   - If missing, click "Reset to default" or add it manually
6. Click: **"Save"**

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
- [ ] **Authentication → URL Configuration → Site URL**: Your Vercel domain (https://...)
- [ ] **Authentication → URL Configuration → Redirect URLs**:
  - [ ] Your domain + `/auth/callback`
  - [ ] Your domain + `/**`
- [ ] **Authentication → Email Templates → Confirm signup**: Has `{{ .ConfirmationURL }}`

---

## 🧪 Test Your Setup

### Test 1: Registration

1. Go to: `https://YOUR-VERCEL-DOMAIN.vercel.app/auth/register`
2. Enter email and password
3. Click "Create account"
4. Check email inbox for verification email

### Test 2: Email Verification

1. Open the verification email
2. Click the verification link
3. You should be redirected to your site

### Test 3: Login

1. Go to: `https://YOUR-VERCEL-DOMAIN.vercel.app/auth/login`
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

### "Email template doesn't have the variable"

- Click "Reset to default" button
- Or manually add: `{{ .ConfirmationURL }}`

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

## 🎯 Your Exact Values (Fill These In)

**Supabase Site URL:**

```
https://_____________________.vercel.app
```

(Your actual Vercel domain)

**Supabase Redirect URLs:**

```
https://_____________________.vercel.app/auth/callback
https://_____________________.vercel.app/**
```

(Your actual Vercel domain)

**To find your domain:**

- Vercel Dashboard → agent-studio → Settings → Domains
- OR Vercel Dashboard → agent-studio → Deployments → Latest → Copy URL
