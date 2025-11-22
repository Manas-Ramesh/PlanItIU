# Service Role Key Fix - CRITICAL

## The Problem

Your API route was **silently falling back to the anon key** even if `SUPABASE_SERVICE_ROLE_KEY` was set in Vercel, because of this code:

```typescript
// ❌ OLD CODE - Silent fallback
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
```

**Result:** Even with the service role key set, if it wasn't loaded correctly, it would silently use the anon key → RLS restricts to 417 rows.

## The Fix

Changed the code to **REQUIRE the service role key** and **fail loudly** if it's missing:

```typescript
// ✅ NEW CODE - Fails loudly if service role key is missing
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseServiceKey) {
  console.error('❌ CRITICAL ERROR: SUPABASE_SERVICE_ROLE_KEY is not set!')
  throw new Error('SUPABASE_SERVICE_ROLE_KEY is required...')
}
```

## What Changed

### Before (Silent Fallback)
- ✅ If service role key exists → uses it
- ❌ If service role key missing → silently uses anon key
- ❌ No clear error message
- ❌ RLS restricts results to 417 rows

### After (Required)
- ✅ If service role key exists → uses it
- ✅ If service role key missing → **fails with clear error**
- ✅ Logs clearly show which key is being used
- ✅ Prevents silent RLS issues

## Verification

After deploying, check Vercel logs. You should see:

**✅ Success:**
```
✅ Using service role key - RLS will be bypassed
📊 Database connection check: { keyType: 'SERVICE ROLE KEY ✅', ... }
📚 Loaded 12302 course rows from database
```

**❌ Failure (if key not set):**
```
❌ CRITICAL ERROR: SUPABASE_SERVICE_ROLE_KEY is not set!
Error: SUPABASE_SERVICE_ROLE_KEY is required...
```

## Next Steps

1. **Verify in Vercel:**
   - Go to Vercel Dashboard → Settings → Environment Variables
   - Confirm `SUPABASE_SERVICE_ROLE_KEY` is set for **Production**
   - Value should be a long JWT token (starts with `eyJ`)

2. **Redeploy:**
   - After setting/verifying the key, redeploy
   - The API will now fail loudly if the key is missing

3. **Check Logs:**
   - After deployment, upload a screenshot
   - Check logs for: `✅ Using service role key`
   - Should see: `📚 Loaded 12302 course rows` (not 417)

## Why This Matters

- **Before:** Silent failure → 417 rows → 11/12 courses don't match
- **After:** Loud failure OR correct behavior → 12,302 rows → all courses match

The service role key **bypasses RLS**, which is essential for server-side API routes that need to read all courses.

## Security Note

✅ **Safe:** Service role key in server-side API routes (like `/api/analyze-transcript`)
❌ **Never:** Expose service role key in client-side code or browser

The service role key should ONLY be used in:
- `/app/api/**/route.ts` files
- Server-side utilities
- Never in React components or client-side code

