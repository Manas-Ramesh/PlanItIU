# Neo4j Graph Schema Design

## Overview

The Neo4j graph database is designed to power a course recommendation system for each track (major). It models the relationships between students, degrees, requirements, and courses in a way that enables efficient graph traversal for personalized recommendations.

## Node Types

### 1. Degree Node
Represents a major/track (e.g., "Finance BSB", "Marketing BSB")

**Properties:**
- `name` (String, Unique): Major name (e.g., "Finance BSB")
- `school` (String): School name (e.g., "Kelley School of Business")
- `degree_type` (String): Type of degree (e.g., "BSB")

**Example:**
```cypher
(:Degree {name: "Finance BSB", school: "Kelley School of Business", degree_type: "BSB"})
```

### 2. Requirement Node
Represents a degree requirement (e.g., "English Composition", "Marketing Elective")

**Properties:**
- `name` (String): Requirement name
- `year` (Integer): Academic year (1-4)
- `term` (String): 'fall' or 'spring'
- `degree_name` (String): Associated degree name
- `credits` (Float): Required credits
- `critical` (Boolean): Whether requirement is critical
- `minimum_grade` (String): Minimum grade required (e.g., "C")
- `note` (String): Optional note

**Example:**
```cypher
(:Requirement {
  name: "English Composition",
  year: 1,
  term: "fall",
  degree_name: "Finance BSB",
  credits: 3.0,
  critical: true,
  minimum_grade: "C"
})
```

### 3. Course Node
Represents a course (e.g., "ENG-W 131", "BUS-M 295")

**Properties:**
- `code` (String, Unique): Course code (e.g., "ENG-W 131")
- `name` (String): Full course name
- `credits` (String): Credit value (can be range like "2–4")
- `scheduled_terms` (Array[String]): Terms when course is offered
- `department` (String): Department code
- `description` (String): Course description

**Example:**
```cypher
(:Course {
  code: "ENG-W 131",
  name: "READING, WRITING, AND INQUIRY I",
  credits: "2–4",
  scheduled_terms: ["Fall 2025", "Spring 2026", "Summer 2026"]
})
```

### 4. Student Node
Represents a user/student

**Properties:**
- `user_id` (String, Unique): User ID from Supabase
- `major` (String): Student's major
- `graduation_year` (Integer): Expected graduation year
- `courses_taken` (Array[String]): List of course codes taken

**Example:**
```cypher
(:Student {
  user_id: "abc-123-def",
  major: "Finance BSB",
  graduation_year: 2027,
  courses_taken: ["ENG-W 131", "MATH-B 110"]
})
```

## Relationship Types

### 1. HAS_REQUIREMENT
**From:** Degree  
**To:** Requirement

Indicates that a degree has a specific requirement.

**Properties:** None

**Example:**
```cypher
(:Degree {name: "Finance BSB"})-[:HAS_REQUIREMENT]->(:Requirement {name: "English Composition"})
```

### 2. FULFILLED_BY
**From:** Requirement  
**To:** Course

Indicates that a course fulfills a requirement.

**Properties:** None

**Example:**
```cypher
(:Requirement {name: "English Composition"})-[:FULFILLED_BY]->(:Course {code: "ENG-W 131"})
```

### 3. ENROLLED_IN
**From:** Student  
**To:** Degree

Indicates that a student is enrolled in a degree program.

**Properties:** None

**Example:**
```cypher
(:Student {user_id: "abc-123"})-[:ENROLLED_IN]->(:Degree {name: "Finance BSB"})
```

### 4. TAKEN
**From:** Student  
**To:** Course

Indicates that a student has taken/completed a course.

**Properties:** None

**Example:**
```cypher
(:Student {user_id: "abc-123"})-[:TAKEN]->(:Course {code: "ENG-W 131"})
```

## Graph Pattern Examples

### Complete Recommendation Path
```
(Student)-[:ENROLLED_IN]->(Degree)-[:HAS_REQUIREMENT]->(Requirement)-[:FULFILLED_BY]->(Course)
WHERE NOT (Student)-[:TAKEN]->(Course)
```

This pattern finds all courses that fulfill requirements for a student's degree that they haven't taken yet.

### Critical Requirements Only
```
(Student)-[:ENROLLED_IN]->(Degree)-[:HAS_REQUIREMENT]->(Requirement {critical: true})-[:FULFILLED_BY]->(Course)
WHERE NOT (Student)-[:TAKEN]->(Course)
```

This pattern finds only critical requirements.

### Term-Specific Recommendations
```
(Student)-[:ENROLLED_IN]->(Degree)-[:HAS_REQUIREMENT]->(Requirement {year: 1, term: 'fall'})-[:FULFILLED_BY]->(Course)
WHERE NOT (Student)-[:TAKEN]->(Course)
```

This pattern finds recommendations for a specific year and term.

## Query Performance

### Indexes
- `Degree.name` (Unique constraint)
- `Course.code` (Unique constraint)
- `Student.user_id` (Unique constraint)
- `Requirement(year, term)` (Composite index)
- `Requirement.critical` (Index)

### Query Optimization Tips
1. Always start from `Student` node using `user_id` (indexed)
2. Filter by `year` and `term` early in the query
3. Use `WHERE NOT` to exclude taken courses efficiently
4. Limit results to avoid large result sets

## Future Enhancements

### Additional Node Types
- **Instructor**: Track instructors and their courses
- **Prerequisite**: Model course prerequisites
- **Semester**: Track specific semester offerings

### Additional Relationships
- `PREREQUISITE`: Course prerequisites
- `SIMILAR_TO`: Similar courses (for recommendations)
- `TAUGHT_BY`: Instructor relationships
- `OFFERED_IN`: Semester relationships

### Additional Properties
- Course difficulty ratings
- Student performance data
- Enrollment capacity
- Time conflicts

