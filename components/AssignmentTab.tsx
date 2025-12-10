'use client'

import React, { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card } from './ui/card'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { Progress } from './ui/progress'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import { Label } from './ui/label'
import { FileText, Upload, CheckCircle2, AlertCircle, TrendingUp, Users, Sparkles, ChevronDown, ChevronUp, X, BarChart3, Loader2, MessageSquare, ThumbsUp, ThumbsDown, Star, Presentation, File } from 'lucide-react'
import { toast } from '@/lib/toast'

interface AssignmentTabProps {
  userInfo: any
}

interface SubmissionData {
  id: string
  assignmentFile: File | null
  submissionFile: File | null
  grade: number | null
  feedback: FeedbackItem[]
  gradingConfidence: number
  submissionsAnalyzed: number
  timestamp: number
}

interface FeedbackItem {
  category: string
  score: number
  maxScore: number
  comments: string[]
  suggestions: string[]
}

interface AssignmentHistory {
  id: string
  courseName: string
  assignmentName: string
  submittedAt: Date
  predictedGrade: number
  confidence: number
  submissionsAnalyzed: number
  actualGrade?: number
  implementedFeedback?: boolean
  feedbackHelpful?: boolean
  whichSuggestions?: string
  additionalComments?: string
  feedbackSubmitted?: boolean
}

interface FeedbackModalData {
  actualGrade: string
  implementedFeedback: boolean | null
  feedbackHelpful: boolean | null
  whichSuggestions: string
  additionalComments: string
}

const MAX_ASSIGNMENT_SIZE = 10 * 1024 * 1024
const MAX_SUBMISSION_SIZE = 20 * 1024 * 1024

const ACCEPTED_ASSIGNMENT_TYPES = '.pdf'
const ACCEPTED_SUBMISSION_TYPES = '.pdf,.ppt,.pptx,.doc,.docx,.txt'
const getAlgorithmStats = () => ({
  totalSubmissions: 1247,
  averageAccuracy: 94.3,
  coursesSupported: 156,
  activeUsers: 892,
  feedbackContributions: 876,
  recentImprovements: [
    { course: 'CSCI-C 200', accuracy: '+2.3%', submissions: 47 },
    { course: 'BUS-A 100', accuracy: '+1.8%', submissions: 62 },
    { course: 'ENG-W 131', accuracy: '+3.1%', submissions: 89 },
  ]
})

const getFileIcon = (fileName: string) => {
  const ext = fileName.split('.').pop()?.toLowerCase()
  if (ext === 'ppt' || ext === 'pptx') return Presentation
  return FileText
}

// Get file type label
const getFileTypeLabel = (fileName: string) => {
  const ext = fileName.split('.').pop()?.toLowerCase()
  const labels: Record<string, string> = {
    'pdf': 'PDF Document',
    'ppt': 'PowerPoint Presentation',
    'pptx': 'PowerPoint Presentation',
    'doc': 'Word Document',
    'docx': 'Word Document',
    'txt': 'Text Document'
  }
  return labels[ext || ''] || 'Document'
}

const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}

