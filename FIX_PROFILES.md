# Fix Missing Profiles

If profiles aren't being created automatically when users sign up, follow these steps:

## Step 1: Run the Fix Script

Go to Supabase Dashboard → SQL Editor and run:

```sql
-- Fix missing profiles for existing users
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

This will create profiles for any users that don't have one yet.

## Step 2: Verify Trigger Exists

Run this to check if the trigger is set up:

```sql
SELECT tgname, tgrelid::regclass 
FROM pg_trigger 
WHERE tgname = 'on_auth_user_created';
```

If it doesn't exist, run the entire `create_profiles_table.sql` migration again.

## Step 3: Test New Signup

After fixing, test creating a new user to verify the trigger works going forward.

