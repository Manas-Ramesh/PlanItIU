#!/usr/bin/env python3
"""
Import grade distributions from CSV files into Supabase grade_distributions table
Handles multiple CSV files and chunks them for Supabase SQL Editor
"""

import csv
import re
import sys
from pathlib import Path
from datetime import datetime

def clean_text_field(value):
    """Clean and escape text fields"""
    if not value or value.strip() == '' or value.strip() == 'N/A':
        return 'NULL'
    
    cleaned = ' '.join(value.strip().split())
    escaped = cleaned.replace("'", "''")
    return f"'{escaped}'"

def parse_numeric_field(value):
    """Parse numeric field, handling 'NR' and spaces"""
    if not value or value.strip() == '' or value.strip().upper() == 'NR':
        return 'NULL'
    
    # Remove spaces and try to parse
    cleaned = value.strip().replace(' ', '')
    try:
        return str(float(cleaned))
    except ValueError:
        return 'NULL'

def parse_integer_field(value):
    """Parse integer field, handling 'NR' and spaces"""
    if not value or value.strip() == '' or value.strip().upper() == 'NR':
        return 'NULL'
    
    # Remove spaces and try to parse
    cleaned = value.strip().replace(' ', '')
    try:
        return str(int(float(cleaned)))  # Handle floats like "3.0" -> 3
    except ValueError:
        return 'NULL'

def parse_date_field(value):
    """Parse date field (MM-DD-YYYY format)"""
    if not value or value.strip() == '':
        return 'NULL'
    
    try:
        # Try MM-DD-YYYY format
        date_obj = datetime.strptime(value.strip(), '%m-%d-%Y')
        return f"'{date_obj.strftime('%Y-%m-%d')}'"
    except ValueError:
        return 'NULL'