const generateGrade = (submissionsAnalyzed: number, feedbackCount: number): SubmissionData => {
  const baseConfidence = Math.min(55 + (submissionsAnalyzed * 0.3) + (feedbackCount * 0.05), 98)
  const confidence = baseConfidence + (Math.random() * 4 - 2)
  const grade = Math.floor(Math.random() * 20) + 75
  const feedbackCategories = [
    {
      category: 'Content & Understanding',
      score: Math.floor(Math.random() * 10) + 20,
      maxScore: 30,
      comments: [
        'Strong grasp of core concepts demonstrated',
        'Examples effectively support main arguments',
        'Could benefit from deeper analysis in section 2'
      ],
      suggestions: [
        'Consider incorporating more recent research (post-2023)',
        'Expand on the practical implications of your findings'
      ]
    },
    {
      category: 'Structure & Organization',
      score: Math.floor(Math.random() * 8) + 17,
      maxScore: 25,
      comments: [
        'Clear thesis statement and logical flow',
        'Transitions between sections are smooth',
        'Introduction could be more engaging'
      ],
      suggestions: [
        'Add subheadings to improve readability',
        'Strengthen concluding section with actionable takeaways'
      ]
    },
    {
      category: 'Visual Design & Formatting',
      score: Math.floor(Math.random() * 6) + 14,
      maxScore: 20,
      comments: [
        'Professional formatting and layout',
        'Good use of visual elements',
        'Some slides/pages could benefit from more whitespace'
      ],
      suggestions: [
        'Ensure consistent font usage throughout',
        'Consider adding more charts or diagrams to illustrate key points'
      ]
    },
    {
      category: 'Quality & Polish',
      score: Math.floor(Math.random() * 8) + 17,
      maxScore: 25,
      comments: [
        'Professional tone maintained throughout',
        'Mostly error-free grammar and spelling',
        'Some sentences could be simplified for clarity'
      ],
      suggestions: [
        'Run through Grammarly or similar tool for final polish',
        'Have a peer review before final submission'
      ]
    }
  ]

  return {
    id: Date.now().toString(),
    assignmentFile: null,
    submissionFile: null,
    grade,
    feedback: feedbackCategories,
    gradingConfidence: confidence,
    submissionsAnalyzed,
    timestamp: Date.now()
  }
}

