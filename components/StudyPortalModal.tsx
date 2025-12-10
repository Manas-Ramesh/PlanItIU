'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { X, Calendar, Book, FileText, Download, AlertTriangle } from 'lucide-react'
import { Button } from './ui/button'

interface StudyPortalModalProps {
  userInfo: any
  onClose: () => void
}

interface Document {
  id: string
  title: string
  type: 'Practice Exam' | 'Study Guide' | 'Past Exam' | 'Examples'
  pages: number
}

interface CourseMaterial {
  course_code: string
  course_name: string
  documents: Document[]
}

export default function StudyPortalModal({ userInfo, onClose }: StudyPortalModalProps) {
  const [sortBy, setSortBy] = useState<'month' | 'class'>('month')
  const [selectedMonth, setSelectedMonth] = useState('Dec')
  const userId = userInfo?.id || userInfo?.user_id || ''
  const sampleDocuments: Document[] = [
    {
      id: '1',
      title: 'Midterm Practice Problems',
      type: 'Practice Exam',
      pages: 12
    },
    {
      id: '2',
      title: 'Study Guide - Chapters 1-5',
      type: 'Study Guide',
      pages: 8
    }
  ]

  // Course materials with sample documents
  const courseMaterials: CourseMaterial[] = [
    {
      course_code: 'CSCI-C 211',
      course_name: 'Introduction to Computer Science',
      documents: [
        {
          id: '1',
          title: 'Midterm 1 Practice Exam',
          type: 'Practice Exam',
          pages: 12
        },
        {
          id: '2',
          title: 'Chapter 1-5 Study Guide',
          type: 'Study Guide',
          pages: 8
        },
        {
          id: '3',
          title: 'Previous Final Exam',
          type: 'Past Exam',
          pages: 15
        }
      ]
    },
    {
      course_code: 'MATH-M 211',
      course_name: 'Calculus I',
      documents: [
        {
          id: '4',
          title: 'Midterm Practice Problems',
          type: 'Practice Exam',
          pages: 10
        },
        {
          id: '5',
          title: 'Derivative Rules Cheat Sheet',
          type: 'Study Guide',
          pages: 2
        }
      ]
    }
  ]

  const months = ['Sep', 'Oct', 'Nov', 'Dec']
  const currentMonth = 'Dec'

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-xl w-full max-w-4xl h-[90vh] flex flex-col overflow-hidden shadow-2xl"
      >
        <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between flex-shrink-0">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Study Portal</h2>
            <p className="text-sm text-gray-600">Practice exams and study materials</p>
          </div>
          <Button
            onClick={onClose}
            className="w-8 h-8 p-0 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto p-6">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-gray-900 mb-1">Test Bank</h3>
            <p className="text-sm text-gray-600">Access practice exams and study materials.</p>
          </div>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-2 mb-3">
              <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-yellow-900 mb-1">Disclaimer:</p>
                <p className="text-sm text-yellow-800">
                  Test bank materials are compiled from various student sources. Always consult with your professor about the validity and appropriateness of these study materials for your course.
                </p>
              </div>
            </div>
          </div>
          <div className="mb-4">
            <label className="text-sm font-medium text-gray-700 mb-2 block">Sort By</label>
            <div className="flex gap-2">
              <button
                onClick={() => setSortBy('month')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  sortBy === 'month'
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Calendar className="w-4 h-4" />
                Month
              </button>
              <button
                onClick={() => setSortBy('class')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  sortBy === 'class'
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Book className="w-4 h-4" />
                Class
              </button>
            </div>
          </div>
          {sortBy === 'month' && (
            <div className="mb-6">
              <label className="text-sm font-medium text-gray-700 mb-2 block">Select Month</label>
              <div className="flex gap-2">
                {months.map((month) => {
                  const isLocked = month !== currentMonth
                  const isActive = month === selectedMonth
                  return (
                    <button
                      key={month}
                      onClick={() => !isLocked && setSelectedMonth(month)}
                      disabled={isLocked}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        isActive
                          ? 'bg-red-600 text-white'
                          : isLocked
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {month}
                      {isLocked && <span className="ml-1">🔒</span>}
                    </button>
                  )
                })}
              </div>
              <p className="text-xs text-gray-500 mt-2">Only current month's materials are accessible.</p>
            </div>
          )}
          <div className="space-y-6">
            {courseMaterials.map((course) => (
              <div key={course.course_code} className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">{course.course_code}</h4>
                    <p className="text-sm text-gray-600">{course.course_name}</p>
                  </div>
                  <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                    {course.documents.length} materials
                  </span>
                </div>
                <div className="space-y-2">
                  {course.documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <FileText className="w-5 h-5 text-blue-600 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <h5 className="text-sm font-medium text-gray-900">{doc.title}</h5>
                        <p className="text-xs text-gray-600">
                          {doc.type} • {doc.pages} pages
                        </p>
                      </div>
                      <button
                        className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                        title="Download"
                      >
                        <Download className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
