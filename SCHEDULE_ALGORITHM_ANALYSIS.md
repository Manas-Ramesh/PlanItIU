# Schedule Generation Algorithm Analysis

## Overview

The schedule generation algorithm is implemented in `components/Schedule.tsx` and is responsible for creating a conflict-free course schedule based on a student's major, graduation year, and courses already taken. The algorithm prioritizes courses with higher GPAs while ensuring no time conflicts occur.

## Algorithm Flow

### 1. Initialization & Context Setup

**Location**: `Schedule.tsx` - `generateSchedule()` function (lines 264-528)

The algorithm begins by:
- Fetching user preferences (major, expected graduation year, courses taken)
- Determining the current academic year (1-4) based on graduation year
- Determining the current term (fall/spring) based on current date
- Fetching degree requirements for the calculated year and term

**Year Calculation Logic** (lines 309-326):
```typescript
// Years until graduation → Academic Year mapping:
// 4 years → Year 1 (Freshman)
// 3 years → Year 2 (Sophomore)  
// 2 years → Year 3 (Junior)
// 1 year → Year 4 (Senior)
```

**Term Calculation Logic** (lines 297-301):
```typescript
// Fall: August-December (months 8-12)
// Spring: January-July (months 1-7)
```

### 2. Requirements Processing

For each degree requirement (lines 358-508):

#### Step 2.1: Get Fulfilling Courses
- Queries `requirement_fulfillments` table to find courses that fulfill the requirement
- Normalizes course codes (case-insensitive comparison)

#### Step 2.2: Check if Already Fulfilled
- Checks if any taken course already fulfills the requirement
- If fulfilled, skips to next requirement (lines 380-389)

#### Step 2.3: Filter Available Courses
- Removes courses already taken from consideration (lines 392-395)
- Filters for courses with valid meeting times and "Open" status (lines 441-445)

#### Step 2.4: GPA Ranking
- Fetches GPA statistics from `grade_distributions` table (lines 241-262)
- Calculates average GPA across all sections/terms for each course
- Sorts courses by GPA (highest first) (line 473)

#### Step 2.5: Conflict Detection & Course Selection
- Iterates through courses sorted by GPA (highest first)
- For each course:
  1. Parses meeting time string into structured `TimeSlot[]` format
  2. Checks for conflicts with already-scheduled courses
  3. If no conflict, adds course to schedule and breaks loop
  4. If conflict, tries next course

### 3. Time Conflict Detection

**Location**: `Schedule.tsx` - `hasConflict()` and `hasTimeConflict()` functions

#### Time Parsing (lines 84-201)
The algorithm parses meeting time strings in various formats:
- `"MWF Monday, Wednesday, Friday 3:10 PM"`
- `"TuTh Tuesday, Thursday 9:35 AM-10:50 AM"`
- `"MW Monday, Wednesday 10:00 AM - 11:15 AM"`

**Key Features**:
- Extracts day abbreviations (M, Tu, W, Th, F, Sa, Su)
- Handles both start-end time pairs and single times (assumes 50-min duration)
- Converts to minutes since midnight for easy comparison
- Handles edge cases (12:00 AM/PM conversions)

#### Conflict Detection Logic (lines 204-221)
```typescript
hasTimeConflict(slot1, slot2):
  1. Check if slots share any common day
  2. Check if time ranges overlap:
     - Overlap occurs if: slot1.start < slot2.end AND slot2.start < slot1.end
  3. Return true if both conditions met
```

**Conflict Check Flow** (lines 224-238):
- For each course candidate:
  - Parse its meeting times into `TimeSlot[]`
  - Compare against all existing scheduled courses
  - Check all time slots of candidate against all time slots of existing courses
  - Return true if ANY conflict found

### 4. Course Selection Strategy

**Greedy Algorithm with GPA Optimization**:

1. **Priority Order**:
   - Requirements processed in database order (typically by requirement name)
   - Within each requirement, courses sorted by GPA (descending)

2. **Selection Criteria**:
   - Must have parseable meeting time
   - Must be "Open" status (if status field available)
   - Must not conflict with existing schedule
   - Highest GPA among non-conflicting options

3. **Fallback Behavior**:
   - If no valid courses with meeting times: adds course without time info (lines 450-460)
   - If all courses conflict: requirement is skipped (lines 505-507)

### 5. Data Structures

#### TimeSlot Interface (lines 20-24)
```typescript
interface TimeSlot {
  days: string[]        // e.g., ["Monday", "Wednesday", "Friday"]
  startTime: number     // minutes since midnight (e.g., 570 = 9:30 AM)
  endTime: number       // minutes since midnight (e.g., 650 = 10:50 AM)
}
```

#### ScheduledCourse Interface (lines 26-28)
```typescript
interface ScheduledCourse extends Course {
  timeSlots: TimeSlot[]  // Parsed meeting times
  gpa?: number           // Average GPA from grade distributions
  requirement_name?: string
}
```

### 6. GPA Calculation

**Location**: `getCourseGPA()` function (lines 241-262)

**Process**:
1. Queries `grade_distributions` table for all sections of the course
2. Filters out null grades
3. Calculates average of `avg_class_grade` across all sections/terms
4. Returns 0 if no data available

**Note**: This is a simple average. The Python script (`course_recommender.py`) has more sophisticated GPA ranking that considers:
- Best instructor GPA (lines 430-431)
- Total sections and terms (for reliability)

### 7. Storage & Persistence

**Location**: Lines 513-516

- Saves generated schedule to `localStorage` with user-specific key
- Dispatches custom event for Calendar component to update
- Key format: `generatedSchedule_${userId}`