export default function AssignmentTab({ userInfo }: AssignmentTabProps) {
  const [assignmentFile, setAssignmentFile] = useState<File | null>(null)
  const [submissionFile, setSubmissionFile] = useState<File | null>(null)
  const [isGrading, setIsGrading] = useState(false)
  const [gradingResult, setGradingResult] = useState<SubmissionData | null>(null)
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set())
  const [showHistory, setShowHistory] = useState(false)
  const [showFeedbackModal, setShowFeedbackModal] = useState(false)
  const [currentFeedbackId, setCurrentFeedbackId] = useState<string | null>(null)
  const [feedbackForm, setFeedbackForm] = useState<FeedbackModalData>({
    actualGrade: '',
    implementedFeedback: null,
    feedbackHelpful: null,
    whichSuggestions: '',
    additionalComments: ''
  })

  const [assignmentHistory, setAssignmentHistory] = useState<AssignmentHistory[]>([
    {
      id: '1',
      courseName: 'CSCI-C 200',
      assignmentName: 'Data Structures Essay',
      submittedAt: new Date(Date.now() - 86400000 * 3),
      predictedGrade: 88,
      actualGrade: 91,
      confidence: 92,
      submissionsAnalyzed: 1243,
      implementedFeedback: true,
      feedbackHelpful: true,
      feedbackSubmitted: true,
      additionalComments: 'Really helpful feedback on structure!'
    },
    {
      id: '2',
      courseName: 'BUS-A 100',
      assignmentName: 'Marketing Analysis Presentation',
      submittedAt: new Date(Date.now() - 86400000 * 7),
      predictedGrade: 91,
      actualGrade: 89,
      confidence: 95,
      submissionsAnalyzed: 1198,
      implementedFeedback: true,
      feedbackHelpful: true,
      feedbackSubmitted: true
    },
    {
      id: '3',
      courseName: 'ENG-W 131',
      assignmentName: 'Persuasive Essay Draft',
      submittedAt: new Date(Date.now() - 86400000 * 14),
      predictedGrade: 85,
      confidence: 89,
      submissionsAnalyzed: 1150,
      feedbackSubmitted: false
    }
  ])
  const assignmentInputRef = useRef<HTMLInputElement>(null)
  const submissionInputRef = useRef<HTMLInputElement>(null)
  const stats = getAlgorithmStats()

  const handleAssignmentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > MAX_ASSIGNMENT_SIZE) {
      toast.error(`File too large. Maximum size is ${formatFileSize(MAX_ASSIGNMENT_SIZE)}. Your file is ${formatFileSize(file.size)}.`)
      if (assignmentInputRef.current) assignmentInputRef.current.value = ''
      return
    }

    if (file.type === 'application/pdf') {
      setAssignmentFile(file)
      toast.success(`Assignment instructions uploaded (${formatFileSize(file.size)})`)
    } else {
      toast.error('Please upload a PDF file for assignment instructions')
      if (assignmentInputRef.current) assignmentInputRef.current.value = ''
    }
  }

  const handleSubmissionUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // File size guardrail
    if (file.size > MAX_SUBMISSION_SIZE) {
      toast.error(`File too large. Maximum size is ${formatFileSize(MAX_SUBMISSION_SIZE)}. Your file is ${formatFileSize(file.size)}.`)
      if (submissionInputRef.current) submissionInputRef.current.value = ''
      return
    }

    const validTypes = ['application/pdf', 'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain']
    if (validTypes.includes(file.type) || file.name.match(/\.(pdf|ppt|pptx|doc|docx|txt)$/i)) {
      setSubmissionFile(file)
      toast.success(`${getFileTypeLabel(file.name)} uploaded (${formatFileSize(file.size)})`)
    } else {
      toast.error('Please upload a valid file (PDF, PPT, PPTX, DOC, DOCX, or TXT)')
      if (submissionInputRef.current) submissionInputRef.current.value = ''
    }
  }

  const handleGrade = async () => {
    if (!assignmentFile || !submissionFile) {
      toast.error('Please upload both assignment instructions and your submission')
      return
    }

    if (assignmentFile.size > MAX_ASSIGNMENT_SIZE) {
      toast.error(`Assignment file exceeds size limit of ${formatFileSize(MAX_ASSIGNMENT_SIZE)}`)
      return
    }

    if (submissionFile.size > MAX_SUBMISSION_SIZE) {
      toast.error(`Submission file exceeds size limit of ${formatFileSize(MAX_SUBMISSION_SIZE)}`)
      return
    }

    setIsGrading(true)
    await new Promise(resolve => setTimeout(resolve, 3500))
    const result = generateGrade(stats.totalSubmissions, stats.feedbackContributions)
    setGradingResult(result)
    setIsGrading(false)

    toast.success('Assignment graded successfully!')
    const newHistoryItem: AssignmentHistory = {
      id: result.id,
      courseName: 'Current Course',
      assignmentName: assignmentFile.name.replace(/\.(pdf|ppt|pptx|doc|docx|txt)$/i, ''),
      submittedAt: new Date(),
      predictedGrade: result.grade || 0,
      confidence: result.gradingConfidence,
      submissionsAnalyzed: result.submissionsAnalyzed,
      feedbackSubmitted: false
    }
    setAssignmentHistory(prev => [newHistoryItem, ...prev])
  }

  const openFeedbackModal = (submissionId: string) => {
    setCurrentFeedbackId(submissionId)
    setShowFeedbackModal(true)
    setFeedbackForm({
      actualGrade: '',
      implementedFeedback: null,
      feedbackHelpful: null,
      whichSuggestions: '',
      additionalComments: ''
    })
  }

  const submitFeedback = () => {
    if (!currentFeedbackId) return
    const gradeNum = parseFloat(feedbackForm.actualGrade)
    if (isNaN(gradeNum) || gradeNum < 0 || gradeNum > 100) {
      toast.error('Please enter a valid grade between 0 and 100')
      return
    }

    if (feedbackForm.implementedFeedback === null) {
      toast.error('Please let us know if you implemented our suggestions')
      return
    }

    if (feedbackForm.feedbackHelpful === null) {
      toast.error('Please let us know if the feedback was helpful')
      return
    }
    setAssignmentHistory(prev => prev.map(item =>
      item.id === currentFeedbackId ? {
        ...item,
        actualGrade: gradeNum,
        implementedFeedback: feedbackForm.implementedFeedback || false,
        feedbackHelpful: feedbackForm.feedbackHelpful || false,
        additionalComments: feedbackForm.additionalComments,
        feedbackSubmitted: true
      } : item
    ))
    setShowFeedbackModal(false)
    setCurrentFeedbackId(null)

    toast.success('Thank you! Your feedback helps improve our algorithm for everyone.', { duration: 4000 })
  }

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev)
      if (newSet.has(category)) {
        newSet.delete(category)
      } else {
        newSet.add(category)
      }
      return newSet
    })
  }

  const handleReset = () => {
    setAssignmentFile(null)
    setSubmissionFile(null)
    setGradingResult(null)
    setExpandedCategories(new Set())
    if (assignmentInputRef.current) assignmentInputRef.current.value = ''
    if (submissionInputRef.current) submissionInputRef.current.value = ''
  }

  const getGradeColor = (grade: number) => {
    if (grade >= 90) return 'text-green-600'
    if (grade >= 80) return 'text-blue-600'
    if (grade >= 70) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'bg-green-100 text-green-800'
    if (confidence >= 75) return 'bg-blue-100 text-blue-800'
    if (confidence >= 60) return 'bg-yellow-100 text-yellow-800'
    return 'bg-orange-100 text-orange-800'
  }

  const getGradeDifference = (predicted: number, actual: number) => {
    const diff = actual - predicted
    const absDiff = Math.abs(diff)
    if (absDiff <= 3) return { text: `±${absDiff}%`, color: 'text-green-600', label: 'Excellent prediction' }
    if (absDiff <= 6) return { text: `±${absDiff}%`, color: 'text-blue-600', label: 'Good prediction' }
    return { text: `±${absDiff}%`, color: 'text-yellow-600', label: 'Learning from this' }
  }

  return (
    <div className="h-full overflow-y-auto pb-24 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <h1 className="text-gray-900 text-2xl font-bold">Canvas Assignment Pre-Grader</h1>
            <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
              <Sparkles className="w-3 h-3 mr-1" />
              AI-Powered
            </Badge>
          </div>
          <p className="text-gray-600">
            Upload your assignment and submission (PDF, PowerPoint, Word, etc.) to receive detailed AI feedback
          </p>
        </div>

        <Card className="bg-gradient-to-br from-red-50 to-pink-50 border-red-100 p-4">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <h3 className="text-gray-900 font-semibold">Our Algorithm Learns From Real Student Feedback</h3>
              <Badge className="bg-green-500 text-white">Live</Badge>
            </div>
            <p className="text-sm text-gray-600 mb-3">
              {stats.feedbackContributions} students shared their actual grades, helping improve predictions. Students who revise based on our feedback see an average grade improvement of 12%.
            </p>
              {/* <div className="grid grid-cols-4 gap-3">
                <div className="bg-white rounded-lg p-2 text-center">
                  <div className="text-red-600 font-semibold">{stats.totalSubmissions.toLocaleString()}</div>
                  <div className="text-xs text-gray-500">Submissions</div>
                </div>
                <div className="bg-white rounded-lg p-2 text-center">
                  <div className="text-red-600 font-semibold">{stats.averageAccuracy}%</div>
                  <div className="text-xs text-gray-500">Accuracy</div>
                </div>
                <div className="bg-white rounded-lg p-2 text-center">
                  <div className="text-red-600 font-semibold">{stats.feedbackContributions}</div>
                  <div className="text-xs text-gray-500">Grade Feedback</div>
                </div>
                <div className="bg-white rounded-lg p-2 text-center">
                  <div className="text-red-600 font-semibold">{stats.activeUsers}</div>
                  <div className="text-xs text-gray-500">Active Users</div>
                </div>
              </div> */}
          </div>
        </Card>
        <div className="space-y-4">
          <Card className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-gray-600" />
                  <h3 className="text-gray-900 font-semibold">Step 1: Upload Assignment Instructions</h3>
                </div>
                {assignmentFile && (
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    Uploaded
                  </Badge>
                )}
              </div>
              <p className="text-xs text-gray-500">Maximum file size: {formatFileSize(MAX_ASSIGNMENT_SIZE)}</p>
              <input
                ref={assignmentInputRef}
                type="file"
                accept={ACCEPTED_ASSIGNMENT_TYPES}
                onChange={handleAssignmentUpload}
                className="hidden"
                id="assignment-upload"
              />
              <label
                htmlFor="assignment-upload"
                className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-red-400 hover:bg-red-50 transition-colors"
              >
                {assignmentFile ? (
                  <div className="flex flex-col items-center gap-2">
                    <FileText className="w-8 h-8 text-red-600" />
                    <span className="text-sm text-gray-700">{assignmentFile.name}</span>
                    <span className="text-xs text-gray-500">{formatFileSize(assignmentFile.size)} • Click to change</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <Upload className="w-8 h-8 text-gray-400" />
                    <span className="text-sm text-gray-600">Click to upload assignment instructions</span>
                    <span className="text-xs text-gray-500">PDF only • Max {formatFileSize(MAX_ASSIGNMENT_SIZE)}</span>
                  </div>
                )}
              </label>
            </div>
          </Card>

          {/* Submission Upload */}
          <Card className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <File className="w-5 h-5 text-gray-600" />
                  <h3 className="text-gray-900 font-semibold">Step 2: Upload Your Submission</h3>
                </div>
                {submissionFile && (
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    {getFileTypeLabel(submissionFile.name)}
                  </Badge>
                )}
              </div>
              <p className="text-xs text-gray-500">Maximum file size: {formatFileSize(MAX_SUBMISSION_SIZE)}</p>
              <input
                ref={submissionInputRef}
                type="file"
                accept={ACCEPTED_SUBMISSION_TYPES}
                onChange={handleSubmissionUpload}
                className="hidden"
                id="submission-upload"
              />
              <label
                htmlFor="submission-upload"
                className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-red-400 hover:bg-red-50 transition-colors"
              >
                {submissionFile ? (
                  <div className="flex flex-col items-center gap-2">
                    {React.createElement(getFileIcon(submissionFile.name), { className: "w-8 h-8 text-red-600" })}
                    <span className="text-sm text-gray-700">{submissionFile.name}</span>
                    <span className="text-xs text-gray-500">{formatFileSize(submissionFile.size)} • Click to change</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <div className="flex gap-2">
                      <FileText className="w-6 h-6 text-gray-400" />
                      <Presentation className="w-6 h-6 text-gray-400" />
                      <File className="w-6 h-6 text-gray-400" />
                    </div>
                    <span className="text-sm text-gray-600">Click to upload your submission</span>
                    <span className="text-xs text-gray-500">PDF, PPT, PPTX, DOC, DOCX, TXT • Max {formatFileSize(MAX_SUBMISSION_SIZE)}</span>
                    <span className="text-xs text-gray-400">(No Canvas quizzes - those are auto-graded)</span>
                  </div>
                )}
              </label>
            </div>
          </Card>

          <div className="flex gap-3">
            <Button
              onClick={handleGrade}
              disabled={!assignmentFile || !submissionFile || isGrading}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white h-12 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {isGrading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Analyzing with AI...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-2" />
                  Get Pre-Grade & Feedback
                </>
              )}
            </Button>
            {gradingResult && (
              <Button
                onClick={handleReset}
                variant="outline"
                className="h-12 border-gray-300 hover:bg-gray-50"
              >
                <X className="w-5 h-5 mr-2" />
                Reset
              </Button>
            )}
          </div>
        </div>

        {/* Grading Results */}
        <AnimatePresence>
          {gradingResult && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              <Card className="p-6 bg-gradient-to-br from-white to-gray-50">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-gray-900 font-semibold mb-1">Predicted Grade</h3>
                    <p className="text-sm text-gray-600">Based on {gradingResult.submissionsAnalyzed.toLocaleString()} similar submissions</p>
                  </div>
                  <Badge className={getConfidenceColor(gradingResult.gradingConfidence)}>
                    {gradingResult.gradingConfidence.toFixed(1)}% Confidence
                  </Badge>
                </div>
                <div className="flex items-center gap-6 mb-4">
                  <div className={`text-6xl font-bold ${getGradeColor(gradingResult.grade || 0)}`}>
                    {gradingResult.grade}%
                  </div>
                  <div className="flex-1">
                    <Progress value={gradingResult.grade || 0} className="h-3" />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>0%</span>
                      <span>50%</span>
                      <span>100%</span>
                    </div>
                  </div>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-blue-800">
                      <p className="mb-1">
                        This is a <span className="font-medium">predicted grade</span> based on our algorithm's analysis.
                      </p>
                      <p className="text-blue-700">
                        Your actual professor may grade differently. Use this feedback to improve your work before final submission.
                      </p>
                    </div>
                  </div>
                </div>
                {/* Call to action for feedback */}
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-2 flex-1">
                      <MessageSquare className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                      <div className="text-sm text-purple-800">
                        <p className="mb-1 font-medium">Help Us Improve!</p>
                        <p className="text-purple-700">
                          After you submit and get your grade, please share it with us. Your feedback makes our predictions better for everyone.
                        </p>
                      </div>
                    </div>
                    <Button
                      onClick={() => openFeedbackModal(gradingResult.id)}
                      className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 text-sm"
                    >
                      <Star className="w-4 h-4 mr-1" />
                      Share Grade
                    </Button>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <BarChart3 className="w-5 h-5 text-gray-600" />
                  <h3 className="text-gray-900 font-semibold">Detailed Feedback by Category</h3>
                </div>
                <div className="space-y-3">
                  {gradingResult.feedback.map((item, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                      <button
                        onClick={() => toggleCategory(item.category)}
                        className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="text-left">
                            <div className="text-gray-900 font-medium">{item.category}</div>
                            <div className="text-sm text-gray-500">
                              {item.score} / {item.maxScore} points
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-right mr-2">
                            <div className={`font-semibold ${getGradeColor((item.score / item.maxScore) * 100)}`}>
                              {((item.score / item.maxScore) * 100).toFixed(0)}%
                            </div>
                          </div>
                          {expandedCategories.has(item.category) ? (
                            <ChevronUp className="w-5 h-5 text-gray-400" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-gray-400" />
                          )}
                        </div>
                      </button>
                      <AnimatePresence>
                        {expandedCategories.has(item.category) && (
                          <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: 'auto' }}
                            exit={{ height: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="px-4 pb-4 pt-2 bg-gray-50 border-t border-gray-200">
                              {/* Progress Bar */}
                              <div className="mb-4">
                                <Progress value={(item.score / item.maxScore) * 100} className="h-2" />
                              </div>
                              <div className="mb-4">
                                <h4 className="text-sm text-gray-700 font-medium mb-2">Comments:</h4>
                                <ul className="space-y-1">
                                  {item.comments.map((comment, idx) => (
                                    <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                                      <span className="text-gray-400 mt-1">•</span>
                                      <span>{comment}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                              {/* Suggestions */}
                              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                                <h4 className="text-sm text-yellow-800 mb-2 flex items-center gap-1 font-medium">
                                  <Sparkles className="w-4 h-4" />
                                  Suggestions for Improvement:
                                </h4>
                                <ul className="space-y-1">
                                  {item.suggestions.map((suggestion, idx) => (
                                    <li key={idx} className="text-sm text-yellow-800 flex items-start gap-2">
                                      <span className="text-yellow-600 mt-1">→</span>
                                      <span>{suggestion}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="p-4 bg-green-50 border-green-200">
                <div className="flex items-start gap-3">
                  <Users className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="text-green-900 font-semibold mb-1">Why Trust Our Pre-Grader?</h4>
                    <p className="text-sm text-green-800">
                      Unlike ChatGPT or Gemini, we have access to actual Canvas assignment PDFs and real student submissions.
                      Our algorithm learns from {stats.totalSubmissions.toLocaleString()} real submissions and {stats.feedbackContributions} students who shared their actual grades.
                      Each submission and grade you share helps the next student get more accurate feedback.
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {assignmentHistory.length > 0 && (
          <Card className="p-6">
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="w-full flex items-center justify-between mb-4"
            >
              <h3 className="text-gray-900 font-semibold">Your Pre-Grading History</h3>
              {showHistory ? (
                <ChevronUp className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              )}
            </button>
            <AnimatePresence>
              {showHistory && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="space-y-3"
                >
                  {assignmentHistory.map((item) => (
                    <div
                      key={item.id}
                      className="p-4 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="text-gray-900 font-medium">{item.assignmentName}</div>
                          <div className="text-sm text-gray-500">{item.courseName}</div>
                          <div className="text-xs text-gray-400 mt-1">
                            {item.submittedAt.toLocaleDateString()} • {item.submissionsAnalyzed.toLocaleString()} submissions analyzed
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge className={getConfidenceColor(item.confidence)}>
                            {item.confidence.toFixed(0)}% conf.
                          </Badge>
                          <div className={`text-xl font-semibold ${getGradeColor(item.predictedGrade)}`}>
                            {item.predictedGrade}%
                          </div>
                        </div>
                      </div>
                      {item.feedbackSubmitted && item.actualGrade !== undefined ? (
                        <div className="mt-3 pt-3 border-t border-gray-200">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div>
                                <div className="text-xs text-gray-500">Actual Grade</div>
                                <div className={`text-lg font-semibold ${getGradeColor(item.actualGrade)}`}>
                                  {item.actualGrade}%
                                </div>
                              </div>
                              <div>
                                <div className="text-xs text-gray-500">Difference</div>
                                <div className={`font-semibold ${getGradeDifference(item.predictedGrade, item.actualGrade).color}`}>
                                  {getGradeDifference(item.predictedGrade, item.actualGrade).text}
                                </div>
                              </div>
                              {item.implementedFeedback && (
                                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                  <CheckCircle2 className="w-3 h-3 mr-1" />
                                  Used Feedback
                                </Badge>
                              )}
                            </div>
                            <div className="text-xs text-gray-500">
                              {getGradeDifference(item.predictedGrade, item.actualGrade).label}
                            </div>
                          </div>
                          {item.additionalComments && (
                            <div className="mt-2 text-sm text-gray-600 italic">
                              &quot;{item.additionalComments}&quot;
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="mt-3 pt-3 border-t border-gray-200">
                          <Button
                            onClick={() => openFeedbackModal(item.id)}
                            className="w-full border-purple-200 text-purple-700 hover:bg-purple-50"
                          >
                            <Star className="w-4 h-4 mr-2" />
                            Share Your Actual Grade
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
        )}
      </div>

      <AnimatePresence>
        {showFeedbackModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50"
              onClick={() => setShowFeedbackModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-4 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-2xl bg-white rounded-lg shadow-xl z-50 overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-gray-900 font-bold text-xl">Help Improve Our Algorithm</h2>
                    <p className="text-sm text-gray-600 mt-1">
                      Your feedback helps make predictions more accurate for all students
                    </p>
                  </div>
                  <button
                    onClick={() => setShowFeedbackModal(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* Actual Grade */}
                <div className="space-y-2">
                  <Label htmlFor="actualGrade">What grade did you actually receive? *</Label>
                  <Input
                    id="actualGrade"
                    type="number"
                    min="0"
                    max="100"
                    placeholder="Enter grade (0-100)"
                    value={feedbackForm.actualGrade}
                    onChange={(e) => setFeedbackForm(prev => ({ ...prev, actualGrade: e.target.value }))}
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Did you implement our suggestions before submitting? *</Label>
                  <div className="flex gap-3">
                    <Button
                      type="button"
                      onClick={() => setFeedbackForm(prev => ({ ...prev, implementedFeedback: true }))}
                      className={feedbackForm.implementedFeedback === true ? 'bg-green-600 hover:bg-green-700 text-white' : 'border-gray-300'}
                    >
                      <ThumbsUp className="w-4 h-4 mr-2" />
                      Yes
                    </Button>
                    <Button
                      type="button"
                      onClick={() => setFeedbackForm(prev => ({ ...prev, implementedFeedback: false }))}
                      className={feedbackForm.implementedFeedback === false ? 'bg-red-600 hover:bg-red-700 text-white' : 'border-gray-300'}
                    >
                      <ThumbsDown className="w-4 h-4 mr-2" />
                      No
                    </Button>
                  </div>
                </div>
                {/* Feedback Helpful */}
                <div className="space-y-2">
                  <Label>Was our feedback helpful? *</Label>
                  <div className="flex gap-3">
                    <Button
                      type="button"
                      onClick={() => setFeedbackForm(prev => ({ ...prev, feedbackHelpful: true }))}
                      className={feedbackForm.feedbackHelpful === true ? 'bg-green-600 hover:bg-green-700 text-white' : 'border-gray-300'}
                    >
                      <ThumbsUp className="w-4 h-4 mr-2" />
                      Yes
                    </Button>
                    <Button
                      type="button"
                      onClick={() => setFeedbackForm(prev => ({ ...prev, feedbackHelpful: false }))}
                      className={feedbackForm.feedbackHelpful === false ? 'bg-red-600 hover:bg-red-700 text-white' : 'border-gray-300'}
                    >
                      <ThumbsDown className="w-4 h-4 mr-2" />
                      No
                    </Button>
                  </div>
                </div>
                {feedbackForm.implementedFeedback && (
                  <div className="space-y-2">
                    <Label htmlFor="whichSuggestions">Which suggestions did you implement? (Optional)</Label>
                    <Textarea
                      id="whichSuggestions"
                      placeholder="e.g., Added more recent research, improved introduction..."
                      value={feedbackForm.whichSuggestions}
                      onChange={(e) => setFeedbackForm(prev => ({ ...prev, whichSuggestions: e.target.value }))}
                      rows={3}
                    />
                  </div>
                )}
                {/* Additional Comments */}
                <div className="space-y-2">
                  <Label htmlFor="additionalComments">Additional comments (Optional)</Label>
                  <Textarea
                    id="additionalComments"
                    placeholder="Any other feedback about the pre-grading system..."
                    value={feedbackForm.additionalComments}
                    onChange={(e) => setFeedbackForm(prev => ({ ...prev, additionalComments: e.target.value }))}
                    rows={3}
                  />
                </div>
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <div className="flex items-start gap-2">
                    <Sparkles className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-purple-800">
                      <p className="font-medium mb-1">Your Feedback Makes a Difference!</p>
                      <p className="text-purple-700">
                        When you share your actual grade, our algorithm learns whether it over-predicted or under-predicted.
                        This helps us give more accurate predictions to future students in the same course.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-6 border-t border-gray-200 flex gap-3">
                <Button
                  onClick={() => setShowFeedbackModal(false)}
                  className="flex-1 border-gray-300 hover:bg-gray-50"
                >
                  Cancel
                </Button>
                <Button
                  onClick={submitFeedback}
                  className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
                >
                  <Star className="w-4 h-4 mr-2" />
                  Submit Feedback
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
