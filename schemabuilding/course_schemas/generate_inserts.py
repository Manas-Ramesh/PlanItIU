#!/usr/bin/env python3
"""
Script to generate SQL INSERT statements from Kelley JSON files
"""

import json
import os
import re
from pathlib import Path
from collections import defaultdict

def escape_sql_string(value):
    """Escape single quotes for SQL"""
    if value is None:
        return 'NULL'
    if isinstance(value, bool):
        return str(value).upper()
    return "'" + str(value).replace("'", "''") + "'"

def parse_numeric_value(value):
    """Parse a numeric value, handling ranges like '1.5-3' or '13.5-15'"""
    if value is None:
        return 'NULL'
    
    # Convert to string and handle ranges
    value_str = str(value).strip()
    
    # Check for range separators (-, –, —)
    range_match = re.search(r'([\d.]+)\s*[-–—]\s*([\d.]+)', value_str)
    if range_match:
        # Extract max value from range
        max_val = float(range_match.group(2))
        return str(max_val)
    
    # Try to parse as float
    try:
        float_val = float(value_str)
        return str(float_val)
    except ValueError:
        # If can't parse, return NULL
        return 'NULL'

def format_array_for_sql(arr):
    """Format Python list as PostgreSQL array"""
    if not arr:
        return 'ARRAY[]::TEXT[]'
    escaped = [escape_sql_string(item).strip("'") for item in arr if item != "None"]
    if not escaped:
        return 'ARRAY[]::TEXT[]'
    return "ARRAY[" + ", ".join([f"'{item}'" for item in escaped]) + "]"

def get_all_json_files(base_dir):
    """Get all year JSON files from all major directories"""
    json_files = []
    base_path = Path(base_dir)
    for major_dir in base_path.iterdir():
        if major_dir.is_dir():
            for file in major_dir.glob("*-year*.json"):
                json_files.append(file)
    return sorted(json_files)

