'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface TermsAndPrivacyProps {
  onClose: () => void
}

export default function TermsAndPrivacy({ onClose }: TermsAndPrivacyProps) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col"
        >
          {/* Header */}
          <div className="bg-red-600 text-white p-6 rounded-t-2xl flex-shrink-0">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Terms of Service & Privacy Policy</h2>
              <button
                onClick={onClose}
                className="text-white hover:text-gray-200 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Content - Scrollable */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Terms of Service</h3>
              <div className="text-gray-700 space-y-3 text-sm">
                <p>
                  By using PlanItIU, you agree to the following terms:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>You must be a current Indiana University student to use this service</li>
                  <li>You are responsible for maintaining the confidentiality of your account</li>
                  <li>You agree to use the service only for lawful purposes</li>
                  <li>We reserve the right to modify or discontinue the service at any time</li>
                  <li>Course information is provided for planning purposes only and may not reflect current availability</li>
                </ul>
                <p>
                  PlanItIU is provided "as is" without warranties of any kind. We are not responsible for 
                  course registration, enrollment, or any decisions made based on the information provided.
                </p>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Privacy Policy</h3>
              <div className="text-gray-700 space-y-3 text-sm">
                <p>
                  PlanItIU is committed to protecting your privacy:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>We collect only the information necessary to provide our services (email, major, graduation year, courses taken)</li>
                  <li>Your data is stored securely using Supabase authentication and database services</li>
                  <li>We do not share your personal information with third parties</li>
                  <li>Course preferences and schedule data are stored locally in your browser when possible</li>
                  <li>You can delete your account and data at any time</li>
                </ul>
                <p>
                  We use cookies and local storage to maintain your session and preferences. 
                  By using PlanItIU, you consent to the use of these technologies.
                </p>
                <p>
                  For questions about our privacy practices, please contact us through the application.
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 p-6 flex-shrink-0">
            <button
              onClick={onClose}
              className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-medium transition-colors"
            >
              I Understand
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

