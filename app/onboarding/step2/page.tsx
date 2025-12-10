'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

interface Course {
  course_code: string
  course_name: string
}

export default function OnboardingStep2() {
  const router = useRouter()
  const [courseInput, setCourseInput] = useState('')
  const [courses, setCourses] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [allCourses, setAllCourses] = useState<Course[]>([])
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([])
  const [showDropdown, setShowDropdown] = useState(false)
  const [loadingCourses, setLoadingCourses] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [user, setUser] = useState<any>(null)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null)

  useEffect(() => {
    // Get current user
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()

    // Check if we have data from previous steps
    const major = sessionStorage.getItem('onboarding_major')
    const graduationYear = sessionStorage.getItem('onboarding_graduation_year')
    
    if (!major || !graduationYear) {
      // Redirect to step 1 if missing data
      router.push('/onboarding/step1')
    }
  }, [router])

  useEffect(() => {
    // Fetch all courses from Supabase
    const fetchCourses = async () => {
      try {
        setLoadingCourses(true)
        // Fetch in batches since there might be many courses
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

          // Safety limit - stop after 10k courses
          if (allCoursesData.length >= 10000) break
        }

        setAllCourses(allCoursesData)
        setFilteredCourses(allCoursesData)
      } catch (error: any) {
        console.error('Error fetching courses:', error)
        setError('Failed to load courses. Please refresh the page.')
      } finally {
        setLoadingCourses(false)
      }
    }

    fetchCourses()
  }, [])

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

    // Validate that the course exists in the database
    const courseExists = allCourses.some(
      c => c.course_code.toLowerCase() === trimmedInput.toLowerCase()
    )

    if (!courseExists) {
      setError(`"${trimmedInput}" is not a valid course. Please select from the dropdown.`)
      return
    }

    // Find the exact course code (case-insensitive match)
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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type - accept images and PDFs
    const isImage = file.type.startsWith('image/')
    const isPDF = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')
    
    if (!isImage && !isPDF) {
      setError('Please upload an image file or PDF')
      return
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('Image file is too large. Please use an image under 10MB.')
      return
    }

    setUploadingImage(true)
    setError(null)
    setUploadSuccess(null)

    try {
      const formData = new FormData()
      formData.append('image', file)

      console.log('📤 Uploading image to analyze-transcript API...', {
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type
      })

      const response = await fetch('/api/analyze-transcript', {
        method: 'POST',
        body: formData,
      })

      console.log('📥 Received response:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok
      })

      const data = await response.json()
      
      console.log('📦 Response data:', {
        success: data.success,
        coursesCount: data.courses?.length || 0,
        invalidCoursesCount: data.invalidCourses?.length || 0,
        error: data.error,
        message: data.message,
        debug: data.debug
      })

      if (!response.ok) {
        console.error('❌ API returned error status:', {
          status: response.status,
          error: data.error,
          message: data.message
        })
        throw new Error(data.message || data.error || 'Failed to analyze image')
      }

      if (!data.success) {
        setError(data.message || 'Failed to extract courses from image')
        return
      }

      // Add extracted courses to the list (avoid duplicates)
      const newCourses = data.courses || []
      // Normalize existing courses to uppercase for comparison
      const existingCoursesUpper = courses.map(c => c.toUpperCase())
      // Filter out duplicates (case-insensitive) and normalize to original case from database
      const uniqueNewCourses = newCourses.filter(
        (code: string) => !existingCoursesUpper.includes(code.toUpperCase())
      )

      if (uniqueNewCourses.length === 0) {
        if (data.courses && data.courses.length > 0) {
          setUploadSuccess('No new courses found. All courses from the image are already added.')
        } else {
          setError('No valid courses were found in the image. Please ensure you screenshot from the SIS plan page showing your completed courses.')
        }
        return
      }

      setCourses([...courses, ...uniqueNewCourses])
      
      // Save grades to localStorage for GPA calculator
      if (data.courseGrades && Object.keys(data.courseGrades).length > 0) {
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          const gradesKey = `gpaGrades_${user.id}`
          const savedGrades = localStorage.getItem(gradesKey)
          const gradesMap: { [key: string]: string } = savedGrades ? JSON.parse(savedGrades) : {}
          
          // Add new grades (only non-null grades)
          Object.entries(data.courseGrades).forEach(([courseCode, grade]) => {
            if (grade && uniqueNewCourses.includes(courseCode)) {
              gradesMap[courseCode] = grade
            }
          })
          
          localStorage.setItem(gradesKey, JSON.stringify(gradesMap))
          console.log('💾 Saved grades to localStorage:', gradesMap)
        }
      }
      
      // Build success message with details
      let successMsg = `Successfully added ${uniqueNewCourses.length} course${uniqueNewCourses.length > 1 ? 's' : ''}!`
      if (data.courseGrades && Object.keys(data.courseGrades).filter(g => g).length > 0) {
        const gradesCount = Object.values(data.courseGrades).filter(g => g !== null).length
        successMsg += ` ${gradesCount} grade${gradesCount !== 1 ? 's' : ''} automatically added to GPA calculator.`
      }
      if (data.debug) {
        successMsg += ` (Extracted ${data.debug.extractedCount}, found ${data.debug.validCount} valid)`
      }
      setUploadSuccess(successMsg)

      // Show warning if there were invalid courses
      if (data.invalidCourses && data.invalidCourses.length > 0) {
        setTimeout(() => {
          setError(
            `Note: ${data.invalidCourses.length} course${data.invalidCourses.length > 1 ? 's' : ''} from the image were not found in our database: ${data.invalidCourses.join(', ')}. These courses may not be in our system yet.`
          )
        }, 3000)
      }
    } catch (error: any) {
      console.error('Error uploading image:', error)
      setError(error.message || 'Failed to analyze image. Please try again.')
    } finally {
      setUploadingImage(false)
      // Reset file input
      e.target.value = ''
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addCourse()
    }
  }

  const handleContinue = async () => {
    console.log('🚀 Continue button clicked')
    setLoading(true)
    setError(null)

    try {
      console.log('📋 Current state:', { 
        coursesCount: courses.length, 
        allCoursesCount: allCourses.length,
        hasUser: !!user 
      })

      // Get current user (try state first, then fetch if needed)
      let currentUser = user
      if (!currentUser) {
        console.log('👤 User not in state, fetching...')
        const { data: { user: fetchedUser }, error: userError } = await supabase.auth.getUser()
        if (userError || !fetchedUser) {
          console.error('❌ User fetch error:', userError)
          throw new Error('You must be logged in to continue. Please refresh the page.')
        }
        currentUser = fetchedUser
        setUser(fetchedUser)
        console.log('✅ User fetched:', currentUser.id)
      } else {
        console.log('✅ User already in state:', currentUser.id)
      }

      // Validate all courses before continuing (case-insensitive, with whitespace normalization)
      // Note: Courses from transcript scanner are already validated by the API
      const invalidCourses = courses.filter(course => {
        const normalizedCourse = course.toUpperCase().trim().replace(/\s+/g, ' ')
        return !allCourses.some(c => {
          const normalizedDb = c.course_code.toUpperCase().trim().replace(/\s+/g, ' ')
          return normalizedDb === normalizedCourse
        })
      })

      if (invalidCourses.length > 0) {
        console.warn('⚠️ Invalid courses detected:', invalidCourses)
        console.log('🔍 Checking if these courses exist with different formatting...')
        
        // Try to find matches with different formatting
        for (const invalidCourse of invalidCourses) {
          const normalizedInvalid = invalidCourse.toUpperCase().trim().replace(/\s+/g, ' ')
          const similarCourses = allCourses.filter(c => {
            const normalizedDb = c.course_code.toUpperCase().trim().replace(/\s+/g, ' ')
            return normalizedDb.includes(normalizedInvalid) || normalizedInvalid.includes(normalizedDb)
          })
          if (similarCourses.length > 0) {
            console.log(`💡 Found similar courses for "${invalidCourse}":`, similarCourses.map(c => c.course_code))
          }
        }
        
        // Show error but allow user to proceed if they want (since courses from API are already validated)
        const errorMsg = `Warning: Some courses may not be in our database: ${invalidCourses.join(', ')}. You can still continue, but these courses may not be used in recommendations.`
        console.warn(errorMsg)
        // Don't block - just warn. Courses from transcript scanner are already validated.
        // setError(errorMsg)
        // setLoading(false)
        // return
      }

      const major = sessionStorage.getItem('onboarding_major')
      const graduationYear = sessionStorage.getItem('onboarding_graduation_year')

      console.log('📝 Onboarding data:', { major, graduationYear })

      if (!major || !graduationYear) {
        console.error('❌ Missing onboarding data')
        setError('Missing onboarding data. Redirecting to step 1...')
        setTimeout(() => router.push('/onboarding/step1'), 1000)
        setLoading(false)
        return
      }

      console.log('💾 Saving preferences to database...')
      // Insert or update user preferences
      const { data: upsertData, error: upsertError } = await supabase
        .from('user_preferences')
        .upsert({
          id: currentUser.id,
          user_id: currentUser.id,
          major: major,
          expected_graduation_year: parseInt(graduationYear),
          courses_taken: courses,
          onboarding_completed: true,
        })
        .select()

      if (upsertError) {
        console.error('❌ Supabase error:', upsertError)
        throw new Error(upsertError.message || 'Failed to save preferences')
      }

      console.log('✅ Preferences saved:', upsertData)

      // Clear session storage
      sessionStorage.removeItem('onboarding_major')
      sessionStorage.removeItem('onboarding_graduation_year')

      console.log('🔄 Redirecting to /home...')
      // Redirect to landing page - use window.location as fallback
      try {
        router.push('/home')
        console.log('✅ Router.push called')
        // Fallback: if router doesn't work, use window.location after a short delay
        setTimeout(() => {
          if (window.location.pathname === '/onboarding/step2') {
            console.log('⚠️ Router.push may have failed, using window.location')
            window.location.href = '/home'
          }
        }, 1000)
      } catch (navError) {
        console.error('❌ Navigation error:', navError)
        window.location.href = '/home'
      }
    } catch (error: any) {
      console.error('❌ Error in handleContinue:', error)
      setError(error.message || 'Failed to save preferences. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="mb-8">
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="w-16 h-1.5 bg-red-600 rounded"></div>
          <div className="w-16 h-1.5 bg-red-600 rounded"></div>
        </div>
        <p className="text-gray-700 text-sm text-center">Step 2 of 2</p>
      </div>

      <div className="max-w-md w-full space-y-8 bg-gray-50 rounded-lg shadow-xl p-8 border border-gray-200">
        <div className="flex justify-start mb-4">
          <button
            onClick={() => router.back()}
            className="text-gray-600 hover:text-gray-800"
          >
            ← Back
          </button>
        </div>

        <div>
          <h2 className="text-3xl font-extrabold text-gray-900">
            Add Your Courses
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Add any courses you've completed to help us recommend better options.
          </p>
        </div>

        {error && (
          <div className="rounded-md bg-red-50 p-4">
            <div className="text-sm text-red-800">{error}</div>
          </div>
        )}

        {uploadSuccess && (
          <div className="rounded-md bg-green-50 p-4">
            <div className="text-sm text-green-800">{uploadSuccess}</div>
          </div>
        )}

        <div className="relative">
          <label htmlFor="course" className="block text-sm font-medium text-gray-700">
            Completed Courses
          </label>
          <div className="mt-1 flex gap-2">
            <div className="flex-1 relative">
              <input
                id="course"
                name="course"
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
                  // Delay to allow click on dropdown item
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
              type="button"
              onClick={addCourse}
              disabled={loadingCourses}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add
            </button>
          </div>
        </div>

        {courses.length > 0 && (
          <div>
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

        {/* Quick Upload Option */}
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <div className="flex items-start gap-3 mb-3">
            <div className="flex-shrink-0">
              <svg
                className="w-6 h-6 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-purple-900 mb-1">Quick Upload Option</h3>
              <p className="text-sm text-purple-700 mb-3">
                Upload a screenshot or PDF of your unofficial transcript and our AI will automatically scan and add courses to your completed list!
              </p>
              <div className="bg-white rounded-md p-3 mb-3 border border-purple-200">
                <p className="text-xs text-gray-600 mb-2 font-medium">📸 Instructions:</p>
                <ol className="text-xs text-gray-600 space-y-1 list-decimal list-inside">
                  <li>Go to{' '}
                    <a
                      href="https://sisjee.iu.edu/sisigps-prd/web/igps/plan/full/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-600 hover:text-purple-800 underline"
                    >
                      https://sisjee.iu.edu/sisigps-prd/web/igps/plan/full/
                    </a>
                  </li>
                  <li>Take a screenshot or download your unofficial transcript as a PDF</li>
                  <li>Upload it below</li>
                </ol>
              </div>
              <label className="block">
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handleImageUpload}
                  disabled={uploadingImage}
                  className="hidden"
                  id="transcript-upload"
                />
                <span
                  className={`inline-flex items-center justify-center gap-2 w-full px-4 py-2 border-2 border-purple-300 border-dashed rounded-lg bg-white text-purple-700 hover:bg-purple-50 cursor-pointer transition-colors ${
                    uploadingImage ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {uploadingImage ? (
                    <>
                      <svg
                        className="animate-spin h-5 w-5 text-purple-600"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      <span>Analyzing image...</span>
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                        />
                      </svg>
                      <span>Upload Transcript (Screenshot or PDF)</span>
                    </>
                  )}
                </span>
              </label>
              <p className="text-xs text-gray-500 mt-2 text-center">
                Supports images and PDF files from phone or computer
              </p>
            </div>
          </div>
        </div>

        <p className="text-xs text-gray-500">
          You can skip this step if you prefer, but adding courses helps us make better recommendations.
        </p>

        <div>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              console.log('🔘 Button clicked')
              handleContinue()
            }}
            disabled={loading}
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            style={{ backgroundColor: '#dc2626' }}
            onMouseEnter={(e) => !loading && (e.currentTarget.style.backgroundColor = '#b91c1c')}
            onMouseLeave={(e) => !loading && (e.currentTarget.style.backgroundColor = '#dc2626')}
          >
            {loading ? 'Saving...' : 'Continue'}
          </button>
        </div>
      </div>
    </div>
  )
}
