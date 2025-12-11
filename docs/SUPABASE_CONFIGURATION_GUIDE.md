# Supabase Configuration Guide: Email/Password Authentication Setup

## Overview

This guide provides step-by-step instructions for configuring Supabase to work with the new email/password authentication system. All instructions are based on the current Supabase dashboard interface.

---

## Step 1: Access Supabase Dashboard

1. Go to: https://supabase.com/dashboard
2. Sign in to your account
3. Select your project (the one with URL: `lmjvqwmzvwlxjjhgegaq.supabase.co`)

---

## Step 2: Configure Authentication Provider

### 2.1 Navigate to Authentication Settings

1. In the left sidebar, click **"Authentication"**
2. You should see several sub-menu items:
   - Providers
   - URL Configuration
   - Email Templates
   - Policies
   - Users

### 2.2 Enable Email/Password Provider

1. Click **"Providers"** in the left sidebar (under Authentication)
2. Find **"Email"** in the list of providers
3. Click on **"Email"** to expand its settings
4. You should see these options:
   - **"Enable Email Signup"** - Toggle this **ON** ✅
   - **"Confirm email"** - Toggle this **ON** ✅ (recommended for production)
   - **"Secure email change"** - Toggle this **ON** ✅ (recommended)
   - **"Enable Custom SMTP"** - Leave OFF unless you have custom SMTP server

5. **Important Settings:**
   - **"Enable Email Signup"** = ON (this enables email/password registration)
   - **"Confirm email"** = ON (requires users to verify email before full access)
   - **"Secure email change"** = ON (requires verification when changing email)

6. **Scroll down** to find password settings:
   - **"Minimum password length"** - Set to `8` (default)
   - **"Password requirements"** - Optional, can enable complexity rules

7. Click **"Save"** at the bottom of the page

---

## Step 3: Configure URL Settings

### 3.1 Navigate to URL Configuration

1. In the left sidebar (under Authentication), click **"URL Configuration"**
2. You should see two main sections:
   - **Site URL**
   - **Redirect URLs**

### 3.2 Set Site URL

**What is Site URL?**

- This is your production domain where users will access your application
- Supabase uses this as the default redirect URL for authentication

**How to find your Vercel domain:**

1. Go to: https://vercel.com/dashboard
2. Select your project: `agent-studio`
3. Go to **"Deployments"** tab
4. Click on the latest production deployment
5. Copy the URL (it will look like: `https://agent-studio-xxxxx.vercel.app`)

**Set Site URL in Supabase:**

1. In the **"Site URL"** field, enter your Vercel production URL:

   ```
   https://agent-studio-xxxxx.vercel.app
   ```

   OR if you have a custom domain:

   ```
   https://your-custom-domain.com
   ```

2. **Important:**
   - Use `https://` (not `http://`)
   - Do NOT include a trailing slash (`/`)
   - Use your actual Vercel deployment URL

### 3.3 Configure Redirect URLs

**What are Redirect URLs?**

- These are URLs that Supabase allows for authentication redirects
- After email verification or password reset, users are redirected to these URLs

**How to configure:**

1. In the **"Redirect URLs"** section, you'll see a text area or list
2. Click **"Add URL"** or the **"+"** button (if available)
3. Add these URLs **one per line**:

   **For Production:**

   ```
   https://agent-studio-xxxxx.vercel.app/auth/callback
   https://agent-studio-xxxxx.vercel.app/**
   ```

   **If you have a custom domain, also add:**

   ```
   https://your-custom-domain.com/auth/callback
   https://your-custom-domain.com/**
   ```

   **For Development (optional, but recommended):**

   ```
   http://localhost:3000/auth/callback
   http://localhost:3000/**
   ```

4. **Important Notes:**
   - The `/**` pattern means "all paths under this domain"
   - The `/auth/callback` is specifically for email verification callbacks
   - You can add multiple URLs (one per line)
   - Make sure to use `https://` for production and `http://` for localhost

5. Click **"Save"** or **"Update"** button

---

## Step 4: Configure Email Templates (Optional but Recommended)

### 4.1 Navigate to Email Templates

1. In the left sidebar (under Authentication), click **"Email Templates"**
2. You'll see a list of email templates:
   - Confirm signup
   - Magic Link
   - Change Email Address
   - Reset Password
   - Invite user

### 4.2 Configure "Confirm signup" Template

**This is the email sent when users register (if email verification is enabled)**

1. Click on **"Confirm signup"** template
2. You'll see:
   - **Subject** field
   - **Body** field (HTML editor)

3. **Subject:** (You can customize or use default)

   ```
   Confirm your email address
   ```

4. **Body:** Make sure it includes the confirmation link:
   - Look for: `{{ .ConfirmationURL }}` or `{{.ConfirmationURL}}`
   - This is the variable that Supabase replaces with the actual verification link
   - Example body:

   ```
   <h2>Welcome to Agent Studio!</h2>
   <p>Click the link below to verify your email address:</p>
   <p><a href="{{ .ConfirmationURL }}">Verify Email Address</a></p>
   <p>Or copy and paste this URL into your browser:</p>
   <p>{{ .ConfirmationURL }}</p>
   ```

5. **Important:**
   - The `{{ .ConfirmationURL }}` variable MUST be included
   - This is what creates the clickable verification link
   - Without it, users won't be able to verify their email

