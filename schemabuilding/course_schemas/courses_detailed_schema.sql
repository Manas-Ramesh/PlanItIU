-- ============================================
-- DETAILED COURSES TABLE SCHEMA
-- ============================================
-- This schema contains detailed course information including
-- scheduling, enrollment, and class-specific details

-- ============================================
-- DROP EXISTING TABLE (if recreating)
-- ============================================
DROP TABLE IF EXISTS courses CASCADE;

-- ============================================
-- CREATE COURSES TABLE
-- ============================================
CREATE TABLE courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Basic Course Information
    course_code TEXT NOT NULL,  -- e.g., "BUS-M 295"
    course_name TEXT NOT NULL,  -- Full course name
    course_description TEXT,  -- Detailed course description
    
    -- Class/Section Information
    class_number TEXT,  -- Unique class/section number
    status TEXT,  -- e.g., "Open", "Closed", "Waitlist", "Cancelled"
    component_type TEXT,  -- e.g., "LEC", "LAB", "SEM", "DIS"
    type TEXT,  -- e.g., "Standard", "Honors", "Online", "Hybrid"
    
    -- Credits and Academic Info
    credits TEXT,  -- Can be range like "1-5" or single value "3"
    class_attributes TEXT[],  -- Array of attributes like ["GenEd", "Writing Intensive", "Honors"]
    enrollment_requirements TEXT,  -- Prerequisites or requirements text
    
    -- Scheduling Information
    meeting_time TEXT,  -- e.g., "MW 10:10AM-11:00AM" or "TTH 2:30PM-3:45PM"
    building TEXT,  -- Building name or code
    room TEXT,  -- Room number
    
    -- Instructor Information
    instructor TEXT,  -- Instructor name(s), could be comma-separated for multiple
    
    -- Enrollment Information
    open_seats INTEGER DEFAULT 0,  -- Number of available seats
    combined_classes TEXT[],  -- Array of class numbers that are combined with this class
    
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Composite unique constraint: course_code + class_number should be unique
    UNIQUE(course_code, class_number)
);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================

-- Index on course_code for quick lookups
CREATE INDEX idx_courses_course_code ON courses(course_code);

-- Index on status for filtering available courses
CREATE INDEX idx_courses_status ON courses(status);

-- Index on open_seats for finding courses with availability
CREATE INDEX idx_courses_open_seats ON courses(open_seats) WHERE open_seats > 0;

-- Index on instructor for searching by instructor
CREATE INDEX idx_courses_instructor ON courses(instructor);

-- Index on component_type for filtering by type (lecture, lab, etc.)
CREATE INDEX idx_courses_component_type ON courses(component_type);

-- Index on class_attributes for searching GenEd courses, etc.
CREATE INDEX idx_courses_class_attributes ON courses USING GIN(class_attributes);

-- Index on building and room for location-based queries
CREATE INDEX idx_courses_location ON courses(building, room);

-- Full-text search on course_name and course_description
CREATE INDEX idx_courses_fulltext_search ON courses USING GIN(to_tsvector('english', COALESCE(course_name, '') || ' ' || COALESCE(course_description, '')));

-- ============================================
-- TRIGGER FOR UPDATED_AT
-- ============================================
CREATE OR REPLACE FUNCTION update_courses_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_courses_updated_at_trigger
    BEFORE UPDATE ON courses
    FOR EACH ROW
    EXECUTE FUNCTION update_courses_updated_at();

-- ============================================
-- HELPER VIEWS
-- ============================================

-- View: Available Courses (with open seats)
CREATE VIEW available_courses AS
SELECT 
    course_code,
    course_name,
    class_number,
    credits,
    meeting_time,
    building,
    room,
    instructor,
    open_seats,
    component_type,
    type,
    status
FROM courses
WHERE status = 'Open' 
  AND open_seats > 0
ORDER BY course_code, class_number;

-- View: Courses by Component Type
CREATE VIEW courses_by_component AS
SELECT 
    component_type,
    COUNT(*) as total_classes,
    COUNT(*) FILTER (WHERE status = 'Open' AND open_seats > 0) as available_classes,
    SUM(open_seats) FILTER (WHERE status = 'Open') as total_open_seats
FROM courses
GROUP BY component_type
ORDER BY component_type;

-- View: Courses by Instructor
CREATE VIEW courses_by_instructor AS
SELECT 
    instructor,
    COUNT(*) as total_classes,
    STRING_AGG(DISTINCT course_code, ', ' ORDER BY course_code) as courses_taught,
    SUM(open_seats) FILTER (WHERE status = 'Open') as total_open_seats
FROM courses
WHERE instructor IS NOT NULL
GROUP BY instructor
ORDER BY instructor;

-- ============================================
-- EXAMPLE QUERIES
-- ============================================

-- Find all available sections of a specific course
-- SELECT * FROM courses 
-- WHERE course_code = 'BUS-M 295' 
--   AND status = 'Open' 
--   AND open_seats > 0;

-- Find courses by GenEd attribute
-- SELECT * FROM courses 
-- WHERE 'GenEd' = ANY(class_attributes);

-- Find courses by instructor
-- SELECT * FROM courses 
-- WHERE instructor ILIKE '%Smith%';

-- Find courses in a specific building
-- SELECT * FROM courses 
-- WHERE building = 'Kelley School of Business' 
--   AND status = 'Open';

-- Find courses with specific meeting time pattern
-- SELECT * FROM courses 
-- WHERE meeting_time LIKE '%MW%';

-- ============================================
-- NOTES
-- ============================================
/*
Column Usage:
- course_code: Unique identifier for the course (e.g., "BUS-M 295")
- course_name: Full descriptive name
- class_number: Section/class number (multiple sections per course_code)
- status: Enrollment status (Open, Closed, Waitlist, Cancelled)
- meeting_time: When the class meets (format can vary)
- room: Room number/location
- instructor: Instructor name(s)
- open_seats: Available enrollment slots
- component_type: LEC, LAB, SEM, DIS, etc.
- type: Standard, Honors, Online, Hybrid
- credits: Credit hours (can be range)
- building: Building name/code
- combined_classes: Array of class numbers taught together
- course_description: Full course description
- class_attributes: Array of tags (GenEd, Writing Intensive, etc.)
- enrollment_requirements: Prerequisites text
*/

