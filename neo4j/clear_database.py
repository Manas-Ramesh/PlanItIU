#!/usr/bin/env python3
"""
Quick script to clear all data from Neo4j database
"""

import os
from neo4j import GraphDatabase
from dotenv import load_dotenv

load_dotenv('.env.local')

NEO4J_URI = os.getenv('NEO4J_URI', 'bolt://localhost:7687')
NEO4J_USER = os.getenv('NEO4J_USER', 'neo4j')
NEO4J_PASSWORD = os.getenv('NEO4J_PASSWORD', '')

if not NEO4J_PASSWORD:
    print("❌ NEO4J_PASSWORD not set in environment variables")
    print("   Please set NEO4J_PASSWORD in .env.local")
    exit(1)

print("🗑️  Clearing Neo4j database...")

driver = GraphDatabase.driver(NEO4J_URI, auth=(NEO4J_USER, NEO4J_PASSWORD))

try:
    with driver.session() as session:
        # Delete all nodes and relationships
        result = session.run("MATCH (n) DETACH DELETE n RETURN count(n) as deleted")
        deleted_count = result.single()['deleted']
        print(f"✅ Deleted {deleted_count} nodes and all relationships")
        
        # Also drop constraints and indexes (optional, but clean)
        try:
            session.run("DROP CONSTRAINT degree_name IF EXISTS")
            session.run("DROP CONSTRAINT course_code IF EXISTS")
            session.run("DROP CONSTRAINT student_user_id IF EXISTS")
            print("✅ Dropped constraints")
        except:
            pass  # Constraints might not exist
    
    print("\n✅ Database cleared successfully!")
    print("   You can now run the migration to import from Supabase:")
    print("   python neo4j/migrate_supabase_to_neo4j.py")

except Exception as e:
    print(f"❌ Error clearing database: {e}")
finally:
    driver.close()

