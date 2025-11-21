# Full Algorithm Location & Components

## Primary File
**File:** `components/Schedule.tsx`  
**Total Lines:** ~1,335 lines  
**Main Function:** `generateSchedule()` starting at **line 385**

---

## Algorithm Components Breakdown

### 1. **Data Structures** (Lines 7-35)
```typescript
interface Course { ... }           // Line 7
interface TimeSlot { ... }         // Line 21
interface ScheduledCourse { ... }  // Line 27
interface UserPreferences { ... }  // Line 31
```

### 2. **Core Helper Functions**

#### Time Parsing & Conflict Detection
- **`parseMeetingTime()`** - Line 97
  - Parses meeting time strings into TimeSlot objects
  - Handles formats: "MWF 3:10 PM", "TuTh 9:35 AM-10:50 AM", etc.
  - Returns: `TimeSlot[]` with days, startTime, endTime (in minutes)

- **`hasTimeConflict()`** - Line 217
  - Checks if two TimeSlots overlap
  - Returns: `boolean`

- **`hasConflict()`** - Line 257
  - Checks if a Course conflicts with existing schedule
  - Uses `parseMeetingTime()` and `hasTimeConflict()`
  - Returns: `boolean`

- **`hasTimeSlotsConflict()`** - Line 274
  - Checks if TimeSlot[] conflicts with existing schedule
  - More efficient (uses pre-parsed timeSlots)
  - Returns: `boolean`

#### GPA & Preferences
- **`getCourseGPA()`** - Line 311
  - Fetches GPA from `grade_distributions` table
  - Calculates average GPA across all sections/terms
  - Returns: `Promise<number>`

- **`meetsTimePreferences()`** - Line 335
  - Checks if timeSlots meet user preferences:
    - `noClassesBefore` (e.g., "11:00 AM")
    - `noClassesAfter` (e.g., "5:00 PM")
    - `avoidDays` (e.g., ["Friday"])
  - Returns: `boolean`

### 3. **Main Algorithm: `generateSchedule()`** (Line 385)

#### Phase 1: Setup & Data Collection (Lines 400-648)
1. **Get User Context** (Lines 404-460)
   - Fetch degree ID
   - Calculate current semester (fall/spring)
   - Calculate academic year (1-4) based on graduation year
   - Get courses already taken

2. **Get Requirements** (Lines 463-481)
   - Fetch degree requirements for current year/term
   - Filter by `degree_id`, `year`, `term`

3. **Collect Course Options** (Lines 506-648)
   - For each requirement:
     - Get fulfilling courses from `requirement_fulfillments`
     - Check if already fulfilled by taken courses
     - Filter out taken courses
     - Get ALL sections from `courses` table
     - Filter by status ("Open"), meeting_time, preferences
     - Group by course_code
     - Get GPA for each course
     - Parse time slots for all sections
   - Creates `RequirementOption[]` array

#### Phase 2: Sorting & Grouping (Lines 650-706)
1. **Sort Options** (Lines 651-658)
   - Critical requirements first
   - Then by GPA (highest first)

2. **Group by Requirement** (Lines 661-668)
   - Creates `requirementGroups` Map

3. **Randomization** (Lines 670-706)
   - Shuffle sections within each course
   - Shuffle non-critical requirements (keep critical first)
   - Adds variety for regeneration

#### Phase 3: Backtracking Algorithm (Lines 708-898)
**Function:** `findBestSchedule()` - Line 713

**Algorithm Type:** Recursive backtracking with greedy GPA optimization

**Flow:**
1. Base case: All requirements satisfied → validate and return schedule
2. For current requirement:
   - Get all course options (sorted by GPA)
   - For each course option:
     - For each section:
       - Check time conflicts
       - If no conflict: add to schedule, recurse
       - If conflict: try next section
   - If no valid section found: skip requirement

**Key Features:**
- Tries highest GPA courses first
- Validates conflicts at each step
- Backtracks if no valid section found
- Returns first complete conflict-free schedule

#### Phase 4: Final Validation (Lines 903-963)
1. **Conflict Re-check** (Lines 909-949)
   - Double-checks all courses for conflicts
   - Removes any conflicting courses

2. **Final Validation** (Lines 952-963)
   - Checks all courses against each other one more time
   - Ensures absolutely no conflicts

#### Phase 5: Replacement Logic (Lines 968-1100+)
- Attempts to find replacements for removed courses
- Tries alternative sections/courses

#### Phase 6: Save & Display (Lines 1100+)
- Saves schedule to localStorage
- Updates React state
- Displays schedule to user

---

## Algorithm Characteristics

### Type: **Greedy Backtracking**
- **Strategy:** Try highest GPA first, backtrack on conflicts
- **Optimization:** GPA maximization
- **Constraints:** No time conflicts, preferences met

### Complexity
- **Time:** O(R × C × S × T)
  - R = requirements
  - C = courses per requirement
  - S = sections per course
  - T = time conflict checks
- **Space:** O(R × C) for requirement groups

### Current Limitations
1. Returns only **ONE** schedule (first valid found)
2. No scoring/ranking of multiple schedules
3. No comparison between alternatives

---

## Where to Modify for Multi-Schedule Generation

### Key Change Points:

1. **`findBestSchedule()` function** (Line 713)
   - **Current:** Returns first valid schedule
   - **Change:** Collect multiple valid schedules (top N)
   - **Location:** Line 881 - when `result && result.length > 0`, collect it instead of returning immediately

2. **Add Scoring Function** (New, after Line 963)
   ```typescript
   function scoreSchedule(schedule: ScheduledCourse[], preferences: any): number {
     const avgGPA = schedule.reduce((sum, c) => sum + (c.gpa || 0), 0) / schedule.length
     const totalCredits = schedule.reduce((sum, c) => sum + parseFloat(c.credits || '0'), 0)
     const timeMatch = calculateTimePreferenceMatch(schedule, preferences)
     return (avgGPA * 0.6) + (totalCredits / 18 * 0.2) + (timeMatch * 0.2)
   }
   ```

3. **Modify Return** (Line 901)
   - **Current:** `const bestSchedule = findBestSchedule(0, [])`
   - **Change:** `const candidateSchedules = findBestSchedules(0, [], 20)` // top 20
   - Sort by score, return top N

---

## Related Files

### Analysis Document
- **File:** `SCHEDULE_ALGORITHM_ANALYSIS.md`
- Contains detailed algorithm analysis and improvement suggestions

### API Route (AI Agent)
- **File:** `app/api/schedule-agent/route.ts`
- Currently does AI-based scheduling (separate from algorithm)
- Should be refactored to use algorithm + AI ranking

---

## Summary

**The complete algorithm is in ONE file:**
- **`components/Schedule.tsx`** - Lines 385-1100+ (main algorithm)
- **Helper functions:** Lines 97-383
- **Total algorithm code:** ~700 lines

**To generate multiple schedules, modify:**
1. `findBestSchedule()` to collect multiple results
2. Add scoring function
3. Return top N sorted by score

