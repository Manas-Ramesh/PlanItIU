# Neo4j Recommender System

This directory contains the Neo4j graph database setup for course recommendations.

## Graph Schema

### Nodes
- **Degree**: Represents a major/track (e.g., "Finance BSB")
  - Properties: `name`, `school`, `degree_type`
  
- **Requirement**: Represents a degree requirement (e.g., "English Composition")
  - Properties: `name`, `year`, `term`, `credits`, `critical`, `minimum_grade`
  
- **Course**: Represents a course (e.g., "ENG-W 131")
  - Properties: `code`, `name`, `credits`, `scheduled_terms`, `department`
  
- **Student**: Represents a user/student
  - Properties: `user_id`, `major`, `graduation_year`, `courses_taken[]`

### Relationships
- `(Degree)-[:HAS_REQUIREMENT]->(Requirement)`: Degree has requirements
- `(Requirement)-[:FULFILLED_BY]->(Course)`: Course fulfills requirement
- `(Student)-[:ENROLLED_IN]->(Degree)`: Student is enrolled in degree
- `(Student)-[:TAKEN]->(Course)`: Student has taken a course
- `(Course)-[:PREREQUISITE]->(Course)`: Course prerequisites (future)
- `(Course)-[:SIMILAR_TO]->(Course)`: Similar courses (future)

## Setup

1. **Install Neo4j**:
   - Download from https://neo4j.com/download/
   - Or use Neo4j Aura (cloud): https://neo4j.com/cloud/aura/

2. **Install Python dependencies**:
   ```bash
   pip install neo4j python-dotenv supabase
   ```

3. **Configure environment variables**:
   Create `.env.local` and add:
   ```
   NEO4J_URI=bolt://localhost:7687
   NEO4J_USER=neo4j
   NEO4J_PASSWORD=your_password
   ```

4. **Run migration**:
   ```bash
   python neo4j/migrate_supabase_to_neo4j.py
   ```

## Usage

### Get Recommendations for a Student

```python
from neo4j import GraphDatabase

driver = GraphDatabase.driver("bolt://localhost:7687", auth=("neo4j", "password"))

def get_recommendations(user_id, major, year, term=None):
    with driver.session() as session:
        query = """
        MATCH (s:Student {user_id: $user_id})-[:ENROLLED_IN]->(d:Degree {name: $major})
        MATCH (d)-[:HAS_REQUIREMENT]->(r:Requirement {year: $year})
        WHERE ($term IS NULL OR r.term = $term)
        AND r.critical = true
        MATCH (r)-[:FULFILLED_BY]->(c:Course)
        WHERE NOT (s)-[:TAKEN]->(c)
        RETURN r.name as requirement, c.code as course_code, c.name as course_name, 
               c.credits, r.critical, r.credits as required_credits
        ORDER BY r.critical DESC, r.year, r.term
        """
        result = session.run(query, user_id=user_id, major=major, year=year, term=term)
        return [record.data() for record in result]
```

See `neo4j/queries/recommendations.cypher` for more query examples.