def parse_json_files(json_files):
    """Parse all JSON files and extract data"""
    degrees_map = {}  # (major, school) -> degree_id (placeholder)
    courses_set = set()  # (course_code, course_name, credits, scheduled_terms)
    courses_dict = {}  # course_code -> full course data
    requirements = []  # List of requirement data
    fulfillments = []  # List of (requirement_key, course_code)
    
    for json_file in json_files:
        with open(json_file, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        major = data['major']
        school = data['school']
        year = data['year']
        
        # Track degree
        degree_key = (major, school)
        if degree_key not in degrees_map:
            degrees_map[degree_key] = f"DEGREE_ID_{len(degrees_map)}"
        
        degree_id = degrees_map[degree_key]
        
        # Process terms
        for term, term_data in data.get('terms', {}).items():
            if term not in ['fall', 'spring']:
                continue
                
            required_completion = term_data.get('required_completion')
            total_credits = term_data.get('total_credits')
            
            # Process each requirement
            for course_req in term_data.get('courses', []):
                requirement_name = course_req.get('requirement_name')
                credits = course_req.get('credits')
                critical = course_req.get('critical', False)
                minimum_grade = course_req.get('minimum_grade')
                note = course_req.get('note')
                
                # Create requirement key for later reference
                requirement_key = (degree_key, year, term, requirement_name)
                
                # Store requirement data
                requirements.append({
                    'degree_id': degree_id,
                    'major': major,
                    'school': school,
                    'year': year,
                    'term': term,
                    'requirement_name': requirement_name,
                    'credits': credits,
                    'critical': critical,
                    'minimum_grade': minimum_grade,
                    'note': note,
                    'required_completion': required_completion,
                    'total_credits': total_credits
                })
                
                # Process fulfilling courses
                for course in course_req.get('fulfilling_courses', []):
                    course_code = course.get('course_code')
                    if not course_code:
                        continue
                    
                    course_name = course.get('course_name', '')
                    course_credits = course.get('credits', '')
                    scheduled_terms = course.get('scheduled_terms', [])
                    
                    # Store course data (keep first occurrence)
                    if course_code not in courses_dict:
                        courses_dict[course_code] = {
                            'course_code': course_code,
                            'course_name': course_name,
                            'credits': course_credits,
                            'scheduled_terms': scheduled_terms
                        }
                    courses_set.add(course_code)
                    
                    # Store fulfillment
                    fulfillments.append({
                        'requirement_key': requirement_key,
                        'course_code': course_code
                    })
    
    return {
        'degrees': degrees_map,
        'courses': courses_dict,
        'requirements': requirements,
        'fulfillments': fulfillments
    }

def generate_sql_inserts(parsed_data, output_file):
    """Generate SQL INSERT statements"""
    
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write("-- ============================================\n")
        f.write("-- GENERATED SQL INSERT STATEMENTS\n")
        f.write("-- ============================================\n")
        f.write("-- Run this AFTER running supabase_schema.sql\n\n")
        
        # 1. Insert Degrees
        f.write("-- ============================================\n")
        f.write("-- 1. INSERT DEGREES\n")
        f.write("-- ============================================\n\n")
        
        for (major, school), placeholder in sorted(parsed_data['degrees'].items()):
            degree_type = "BSB" if "BSB" in major else None
            f.write(f"-- {major} - {school}\n")
            f.write(f"INSERT INTO degrees (major_name, school, degree_type)\n")
            f.write(f"VALUES ({escape_sql_string(major)}, {escape_sql_string(school)}, {escape_sql_string(degree_type)})\n")
            f.write(f"ON CONFLICT (major_name, school) DO UPDATE SET degree_type = EXCLUDED.degree_type;\n\n")
        
        f.write("\n")
        
        # 2. Insert Courses
        f.write("-- ============================================\n")
        f.write("-- 2. INSERT COURSES\n")
        f.write("-- ============================================\n\n")
        f.write("INSERT INTO courses (course_code, course_name, credits, scheduled_terms)\n")
        f.write("VALUES\n")
        
        courses_list = list(parsed_data['courses'].values())
        for idx, course in enumerate(courses_list):
            course_code = course['course_code']
            course_name = course['course_name']
            credits = course['credits']
            scheduled_terms = course['scheduled_terms']
            
            comma = "," if idx < len(courses_list) - 1 else ""
            f.write(f"    ({escape_sql_string(course_code)}, {escape_sql_string(course_name)}, "
                   f"{escape_sql_string(credits)}, {format_array_for_sql(scheduled_terms)}){comma}\n")
        
        f.write("ON CONFLICT (course_code) DO UPDATE SET\n")
        f.write("    course_name = EXCLUDED.course_name,\n")
        f.write("    credits = EXCLUDED.credits,\n")
        f.write("    scheduled_terms = EXCLUDED.scheduled_terms;\n\n")
        
        # 3. Insert Degree Requirements
        f.write("-- ============================================\n")
        f.write("-- 3. INSERT DEGREE REQUIREMENTS\n")
        f.write("-- ============================================\n\n")
        
        for req in parsed_data['requirements']:
            f.write(f"-- {req['major']} - Year {req['year']}, {req['term']} - {req['requirement_name']}\n")
            f.write(f"INSERT INTO degree_requirements (\n")
            f.write(f"    degree_id, year, term, requirement_name, credits, critical, minimum_grade, note, required_completion, total_credits\n")
            f.write(f")\n")
            f.write(f"SELECT \n")
            f.write(f"    d.id,\n")
            f.write(f"    {req['year']},\n")
            f.write(f"    {escape_sql_string(req['term'])},\n")
            f.write(f"    {escape_sql_string(req['requirement_name'])},\n")
            f.write(f"    {parse_numeric_value(req['credits'])},\n")
            f.write(f"    {str(req['critical']).upper()},\n")
            f.write(f"    {escape_sql_string(req['minimum_grade']) if req['minimum_grade'] else 'NULL'},\n")
            f.write(f"    {escape_sql_string(req['note']) if req['note'] else 'NULL'},\n")
            f.write(f"    {escape_sql_string(req['required_completion']) if req['required_completion'] else 'NULL'},\n")
            f.write(f"    {parse_numeric_value(req['total_credits'])}\n")
            f.write(f"FROM degrees d\n")
            f.write(f"WHERE d.major_name = {escape_sql_string(req['major'])} AND d.school = {escape_sql_string(req['school'])}\n")
            f.write(f"ON CONFLICT (degree_id, year, term, requirement_name) DO NOTHING;\n\n")
        
        # 4. Insert Requirement Fulfillments
        f.write("-- ============================================\n")
        f.write("-- 4. INSERT REQUIREMENT FULFILLMENTS\n")
        f.write("-- ============================================\n\n")
        
        # Group fulfillments by requirement
        fulfillments_by_req = defaultdict(list)
        for fulfillment in parsed_data['fulfillments']:
            req_key = fulfillment['requirement_key']
            fulfillments_by_req[req_key].append(fulfillment['course_code'])
        
        for req_key, course_codes in fulfillments_by_req.items():
            degree_key, year, term, requirement_name = req_key
            major, school = degree_key
            
            if not course_codes:
                continue
                
            f.write(f"-- {major} - Year {year}, {term} - {requirement_name}\n")
            f.write(f"INSERT INTO requirement_fulfillments (requirement_id, course_code)\n")
            f.write(f"SELECT dr.id, c.code\n")
            f.write(f"FROM degree_requirements dr\n")
            f.write(f"JOIN degrees d ON dr.degree_id = d.id\n")
            f.write(f"CROSS JOIN unnest({format_array_for_sql(course_codes)}) AS c(code)\n")
            f.write(f"WHERE d.major_name = {escape_sql_string(major)}\n")
            f.write(f"  AND d.school = {escape_sql_string(school)}\n")
            f.write(f"  AND dr.year = {year}\n")
            f.write(f"  AND dr.term = {escape_sql_string(term)}\n")
            f.write(f"  AND dr.requirement_name = {escape_sql_string(requirement_name)}\n")
            f.write(f"ON CONFLICT (requirement_id, course_code) DO NOTHING;\n\n")

def main():
    base_dir = Path(__file__).parent / 'kelley_tracker'
    json_files = get_all_json_files(base_dir)
    
    print(f"Found {len(json_files)} JSON files")
    
    parsed_data = parse_json_files(json_files)
    
    print(f"Found {len(parsed_data['degrees'])} unique degrees")
    print(f"Found {len(parsed_data['courses'])} unique courses")
    print(f"Found {len(parsed_data['requirements'])} requirements")
    print(f"Found {len(parsed_data['fulfillments'])} fulfillments")
    
    output_file = Path(__file__).parent / 'insert_data.sql'
    generate_sql_inserts(parsed_data, output_file)
    
    print(f"\nGenerated SQL file: {output_file}")

if __name__ == '__main__':
    main()

