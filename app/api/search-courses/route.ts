import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const getSupabase = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Missing Supabase environment variables')
  }
  return createClient(supabaseUrl, supabaseServiceKey)
}

export async function POST(request: NextRequest) {
  try {
    const { searchQuery } = await request.json()

    if (!searchQuery || typeof searchQuery !== 'string') {
      return NextResponse.json(
        { error: 'Search query is required' },
        { status: 400 }
      )
    }

    const supabase = getSupabase()
    const query = searchQuery.trim().toLowerCase()

    // Get all unique courses (grouped by course_code) with their descriptions
    const { data: allCourses, error: coursesError } = await supabase
      .from('courses')
      .select('course_code, course_name, course_description')
      .not('course_code', 'is', null)
      .not('course_name', 'is', null)

    if (coursesError) {
      console.error('Error fetching courses:', coursesError)
      return NextResponse.json(
        { error: 'Failed to fetch courses' },
        { status: 500 }
      )
    }

    // Get unique courses (by course_code) and their best descriptions
    const courseMap = new Map<string, { course_code: string; course_name: string; course_description: string | null }>()
    
    if (allCourses) {
      for (const course of allCourses) {
        if (!courseMap.has(course.course_code)) {
          courseMap.set(course.course_code, {
            course_code: course.course_code,
            course_name: course.course_name,
            course_description: course.course_description || null
          })
        } else {
          // If we have a description for this course_code, keep it
          const existing = courseMap.get(course.course_code)!
          if (course.course_description && !existing.course_description) {
            existing.course_description = course.course_description
          }
        }
      }
    }

    // Get GPA data for all courses
    const uniqueCourseCodes = Array.from(courseMap.keys())
    const { data: gradeData, error: gradeError } = await supabase
      .from('grade_distributions')
      .select('course_code, avg_class_grade')
      .in('course_code', uniqueCourseCodes)
      .not('avg_class_grade', 'is', null)
      .limit(10000)

    // Calculate average GPA per course
    const gpaMap = new Map<string, number>()
    if (gradeData && !gradeError) {
      const gradesByCourse = new Map<string, number[]>()
      gradeData.forEach((g: any) => {
        if (!gradesByCourse.has(g.course_code)) {
          gradesByCourse.set(g.course_code, [])
        }
        const grade = parseFloat(g.avg_class_grade || 0)
        if (grade > 0) {
          gradesByCourse.get(g.course_code)!.push(grade)
        }
      })

      gradesByCourse.forEach((grades, courseCode) => {
        const avgGPA = grades.reduce((sum, g) => sum + g, 0) / grades.length
        gpaMap.set(courseCode, avgGPA)
      })
    }

    // First: Rank ALL courses (not just matching ones)
    // This creates a global ranking of all courses by GPA
    const allRankedCourses: Array<{
      course_code: string
      course_name: string
      course_description: string | null
      gpa: number
      globalRank: number
    }> = []

    for (const [courseCode, course] of courseMap.entries()) {
      const gpa = gpaMap.get(courseCode) || 0
      allRankedCourses.push({
        course_code: courseCode,
        course_name: course.course_name,
        course_description: course.course_description,
        gpa,
        globalRank: 0 // Will be set after sorting
      })
    }

    // Sort ALL courses by GPA (descending) to create global ranking
    allRankedCourses.sort((a, b) => (b.gpa || 0) - (a.gpa || 0))

    // Assign global ranks to all courses
    allRankedCourses.forEach((course, index) => {
      course.globalRank = index + 1
    })

    // Second: Filter courses that match the search query
    const matchingCourses: Array<{
      course_code: string
      course_name: string
      course_description: string | null
      gpa: number
      matchScore: number
      globalRank: number
    }> = []

    for (const rankedCourse of allRankedCourses) {
      const codeLower = rankedCourse.course_code.toLowerCase()
      const nameLower = rankedCourse.course_name.toLowerCase()
      const descLower = (rankedCourse.course_description || '').toLowerCase()

      // Calculate match score
      let matchScore = 0

      // Exact course code match (highest priority)
      if (codeLower === query) {
        matchScore = 1000
      }
      // Course code starts with query
      else if (codeLower.startsWith(query)) {
        matchScore = 500
      }
      // Course code contains query
      else if (codeLower.includes(query)) {
        matchScore = 300
      }
      // Course name starts with query
      else if (nameLower.startsWith(query)) {
        matchScore = 200
      }
      // Course name contains query
      else if (nameLower.includes(query)) {
        matchScore = 100
      }
      // Description contains query
      else if (descLower.includes(query)) {
        matchScore = 50
      }

      if (matchScore > 0) {
        matchingCourses.push({
          course_code: rankedCourse.course_code,
          course_name: rankedCourse.course_name,
          course_description: rankedCourse.course_description,
          gpa: rankedCourse.gpa,
          matchScore,
          globalRank: rankedCourse.globalRank
        })
      }
    }

    // Sort matching courses by match score (descending), then by GPA (descending)
    // But keep their globalRank from the full list
    matchingCourses.sort((a, b) => {
      if (b.matchScore !== a.matchScore) {
        return b.matchScore - a.matchScore
      }
      return (b.gpa || 0) - (a.gpa || 0)
    })

    // Return ranked results with position
    // totalCourses should be the total number of ALL courses, not just matching ones
    const totalCourses = allRankedCourses.length
    const rankedResults = matchingCourses.map((course) => ({
      course_code: course.course_code,
      course_name: course.course_name,
      course_description: course.course_description,
      gpa: course.gpa,
      rank: course.globalRank, // Use global rank from full list
      totalCourses
    }))

    return NextResponse.json({
      courses: rankedResults,
      total: totalCourses
    })

  } catch (error: any) {
    console.error('Error in search-courses API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

