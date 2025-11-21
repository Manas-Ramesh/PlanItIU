'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

const GRADUATION_YEARS = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() + i)

interface Degree {
  major_name: string
  school: string
}

export default function OnboardingStep1() {
  const router = useRouter()
  const [major, setMajor] = useState('')
  const [graduationYear, setGraduationYear] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [majors, setMajors] = useState<Degree[]>([])
  const [filteredMajors, setFilteredMajors] = useState<Degree[]>([])
  const [showDropdown, setShowDropdown] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch majors from Supabase
    const fetchMajors = async () => {
      try {
        const { data, error } = await supabase
          .from('degrees')
          .select('major_name, school')
          .order('major_name')

        if (error) throw error

        if (data) {
          setMajors(data)
          setFilteredMajors(data)
        }
      } catch (error: any) {
        console.error('Error fetching majors:', error)
        setError('Failed to load majors. Please refresh the page.')
      } finally {
        setLoading(false)
      }
    }

    fetchMajors()
  }, [])

  const handleMajorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setMajor(value)
    
    if (value.trim()) {
      const filtered = majors.filter(m => 
        m.major_name.toLowerCase().includes(value.toLowerCase())
      )
      setFilteredMajors(filtered)
      setShowDropdown(true)
    } else {
      setFilteredMajors(majors)
      setShowDropdown(false)
    }
  }

  const selectMajor = (majorName: string) => {
    setMajor(majorName)
    setShowDropdown(false)
  }

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!major.trim()) {
      setError('Please enter your major')
      return
    }
    
    // Validate that the major exists in the database
    const majorExists = majors.some(m => m.major_name === major.trim())
    if (!majorExists) {
      setError('Please select a valid major from the list')
      return
    }
    
    if (!graduationYear) {
      setError('Please select your expected graduation year')
      return
    }

    // Store in sessionStorage to pass to next steps
    sessionStorage.setItem('onboarding_major', major.trim())
    sessionStorage.setItem('onboarding_graduation_year', graduationYear.toString())
    
    router.push('/onboarding/step2')
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="mb-8">
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="w-16 h-1.5 bg-red-600 rounded"></div>
          <div className="w-16 h-1.5 bg-gray-300 rounded"></div>
        </div>
        <p className="text-gray-700 text-sm text-center">Step 1 of 2</p>
      </div>

      <div className="max-w-md w-full space-y-8 bg-gray-50 rounded-lg shadow-xl p-8 border border-gray-200">
        <div>
          <h2 className="text-center text-3xl font-extrabold text-gray-900">
            Tell us about yourself
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Help us personalize your course recommendations
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleNext}>
          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="text-sm text-red-800">{error}</div>
            </div>
          )}

          <div className="relative">
            <label htmlFor="major" className="block text-sm font-medium text-gray-700">
              Major(s)
            </label>
            <input
              id="major"
              name="major"
              type="text"
              required
              className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500 focus:z-10 sm:text-sm"
              placeholder={loading ? "Loading majors..." : "Type your major..."}
              value={major}
              onChange={handleMajorChange}
              onFocus={() => {
                if (major.trim()) {
                  setShowDropdown(true)
                }
              }}
              onBlur={() => {
                // Delay to allow click on dropdown item
                setTimeout(() => setShowDropdown(false), 200)
              }}
              disabled={loading}
            />
            {showDropdown && filteredMajors.length > 0 && (
              <div className="absolute z-20 mt-1 w-full bg-gray-800 rounded-md shadow-lg max-h-60 overflow-auto">
                {filteredMajors.map((m) => (
                  <button
                    key={m.major_name}
                    type="button"
                    onClick={() => selectMajor(m.major_name)}
                    className="w-full text-left px-4 py-2 text-white hover:bg-gray-700 focus:bg-gray-700 focus:outline-none"
                  >
                    {m.major_name}
                  </button>
                ))}
              </div>
            )}
            {showDropdown && filteredMajors.length === 0 && major.trim() && (
              <div className="absolute z-20 mt-1 w-full bg-gray-800 rounded-md shadow-lg px-4 py-2 text-white">
                No majors found
              </div>
            )}
          </div>

          <div>
            <label htmlFor="graduationYear" className="block text-sm font-medium text-gray-700">
              Expected Graduation Year
            </label>
            <select
              id="graduationYear"
              name="graduationYear"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
              value={graduationYear || ''}
              onChange={(e) => setGraduationYear(Number(e.target.value))}
            >
              <option value="">Select graduation year</option>
              {GRADUATION_YEARS.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-600 transition-colors"
              style={{ backgroundColor: '#dc2626' }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#b91c1c')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#dc2626')}
            >
              Next
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

