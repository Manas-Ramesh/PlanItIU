'use client'

import { useState, useEffect } from 'react'
import { Folder, FileText, Download, ChevronRight, ChevronLeft } from 'lucide-react'

interface ScheduledCourse {
  course_code: string
  course_name: string
  class_number: string
  meeting_time: string | null
  instructor: string | null
  room: string | null
  building: string | null
  status: string | null
  credits: string | null
  gpa?: number
  requirement_name?: string
}

interface Document {
  id: string
  title: string
  type: 'Practice Exam' | 'Study Guide' | 'Past Exam' | 'Examples'
  pages: number
}

export default function Bank({ userId }: { userId: string }) {
  const [courses, setCourses] = useState<ScheduledCourse[]>([])
  const [selectedCourse, setSelectedCourse] = useState<ScheduledCourse | null>(null)
  const [loading, setLoading] = useState(true)

  // Sample documents - same two for all courses
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

  useEffect(() => {
    loadCourses()
    
    // Listen for schedule updates
    const handleScheduleUpdate = (event: Event) => {
      const customEvent = event as CustomEvent
      if (customEvent.detail?.userId === userId) {
        loadCourses()
      }
    }
    
    window.addEventListener('scheduleUpdated', handleScheduleUpdate)
    window.addEventListener('courseDeleted', handleScheduleUpdate)
    
    return () => {
      window.removeEventListener('scheduleUpdated', handleScheduleUpdate)
      window.removeEventListener('courseDeleted', handleScheduleUpdate)
    }
  }, [userId])

  const loadCourses = () => {
    try {
      const scheduleKey = `generatedSchedule_${userId}`
      const savedSchedule = localStorage.getItem(scheduleKey)
      
      if (savedSchedule) {
        const parsed = JSON.parse(savedSchedule)
        setCourses(parsed)
      } else {
        setCourses([])
      }
    } catch (error) {
      console.error('Error loading courses:', error)
      setCourses([])
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-600">Loading...</div>
      </div>
    )
  }

  // If a course is selected, show its documents
  if (selectedCourse) {
    return (
      <div className="min-h-screen bg-gray-50 pb-20">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <button
              onClick={() => setSelectedCourse(null)}
              className="flex items-center text-gray-600 hover:text-gray-900 mb-2"
            >
              <ChevronLeft className="w-5 h-5 mr-1" />
              Back to Courses
            </button>
            <h1 className="text-2xl font-bold text-gray-900">{selectedCourse.course_code}</h1>
            <p className="text-gray-600 mt-1">{selectedCourse.course_name}</p>
          </div>
        </div>

        {/* Documents List */}
        <div className="max-w-7xl mx-auto px-4 py-6">
          {sampleDocuments.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No documents available</p>
              <p className="text-gray-400 text-sm mt-2">Documents will appear here once uploaded</p>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              {sampleDocuments.map((doc, index) => (
                <div
                  key={doc.id}
                  className={`flex items-center px-6 py-4 ${
                    index !== sampleDocuments.length - 1 ? 'border-b border-gray-200' : ''
                  } hover:bg-gray-50 transition-colors`}
                >
                  <div className="flex-shrink-0 mr-4">
                    <FileText className="w-8 h-8 text-blue-600" />
                  </div>
                  <div className="flex-grow min-w-0">
                    <h3 className="text-base font-medium text-gray-900 truncate">{doc.title}</h3>
                    <div className="flex items-center mt-1 space-x-3">
                      <span className="text-sm text-gray-500">{doc.type}</span>
                      <span className="text-sm text-gray-400">•</span>
                      <span className="text-sm text-gray-500">{doc.pages} pages</span>
                    </div>
                  </div>
                  <button
                    className="flex-shrink-0 ml-4 p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                    title="Download"
                  >
                    <Download className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    )
  }

  // Main view - show course folders
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Course Bank</h1>
          <p className="text-gray-600 mt-1">Access materials for your enrolled courses</p>
        </div>
      </div>

      {/* Course Folders */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {courses.length === 0 ? (
          <div className="text-center py-12">
            <Folder className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No courses enrolled</p>
            <p className="text-gray-400 text-sm mt-2">Enroll in courses from the Swipe tab to see them here</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {courses.map((course) => (
              <button
                key={`${course.course_code}-${course.class_number}`}
                onClick={() => setSelectedCourse(course)}
                className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md hover:border-gray-300 transition-all text-left group"
              >
                <div className="flex items-start justify-between mb-3">
                  <Folder className="w-10 h-10 text-blue-600 flex-shrink-0" />
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{course.course_code}</h3>
                <p className="text-sm text-gray-600 line-clamp-2 mb-3">{course.course_name}</p>
                <div className="flex items-center text-xs text-gray-500">
                  <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">
                    {sampleDocuments.length} materials
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

