# Setup Instructions

## 1. Environment Variables

Create a `.env.local` file in the root directory with:

```
NEXT_PUBLIC_SUPABASE_URL=https://rwqlxbduoovtwohkoxwg.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ3cWx4YmR1b292dHdvaGtveHdnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE3NDkwNDQsImV4cCI6MjA3NzMyNTA0NH0.urUHVnJJQCpuwOYHUtXcYx5xS0QBLWjFK0qGiFRNFdc
```

## 2. Database Setup

**IMPORTANT**: You must run the database migration before the app will work properly.

See `DATABASE_SETUP.md` for detailed instructions on running the SQL migration in your Supabase dashboard.

## 3. Run the Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

## Features Implemented

✅ Login page (`/login`)
✅ Signup page (`/signup`)
✅ Protected dashboard (`/dashboard`)
✅ Profile management with user_id storage
✅ Automatic profile creation on signup (via database trigger)
✅ Authentication context for managing auth state
✅ Middleware for route protection

## How It Works

1. User signs up → Profile is automatically created with `user_id`
2. User logs in → Can access dashboard
3. Profile displays the `user_id` which can be used for other tables
4. All user info is stored in the `profiles` table

## Next Steps

- Run the database migration (see `DATABASE_SETUP.md`)
- Create your `.env.local` file
- Start the dev server
- Test signup/login flow

