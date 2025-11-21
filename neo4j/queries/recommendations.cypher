// ============================================
// NEO4J RECOMMENDATION QUERIES
// ============================================
// These Cypher queries provide course recommendations
// based on student's major, year, and courses taken

// ============================================
// 1. BASIC RECOMMENDATIONS: Critical Requirements First
// ============================================
// Get recommended courses for a student based on their major and year
// Prioritizes critical requirements

MATCH (s:Student {user_id: $user_id})-[:ENROLLED_IN]->(d:Degree)
MATCH (d)-[:HAS_REQUIREMENT]->(r:Requirement {year: $year})
WHERE r.critical = true
MATCH (r)-[:FULFILLED_BY]->(c:Course)
WHERE NOT (s)-[:TAKEN]->(c)
RETURN 
    r.name as requirement_name,
    r.credits as required_credits,
    r.critical,
    c.code as course_code,
    c.name as course_name,
    c.credits as course_credits,
    c.scheduled_terms
ORDER BY r.critical DESC, r.year, r.term
LIMIT 20;

// ============================================
// 2. TERM-SPECIFIC RECOMMENDATIONS
// ============================================
// Get recommendations for a specific term (fall or spring)

MATCH (s:Student {user_id: $user_id})-[:ENROLLED_IN]->(d:Degree)
MATCH (d)-[:HAS_REQUIREMENT]->(r:Requirement {year: $year, term: $term})
MATCH (r)-[:FULFILLED_BY]->(c:Course)
WHERE NOT (s)-[:TAKEN]->(c)
RETURN 
    r.name as requirement_name,
    r.credits as required_credits,
    r.critical,
    c.code as course_code,
    c.name as course_name,
    c.credits as course_credits
ORDER BY r.critical DESC, r.name, c.code;

// ============================================
// 3. AVAILABLE SOON RECOMMENDATIONS
// ============================================
// Only show courses available in upcoming terms

MATCH (s:Student {user_id: $user_id})-[:ENROLLED_IN]->(d:Degree)
MATCH (d)-[:HAS_REQUIREMENT]->(r:Requirement {year: $year})
MATCH (r)-[:FULFILLED_BY]->(c:Course)
WHERE NOT (s)-[:TAKEN]->(c)
  AND ANY(term IN c.scheduled_terms WHERE term IN $upcoming_terms)
RETURN 
    r.name as requirement_name,
    r.credits as required_credits,
    r.critical,
    c.code as course_code,
    c.name as course_name,
    c.credits as course_credits,
    c.scheduled_terms
ORDER BY r.critical DESC, r.year, r.term
LIMIT 20;

// ============================================
// 4. REQUIREMENT PROGRESS TRACKER
// ============================================
// Show which requirements are complete/incomplete

MATCH (s:Student {user_id: $user_id})-[:ENROLLED_IN]->(d:Degree)
MATCH (d)-[:HAS_REQUIREMENT]->(r:Requirement {year: $year})
OPTIONAL MATCH (r)-[:FULFILLED_BY]->(c:Course)
OPTIONAL MATCH (s)-[:TAKEN]->(c)
WITH r, c, COUNT(DISTINCT c) as total_courses, COUNT(DISTINCT CASE WHEN (s)-[:TAKEN]->(c) THEN c END) as taken_courses
RETURN 
    r.name as requirement_name,
    r.credits as required_credits,
    r.critical,
    r.year,
    r.term,
    total_courses,
    taken_courses,
    CASE WHEN taken_courses > 0 THEN true ELSE false END as is_complete
ORDER BY r.critical DESC, r.year, r.term;

// ============================================
// 5. GROUPED RECOMMENDATIONS BY REQUIREMENT
// ============================================
// Group courses by requirement for easier display

MATCH (s:Student {user_id: $user_id})-[:ENROLLED_IN]->(d:Degree)
MATCH (d)-[:HAS_REQUIREMENT]->(r:Requirement {year: $year})
MATCH (r)-[:FULFILLED_BY]->(c:Course)
WHERE NOT (s)-[:TAKEN]->(c)
WITH r, COLLECT({
    code: c.code,
    name: c.name,
    credits: c.credits,
    scheduled_terms: c.scheduled_terms
}) as courses
RETURN 
    r.name as requirement_name,
    r.credits as required_credits,
    r.critical,
    r.year,
    r.term,
    courses,
    SIZE(courses) as course_count
