'use client'

import { useState, useEffect } from 'react'

interface WelcomeModalProps {
  userId: string
  onClose: () => void
}

export default function WelcomeModal({ userId, onClose }: WelcomeModalProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Check if user has seen the welcome modal before
    const welcomeKey = `welcomeModalSeen_${userId}`
    const hasSeenWelcome = localStorage.getItem(welcomeKey)
    
    if (!hasSeenWelcome) {
      setIsVisible(true)
    }
  }, [userId])

  const handleClose = () => {
    const welcomeKey = `welcomeModalSeen_${userId}`
    localStorage.setItem(welcomeKey, 'true')
    setIsVisible(false)
    onClose()
  }

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-red-600 text-white p-6 rounded-t-lg flex-shrink-0">
          <div className="flex justify-between items-center">
            <div className="flex-1"></div>
            <h2 className="text-2xl font-bold text-center flex-1">Welcome to PlanItIU!</h2>
            <div className="flex-1 flex justify-end">
              <button
                onClick={handleClose}
                className="text-white hover:text-gray-200 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Content - Scrollable */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          <p className="text-lg text-gray-700">
            We're excited to help you plan your academic journey! Here's how to get started:
          </p>

          {/* Feature 1: Generate Schedule */}
          <div className="border-l-4 border-red-600 pl-4">
            <div className="flex items-start gap-3 mb-2">
              <div className="bg-red-100 rounded-full p-2 flex-shrink-0">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-1">Generate Schedule</h3>
                <p className="text-gray-700">
                  Click the <strong>"Generate"</strong> button to automatically create your course schedule. 
                  The system will select the best classes with the highest GPAs and ensure no time conflicts. 
                  You'll get a personalized schedule with meeting times, instructors, and locations.
                </p>
              </div>
            </div>
          </div>

          {/* Feature 2: Course Progress */}
          <div className="border-l-4 border-blue-600 pl-4">
            <div className="flex items-start gap-3 mb-2">
              <div className="bg-blue-100 rounded-full p-2 flex-shrink-0">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-1">Course Progress</h3>
                <p className="text-gray-700">
                  Track your progress towards graduation! View all your degree requirements organized by semester, 
                  see which courses you've completed, and monitor your overall completion percentage. 
                  This helps you stay on track to graduate on time.
                </p>
              </div>
            </div>
          </div>

          {/* Feature 3: Chatbot */}
          <div className="border-l-4 border-green-600 pl-4">
            <div className="flex items-start gap-3 mb-2">
              <div className="bg-green-100 rounded-full p-2 flex-shrink-0">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-1">Chat Assistant</h3>
                <p className="text-gray-700">
                  Have questions? Ask our AI assistant anything about course planning, degree requirements, 
                  scheduling, or how to use PlanItIU. The chatbot is here to help 24/7!
                </p>
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <p className="text-sm text-gray-600">
              <strong>Tip:</strong> You can also view your schedule in calendar format and regenerate your schedule 
              anytime to get updated course recommendations based on the latest available classes.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 rounded-b-lg flex justify-center flex-shrink-0">
          <button
            onClick={handleClose}
            className="px-6 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors"
          >
            Get Started
          </button>
        </div>
      </div>
    </div>
  )
}

