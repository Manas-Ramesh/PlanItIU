# Course Recommender Script

A Python script that generates course recommendations based on user onboarding data and degree requirements.

## Features

- **Automatic Semester Calculation**: Determines current semester based on graduation year
  - Fall: Semesters 1, 3, 5, 7 (odd)
  - Spring: Semesters 2, 4, 6, 8 (even)
  - Example: 2028 graduation = Semester 3 (Fall of Year 2)

- **Requirement-Based Recommendations**: 
  - Fetches requirements from `degree_requirements` table
  - Filters out courses already taken
  - Prioritizes critical requirements

- **GenEd Course Matching**:
  - For GenEd requirements, pulls courses from `gened_courses_identified` table
  - Matches by GenEd type (Arts & Humanities, Social & Historical, etc.)

- **Supplemental Course Selection**:
  - For supplemental requirements, randomly selects from all available courses

## Usage

```bash
# Basic usage (uses current term)
python scripts/course_recommender.py <user_id>

# Specify term
python scripts/course_recommender.py <user_id> fall
python scripts/course_recommender.py <user_id> spring
```

### Example

```bash
python scripts/course_recommender.py cb66ef4b-1886-4372-9ac4-3163d...
```

## Semester Calculation Logic

| Graduation Year | Years Until Grad | Semester (Fall) | Semester (Spring) |
|----------------|------------------|-----------------|-------------------|
| 2028 (current year + 4) | 4 | 1 | 2 |
| 2027 (current year + 3) | 3 | 3 | 4 |
| 2026 (current year + 2) | 2 | 5 | 6 |
| 2025 (current year + 1) | 1 | 7 | 8 |

## Output

The script prints:
- User information (major, graduation year, current semester)
- Courses already taken
- Recommendations grouped by requirement
- Critical requirements marked with ⭐
- Available courses for each requirement

## Requirements

- Python 3.8+
- `supabase` package
- `python-dotenv` package
- Supabase credentials in `.env.local`

## Installation

```bash
pip install supabase python-dotenv
```