def process_csv_file(csv_file, rows_per_file=500):
    """Process a single CSV file and generate SQL chunks"""
    
    print(f"\n📄 Processing: {csv_file.name}")
    
    with open(csv_file, 'r', encoding='utf-8') as f:
        # Skip first row (description)
        next(f)
        
        reader = csv.DictReader(f)
        
        file_count = 0
        row_count = 0
        rows = []
        seen_keys = set()
        
        header = """-- ============================================
-- IMPORT GRADE DISTRIBUTIONS (CHUNK {})
-- ============================================
-- Source: {}
-- Part {} of multiple chunks

BEGIN;

INSERT INTO grade_distributions (
    institution_code,
    institution_description,
    term_code,
    term_description,
    session_code,
    session_description,
    academic_group_code,
    academic_group_description,
    academic_organization_code,
    academic_organization_description,
    department_code,
    course_subject,
    catalog_number,
    class_number,
    course_description,
    course_topic,
    instructor_name,
    gpa_grades,
    total_grades,
    percent_majors,
    avg_class_grade,
    avg_student_gpa,
    percent_a_grades,
    percent_b_grades,
    percent_c_grades,
    percent_d_grades,
    all_other_grades_count,
    grade_a_plus,
    grade_a,
    grade_a_minus,
    grade_b_plus,
    grade_b,
    grade_b_minus,
    grade_c_plus,
    grade_c,
    grade_c_minus,
    grade_d_plus,
    grade_d,
    grade_d_minus,
    grade_f,
    grade_p,
    grade_s,
    grade_i,
    grade_r,
    grade_ny,
    grade_nr,
    grade_nc,
    grade_w,
    grade_wx,
    grade_other,
    data_freeze_date
) VALUES
"""
        
        footer = """ON CONFLICT (term_code, course_subject, catalog_number, class_number, instructor_name) DO UPDATE SET
    institution_code = EXCLUDED.institution_code,
    institution_description = EXCLUDED.institution_description,
    term_description = EXCLUDED.term_description,
    session_code = EXCLUDED.session_code,
    session_description = EXCLUDED.session_description,
    academic_group_code = EXCLUDED.academic_group_code,
    academic_group_description = EXCLUDED.academic_group_description,
    academic_organization_code = EXCLUDED.academic_organization_code,
    academic_organization_description = EXCLUDED.academic_organization_description,
    department_code = EXCLUDED.department_code,
    course_description = EXCLUDED.course_description,
    course_topic = EXCLUDED.course_topic,
    gpa_grades = EXCLUDED.gpa_grades,
    total_grades = EXCLUDED.total_grades,
    percent_majors = EXCLUDED.percent_majors,
    avg_class_grade = EXCLUDED.avg_class_grade,
    avg_student_gpa = EXCLUDED.avg_student_gpa,
    percent_a_grades = EXCLUDED.percent_a_grades,
    percent_b_grades = EXCLUDED.percent_b_grades,
    percent_c_grades = EXCLUDED.percent_c_grades,
    percent_d_grades = EXCLUDED.percent_d_grades,
    all_other_grades_count = EXCLUDED.all_other_grades_count,
    grade_a_plus = EXCLUDED.grade_a_plus,
    grade_a = EXCLUDED.grade_a,
    grade_a_minus = EXCLUDED.grade_a_minus,
    grade_b_plus = EXCLUDED.grade_b_plus,
    grade_b = EXCLUDED.grade_b,
    grade_b_minus = EXCLUDED.grade_b_minus,
    grade_c_plus = EXCLUDED.grade_c_plus,
    grade_c = EXCLUDED.grade_c,
    grade_c_minus = EXCLUDED.grade_c_minus,
    grade_d_plus = EXCLUDED.grade_d_plus,
    grade_d = EXCLUDED.grade_d,
    grade_d_minus = EXCLUDED.grade_d_minus,
    grade_f = EXCLUDED.grade_f,
    grade_p = EXCLUDED.grade_p,
    grade_s = EXCLUDED.grade_s,
    grade_i = EXCLUDED.grade_i,
    grade_r = EXCLUDED.grade_r,
    grade_ny = EXCLUDED.grade_ny,
    grade_nr = EXCLUDED.grade_nr,
    grade_nc = EXCLUDED.grade_nc,
    grade_w = EXCLUDED.grade_w,
    grade_wx = EXCLUDED.grade_wx,
    grade_other = EXCLUDED.grade_other,
    data_freeze_date = EXCLUDED.data_freeze_date,
    updated_at = NOW();

COMMIT;
"""
        
        for row in reader:
            # Create unique key for deduplication
            term_code = row.get('Term Code', '').strip()
            course_subject = row.get('Course Subject', '').strip()
            catalog_number = row.get('Catalog Number', '').strip()
            class_number = row.get('Class #', '').strip()
            instructor = row.get('Instructor Name', '').strip() or 'N/A'
            
            unique_key = (term_code, course_subject, catalog_number, class_number, instructor)
            
            # Skip duplicates within this file
            if unique_key in seen_keys:
                continue
            
            seen_keys.add(unique_key)
            
            # Parse all fields
            values_row = f"""    ({clean_text_field(row.get('Institution Code', ''))},
    {clean_text_field(row.get('Inst Description', ''))},
    {clean_text_field(term_code)},
    {clean_text_field(row.get('Term Description', ''))},
    {clean_text_field(row.get('Session Code', ''))},
    {clean_text_field(row.get('Session Description', ''))},
    {clean_text_field(row.get('Academic Group Code', ''))},
    {clean_text_field(row.get('Academic Group Description', ''))},
    {clean_text_field(row.get('Academic Organization Code', ''))},
    {clean_text_field(row.get('Academic Organization Description', ''))},
    {clean_text_field(row.get('Department Code', ''))},
    {clean_text_field(course_subject)},
    {clean_text_field(catalog_number)},
    {clean_text_field(class_number)},
    {clean_text_field(row.get('Course Description', ''))},
    {clean_text_field(row.get('Course Topic', ''))},
    {clean_text_field(row.get('Instructor Name', ''))},
    {parse_integer_field(row.get('GPA Grades', ''))},
    {parse_integer_field(row.get('Total Grades', ''))},
    {parse_numeric_field(row.get('Percent Majors', ''))},
    {parse_numeric_field(row.get('Avg Class Grade', ''))},
    {parse_numeric_field(row.get('Avg Student GPA', ''))},
    {parse_numeric_field(row.get('Percent A Grades', ''))},
    {parse_numeric_field(row.get('Percent B Grades', ''))},
    {parse_numeric_field(row.get('Percent C Grades', ''))},
    {parse_numeric_field(row.get('Percent D Grades', ''))},
    {parse_integer_field(row.get('All Other Grades #', ''))},
    {parse_integer_field(row.get('A+', ''))},
    {parse_integer_field(row.get('A', ''))},
    {parse_integer_field(row.get('A-', ''))},
    {parse_integer_field(row.get('B+', ''))},
    {parse_integer_field(row.get('B', ''))},
    {parse_integer_field(row.get('B-', ''))},
    {parse_integer_field(row.get('C+', ''))},
    {parse_integer_field(row.get('C', ''))},
    {parse_integer_field(row.get('C-', ''))},
    {parse_integer_field(row.get('D+', ''))},
    {parse_integer_field(row.get('D', ''))},
    {parse_integer_field(row.get('D-', ''))},
    {parse_integer_field(row.get('F', ''))},
    {parse_integer_field(row.get('P', ''))},
    {parse_integer_field(row.get('S', ''))},
    {parse_integer_field(row.get('I', ''))},
    {parse_integer_field(row.get('R', ''))},
    {parse_integer_field(row.get('NY', ''))},
    {parse_integer_field(row.get('NR', ''))},
    {parse_integer_field(row.get('NC', ''))},
    {parse_integer_field(row.get('W', ''))},
    {parse_integer_field(row.get('WX', ''))},
    {parse_integer_field(row.get('Other', ''))},
    {parse_date_field(row.get('Data Freeze Date', ''))})"""
            
            rows.append(values_row)
            row_count += 1
            
            # Write chunk when we hit the limit
            if len(rows) >= rows_per_file:
                file_count += 1
                filename = f"import_grades_chunk_{file_count:03d}.sql"
                
                with open(filename, 'w', encoding='utf-8') as out:
                    out.write(header.format(file_count, csv_file.name, file_count))
                    out.write(',\n'.join(rows))
                    out.write('\n')
                    out.write(footer)
                    out.write(f"\n-- Rows in this chunk: {len(rows)}\n")
                
                print(f"  Generated: {filename} ({len(rows)} rows)")
                rows = []
                seen_keys = set()  # Reset for next chunk
        
        # Write final chunk if there are remaining rows
        if rows:
            file_count += 1
            filename = f"import_grades_chunk_{file_count:03d}.sql"
            
            with open(filename, 'w', encoding='utf-8') as out:
                out.write(header.format(file_count, csv_file.name, file_count))
                out.write(',\n'.join(rows))
                out.write('\n')
                out.write(footer)
                out.write(f"\n-- Rows in this chunk: {len(rows)}\n")
            
            print(f"  Generated: {filename} ({len(rows)} rows)")
        
        return row_count, file_count

def main():
    grade_dist_dir = Path(__file__).parent.parent / 'grade_dist'
    
    if not grade_dist_dir.exists():
        print(f"❌ Error: grade_dist directory not found: {grade_dist_dir}")
        return
    
    # Find all CSV files
    csv_files = sorted(grade_dist_dir.glob("*.csv"))
    
    if not csv_files:
        print(f"❌ Error: No CSV files found in {grade_dist_dir}")
        return
    
    print(f"📁 Found {len(csv_files)} CSV files to process")
    print(f"📦 Rows per chunk: 500")
    print()
    
    total_rows = 0
    total_chunks = 0
    
    # Process each CSV file
    for csv_file in csv_files:
        rows, chunks = process_csv_file(csv_file, rows_per_file=500)
        total_rows += rows
        total_chunks += chunks
    
    print(f"\n✅ Success!")
    print(f"📊 Total rows processed: {total_rows}")
    print(f"📦 Total chunk files generated: {total_chunks}")
    print(f"\n📋 Next steps:")
    print(f"   1. Run each chunk file in Supabase SQL Editor (one at a time)")
    print(f"   2. Start with: import_grades_chunk_001.sql")
    print(f"   3. Continue through all chunks in order")

if __name__ == "__main__":
    main()

