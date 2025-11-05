#!/usr/bin/env python3
"""
Import courses from CSV into Supabase courses table - CHUNKED VERSION
Splits into multiple smaller SQL files that can be run in Supabase SQL Editor
"""

import csv
import re
import sys
from pathlib import Path

def parse_array_field(value):
    """Convert CSV string to PostgreSQL array format"""
    if not value or value.strip() == '':
        return 'ARRAY[]::TEXT[]'
    
    items = [item.strip() for item in re.split(r'[,;]', value) if item.strip()]
    
    if not items:
        return 'ARRAY[]::TEXT[]'
    
    escaped_items = [item.replace("'", "''") for item in items]
    array_items = [f"'{item}'" for item in escaped_items]
    return f"ARRAY[{', '.join(array_items)}]"

def clean_text_field(value):
    """Clean and escape text fields"""
    if not value:
        return 'NULL'
    
    cleaned = ' '.join(value.split())
    escaped = cleaned.replace("'", "''")
    return f"'{escaped}'"

def parse_integer_field(value):
    """Parse integer field (like open_seats)"""
    if not value or value.strip() == '':
        return 'NULL'
    
    match = re.search(r'(\d+)', str(value))
    if match:
        return match.group(1)
    return 'NULL'

def generate_sql_inserts_chunked(csv_file, rows_per_file=500):
    """Read CSV and generate multiple smaller SQL files"""
    
    print(f"Reading CSV file: {csv_file}")
    print(f"Splitting into chunks of {rows_per_file} rows each...")
    
    with open(csv_file, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        
        file_count = 0
        row_count = 0
        rows = []
        current_file = None
        
        header = """-- ============================================
-- IMPORT COURSES FROM CSV (CHUNK {})
-- ============================================
-- Run this file in Supabase SQL Editor
-- Part {} of multiple chunks

BEGIN;

INSERT INTO courses (
    course_code,
    course_name,
    class_number,
    status,
    meeting_time,
    room,
    instructor,
    open_seats,
    component_type,
    type,
    credits,
    building,
    combined_classes,
    course_description,
    class_attributes,
    enrollment_requirements
) VALUES
"""
        
        footer = """ON CONFLICT (course_code, class_number) DO UPDATE SET
    course_name = EXCLUDED.course_name,
    status = EXCLUDED.status,
    meeting_time = EXCLUDED.meeting_time,
    room = EXCLUDED.room,
    instructor = EXCLUDED.instructor,
    open_seats = EXCLUDED.open_seats,
    component_type = EXCLUDED.component_type,
    type = EXCLUDED.type,
    credits = EXCLUDED.credits,
    building = EXCLUDED.building,
    combined_classes = EXCLUDED.combined_classes,
    course_description = EXCLUDED.course_description,
    class_attributes = EXCLUDED.class_attributes,
    enrollment_requirements = EXCLUDED.enrollment_requirements,
    updated_at = NOW();

COMMIT;
"""
        
        seen_keys = set()  # Track (course_code, class_number) combinations to avoid duplicates
        
        for row in reader:
            # Parse each field
            course_code_raw = row.get('course_code', '').strip()
            class_number_raw = row.get('class_number', '').strip()
            
            # Create unique key for deduplication
            unique_key = (course_code_raw, class_number_raw)
            
            # Skip if we've already seen this combination in the current chunk
            if unique_key in seen_keys:
                continue
            
            seen_keys.add(unique_key)
            
            course_code = clean_text_field(course_code_raw)
            course_name = clean_text_field(row.get('course_name', ''))
            class_number = clean_text_field(class_number_raw)
            
            status_raw = row.get('status', '')
            status = clean_text_field(status_raw.split('\n')[0] if '\n' in status_raw else status_raw)
            
            meeting_time_raw = row.get('meeting_time', '')
            meeting_time = clean_text_field(' '.join(meeting_time_raw.split('\n')) if '\n' in meeting_time_raw else meeting_time_raw)
            
            room = clean_text_field(row.get('room', ''))
            instructor = clean_text_field(row.get('instructor', ''))
            open_seats = parse_integer_field(row.get('open_seats', ''))
            component_type = clean_text_field(row.get('component_type', ''))
            type_val = clean_text_field(row.get('type', ''))
            credits = clean_text_field(row.get('credits', ''))
            building = clean_text_field(row.get('building', ''))
            combined_classes = parse_array_field(row.get('combined_classes', ''))
            class_attributes = parse_array_field(row.get('class_attributes', ''))
            course_description = clean_text_field(row.get('course_description', ''))
            enrollment_requirements = clean_text_field(row.get('enrollment_requirements', ''))
            
            values_row = f"    ({course_code}, {course_name}, {class_number}, {status}, {meeting_time}, {room}, {instructor}, {open_seats}, {component_type}, {type_val}, {credits}, {building}, {combined_classes}, {course_description}, {class_attributes}, {enrollment_requirements})"
            rows.append(values_row)
            row_count += 1
            
            # Write chunk when we hit the limit
            if len(rows) >= rows_per_file:
                file_count += 1
                filename = f"import_courses_chunk_{file_count:03d}.sql"
                
                with open(filename, 'w', encoding='utf-8') as out:
                    out.write(header.format(file_count, file_count))
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
            filename = f"import_courses_chunk_{file_count:03d}.sql"
            
            with open(filename, 'w', encoding='utf-8') as out:
                out.write(header.format(file_count, file_count))
                out.write(',\n'.join(rows))
                out.write('\n')
                out.write(footer)
                out.write(f"\n-- Rows in this chunk: {len(rows)}\n")
            
            print(f"  Generated: {filename} ({len(rows)} rows)")
        
        print(f"\n✅ Generated {file_count} SQL files")
        print(f"📊 Total rows: {row_count}")
        print(f"\n📋 Next steps:")
        print(f"   1. Run each chunk file in Supabase SQL Editor (one at a time)")
        print(f"   2. Start with: import_courses_chunk_001.sql")
        print(f"   3. Continue with: import_courses_chunk_002.sql, etc.")
        print(f"   4. Or run them all in sequence")
        
        return row_count, file_count

def main():
    if len(sys.argv) < 2:
        csv_file = input("Enter CSV file path (default: test_fast_all.csv): ").strip()
        if not csv_file:
            csv_file = "test_fast_all.csv"
    else:
        csv_file = sys.argv[1]
    
    rows_per_file = 500  # Adjust this if needed (500 should work in Supabase)
    if len(sys.argv) >= 3:
        rows_per_file = int(sys.argv[2])
    
    csv_path = Path(csv_file)
    if not csv_path.exists():
        print(f"❌ Error: CSV file not found: {csv_file}")
        return
    
    print(f"📝 CSV file: {csv_file}")
    print(f"📦 Rows per chunk: {rows_per_file}")
    print()
    
    try:
        row_count, file_count = generate_sql_inserts_chunked(csv_file, rows_per_file)
        print(f"\n✅ Success! Generated {file_count} SQL files with {row_count} total course records")
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    main()

