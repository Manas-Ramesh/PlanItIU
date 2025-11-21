"""
Neo4j client utility for course recommendations
"""

import os
from typing import List, Dict, Any, Optional
from neo4j import GraphDatabase, Driver


class Neo4jClient:
    """Client for interacting with Neo4j graph database"""
    
    def __init__(self, uri: str = None, user: str = None, password: str = None):
        self.uri = uri or os.getenv('NEO4J_URI', 'bolt://localhost:7687')
        self.user = user or os.getenv('NEO4J_USER', 'neo4j')
        self.password = password or os.getenv('NEO4J_PASSWORD', '')
        self.driver: Optional[Driver] = None
        
        if self.password:
            self.driver = GraphDatabase.driver(self.uri, auth=(self.user, self.password))
    
    def close(self):
        """Close the driver connection"""
        if self.driver:
            self.driver.close()
    
    def __enter__(self):
        return self
    
    def __exit__(self, exc_type, exc_val, exc_tb):
        self.close()
    
    def get_recommendations(
        self, 
        user_id: str, 
        year: int, 
        term: Optional[str] = None,
        critical_only: bool = False,
        limit: int = 20
    ) -> List[Dict[str, Any]]:
        """
        Get course recommendations for a student
        
        Args:
            user_id: Student's user ID
            year: Academic year (1-4)
            term: Optional term filter ('fall' or 'spring')
            critical_only: Only return critical requirements
            limit: Maximum number of recommendations
        
        Returns:
            List of recommendation dictionaries
        """
        if not self.driver:
            raise ValueError("Neo4j driver not initialized. Check NEO4J_PASSWORD.")
        
        query = """
        MATCH (s:Student {user_id: $user_id})-[:ENROLLED_IN]->(d:Degree)
        MATCH (d)-[:HAS_REQUIREMENT]->(r:Requirement {year: $year})
        WHERE ($term IS NULL OR r.term = $term)
          AND ($critical_only = false OR r.critical = true)
        MATCH (r)-[:FULFILLED_BY]->(c:Course)
        WHERE NOT (s)-[:TAKEN]->(c)
        WITH r, c,
            CASE 
                WHEN r.critical = true THEN 1000 + r.year * 100 + CASE WHEN r.term = 'fall' THEN 10 ELSE 20 END
                ELSE r.year * 100 + CASE WHEN r.term = 'fall' THEN 10 ELSE 20 END
            END as priority_score
        RETURN 
            priority_score,
            r.name as requirement_name,
            r.credits as required_credits,
            r.critical,
            r.year,
            r.term,
            c.code as course_code,
            c.name as course_name,
            c.credits as course_credits,
            c.scheduled_terms
        ORDER BY priority_score DESC, r.name, c.code
        LIMIT $limit
        """
        
        with self.driver.session() as session:
            result = session.run(
                query,
                user_id=user_id,
                year=year,
                term=term,
                critical_only=critical_only,
                limit=limit
            )
            return [record.data() for record in result]
    
    def get_grouped_recommendations(
        self,
        user_id: str,
        year: int,
        term: Optional[str] = None
    ) -> List[Dict[str, Any]]:
        """
        Get recommendations grouped by requirement
        
        Returns:
            List of requirements with their fulfilling courses
        """
        if not self.driver:
            raise ValueError("Neo4j driver not initialized. Check NEO4J_PASSWORD.")
        
        query = """
        MATCH (s:Student {user_id: $user_id})-[:ENROLLED_IN]->(d:Degree)
        MATCH (d)-[:HAS_REQUIREMENT]->(r:Requirement {year: $year})
        WHERE ($term IS NULL OR r.term = $term)
        MATCH (r)-[:FULFILLED_BY]->(c:Course)
        WHERE NOT (s)-[:TAKEN]->(c)
        WITH r, COLLECT({
            code: c.code,
            name: c.name,
            credits: c.credits,
            scheduled_terms: c.scheduled_terms
        }) as courses
        RETURN 
            r.name as requirement_name,
            r.credits as required_credits,
            r.critical,
            r.year,
            r.term,
            courses,
            SIZE(courses) as course_count
        ORDER BY r.critical DESC, r.year, r.term
        """
        
        with self.driver.session() as session:
            result = session.run(
                query,
                user_id=user_id,
                year=year,
                term=term
            )
            return [record.data() for record in result]
    
    def get_requirement_progress(
        self,
        user_id: str,
        year: int
    ) -> List[Dict[str, Any]]:
        """
        Get progress on requirements for a student
        
        Returns:
            List of requirements with completion status
        """
        if not self.driver:
            raise ValueError("Neo4j driver not initialized. Check NEO4J_PASSWORD.")
        
        query = """
        MATCH (s:Student {user_id: $user_id})-[:ENROLLED_IN]->(d:Degree)
        MATCH (d)-[:HAS_REQUIREMENT]->(r:Requirement {year: $year})
        OPTIONAL MATCH (r)-[:FULFILLED_BY]->(c:Course)
        OPTIONAL MATCH (s)-[:TAKEN]->(c)
        WITH r, COUNT(DISTINCT c) as total_courses, 
             COUNT(DISTINCT CASE WHEN (s)-[:TAKEN]->(c) THEN c END) as taken_courses
        RETURN 
            r.name as requirement_name,
            r.credits as required_credits,
            r.critical,
            r.year,
            r.term,
            total_courses,
            taken_courses,
            CASE WHEN taken_courses > 0 THEN true ELSE false END as is_complete
        ORDER BY r.critical DESC, r.year, r.term
        """
        
        with self.driver.session() as session:
            result = session.run(query, user_id=user_id, year=year)
            return [record.data() for record in result]
    
    def update_student_courses(self, user_id: str, courses_taken: List[str]):
        """
        Update a student's taken courses
        
        Args:
            user_id: Student's user ID
            courses_taken: List of course codes the student has taken
        """
        if not self.driver:
            raise ValueError("Neo4j driver not initialized. Check NEO4J_PASSWORD.")
        
        query = """
        MATCH (s:Student {user_id: $user_id})
        SET s.courses_taken = $courses_taken
        
        // Remove old TAKEN relationships
        MATCH (s)-[t:TAKEN]->(c:Course)
        WHERE NOT c.code IN $courses_taken
        DELETE t
        
        // Add new TAKEN relationships
        WITH s
        UNWIND $courses_taken as course_code
        MATCH (c:Course {code: course_code})
        MERGE (s)-[:TAKEN]->(c)
        """
        
        with self.driver.session() as session:
            session.run(query, user_id=user_id, courses_taken=courses_taken)
    
    def sync_student_from_supabase(self, user_id: str, major: str, graduation_year: int, courses_taken: List[str]):
        """
        Sync student data from Supabase to Neo4j
        
        Args:
            user_id: Student's user ID
            major: Major name
            graduation_year: Expected graduation year
            courses_taken: List of course codes
        """
        if not self.driver:
            raise ValueError("Neo4j driver not initialized. Check NEO4J_PASSWORD.")
        
        query = """
        // Create or update student
        MERGE (s:Student {user_id: $user_id})
        SET s.major = $major,
            s.graduation_year = $graduation_year,
            s.courses_taken = $courses_taken
        
        // Link to degree
        MATCH (d:Degree {name: $major})
        MERGE (s)-[:ENROLLED_IN]->(d)
        
        // Update taken courses relationships
        WITH s
        MATCH (s)-[t:TAKEN]->(c:Course)
        WHERE NOT c.code IN $courses_taken
        DELETE t
        
        WITH s
        UNWIND $courses_taken as course_code
        MATCH (c:Course {code: course_code})
        MERGE (s)-[:TAKEN]->(c)
        """
        
        with self.driver.session() as session:
            session.run(
                query,
                user_id=user_id,
                major=major,
                graduation_year=graduation_year,
                courses_taken=courses_taken
            )


# Example usage
if __name__ == '__main__':
    client = Neo4jClient()
    
    # Get recommendations
    recommendations = client.get_recommendations(
        user_id='user-123',
        year=1,
        term='fall',
        critical_only=True
    )
    
    print("Recommendations:", recommendations)
    
    client.close()

