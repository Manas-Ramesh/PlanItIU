# Supabase Degree Mapping Schema Design

## Overview

This schema is designed to support degree mapping where:
1. **Courses** are stored in a centralized `courses` table (from CSV)
2. **Degree requirements** reference courses via `course_code` for efficient querying
3. **GenEds** and **Supplemental credits** can be populated by linking courses to requirements

## Schema Structure

### 1. `courses` Table
The master table for all courses. Populated from your course CSV.

**Key Fields:**
- `course_code` (PK): Unique identifier like "BUS-M 295"
- `course_name`: Full course name
- `credits`: Credit value (can be range like "1-5")
- `scheduled_terms`: Array of terms when offered

**Usage:**
```sql
-- Insert courses from CSV
INSERT INTO courses (course_code, course_name, credits, scheduled_terms)
VALUES ('BUS-M 295', 'MARKETING IN OUR WORLD TODAY', '3', ARRAY['Fall 2025', 'Spring 2026']);
```

### 2. `degrees` Table
Stores degree/major information.

**Key Fields:**
- `major_name`: e.g., "Marketing BSB"
- `school`: e.g., "Kelley School of Business"

### 3. `degree_requirements` Table
Stores each requirement for a specific degree, year, and term.

**Key Fields:**
- `degree_id`: FK to `degrees`
- `year`: 1-4
- `term`: 'fall' or 'spring'
- `requirement_name`: e.g., "Marketing Elective", "English Composition"
- `credits`: Required credits
- `critical`: Boolean flag
- `minimum_grade`: e.g., "C"

**Example:**
```sql
INSERT INTO degree_requirements (degree_id, year, term, requirement_name, credits, critical)
VALUES (
    (SELECT id FROM degrees WHERE major_name = 'Marketing BSB'),
    4, 'fall', 'Marketing Elective', 3, false
);
```

### 4. `requirement_fulfillments` Table (Junction Table)
**This is the key table for linking courses to requirements.**

Links `degree_requirements` to `courses` via `course_code`. This is where you populate:
- Regular fulfilling courses
- GenEd courses
- Supplemental credit courses

**Key Fields:**
- `requirement_id`: FK to `degree_requirements`
- `course_code`: FK to `courses` (the linking point!)

**Example - Adding fulfilling courses:**
```sql
-- Add a course that fulfills a requirement
INSERT INTO requirement_fulfillments (requirement_id, course_code)
VALUES (
    (SELECT id FROM degree_requirements 
     WHERE requirement_name = 'Marketing Elective' 
     AND degree_id = (SELECT id FROM degrees WHERE major_name = 'Marketing BSB')
     AND year = 4 AND term = 'fall'),
    'BUS-M 295'  -- References course_code in courses table
);
```

## Populating GenEds and Supplemental Credits

### Step 1: Import all courses from CSV into `courses` table

```sql
-- Assuming your CSV has: course_code, course_name, credits, scheduled_terms
COPY courses(course_code, course_name, credits, scheduled_terms)
FROM '/path/to/courses.csv'
DELIMITER ','
CSV HEADER;
```

### Step 2: Find GenEd/Supplemental requirements

```sql
-- Find all GenEd requirements (currently empty)
SELECT id, requirement_name, degree_id, year, term
FROM degree_requirements
WHERE requirement_name LIKE '%GenEd%' 
   OR requirement_name LIKE '%Supplemental%';
```

### Step 3: Populate GenEds with courses

```sql
-- Example: Add all Arts & Humanities GenEd courses to a requirement
-- First, identify GenEd courses from your course CSV (you'll need to tag these)
-- Then link them:

INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT 
    dr.id,
    c.course_code
FROM degree_requirements dr
CROSS JOIN courses c
WHERE dr.requirement_name = 'IUB GenEd Arts & Humanities'
  AND c.department = 'ARTS'  -- Assuming you tag courses by department/category
  AND NOT EXISTS (
      SELECT 1 FROM requirement_fulfillments rf 
      WHERE rf.requirement_id = dr.id AND rf.course_code = c.course_code
  );
```

