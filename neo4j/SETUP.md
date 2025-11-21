# Neo4j Setup Guide

## Prerequisites

1. **Install Neo4j**:
   - **Option A: Local Installation**
     - Download Neo4j Desktop: https://neo4j.com/download/
     - Install and create a new database
     - Default connection: `bolt://localhost:7687`
   
   - **Option B: Neo4j Aura (Cloud)**
     - Sign up at https://neo4j.com/cloud/aura/
     - Create a free instance
     - Copy the connection URI and credentials

2. **Install Python dependencies**:
   ```bash
   pip install -r neo4j/requirements.txt
   ```

## Configuration

1. **Add Neo4j credentials to `.env.local`**:
   ```env
   # Neo4j Configuration
   NEO4J_URI=bolt://localhost:7687
   NEO4J_USER=neo4j
   NEO4J_PASSWORD=your_password_here
   
   # Supabase (for migration)
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
   ```

2. **For Neo4j Aura**, use the connection string format:
   ```env
   NEO4J_URI=neo4j+s://xxxxx.databases.neo4j.io
   NEO4J_USER=neo4j
   NEO4J_PASSWORD=your_aura_password
   ```

## Running the Migration

1. **Make sure your Supabase tables are populated**:
   - `degrees` table should have your majors
   - `courses` table should have course data
   - `degree_requirements` and `requirement_fulfillments` should be set up

2. **Run the migration script**:
   ```bash
   python neo4j/migrate_supabase_to_neo4j.py
   ```

   This will:
   - Clear existing Neo4j database (optional)
   - Import degrees from JSON files in `schemabuilding/kelley_tracker/`
   - Import requirements and courses from JSON files
   - Import additional data from Supabase (if configured)
   - Create all relationships

3. **Verify the import**:
   ```bash
   # In Neo4j Browser (http://localhost:7474)
   MATCH (n) RETURN count(n) as total_nodes;
   MATCH ()-[r]->() RETURN count(r) as total_relationships;
   ```

## Graph Structure

```
(Degree:Finance BSB)
  └─[:HAS_REQUIREMENT]→(Requirement:English Composition {year:1, term:'fall', critical:true})
      └─[:FULFILLED_BY]→(Course:ENG-W 131)
      └─[:FULFILLED_BY]→(Course:ENG-W 170)
      └─[:FULFILLED_BY]→(Course:ENG-W 171)

(Student {user_id:'xxx'})
  └─[:ENROLLED_IN]→(Degree:Finance BSB)
  └─[:TAKEN]→(Course:ENG-W 131)
  └─[:TAKEN]→(Course:MATH-B 110)
```

## Testing Recommendations

1. **Using Python client**:
   ```python
   from neo4j.lib.neo4j_client import Neo4jClient
   
   client = Neo4jClient()
   recommendations = client.get_recommendations(
       user_id='user-123',
       year=1,
       term='fall',
       critical_only=True
   )
   print(recommendations)
   client.close()
   ```

2. **Using Cypher directly in Neo4j Browser**:
   ```cypher
   MATCH (s:Student {user_id: 'user-123'})-[:ENROLLED_IN]->(d:Degree)
   MATCH (d)-[:HAS_REQUIREMENT]->(r:Requirement {year: 1})
   WHERE r.critical = true
   MATCH (r)-[:FULFILLED_BY]->(c:Course)
   WHERE NOT (s)-[:TAKEN]->(c)
   RETURN r.name, c.code, c.name
   LIMIT 10;
   ```

## Next Steps

1. **Create API routes** in Next.js to query Neo4j
2. **Sync student data** when users update their preferences
3. **Add prerequisite relationships** for advanced recommendations
4. **Implement similarity scoring** for course recommendations

## Troubleshooting

- **Connection refused**: Make sure Neo4j is running
- **Authentication failed**: Check NEO4J_PASSWORD in `.env.local`
- **No data imported**: Verify JSON files exist in `schemabuilding/kelley_tracker/`
- **Missing relationships**: Check that migration completed successfully

