'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

interface Requirement {
  id: string
  year: number
  term: string
  requirement_name: string
  credits: number
  critical: boolean
  fulfilling_courses: string[]
  is_fulfilled: boolean
  fulfilled_by: string[]
}

interface SemesterData {
  year: number
  term: string
  requirements: Requirement[]
  total_credits: number
  completed_credits: number
}

interface UserPreferences {
  major: string | null
  expected_graduation_year: number | null
  courses_taken: string[] | null
}

export default function CourseProgress({ userId }: { userId: string }) {
  const [preferences, setPreferences] = useState<UserPreferences | null>(null)
  const [semesterData, setSemesterData] = useState<SemesterData[]>([])
  const [loading, setLoading] = useState(true)
  const [totalProgress, setTotalProgress] = useState({ completed: 0, total: 0, percentage: 0 })

  useEffect(() => {
    fetchData()
  }, [userId])

  const fetchData = async () => {
    try {
      // Fetch user preferences
      const { data: prefsData, error: prefsError } = await supabase
        .from('user_preferences')
        .select('major, expected_graduation_year, courses_taken')
        .eq('user_id', userId)
        .single()

      if (prefsError || !prefsData) {
        console.error('Error fetching preferences:', prefsError)
        setLoading(false)
        return
      }

      setPreferences(prefsData)

      if (!prefsData.major) {
        setLoading(false)
        return
      }

      // Get degree ID
      const { data: degreeData, error: degreeError } = await supabase
        .from('degrees')
        .select('id')
        .eq('major_name', prefsData.major)
        .single()

      if (degreeError || !degreeData) {
        console.error('Error fetching degree:', degreeError)
        setLoading(false)
        return
      }

      const degreeId = degreeData.id
      const coursesTaken = (prefsData.courses_taken || []).map(c => c.trim().toUpperCase())

      // Fetch all requirements for all semesters
      const { data: requirementsData, error: reqError } = await supabase
        .from('degree_requirements')
        .select('*')
        .eq('degree_id', degreeId)
        .order('year', { ascending: true })
        .order('term', { ascending: true })

      if (reqError || !requirementsData) {
        console.error('Error fetching requirements:', reqError)
        setLoading(false)
        return
      }

      // For each requirement, get fulfilling courses
      const requirementsWithFulfillments: Requirement[] = await Promise.all(
        requirementsData.map(async (req) => {
          const { data: fulfillmentsData } = await supabase
            .from('requirement_fulfillments')
            .select('course_code')
            .eq('requirement_id', req.id)

          const fulfillingCourses = (fulfillmentsData || []).map(f => f.course_code)
          
          // Check if requirement is fulfilled by any taken course
          const fulfilledBy = fulfillingCourses.filter(courseCode => {
            const normalized = courseCode.trim().toUpperCase()
            return coursesTaken.includes(normalized)
          })

          return {
            id: req.id,
            year: req.year,
            term: req.term,
            requirement_name: req.requirement_name,
            credits: parseFloat(req.credits) || 0,
            critical: req.critical || false,
            fulfilling_courses: fulfillingCourses,
            is_fulfilled: fulfilledBy.length > 0,
            fulfilled_by: fulfilledBy
          }
        })
      )

      // Group by semester
      const semesterMap = new Map<string, SemesterData>()
      
      requirementsWithFulfillments.forEach(req => {
        const key = `${req.year}-${req.term}`
        if (!semesterMap.has(key)) {
          semesterMap.set(key, {
            year: req.year,
            term: req.term,
            requirements: [],
            total_credits: 0,
            completed_credits: 0
          })
        }
        
        const semester = semesterMap.get(key)!
        semester.requirements.push(req)
        semester.total_credits += req.credits
        if (req.is_fulfilled) {
          semester.completed_credits += req.credits
        }
      })

      // Convert to array and sort
      const semesters = Array.from(semesterMap.values()).sort((a, b) => {
        if (a.year !== b.year) return a.year - b.year
        return a.term === 'fall' ? -1 : 1
      })

      setSemesterData(semesters)

      // Calculate total progress
      const totalCompleted = semesters.reduce((sum, s) => sum + s.completed_credits, 0)
      const totalRequired = semesters.reduce((sum, s) => sum + s.total_credits, 0)
      const percentage = totalRequired > 0 ? (totalCompleted / totalRequired) * 100 : 0

      setTotalProgress({
        completed: totalCompleted,
        total: totalRequired,
        percentage: Math.round(percentage * 10) / 10
      })

    } catch (error) {
      console.error('Error in fetchData:', error)
    } finally {
      setLoading(false)
    }
  }

  const getSemesterLabel = (year: number, term: string) => {
    const termLabel = term === 'fall' ? 'Fall' : 'Spring'
    return `Year ${year}, ${termLabel}`
  }

  // Semester Card Component
  const SemesterCard = ({ semester }: { semester: SemesterData }) => {
    const semesterPercentage = semester.total_credits > 0
      ? (semester.completed_credits / semester.total_credits) * 100
      : 0

    return (
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-bold text-gray-900">
            {getSemesterLabel(semester.year, semester.term)}
          </h2>
          <div className="text-right">
            <div className="text-xl font-bold text-gray-900">
              {Math.round(semesterPercentage * 10) / 10}%
            </div>
            <p className="text-xs text-gray-600">
              {semester.completed_credits.toFixed(1)} / {semester.total_credits.toFixed(1)} credits
            </p>
          </div>
        </div>

        {/* Semester Progress Bar */}
        <div className="mb-4">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(semesterPercentage, 100)}%` }}
            />
          </div>
        </div>

        {/* Requirements */}
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {semester.requirements.map((req) => (
            <div
              key={req.id}
              className={`p-3 rounded-lg border ${
                req.is_fulfilled
                  ? 'bg-green-50 border-green-300'
                  : 'bg-gray-50 border-gray-200'
              }`}
            >
              <div className="flex items-start gap-2">
                {/* Checkbox Icon */}
                <div className="mt-0.5 flex-shrink-0">
                  {req.is_fulfilled ? (
                    <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  ) : (
                    <div className="w-5 h-5 rounded-full border-2 border-gray-400"></div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                    <h3 className="font-semibold text-gray-900 text-sm">{req.requirement_name}</h3>
                    {req.critical && (
                      <span className="px-1.5 py-0.5 bg-red-100 text-red-800 text-xs font-medium rounded flex-shrink-0">
                        CRITICAL
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 mb-1">
                    <p className="text-xs text-gray-600">
                      {req.is_fulfilled ? (
                        <span className="text-green-700 font-medium">
                          {req.fulfilled_by.length > 0 ? req.fulfilled_by[0] : 'Completed'}
                        </span>
                      ) : (
                        <span>{req.credits} credit{req.credits !== 1 ? 's' : ''} required</span>
                      )}
                    </p>
                    {req.is_fulfilled && (
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500 flex-shrink-0"></span>
                    )}
                    {!req.is_fulfilled && (
                      <span className="w-1.5 h-1.5 rounded-full bg-orange-500 flex-shrink-0"></span>
                    )}
                  </div>
                  {req.is_fulfilled && req.fulfilled_by.length > 0 && (
                    <div className="mt-1.5">
                      <p className="text-xs text-gray-600 mb-1">Fulfilled by:</p>
                      <div className="flex flex-wrap gap-1">
                        {req.fulfilled_by.map((course, i) => (
                          <span
                            key={i}
                            className="inline-flex items-center px-1.5 py-0.5 bg-green-200 text-green-800 rounded text-xs font-medium"
                          >
                            {course}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {!req.is_fulfilled && req.fulfilling_courses.length > 0 && (
                    <div className="mt-1.5">
                      <p className="text-xs text-gray-600 mb-1">Can be fulfilled by:</p>
                      <div className="flex flex-wrap gap-1">
                        {req.fulfilling_courses.slice(0, 3).map((course, i) => (
                          <span
                            key={i}
                            className="inline-flex items-center px-1.5 py-0.5 bg-gray-200 text-gray-700 rounded text-xs"
                          >
                            {course}
                          </span>
                        ))}
                        {req.fulfilling_courses.length > 3 && (
                          <span className="text-xs text-gray-500">
                            +{req.fulfilling_courses.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-gray-700">Loading course progress...</div>
      </div>
    )
  }

  if (!preferences || !preferences.major) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="bg-gray-50 rounded-lg shadow-lg p-8 max-w-md border border-gray-200">
          <p className="text-gray-700">Please complete onboarding to view your course progress.</p>
        </div>
      </div>
    )
  }

  const creditsRemaining = totalProgress.total - totalProgress.completed

  return (
    <div className="min-h-screen pb-20 bg-white">
      <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Degree Progress</h1>
          <p className="text-lg text-gray-600">Track your progress towards graduation</p>
        </div>

        {/* Overall Progress Card - Highlighted */}
        <div className="bg-red-600 rounded-xl shadow-lg p-6 mb-8 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 01.557 1.08l1.54 4.263a1 1 0 00.988 0l4.25-2.5a1 1 0 00.447-1.553l-4.457-4.457a1 1 0 00-.242-.33L11.25 3.75l.316-.158a.999.999 0 00-.617-1.667l-7-1.4z" />
              </svg>
              <div>
                <h2 className="text-2xl font-bold">Overall Progress</h2>
                <p className="text-red-100">{preferences.major}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-5xl font-bold">{totalProgress.percentage}%</div>
            </div>
          </div>
          
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-red-100">
                {totalProgress.completed.toFixed(1)} / {totalProgress.total.toFixed(1)} credits
              </span>
              <span className="text-red-100">{creditsRemaining.toFixed(1)} credits remaining</span>
            </div>
            <div className="w-full bg-red-700 rounded-full h-4">
              <div
                className="bg-gray-900 h-4 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(totalProgress.percentage, 100)}%` }}
              />
            </div>
          </div>

          {preferences.expected_graduation_year && (
            <div className="text-red-100 text-sm">
              Expected graduation: {preferences.expected_graduation_year}
            </div>
          )}
        </div>

        {/* Semesters - Grid Layout: Fall and Spring side by side for each year */}
        <div className="space-y-4">
          {[1, 2, 3, 4].map((year) => {
            const fallSemester = semesterData.find(s => s.year === year && s.term === 'fall')
            const springSemester = semesterData.find(s => s.year === year && s.term === 'spring')
            
            // Only render if at least one semester exists
            if (!fallSemester && !springSemester) return null
            
            return (
              <div key={year} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Fall Semester */}
                {fallSemester && (
                  <SemesterCard semester={fallSemester} />
                )}
                {/* Spring Semester */}
                {springSemester && (
                  <SemesterCard semester={springSemester} />
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

