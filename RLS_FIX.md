# RLS (Row Level Security) Fix for Course Matching

## The Problem

Your production API only loads **417 rows** instead of **12,302 rows** from the `courses` table. This is why 11 out of 12 extracted courses don't match - they simply aren't in that 417-row subset.

## Root Cause: RLS (Row Level Security)

The issue is **NOT**:
- ❌ Course code format differences
- ❌ Matching logic
- ❌ OpenAI parsing
- ❌ Vercel configuration

The issue **IS**:
- ✅ **RLS is enabled on the `courses` table in production**
- ✅ **Your API is using the anon key instead of service role key**
- ✅ **RLS policies restrict the anon key to only 417 rows**

## Why This Happens

Your code (line 23) does:
```typescript
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
```

If `SUPABASE_SERVICE_ROLE_KEY` is not set in Vercel production:
- It falls back to `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Anon key respects RLS policies
- RLS policies likely filter by `user_id` or some other condition
- Result: Only 417 rows are returned instead of 12,302

## The Fix

### Option 1: Set Service Role Key in Vercel (RECOMMENDED)

1. Go to **Vercel Dashboard → Your Project → Settings → Environment Variables**
2. Add:
   - **Name:** `SUPABASE_SERVICE_ROLE_KEY`
   - **Value:** Your Supabase service role key (from Supabase Dashboard → Settings → API)
   - **Environment:** Production (and Preview if needed)
3. **Redeploy** your application

The service role key **bypasses RLS**, so you'll get all 12,302 rows.

### Option 2: Add RLS Policy to Allow Reading All Courses

If you can't use the service role key, add an RLS policy:

1. Go to **Supabase Dashboard → Table Editor → courses**
2. Click **RLS** tab
3. Click **New Policy**
4. Create a policy:

```sql
CREATE POLICY "Allow read all courses for API"
ON public.courses
FOR SELECT
USING (true);
```

This allows anyone (including anon key) to read all courses.

### Option 3: Disable RLS (NOT RECOMMENDED)

⚠️ **Only for testing!** Not recommended for production.

```sql
ALTER TABLE public.courses DISABLE ROW LEVEL SECURITY;
```

## How to Verify the Fix

After deploying, check Vercel function logs. You should see:

**Before fix:**
```
📚 Loaded 417 course rows from database
⚠️ WARNING: Only 417 courses found. Expected ~12,302.
```

**After fix:**
```
📚 Loaded 12302 course rows from database
✅ Using service role key - RLS bypassed
```

## Enhanced Logging Added

The code now logs:
- ✅ Which key is being used (service role vs anon)
- ✅ Warning if too few rows are loaded
- ✅ Specific error messages if RLS is blocking access
- ✅ Instructions on how to fix

## Security Note

The service role key has **full database access** and bypasses all RLS policies. This is safe for server-side API routes, but:

- ✅ **DO** use it in server-side API routes (like `/api/analyze-transcript`)
- ❌ **DON'T** expose it in client-side code
- ✅ **DO** keep it secret (never commit to git)
- ✅ **DO** use it only in Vercel environment variables

## Summary

**The Problem:** RLS restricts anon key to 417 rows
**The Solution:** Set `SUPABASE_SERVICE_ROLE_KEY` in Vercel production
**The Result:** API gets all 12,302 rows, all courses match correctly

After setting the service role key and redeploying, your course matching should work perfectly! 🎉

