# Vercel Deployment Configuration

## Required Supabase Configuration

After deploying to Vercel, you need to add your production URL to Supabase:

### Step 1: Add Production Redirect URL

1. Go to Supabase Dashboard: https://supabase.com/dashboard
2. Navigate to: **Authentication → URL Configuration**
3. Under **Redirect URLs**, add:
   - `http://localhost:3000/auth/callback` (for local development - keep this)
   - `https://planitiu.vercel.app/auth/callback` (for production)

### Step 2: Update Site URL (Optional)

You can also update the **Site URL** to your production domain:
- Production: `https://planitiu.vercel.app`
- Or keep it as `http://localhost:3000` if you primarily develop locally

## How It Works

The application automatically detects the current environment:

- **Local Development**: Uses `http://localhost:3000/auth/callback`
- **Vercel Production**: Uses `https://planitiu.vercel.app/auth/callback`

The code uses `window.location.origin` to dynamically determine the correct URL, so no code changes are needed when deploying.

## Google Cloud Console

**No changes needed** - Google Cloud Console should only have:
```
https://rwqlxbduoovtwohkoxwg.supabase.co/auth/v1/callback
```

Do NOT add your Vercel URL to Google Cloud Console. Supabase handles the redirect to your app.

## Testing

1. Test locally: `http://localhost:3000` should work
2. Test production: `https://planitiu.vercel.app` should work
3. Both should redirect to the correct callback URL automatically

## Environment Variables

Make sure these are set in Vercel:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (if needed for server-side operations)

