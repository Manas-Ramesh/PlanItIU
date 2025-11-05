-- Supabase Schema for Degree Mapping System
-- This schema allows querying course_code from courses table and linking to fulfilling courses

-- ============================================
-- 0. CLEANUP: DROP EXISTING OBJECTS
-- ============================================
-- Run this section first to remove any existing tables from a previous schema

-- Drop views first (they depend on tables)
DROP VIEW IF EXISTS courses_with_requirements CASCADE;
DROP VIEW IF EXISTS requirement_courses CASCADE;

-- Drop triggers
DROP TRIGGER IF EXISTS update_courses_updated_at ON courses;
DROP TRIGGER IF EXISTS update_degrees_updated_at ON degrees;
DROP TRIGGER IF EXISTS update_degree_requirements_updated_at ON degree_requirements;

-- Drop functions
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;

-- Drop tables in reverse dependency order
DROP TABLE IF EXISTS requirement_fulfillments CASCADE;
DROP TABLE IF EXISTS degree_requirements CASCADE;
DROP TABLE IF EXISTS degrees CASCADE;
DROP TABLE IF EXISTS courses CASCADE;

-- ============================================
-- 1. COURSES TABLE (Complete Course Data)
-- ============================================
-- This table will be populated from the course CSV with every single course
CREATE TABLE courses (
    course_code TEXT PRIMARY KEY,
    course_name TEXT NOT NULL,
    credits TEXT, -- Can be a range like "1-5" or "2–4"
    scheduled_terms TEXT[], -- Array of terms when course is offered
    description TEXT,
    department TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for faster searches
CREATE INDEX idx_courses_department ON courses(department);
CREATE INDEX idx_courses_scheduled_terms ON courses USING GIN(scheduled_terms);

-- ============================================
-- 2. DEGREES TABLE
-- ============================================
CREATE TABLE degrees (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    major_name TEXT NOT NULL,
    school TEXT NOT NULL,
    degree_type TEXT, -- e.g., "BSB"
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(major_name, school)
);

CREATE INDEX idx_degrees_major ON degrees(major_name);
CREATE INDEX idx_degrees_school ON degrees(school);

-- ============================================
-- 3. DEGREE_REQUIREMENTS TABLE
-- ============================================
-- Stores each requirement (e.g., "English Composition", "Marketing Elective")
-- for a specific degree, year, and term
CREATE TABLE degree_requirements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    degree_id UUID NOT NULL REFERENCES degrees(id) ON DELETE CASCADE,
    year INTEGER NOT NULL CHECK (year >= 1 AND year <= 4),
    term TEXT NOT NULL CHECK (term IN ('fall', 'spring')),
    requirement_name TEXT NOT NULL,
    credits NUMERIC(4,1) NOT NULL,
    critical BOOLEAN DEFAULT FALSE,
    minimum_grade TEXT, -- e.g., "C"
    note TEXT,
    required_completion TEXT, -- e.g., "Year 1, Fall"
    total_credits NUMERIC(4,1), -- Total credits for the term
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(degree_id, year, term, requirement_name)
);

CREATE INDEX idx_degree_requirements_degree ON degree_requirements(degree_id);
CREATE INDEX idx_degree_requirements_year_term ON degree_requirements(degree_id, year, term);

-- ============================================
-- 4. REQUIREMENT_FULFILLMENTS TABLE (Junction)
-- ============================================
-- Links requirements to the courses that fulfill them
-- This is where you'll populate geneds and supplemental credits
CREATE TABLE requirement_fulfillments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    requirement_id UUID NOT NULL REFERENCES degree_requirements(id) ON DELETE CASCADE,
    course_code TEXT NOT NULL REFERENCES courses(course_code) ON DELETE CASCADE,
    note TEXT, -- Optional note specific to this fulfillment
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(requirement_id, course_code)
);

CREATE INDEX idx_fulfillments_requirement ON requirement_fulfillments(requirement_id);
CREATE INDEX idx_fulfillments_course ON requirement_fulfillments(course_code);

-- ============================================
-- 5. TRIGGERS FOR UPDATED_AT
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON courses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_degrees_updated_at BEFORE UPDATE ON degrees
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_degree_requirements_updated_at BEFORE UPDATE ON degree_requirements
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 6. USEFUL VIEWS FOR QUERYING
-- ============================================

-- View to get all requirements with their fulfilling courses
CREATE VIEW requirement_courses AS
SELECT 
    dr.id as requirement_id,
    d.major_name,
    d.school,
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
    rf.note as fulfillment_note
FROM degree_requirements dr
JOIN degrees d ON dr.degree_id = d.id
LEFT JOIN requirement_fulfillments rf ON dr.id = rf.requirement_id
LEFT JOIN courses c ON rf.course_code = c.course_code;

-- View to get all courses that fulfill any requirement
CREATE VIEW courses_with_requirements AS
SELECT 
    c.*,
    COUNT(rf.id) as fulfillment_count,
    array_agg(DISTINCT dr.requirement_name) as requirement_names
FROM courses c
LEFT JOIN requirement_fulfillments rf ON c.course_code = rf.course_code
LEFT JOIN degree_requirements dr ON rf.requirement_id = dr.id
GROUP BY c.course_code;

-- ============================================
-- 7. EXAMPLE QUERIES
-- ============================================

-- Query all fulfilling courses for a specific requirement
-- SELECT c.* 
-- FROM courses c
-- JOIN requirement_fulfillments rf ON c.course_code = rf.course_code
-- JOIN degree_requirements dr ON rf.requirement_id = dr.id
-- WHERE dr.id = '<requirement_id>';

-- Query all requirements for a degree with their fulfilling courses
-- SELECT rc.*
-- FROM requirement_courses rc
-- WHERE rc.major_name = 'Marketing BSB' AND rc.year = 4;

-- Query all courses that fulfill a specific requirement name
-- SELECT c.*, dr.requirement_name
-- FROM courses c
-- JOIN requirement_fulfillments rf ON c.course_code = rf.course_code
-- JOIN degree_requirements dr ON rf.requirement_id = dr.id
-- WHERE dr.requirement_name = 'Marketing Elective';

