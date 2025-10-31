-- Fix missing profiles for existing users
-- This will create profiles for any users in auth.users who don't have a profile yet

INSERT INTO public.profiles (id, user_id, email, full_name)
SELECT 
    id,
    id as user_id,
    email,
    COALESCE(raw_user_meta_data->>'full_name', email) as full_name
FROM auth.users
WHERE id NOT IN (SELECT id FROM public.profiles)
ON CONFLICT (id) DO NOTHING;

-- Verify the trigger is set up correctly
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM pg_trigger 
        WHERE tgname = 'on_auth_user_created' 
        AND tgrelid = 'auth.users'::regclass
    ) THEN
        RAISE NOTICE 'Trigger on_auth_user_created does not exist. Please run create_profiles_table.sql';
    ELSE
        RAISE NOTICE 'Trigger on_auth_user_created exists and is active.';
    END IF;
END $$;

