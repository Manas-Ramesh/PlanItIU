-- Diagnostic script to check if trigger exists and is working
-- Run this in Supabase SQL Editor to verify your setup

-- 1. Check if profiles table exists
SELECT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'profiles'
) AS profiles_table_exists;

-- 2. Check if handle_new_user function exists
SELECT EXISTS (
    SELECT FROM pg_proc 
    WHERE proname = 'handle_new_user'
) AS function_exists;

-- 3. Check if trigger exists
SELECT 
    tgname AS trigger_name,
    tgrelid::regclass AS table_name,
    tgenabled AS is_enabled
FROM pg_trigger 
WHERE tgname = 'on_auth_user_created';

-- 4. Check recent users without profiles
SELECT 
    u.id,
    u.email,
    u.created_at,
    CASE WHEN p.id IS NULL THEN 'MISSING PROFILE' ELSE 'HAS PROFILE' END AS profile_status
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
ORDER BY u.created_at DESC
LIMIT 10;

