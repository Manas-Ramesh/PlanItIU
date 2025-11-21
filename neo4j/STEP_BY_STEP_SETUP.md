# Step-by-Step Neo4j Setup Guide

## Prerequisites Checklist

- [ ] Python 3.8+ installed
- [ ] Node.js and npm installed (for Next.js integration)
- [ ] Supabase tables populated (degrees, courses, degree_requirements, requirement_fulfillments)
- [ ] JSON files in `schemabuilding/kelley_tracker/` directory

---

## Step 1: Install Neo4j

### Option A: Local Installation (Recommended for Development)

1. **Download Neo4j Desktop**
   - Go to: https://neo4j.com/download/
   - Download Neo4j Desktop for your OS
   - Install the application

2. **Create a New Database**
   - Open Neo4j Desktop
   - Click "New Project"
   - Click "Add Database" → "Create a Local Database"
   - Set database name: `planit-recommender`
   - Set password: **Remember this password!** (you'll need it for NEO4J_PASSWORD)
   - Click "Create"

3. **Start the Database**
   - Click the "Start" button on your database
   - Wait for it to show "Active"
   - Note the connection URI (usually `bolt://localhost:7687`)

4. **Access Neo4j Browser** (Optional, for testing)
   - Click "Open" button on your database
   - This opens Neo4j Browser at http://localhost:7474
   - Login with username: `neo4j` and your password

### Option B: Neo4j Aura (Cloud - Free Tier Available)

1. **Sign Up**
   - Go to: https://neo4j.com/cloud/aura/
   - Click "Try Free"
   - Create an account

2. **Create a Database**
   - Click "Create Database"
   - Choose "Free" tier
   - Select region
   - Set database name: `planit-recommender`
   - Set password: **Save this password!**
   - Click "Create Database"

3. **Get Connection Details**
   - Once created, click on your database
   - Copy the connection URI (looks like: `neo4j+s://xxxxx.databases.neo4j.io`)
   - Note the username (usually `neo4j`)
   - Note your password

---

## Step 2: Configure Environment Variables

1. **Open `.env.local` file** in your project root

2. **Add Neo4j configuration**:
   ```env
   # Neo4j Configuration
   NEO4J_URI=bolt://localhost:7687
   NEO4J_USER=neo4j
   NEO4J_PASSWORD=your_password_here
   ```

   **For Neo4j Aura**, use:
   ```env
   NEO4J_URI=neo4j+s://xxxxx.databases.neo4j.io
   NEO4J_USER=neo4j
   NEO4J_PASSWORD=your_aura_password
   ```

3. **Verify Supabase variables are set** (for migration):
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
   ```

4. **Save the file**

---

## Step 3: Install Python Dependencies

1. **Open terminal** in your project directory

2. **Create virtual environment** (recommended):
   ```bash
   python3 -m venv venv
   source venv/bin/activate  # On Mac/Linux
   # OR
   venv\Scripts\activate  # On Windows
   ```

3. **Install dependencies**:
   ```bash
   pip install -r neo4j/requirements.txt
   ```

   This installs:
   - `neo4j` - Neo4j Python driver
   - `python-dotenv` - For loading .env files
   - `supabase` - For connecting to Supabase

4. **Verify installation**:
   ```bash
   python -c "import neo4j; print('Neo4j installed successfully')"
   ```

---

## Step 4: Verify Data Sources

### Check JSON Files

1. **Verify JSON files exist**:
   ```bash
   ls schemabuilding/kelley_tracker/
   ```

   You should see directories like:
   - `accounting/`
   - `finance/`
   - `marketing/`
   - etc.

2. **Check a sample JSON file**:
   ```bash
   cat schemabuilding/kelley_tracker/finance/finance-year1.json | head -20
   ```

   Should show JSON structure with `major`, `year`, `terms`, etc.

### Check Supabase Tables (Optional)

If you want to import from Supabase:

1. **Verify tables exist** in Supabase:
   - `degrees` table
   - `courses` table
   - `degree_requirements` table
   - `requirement_fulfillments` table

2. **Check if tables have data**:
   - Go to Supabase Dashboard → Table Editor
   - Verify tables are populated

---

## Step 5: Run the Migration

1. **Make sure Neo4j is running**
   - If using Neo4j Desktop: Database should show "Active"
   - If using Aura: Database should be running

2. **Run the migration script**:
   ```bash
   python neo4j/migrate_supabase_to_neo4j.py
   ```

3. **Watch for output**:
   - Should see: "🚀 Starting Neo4j migration..."
   - Should see: "✅ Imported X degrees"
   - Should see: "✅ Imported X requirements"
   - Should see: "✅ Migration completed successfully!"

4. **If errors occur**:
   - Check NEO4J_PASSWORD is correct
   - Check NEO4J_URI is correct
   - Check Neo4j is running
   - Check JSON files exist

---

## Step 6: Verify the Import

### Option A: Using Neo4j Browser

1. **Open Neo4j Browser**:
   - Local: http://localhost:7474
   - Aura: Click "Open" in Aura dashboard

2. **Run test queries**:
   ```cypher
   // Count all nodes
   MATCH (n) RETURN count(n) as total_nodes;
   
   // Count relationships
   MATCH ()-[r]->() RETURN count(r) as total_relationships;
   
   // See a sample degree
   MATCH (d:Degree) RETURN d LIMIT 5;
   
   // See requirements for Finance
   MATCH (d:Degree {name: "Finance BSB"})-[:HAS_REQUIREMENT]->(r:Requirement)
   RETURN r.name, r.year, r.term LIMIT 10;
   ```

### Option B: Using Python Script

1. **Run example script**:
   ```bash
   python neo4j/example_usage.py
   ```

   This will:
   - Create a test student
   - Get recommendations
   - Show requirement progress

---

## Step 7: Test Recommendations

1. **Create a test student** (if not already done):
   ```python
   from neo4j.lib.neo4j_client import Neo4jClient
   from dotenv import load_dotenv
   load_dotenv('.env.local')
   
   client = Neo4jClient()
   client.sync_student_from_supabase(
       user_id="test-user-123",
       major="Finance BSB",
       graduation_year=2027,
       courses_taken=["ENG-W 131", "MATH-B 110"]
   )
   ```

2. **Get recommendations**:
   ```python
   recommendations = client.get_recommendations(
       user_id="test-user-123",
       year=1,
       term='fall',
       critical_only=True
   )
   print(recommendations)
   ```

---

## Step 8: Integrate with Next.js (Optional)

### Install Neo4j Driver for Node.js

1. **Install package**:
   ```bash
   npm install neo4j-driver
   ```

2. **Update API route**:
   - Open `app/api/recommendations/route.ts`
   - Uncomment the Neo4j code
   - The code is already there, just needs to be uncommented

3. **Test the API**:
   ```bash
   npm run dev
   ```

   Then visit: `http://localhost:3000/api/recommendations?year=1&term=fall`

---

## Step 9: Sync Student Data (When Users Update Preferences)

You'll need to sync student data whenever:
- User completes onboarding
- User updates their major
- User adds courses taken

### Option A: Python Script

Create a script to sync:
```python
from neo4j.lib.neo4j_client import Neo4jClient
from supabase import create_client
import os
from dotenv import load_dotenv

load_dotenv('.env.local')

supabase = create_client(
    os.getenv('NEXT_PUBLIC_SUPABASE_URL'),
    os.getenv('NEXT_PUBLIC_SUPABASE_ANON_KEY')
)

client = Neo4jClient()

# Get all students from Supabase
prefs = supabase.table('user_preferences').select('*').execute()

for pref in prefs.data:
    client.sync_student_from_supabase(
        user_id=pref['user_id'],
        major=pref['major'],
        graduation_year=pref['expected_graduation_year'],
        courses_taken=pref['courses_taken'] or []
    )

client.close()
```

### Option B: Next.js API Route

Create an API route that syncs on demand or on a schedule.

---

## Troubleshooting

### Connection Issues

**Error: "Unable to connect to Neo4j"**
- ✅ Check Neo4j is running
- ✅ Check NEO4J_URI is correct
- ✅ Check firewall isn't blocking port 7687
- ✅ For Aura: Check connection string format

**Error: "Authentication failed"**
- ✅ Check NEO4J_PASSWORD is correct
- ✅ Check NEO4J_USER is correct (usually "neo4j")

### Import Issues

**Error: "No JSON files found"**
- ✅ Check `schemabuilding/kelley_tracker/` directory exists
- ✅ Check JSON files are in subdirectories

**Error: "Supabase connection failed"**
- ✅ Check Supabase URL and key in `.env.local`
- ✅ Migration will still work from JSON files

### Query Issues

**Error: "Student not found"**
- ✅ Make sure student exists: `MATCH (s:Student) RETURN s LIMIT 5`
- ✅ Sync student data first

**No recommendations returned**
- ✅ Check student is enrolled in a degree
- ✅ Check requirements exist for that major/year
- ✅ Check courses fulfill requirements

---

## Quick Reference

### Essential Commands

```bash
# Start migration
python neo4j/migrate_supabase_to_neo4j.py

# Test client
python neo4j/example_usage.py

# Check Neo4j connection
python -c "from neo4j import GraphDatabase; driver = GraphDatabase.driver('bolt://localhost:7687', auth=('neo4j', 'your_password')); print('Connected!'); driver.close()"
```

### Essential Cypher Queries

```cypher
// Count nodes by type
MATCH (n) RETURN labels(n)[0] as type, count(n) as count;

// Find all degrees
MATCH (d:Degree) RETURN d.name;

// Find requirements for a degree
MATCH (d:Degree {name: "Finance BSB"})-[:HAS_REQUIREMENT]->(r:Requirement)
RETURN r.name, r.year, r.term, r.critical;

// Find courses for a requirement
MATCH (r:Requirement {name: "English Composition"})-[:FULFILLED_BY]->(c:Course)
RETURN c.code, c.name;
```

---

## Next Steps After Setup

1. ✅ **Test recommendations** for different majors and years
2. ✅ **Add prerequisite relationships** (if you have that data)
3. ✅ **Integrate with Next.js** frontend
4. ✅ **Set up automatic syncing** when users update preferences
5. ✅ **Add more sophisticated recommendation algorithms**
6. ✅ **Track recommendation performance**

---

## Summary Checklist

- [ ] Step 1: Neo4j installed and running
- [ ] Step 2: Environment variables configured
- [ ] Step 3: Python dependencies installed
- [ ] Step 4: Data sources verified
- [ ] Step 5: Migration completed successfully
- [ ] Step 6: Import verified in Neo4j Browser
- [ ] Step 7: Recommendations tested
- [ ] Step 8: Next.js integration (optional)
- [ ] Step 9: Student sync mechanism set up

**You're all set!** 🎉

