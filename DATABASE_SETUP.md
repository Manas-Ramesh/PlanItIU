# Database Setup Instructions

## Step 1: Run the Migration SQL

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Navigate to your project: **planituni**
3. Click on **SQL Editor** in the left sidebar
4. Click **New Query**
5. Copy and paste the entire contents of `supabase/migrations/create_profiles_table.sql`
6. Click **Run** to execute the SQL

## What This Does

This migration will:
- Create a `profiles` table with:
  - `id` - Primary key (references `auth.users.id`)
  - `user_id` - The user ID you'll use for other tables (also references `auth.users.id`)
  - `email` - User's email
  - `full_name` - User's full name
  - `created_at` and `updated_at` - Timestamps
- Enable Row Level Security (RLS) for security
- Create policies so users can only access their own profile
- Create a trigger that automatically creates a profile when a new user signs up
- Create a trigger to update the `updated_at` timestamp automatically

## Important Notes

- The `user_id` field in the profiles table is what you'll reference in your other tables
- When a user signs up, their profile is automatically created by the database trigger
- The `user_id` will be the same as the `id` field (both reference `auth.users.id`)

## Next Steps

After running the migration:
1. Test signup at `/signup`
2. Check the `profiles` table in Supabase to verify the profile was created
3. The `user_id` is now ready to be used in your other tables!