ORDER BY r.critical DESC, r.year, r.term;

// ============================================
// 6. SMART RECOMMENDATIONS WITH PRIORITY SCORE
// ============================================
// Calculate priority score based on criticality, year, and term

MATCH (s:Student {user_id: $user_id})-[:ENROLLED_IN]->(d:Degree)
MATCH (d)-[:HAS_REQUIREMENT]->(r:Requirement {year: $year})
MATCH (r)-[:FULFILLED_BY]->(c:Course)
WHERE NOT (s)-[:TAKEN]->(c)
WITH r, c,
    CASE 
        WHEN r.critical = true THEN 1000 + r.year * 100 + CASE WHEN r.term = 'fall' THEN 10 ELSE 20 END
        ELSE r.year * 100 + CASE WHEN r.term = 'fall' THEN 10 ELSE 20 END
    END as priority_score
RETURN 
    priority_score,
    r.name as requirement_name,
    r.credits as required_credits,
    r.critical,
    c.code as course_code,
    c.name as course_name,
    c.credits as course_credits
ORDER BY priority_score DESC, r.name, c.code
LIMIT 30;

// ============================================
// 7. NEXT SEMESTER RECOMMENDATIONS
// ============================================
// Get recommendations for the next term based on student's current year

MATCH (s:Student {user_id: $user_id})-[:ENROLLED_IN]->(d:Degree)
MATCH (d)-[:HAS_REQUIREMENT]->(r:Requirement)
WHERE r.year <= $current_year + 1
  AND r.term = $next_term
MATCH (r)-[:FULFILLED_BY]->(c:Course)
WHERE NOT (s)-[:TAKEN]->(c)
RETURN 
    r.name as requirement_name,
    r.credits as required_credits,
    r.critical,
    r.year,
    c.code as course_code,
    c.name as course_name,
    c.credits as course_credits
ORDER BY r.critical DESC, r.year, r.name
LIMIT 20;

// ============================================
// 8. MISSING CRITICAL REQUIREMENTS
// ============================================
// Find all critical requirements that haven't been fulfilled

MATCH (s:Student {user_id: $user_id})-[:ENROLLED_IN]->(d:Degree)
MATCH (d)-[:HAS_REQUIREMENT]->(r:Requirement)
WHERE r.critical = true
OPTIONAL MATCH (r)-[:FULFILLED_BY]->(c:Course)
OPTIONAL MATCH (s)-[:TAKEN]->(c)
WITH r, COUNT(DISTINCT CASE WHEN (s)-[:TAKEN]->(c) THEN c END) as taken_count
WHERE taken_count = 0
RETURN 
    r.name as requirement_name,
    r.credits as required_credits,
    r.year,
    r.term,
    r.minimum_grade
ORDER BY r.year, r.term;

// ============================================
// 9. COURSE PREREQUISITE CHECK (Future)
// ============================================
// Check if student has taken prerequisites for a course
// (Requires PREREQUISITE relationships to be set up)

MATCH (s:Student {user_id: $user_id})
MATCH (c:Course {code: $course_code})<-[:PREREQUISITE*]-(prereq:Course)
WHERE NOT (s)-[:TAKEN]->(prereq)
RETURN 
    c.code as course_code,
    c.name as course_name,
    COLLECT(prereq.code) as missing_prerequisites;

// ============================================
// 10. RECOMMENDATION SUMMARY
// ============================================
// Get a summary of recommendations grouped by requirement

MATCH (s:Student {user_id: $user_id})-[:ENROLLED_IN]->(d:Degree)
MATCH (d)-[:HAS_REQUIREMENT]->(r:Requirement {year: $year})
MATCH (r)-[:FULFILLED_BY]->(c:Course)
WHERE NOT (s)-[:TAKEN]->(c)
WITH r, 
    COLLECT(DISTINCT c.code) as course_codes,
    COLLECT(DISTINCT c.name) as course_names,
    COUNT(DISTINCT c) as available_courses
RETURN 
    r.name as requirement_name,
    r.credits as required_credits,
    r.critical,
    r.year,
    r.term,
    available_courses,
    course_codes[0..5] as sample_courses  // First 5 courses
ORDER BY r.critical DESC, r.year, r.term;

