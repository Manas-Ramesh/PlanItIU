-- ============================================
-- GRADE DISTRIBUTIONS TABLE SCHEMA
-- ============================================
-- This schema stores historical grade distribution data for courses
-- Data comes from CSV files with term-based grade distributions
-- This is a SEPARATE, INDEPENDENT table from the courses table
-- No foreign key relationships - can be used standalone

-- ============================================
-- CREATE GRADE_DISTRIBUTIONS TABLE
-- ============================================
-- Non-destructive: Only creates table if it doesn't exist
CREATE TABLE IF NOT EXISTS grade_distributions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Institution Information
    institution_code TEXT,
    institution_description TEXT,
    
    -- Term Information
    term_code TEXT NOT NULL,  -- e.g., "4208" for Fall 2020
    term_description TEXT,  -- e.g., "Fall 2020"
    session_code TEXT,
    session_description TEXT,
    
    -- Academic Organization
    academic_group_code TEXT,
    academic_group_description TEXT,
    academic_organization_code TEXT,
    academic_organization_description TEXT,
    department_code TEXT,
    
    -- Course Identification
    course_subject TEXT NOT NULL,  -- e.g., "AERO-A"
    catalog_number TEXT NOT NULL,  -- e.g., "101"
    class_number TEXT NOT NULL,  -- Class/section number
    course_description TEXT,
    course_topic TEXT,
    
    -- Instructor
    instructor_name TEXT,
    
    -- Grade Statistics
    gpa_grades INTEGER,  -- Number of students with GPA grades
    total_grades INTEGER,  -- Total number of grades
    percent_majors NUMERIC(5,2),  -- Percentage of majors in class
    avg_class_grade NUMERIC(4,3),  -- Average class grade
    avg_student_gpa NUMERIC(4,3),  -- Average student GPA
    
    -- Grade Percentages
    percent_a_grades NUMERIC(5,2),
    percent_b_grades NUMERIC(5,2),
    percent_c_grades NUMERIC(5,2),
    percent_d_grades NUMERIC(5,2),
    all_other_grades_count INTEGER,
    
    -- Individual Grade Counts
    grade_a_plus INTEGER DEFAULT 0,
    grade_a INTEGER DEFAULT 0,
    grade_a_minus INTEGER DEFAULT 0,
    grade_b_plus INTEGER DEFAULT 0,
    grade_b INTEGER DEFAULT 0,
    grade_b_minus INTEGER DEFAULT 0,
    grade_c_plus INTEGER DEFAULT 0,
    grade_c INTEGER DEFAULT 0,
    grade_c_minus INTEGER DEFAULT 0,
    grade_d_plus INTEGER DEFAULT 0,
    grade_d INTEGER DEFAULT 0,
    grade_d_minus INTEGER DEFAULT 0,
    grade_f INTEGER DEFAULT 0,
    grade_p INTEGER DEFAULT 0,  -- Pass
    grade_s INTEGER DEFAULT 0,  -- Satisfactory
    grade_i INTEGER DEFAULT 0,  -- Incomplete
    grade_r INTEGER DEFAULT 0,  -- Repeat
    grade_ny INTEGER DEFAULT 0,  -- Not Yet
    grade_nr INTEGER DEFAULT 0,  -- Not Reported
    grade_nc INTEGER DEFAULT 0,  -- No Credit
    grade_w INTEGER DEFAULT 0,  -- Withdrawn
    grade_wx INTEGER DEFAULT 0,  -- Withdrawn Exception
    grade_other INTEGER DEFAULT 0,
    
    -- Metadata
    data_freeze_date DATE,  -- When the data was frozen/snapshot taken
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Composite unique constraint: same course/class/term/instructor should be unique
    UNIQUE(term_code, course_subject, catalog_number, class_number, instructor_name)
);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================

-- Index on term for filtering by semester
CREATE INDEX idx_grade_dist_term_code ON grade_distributions(term_code);
CREATE INDEX idx_grade_dist_term_desc ON grade_distributions(term_description);

-- Index on course identification (for joining with courses table)
CREATE INDEX idx_grade_dist_course_subject ON grade_distributions(course_subject);
CREATE INDEX idx_grade_dist_catalog_number ON grade_distributions(catalog_number);
CREATE INDEX idx_grade_dist_class_number ON grade_distributions(class_number);

-- Composite index for course lookups (course_subject + catalog_number = course_code)
CREATE INDEX idx_grade_dist_course_lookup ON grade_distributions(course_subject, catalog_number);

-- Index on instructor for searching by instructor
CREATE INDEX idx_grade_dist_instructor ON grade_distributions(instructor_name);

-- Index on department
CREATE INDEX idx_grade_dist_department ON grade_distributions(department_code);

-- Index on average grades for sorting/filtering
CREATE INDEX idx_grade_dist_avg_class_grade ON grade_distributions(avg_class_grade);
CREATE INDEX idx_grade_dist_avg_student_gpa ON grade_distributions(avg_student_gpa);

