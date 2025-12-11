# Supabase Setup: Step-by-Step Visual Guide

## Your Supabase Project Information

**Project URL:** `https://lmjvqwmzvwlxjjhgegaq.supabase.co`  
**Dashboard Link:** https://supabase.com/dashboard/project/lmjvqwmzvwlxjjhgegaq

---

## STEP 1: Enable Email/Password Authentication

### Where to Go:

1. Open: https://supabase.com/dashboard/project/lmjvqwmzvwlxjjhgegaq
2. Look at the **left sidebar**
3. Click on **"Authentication"** (it has a key/lock icon)

### What You Should See:

After clicking "Authentication", you'll see a submenu with:

- Providers
- URL Configuration
- Email Templates
- Policies
- Users

### Enable Email Provider:

1. Click **"Providers"** (first item in the Authentication submenu)
2. You'll see a list of authentication providers (Google, GitHub, Email, etc.)
3. Find **"Email"** in the list
4. Click on **"Email"** (or click the toggle/switch next to it)

### Email Provider Settings:

You should now see Email provider settings. Look for these options:

**Main Toggle:**

- **"Enable Email Signup"** or **"Enable Email Provider"**
  - Make sure this is **ON** (green/enabled)
  - This enables email/password registration

**Email Confirmation:**

- **"Confirm email"** or **"Require email confirmation"**
  - Toggle this **ON** ✅ (recommended for production)
  - This requires users to verify their email before they can fully use the app

**Other Settings:**

- **"Secure email change"** - Toggle ON ✅
- **"Enable Custom SMTP"** - Leave OFF (unless you have custom email server)

**Password Settings:**

- Scroll down to find password requirements
- **"Minimum password length"** - Should be `8` (default)
- You can add complexity requirements if desired

**Save:**

- Click **"Save"** button (usually at the bottom right or top right)

---

## STEP 2: Configure Site URL and Redirect URLs

### Where to Go:

1. Still in the Authentication section
2. Click **"URL Configuration"** (second item in Authentication submenu)

### What You Should See:

You'll see two main sections:

### Section 1: Site URL

**What is Site URL?**

- This is your production website URL
- Supabase uses this as the default redirect destination

**How to Find Your Vercel URL:**

1. Go to: https://vercel.com/dashboard
2. Click on your project: **"agent-studio"**
3. Go to **"Deployments"** tab
4. Find the latest **Production** deployment
5. Click on it
6. Copy the URL shown (example: `https://agent-studio-ohadonmicrosofts-projects.vercel.app`)

**Set Site URL:**

1. In the **"Site URL"** field, paste your Vercel URL:

   ```
   https://agent-studio-ohadonmicrosofts-projects.vercel.app
   ```

   (Replace with YOUR actual Vercel URL)

2. **Important:**
   - Must start with `https://`
   - No trailing slash (`/`) at the end
   - Use your actual production domain

### Section 2: Redirect URLs

**What are Redirect URLs?**

- These are URLs that Supabase allows for authentication redirects
- After email verification, users are sent to these URLs

**How to Add Redirect URLs:**

**Option A: If you see a text area (textarea):**

1. Click in the text area
2. Add URLs one per line:
   ```
   https://agent-studio-ohadonmicrosofts-projects.vercel.app/auth/callback
   https://agent-studio-ohadonmicrosofts-projects.vercel.app/**
   ```
   (Replace with YOUR actual Vercel URL)

**Option B: If you see an "Add URL" button:**

1. Click **"Add URL"** or **"+"** button
2. Enter: `https://your-vercel-domain.vercel.app/auth/callback`
3. Click **"Add"** or **"Save"**
4. Click **"Add URL"** again
5. Enter: `https://your-vercel-domain.vercel.app/**`
6. Click **"Add"** or **"Save"**

**Option C: If you see a list with checkboxes:**

1. Look for an **"Add"** or **"New"** button
2. Add each URL separately

**Important Notes:**

- The `/auth/callback` URL is for email verification callbacks
- The `/**` pattern means "all paths under this domain"
- You can add multiple URLs
- For development, you can also add: `http://localhost:3000/**`

**Save:**

- Click **"Save"** or **"Update"** button

---

## STEP 3: Configure Email Template (For Email Verification)

### Where to Go:

1. Still in Authentication section
2. Click **"Email Templates"** (third item in Authentication submenu)

### What You Should See:

A list of email templates:

- Confirm signup
- Magic Link
- Change Email Address
- Reset Password
- Invite user

### Configure "Confirm signup" Template:

1. Click on **"Confirm signup"** template
2. You'll see two fields:
   - **Subject** (email subject line)
   - **Body** (email content - HTML editor)

### Subject Field:

You can customize or use default:

```
Confirm your email address
```

### Body Field (Most Important):

**You MUST include the verification link variable**

Look for one of these variables in the template:

- `{{ .ConfirmationURL }}`
- `{{.ConfirmationURL}}`
- `{{ .ConfirmationLink }}`
- `{{.ConfirmationLink}}`

**Example Body Template:**

