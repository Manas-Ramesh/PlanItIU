# Production Authentication Troubleshooting

## Common Issues and Fixes

### Issue: OAuth works on localhost but not on Vercel

**Most Common Cause**: The production URL is not configured in Supabase Dashboard.

## Step-by-Step Fix

### 1. Check Supabase Redirect URLs

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Navigate to: **Authentication → URL Configuration**
4. Under **Redirect URLs**, you should see:
   - ✅ `http://localhost:3000/auth/callback` (for local development)
   - ❌ **MISSING**: `https://planitiu.vercel.app/auth/callback` (for production)

5. **Add the production URL**:
   - Click **Add URL** or the **+** button
   - Enter: `https://planitiu.vercel.app/auth/callback`
   - Click **Save**

### 2. Verify Site URL (Optional but Recommended)

In the same **URL Configuration** section:
- **Site URL** can be set to: `https://planitiu.vercel.app`
- Or keep it as `http://localhost:3000` if you primarily develop locally

### 3. Check Vercel Environment Variables

Make sure these are set in Vercel Dashboard → Settings → Environment Variables:

- ✅ `NEXT_PUBLIC_SUPABASE_URL`
- ✅ `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- ✅ `SUPABASE_SERVICE_ROLE_KEY` (if needed for server-side operations)

### 4. Check Browser Console

When testing OAuth on production, check the browser console for:
- The callback URL being used
- Any error messages
- Network requests to see where the redirect is failing

### 5. Check Vercel Logs

1. Go to Vercel Dashboard → Your Project → Deployments
2. Click on the latest deployment
3. Go to **Functions** tab
4. Look for `/auth/callback` function logs
5. Check for error messages or warnings

## Expected OAuth Flow

1. User clicks "Sign in with Google" on `https://planitiu.vercel.app`
2. App redirects to Supabase: `https://rwqlxbduoovtwohkoxwg.supabase.co/auth/v1/authorize?provider=google&redirect_to=https://planitiu.vercel.app/auth/callback`
3. Supabase redirects to Google
4. User authenticates with Google
5. Google redirects to Supabase: `https://rwqlxbduoovtwohkoxwg.supabase.co/auth/v1/callback`
6. Supabase processes OAuth, creates user, sets cookies
7. Supabase redirects to your app: `https://planitiu.vercel.app/auth/callback?code=...`
8. Your app exchanges code for session
9. User is logged in ✅

## Debugging Checklist

- [ ] Production URL added to Supabase Redirect URLs
- [ ] Environment variables set in Vercel
- [ ] Google Cloud Console only has Supabase callback URL (not your app URL)
- [ ] Browser console shows correct callback URL
- [ ] Vercel logs show callback route is being hit
- [ ] No CORS errors in browser console
- [ ] Cookies are being set (check Application → Cookies in browser dev tools)

## Still Not Working?

1. **Clear browser cache and cookies** for the production domain
2. **Try incognito/private mode** to rule out browser issues
3. **Check Vercel deployment logs** for specific error messages
4. **Verify the exact URL** in Supabase matches exactly (including https://)
5. **Test with email/password** to ensure authentication works at all

## Quick Test

After adding the production URL to Supabase:

1. Go to `https://planitiu.vercel.app/login`
2. Click "Sign in with Google"
3. Complete Google authentication
4. You should be redirected back to your app and logged in

If you see an error, check:
- Browser console for client-side errors
- Vercel function logs for server-side errors
- Supabase dashboard → Authentication → Users to see if user was created

