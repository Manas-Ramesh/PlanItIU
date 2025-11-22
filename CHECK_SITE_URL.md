# Check Supabase Site URL Setting

## The Issue

Even though your production callback URL is configured in Supabase, you're still being redirected to localhost after login.

## The Problem

The **Site URL** setting in Supabase might be set to `http://localhost:3000`. This can cause Supabase to redirect to localhost even when you're on production.

## The Fix

1. Go to **Supabase Dashboard**: https://supabase.com/dashboard/project/rwqlxbduoovtwohkoxwg
2. Navigate to: **Authentication → URL Configuration**
3. Check the **Site URL** field
4. It should be set to:
   - `https://planitiu.vercel.app` (your production domain)
   - OR leave it as `http://localhost:3000` if you primarily develop locally

## Important Notes

- **Site URL** is used as a fallback by Supabase
- **Redirect URLs** (which you already have configured) take precedence
- But if there's any issue with the redirect URLs, Supabase falls back to Site URL

## Alternative: Use Wildcard

You can also use a wildcard in the Site URL:
```
https://*.vercel.app
```

This will work for all Vercel preview deployments too.

## After Changing Site URL

1. Clear your browser cookies for the production domain
2. Try logging in again
3. You should stay on the production domain