```html
<h2>Welcome to Agent Studio!</h2>
<p>Thank you for signing up. Please verify your email address by clicking the link below:</p>
<p><a href="{{ .ConfirmationURL }}">Verify Email Address</a></p>
<p>Or copy and paste this URL into your browser:</p>
<p>{{ .ConfirmationURL }}</p>
<p>If you didn't create an account, you can safely ignore this email.</p>
```

**Critical:**

- The `{{ .ConfirmationURL }}` variable creates the clickable link
- Without this variable, users won't be able to verify their email
- Make sure it's in the template body

**Save:**

- Click **"Save"** button

---

## STEP 4: Verify Your Vercel Domain

### Find Your Exact Vercel URL:

1. Go to: https://vercel.com/dashboard
2. Click project: **"agent-studio"**
3. Go to **"Settings"** tab
4. Look for **"Domains"** section
5. You'll see your production domain listed

**OR:**

1. Go to **"Deployments"** tab
2. Click on the latest production deployment
3. Look at the URL in the browser or deployment details
4. Copy that exact URL

**Example formats you might see:**

- `https://agent-studio-ohadonmicrosofts-projects.vercel.app`
- `https://agent-studio.vercel.app` (if you have a custom name)
- `https://your-custom-domain.com` (if you added a custom domain)

---

## STEP 5: Test Your Configuration

### Test Registration:

1. Go to: `https://your-vercel-domain.vercel.app/auth/register`
2. Enter:
   - Email: `test@example.com` (use a real email you can access)
   - Password: `Test123456` (at least 8 characters, includes letter and number)
   - Confirm Password: `Test123456`
3. Click **"Create account"**
4. You should see a success message
5. Check your email inbox
6. You should receive a verification email (if email verification is enabled)
7. The email should have a clickable link

### Test Login:

1. If email verification is enabled:
   - Click the verification link in your email
   - You'll be redirected to your site
2. Go to: `https://your-vercel-domain.vercel.app/auth/login`
3. Enter:
   - Email: `test@example.com`
   - Password: `Test123456`
4. Click **"Sign in"**
5. You should be redirected to `/app/dashboard`

---

## Common Issues and Solutions

### Issue: "I don't see 'URL Configuration' in the menu"

**Solution:**

- The menu might be collapsed
- Look for a small arrow or expand icon next to "Authentication"
- Click to expand the submenu
- Or look for "Settings" → "Authentication" → "URLs"

### Issue: "I see 'Redirect URLs' but it's a different format"

**Different formats you might see:**

**Format 1: Text area (textarea)**

- Just paste URLs one per line
- Example:
  ```
  https://your-domain.com/auth/callback
  https://your-domain.com/**
  ```

**Format 2: List with "Add" button**

- Click "Add" for each URL
- Enter URL in the input field
- Click "Save" or "Add"

**Format 3: Table format**

- Look for "Add Row" or "+" button
- Add each URL as a new row

### Issue: "I can't find where to enable Email provider"

**Alternative locations:**

1. Try: **Authentication** → **Settings** → **Providers**
2. Try: **Project Settings** → **Authentication** → **Providers**
3. Look for a **"Providers"** tab at the top of the Authentication page

### Issue: "The email template doesn't have the variable"

**Solution:**

1. Click **"Reset to default"** or **"Use default template"** button
2. The default template should include `{{ .ConfirmationURL }}`
3. Or manually add it to your template

### Issue: "I don't know my Vercel domain"

**How to find it:**

1. Go to: https://vercel.com/dashboard
2. Click on **"agent-studio"** project
3. Look at the top of the page - you'll see the domain
4. Or go to **"Deployments"** → Click latest deployment → Check the URL

---

## Quick Checklist

Before testing, verify:

- [ ] **Authentication → Providers → Email**: "Enable Email Signup" is ON
- [ ] **Authentication → URL Configuration → Site URL**: Set to your Vercel domain
- [ ] **Authentication → URL Configuration → Redirect URLs**: Includes your domain with `/**`
- [ ] **Authentication → Email Templates → Confirm signup**: Has `{{ .ConfirmationURL }}` variable
- [ ] You know your exact Vercel production URL

---

## Still Having Issues?

If the Supabase dashboard looks completely different:

1. **Take a screenshot** of your Authentication page
2. **Note the exact menu items** you see
3. **Tell me what you see** and I'll provide specific instructions

The key things we need to configure:

1. Enable email/password signup (in Providers)
2. Set Site URL to your production domain
3. Add Redirect URLs for your domain
4. Ensure email template has verification link

---

## Your Specific Values

**Supabase Project:**

- URL: `https://lmjvqwmzvwlxjjhgegaq.supabase.co`
- Dashboard: https://supabase.com/dashboard/project/lmjvqwmzvwlxjjhgegaq

**Vercel Project:**

- Project Name: `agent-studio`
- Dashboard: https://vercel.com/dashboard
- **You need to find your exact Vercel deployment URL**

**What to Set in Supabase:**

- Site URL: `https://YOUR-VERCEL-URL.vercel.app` (replace with actual)
- Redirect URLs:
  - `https://YOUR-VERCEL-URL.vercel.app/auth/callback`
  - `https://YOUR-VERCEL-URL.vercel.app/**`
