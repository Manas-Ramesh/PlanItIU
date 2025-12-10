'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { User, Save, X } from 'lucide-react'

interface UserPreferences {
  major: string | null
  expected_graduation_year: number | null
  courses_taken: string[] | null
}

interface Course {
  course_code: string
  course_name: string
}

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [preferences, setPreferences] = useState<UserPreferences | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  
  // Form state
  const [major, setMajor] = useState('')
  const [graduationYear, setGraduationYear] = useState<number | null>(null)
  const [courses, setCourses] = useState<string[]>([])
  
  // Course selection state
  const [allCourses, setAllCourses] = useState<Course[]>([])
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([])
  const [courseInput, setCourseInput] = useState('')
  const [showDropdown, setShowDropdown] = useState(false)
  const [loadingCourses, setLoadingCourses] = useState(true)

  const GRADUATION_YEARS = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() + i)

  useEffect(() => {
    fetchUserAndPreferences()
    fetchAllCourses()
  }, [])

  const fetchUserAndPreferences = async () => {
    try {
      setLoading(true)
      
      // Get current user
      const { data: { user: currentUser }, error: userError } = await supabase.auth.getUser()
      if (userError || !currentUser) {
        router.push('/login')
        return
      }
      setUser(currentUser)

      // Fetch user preferences
      const { data: prefsData, error: prefsError } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', currentUser.id)
        .single()

      if (prefsError && prefsError.code !== 'PGRST116') {
        throw prefsError
      }

      if (prefsData) {
        setPreferences(prefsData)
        setMajor(prefsData.major || '')
        setGraduationYear(prefsData.expected_graduation_year || null)
        setCourses(prefsData.courses_taken || [])
      }
    } catch (error: any) {
      console.error('Error fetching user data:', error)
      setError('Failed to load profile data')
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
    } finally {
      setLoadingCourses(false)
    }
  }

  const handleMajorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setMajor(value)
    setError(null)
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

    if (exactCourse && !courses.includes(exactCourse.course_code)) {
      setCourses([...courses, exactCourse.course_code])
      setCourseInput('')
      setShowDropdown(false)
      setError(null)
    } else if (courses.includes(exactCourse?.course_code || '')) {
      setError('This course is already added.')
    }
  }

  const selectCourse = (courseCode: string) => {
    if (!courses.includes(courseCode)) {
      setCourses([...courses, courseCode])
      setCourseInput('')
      setShowDropdown(false)
      setError(null)
    } else {
      setError('This course is already added.')
    }
  }

  const removeCourse = (courseToRemove: string) => {
    setCourses(courses.filter(c => c !== courseToRemove))
  }

  const handleSave = async () => {
    if (!user) return

    setSaving(true)
    setError(null)
    setSuccess(null)

    try {
      // Validate major if provided
      if (major.trim()) {
        // Optionally validate against database
        const { data: majorsData } = await supabase
          .from('degrees')
          .select('major_name')
          .ilike('major_name', major.trim())
          .limit(1)

        if (majorsData && majorsData.length === 0) {
          setError('Please enter a valid major. You can leave it blank if unsure.')
          setSaving(false)
          return
        }
      }

      // Update user preferences
      const { data, error: updateError } = await supabase
        .from('user_preferences')
        .upsert({
          id: user.id,
          user_id: user.id,
          major: major.trim() || null,
          expected_graduation_year: graduationYear,
          courses_taken: courses,
          onboarding_completed: true,
        })
        .select()

      if (updateError) {
        throw updateError
      }

      setSuccess('Profile updated successfully! Changes will be reflected across the app.')
      setPreferences(data[0])
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000)
    } catch (error: any) {
      console.error('Error saving profile:', error)
      setError(error.message || 'Failed to save profile. Please try again.')
    } finally {
      setSaving(false)
    }
  }

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
            <User className="w-8 h-8 text-red-600" />
            <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
          </div>
          <p className="text-gray-600">Edit your information and preferences</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {error && (
          <div className="rounded-md bg-red-50 p-4 mb-4 border border-red-200">
            <div className="text-sm text-red-800">{error}</div>
          </div>
        )}

        {success && (
          <div className="rounded-md bg-green-50 p-4 mb-4 border border-green-200">
            <div className="text-sm text-green-800">{success}</div>
          </div>
        )}

        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 space-y-6">
          {/* Major */}
          <div>
            <label htmlFor="major" className="block text-sm font-medium text-gray-700 mb-2">
              Major
            </label>
            <input
              id="major"
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="Enter your major"
              value={major}
              onChange={handleMajorChange}
            />
          </div>

          {/* Graduation Year */}
          <div>
            <label htmlFor="graduationYear" className="block text-sm font-medium text-gray-700 mb-2">
              Expected Graduation Year
            </label>
            <select
              id="graduationYear"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              value={graduationYear || ''}
              onChange={(e) => setGraduationYear(e.target.value ? Number(e.target.value) : null)}
            >
              <option value="">Select graduation year</option>
              {GRADUATION_YEARS.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          {/* Courses */}
          <div>
            <label htmlFor="courses" className="block text-sm font-medium text-gray-700 mb-2">
              Completed Courses
            </label>
            <div className="relative">
              <input
                id="courses"
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder={loadingCourses ? "Loading courses..." : "Type a course name or code..."}
                value={courseInput}
                onChange={handleCourseInputChange}
                onFocus={() => {
                  if (courseInput.trim()) {
                    setShowDropdown(true)
                  }
                }}
                onBlur={() => {
                  setTimeout(() => setShowDropdown(false), 200)
                }}
                disabled={loadingCourses}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    addCourse()
                  }
                }}
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
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={addCourse}
              disabled={loadingCourses || !courseInput.trim()}
              className="mt-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add Course
            </button>

            {courses.length > 0 && (
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Your Courses:</p>
                <div className="flex flex-wrap gap-2">
                  {courses.map((course) => (
                    <span
                      key={course}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm"
                    >
                      {course}
                      <button
                        onClick={() => removeCourse(course)}
                        className="ml-1 text-red-600 hover:text-red-800"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Save Button */}
          <div className="flex justify-end pt-4 border-t border-gray-200">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {saving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
