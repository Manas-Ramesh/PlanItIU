#!/usr/bin/env python3
"""
Course Recommender System
Uses onboarding data to recommend courses based on degree requirements
"""

import os
import random
from datetime import datetime
from typing import List, Dict, Any, Optional
from supabase import create_client
from dotenv import load_dotenv

load_dotenv('.env.local')

SUPABASE_URL = os.getenv('NEXT_PUBLIC_SUPABASE_URL')
# Try service role key first (bypasses RLS), fallback to anon key
SUPABASE_KEY = os.getenv('SUPABASE_SERVICE_ROLE_KEY') or os.getenv('NEXT_PUBLIC_SUPABASE_ANON_KEY')

if not SUPABASE_URL or not SUPABASE_KEY:
    raise ValueError("Supabase credentials not found in .env.local")
    print("\n⚠️  Note: If you get 'No users found', you may need to:")
    print("   1. Add SUPABASE_SERVICE_ROLE_KEY to .env.local (bypasses RLS)")
    print("   2. Or update RLS policies to allow reading user_preferences")

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)


def calculate_current_semester(graduation_year: int, current_term: str = 'fall') -> tuple[int, str]:
    """
    Calculate current semester number and term based on graduation year
    
    Semester numbering:
    - Fall: 1, 3, 5, 7 (odd)
    - Spring: 2, 4, 6, 8 (even)
    
    Args:
        graduation_year: Expected graduation year (e.g., 2028)
        current_term: 'fall' or 'spring'
    
    Returns:
        tuple: (semester_number, term)
    """
    current_year = datetime.now().year
    current_month = datetime.now().month
    
    # Determine if we're in fall or spring based on current date
    # Fall: August-December (months 8-12)
    # Spring: January-July (months 1-7)
    if current_month >= 8:
        actual_term = 'fall'
    else:
        actual_term = 'spring'
    
    # Use provided term if given, otherwise use actual term
    term = current_term if current_term else actual_term
    
    # Calculate years until graduation
    years_until_graduation = graduation_year - current_year
    
    # Calculate semester number
    # Year 1: semesters 1-2
    # Year 2: semesters 3-4
    # Year 3: semesters 5-6
    # Year 4: semesters 7-8
    
    if years_until_graduation == 4:
        # Freshman (Year 1)
        semester = 1 if term == 'fall' else 2
    elif years_until_graduation == 3:
        # Sophomore (Year 2)
        semester = 3 if term == 'fall' else 4
    elif years_until_graduation == 2:
        # Junior (Year 3)
        semester = 5 if term == 'fall' else 6
    elif years_until_graduation == 1:
        # Senior (Year 4)
        semester = 7 if term == 'fall' else 8
    else:
        # Default to semester 1 if graduation is far in future
        semester = 1 if term == 'fall' else 2
    
    # Calculate year (1-4) and term for requirements lookup
    year = ((semester - 1) // 2) + 1
    
    return semester, year, term


def get_degree_requirements(major: str, year: int, term: str) -> List[Dict[str, Any]]:
    """
    Get degree requirements for a specific major, year, and term
    
    Args:
        major: Major name (e.g., "Finance BSB")
        year: Academic year (1-4)
        term: 'fall' or 'spring'
    
    Returns:
        List of requirement dictionaries
    """
    # First get the degree
    degree_response = supabase.table('degrees').select('id').eq('major_name', major).execute()
    
    if not degree_response.data:
        print(f"❌ Major '{major}' not found in database")
        return []
    
    degree_id = degree_response.data[0]['id']
    
    # Get requirements for this degree, year, and term
    requirements_response = supabase.table('degree_requirements').select('*').eq(
        'degree_id', degree_id
    ).eq('year', year).eq('term', term).execute()
    
    return requirements_response.data


def get_gened_courses(gened_type: str, limit: int = 10, rank_by_gpa: bool = True) -> List[str]:
    """
    Get courses that fulfill a specific GenEd requirement
    
    Args:
        gened_type: GenEd type (e.g., "Arts & Humanities", "Social & Historical", etc.)
        limit: Maximum number of courses to return
    
    Returns:
        List of course codes
    """
    # Map GenEd requirement names to table columns
    gened_column_map = {
        'arts & humanities': 'gened_ah',
        'social & historical': 'gened_sh',
        'natural & mathematical': 'gened_nm',
        'natural & mathematical sciences': 'gened_nm',
        'world languages': 'gened_world',
        'world cultures': 'gened_world',
    }
    
    # Find matching column
    column = None
    gened_lower = gened_type.lower()
    for key, col in gened_column_map.items():
        if key in gened_lower:
            column = col
            break
    
    if not column:
        # Try to find by checking class_attributes
        response = supabase.table('gened_courses_identified').select('me, class_attributes').limit(limit * 3).execute()
        courses = []
        for course in response.data:
            attrs = course.get('class_attributes', [])
            if attrs:
                attrs_str = ' '.join(str(attr) for attr in attrs).lower()
                if any(keyword in attrs_str for keyword in ['gened', gened_lower]):
                    course_code = course.get('me') or course.get('course_code')
                    if course_code:
                        courses.append(course_code)
        
        # If ranking by GPA, sort courses by their historical GPA
        if rank_by_gpa and courses:
            ranked = rank_courses_by_gpa(courses)
            return [course_code for course_code, gpa in ranked[:limit]]
        
        return courses[:limit]
    
    # Get courses where the specific GenEd column is not null
    # Try different possible column names for course code
    try:
        response = supabase.table('gened_courses_identified').select('me, course_code').not_.is_(
            column, 'null'
        ).limit(limit).execute()
        
        if response.data:
            courses = []
            for c in response.data:
                course_code = c.get('course_code') or c.get('me')
                if course_code:
                    courses.append(course_code)
            if courses:
                # If ranking by GPA, sort courses by their historical GPA
                if rank_by_gpa:
                    ranked = rank_courses_by_gpa(courses)
                    return [course_code for course_code, gpa in ranked[:limit]]
                return courses[:limit]
    except:
        # If that fails, try with just 'me'
        try:
            response = supabase.table('gened_courses_identified').select('me').not_.is_(
                column, 'null'
            ).limit(limit).execute()
            
            if response.data:
                courses = [c.get('me', '') for c in response.data if c.get('me')]
                # If ranking by GPA, sort courses by their historical GPA
                if rank_by_gpa and courses:
                    ranked = rank_courses_by_gpa(courses)
                    return [course_code for course_code, gpa in ranked[:limit]]
                return courses[:limit]
        except:
            pass
    
    # Fallback: check class_attributes for GenEd indicators
    response = supabase.table('gened_courses_identified').select('me, class_attributes').limit(limit * 3).execute()
    
    courses = []
    for course in response.data:
        attrs = course.get('class_attributes', [])
        if attrs:
            attrs_str = ' '.join(str(attr) for attr in attrs).lower()
            if gened_lower in attrs_str or any(keyword in attrs_str for keyword in ['gened']):
                course_code = course.get('me') or course.get('course_code')
                if course_code:
                    courses.append(course_code)
    
    # If ranking by GPA, sort courses by their historical GPA
    if rank_by_gpa and courses:
        ranked = rank_courses_by_gpa(courses)
        # Return top courses by GPA
        return [course_code for course_code, gpa in ranked[:limit]]
    
    return courses[:limit]


def get_future_semester_courses(major: str, current_year: int, current_term: str, courses_taken_normalized: List[str], limit: int = 5) -> List[str]:
    """
    Get courses from future semesters that can be taken early
    
    Args:
        major: Major name
        current_year: Current academic year (1-4)
        current_term: Current term ('fall' or 'spring')
        courses_taken_normalized: List of normalized course codes already taken
        limit: Maximum number of courses to return
    
    Returns:
        List of course codes from future semesters
    """
    future_courses = []
    
    # Get requirements for next term (same year, opposite term)
    next_term = 'spring' if current_term == 'fall' else 'fall'
    next_year = current_year
    
    # Also check next year
    if current_term == 'spring':
        next_year = current_year + 1
    
    # Get requirements for next term and next year
    for check_year in [next_year, min(next_year + 1, 4)]:
        for check_term in [next_term, 'fall', 'spring']:
            if check_year > 4:
                break
            
            requirements = get_degree_requirements(major, check_year, check_term)
            
            for req in requirements:
                req_id = req.get('id')
                fulfilling_courses = get_fulfilling_courses(req_id)
                
                # Filter out courses already taken
                for course in fulfilling_courses:
                    course_normalized = course.strip().upper() if course else ''
                    if course_normalized not in courses_taken_normalized and course not in future_courses:
                        future_courses.append(course)
                        if len(future_courses) >= limit:
                            return future_courses
    
    return future_courses


def get_random_courses(limit: int = 5, exclude: List[str] = None, rank_by_gpa: bool = True) -> List[str]:
    """
    Get courses from all available courses, ranked by GPA or random
    
    Args:
        limit: Number of courses to return
        exclude: List of course codes to exclude
        rank_by_gpa: If True, rank by GPA; if False, return random sample
    
    Returns:
        List of course codes
    """
    exclude = exclude or []
    
    # Get all course codes
    all_courses_response = supabase.table('courses').select('course_code').execute()
    
    if not all_courses_response.data:
        return []
    
    all_courses = [c['course_code'] for c in all_courses_response.data if c['course_code'] not in exclude]
    
    if rank_by_gpa:
        # Rank by GPA instead of random
        ranked = rank_courses_by_gpa(all_courses)
        # Return top courses by GPA
        return [course_code for course_code, gpa in ranked[:limit]]
    
    # Return random sample (fallback)
    return random.sample(all_courses, min(limit, len(all_courses)))


def get_course_gpa_stats(course_codes: List[str]) -> Dict[str, Dict[str, Any]]:
    """
    Get GPA statistics for a list of course codes from grade_distributions
    
    Args:
        course_codes: List of course codes to look up
    
    Returns:
        Dictionary mapping course_code to GPA stats:
        {
            'course_code': {
                'avg_gpa': 3.5,
                'best_instructor_gpa': 3.8,
                'best_instructor': 'Smith, John',
                'total_sections': 10,
                'total_terms': 5
            }
        }
    """
    if not course_codes:
        return {}
    
    stats = {}
    
    # Query grade distributions for all course codes
    # We'll do this in batches to avoid query size limits
    batch_size = 50
    
    for i in range(0, len(course_codes), batch_size):
        batch = course_codes[i:i + batch_size]
        
        try:
            response = supabase.table('grade_distributions').select(
                'course_code, avg_class_grade, instructor_name, class_number, term_code'
            ).in_('course_code', batch).not_.is_('avg_class_grade', 'null').execute()
            
            if response.data:
                # Group by course_code
                course_data = {}
                for row in response.data:
                    course_code = row.get('course_code', '').strip().upper()
                    if not course_code:
                        continue
                    
                    if course_code not in course_data:
                        course_data[course_code] = {
                            'grades': [],
                            'instructors': {}
                        }
                    
                    avg_grade = row.get('avg_class_grade')
                    if avg_grade is not None:
                        try:
                            avg_grade = float(avg_grade)
                            course_data[course_code]['grades'].append(avg_grade)
                            
                            # Track by instructor
                            instructor = row.get('instructor_name', '')
                            if instructor:
                                if instructor not in course_data[course_code]['instructors']:
                                    course_data[course_code]['instructors'][instructor] = []
                                course_data[course_code]['instructors'][instructor].append(avg_grade)
                        except (ValueError, TypeError):
                            pass
                
                # Calculate averages for each course
                # First, collect term codes by course
                course_terms = {}
                for row in response.data:
                    course_code = row.get('course_code', '').strip().upper()
                    if course_code:
                        if course_code not in course_terms:
                            course_terms[course_code] = set()
                        term_code = row.get('term_code', '')
                        if term_code:
                            course_terms[course_code].add(term_code)
                
                for course_code, data in course_data.items():
                    if data['grades']:
                        avg_gpa = sum(data['grades']) / len(data['grades'])
                        
                        # Find best instructor
                        best_instructor = None
                        best_instructor_gpa = 0
                        for instructor, grades in data['instructors'].items():
                            if grades:
                                instructor_avg = sum(grades) / len(grades)
                                if instructor_avg > best_instructor_gpa:
                                    best_instructor_gpa = instructor_avg
                                    best_instructor = instructor
                        
                        stats[course_code] = {
                            'avg_gpa': round(avg_gpa, 3),
                            'best_instructor_gpa': round(best_instructor_gpa, 3) if best_instructor else None,
                            'best_instructor': best_instructor,
                            'total_sections': len(data['grades']),
                            'total_terms': len(course_terms.get(course_code, set()))
                        }
        except Exception as e:
            print(f"Warning: Error fetching GPA stats for batch: {e}")
            continue
    
    return stats


def rank_courses_by_gpa(course_codes: List[str]) -> List[tuple[str, float]]:
    """
    Rank courses by their historical average GPA
    
    Args:
        course_codes: List of course codes to rank
    
    Returns:
        List of (course_code, avg_gpa) tuples, sorted by GPA descending
    """
    if not course_codes:
        return []
    
    # Get GPA stats for all courses
    gpa_stats = get_course_gpa_stats(course_codes)
    
    # Create list of (course_code, gpa) tuples
    ranked = []
    for course_code in course_codes:
        course_normalized = course_code.strip().upper()
        if course_normalized in gpa_stats:
            # Use best instructor GPA if available, otherwise overall average
            gpa = gpa_stats[course_normalized].get('best_instructor_gpa') or gpa_stats[course_normalized].get('avg_gpa', 0)
            ranked.append((course_code, gpa))
        else:
            # No GPA data available, assign 0 (will be sorted last)
            ranked.append((course_code, 0.0))
    
    # Sort by GPA descending
    ranked.sort(key=lambda x: x[1], reverse=True)
    
    return ranked


def get_fulfilling_courses(requirement_id: str) -> List[str]:
    """
    Get courses that fulfill a specific requirement
    
    Args:
        requirement_id: UUID of the requirement
    
    Returns:
        List of course codes
    """
    response = supabase.table('requirement_fulfillments').select(
        'course_code'
    ).eq('requirement_id', requirement_id).execute()
    
    if response.data:
        return [f['course_code'] for f in response.data]
    
    return []


def recommend_courses(user_id: str, current_term: str = None) -> Dict[str, Any]:
    """
    Generate course recommendations for a user
    
    Args:
        user_id: User ID from Supabase
        current_term: Optional override for 'fall' or 'spring'
    
    Returns:
        Dictionary with recommendations
    """
    # Get user preferences
    pref_response = supabase.table('user_preferences').select('*').eq('user_id', user_id).execute()
    
    if not pref_response.data:
        return {'error': 'User preferences not found'}
    
    prefs = pref_response.data[0]
    major = prefs.get('major')
    # Try both possible column names
    graduation_year = prefs.get('expected_graduation_year') or prefs.get('expected_graduation')
    # Handle if it's a string
    if isinstance(graduation_year, str):
        try:
            graduation_year = int(graduation_year)
        except:
            pass
    courses_taken = prefs.get('courses_taken', []) or []
    
    if not major or not graduation_year:
        return {'error': 'Major or graduation year not set'}
    
    # Calculate current semester
    semester, year, term = calculate_current_semester(graduation_year, current_term)
    
    print(f"\n📚 Generating recommendations for:")
    print(f"   Major: {major}")
    print(f"   Graduation Year: {graduation_year}")
    print(f"   Current Semester: {semester} ({term}, Year {year})")
    print(f"   Courses Taken: {len(courses_taken)} courses")
    
    # Get requirements for this semester
    requirements = get_degree_requirements(major, year, term)
    
    if not requirements:
        return {'error': f'No requirements found for {major}, Year {year}, {term}'}
    
    recommendations = []
    fulfilled_requirements = []
    total_credits_needed = 0
    total_credits_fulfilled = 0
    
    # Normalize course codes for comparison (case-insensitive, done once)
    courses_taken_normalized = [c.strip().upper() for c in courses_taken if c]
    
    for req in requirements:
        req_name = req.get('requirement_name', '')
        req_id = req.get('id')
        credits = req.get('credits', 0)
        critical = req.get('critical', False)
        is_gened = 'gened' in req_name.lower() or 'gen ed' in req_name.lower()
        is_supplemental = 'supplemental' in req_name.lower()
        
        # Get fulfilling courses
        fulfilling_courses = get_fulfilling_courses(req_id)
        
        # Normalize fulfilling courses for comparison (case-insensitive)
        fulfilling_courses_normalized = {c.strip().upper(): c for c in fulfilling_courses if c}
        
        # Check if student has already taken a course that fulfills this requirement
        taken_courses_fulfilling = []
        for taken_course in courses_taken_normalized:
            if taken_course in fulfilling_courses_normalized:
                # Get the original case version
                original_course = fulfilling_courses_normalized[taken_course]
                taken_courses_fulfilling.append(original_course)
        
        if taken_courses_fulfilling:
            # Requirement is already fulfilled!
            fulfilled_requirements.append({
                'requirement_name': req_name,
                'requirement_id': req_id,
                'credits_required': credits,
                'critical': critical,
                'fulfilled_by': taken_courses_fulfilling,
                'status': 'fulfilled'
            })
            total_credits_fulfilled += float(credits)
            continue  # Skip this requirement - already fulfilled
        
        # If no fulfilling courses in requirement_fulfillments, try other methods
        if not fulfilling_courses:
            if is_gened:
                # Get GenEd courses (ranked by GPA)
                fulfilling_courses = get_gened_courses(req_name, limit=10, rank_by_gpa=True)
            elif is_supplemental:
                # Get courses ranked by GPA (not random)
                fulfilling_courses = get_random_courses(limit=5, exclude=courses_taken, rank_by_gpa=True)
        
        # Check again if any of these courses were taken (case-insensitive)
        fulfilling_courses_normalized = {c.strip().upper(): c for c in fulfilling_courses if c}
        taken_courses_fulfilling = []
        for taken_course in courses_taken_normalized:
            if taken_course in fulfilling_courses_normalized:
                original_course = fulfilling_courses_normalized[taken_course]
                taken_courses_fulfilling.append(original_course)
        
        if taken_courses_fulfilling:
            # Requirement is fulfilled by courses from alternative source
            fulfilled_requirements.append({
                'requirement_name': req_name,
                'requirement_id': req_id,
                'credits_required': credits,
                'critical': critical,
                'fulfilled_by': taken_courses_fulfilling,
                'status': 'fulfilled'
            })
            total_credits_fulfilled += float(credits)
            continue
        
        # Filter out courses already taken (case-insensitive)
        available_courses = []
        for course in fulfilling_courses:
            course_normalized = course.strip().upper() if course else ''
            if course_normalized not in courses_taken_normalized:
                available_courses.append(course)
        
        if available_courses:
            # Rank courses by GPA (highest first)
            ranked_courses = rank_courses_by_gpa(available_courses)
            # Get top 5 courses by GPA
            top_courses = [course_code for course_code, gpa in ranked_courses[:5]]
            
            # Get GPA stats for display
            gpa_stats = get_course_gpa_stats(top_courses)
            
            total_credits_needed += float(credits)
            recommendations.append({
                'requirement_name': req_name,
                'requirement_id': req_id,
                'credits_required': credits,
                'critical': critical,
                'available_courses': top_courses,  # Already ranked by GPA
                'total_available': len(available_courses),
                'gpa_stats': gpa_stats,  # Include GPA stats for display
                'status': 'pending'
            })
    
    # Sort by critical first, then by requirement name
    recommendations.sort(key=lambda x: (not x['critical'], x['requirement_name']))
    
    # Calculate total credits for the semester
    total_semester_credits = sum(float(r.get('credits', 0)) for r in requirements)
    remaining_credits = total_semester_credits - total_credits_fulfilled
    
    # If student has low credits (< 12, which is typically full-time minimum), suggest additional courses
    suggested_optional_courses = []
    credit_gap = 12 - remaining_credits  # How many credits short of full-time
    
    if credit_gap > 0:
        # Priority 1: Suggest GenEd courses that aren't fulfilled yet (already ranked by GPA)
        gened_reqs = [r for r in recommendations if 'gened' in r['requirement_name'].lower() or 'gen ed' in r['requirement_name'].lower()]
        if gened_reqs:
            for gened_req in gened_reqs[:2]:  # Up to 2 GenEd requirements
                if gened_req['available_courses']:
                    # Courses are already ranked by GPA, take top ones
                    suggested_optional_courses.extend(gened_req['available_courses'][:2])
                    credit_gap -= float(gened_req.get('credits_required', 0))
                    if credit_gap <= 0:
                        break
        
        # Priority 2: If still need credits, suggest supplemental courses (already ranked by GPA)
        if credit_gap > 0:
            supplemental_reqs = [r for r in recommendations if 'supplemental' in r['requirement_name'].lower()]
            if supplemental_reqs:
                for supp_req in supplemental_reqs[:1]:  # Up to 1 supplemental requirement
                    if supp_req['available_courses']:
                        # Courses are already ranked by GPA, take top ones
                        suggested_optional_courses.extend(supp_req['available_courses'][:2])
                        credit_gap -= float(supp_req.get('credits_required', 0))
                        if credit_gap <= 0:
                            break
        
        # Priority 3: If still need credits, suggest courses from next semester(s) that can be taken early
        if credit_gap > 0:
            # Check if we've already suggested GenEd/Supplemental, or if all current requirements are fulfilled
            if len(recommendations) == 0 or credit_gap > 3:  # All fulfilled OR still need 3+ credits
                future_courses = get_future_semester_courses(major, year, term, courses_taken_normalized, limit=5)
                # Only add courses not already suggested
                for fc in future_courses[:3]:
                    if fc not in suggested_optional_courses:
                        suggested_optional_courses.append(fc)
                        if len(suggested_optional_courses) >= 5:  # Limit total suggestions
                            break
    
    return {
        'user_id': user_id,
        'major': major,
        'graduation_year': graduation_year,
        'current_semester': semester,
        'current_year': year,
        'current_term': term,
        'courses_taken': courses_taken,
        'recommendations': recommendations,
        'fulfilled_requirements': fulfilled_requirements,
        'total_requirements': len(requirements),
        'recommendations_count': len(recommendations),
        'fulfilled_count': len(fulfilled_requirements),
        'total_credits_needed': total_credits_needed,
        'total_credits_fulfilled': total_credits_fulfilled,
        'total_semester_credits': total_semester_credits,
        'remaining_credits': remaining_credits,
        'suggested_optional_courses': suggested_optional_courses,
        'credit_gap': max(0, 12 - remaining_credits)  # How many credits short of full-time
    }


def print_recommendations(result: Dict[str, Any]):
    """Pretty print recommendations"""
    if 'error' in result:
        print(f"\n❌ Error: {result['error']}")
        return
    
    print(f"\n{'='*60}")
    print(f"COURSE RECOMMENDATIONS")
    print(f"{'='*60}")
    print(f"Major: {result['major']}")
    print(f"Current Semester: {result['current_semester']} ({result['current_term']}, Year {result['current_year']})")
    print(f"Courses Already Taken: {len(result['courses_taken'])}")
    if result['courses_taken']:
        print(f"  {', '.join(result['courses_taken'])}")
    
    print(f"\nTotal Requirements: {result['total_requirements']}")
    print(f"✅ Fulfilled: {result.get('fulfilled_count', 0)}")
    print(f"📋 Pending: {result['recommendations_count']}")
    if result.get('total_credits_fulfilled', 0) > 0:
        print(f"Credits Fulfilled: {result['total_credits_fulfilled']}")
    if result.get('total_credits_needed', 0) > 0:
        print(f"Credits Still Needed: {result['total_credits_needed']}")
    
    # Show fulfilled requirements first
    if result.get('fulfilled_requirements'):
        print(f"\n{'─'*60}")
        print("✅ ALREADY FULFILLED REQUIREMENTS:")
        print(f"{'─'*60}\n")
        
        for i, fulfilled in enumerate(result['fulfilled_requirements'], 1):
            critical_marker = "⭐ CRITICAL" if fulfilled['critical'] else "   Optional"
            print(f"{i}. {fulfilled['requirement_name']} {critical_marker}")
            print(f"   Credits: {fulfilled['credits_required']}")
            print(f"   Fulfilled by: {', '.join(fulfilled['fulfilled_by'])}")
            
            # Get course names
            for course_code in fulfilled['fulfilled_by']:
                course_response = supabase.table('courses').select('course_name').eq(
                    'course_code', course_code
                ).execute()
                course_name = course_response.data[0]['course_name'] if course_response.data else 'N/A'
                print(f"      • {course_code}: {course_name}")
            print()
    
    print(f"\n{'─'*60}")
    print("📋 RECOMMENDED COURSES (NOT YET FULFILLED):")
    print(f"{'─'*60}\n")
    
    if not result['recommendations']:
        print("   All requirements for this semester are already fulfilled! 🎉\n")
    else:
        for i, rec in enumerate(result['recommendations'], 1):
            critical_marker = "⭐ CRITICAL" if rec['critical'] else "   Optional"
            print(f"{i}. {rec['requirement_name']} {critical_marker}")
            print(f"   Credits Required: {rec['credits_required']}")
            print(f"   Available Courses ({rec['total_available']} total):")
            
            for course_code in rec['available_courses']:
                # Get course name
                course_response = supabase.table('courses').select('course_name').eq(
                    'course_code', course_code
                ).execute()
                
                course_name = course_response.data[0]['course_name'] if course_response.data else 'N/A'
                
                # Show GPA if available
                gpa_info = ""
                if rec.get('gpa_stats'):
                    course_normalized = course_code.strip().upper()
                    stats = rec['gpa_stats'].get(course_normalized, {})
                    if stats:
                        avg_gpa = stats.get('avg_gpa')
                        best_instructor = stats.get('best_instructor')
                        best_instructor_gpa = stats.get('best_instructor_gpa')
                        
                        if best_instructor_gpa and best_instructor:
                            gpa_info = f" [GPA: {best_instructor_gpa:.2f} with {best_instructor}]"
                        elif avg_gpa:
                            gpa_info = f" [GPA: {avg_gpa:.2f} avg]"
                
                print(f"      • {course_code}: {course_name}{gpa_info}")
            
            print()
    
    # Show credit summary and optional suggestions
    remaining_credits = result.get('remaining_credits', 0)
    credit_gap = result.get('credit_gap', 0)
    
    if remaining_credits > 0 or credit_gap > 0:
        print(f"\n{'─'*60}")
        print(f"📊 CREDIT SUMMARY:")
        print(f"{'─'*60}")
        print(f"Total Semester Credits: {result.get('total_semester_credits', 0)}")
        print(f"Credits Fulfilled: {result.get('total_credits_fulfilled', 0)}")
        print(f"Credits Still Needed: {result.get('remaining_credits', 0)}")
        
        if credit_gap > 0:
            print(f"⚠️  Credit Gap: {credit_gap} credits short of full-time status (12 credits)")
        
        if result.get('suggested_optional_courses'):
            print(f"\n💡 SUGGESTED ADDITIONAL COURSES (to reach full-time status):")
            print(f"   Priority: GenEd → Supplemental → Future Semester Courses")
            
            for course_code in result['suggested_optional_courses']:
                course_response = supabase.table('courses').select('course_name, credits').eq(
                    'course_code', course_code
                ).execute()
                if course_response.data:
                    course_name = course_response.data[0].get('course_name', 'N/A')
                    credits = course_response.data[0].get('credits', 'N/A')
                    print(f"   • {course_code}: {course_name} ({credits} credits)")
        elif credit_gap > 0:
            print(f"\n💡 Consider taking additional courses to reach full-time status (12 credits)")
            print(f"   Options: GenEd courses, supplemental credits, or courses from future semesters")
        print()


def list_all_users():
    """List all users with their emails and majors"""
    print("\n📋 Fetching users...")
    
    try:
        # Get all user preferences
        pref_response = supabase.table('user_preferences').select('*').execute()
    except Exception as e:
        print(f"❌ Error fetching users: {e}")
        print("\n⚠️  This is likely an RLS (Row Level Security) issue.")
        print("   Solutions:")
        print("   1. Add SUPABASE_SERVICE_ROLE_KEY to .env.local")
        print("      (Get it from Supabase Dashboard → Settings → API → service_role key)")
        print("   2. Or temporarily disable RLS for user_preferences table")
        return []
    
    if not pref_response.data:
        print("No users found in user_preferences table")
        print("\n💡 Tip: If you know users exist, this might be an RLS issue.")
        print("   Add SUPABASE_SERVICE_ROLE_KEY to .env.local to bypass RLS.")
        return []
    
    # Get emails from profiles
    user_ids = [p['user_id'] for p in pref_response.data]
    profiles_response = supabase.table('profiles').select('user_id, email, full_name').in_('user_id', user_ids).execute()
    
    # Create a map of user_id to email
    email_map = {p['user_id']: p.get('email', 'N/A') for p in profiles_response.data}
    name_map = {p['user_id']: p.get('full_name', 'N/A') for p in profiles_response.data}
    
    users = []
    for pref in pref_response.data:
        user_id = pref.get('user_id')
        if not user_id:
            continue
        # Try both possible column names for graduation year
        grad_year = pref.get('expected_graduation_year') or pref.get('expected_graduation', 'N/A')
        users.append({
            'user_id': user_id,
            'email': email_map.get(user_id, 'N/A'),
            'name': name_map.get(user_id, 'N/A'),
            'major': pref.get('major', 'N/A'),
            'graduation_year': grad_year
        })
    
    return users


def find_user_by_email(email: str) -> Optional[str]:
    """Find user_id by email"""
    profile_response = supabase.table('profiles').select('user_id').eq('email', email).execute()
    
    if profile_response.data:
        return profile_response.data[0]['user_id']
    
    return None


def main():
    """Main function to run the recommender"""
    import sys
    
    user_id = None
    current_term = None
    
    # Parse command line arguments
    if len(sys.argv) > 1:
        arg = sys.argv[1]
        
        # Check if it's an email
        if '@' in arg:
            user_id = find_user_by_email(arg)
            if not user_id:
                print(f"❌ No user found with email: {arg}")
                return
        # Check if it's a UUID (contains dashes)
        elif '-' in arg and len(arg) > 20:
            user_id = arg
        # Otherwise, treat as email or show help
        else:
            print(f"❌ Invalid user identifier: {arg}")
            print("   Use email (e.g., user@example.com) or UUID")
            return
        
        if len(sys.argv) > 2:
            current_term = sys.argv[2]
    else:
        # Interactive mode - list users and let them choose
        print("👥 Available Users:\n")
        users = list_all_users()
        
        if not users:
            print("No users found. Please create a user first.")
            return
        
        print(f"{'#':<4} {'Email':<30} {'Name':<20} {'Major':<25} {'Grad Year':<10}")
        print("-" * 90)
        
        for i, user in enumerate(users, 1):
            print(f"{i:<4} {user['email']:<30} {user['name']:<20} {user['major']:<25} {user['graduation_year']:<10}")
        
        print("\n" + "-" * 90)
        choice = input("\nEnter user number, email, or 'q' to quit: ").strip()
        
        if choice.lower() == 'q':
            return
        
        # Try to parse as number
        try:
            user_num = int(choice)
            if 1 <= user_num <= len(users):
                user_id = users[user_num - 1]['user_id']
            else:
                print("❌ Invalid user number")
                return
        except ValueError:
            # Try as email
            user_id = find_user_by_email(choice)
            if not user_id:
                print(f"❌ No user found with email: {choice}")
                return
        
        # Ask for term if not specified
        term_choice = input("Enter term (fall/spring) or press Enter for current term: ").strip().lower()
        if term_choice in ['fall', 'spring']:
            current_term = term_choice
    
    if not user_id:
        print("❌ No user selected")
        return
    
    result = recommend_courses(user_id, current_term)
    print_recommendations(result)


if __name__ == '__main__':
    main()

