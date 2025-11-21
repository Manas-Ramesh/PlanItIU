#!/usr/bin/env python3
"""
Example usage of Neo4j client for course recommendations
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from lib.neo4j_client import Neo4jClient
import os
from dotenv import load_dotenv

load_dotenv('.env.local')


def main():
    # Initialize client
    client = Neo4jClient()
    
    # Example user data
    user_id = "example-user-123"
    major = "Finance BSB"
    graduation_year = 2027
    courses_taken = ["ENG-W 131", "MATH-B 110", "BUS-C 104"]
    
    # Sync student data
    print("📝 Syncing student data...")
    client.sync_student_from_supabase(
        user_id=user_id,
        major=major,
        graduation_year=graduation_year,
        courses_taken=courses_taken
    )
    print("✅ Student synced")
    
    # Get recommendations for Year 1
    print("\n🎓 Getting recommendations for Year 1...")
    recommendations = client.get_recommendations(
        user_id=user_id,
        year=1,
        term=None,  # All terms
        critical_only=True,
        limit=10
    )
    
    print(f"\n📋 Found {len(recommendations)} recommendations:")
    for rec in recommendations:
        print(f"  ⭐ {rec['requirement_name']} ({'Critical' if rec['critical'] else 'Optional'})")
        print(f"     → {rec['course_code']}: {rec['course_name']}")
        print(f"     Credits: {rec['course_credits']}")
        print()
    
    # Get grouped recommendations
    print("\n📊 Getting grouped recommendations...")
    grouped = client.get_grouped_recommendations(
        user_id=user_id,
        year=1,
        term='fall'
    )
    
    print(f"\n📋 Found {len(grouped)} requirements for Fall Year 1:")
    for req in grouped:
        print(f"  {req['requirement_name']} ({req['course_count']} courses available)")
        for course in req['courses'][:3]:  # Show first 3 courses
            print(f"    - {course['code']}: {course['name']}")
        if req['course_count'] > 3:
            print(f"    ... and {req['course_count'] - 3} more")
        print()
    
    # Get requirement progress
    print("\n📈 Getting requirement progress...")
    progress = client.get_requirement_progress(
        user_id=user_id,
        year=1
    )
    
    print(f"\n📋 Progress on Year 1 requirements:")
    for req in progress:
        status = "✅" if req['is_complete'] else "⏳"
        print(f"  {status} {req['requirement_name']} "
              f"({req['taken_courses']}/{req['total_courses']} courses)")
    
    client.close()


if __name__ == '__main__':
    main()