### Step 4: Populate Supplemental Credits

```sql
-- Supplemental credits can be fulfilled by ANY course (or a subset)
-- Add all courses (or filtered subset) as fulfilling courses:

INSERT INTO requirement_fulfillments (requirement_id, course_code)
SELECT 
    dr.id,
    c.course_code
FROM degree_requirements dr
CROSS JOIN courses c
WHERE dr.requirement_name = 'Supplemental Credits for Graduation'
  AND NOT EXISTS (
      SELECT 1 FROM requirement_fulfillments rf 
      WHERE rf.requirement_id = dr.id AND rf.course_code = c.course_code
  );
```

## Querying Examples

### Get all fulfilling courses for a requirement (JOIN with courses table)

```sql
-- This is the key query - joining via course_code
SELECT 
    c.course_code,
    c.course_name,
    c.credits,
    c.scheduled_terms,
    dr.requirement_name,
    d.major_name
FROM courses c
JOIN requirement_fulfillments rf ON c.course_code = rf.course_code
JOIN degree_requirements dr ON rf.requirement_id = dr.id
JOIN degrees d ON dr.degree_id = d.id
WHERE dr.id = '<requirement_id>';
```

### Get all requirements for a degree with their courses

```sql
SELECT 
    dr.requirement_name,
    dr.credits as required_credits,
    dr.critical,
    c.course_code,
    c.course_name,
    c.credits as course_credits
FROM degree_requirements dr
LEFT JOIN requirement_fulfillments rf ON dr.id = rf.requirement_id
LEFT JOIN courses c ON rf.course_code = c.course_code
JOIN degrees d ON dr.degree_id = d.id
WHERE d.major_name = 'Marketing BSB' 
  AND dr.year = 4 
  AND dr.term = 'fall'
ORDER BY dr.requirement_name, c.course_code;
```

### Find all courses that fulfill multiple requirements

```sql
SELECT 
    c.course_code,
    c.course_name,
    COUNT(DISTINCT rf.requirement_id) as requirement_count,
    array_agg(DISTINCT dr.requirement_name) as requirements
FROM courses c
JOIN requirement_fulfillments rf ON c.course_code = rf.course_code
JOIN degree_requirements dr ON rf.requirement_id = dr.id
GROUP BY c.course_code, c.course_name
HAVING COUNT(DISTINCT rf.requirement_id) > 1;
```

### Use the provided view

```sql
-- Simple query using the view
SELECT * FROM requirement_courses
WHERE major_name = 'Marketing BSB' 
  AND year = 4 
  AND term = 'fall'
ORDER BY requirement_name, course_code;
```

## Data Migration Strategy

1. **Import courses first**: Populate `courses` table from your CSV
2. **Create degrees**: Insert each major into `degrees` table
3. **Import requirements**: Parse JSON files and insert into `degree_requirements`
4. **Link courses to requirements**: Insert into `requirement_fulfillments` where `fulfilling_courses` array is non-empty
5. **Populate GenEds**: After identifying GenEd courses, link them to GenEd requirements
6. **Populate Supplemental**: Link courses to supplemental credit requirements

## Benefits of This Design

✅ **Normalized**: Courses stored once, referenced many times  
✅ **Queryable**: Easy to JOIN courses with requirements via `course_code`  
✅ **Flexible**: Can add/remove fulfilling courses without changing requirement structure  
✅ **Scalable**: Can handle thousands of courses and requirements  
✅ **Maintainable**: Update course info once in `courses` table, affects all references  
✅ **GenEd-friendly**: Easy to populate GenEd requirements with courses from CSV  

## Notes

- `course_code` is the linking key between `courses` and `requirement_fulfillments`
- The `requirement_fulfillments` junction table allows many-to-many relationships
- Empty `fulfilling_courses` arrays in your JSON become requirements without fulfillments initially
- Populate GenEds/Supplemental by inserting into `requirement_fulfillments` after course CSV is loaded

