#!/usr/bin/env python3
"""
Import courses from CSV into Supabase courses table
Handles array fields, multi-line values, and data type conversions
"""

import csv
import re
import sys
from pathlib import Path

def parse_array_field(value):
    """Convert CSV string to PostgreSQL array format"""
    if not value or value.strip() == '':
        return 'ARRAY[]::TEXT[]'
    
    # Remove extra whitespace and split by comma
    # Handle both comma-separated and semicolon-separated values
    items = [item.strip() for item in re.split(r'[,;]', value) if item.strip()]
    
    if not items:
        return 'ARRAY[]::TEXT[]'
    
    # Escape single quotes and wrap in array
    escaped_items = [item.replace("'", "''") for item in items]
    # Build array items with quotes
    array_items = [f"'{item}'" for item in escaped_items]
    return f"ARRAY[{', '.join(array_items)}]"

def clean_text_field(value):
    """Clean and escape text fields"""
    if not value:
        return 'NULL'
    
    # Remove extra whitespace and newlines
    cleaned = ' '.join(value.split())
    # Escape single quotes for SQL
    escaped = cleaned.replace("'", "''")
    return f"'{escaped}'"

def parse_integer_field(value):
    """Parse integer field (like open_seats)"""
    if not value or value.strip() == '':
        return 'NULL'
    
    # Extract number from strings like "12/20 Waitlist 0" -> 12
    # Or just parse the number directly
    match = re.search(r'(\d+)', str(value))
    if match:
        return match.group(1)
    return 'NULL'

def generate_sql_inserts(csv_file, output_file):
    """Read CSV and generate SQL INSERT statements"""
    
    print(f"Reading CSV file: {csv_file}")
    
    with open(csv_file, 'r', encoding='utf-8') as f:
        # Use csv.reader to handle multi-line fields properly
        reader = csv.DictReader(f)
        
        with open(output_file, 'w', encoding='utf-8') as out:
            out.write("-- ============================================\n")
            out.write("-- IMPORT COURSES FROM CSV\n")
            out.write("-- ============================================\n")
            out.write("-- Generated from CSV file\n\n")
            
            out.write("BEGIN;\n\n")
            out.write("-- Insert courses (using ON CONFLICT to handle duplicates)\n")
            out.write("INSERT INTO courses (\n")
            out.write("    course_code,\n")
            out.write("    course_name,\n")
            out.write("    class_number,\n")
            out.write("    status,\n")
            out.write("    meeting_time,\n")
            out.write("    room,\n")
            out.write("    instructor,\n")
            out.write("    open_seats,\n")
            out.write("    component_type,\n")
            out.write("    type,\n")
            out.write("    credits,\n")
            out.write("    building,\n")
            out.write("    combined_classes,\n")
            out.write("    course_description,\n")
            out.write("    class_attributes,\n")
            out.write("    enrollment_requirements\n")
            out.write(") VALUES\n")
            
            rows = []
            row_count = 0
            
            for row in reader:
                # Parse each field
                course_code = clean_text_field(row.get('course_code', ''))
                course_name = clean_text_field(row.get('course_name', ''))
                class_number = clean_text_field(row.get('class_number', ''))
                
                # Status might need cleaning (extract "Open", "Closed", etc.)
                status_raw = row.get('status', '')
                status = clean_text_field(status_raw.split('\n')[0] if '\n' in status_raw else status_raw)
                
                # Meeting time might be multi-line
                meeting_time_raw = row.get('meeting_time', '')
                meeting_time = clean_text_field(' '.join(meeting_time_raw.split('\n')) if '\n' in meeting_time_raw else meeting_time_raw)
                
                room = clean_text_field(row.get('room', ''))
                instructor = clean_text_field(row.get('instructor', ''))
                
                # Open seats - extract number from string like "12/20 Waitlist 0"
                open_seats = parse_integer_field(row.get('open_seats', ''))
                
                component_type = clean_text_field(row.get('component_type', ''))
                type_val = clean_text_field(row.get('type', ''))
                credits = clean_text_field(row.get('credits', ''))
                building = clean_text_field(row.get('building', ''))
                
                # Array fields
                combined_classes = parse_array_field(row.get('combined_classes', ''))
                class_attributes = parse_array_field(row.get('class_attributes', ''))
                
                course_description = clean_text_field(row.get('course_description', ''))
                enrollment_requirements = clean_text_field(row.get('enrollment_requirements', ''))
                
                # Build VALUES row
                values_row = f"    ({course_code}, {course_name}, {class_number}, {status}, {meeting_time}, {room}, {instructor}, {open_seats}, {component_type}, {type_val}, {credits}, {building}, {combined_classes}, {course_description}, {class_attributes}, {enrollment_requirements})"
                rows.append(values_row)
                row_count += 1
                
                # Write in batches to avoid huge SQL files
                if len(rows) >= 1000:
                    out.write(',\n'.join(rows))
                    out.write('\n')
                    rows = []
                    print(f"Processed {row_count} rows...")
            
            # Write remaining rows
            if rows:
                out.write(',\n'.join(rows))
                out.write('\n')
            
            out.write("ON CONFLICT (course_code, class_number) DO UPDATE SET\n")
            out.write("    course_name = EXCLUDED.course_name,\n")
            out.write("    status = EXCLUDED.status,\n")
            out.write("    meeting_time = EXCLUDED.meeting_time,\n")
            out.write("    room = EXCLUDED.room,\n")
            out.write("    instructor = EXCLUDED.instructor,\n")
            out.write("    open_seats = EXCLUDED.open_seats,\n")
            out.write("    component_type = EXCLUDED.component_type,\n")
            out.write("    type = EXCLUDED.type,\n")
            out.write("    credits = EXCLUDED.credits,\n")
            out.write("    building = EXCLUDED.building,\n")
            out.write("    combined_classes = EXCLUDED.combined_classes,\n")
            out.write("    course_description = EXCLUDED.course_description,\n")
            out.write("    class_attributes = EXCLUDED.class_attributes,\n")
            out.write("    enrollment_requirements = EXCLUDED.enrollment_requirements,\n")
            out.write("    updated_at = NOW();\n\n")
            
            out.write("COMMIT;\n\n")
            out.write(f"-- Total rows imported: {row_count}\n")
    
    print(f"\n✅ Generated SQL file: {output_file}")
    print(f"📊 Total rows: {row_count}")
    return row_count

def main():
    if len(sys.argv) < 2:
        csv_file = input("Enter CSV file path (default: test_fast_all.csv): ").strip()
        if not csv_file:
            csv_file = "test_fast_all.csv"
    else:
        csv_file = sys.argv[1]
    
    # Default output file
    output_file = "import_courses.sql"
    if len(sys.argv) >= 3:
        output_file = sys.argv[2]
    
    csv_path = Path(csv_file)
    if not csv_path.exists():
        print(f"❌ Error: CSV file not found: {csv_file}")
        return
    
    print(f"📝 CSV file: {csv_file}")
    print(f"💾 Output SQL: {output_file}")
    print()
    
    try:
        row_count = generate_sql_inserts(csv_file, output_file)
        print(f"\n✅ Success! Generated SQL with {row_count} course records")
        print(f"📋 Next step: Run {output_file} in Supabase SQL Editor")
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    main()

