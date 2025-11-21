-- ⚠️  WARNING: This will delete ALL users from the database!
-- Use with caution. Only run this if you want to clear everything.

-- Delete all user preferences
DELETE FROM public.user_preferences;

-- Delete all profiles
DELETE FROM public.profiles;

-- To delete auth users, go to Supabase Dashboard → Authentication → Users
-- Or run this in SQL Editor (requires admin permissions):
-- DELETE FROM auth.users;

-- Reset sequences (optional, if you want to start IDs from 1)
-- ALTER SEQUENCE public.user_preferences_id_seq RESTART WITH 1;
-- ALTER SEQUENCE public.profiles_id_seq RESTART WITH 1;

