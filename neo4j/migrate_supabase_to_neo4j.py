#!/usr/bin/env python3
"""
Migration script to import data from Supabase to Neo4j
Creates a graph database for course recommendations
"""

import os
import json
from typing import List, Dict, Any
from neo4j import GraphDatabase
from dotenv import load_dotenv
from supabase import create_client, Client

# Load environment variables
load_dotenv('.env.local')

# Neo4j connection
NEO4J_URI = os.getenv('NEO4J_URI', 'bolt://localhost:7687')
NEO4J_USER = os.getenv('NEO4J_USER', 'neo4j')
NEO4J_PASSWORD = os.getenv('NEO4J_PASSWORD', '')

# Supabase connection
SUPABASE_URL = os.getenv('NEXT_PUBLIC_SUPABASE_URL')
SUPABASE_KEY = os.getenv('NEXT_PUBLIC_SUPABASE_ANON_KEY')


class Neo4jMigrator:
    def __init__(self):
        self.driver = GraphDatabase.driver(NEO4J_URI, auth=(NEO4J_USER, NEO4J_PASSWORD))
        self.supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY) if SUPABASE_URL and SUPABASE_KEY else None
        
    def close(self):
        self.driver.close()
    
    def clear_database(self):
        """Clear all nodes and relationships"""
        print("🗑️  Clearing existing Neo4j database...")
        with self.driver.session() as session:
            session.run("MATCH (n) DETACH DELETE n")
        print("✅ Database cleared")
    
    def create_constraints(self):
        """Create unique constraints and indexes"""
        print("📋 Creating constraints and indexes...")
        with self.driver.session() as session:
            # Unique constraints
            session.run("CREATE CONSTRAINT degree_name IF NOT EXISTS FOR (d:Degree) REQUIRE d.name IS UNIQUE")
            session.run("CREATE CONSTRAINT course_code IF NOT EXISTS FOR (c:Course) REQUIRE c.code IS UNIQUE")
            session.run("CREATE CONSTRAINT student_user_id IF NOT EXISTS FOR (s:Student) REQUIRE s.user_id IS UNIQUE")
            
            # Indexes
            session.run("CREATE INDEX requirement_year_term IF NOT EXISTS FOR (r:Requirement) ON (r.year, r.term)")
            session.run("CREATE INDEX requirement_critical IF NOT EXISTS FOR (r:Requirement) ON (r.critical)")
        print("✅ Constraints created")
    
    def import_degrees_from_supabase(self):
        """Import degrees from Supabase"""
        if not self.supabase:
            print("⚠️  Supabase not configured, skipping Supabase import")
            return
        
        print("📚 Importing degrees from Supabase...")
        response = self.supabase.table('degrees').select('*').execute()
        
        with self.driver.session() as session:
            for degree in response.data:
                session.run("""
                    MERGE (d:Degree {name: $name})
                    SET d.school = $school,
                        d.degree_type = $degree_type,
                        d.id = $id
                """, name=degree['major_name'], 
                    school=degree.get('school', ''),
                    degree_type=degree.get('degree_type', ''),
                    id=str(degree['id']))
        
        print(f"✅ Imported {len(response.data)} degrees")
    
    def import_degrees_from_json(self, json_dir: str = 'schemabuilding/kelley_tracker'):
        """Import degrees from JSON files"""
        print("📚 Importing degrees from JSON files...")
        
        majors = set()
        json_path = json_dir
        
        # Scan all JSON files to extract unique majors
        for root, dirs, files in os.walk(json_path):
            for file in files:
                if file.endswith('.json'):
                    file_path = os.path.join(root, file)
                    with open(file_path, 'r') as f:
                        data = json.load(f)
                        majors.add((data.get('major', ''), data.get('school', 'Kelley School of Business')))
        
        with self.driver.session() as session:
            for major_name, school in majors:
                if major_name:
                    session.run("""
                        MERGE (d:Degree {name: $name})
                        SET d.school = $school,
                            d.degree_type = 'BSB'
                    """, name=major_name, school=school)
        
        print(f"✅ Imported {len(majors)} degrees from JSON")
    
    def import_requirements_from_json(self, json_dir: str = 'schemabuilding/kelley_tracker'):
        """Import requirements from JSON files"""
        print("📋 Importing requirements from JSON files...")
        
        json_path = json_dir
        requirement_count = 0
        
        with self.driver.session() as session:
            for root, dirs, files in os.walk(json_path):
                for file in files:
                    if file.endswith('.json'):
                        file_path = os.path.join(root, file)
                        with open(file_path, 'r') as f:
                            data = json.load(f)
                            
                            major_name = data.get('major', '')
                            year = data.get('year', 1)
                            school = data.get('school', 'Kelley School of Business')
                            
                            if not major_name:
                                continue
                            
                            # Process fall and spring terms
                            for term_name, term_data in data.get('terms', {}).items():
                                for course_req in term_data.get('courses', []):
                                    req_name = course_req.get('requirement_name', '')
                                    if not req_name:
                                        continue
                                    
                                    # Create requirement node
                                    session.run("""
                                        MERGE (r:Requirement {
                                            name: $req_name,
                                            year: $year,
                                            term: $term,
                                            degree_name: $major_name
                                        })
                                        SET r.credits = $credits,
                                            r.critical = $critical,
                                            r.minimum_grade = $minimum_grade,
                                            r.note = $note
                                    """, req_name=req_name,
                                        year=year,
                                        term=term_name,
                                        major_name=major_name,
                                        credits=course_req.get('credits', 0),
                                        critical=course_req.get('critical', False),
                                        minimum_grade=course_req.get('minimum_grade'),
                                        note=course_req.get('note'))
                                    
                                    # Link requirement to degree
                                    session.run("""
                                        MATCH (d:Degree {name: $major_name})
                                        MATCH (r:Requirement {
                                            name: $req_name,
                                            year: $year,
                                            term: $term,
                                            degree_name: $major_name
                                        })
                                        MERGE (d)-[:HAS_REQUIREMENT]->(r)
                                    """, major_name=major_name,
                                        req_name=req_name,
                                        year=year,
                                        term=term_name)
                                    
                                    requirement_count += 1
                                    
                                    # Import fulfilling courses
                                    for course in course_req.get('fulfilling_courses', []):
                                        course_code = course.get('course_code', '')
                                        if not course_code:
                                            continue
                                        
                                        # Create course node
                                        session.run("""
                                            MERGE (c:Course {code: $code})
                                            SET c.name = $name,
                                                c.credits = $credits,
                                                c.scheduled_terms = $scheduled_terms
                                        """, code=course_code,
                                            name=course.get('course_name', ''),
                                            credits=str(course.get('credits', '')),
                                            scheduled_terms=course.get('scheduled_terms', []))
                                        
                                        # Link course to requirement
                                        session.run("""
                                            MATCH (r:Requirement {
                                                name: $req_name,
                                                year: $year,
                                                term: $term,
                                                degree_name: $major_name
                                            })
                                            MATCH (c:Course {code: $course_code})
                                            MERGE (r)-[:FULFILLED_BY]->(c)
                                        """, req_name=req_name,
                                            year=year,
                                            term=term_name,
                                            major_name=major_name,
                                            course_code=course_code)
        
        print(f"✅ Imported {requirement_count} requirements")
    
    def import_courses_from_supabase(self):
        """Import courses from Supabase"""
        if not self.supabase:
            print("⚠️  Supabase not configured, skipping Supabase courses import")
            return
        
        print("📖 Importing courses from Supabase...")
        
        # Fetch courses in batches
        offset = 0
        batch_size = 1000
        total_imported = 0
        
        while True:
            response = self.supabase.table('courses').select('*').range(offset, offset + batch_size - 1).execute()
            
            if not response.data:
                break
            
            with self.driver.session() as session:
                for course in response.data:
                    session.run("""
                        MERGE (c:Course {code: $code})
                        SET c.name = $name,
                            c.credits = $credits,
                            c.scheduled_terms = $scheduled_terms,
                            c.description = $description,
                            c.department = $department
                    """, code=course.get('course_code', ''),
                        name=course.get('course_name', ''),
                        credits=str(course.get('credits', '')),
                        scheduled_terms=course.get('scheduled_terms', []),
                        description=course.get('description'),
                        department=course.get('department'))
            
            total_imported += len(response.data)
            offset += batch_size
            
            if len(response.data) < batch_size:
                break
        
        print(f"✅ Imported {total_imported} courses")
    
    def import_requirements_from_supabase(self):
        """Import requirements from Supabase"""
        if not self.supabase:
            print("⚠️  Supabase not configured, skipping requirements import")
            return
        
        print("📋 Importing requirements from Supabase...")
        
        # First get all degrees to map degree_id to major_name
        degrees_response = self.supabase.table('degrees').select('id, major_name, school').execute()
        degree_map = {str(d['id']): d for d in degrees_response.data}
        
        # Get requirements
        response = self.supabase.table('degree_requirements').select('*').execute()
        
        requirement_count = 0
        
        with self.driver.session() as session:
            for req in response.data:
                degree_id = str(req.get('degree_id', ''))
                degree_info = degree_map.get(degree_id, {})
                major_name = degree_info.get('major_name', '') if degree_info else ''
                
                if not major_name:
                    continue
                
                # Create requirement node
                session.run("""
                    MERGE (r:Requirement {
                        name: $req_name,
                        year: $year,
                        term: $term,
                        degree_name: $major_name
                    })
                    SET r.credits = $credits,
                        r.critical = $critical,
                        r.minimum_grade = $minimum_grade,
                        r.note = $note,
                        r.required_completion = $required_completion
                """, req_name=req.get('requirement_name', ''),
                    year=req.get('year', 1),
                    term=req.get('term', 'fall'),
                    major_name=major_name,
                    credits=float(req.get('credits', 0)),
                    critical=req.get('critical', False),
                    minimum_grade=req.get('minimum_grade'),
                    note=req.get('note'),
                    required_completion=req.get('required_completion'))
                
                # Link requirement to degree
                session.run("""
                    MATCH (d:Degree {name: $major_name})
                    MATCH (r:Requirement {
                        name: $req_name,
                        year: $year,
                        term: $term,
                        degree_name: $major_name
                    })
                    MERGE (d)-[:HAS_REQUIREMENT]->(r)
                """, major_name=major_name,
                    req_name=req.get('requirement_name', ''),
                    year=req.get('year', 1),
                    term=req.get('term', 'fall'))
                
                requirement_count += 1
        
        print(f"✅ Imported {requirement_count} requirements")
        
        # Now import requirement fulfillments (courses that fulfill requirements)
        print("🔗 Linking courses to requirements...")
        
        # Get all requirements to map requirement_id to requirement details
        req_map = {}
        for req in response.data:
            req_id = str(req.get('id', ''))
            degree_id = str(req.get('degree_id', ''))
            degree_info = degree_map.get(degree_id, {})
            req_map[req_id] = {
                'requirement_name': req.get('requirement_name', ''),
                'year': req.get('year', 1),
                'term': req.get('term', 'fall'),
                'major_name': degree_info.get('major_name', '')
            }
        
        fulfillments_response = self.supabase.table('requirement_fulfillments').select('*').execute()
        
        fulfillment_count = 0
        
        with self.driver.session() as session:
            for fulfillment in fulfillments_response.data:
                req_id = str(fulfillment.get('requirement_id', ''))
                req_info = req_map.get(req_id, {})
                
                if not req_info:
                    continue
                
                major_name = req_info.get('major_name', '')
                req_name = req_info.get('requirement_name', '')
                year = req_info.get('year', 1)
                term = req_info.get('term', 'fall')
                course_code = fulfillment.get('course_code', '')
                
                if not major_name or not req_name or not course_code:
                    continue
                
                # Link course to requirement
                session.run("""
                    MATCH (r:Requirement {
                        name: $req_name,
                        year: $year,
                        term: $term,
                        degree_name: $major_name
                    })
                    MATCH (c:Course {code: $course_code})
                    MERGE (r)-[:FULFILLED_BY]->(c)
                """, req_name=req_name,
                    year=year,
                    term=term,
                    major_name=major_name,
                    course_code=course_code)
                
                fulfillment_count += 1
        
        print(f"✅ Linked {fulfillment_count} courses to requirements")
    
    def import_students_from_supabase(self):
        """Import students and their preferences from Supabase"""
        if not self.supabase:
            print("⚠️  Supabase not configured, skipping students import")
            return
        
        print("👥 Importing students from Supabase...")
        
        response = self.supabase.table('user_preferences').select('*').execute()
        
        with self.driver.session() as session:
            for pref in response.data:
                user_id = pref.get('user_id', '')
                major = pref.get('major', '')
                courses_taken = pref.get('courses_taken', []) or []
                
                if not user_id:
                    continue
                
                # Create student node
                session.run("""
                    MERGE (s:Student {user_id: $user_id})
                    SET s.major = $major,
                        s.graduation_year = $graduation_year,
                        s.courses_taken = $courses_taken
                """, user_id=user_id,
                    major=major,
                    graduation_year=pref.get('expected_graduation_year'),
                    courses_taken=courses_taken)
                
                # Link student to degree
                if major:
                    session.run("""
                        MATCH (s:Student {user_id: $user_id})
                        MATCH (d:Degree {name: $major})
                        MERGE (s)-[:ENROLLED_IN]->(d)
                    """, user_id=user_id, major=major)
                
                # Link student to taken courses
                for course_code in courses_taken:
                    session.run("""
                        MATCH (s:Student {user_id: $user_id})
                        MATCH (c:Course {code: $course_code})
                        MERGE (s)-[:TAKEN]->(c)
                    """, user_id=user_id, course_code=course_code)
        
        print(f"✅ Imported {len(response.data)} students")
    
    def run_migration(self, clear_first: bool = True):
        """Run the complete migration - ONLY from Supabase"""
        if not self.supabase:
            print("❌ Supabase not configured!")
            print("   Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local")
            return
        
        print("🚀 Starting Neo4j migration from Supabase...")
        
        try:
            if clear_first:
                self.clear_database()
            
            self.create_constraints()
            
            # Import ONLY from Supabase
            print("\n📥 Importing from Supabase tables...")
            self.import_degrees_from_supabase()
            self.import_courses_from_supabase()
            self.import_requirements_from_supabase()  # This also links courses to requirements
            self.import_students_from_supabase()
            
            print("\n✅ Migration completed successfully!")
            
            # Print statistics
            with self.driver.session() as session:
                degrees_result = session.run("MATCH (d:Degree) RETURN count(d) as count")
                requirements_result = session.run("MATCH (r:Requirement) RETURN count(r) as count")
                courses_result = session.run("MATCH (c:Course) RETURN count(c) as count")
                students_result = session.run("MATCH (s:Student) RETURN count(s) as count")
                
                degrees_count = degrees_result.single()['count']
                requirements_count = requirements_result.single()['count']
                courses_count = courses_result.single()['count']
                students_count = students_result.single()['count']
                
                print("\n📊 Database Statistics:")
                print(f"   Degrees: {degrees_count}")
                print(f"   Requirements: {requirements_count}")
                print(f"   Courses: {courses_count}")
                print(f"   Students: {students_count}")
        
        except Exception as e:
            print(f"❌ Migration failed: {e}")
            raise
        finally:
            self.close()


def main():
    if not NEO4J_PASSWORD:
        print("❌ NEO4J_PASSWORD not set in environment variables")
        print("   Please set NEO4J_PASSWORD in .env.local")
        return
    
    migrator = Neo4jMigrator()
    migrator.run_migration(clear_first=True)


if __name__ == '__main__':
    main()

