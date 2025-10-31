'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'

interface UserPreferences {
  id: string
  user_id: string
  major: string | null
  expected_graduation_year: number | null
  courses_taken: string[] | null
  onboarding_completed: boolean
}

export default function UserHomePage({ userId }: { userId: string }) {
  const router = useRouter()
  const { signOut } = useAuth()
  const [preferences, setPreferences] = useState<UserPreferences | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPreferences()
  }, [userId])

  const fetchPreferences = async () => {
    try {
      const { data, error } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', userId)
        .single()

      if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
        throw error
      }

      if (data) {
        setPreferences(data)
        
        // Redirect to onboarding if not completed
        if (!data.onboarding_completed) {
          router.push('/onboarding/step1')
          return
        }
      } else {
        // No preferences found, redirect to onboarding
        router.push('/onboarding/step1')
        return
      }
    } catch (error: any) {
      console.error('Error fetching preferences:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    await signOut()
    router.push('/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#dc2626' }}>
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  if (!preferences) {
    return null // Will redirect
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: '#dc2626' }}>
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-extrabold text-gray-900">Welcome to PlanItIU!</h1>
            <button
              onClick={handleSignOut}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Sign Out
            </button>
          </div>

          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Information</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Major</label>
                  <p className="mt-1 text-lg text-gray-900">{preferences.major || 'Not set'}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Expected Graduation Year</label>
                  <p className="mt-1 text-lg text-gray-900">{preferences.expected_graduation_year || 'Not set'}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Courses Taken</label>
                  {preferences.courses_taken && preferences.courses_taken.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {preferences.courses_taken.map((course, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm"
                        >
                          {course}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-600">No courses added yet</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

