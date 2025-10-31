# Supabase OAuth Configuration Guide

## The Issue: "no_code" Error

When you see `no_code` error, it means Supabase redirected to your callback but didn't provide an authorization code. However, the user might still be authenticated (cookies set), or there might be a configuration issue.

## Required Supabase Dashboard Configuration

### Step 1: Configure Redirect URLs in Supabase

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Navigate to: **Authentication → URL Configuration**
3. In the **Redirect URLs** section, add:
   - `http://localhost:3000/auth/callback` (for local development)
   - `https://your-production-domain.com/auth/callback` (for production)

### Step 2: Configure Google OAuth Provider

1. Go to: **Authentication → Providers**
2. Click on **Google**
3. Enable the provider
4. Enter your credentials:
   - **Client ID (for OAuth)**: `458478487829-epttkrkgpoeeb7i71uurj22j65b6otds.apps.googleusercontent.com`
   - **Client Secret (for OAuth)**: `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`
5. **Important**: In the **Redirect URL** field for Google OAuth, it should be:
   ```
   https://rwqlxbduoovtwohkoxwg.supabase.co/auth/v1/callback
   ```
   This is Supabase's OAuth callback endpoint, NOT your app's callback.

### Step 3: Verify in Google Cloud Console

1. Go to Google Cloud Console: https://console.cloud.google.com
2. Navigate to: **APIs & Services → Credentials**
3. Click on your OAuth 2.0 Client ID
4. Under **Authorized redirect URIs**, ensure you have:
   ```
   https://rwqlxbduoovtwohkoxwg.supabase.co/auth/v1/callback
   ```

## How OAuth Flow Works

1. User clicks "Sign in with Google"
2. App redirects to Supabase OAuth endpoint
3. Supabase redirects to Google
4. User authenticates with Google
5. Google redirects back to: `https://rwqlxbduoovtwohkoxwg.supabase.co/auth/v1/callback`
6. Supabase processes the OAuth, creates user, sets session cookies
7. Supabase redirects to your app's callback: `http://localhost:3000/auth/callback`
8. Your callback route should either:
   - Receive a `code` parameter to exchange for session, OR
   - Read the session from cookies (if Supabase already set them)

## Troubleshooting

- **If you see `no_code`**: Check that your redirect URLs are configured correctly in Supabase dashboard
- **If user is created but not logged in**: Check browser console and terminal for error logs
- **If OAuth redirects to wrong URL**: Verify the `redirectTo` in your code matches Supabase redirect URLs

## Testing

After configuring, try Google sign-in again and check:
1. Terminal logs for detailed error messages
2. Browser Network tab to see the redirect flow
3. Supabase dashboard → Authentication → Users to see if user was created

