'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'

const SAMPLE_COURSES = [
  'CSCI-C 211',
  'MATH-M 211',
  'ECON-E 201',
  'PSY-P 101',
  'BUS-K 201',
  'CSCI-C 200',
  'MATH-M 118',
  'ENG-W 131'
]

export default function OnboardingStep2() {
  const router = useRouter()
  const { user } = useAuth()
  const [courseInput, setCourseInput] = useState('')
  const [courses, setCourses] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Check if we have data from previous steps
    const major = sessionStorage.getItem('onboarding_major')
    const graduationYear = sessionStorage.getItem('onboarding_graduation_year')
    
    if (!major || !graduationYear || !user) {
      // Redirect to step 1 if missing data
      router.push('/onboarding/step1')
    }
  }, [user, router])

  const addCourse = () => {
    if (courseInput.trim() && !courses.includes(courseInput.trim())) {
      setCourses([...courses, courseInput.trim()])
      setCourseInput('')
    }
  }

  const removeCourse = (courseToRemove: string) => {
    setCourses(courses.filter(c => c !== courseToRemove))
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addCourse()
    }
  }

  const handleContinue = async () => {
    if (!user) return

    setLoading(true)

    try {
      const major = sessionStorage.getItem('onboarding_major')
      const graduationYear = sessionStorage.getItem('onboarding_graduation_year')

      if (!major || !graduationYear) {
        router.push('/onboarding/step1')
        return
      }

      // Insert or update user preferences
      const { error } = await supabase
        .from('user_preferences')
        .upsert({
          id: user.id,
          user_id: user.id,
          major: major,
          expected_graduation_year: parseInt(graduationYear),
          courses_taken: courses,
          onboarding_completed: true,
        })

      if (error) throw error

      // Clear session storage
      sessionStorage.removeItem('onboarding_major')
      sessionStorage.removeItem('onboarding_graduation_year')

      // Redirect to landing page
      router.push('/home')
    } catch (error: any) {
      console.error('Error saving preferences:', error)
      alert('Failed to save preferences: ' + error.message)
    } finally {
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

        <div>
          <label htmlFor="course" className="block text-sm font-medium text-gray-700">
            Completed Courses
          </label>
          <div className="mt-1 flex gap-2">
            <input
              id="course"
              name="course"
              type="text"
              className="flex-1 appearance-none relative block px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
              placeholder="Type a course name or code..."
              value={courseInput}
              onChange={(e) => setCourseInput(e.target.value)}
              onKeyPress={handleKeyPress}
              list="courses"
            />
            <datalist id="courses">
              {SAMPLE_COURSES.map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
            <button
              type="button"
              onClick={addCourse}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 text-sm"
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

        <p className="text-xs text-gray-500">
          You can skip this step if you prefer, but adding courses helps us make better recommendations.
        </p>

        <div>
          <button
            onClick={handleContinue}
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
