# Supabase Configuration Check

Since Google Cloud Console has the correct redirect URI, check these Supabase settings:

## Step 1: Verify Supabase Redirect URLs

1. Go to Supabase Dashboard: https://supabase.com/dashboard/project/rwqlxbduoovtwohkoxwg
2. Navigate to: **Authentication → URL Configuration**
3. Under **Redirect URLs**, make sure you have:
   ```
   http://localhost:3000/auth/callback
   ```
   (and your production URL when you deploy)

4. **Site URL** should be set to:
   ```
   http://localhost:3000
   ```

## Step 2: Verify Google Provider Settings

1. Go to: **Authentication → Providers → Google**
2. Make sure it's **Enabled**
3. **Client ID (for OAuth)**: `458478487829-epttkrkgpoeeb7i71uurj22j65b6otds.apps.googleusercontent.com`
4. **Client Secret (for OAuth)**: `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`
5. **DO NOT** set a custom redirect URL in the provider settings - leave it blank/default

## What Should Happen

1. User clicks "Sign in with Google"
2. Browser goes to: `https://rwqlxbduoovtwohkoxwg.supabase.co/auth/v1/authorize?provider=google&redirect_to=http://localhost:3000/auth/callback`
3. Supabase redirects to: `https://accounts.google.com/...`
4. User authenticates with Google
5. Google redirects to: `https://rwqlxbduoovtwohkoxwg.supabase.co/auth/v1/callback?code=...`
6. Supabase processes, creates user, then redirects to: `http://localhost:3000/auth/callback?code=...`
7. Your app exchanges code for session

## If It's Still Not Working

Check your browser's Network tab during Google sign-in to see the exact redirect flow and where it's breaking.

