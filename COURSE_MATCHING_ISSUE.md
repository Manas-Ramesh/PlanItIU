# Course Matching Issue in Production

## Problem

The screenshot upload works locally but in production, courses extracted by AI are not matching with the database. The logs show:

- ✅ AI successfully extracts courses: `['BUS-C 104', 'PHIL-P 106', ...]`
- ✅ Database query loads courses: `417 unique courses`
- ❌ Matching fails: Only 1 out of 12 courses matches (`BUS-A 100` works, others don't)

## Root Cause Analysis

The issue is likely one of these:

### 1. Course Code Format Mismatch

The course codes in your database might be stored in a different format than what the AI extracts:

**AI Extracts:** `"BUS-C 104"` (with space)
**Database Might Have:** 
- `"BUS-C104"` (no space)
- `"BUS C 104"` (space instead of hyphen)
- `"BUS-C-104"` (different spacing)
- `"busc104"` (all lowercase, no formatting)

### 2. Supabase Query Behavior Differences

The `.ilike()` method might behave differently in production vs local:
- Network latency affecting query execution
- Different Supabase client configuration
- Case sensitivity issues
- Special character handling

### 3. Database Schema Differences

The production database might have:
- Different data than local database
- Missing courses
- Different formatting/storage

## Enhanced Debugging Added

I've added comprehensive debugging that will show:

1. **Sample of actual database course codes** - See what format they're stored in
2. **Lookup map debugging** - See if courses are in the map but not matching
3. **Multiple query strategies** - Tries various formats and query methods
4. **Wildcard matching** - Attempts flexible pattern matching
5. **Direct database queries** - Tests specific courses with multiple variations

## How to Diagnose

### Step 1: Check Vercel Function Logs

After deploying the updated code, check the logs for:

```
📚 Sample of database course codes (first 10): [...]
🔍 Debug: Checking lookup map for extracted courses...
   "BUS-C 104": { inMap: true/false, mapValue: "...", ... }
🔍 Debug: Checking if specific courses exist in database...
   "BUS-C 104": { totalMatches: X, matches: [...], ... }
```

### Step 2: Compare Formats

Look at the logs to see:
- What format are course codes stored in the database?
- What format is the AI extracting?
- Are they different?

### Step 3: Check Database Directly

Query your Supabase database directly:

```sql
-- Check what BUS-C courses exist
SELECT DISTINCT course_code 
FROM courses 
WHERE course_code ILIKE 'BUS-C%' 
LIMIT 20;

-- Check exact format
SELECT course_code, LENGTH(course_code) as len
FROM courses 
WHERE course_code ILIKE '%BUS%104%'
LIMIT 10;
```

## Solutions

### Solution 1: Normalize Database Course Codes

If the database has inconsistent formatting, normalize them:

```sql
-- Example: Normalize all course codes to "DEPT-X ###" format
UPDATE courses 
SET course_code = UPPER(TRIM(REGEXP_REPLACE(course_code, '\s+', ' ', 'g')))
WHERE course_code IS NOT NULL;
```

### Solution 2: Improve Matching Logic

The code now tries multiple matching strategies:
- Normalized with spaces: `"BUS-C 104"`
- No spaces: `"BUS-C104"`
- Original format
- Wildcard matching
- Multiple query methods (`.ilike()`, `.eq()`, etc.)

### Solution 3: Use Database Function

If queries still fail, create a PostgreSQL function for flexible matching:

```sql
CREATE OR REPLACE FUNCTION find_course_code(search_code TEXT)
RETURNS TABLE(course_code TEXT) AS $$
BEGIN
  RETURN QUERY
  SELECT DISTINCT c.course_code
  FROM courses c
  WHERE 
    UPPER(REPLACE(c.course_code, ' ', '')) = UPPER(REPLACE(search_code, ' ', ''))
    OR UPPER(TRIM(c.course_code)) = UPPER(TRIM(search_code))
    OR c.course_code ILIKE '%' || REPLACE(search_code, ' ', '%') || '%'
  LIMIT 1;
END;
$$ LANGUAGE plpgsql;
```

Then use it in the API:
```typescript
const { data, error } = await supabase.rpc('find_course_code', { 
  search_code: extractedCode 
})
```

## Immediate Next Steps

1. **Deploy the updated code** with enhanced debugging
2. **Upload a screenshot** in production
3. **Check Vercel logs** for the debug output
4. **Compare** the database course code format with extracted format
5. **Fix the mismatch** based on what you find

## Expected Log Output

After deploying, you should see logs like:

```
📚 Loaded 417 course rows from database
📚 Found 350 unique course codes in database
📚 Sample of database course codes (first 10): ['BUS-A 100', 'BUS-C104', ...]
🔍 Debug: Checking lookup map for extracted courses...
   "BUS-C 104": { inMap: false, mapValue: null, mapKeys_sample: [...] }
🔍 Direct DB query for "BUS-C 104": { found: 0, results: [], error: null }
```

This will tell you exactly why the matching is failing.

## Most Likely Issue

Based on the symptoms (works locally, fails in production, only 1 course matches), the most likely issue is:

**The production database has course codes in a different format than your local database.**

For example:
- Local DB: `"BUS-C 104"` (with space)
- Production DB: `"BUS-C104"` (no space)

The enhanced matching logic should handle this, but if it doesn't, you'll need to either:
1. Normalize the database course codes
2. Update the matching logic to handle the specific format difference
3. Use the PostgreSQL function approach for more flexible matching

