# Profile Creation Setup

## The Problem
When you sign up (regular or OAuth), profiles aren't being created in the `profiles` table.

## Solutions Implemented

I've added **manual fallback** profile creation in:
1. **Signup page** (`app/signup/page.tsx`) - Creates profile if trigger fails
2. **OAuth callback** (`app/auth/callback/route.ts`) - Creates profile for OAuth users

This means profiles should be created even if the database trigger isn't working.

## Step 1: Re-run Database Migrations

Since you deleted all tables, you need to recreate everything:

### In Supabase Dashboard → SQL Editor:

**Run this first:**
```sql
-- Copy and paste the entire contents of:
supabase/migrations/create_profiles_table.sql
```

**Then run this:**
```sql
-- Copy and paste the entire contents of:
supabase/migrations/create_user_preferences_table.sql
```

## Step 2: Verify Trigger is Working

Run this diagnostic query in Supabase SQL Editor:

```sql
-- Copy and paste the entire contents of:
supabase/migrations/check_trigger.sql
```

This will show you:
- ✅ If profiles table exists
- ✅ If the trigger function exists
- ✅ If the trigger is active
- ✅ Recent users and their profile status

## Step 3: Test Profile Creation

1. **Regular Signup:**
   - Go to `/signup`
   - Create a new account
   - Check browser console for logs:
     - `✅ Profile exists (created by trigger)` = Trigger worked
     - `✅ Profile created manually` = Manual fallback worked
   - Check Supabase Dashboard → Table Editor → `profiles` table

2. **OAuth Signup:**
   - Go to `/signup` or `/login`
   - Click "Sign in with Google"
   - After redirect, check console logs
   - Check `profiles` table

## Step 4: Fix Existing Users Without Profiles

If you have existing users without profiles, run this in SQL Editor:

```sql
-- Create profiles for existing users
INSERT INTO public.profiles (id, user_id, email, full_name)
SELECT 
    id,
    id as user_id,
    email,
    COALESCE(raw_user_meta_data->>'full_name', email) as full_name
FROM auth.users
WHERE id NOT IN (SELECT id FROM public.profiles)
ON CONFLICT (id) DO NOTHING;
```

## Why Profiles Might Not Be Created

1. **Trigger not set up** - Migrations not run
2. **Email confirmation required** - Supabase might need email confirmation first (check Settings → Authentication)
3. **RLS blocking trigger** - Shouldn't happen since trigger uses `SECURITY DEFINER`
4. **Race condition** - Manual fallback handles this now

## Current Behavior

With the updated code:
- ✅ **Regular signup**: Waits 500ms, checks for profile, creates manually if missing
- ✅ **OAuth signup**: Checks for profile after auth, creates manually if missing
- ✅ **Both methods**: Profiles should be created reliably

Check your browser console and terminal logs to see which method is being used!

