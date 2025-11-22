'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Trash2, Plus, Calculator } from 'lucide-react'

interface Course {
  course_code: string
  course_name: string
}

interface CourseWithGrade {
  course_code: string
  course_name: string
  grade: string | null
}

const GRADE_POINTS: { [key: string]: number } = {
  'A+': 4.0,
  'A': 4.0,
  'A-': 3.7,
  'B+': 3.3,
  'B': 3.0,
  'B-': 2.7,
  'C+': 2.3,
  'C': 2.0,
  'C-': 1.7,
  'D+': 1.3,
  'D': 1.0,
  'D-': 0.7,
  'F': 0.0,
}

const GRADES = ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'D-', 'F']

export default function GPACalculator({ userId }: { userId: string }) {
  const [coursesWithGrades, setCoursesWithGrades] = useState<CourseWithGrade[]>([])
  const [allCourses, setAllCourses] = useState<Course[]>([])
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([])
  const [courseInput, setCourseInput] = useState('')
  const [showDropdown, setShowDropdown] = useState(false)
  const [loading, setLoading] = useState(true)
  const [loadingCourses, setLoadingCourses] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showAddCourse, setShowAddCourse] = useState(false)

  useEffect(() => {
    loadCoursesWithGrades()
    fetchAllCourses()
  }, [userId])

  const loadCoursesWithGrades = async () => {
    try {
      setLoading(true)
      // Load courses from user preferences
      const { data: prefsData, error: prefsError } = await supabase
        .from('user_preferences')
        .select('courses_taken')
        .eq('user_id', userId)
        .single()

      if (prefsError && prefsError.code !== 'PGRST116') {
        throw prefsError
      }

      const coursesTaken = prefsData?.courses_taken || []

      // Load saved grades from localStorage
      const gradesKey = `gpaGrades_${userId}`
      const savedGrades = localStorage.getItem(gradesKey)
      const gradesMap: { [key: string]: string } = savedGrades ? JSON.parse(savedGrades) : {}

      // Fetch course names for each course code
      if (coursesTaken.length > 0) {
        const { data: coursesData } = await supabase
          .from('courses')
          .select('course_code, course_name')
          .in('course_code', coursesTaken)

        const coursesMap = new Map<string, string>()
        if (coursesData) {
          coursesData.forEach((c: { course_code: string; course_name: string }) => {
            coursesMap.set(c.course_code, c.course_name)
          })
        }

        const coursesWithGradesData: CourseWithGrade[] = coursesTaken.map((code: string) => ({
          course_code: code,
          course_name: coursesMap.get(code) || code,
          grade: gradesMap[code] || null
        }))

        setCoursesWithGrades(coursesWithGradesData)
      } else {
        setCoursesWithGrades([])
      }
    } catch (error: any) {
      console.error('Error loading courses:', error)
      setError('Failed to load courses')
    } finally {
      setLoading(false)
    }
  }

  const fetchAllCourses = async () => {
    try {
      setLoadingCourses(true)
      let allCoursesData: Course[] = []
      let offset = 0
      const batchSize = 1000

      while (true) {
        const { data, error } = await supabase
          .from('courses')
          .select('course_code, course_name')
          .order('course_code')
          .range(offset, offset + batchSize - 1)

        if (error) throw error

        if (data && data.length > 0) {
          allCoursesData = [...allCoursesData, ...data]
          offset += batchSize
        } else {
          break
        }

        if (allCoursesData.length >= 10000) break
      }

      setAllCourses(allCoursesData)
      setFilteredCourses(allCoursesData)
    } catch (error: any) {
      console.error('Error fetching courses:', error)
      setError('Failed to load course list')
    } finally {
      setLoadingCourses(false)
    }
  }

  const handleCourseInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setCourseInput(value)
    setError(null)
    
    if (value.trim()) {
      const filtered = allCourses.filter(c => 
        c.course_code.toLowerCase().includes(value.toLowerCase()) ||
        c.course_name.toLowerCase().includes(value.toLowerCase())
      )
      setFilteredCourses(filtered)
      setShowDropdown(true)
    } else {
      setFilteredCourses(allCourses)
      setShowDropdown(false)
    }
  }

  const addCourse = () => {
    const trimmedInput = courseInput.trim()
    
    if (!trimmedInput) return

    const courseExists = allCourses.some(
      c => c.course_code.toLowerCase() === trimmedInput.toLowerCase()
    )

    if (!courseExists) {
      setError(`"${trimmedInput}" is not a valid course. Please select from the dropdown.`)
      return
    }

    const exactCourse = allCourses.find(
      c => c.course_code.toLowerCase() === trimmedInput.toLowerCase()
    )

    if (exactCourse && !coursesWithGrades.some(c => c.course_code === exactCourse.course_code)) {
      setCoursesWithGrades([...coursesWithGrades, {
        course_code: exactCourse.course_code,
        course_name: exactCourse.course_name,
        grade: null
      }])
      setCourseInput('')
      setShowDropdown(false)
      setError(null)
      setShowAddCourse(false)
    } else if (coursesWithGrades.some(c => c.course_code === exactCourse?.course_code)) {
      setError('This course is already added.')
    }
  }

  const selectCourse = (courseCode: string) => {
    const course = allCourses.find(c => c.course_code === courseCode)
    if (course && !coursesWithGrades.some(c => c.course_code === courseCode)) {
      setCoursesWithGrades([...coursesWithGrades, {
        course_code: course.course_code,
        course_name: course.course_name,
        grade: null
      }])
      setCourseInput('')
      setShowDropdown(false)
      setError(null)
      setShowAddCourse(false)
    } else if (coursesWithGrades.some(c => c.course_code === courseCode)) {
      setError('This course is already added.')
    }
  }

  const removeCourse = (courseCode: string) => {
    const updated = coursesWithGrades.filter(c => c.course_code !== courseCode)
    setCoursesWithGrades(updated)
    
    // Remove from localStorage
    const gradesKey = `gpaGrades_${userId}`
    const savedGrades = localStorage.getItem(gradesKey)
    if (savedGrades) {
      const gradesMap: { [key: string]: string } = JSON.parse(savedGrades)
      delete gradesMap[courseCode]
      localStorage.setItem(gradesKey, JSON.stringify(gradesMap))
    }
  }

  const updateGrade = (courseCode: string, grade: string) => {
    const updated = coursesWithGrades.map(c => 
      c.course_code === courseCode ? { ...c, grade } : c
    )
    setCoursesWithGrades(updated)

    // Save to localStorage
    const gradesKey = `gpaGrades_${userId}`
    const savedGrades = localStorage.getItem(gradesKey)
    const gradesMap: { [key: string]: string } = savedGrades ? JSON.parse(savedGrades) : {}
    gradesMap[courseCode] = grade
    localStorage.setItem(gradesKey, JSON.stringify(gradesMap))
  }

  const calculateGPA = (): number => {
    const coursesWithGradesOnly = coursesWithGrades.filter(c => c.grade !== null)
    
    if (coursesWithGradesOnly.length === 0) return 0

    const totalPoints = coursesWithGradesOnly.reduce((sum, c) => {
      return sum + (GRADE_POINTS[c.grade!] || 0)
    }, 0)

    return totalPoints / coursesWithGradesOnly.length
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addCourse()
    }
  }

  const gpa = calculateGPA()
  const coursesWithGradesCount = coursesWithGrades.filter(c => c.grade !== null).length

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-600">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3 mb-4">
            <Calculator className="w-8 h-8 text-red-600" />
            <h1 className="text-3xl font-bold text-gray-900">GPA Calculator</h1>
          </div>
          <p className="text-gray-600">Calculate your GPA based on completed courses</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* GPA Display */}
        <div className="bg-white border-2 border-red-600 rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium mb-1">Current GPA</p>
              <p className="text-5xl font-bold text-red-600">{gpa.toFixed(2)}</p>
              <p className="text-gray-500 text-sm mt-2">
                Based on {coursesWithGradesCount} course{coursesWithGradesCount !== 1 ? 's' : ''}
              </p>
            </div>
            <div className="text-right">
              <p className="text-gray-600 text-sm font-medium mb-1">Total Courses</p>
              <p className="text-3xl font-bold text-red-600">{coursesWithGrades.length}</p>
            </div>
          </div>
        </div>

        {error && (
          <div className="rounded-md bg-red-50 p-4 mb-4 border border-red-200">
            <div className="text-sm text-red-800">{error}</div>
          </div>
        )}

        {/* Add Course Button */}
        {!showAddCourse && (
          <button
            onClick={() => setShowAddCourse(true)}
            className="mb-4 flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add Course
          </button>
        )}

        {/* Add Course Form */}
        {showAddCourse && (
          <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Add Course</h3>
              <button
                onClick={() => {
                  setShowAddCourse(false)
                  setCourseInput('')
                  setError(null)
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
            <div className="relative">
              <input
                type="text"
                className="w-full appearance-none relative block px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                placeholder={loadingCourses ? "Loading courses..." : "Type a course name or code..."}
                value={courseInput}
                onChange={handleCourseInputChange}
                onKeyPress={handleKeyPress}
                onFocus={() => {
                  if (courseInput.trim()) {
                    setShowDropdown(true)
                  }
                }}
                onBlur={() => {
                  setTimeout(() => setShowDropdown(false), 200)
                }}
                disabled={loadingCourses}
              />
              {showDropdown && filteredCourses.length > 0 && (
                <div className="absolute z-20 mt-1 w-full bg-gray-800 rounded-md shadow-lg max-h-60 overflow-auto">
                  {filteredCourses.slice(0, 50).map((course) => (
                    <button
                      key={course.course_code}
                      type="button"
                      onClick={() => selectCourse(course.course_code)}
                      className="w-full text-left px-4 py-2 text-white hover:bg-gray-700 focus:bg-gray-700 focus:outline-none"
                    >
                      <div className="font-medium">{course.course_code}</div>
                      <div className="text-sm text-gray-300">{course.course_name}</div>
                    </button>
                  ))}
                  {filteredCourses.length > 50 && (
                    <div className="px-4 py-2 text-gray-400 text-sm">
                      Showing first 50 of {filteredCourses.length} results. Type more to narrow down.
                    </div>
                  )}
                </div>
              )}
              {showDropdown && filteredCourses.length === 0 && courseInput.trim() && (
                <div className="absolute z-20 mt-1 w-full bg-gray-800 rounded-md shadow-lg px-4 py-2 text-white">
                  No courses found matching "{courseInput}"
                </div>
              )}
            </div>
            <button
              onClick={addCourse}
              disabled={loadingCourses || !courseInput.trim()}
              className="mt-3 px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add
            </button>
          </div>
        )}

        {/* Courses List */}
        {coursesWithGrades.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <Calculator className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg mb-2">No courses added</p>
            <p className="text-gray-400 text-sm">Add courses from your completed courses or manually add new ones</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="divide-y divide-gray-200">
              {coursesWithGrades.map((course, index) => (
                <div
                  key={course.course_code}
                  className="px-6 py-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-semibold text-gray-900">{course.course_code}</h3>
                      <p className="text-sm text-gray-600 truncate">{course.course_name}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <select
                        value={course.grade || ''}
                        onChange={(e) => updateGrade(course.course_code, e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      >
                        <option value="">Select Grade</option>
                        {GRADES.map(grade => (
                          <option key={grade} value={grade}>{grade}</option>
                        ))}
                      </select>
                      <button
                        onClick={() => removeCourse(course.course_code)}
                        className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                        title="Remove course"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

