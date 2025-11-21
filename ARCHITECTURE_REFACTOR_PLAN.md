# Architecture Refactoring Plan: Algorithm-First Approach

## Current Architecture (AI-First)
```
User Request → AI Agent → query_courses → AI selects → add_course_to_schedule → finalize
```
**Problems:**
- Expensive (many LLM calls)
- Slow (sequential tool calls)
- Unreliable (agent can make mistakes)
- High token usage

## New Architecture (Algorithm-First)
```
User Request → Algorithm generates top N schedules → AI ranks/explains top 5 → Display best
```

## Implementation Steps

### Step 1: Refactor `generateSchedule()` in `Schedule.tsx`
**Current:** Returns one schedule
**New:** Returns top N candidate schedules (5-20)

**Changes needed:**
1. Modify backtracking to collect multiple valid schedules instead of returning first
2. Score each schedule:
   - Average GPA (weight: 0.6)
   - Total credits (weight: 0.2)
   - Time preference match (weight: 0.2)
3. Return top N sorted by score

### Step 2: Create AI Ranking Endpoint
**New file:** `app/api/schedule-rank/route.ts`

**Purpose:** Takes top N schedules, returns ranked/explained results

**Input:**
```json
{
  "schedules": [
    {
      "id": "schedule_1",
      "courses": [...],
      "avgGPA": 3.5,
      "totalCredits": 15,
      "score": 85.2
    },
    ...
  ],
  "preferences": {
    "noClassesBefore": "11:00 AM",
    ...
  }
}
```

**Output:**
```json
{
  "best_schedule_id": "schedule_1",
  "rankings": [
    {
      "schedule_id": "schedule_1",
      "rank": 1,
      "reasoning": "Best balance of GPA and time preferences..."
    },
    ...
  ]
}
```

### Step 3: Update Schedule Agent Route
**File:** `app/api/schedule-agent/route.ts`

**Changes:**
- Remove heavy lifting from AI (query_courses, selection logic)
- Keep AI for:
  - Natural language understanding of preferences
  - Final ranking/explanation of top candidates
  - User questions about schedules

### Step 4: Add Server-Side Safeguards
1. **Rate limiting:** Max 3 recursive tool calls or 10 seconds
2. **Token cap:** Abort if input exceeds 25k tokens
3. **Caching:** Memoize query_courses and check_prerequisites results

### Step 5: Fix Existing Errors
1. Empty-message 400s: Keep filter that drops empty assistant messages
2. `filter is not a function`: Ensure all content is array of blocks
3. Supabase warning: Switch from `auth.getSession()` to `auth.getUser()`

## File Locations

### Core Algorithm
- **File:** `components/Schedule.tsx`
- **Function:** `generateSchedule()` (line 385)
- **Current:** Generates 1 schedule
- **Target:** Generate top N schedules (5-20)

### AI Agent
- **File:** `app/api/schedule-agent/route.ts`
- **Current:** Does everything (query, select, build)
- **Target:** Only handles ranking/explanation

### New AI Ranking Endpoint
- **File:** `app/api/schedule-rank/route.ts` (to be created)
- **Purpose:** Rank and explain top N schedules

## Scoring Function

```typescript
function scoreSchedule(schedule: ScheduledCourse[], preferences: any): number {
  const avgGPA = schedule.reduce((sum, c) => sum + (c.gpa || 0), 0) / schedule.length
  const totalCredits = schedule.reduce((sum, c) => sum + parseFloat(c.credits || '0'), 0)
  const timeMatch = calculateTimePreferenceMatch(schedule, preferences)
  
  return (avgGPA * 0.6) + (totalCredits / 18 * 0.2) + (timeMatch * 0.2)
}
```

## Benefits

1. **Cost:** ~90% reduction in LLM calls
2. **Speed:** Algorithm is deterministic and fast
3. **Reliability:** No agent mistakes in course selection
4. **Scalability:** Can generate 100+ schedules in seconds
5. **User Experience:** AI provides natural language explanation of why schedule is good

