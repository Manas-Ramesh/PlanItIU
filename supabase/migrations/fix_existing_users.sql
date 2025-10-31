-- Fix existing users without profiles
-- Run this in Supabase SQL Editor

INSERT INTO public.profiles (id, user_id, email, full_name)
SELECT 
    u.id,
    u.id as user_id,
    u.email,
    COALESCE(u.raw_user_meta_data->>'full_name', u.email) as full_name
FROM auth.users u
WHERE u.id NOT IN (SELECT id FROM public.profiles)
ON CONFLICT (id) DO NOTHING;

-- Verify the fix
SELECT 
    u.id,
    u.email,
    u.created_at,
    CASE WHEN p.id IS NULL THEN 'MISSING PROFILE' ELSE 'HAS PROFILE ✅' END AS profile_status
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
ORDER BY u.created_at DESC;