-- ============================================
-- HELPER FUNCTION: Generate course_code from subject + catalog
-- ============================================
CREATE OR REPLACE FUNCTION get_course_code(p_subject TEXT, p_catalog TEXT)
RETURNS TEXT AS $$
BEGIN
    RETURN TRIM(p_subject) || ' ' || TRIM(p_catalog);
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- ============================================
-- COMPUTED COLUMN: course_code (for joining with courses table)
-- ============================================
-- Note: PostgreSQL doesn't support computed columns directly, but we can create a view
-- Or add a generated column (PostgreSQL 12+)
ALTER TABLE grade_distributions 
ADD COLUMN course_code TEXT GENERATED ALWAYS AS (TRIM(course_subject) || ' ' || TRIM(catalog_number)) STORED;

CREATE INDEX idx_grade_dist_course_code ON grade_distributions(course_code);

-- ============================================
-- TRIGGER FOR UPDATED_AT
-- ============================================
CREATE OR REPLACE FUNCTION update_grade_distributions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_grade_distributions_updated_at_trigger
    BEFORE UPDATE ON grade_distributions
    FOR EACH ROW
    EXECUTE FUNCTION update_grade_distributions_updated_at();

-- ============================================
-- HELPER VIEWS
-- ============================================

-- View: Grade distributions with course info (for joining with courses table)
CREATE VIEW grade_distributions_with_courses AS
SELECT 
    gd.*,
    c.course_name,
    c.status as current_status,
    c.open_seats as current_open_seats,
    c.meeting_time as current_meeting_time,
    c.instructor as current_instructor
FROM grade_distributions gd
LEFT JOIN courses c ON gd.course_code = c.course_code 
    AND gd.class_number = c.class_number;

-- View: Course grade statistics (aggregated by course_code across all terms)
CREATE VIEW course_grade_statistics AS
SELECT 
    course_code,
    course_subject,
    catalog_number,
    COUNT(DISTINCT term_code) as terms_offered,
    COUNT(DISTINCT class_number) as total_sections,
    AVG(avg_class_grade) as avg_class_grade_overall,
    AVG(avg_student_gpa) as avg_student_gpa_overall,
    AVG(percent_a_grades) as avg_percent_a,
    AVG(percent_b_grades) as avg_percent_b,
    AVG(percent_c_grades) as avg_percent_c,
    SUM(total_grades) as total_students_all_time,
    MIN(term_code) as first_term_offered,
    MAX(term_code) as last_term_offered
FROM grade_distributions
WHERE avg_class_grade IS NOT NULL
GROUP BY course_code, course_subject, catalog_number
ORDER BY course_code;

-- View: Instructor grade statistics
CREATE VIEW instructor_grade_statistics AS
SELECT 
    instructor_name,
    COUNT(DISTINCT course_code) as courses_taught,
    COUNT(*) as total_sections,
    AVG(avg_class_grade) as avg_class_grade,
    AVG(avg_student_gpa) as avg_student_gpa,
    AVG(percent_a_grades) as avg_percent_a,
    SUM(total_grades) as total_students
FROM grade_distributions
WHERE instructor_name IS NOT NULL 
  AND instructor_name != 'N/A'
GROUP BY instructor_name
ORDER BY total_students DESC;

-- ============================================
-- EXAMPLE QUERIES
-- ============================================

-- Find grade distributions for a specific course
-- SELECT * FROM grade_distributions 
-- WHERE course_code = 'AERO-A 101'
-- ORDER BY term_code DESC;

-- Find courses with highest average grades
-- SELECT course_code, term_description, avg_class_grade, instructor_name
-- FROM grade_distributions
-- WHERE avg_class_grade IS NOT NULL
-- ORDER BY avg_class_grade DESC
-- LIMIT 20;

-- Find grade distributions for a specific term
-- SELECT * FROM grade_distributions
-- WHERE term_code = '4208'  -- Fall 2020
-- ORDER BY course_code, class_number;

-- Join with current courses to see historical vs current
-- SELECT 
--     c.course_code,
--     c.course_name,
--     c.status as current_status,
--     gd.term_description,
--     gd.avg_class_grade,
--     gd.instructor_name as historical_instructor,
--     c.instructor as current_instructor
-- FROM courses c
-- JOIN grade_distributions gd ON c.course_code = gd.course_code
-- WHERE c.course_code = 'BUS-M 295'
-- ORDER BY gd.term_code DESC;

-- ============================================
-- NOTES
-- ============================================
/*
Key Fields:
- term_code: Unique identifier for semester (e.g., "4208" = Fall 2020)
- course_subject + catalog_number: Forms course_code (e.g., "AERO-A" + "101" = "AERO-A 101")
- class_number: Section number (can join with courses.class_number)
- instructor_name: Instructor for that term/section
- avg_class_grade: Average grade given (0.0-4.0 scale)
- avg_student_gpa: Average GPA of students in class
- Individual grade counts: A+, A, A-, B+, etc.

Joining with courses table:
- Use course_code (computed from course_subject + catalog_number)
- Use class_number for specific section matching
- Use term_code to filter by semester

Data Quality:
- Some rows may have "NR" (Not Reported) for small class sizes
- Data freeze date indicates when snapshot was taken
- Multiple terms can be imported (one table for all historical data)
*/

