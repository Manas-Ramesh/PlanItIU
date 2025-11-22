# Fix: Login Redirects to Localhost in Production

## The Problem

After logging in on production, users are redirected to `localhost:3000` instead of staying on the production domain.

## Root Cause

Supabase Dashboard needs to have your **production callback URL** configured in the Redirect URLs list. Currently, it likely only has `http://localhost:3000/auth/callback`.

## The Fix

### Step 1: Add Production URL to Supabase Dashboard

1. Go to **Supabase Dashboard**: https://supabase.com/dashboard/project/rwqlxbduoovtwohkoxwg
2. Navigate to: **Authentication → URL Configuration**
3. Under **Redirect URLs**, add your production URL:
   ```
   https://planitiu.vercel.app/auth/callback
   ```
   (Replace with your actual production domain if different)
4. Keep `http://localhost:3000/auth/callback` for local development
5. Click **Save**

### Step 2: Verify Site URL

In the same **URL Configuration** section:
- **Site URL** can be set to either:
  - `http://localhost:3000` (for development)
  - `https://planitiu.vercel.app` (for production)
  
  Or leave it as localhost - the redirect URLs take precedence.

### Step 3: Verify the Code

The code already uses `window.location.origin` which automatically detects:
- `http://localhost:3000` in development
- `https://planitiu.vercel.app` in production

So the code should work correctly once Supabase is configured.

## How to Verify It's Fixed

1. Deploy to production
2. Go to your production URL
3. Click "Sign in with Google" or login with email
4. After authentication, you should stay on the production domain (not redirect to localhost)

## If It Still Redirects to Localhost

Check the browser's Network tab during login:
1. Look for the OAuth redirect
2. Check what URL Supabase is redirecting to
3. If it's `localhost:3000`, then Supabase Dashboard isn't configured correctly
4. If it's your production URL but still redirects to localhost, check for hardcoded redirects in the code

## Additional Check: Environment Variables

Make sure in Vercel Dashboard → Settings → Environment Variables:
- `NEXT_PUBLIC_SUPABASE_URL` is set
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` is set

These should be the same values for both local and production (Supabase project credentials).