6. Click **"Save"** when done

### 4.3 Disable or Keep Magic Link Template

1. Find **"Magic Link"** template
2. **Option 1:** Leave it as-is (won't be used but won't cause issues)
3. **Option 2:** You can disable it or modify it, but it's not necessary since we're using password auth

---

## Step 5: Verify Configuration

### 5.1 Check Your Settings

Go through this checklist:

- [ ] **Providers → Email**: "Enable Email Signup" is ON
- [ ] **Providers → Email**: "Confirm email" is ON (if you want email verification)
- [ ] **URL Configuration → Site URL**: Set to your production domain
- [ ] **URL Configuration → Redirect URLs**: Includes your production domain with `/**` pattern
- [ ] **Email Templates → Confirm signup**: Includes `{{ .ConfirmationURL }}` variable

### 5.2 Test Configuration

**Test Registration:**

1. Go to your production site: `https://your-vercel-domain.vercel.app/auth/register`
2. Enter an email and password
3. Click "Create account"
4. Check your email inbox
5. You should receive a verification email (if email verification is enabled)
6. The email should contain a clickable link

**Test Login:**

1. Go to: `https://your-vercel-domain.vercel.app/auth/login`
2. Enter your email and password
3. Click "Sign in"
4. You should be redirected to `/app/dashboard`

---

## Troubleshooting

### Issue: "Invalid redirect URL" error

**Cause:** The redirect URL in your code doesn't match any URL in Supabase's Redirect URLs list.

**Solution:**

1. Go to Supabase → Authentication → URL Configuration
2. Check the Redirect URLs list
3. Make sure your production domain is listed with `/**` pattern
4. Example: `https://your-domain.vercel.app/**`

### Issue: Email verification link doesn't work

**Cause:** Email template doesn't have the correct variable or redirect URL is wrong.

**Solution:**

1. Go to Supabase → Authentication → Email Templates → Confirm signup
2. Verify the template includes `{{ .ConfirmationURL }}`
3. Check URL Configuration → Redirect URLs includes `/auth/callback`

### Issue: Users can't register

**Cause:** Email provider might be disabled or Site URL is incorrect.

**Solution:**

1. Go to Supabase → Authentication → Providers → Email
2. Ensure "Enable Email Signup" is ON
3. Check URL Configuration → Site URL is set correctly

### Issue: Registration works but login doesn't

**Cause:** Email verification might be required but user hasn't verified.

**Solution:**

1. Check if "Confirm email" is enabled in Providers → Email
2. If enabled, users must verify email before they can log in
3. Check email inbox for verification link
4. Or temporarily disable "Confirm email" for testing

---

## Current Configuration Values

Based on your project, you should use:

**Supabase Project URL:**

```
https://lmjvqwmzvwlxjjhgegaq.supabase.co
```

**Site URL (in Supabase Dashboard):**

```
https://your-vercel-production-domain.vercel.app
```

(Replace with your actual Vercel domain)

**Redirect URLs (in Supabase Dashboard):**

```
https://your-vercel-production-domain.vercel.app/auth/callback
https://your-vercel-production-domain.vercel.app/**
```

---

## Visual Guide (What You Should See)

### Authentication → Providers → Email

You should see:

- ✅ **Enable Email Signup** - Toggle ON
- ✅ **Confirm email** - Toggle ON (recommended)
- ✅ **Secure email change** - Toggle ON (recommended)
- **Minimum password length:** 8
- **Save** button at bottom

### Authentication → URL Configuration

You should see:

- **Site URL:** Text input field
  - Enter: `https://your-vercel-domain.vercel.app`
- **Redirect URLs:** Text area or list
  - Add URLs (one per line):
    ```
    https://your-vercel-domain.vercel.app/auth/callback
    https://your-vercel-domain.vercel.app/**
    ```

### Authentication → Email Templates → Confirm signup

You should see:

- **Subject:** Text input
- **Body:** HTML editor
- Make sure body contains: `{{ .ConfirmationURL }}`

---

## Quick Reference: Exact Steps

1. **Supabase Dashboard** → **Authentication** → **Providers** → **Email**
   - Toggle **"Enable Email Signup"** ON
   - Toggle **"Confirm email"** ON (optional but recommended)
   - Click **Save**

2. **Supabase Dashboard** → **Authentication** → **URL Configuration**
   - **Site URL:** Enter `https://your-vercel-domain.vercel.app`
   - **Redirect URLs:** Add:
     - `https://your-vercel-domain.vercel.app/auth/callback`
     - `https://your-vercel-domain.vercel.app/**`
   - Click **Save**

3. **Supabase Dashboard** → **Authentication** → **Email Templates** → **Confirm signup**
   - Verify template includes `{{ .ConfirmationURL }}`
   - Click **Save** if you made changes

4. **Test:**
   - Go to your site: `/auth/register`
   - Create an account
   - Check email for verification (if enabled)
   - Go to `/auth/login`
   - Sign in with email/password

---

## Need Help?

If the Supabase dashboard looks different from these instructions:

1. **Take a screenshot** of your Supabase Authentication settings
2. **Note the exact menu items** you see
3. The interface may have been updated - we can adjust instructions based on what you see

The key things to configure are:

- ✅ Email provider enabled
- ✅ Site URL set to production domain
- ✅ Redirect URLs include production domain
- ✅ Email template has verification link variable
