'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import CourseProgress from './CourseProgress'
import Schedule from './Schedule'
import Calendar from './Calendar'
import Chatbot from './Chatbot'
import Swipe from './Swipe'
import Bank from './Bank'
import GPACalculator from './GPACalculator'
import WelcomeModal from './WelcomeModal'

interface UserPreferences {
  id: string
  user_id: string
  major: string | null
  expected_graduation_year: number | null
  courses_taken: string[] | null
  onboarding_completed: boolean
}

type TabType = 'progress' | 'schedule' | 'calendar' | 'chatbot' | 'swipe' | 'bank' | 'gpa'

export default function UserHomePage({ userId }: { userId: string }) {
  const router = useRouter()
  const { signOut } = useAuth()
  const [preferences, setPreferences] = useState<UserPreferences | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<TabType>('swipe') // Start with Swipe tab

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
      <div className="min-h-screen pb-20 bg-white">
      {/* Main Content */}
      {activeTab === 'schedule' && <Schedule userId={userId} />}
      {activeTab === 'progress' && <CourseProgress userId={userId} />}
      {activeTab === 'calendar' && <Calendar userId={userId} />}
      {activeTab === 'chatbot' && <Chatbot userId={userId} />}
      {activeTab === 'swipe' && <Swipe userId={userId} />}
      {/* {activeTab === 'bank' && <Bank userId={userId} />} */}
      {/* {activeTab === 'gpa' && <GPACalculator userId={userId} />} */}

      {/* Bottom Tab Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-around items-center h-16">
            {/* Swipe tab */}
            <button
              onClick={() => setActiveTab('swipe')}
              className={`flex flex-col items-center justify-center px-4 py-2 rounded-lg transition-colors ${
                activeTab === 'swipe'
                  ? 'text-red-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <svg
                className="w-6 h-6 mb-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
              <span className="text-xs font-medium">Swipe</span>
            </button>
            {/* Schedules tab - Hidden for now */}
            {/* <button
              onClick={() => setActiveTab('schedule')}
              className={`flex flex-col items-center justify-center px-4 py-2 rounded-lg transition-colors ${
                activeTab === 'schedule'
                  ? 'text-red-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <svg
                className="w-6 h-6 mb-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span className="text-xs font-medium">Schedules</span>
            </button> */}
            <button
              onClick={() => setActiveTab('progress')}
              className={`flex flex-col items-center justify-center px-4 py-2 rounded-lg transition-colors ${
                activeTab === 'progress'
                  ? 'text-red-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <svg
                className="w-6 h-6 mb-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
              <span className="text-xs font-medium">Progress</span>
            </button>
            <button
              onClick={() => setActiveTab('calendar')}
              className={`flex flex-col items-center justify-center px-4 py-2 rounded-lg transition-colors ${
                activeTab === 'calendar'
                  ? 'text-red-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <svg
                className="w-6 h-6 mb-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span className="text-xs font-medium">Calendar</span>
            </button>
            <button
              onClick={() => setActiveTab('chatbot')}
              className={`flex flex-col items-center justify-center px-4 py-2 rounded-lg transition-colors ${
                activeTab === 'chatbot'
                  ? 'text-red-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <svg
                className="w-6 h-6 mb-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              <span className="text-xs font-medium">Chat</span>
            </button>
            {/* Bank tab - Commented out for now */}
            {/* <button
              onClick={() => setActiveTab('bank')}
              className={`flex flex-col items-center justify-center px-4 py-2 rounded-lg transition-colors ${
                activeTab === 'bank'
                  ? 'text-red-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <svg
                className="w-6 h-6 mb-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
              <span className="text-xs font-medium">Bank</span>
            </button> */}
            {/* GPA tab - Commented out for now */}
            {/* <button
              onClick={() => setActiveTab('gpa')}
              className={`flex flex-col items-center justify-center px-4 py-2 rounded-lg transition-colors ${
                activeTab === 'gpa'
                  ? 'text-red-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <svg
                className="w-6 h-6 mb-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                />
              </svg>
              <span className="text-xs font-medium">GPA</span>
            </button> */}
          </div>
        </div>
      </div>

      {/* Sign Out Button - Fixed Top Right */}
      <button
        onClick={handleSignOut}
        className="fixed top-4 right-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 shadow-lg z-50"
      >
        Sign Out
      </button>

      {/* Welcome Modal */}
      <WelcomeModal userId={userId} onClose={() => {}} />
    </div>
  )
}

