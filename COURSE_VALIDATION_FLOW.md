# Course Validation Flow After Screenshot Upload

## Overview

After extracting courses from a screenshot, we validate them against the database using a **multi-strategy matching approach** to handle format variations.

## Current Flow

### Step 1: Extract & Normalize Courses
```typescript
// AI extracts: ['BUS-C 104', 'PHIL-P 106', ...]
// Normalize: uppercase, trim, normalize spacing
// Result: ['BUS-C 104', 'PHIL-P 106', ...] (normalized)
```

### Step 2: Load All Courses from Database
```typescript
// Fetch all course codes (up to 50,000 rows)
const { data: allCourses } = await supabase
  .from('courses')
  .select('course_code')
  .limit(50000)

// Get unique course codes (deduplicate)
const uniqueDbCourses = Array.from(new Set(allCourses.map(c => c.course_code)))
```

**Current Issue:** If RLS is blocking, only 417 rows load instead of 12,302.

### Step 3: Create Normalized Lookup Map
```typescript
// For each database course code, store multiple normalized versions:
// "BUS-C 104" → stored as:
//   - "BUS-C 104" (normalized with space)
//   - "BUS-C104" (no spaces)
//   - "BUS-C 104" (uppercase)
//   - "bus-c 104" (original)
```

This allows matching regardless of format differences.

### Step 4: Match Extracted Courses

For each extracted course, we try **multiple strategies**:

#### Strategy A: In-Memory Map Lookup (Fast)
```typescript
// Try multiple lookup keys:
lookupKeys = [
  "BUS-C 104",    // normalized with space
  "BUS-C104",     // no spaces
  "BUS-C 104",    // uppercase
  "bus-c 104"     // original
]

// Check if any key exists in map
if (courseCodeMap.has(key)) {
  matchedDbCode = courseCodeMap.get(key)
}
```

#### Strategy B: Database Query Fallback (If map lookup fails)
```typescript
// Try multiple patterns with .ilike() (case-insensitive):
patterns = [
  "BUS-C 104",    // normalized
  "BUS-C104",     // no spaces
  "BUS-C 104",    // original
  "BUS-C 104",    // uppercase
  "BUS-C104"      // no spaces uppercase
]

// Query database for each pattern
for (pattern of patterns) {
  const { data } = await supabase
    .from('courses')
    .select('course_code')
    .ilike('course_code', pattern)
    .limit(1)
}
```

#### Strategy C: Wildcard Matching (If exact match fails)
```typescript
// Try flexible pattern: "BUS-C%"
const basePattern = "BUS-C"
const { data } = await supabase
  .from('courses')
  .select('course_code')
  .ilike('course_code', `${basePattern}%`)
  .limit(10)

// Then match in results
```

### Step 5: Return Results
```typescript
return {
  success: true,
  courses: validCourseCodes,        // Matched courses
  invalidCourses: invalidCourses,    // Not found in DB
  debug: {
    extractedCount: 12,
    uniqueCount: 12,
    validCount: 1,                  // Only BUS-A 100 matched
    invalidCount: 11
  }
}
```

## Current Strengths

✅ **Multi-strategy matching** - Tries multiple formats
✅ **In-memory lookup** - Fast for bulk matching
✅ **Database fallback** - Handles edge cases
✅ **Wildcard matching** - Flexible pattern matching
✅ **Comprehensive logging** - Easy to debug

## Current Weaknesses

❌ **RLS blocking** - Only gets 417 rows instead of 12,302 (FIXED with service role key)
❌ **Multiple DB queries** - Could be optimized
❌ **No fuzzy matching** - Exact format required
❌ **No partial matching** - Can't match "BUS-C104" to "BUS C 104"

## Optimization Opportunities

### 1. Use DISTINCT in Query (Already doing this in memory)
```typescript
// Could do in SQL, but we're already deduplicating in memory
const uniqueDbCourses = Array.from(new Set(allCourses.map(c => c.course_code)))
```

### 2. Batch Database Queries
Instead of querying one course at a time, could batch:
```typescript
// Get all courses matching any of the extracted codes
const { data } = await supabase
  .from('courses')
  .select('course_code')
  .in('course_code', extractedCourses)
```

But this won't work if formats don't match exactly.

### 3. Use PostgreSQL Function for Flexible Matching
```sql
CREATE FUNCTION find_course_code(search_code TEXT)
RETURNS TEXT AS $$
  SELECT course_code
  FROM courses
  WHERE UPPER(REPLACE(course_code, ' ', '')) = UPPER(REPLACE(search_code, ' ', ''))
  LIMIT 1;
$$ LANGUAGE plpgsql;
```

### 4. Pre-normalize Database Course Codes
Store normalized versions in database:
```sql
ALTER TABLE courses ADD COLUMN course_code_normalized TEXT;
UPDATE courses SET course_code_normalized = UPPER(REPLACE(course_code, ' ', ''));
CREATE INDEX idx_courses_normalized ON courses(course_code_normalized);
```

## Recommended Improvements

### Priority 1: Fix RLS Issue ✅ (DONE)
- Set `SUPABASE_SERVICE_ROLE_KEY` in Vercel
- This will get all 12,302 rows instead of 417

### Priority 2: Optimize Map Creation
The current map creation is good, but we could:
- Pre-compute normalized versions when inserting courses
- Use database indexes for faster lookups

### Priority 3: Add Fuzzy Matching (Future)
For courses that don't match exactly:
- Levenshtein distance matching
- Soundex matching
- Partial string matching

## Current Status

**Working:** ✅
- Multi-strategy matching
- Format normalization
- Comprehensive error handling

**Needs Fix:** ⚠️
- RLS blocking (fixed with service role key)
- Could optimize database queries

**Future Enhancements:** 💡
- Fuzzy matching
- Pre-normalized database columns
- Batch query optimization

