# Fixing Google OAuth Configuration

## The Problem

Your logs show that Google is redirecting directly to `http://localhost:3000/auth/callback` instead of going through Supabase first. This means the OAuth flow is broken.

## The Correct OAuth Flow

1. User clicks "Sign in with Google"
2. **App redirects to Supabase**: `https://rwqlxbduoovtwohkoxwg.supabase.co/auth/v1/authorize?...`
3. **Supabase redirects to Google**: `https://accounts.google.com/...`
4. **Google redirects back to Supabase**: `https://rwqlxbduoovtwohkoxwg.supabase.co/auth/v1/callback?code=...`
5. **Supabase processes OAuth**, creates user, sets session
6. **Supabase redirects to your app**: `http://localhost:3000/auth/callback?code=...`
7. **Your app exchanges code for session** and redirects to dashboard

## Fix Steps

### Step 1: Google Cloud Console Configuration

1. Go to: https://console.cloud.google.com/apis/credentials
2. Click on your OAuth 2.0 Client ID: `458478487829-epttkrkgpoeeb7i71uurj22j65b6otds.apps.googleusercontent.com`
3. Under **Authorized redirect URIs**, make sure you have:
   ```
   https://rwqlxbduoovtwohkoxwg.supabase.co/auth/v1/callback
   ```
4. **IMPORTANT**: Remove any redirect URIs pointing to `http://localhost:3000/auth/callback` or your app's callback directly
5. **DO NOT** add your app's callback URL here - only Supabase's callback URL
6. Click **Save**

### Step 2: Supabase Dashboard Configuration

1. Go to: https://supabase.com/dashboard/project/rwqlxbduoovtwohkoxwg
2. Navigate to: **Authentication → URL Configuration**
3. Under **Redirect URLs**, add:
   - `http://localhost:3000/auth/callback` (for local development)
   - `https://your-production-domain.com/auth/callback` (when you deploy)
4. Click **Save**

### Step 3: Verify Supabase Google Provider

1. Go to: **Authentication → Providers**
2. Click on **Google**
3. Make sure it's **Enabled**
4. Verify credentials are entered:
   - Client ID: `458478487829-epttkrkgpoeeb7i71uurj22j65b6otds.apps.googleusercontent.com`
   - Client Secret: `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`
5. **DO NOT** set a custom redirect URL here - leave it blank or use Supabase's default

### Step 4: Test

1. Clear your browser cache and cookies
2. Try Google sign-in again
3. Check the browser's Network tab to see the redirect flow:
   - Should see redirect to `*.supabase.co` first
   - Then to Google
   - Then back to `*.supabase.co`
   - Finally to `localhost:3000/auth/callback?code=...`

## What to Check in Logs

After fixing, you should see in your terminal:
```
OAuth callback received: {
  hasCode: true,  ← This should be true!
  ...
  allParams: { code: '...' }  ← Should have a code parameter
}
```

If you still see `hasCode: false`, the configuration isn't correct yet.

## Common Mistakes

❌ **Wrong**: Adding `http://localhost:3000/auth/callback` to Google Cloud Console redirect URIs
✅ **Correct**: Only add Supabase's callback URL to Google Cloud Console

❌ **Wrong**: Setting redirect URL in Supabase Google provider settings
✅ **Correct**: Let Supabase handle it, just configure redirect URLs in URL Configuration

❌ **Wrong**: Using your app's callback URL anywhere in Google OAuth settings
✅ **Correct**: Google should only know about Supabase's callback URL

