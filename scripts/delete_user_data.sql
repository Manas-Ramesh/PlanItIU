-- Script to delete a user's data from all tables
-- Replace 'YOUR_USER_ID_HERE' with your actual user_id (UUID)

-- Step 1: Delete from user_preferences
DELETE FROM public.user_preferences 
WHERE user_id = 'YOUR_USER_ID_HERE';

-- Step 2: Delete from profiles
DELETE FROM public.profiles 
WHERE user_id = 'YOUR_USER_ID_HERE';

-- Step 3: Delete from auth.users (Supabase Auth)
-- Note: This must be done in Supabase Dashboard → Authentication → Users
-- Or via SQL Editor with proper permissions:
-- DELETE FROM auth.users WHERE id = 'YOUR_USER_ID_HERE';

-- To find your user_id, run this first:
-- SELECT id, email FROM auth.users WHERE email = 'your-email@example.com';

