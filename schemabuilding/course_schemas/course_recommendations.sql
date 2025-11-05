-- ============================================
-- COURSE RECOMMENDATION SYSTEM
-- ============================================
-- Graph-based recommendation queries for degree planning

-- ============================================
-- HELPER: Get upcoming terms (you'll update this based on current semester)
-- ============================================
-- This is a placeholder - in production, you'd use actual date logic
-- For now, assuming we're recommending for Fall 2025 and Spring 2026

-- ============================================
-- 1. RECOMMEND COURSES FOR A FRESHMAN
-- ============================================
-- For a Finance freshman with no courses taken yet
-- Shows all Year 1 requirements with available courses

CREATE OR REPLACE VIEW freshman_recommendations AS
SELECT 
    d.major_name,
    dr.year,
    dr.term,
    dr.requirement_name,
    dr.credits as required_credits,
    dr.critical,
    dr.minimum_grade,
    dr.note as requirement_note,
    c.course_code,
    c.course_name,
    c.credits as course_credits,
    c.scheduled_terms,
    -- Priority score: critical requirements first, then by year/term order
    CASE 
        WHEN dr.critical = true THEN 1000 + dr.year * 100 + CASE WHEN dr.term = 'fall' THEN 10 ELSE 20 END
        ELSE dr.year * 100 + CASE WHEN dr.term = 'fall' THEN 10 ELSE 20 END
    END as priority_score,
    -- Availability: check if course is offered in upcoming terms
    CASE 
        WHEN 'Fall 2025' = ANY(c.scheduled_terms) OR 'Spring 2026' = ANY(c.scheduled_terms) THEN true
        ELSE false
    END as is_available_soon
FROM degrees d
JOIN degree_requirements dr ON d.id = dr.degree_id
LEFT JOIN requirement_fulfillments rf ON dr.id = rf.requirement_id
LEFT JOIN courses c ON rf.course_code = c.course_code
WHERE d.major_name = 'Finance BSB'
  AND dr.year = 1
ORDER BY 
    dr.critical DESC,  -- Critical requirements first
    dr.year ASC,
    CASE WHEN dr.term = 'fall' THEN 1 ELSE 2 END,  -- Fall before Spring
    dr.requirement_name,
    c.course_code;

-- ============================================
-- 2. RECOMMENDATION QUERY: Finance Freshman (Fall Term)
-- ============================================
-- Returns recommended courses for Fall semester, prioritizing critical courses

SELECT 
    'FALL SEMESTER RECOMMENDATIONS' as semester,
    requirement_name,
    required_credits,
    CASE WHEN critical THEN '⭐ CRITICAL' ELSE 'Optional' END as priority,
    STRING_AGG(
        course_code || ': ' || course_name || 
        ' (' || course_credits || ' credits)',
        E'\n' ORDER BY course_code
    ) as available_courses,
    COUNT(*) as course_count
FROM freshman_recommendations
WHERE term = 'fall'
  AND is_available_soon = true
GROUP BY requirement_name, required_credits, critical
ORDER BY critical DESC, requirement_name;

-- ============================================
-- 3. DETAILED RECOMMENDATION: All courses for a student
-- ============================================
-- Function to get personalized recommendations based on:
-- - Major
-- - Current year
-- - Courses already taken (array of course codes)
-- - Preferred term

CREATE OR REPLACE FUNCTION get_course_recommendations(
    p_major_name TEXT,
    p_year INTEGER,
    p_term TEXT DEFAULT NULL,
    p_taken_courses TEXT[] DEFAULT ARRAY[]::TEXT[],
    p_upcoming_terms TEXT[] DEFAULT ARRAY['Fall 2025', 'Spring 2026']::TEXT[]
)
RETURNS TABLE (
    requirement_name TEXT,
    required_credits NUMERIC,
    critical BOOLEAN,
    course_code TEXT,
    course_name TEXT,
    course_credits TEXT,
    scheduled_terms TEXT[],
    is_available BOOLEAN,
    priority_score INTEGER,
    can_take_now BOOLEAN
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        dr.requirement_name,
        dr.credits as required_credits,
        dr.critical,
        c.course_code,
        c.course_name,
        c.credits as course_credits,
        c.scheduled_terms,
        -- Check if course is available in any upcoming term
        EXISTS (
            SELECT 1 FROM unnest(p_upcoming_terms) ut
            WHERE ut = ANY(c.scheduled_terms)
        ) as is_available,
        -- Priority: critical (1000+) > year > term (fall=10, spring=20)
        CASE 
            WHEN dr.critical = true THEN 1000 + dr.year * 100 + CASE WHEN dr.term = 'fall' THEN 10 ELSE 20 END
            ELSE dr.year * 100 + CASE WHEN dr.term = 'fall' THEN 10 ELSE 20 END
        END as priority_score,
        -- Can take now if available in next term
        (p_upcoming_terms[1] = ANY(c.scheduled_terms)) as can_take_now
    FROM degrees d
    JOIN degree_requirements dr ON d.id = dr.degree_id
    LEFT JOIN requirement_fulfillments rf ON dr.id = rf.requirement_id
    LEFT JOIN courses c ON rf.course_code = c.course_code
    WHERE d.major_name = p_major_name
      AND dr.year = p_year
      AND (p_term IS NULL OR dr.term = p_term)
      -- Exclude courses already taken (if course_code is not in taken_courses array)
      AND (p_taken_courses IS NULL OR c.course_code IS NULL OR NOT (c.course_code = ANY(p_taken_courses)))
    ORDER BY 
        dr.critical DESC,
        dr.year ASC,
        CASE WHEN dr.term = 'fall' THEN 1 ELSE 2 END,
        dr.requirement_name,
        c.course_code;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 4. EXAMPLE USAGE: Finance Freshman Recommendations
-- ============================================

-- Get all recommendations for Finance Year 1
SELECT * FROM get_course_recommendations(
    'Finance BSB',  -- Major
    1,              -- Year 1
    NULL,           -- Any term
    ARRAY[]::TEXT[], -- No courses taken yet
    ARRAY['Fall 2025', 'Spring 2026']::TEXT[] -- Upcoming terms
)
WHERE is_available = true  -- Only show courses available soon
ORDER BY priority_score DESC, requirement_name, course_code;

-- ============================================
-- 5. SMART RECOMMENDATIONS: Critical First, Available Now
-- ============================================
-- Returns the most important courses a freshman should take first

SELECT 
    requirement_name,
    required_credits,
    CASE WHEN critical THEN '⭐ CRITICAL' ELSE 'Optional' END as priority,
    ARRAY_AGG(
        course_code || ' - ' || course_name 
        ORDER BY course_code
    ) as recommended_courses,
    MIN(is_available) as has_available_courses,
    COUNT(*) as option_count
FROM get_course_recommendations(
    'Finance BSB',
    1,
    'fall',  -- Focus on fall semester
    ARRAY[]::TEXT[],
    ARRAY['Fall 2025']::TEXT[]
)
WHERE is_available = true
GROUP BY requirement_name, required_credits, critical
ORDER BY critical DESC, requirement_name
LIMIT 10;  -- Top 10 recommendations

-- ============================================
-- 6. REQUIREMENT TRACKER VIEW
-- ============================================
-- Shows progress on requirements for a student

CREATE OR REPLACE FUNCTION get_requirement_progress(
    p_major_name TEXT,
    p_taken_courses TEXT[]
)
RETURNS TABLE (
    year INTEGER,
    term TEXT,
    requirement_name TEXT,
    required_credits NUMERIC,
    credits_fulfilled NUMERIC,
    is_complete BOOLEAN,
    critical BOOLEAN,
    fulfilling_courses TEXT[],
    taken_courses TEXT[]
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        dr.year,
        dr.term,
        dr.requirement_name,
        dr.credits as required_credits,
        COALESCE(SUM(
            CASE 
                WHEN c.course_code = ANY(p_taken_courses) 
                THEN CAST(COALESCE(NULLIF(c.credits, ''), '0') AS NUMERIC)
                ELSE 0
            END
        ), 0) as credits_fulfilled,
        COALESCE(SUM(
            CASE WHEN c.course_code = ANY(p_taken_courses) THEN 1 ELSE 0 END
        ), 0) >= 1 as is_complete,  -- Simplified: at least one course taken
        dr.critical,
        ARRAY_AGG(DISTINCT c.course_code) FILTER (WHERE c.course_code IS NOT NULL) as fulfilling_courses,
        ARRAY_AGG(DISTINCT c.course_code) FILTER (WHERE c.course_code = ANY(p_taken_courses)) as taken_courses
    FROM degrees d
    JOIN degree_requirements dr ON d.id = dr.degree_id
    LEFT JOIN requirement_fulfillments rf ON dr.id = rf.requirement_id
    LEFT JOIN courses c ON rf.course_code = c.course_code
    WHERE d.major_name = p_major_name
    GROUP BY dr.id, dr.year, dr.term, dr.requirement_name, dr.credits, dr.critical
    ORDER BY dr.year, CASE WHEN dr.term = 'fall' THEN 1 ELSE 2 END, dr.critical DESC;
END;
$$ LANGUAGE plpgsql;

-- Example: Check progress for Finance freshman
-- (Empty array = no courses taken yet)
SELECT * FROM get_requirement_progress('Finance BSB', ARRAY[]::TEXT[]);

-- ============================================
-- 7. RECOMMENDATION ALGORITHM SUMMARY
-- ============================================
/*
Graph-Based Recommendation Logic:

1. STARTING POINT: Student's major and year
   - Finance BSB, Year 1

2. NODES: Requirements and Courses
   - Each requirement connects to multiple courses
   - Courses connect back to requirements

3. PRIORITIZATION:
   - Critical requirements (critical=true) = Priority 1000+
   - Year-based: Year 1 > Year 2 > Year 3 > Year 4
   - Term-based: Fall > Spring (within same year)
   - Available courses (in upcoming terms) > Unavailable

4. FILTERING:
   - Exclude courses already taken
   - Show only courses available in upcoming terms
   - Group by requirement to show all options

5. OUTPUT:
   - Recommended courses grouped by requirement
   - Prioritized by importance
   - Filtered by availability

6. TRACKING:
   - Track which requirements are complete
   - Show progress toward each requirement
   - Highlight remaining critical courses
*/

