# Fix Google OAuth Redirect Issue

## The Problem
Google is redirecting directly to `http://localhost:3000/auth/callback` instead of going through Supabase first. This is why you're getting `no_code` errors.

## The Solution
Google Cloud Console should ONLY have Supabase's callback URL, NOT your app's callback URL.

## Steps to Fix

### 1. Go to Google Cloud Console
1. Open: https://console.cloud.google.com/apis/credentials
2. Find your OAuth 2.0 Client ID (the one with ID: `458478487829-epttkrkgpoeeb7i71uurj22j65b6otds`)
3. Click on it to edit

### 2. Check Authorized redirect URIs
Look at the "Authorized redirect URIs" section. You should see:

**✅ CORRECT (Keep this one):**
```
https://rwqlxbduoovtwohkoxwg.supabase.co/auth/v1/callback
```

**❌ WRONG (Remove this one if it exists):**
```
http://localhost:3000/auth/callback
```

### 3. Remove Your App's Callback URL
- If you see `http://localhost:3000/auth/callback` in the list, **delete it**
- Keep ONLY `https://rwqlxbduoovtwohkoxwg.supabase.co/auth/v1/callback`
- Click **Save**

### 4. Verify Supabase Settings
Make sure in Supabase Dashboard → Authentication → URL Configuration:
- **Redirect URLs** includes: `http://localhost:3000/auth/callback`
- **Site URL** is: `http://localhost:3000`

## How It Should Work

```
User clicks "Sign in with Google"
  ↓
App calls: supabase.auth.signInWithOAuth()
  ↓
Browser goes to: Supabase OAuth endpoint
  ↓
Supabase redirects to: Google OAuth
  ↓
User authenticates with Google
  ↓
Google redirects to: Supabase callback (https://rwqlxbduoovtwohkoxwg.supabase.co/auth/v1/callback)
  ↓
Supabase processes OAuth, creates user, sets cookies
  ↓
Supabase redirects to: Your app callback (http://localhost:3000/auth/callback?code=...)
  ↓
Your app exchanges code for session
  ↓
User is logged in ✅
```

## After Fixing

1. Clear your browser cache/cookies for localhost:3000
2. Try Google sign-in again
3. Check the terminal logs - you should now see `hasCode: true` instead of `hasCode: false`

