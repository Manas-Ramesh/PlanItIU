# Course Recommender Script Setup

## RLS (Row Level Security) Issue

The `user_preferences` table has RLS enabled, which means the script needs special permissions to read it.

### Solution 1: Use Service Role Key (Recommended)

1. Go to Supabase Dashboard → Settings → API
2. Copy the `service_role` key (NOT the anon key)
3. Add it to `.env.local`:

```env
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

The script will automatically use this key if available, which bypasses RLS.

### Solution 2: Temporarily Disable RLS (For Testing Only)

⚠️ **Not recommended for production!**

In Supabase SQL Editor, run:

```sql
ALTER TABLE public.user_preferences DISABLE ROW LEVEL SECURITY;
```

Remember to re-enable it later:

```sql
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;
```

### Solution 3: Add a Policy for Service Access

Create a policy that allows service role access (more secure than disabling RLS):

```sql
CREATE POLICY "Service role can read all preferences"
    ON public.user_preferences
    FOR SELECT
    USING (true);
```

## Usage

After setting up the service role key:

```bash
# Interactive mode (lists all users)
python scripts/course_recommender.py

# By email
python scripts/course_recommender.py user@example.com

# By email with term
python scripts/course_recommender.py user@example.com fall
```

