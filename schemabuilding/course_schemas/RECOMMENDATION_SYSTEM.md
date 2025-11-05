# Graph-Based Course Recommendation System

## How It Works

### The Graph Structure

```
Degree (Finance BSB)
  └─ Requirements (Year 1, Fall)
      ├─ Requirement: "English Composition" (Critical)
      │   ├─ Course: CMLT-C 110
      │   ├─ Course: ENG-W 131
      │   ├─ Course: ENG-W 170
      │   └─ Course: ENG-W 171
      ├─ Requirement: "Math for Business" (Critical)
      │   ├─ Course: MATH-B 110
      │   ├─ Course: MATH-M 119
      │   └─ Course: MATH-M 211
      └─ Requirement: "IUB GenEd Arts & Humanities" (Optional)
          └─ (Empty - to be populated)
```

### For a Finance Freshman (No Courses Taken Yet)

When you query the recommendation system, it will:

1. **Find all Year 1 requirements** for Finance BSB
2. **Prioritize Critical Requirements First**
   - ⭐ "English Composition" (Critical)
   - ⭐ "Business Presentations" (Critical)
   - ⭐ "Math for Business" (Critical)
   - ⭐ "Introductory Accounting" (Critical)
   - "IUB GenEd Arts & Humanities" (Optional)

3. **Show Available Courses** for each requirement
4. **Filter by Availability** - only show courses offered in upcoming terms

## Example Query Results

### Finance Freshman - Fall Recommendations:

```
FALL SEMESTER RECOMMENDATIONS
=====================================

⭐ CRITICAL: English Composition (3 credits required)
  Available Courses:
    - CMLT-C 110: WRITING THE WORLD (3 credits)
    - ENG-W 131: READING, WRITING, AND INQUIRY I (2–4 credits)
    - ENG-W 170: PROJECTS IN READING & WRITING (3 credits)
    - ENG-W 171: PROJECTS IN DIGITAL LITERACY + COMPOSITION (3 credits)

⭐ CRITICAL: Business Presentations (3 credits required)
  Available Courses:
    - BUS-C 104: BUSINESS PRESENTATIONS (3 credits)
    - BUS-C 106: BUSINESS PRESENTATIONS-HONORS (3 credits)

⭐ CRITICAL: Math for Business (3 credits required)
  Available Courses:
    - MATH-B 110: MATHEMATICS FOR BUSINESS AND PUBLIC AFFAIRS (3 credits)
    - MATH-M 119: BRIEF SURVEY OF CALCULUS 1 (3 credits)
    - MATH-M 211: CALCULUS I (4 credits)

⭐ CRITICAL: Introductory Accounting Principles and Analysis (1 credit required)
  Available Courses:
    - BUS-A 100: INTRODUCTORY ACCOUNTING PRINCIPLES AND ANALYSIS (1 credit)
```

## Usage Examples

### 1. Get All Recommendations for Finance Year 1

```sql
SELECT * FROM get_course_recommendations(
    'Finance BSB',           -- Major
    1,                       -- Year 1
    NULL,                    -- Any term
    ARRAY[]::TEXT[],         -- No courses taken yet
    ARRAY['Fall 2025', 'Spring 2026']::TEXT[]  -- Upcoming terms
)
WHERE is_available = true
ORDER BY priority_score DESC;
```

### 2. Get Fall Semester Only (Critical Courses First)

```sql
SELECT * FROM get_course_recommendations(
    'Finance BSB',
    1,
    'fall',                  -- Fall semester only
    ARRAY[]::TEXT[],         -- No courses taken
    ARRAY['Fall 2025']::TEXT[]
)
WHERE is_available = true
ORDER BY critical DESC, requirement_name;
```

### 3. Check Progress After Taking Some Courses

```sql
-- Student has taken: ENG-W 131, MATH-B 110, BUS-C 104
SELECT * FROM get_requirement_progress(
    'Finance BSB',
    ARRAY['ENG-W 131', 'MATH-B 110', 'BUS-C 104']::TEXT[]
);
```

### 4. Get Remaining Critical Requirements

```sql
SELECT * FROM get_course_recommendations(
    'Finance BSB',
    1,
    NULL,
    ARRAY['ENG-W 131', 'MATH-B 110', 'BUS-C 104']::TEXT[],  -- Courses taken
    ARRAY['Fall 2025', 'Spring 2026']::TEXT[]
)
WHERE is_available = true
  AND critical = true
  AND NOT (course_code = ANY(ARRAY['ENG-W 131', 'MATH-B 110', 'BUS-C 104']::TEXT[]))
ORDER BY priority_score DESC;
```

## Priority Scoring System

The system uses a priority score to rank recommendations:

- **Critical Requirements**: 1000+ points
- **Year Priority**: Year 1 = 100, Year 2 = 200, etc.
- **Term Priority**: Fall = +10, Spring = +20

Example:
- Critical Year 1 Fall requirement = 1110 points
- Optional Year 1 Fall requirement = 110 points
- Critical Year 1 Spring requirement = 1120 points

## Future Enhancements

1. **Prerequisites Tracking**: Add prerequisite relationships between courses
2. **Enrollment Capacity**: Check course availability/seats
3. **Time Conflicts**: Check for scheduling conflicts
4. **Credit Load**: Ensure recommended courses fit credit limits
5. **GenEd Matching**: Match GenEd requirements with appropriate courses
6. **Minor/Second Major**: Consider additional degree requirements
7. **Course Difficulty**: Factor in course difficulty ratings
8. **Professor Ratings**: Consider instructor ratings

## Graph Traversal Logic

1. **Start Node**: Student's major + current year
2. **Traverse**: Find all requirements for that year
3. **Expand**: For each requirement, find all fulfilling courses
4. **Filter**: Remove courses already taken
5. **Rank**: Sort by priority score
6. **Return**: Top recommendations grouped by requirement