## Algorithm Characteristics

### Strengths

1. **Conflict-Free Guarantee**: Ensures no time overlaps in final schedule
2. **GPA Optimization**: Prioritizes courses with better historical grades
3. **Requirement-Based**: Ensures all degree requirements are considered
4. **Flexible Time Parsing**: Handles various meeting time formats
5. **User Context Aware**: Considers graduation year, major, and courses taken

### Limitations & Potential Issues

1. **Greedy Approach**: 
   - Processes requirements sequentially
   - May miss better global optimizations
   - Example: Requirement A might block Requirement B, but reversing order could work

2. **No Backtracking**:
   - Once a course is selected, it's never reconsidered
   - If later requirements can't be fulfilled due to conflicts, they're simply skipped

3. **Single Section Selection**:
   - Only considers one section per course
   - Doesn't try alternative sections if first choice conflicts

4. **GPA Data Quality**:
   - Relies on `grade_distributions` table completeness
   - No GPA data = course ranked as 0 (sorted last)
   - Doesn't distinguish between "no data" and "low GPA"

5. **Time Parsing Edge Cases**:
   - May fail on unusual time formats
   - Assumes 50-minute duration if end time missing
   - Some time format errors may be silently ignored

6. **No Prerequisite Checking**:
   - Doesn't verify student has taken prerequisites
   - Could recommend courses student isn't eligible for

7. **No Credit Limit Enforcement**:
   - Doesn't check if total credits exceed typical limits (e.g., 18 credits)
   - Could generate unrealistic schedules

8. **Status Field Dependency**:
   - Filters for "Open" status, but may miss courses with null status
   - Could exclude valid courses if status field is missing

## Comparison with Python Recommender

The Python script (`course_recommender.py`) provides recommendations but **does not generate schedules**:

**Python Script**:
- Recommends courses (multiple options per requirement)
- Ranks by GPA with more sophisticated logic
- Suggests optional courses to reach full-time status
- Does NOT check time conflicts
- Does NOT select specific sections

**Schedule Component**:
- Generates actual schedule (one course per requirement)
- Checks time conflicts
- Selects specific course sections
- More focused on immediate scheduling needs

## Potential Improvements

### 1. Backtracking Algorithm
```typescript
// Instead of greedy, use backtracking:
function generateScheduleWithBacktracking(requirements, courses) {
  // Try all combinations, backtrack on conflicts
  // Find optimal solution that maximizes:
  // - Number of requirements fulfilled
  // - Total GPA of selected courses
}
```

### 2. Multiple Section Consideration
```typescript
// For each course, try all available sections
// Select best non-conflicting section
```

### 3. Constraint Satisfaction Problem (CSP)
- Model as CSP with constraints:
  - No time conflicts
  - Prerequisites satisfied
  - Credit limits respected
  - All critical requirements fulfilled

### 4. Weighted Scoring
Instead of just GPA, consider:
- GPA (weight: 0.4)
- Course difficulty (weight: 0.2)
- Instructor rating (weight: 0.2)
- Time preference (weight: 0.2)

### 5. Prerequisite Validation
```typescript
// Before adding course, check:
if (!hasPrerequisites(course, coursesTaken)) {
  continue; // Skip course
}
```

### 6. Credit Limit Checking
```typescript
const MAX_CREDITS = 18;
if (totalCredits + course.credits > MAX_CREDITS) {
  continue; // Skip if would exceed limit
}
```

### 7. Better GPA Handling
```typescript
// Distinguish between "no data" and "low GPA"
// Use confidence scores based on number of data points
// Consider instructor-specific GPAs
```

### 8. Alternative Schedule Generation
```typescript
// Generate multiple schedule options
// Let user choose between:
// - Maximum GPA schedule
// - Minimum time conflicts schedule  
// - Balanced schedule
```

## Performance Analysis

### Time Complexity
- **Requirements**: O(R) where R = number of requirements
- **Courses per requirement**: O(C) where C = average courses per requirement
- **Conflict checking**: O(S) where S = number of scheduled courses
- **Total**: O(R × C × S)

In worst case: O(R × C²) if all courses conflict with each other

### Space Complexity
- O(S) for storing scheduled courses
- O(C) for temporary course lists
- **Total**: O(S + C)

## Testing Recommendations

1. **Time Parsing Tests**:
   - Various time formats
   - Edge cases (12:00 AM/PM, single times, etc.)
   - Invalid formats

2. **Conflict Detection Tests**:
   - Overlapping times same day
   - Adjacent times (should not conflict)
   - Different days (should not conflict)
   - Multiple time slots per course

3. **GPA Ranking Tests**:
   - Courses with no GPA data
   - Courses with varying amounts of data
   - Courses with identical GPAs

4. **Requirement Fulfillment Tests**:
   - All requirements fulfillable
   - Some requirements unfulfillable
   - All courses conflict scenario

5. **Edge Cases**:
   - No requirements found
   - All requirements already fulfilled
   - No courses available for requirements

## Conclusion

The schedule generation algorithm is a **greedy, GPA-optimized, conflict-avoiding** algorithm that successfully generates valid schedules for most cases. While it has limitations (no backtracking, single section consideration), it provides a solid foundation that can be enhanced with more sophisticated algorithms if needed.

The algorithm prioritizes:
1. **Correctness**: No time conflicts
2. **Quality**: Higher GPA courses preferred
3. **Completeness**: Fulfills as many requirements as possible

For production use, consider implementing the improvements listed above, particularly prerequisite checking and credit limit enforcement.

