'use client'

import { useState, useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import { collectRequirementOptions, parseMeetingTime, TimeSlot, ScheduledCourse, hasTimeSlotsConflict } from '@/lib/scheduleCore'
import { motion, AnimatePresence, PanInfo } from 'framer-motion'
import { Clock, MapPin, Users, Star, BookOpen, Calculator, Users as GroupIcon, FlaskConical, X, RotateCcw, Heart, ChevronDown, ChevronUp, Filter, Check, AlertTriangle, Settings, MessageSquare, Beaker, FileText, Presentation, Clipboard } from 'lucide-react'

interface Course {
  course_code: string
  course_name: string
  credits: string | null
  meeting_time: string | null
  instructor: string | null
  room: string | null
  building: string | null
  status: string | null
  class_number: string
  gpa?: number
  requirement_name?: string
  requirement_names?: string[]
  isRequired?: boolean
  isCritical?: boolean
  fulfillsCurrentSemester?: boolean
  isCriticalForCurrentSemester?: boolean
  isCriticalFromEarlierSemester?: boolean
  isCriticalFromYear1?: boolean
  isCriticalFromYear1Fall?: boolean
  earliestYear?: number
}

interface CourseSection {
  class_number: string
  meeting_time: string
  instructor: string | null
  room: string | null
  building: string | null
  status: string | null
  open_seats?: number
  enrollment?: string
  capacity?: string
  class_size?: number
  enrolled?: number
  waitlist?: number
}

interface UserPreferences {
  major: string | null
  expected_graduation_year: number | null
  courses_taken: string[] | null
}

export default function Swipe({ userId }: { userId: string }) {
  const [preferences, setPreferences] = useState<UserPreferences | null>(null)
  const [courses, setCourses] = useState<Course[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedCourses, setSelectedCourses] = useState<ScheduledCourse[]>([])
  const [showClassModal, setShowClassModal] = useState(false)
  const [currentCourseSections, setCurrentCourseSections] = useState<CourseSection[]>([])
  const [currentCourseCode, setCurrentCourseCode] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [expandedDescription, setExpandedDescription] = useState<string | null>(null)
  const [passedCourses, setPassedCourses] = useState<number[]>([]) // Track passed course indices
  const [swipedCourses, setSwipedCourses] = useState<Set<string>>(new Set()) // Track all swiped courses (left or right)
  const [fulfilledRequirements, setFulfilledRequirements] = useState<Set<string>>(new Set()) // Track fulfilled requirement IDs
  const [courseDescriptions, setCourseDescriptions] = useState<Map<string, string>>(new Map()) // Cache course descriptions
  const [showConflictModal, setShowConflictModal] = useState(false)
  const [conflictingCourse, setConflictingCourse] = useState<ScheduledCourse | null>(null)
  const [newCourseToAdd, setNewCourseToAdd] = useState<ScheduledCourse | null>(null)
  const [showFilters, setShowFilters] = useState(false)
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)
  const [showTimeFilter, setShowTimeFilter] = useState(false)
  const [showOpenOnly, setShowOpenOnly] = useState(true)
  const [selectedTimes, setSelectedTimes] = useState<string[]>([])
  const [genEdFilter, setGenEdFilter] = useState<string[]>([])
  const [courseTypeFilter, setCourseTypeFilter] = useState<string[]>([])
  const [difficultyFilter, setDifficultyFilter] = useState<number[]>([])
  const cardRef = useRef<HTMLDivElement>(null)

  const fetchData = async (swipedSet?: Set<string>, fulfilledReqsSet?: Set<string>) => {
    const swipedToUse = swipedSet || swipedCourses
    const fulfilledReqsToUse = fulfilledReqsSet || fulfilledRequirements
    
    try {
      console.log('[Swipe] Starting fetchData for userId:', userId)
      // Fetch user preferences
      const { data: prefsData, error: prefsError } = await supabase
        .from('user_preferences')
        .select('major, expected_graduation_year, courses_taken')
        .eq('user_id', userId)
        .single()

      if (prefsError) {
        console.error('[Swipe] Error fetching preferences:', prefsError)
        setLoading(false)
        return
      }

      if (!prefsData?.major) {
        console.warn('[Swipe] No preferences or major found')
        setLoading(false)
        return
      }

      console.log('[Swipe] Preferences loaded:', { major: prefsData.major, coursesTaken: prefsData.courses_taken?.length || 0 })

      setPreferences(prefsData)

      // Get degree ID
      const { data: degreeData } = await supabase
        .from('degrees')
        .select('id')
        .eq('major_name', prefsData.major)
        .single()

      if (!degreeData) {
        setLoading(false)
        return
      }

      // Check if user has taken any courses
      const coursesTaken = (prefsData.courses_taken || []).length
      const hasTakenCourses = coursesTaken > 0

      // Calculate current semester
      const currentYear = new Date().getFullYear()
      const currentMonth = new Date().getMonth()
      const term = currentMonth >= 8 ? 'fall' : 'spring'

      // If user hasn't taken courses, start from Year 1 Fall
      // Otherwise, calculate based on graduation year
      let startYear = 1
      let startTerm = 'fall'
      
      if (!hasTakenCourses) {
        // User hasn't taken courses - start from Year 1 Fall
        startYear = 1
        startTerm = 'fall'
      } else {
        // User has taken courses - calculate current year
        if (prefsData.expected_graduation_year) {
          const yearsUntilGraduation = prefsData.expected_graduation_year - currentYear
          if (yearsUntilGraduation === 4) startYear = 1
          else if (yearsUntilGraduation === 3) startYear = 2
          else if (yearsUntilGraduation === 2) startYear = 3
          else if (yearsUntilGraduation === 1) startYear = 4
          else if (yearsUntilGraduation > 4) startYear = 1
          else startYear = 4
        }
        startTerm = term
      }

      // Always fetch requirements from Year 1 onwards to catch unfulfilled critical requirements
      // This ensures users see courses for unfulfilled requirements from earlier semesters
      const semestersToFetch: { year: number; term: string }[] = []
      
      // Always start from Year 1 to catch any unfulfilled requirements
      // Fetch up to 2 years ahead to provide good recommendations
      for (let year = 1; year <= Math.max(startYear + 1, 2); year++) {
        semestersToFetch.push({ year, term: 'fall' })
        semestersToFetch.push({ year, term: 'spring' })
      }
      
      console.log(`[Swipe] Fetching requirements from semesters:`, semestersToFetch.map(s => `Year ${s.year} ${s.term}`).join(', '))

      // Get all requirements from relevant semesters
      const allRequirements: any[] = []
      for (const sem of semestersToFetch) {
        const { data: reqs } = await supabase
          .from('degree_requirements')
          .select('*')
          .eq('degree_id', degreeData.id)
          .eq('year', sem.year)
          .eq('term', sem.term)
        
        if (reqs) {
          allRequirements.push(...reqs)
        }
      }

      // Get requirement fulfillments to map courses to requirements
      const requirementMap = new Map<string, { name: string; critical: boolean; year: number; term: string }[]>()
      
      for (const req of allRequirements) {
        const { data: fulfillments } = await supabase
          .from('requirement_fulfillments')
          .select('course_code')
          .eq('requirement_id', req.id)

        if (fulfillments) {
          fulfillments.forEach((f: any) => {
            if (!requirementMap.has(f.course_code)) {
              requirementMap.set(f.course_code, [])
            }
            requirementMap.get(f.course_code)!.push({
              name: req.requirement_name,
              critical: req.critical || false,
              year: req.year,
              term: req.term
            })
          })
        }
      }

      // Get ALL courses that fulfill any requirement
      // For each requirement, get ALL fulfilling courses (not just one)
      const allFulfillingCourseCodes = new Set<string>()
      
      // Check which requirements are already fulfilled
      // Include both courses from onboarding AND currently selected courses
      const coursesTakenSet = new Set((prefsData.courses_taken || []).map((c: string) => c.trim().toUpperCase()))
      
      // Also add currently selected courses to the taken set
      const scheduleKey = `generatedSchedule_${userId}`
      const savedSchedule = localStorage.getItem(scheduleKey)
      if (savedSchedule) {
        try {
          const parsed: ScheduledCourse[] = JSON.parse(savedSchedule)
          parsed.forEach((c: ScheduledCourse) => {
            const normalized = c.course_code.trim().toUpperCase()
            coursesTakenSet.add(normalized)
          })
        } catch (error) {
          console.error('Error loading schedule for requirement check:', error)
        }
      }
      
      // First, add courses for unfulfilled requirements (required courses)
      for (const req of allRequirements) {
        // Skip if this requirement is already fulfilled by selected courses
        if (fulfilledReqsToUse.has(req.id)) {
          continue
        }
        
        // Check if requirement is already fulfilled by taken courses OR selected courses
        const { data: fulfillments } = await supabase
          .from('requirement_fulfillments')
          .select('course_code')
          .eq('requirement_id', req.id)

        if (fulfillments) {
          // Check if any fulfilling course is already taken or selected
          const isFulfilled = fulfillments.some((f: any) => {
            const normalized = f.course_code.trim().toUpperCase()
            return coursesTakenSet.has(normalized)
          })

          // Only add courses if requirement is NOT fulfilled
          if (!isFulfilled) {
            fulfillments.forEach((f: any) => {
              const normalized = f.course_code.trim().toUpperCase()
              // Only add if not already taken or selected
              if (!coursesTakenSet.has(normalized)) {
                allFulfillingCourseCodes.add(f.course_code)
              }
            })
          }
        }
      }

      // Also add GenEd courses and electives from ALL semesters (not just current)
      // This allows students to take geneds even if not required this semester
      const { data: allDegreeReqs } = await supabase
        .from('degree_requirements')
        .select('*')
        .eq('degree_id', degreeData.id)
      
      if (allDegreeReqs) {
        // Find GenEd requirements (typically contain "GenEd" or "gened" in name)
        const genedReqs = allDegreeReqs.filter((req: any) => {
          const reqName = (req.requirement_name || '').toLowerCase()
          return reqName.includes('gened') || reqName.includes('gen ed') || 
                 reqName.includes('arts & humanities') || 
                 reqName.includes('social & historical') ||
                 reqName.includes('natural & mathematical') ||
                 reqName.includes('world languages') ||
                 reqName.includes('world cultures')
        })

        // Add courses that fulfill GenEd requirements (even if not required this semester)
        for (const req of genedReqs) {
          // Check if this GenEd is already fulfilled
          const isFulfilled = fulfilledReqsToUse.has(req.id)
          
          if (!isFulfilled) {
            const { data: fulfillments } = await supabase
              .from('requirement_fulfillments')
              .select('course_code')
              .eq('requirement_id', req.id)

            if (fulfillments) {
              fulfillments.forEach((f: any) => {
                const normalized = f.course_code.trim().toUpperCase()
                // Only add if not already taken or selected
                if (!coursesTakenSet.has(normalized)) {
                  allFulfillingCourseCodes.add(f.course_code)
                }
              })
            }
          }
        }

        // Also add elective courses (requirements with "elective" in name)
        const electiveReqs = allDegreeReqs.filter((req: any) => {
          const reqName = (req.requirement_name || '').toLowerCase()
          return reqName.includes('elective')
        })

        for (const req of electiveReqs) {
          const isFulfilled = fulfilledReqsToUse.has(req.id)
          
          if (!isFulfilled) {
            const { data: fulfillments } = await supabase
              .from('requirement_fulfillments')
              .select('course_code')
              .eq('requirement_id', req.id)

            if (fulfillments) {
              fulfillments.forEach((f: any) => {
                const normalized = f.course_code.trim().toUpperCase()
                if (!coursesTakenSet.has(normalized)) {
                  allFulfillingCourseCodes.add(f.course_code)
                }
              })
            }
          }
        }
      }
      
      console.log(`[Swipe] Found ${allFulfillingCourseCodes.size} courses for unfulfilled requirements`)
      console.log(`[Swipe] Fulfilled requirements: ${fulfilledReqsToUse.size}, Total requirements: ${allRequirements.length}`)
      
      if (allFulfillingCourseCodes.size === 0) {
        console.warn('[Swipe] No courses found! This could mean:')
        console.warn('  - All requirements are fulfilled')
        console.warn('  - No courses available for remaining requirements')
        console.warn('  - All courses are already taken/selected')
        setLoading(false)
        return
      }

      // Get all sections for these courses (including course_description)
      const { data: allSections } = await supabase
        .from('courses')
        .select('course_code, course_name, course_description, class_number, meeting_time, instructor, room, building, status, credits')
        .in('course_code', Array.from(allFulfillingCourseCodes))
        .not('meeting_time', 'is', null)
      
      // Cache course descriptions
      const descriptionsMap = new Map<string, string>()
      if (allSections) {
        for (const section of allSections) {
          if (section.course_description && !descriptionsMap.has(section.course_code)) {
            descriptionsMap.set(section.course_code, section.course_description)
          }
        }
      }
      setCourseDescriptions(descriptionsMap)

      if (!allSections || allSections.length === 0) {
        setLoading(false)
        return
      }

      // Filter out courses already taken and honors courses
      const availableSections = allSections.filter((c: any) => {
        const normalized = c.course_code.trim().toUpperCase()
        // Skip if already taken
        if (coursesTakenSet.has(normalized)) return false
        // Skip honors courses (check course name)
        const courseNameUpper = (c.course_name || '').toUpperCase()
        if (courseNameUpper.includes('HONORS') || courseNameUpper.includes('HONOR')) return false
        return true
      })

      // Get GPAs for all courses in bulk (much faster than individual requests)
      const uniqueCourseCodes = Array.from(new Set(availableSections.map((s: any) => s.course_code)))
      console.log(`[Swipe] Fetching GPAs for ${uniqueCourseCodes.length} unique courses in bulk...`)
      
      // Fetch all grade distributions at once
      const { data: allGrades, error: gradesError } = await supabase
        .from('grade_distributions')
        .select('course_code, avg_class_grade')
        .in('course_code', uniqueCourseCodes)
        .not('avg_class_grade', 'is', null)
        .limit(10000) // Reasonable limit for bulk fetch

      // Build GPA cache from bulk results
      const gpaCache = new Map<string, number>()
      if (allGrades && !gradesError) {
        // Group by course_code and calculate average
        const gradesByCourse = new Map<string, number[]>()
        allGrades.forEach((g: any) => {
          if (!gradesByCourse.has(g.course_code)) {
            gradesByCourse.set(g.course_code, [])
          }
          const grade = parseFloat(g.avg_class_grade || 0)
          if (grade > 0) {
            gradesByCourse.get(g.course_code)!.push(grade)
          }
        })

        // Calculate average GPA for each course
        gradesByCourse.forEach((grades, courseCode) => {
          const avgGPA = grades.reduce((sum, g) => sum + g, 0) / grades.length
          gpaCache.set(courseCode, avgGPA)
        })
        console.log(`[Swipe] Loaded GPAs for ${gpaCache.size} courses`)
      } else if (gradesError) {
        console.warn('[Swipe] Error fetching grade distributions:', gradesError)
      }

      // Map GPAs to sections
      const coursesWithGPA = availableSections.map((section: any) => {
        const gpa = gpaCache.get(section.course_code) || 0
        return { ...section, gpa }
      })

      // Group by course_code and get best section per course
      const courseMap = new Map<string, typeof coursesWithGPA>()
      for (const course of coursesWithGPA) {
        if (!courseMap.has(course.course_code)) {
          courseMap.set(course.course_code, [])
        }
        courseMap.get(course.course_code)!.push(course)
      }

      // Build courses list - one entry per course (best section)
      const coursesList: Course[] = []
      
      for (const [courseCode, sections] of courseMap.entries()) {
        // Skip if already swiped
        if (swipedToUse.has(courseCode)) continue

        // Sort sections by GPA (highest first), then by status (Open first)
        const sortedSections = [...sections].sort((a, b) => {
          // Prefer Open status
          if (a.status?.toLowerCase() === 'open' && b.status?.toLowerCase() !== 'open') return -1
          if (b.status?.toLowerCase() === 'open' && a.status?.toLowerCase() !== 'open') return 1
          // Then by GPA
          return (b.gpa || 0) - (a.gpa || 0)
        })

        const bestSection = sortedSections[0]
        const reqInfo = requirementMap.get(courseCode) || []
        const isRequired = reqInfo.length > 0
        const isCritical = reqInfo.some(r => r.critical)
        
        // Find the earliest unfulfilled semester this course fulfills
        // Prioritize courses that fulfill requirements from earlier semesters
        const reqYears = reqInfo.map(r => r.year)
        const earliestYear = reqYears.length > 0 ? Math.min(...reqYears) : 999
        
        // Check if this course fulfills a requirement for the current semester
        const fulfillsCurrentSemester = reqInfo.some(r => r.year === startYear && r.term === startTerm)
        const isCriticalForCurrentSemester = reqInfo.some(r => r.critical && r.year === startYear && r.term === startTerm)
        
        // Check if this course fulfills a critical requirement from an earlier semester (Year 1, Year 2, etc.)
        // This is important - prioritize critical requirements from Year 1 before GenEds
        const isCriticalFromEarlierSemester = reqInfo.some(r => r.critical && r.year < startYear)
        const isCriticalFromYear1 = reqInfo.some(r => r.critical && r.year === 1)
        const isCriticalFromYear1Fall = reqInfo.some(r => r.critical && r.year === 1 && r.term === 'fall')

        coursesList.push({
          course_code: courseCode,
          course_name: bestSection.course_name,
          credits: bestSection.credits,
          meeting_time: bestSection.meeting_time,
          instructor: bestSection.instructor,
          room: bestSection.room,
          building: bestSection.building,
          status: bestSection.status,
          class_number: bestSection.class_number,
          gpa: bestSection.gpa,
          requirement_names: reqInfo.map(r => r.name),
          isRequired,
          isCritical,
          fulfillsCurrentSemester,
          isCriticalForCurrentSemester,
          isCriticalFromEarlierSemester,
          isCriticalFromYear1,
          isCriticalFromYear1Fall,
          earliestYear
        })
      }

      // Sort by priority:
      // 1. Critical requirements from Year 1 Fall (highest priority - catch up on missed requirements)
      // 2. Critical requirements from Year 1 (any term)
      // 3. Critical requirements from earlier semesters (Year 2, etc.)
      // 4. Critical requirements for current semester
      // 5. Required courses for current semester
      // 6. Critical requirements for future semesters
      // 7. Required courses for future semesters
      // 8. Then by earliest year (earlier semesters first)
      // 9. Then by GPA (highest first)
      coursesList.sort((a, b) => {
        // Priority 1: Critical from Year 1 Fall (most important - catch up)
        if (a.isCriticalFromYear1Fall !== b.isCriticalFromYear1Fall) {
          return b.isCriticalFromYear1Fall ? 1 : -1
        }
        
        // Priority 2: Critical from Year 1 (any term)
        if (a.isCriticalFromYear1 !== b.isCriticalFromYear1) {
          return b.isCriticalFromYear1 ? 1 : -1
        }
        
        // Priority 3: Critical from earlier semesters (before current)
        if (a.isCriticalFromEarlierSemester !== b.isCriticalFromEarlierSemester) {
          return b.isCriticalFromEarlierSemester ? 1 : -1
        }
        
        // Priority 4: Critical for current semester
        if (a.isCriticalForCurrentSemester !== b.isCriticalForCurrentSemester) {
          return b.isCriticalForCurrentSemester ? 1 : -1
        }
        
        // Priority 5: Required for current semester
        if (a.fulfillsCurrentSemester !== b.fulfillsCurrentSemester) {
          return b.fulfillsCurrentSemester ? 1 : -1
        }
        
        // Priority 6: Critical (any semester)
        if (a.isCritical !== b.isCritical) {
          return b.isCritical ? 1 : -1
        }
        
        // Priority 7: Required (any semester)
        if (a.isRequired !== b.isRequired) {
          return b.isRequired ? 1 : -1
        }
        
        // Priority 8: Earlier semesters first (catch up on missed requirements)
        if (a.earliestYear !== b.earliestYear) {
          return (a.earliestYear ?? 999) - (b.earliestYear ?? 999)
        }
        
        // Priority 9: GPA (highest first)
        return (b.gpa || 0) - (a.gpa || 0)
      })

      // Log prioritization stats
      const criticalYear1Fall = coursesList.filter(c => c.isCriticalFromYear1Fall).length
      const criticalYear1 = coursesList.filter(c => c.isCriticalFromYear1 && !c.isCriticalFromYear1Fall).length
      const criticalEarlier = coursesList.filter(c => c.isCriticalFromEarlierSemester && !c.isCriticalFromYear1).length
      const criticalCurrent = coursesList.filter(c => c.isCriticalForCurrentSemester).length
      const requiredCurrent = coursesList.filter(c => c.fulfillsCurrentSemester && !c.isCriticalForCurrentSemester).length
      console.log(`[Swipe] Loaded ${coursesList.length} courses (filtered ${swipedToUse.size} already swiped)`)
      console.log(`[Swipe] Prioritization breakdown:`)
      console.log(`  - ${criticalYear1Fall} critical from Year 1 Fall (highest priority)`)
      console.log(`  - ${criticalYear1} critical from Year 1 (other terms)`)
      console.log(`  - ${criticalEarlier} critical from earlier semesters`)
      console.log(`  - ${criticalCurrent} critical for current semester (Year ${startYear} ${startTerm})`)
      console.log(`  - ${requiredCurrent} required for current semester`)
      if (coursesList.length > 0) {
        const first = coursesList[0]
        console.log(`[Swipe] First course: ${first.course_code}`)
        console.log(`  - Critical Year 1 Fall: ${first.isCriticalFromYear1Fall}`)
        console.log(`  - Critical Year 1: ${first.isCriticalFromYear1}`)
        console.log(`  - Critical Earlier: ${first.isCriticalFromEarlierSemester}`)
        console.log(`  - Critical Current: ${first.isCriticalForCurrentSemester}`)
        console.log(`  - Required Current: ${first.fulfillsCurrentSemester}`)
        console.log(`  - Earliest Year: ${first.earliestYear}`)
      }
      setCourses(coursesList)
      setLoading(false)
    } catch (error: any) {
      console.error('[Swipe] Error fetching courses:', error)
      console.error('[Swipe] Error details:', {
        message: error?.message,
        stack: error?.stack,
        userId
      })
      setLoading(false)
      // Set empty courses so user sees "No courses available" instead of infinite loading
      setCourses([])
    }
  }

  const loadInitialData = async () => {
    // Load swiped courses FIRST (both left and right) from localStorage
    const swipedKey = `swipedCourses_${userId}`
    const savedSwiped = localStorage.getItem(swipedKey)
    let initialSwiped = new Set<string>()
    
    if (savedSwiped) {
      try {
        const swipedArray = JSON.parse(savedSwiped)
        initialSwiped = new Set(swipedArray)
      } catch (error) {
        console.error('Error loading swiped courses:', error)
      }
    }
    
    // Load fulfilled requirements from localStorage first
    const fulfilledReqsKey = `fulfilledRequirements_${userId}`
    const savedFulfilledReqs = localStorage.getItem(fulfilledReqsKey)
    let initialFulfilledReqs = new Set<string>()
    
    if (savedFulfilledReqs) {
      try {
        const fulfilledReqsArray = JSON.parse(savedFulfilledReqs)
        initialFulfilledReqs = new Set(fulfilledReqsArray)
      } catch (error) {
        console.error('Error loading fulfilled requirements:', error)
      }
    }
    
    // Load existing selected courses from localStorage
    const scheduleKey = `generatedSchedule_${userId}`
    const savedSchedule = localStorage.getItem(scheduleKey)
    
    if (savedSchedule) {
      try {
        const parsed = JSON.parse(savedSchedule)
        setSelectedCourses(parsed)
        // Track selected courses as swiped
        parsed.forEach((c: ScheduledCourse) => {
          initialSwiped.add(c.course_code)
        })
        
        // If we don't have fulfilled requirements saved, fetch them from selected courses
        if (initialFulfilledReqs.size === 0) {
          const fulfilledReqs = await getFulfilledRequirementsFromCourses(parsed.map((c: ScheduledCourse) => c.course_code))
          initialFulfilledReqs = new Set(fulfilledReqs)
          // Save to localStorage
          localStorage.setItem(fulfilledReqsKey, JSON.stringify(Array.from(initialFulfilledReqs)))
        }
      } catch (error) {
        console.error('Error loading saved schedule:', error)
      }
    }
    
    // Set swiped courses state
    setSwipedCourses(initialSwiped)
    setFulfilledRequirements(initialFulfilledReqs)
    
    // Now fetch data with the loaded swiped set and fulfilled requirements
    fetchData(initialSwiped, initialFulfilledReqs)
  }

  useEffect(() => {
    loadInitialData()
    
    // Listen for course deletion events
    const handleCourseDeleted = async (event: Event) => {
      const customEvent = event as CustomEvent
      if (customEvent.detail?.userId === userId) {
        // Reload data to refresh the course list
        await loadInitialData()
        // Reset to first course
        setCurrentIndex(0)
      }
    }
    
    window.addEventListener('courseDeleted', handleCourseDeleted)
    
    return () => {
      window.removeEventListener('courseDeleted', handleCourseDeleted)
    }
  }, [userId])

  // Helper function to get requirement IDs fulfilled by a list of course codes
  const getFulfilledRequirementsFromCourses = async (courseCodes: string[]): Promise<string[]> => {
    if (courseCodes.length === 0) return []
    
    try {
      const { data: fulfillments } = await supabase
        .from('requirement_fulfillments')
        .select('requirement_id')
        .in('course_code', courseCodes)
      
      if (fulfillments) {
        return Array.from(new Set(fulfillments.map((f: any) => f.requirement_id)))
      }
    } catch (error) {
      console.error('Error getting fulfilled requirements:', error)
    }
    return []
  }

  const handleSwipe = async (direction: 'left' | 'right') => {
    const filtered = getFilteredCourses()
    if (currentIndex >= filtered.length || filtered.length === 0) return

    const currentCourse = filtered[currentIndex]

    // Track swiped course
    const newSwiped = new Set(swipedCourses)
    newSwiped.add(currentCourse.course_code)
    setSwipedCourses(newSwiped)
    
    // Save to localStorage
    const swipedKey = `swipedCourses_${userId}`
    localStorage.setItem(swipedKey, JSON.stringify(Array.from(newSwiped)))

    if (direction === 'right') {
      // User wants to add this course - show class selection modal
      await fetchCourseSections(currentCourse.course_code)
      setCurrentCourseCode(currentCourse.course_code)
      setShowClassModal(true)
    } else {
      // User passed - track and move to next course
      setPassedCourses(prev => [...prev, currentIndex])
      setCurrentIndex(prev => {
        const nextIndex = prev + 1
        const filtered = getFilteredCourses()
        return nextIndex >= filtered.length ? 0 : nextIndex
      })
    }
  }

  const handleUndo = () => {
    if (passedCourses.length > 0) {
      // Go back to the last passed course
      const lastPassedIndex = passedCourses[passedCourses.length - 1]
      setPassedCourses(prev => prev.slice(0, -1))
      setCurrentIndex(lastPassedIndex)
    } else if (currentIndex > 0) {
      // If no passed courses tracked, just go back one
      setCurrentIndex(prev => prev - 1)
    }
  }

  const fetchCourseSections = async (courseCode: string) => {
    try {
      const { data: sections } = await supabase
        .from('courses')
        .select('class_number, meeting_time, instructor, room, building, status, open_seats')
        .eq('course_code', courseCode)
        .order('class_number')

      if (sections && sections.length > 0) {
        // Calculate enrollment info from open_seats
        const sectionsWithEnrollment: CourseSection[] = sections.map((s: any) => {
          // Estimate class size and enrolled from open_seats
          // If open_seats is available, we can estimate: class_size = open_seats + enrolled
          // For now, use reasonable defaults based on status
          let classSize = 120 // Default class size
          let enrolled = 87 // Default enrolled
          let waitlist = 0
          
          if (s.open_seats !== null && s.open_seats !== undefined) {
            // If we have open_seats, estimate total capacity
            const statusLower = (s.status || '').toLowerCase()
            if (statusLower === 'open') {
              // Estimate: if 33 spots left, then enrolled = capacity - open_seats
              classSize = Math.max(120, s.open_seats + 87) // At least 120, or open_seats + reasonable enrolled
              enrolled = classSize - s.open_seats
            } else if (statusLower === 'waitlist') {
              classSize = 100 // Full capacity
              enrolled = classSize
              waitlist = s.open_seats || 15 // Use open_seats as waitlist count if available
            } else {
              // Closed/Full
              classSize = 80
              enrolled = classSize
            }
          }
          
          return {
            class_number: s.class_number,
            meeting_time: s.meeting_time || '',
            instructor: s.instructor,
            room: s.room,
            building: s.building,
            status: s.status,
            open_seats: s.open_seats,
            class_size: classSize,
            enrolled: enrolled,
            waitlist: waitlist
          }
        })
        setCurrentCourseSections(sectionsWithEnrollment)
      } else {
        // If no sections found, show error or use current course's section
        const filtered = getFilteredCourses()
        const currentCourse = filtered[currentIndex]
        if (currentCourse) {
          setCurrentCourseSections([{
            class_number: currentCourse.class_number,
            meeting_time: currentCourse.meeting_time || '',
            instructor: currentCourse.instructor,
            room: currentCourse.room,
            building: currentCourse.building,
            status: currentCourse.status,
            class_size: 120,
            enrolled: 87,
            waitlist: 0
          }])
        }
      }
    } catch (error) {
      console.error('Error fetching sections:', error)
      // Fallback to current course section
      const filtered = getFilteredCourses()
      const currentCourse = filtered[currentIndex]
      if (currentCourse) {
        setCurrentCourseSections([{
          class_number: currentCourse.class_number,
          meeting_time: currentCourse.meeting_time || '',
          instructor: currentCourse.instructor,
          room: currentCourse.room,
          building: currentCourse.building,
          status: currentCourse.status,
          class_size: 120,
          enrolled: 87,
          waitlist: 0
        }])
      }
    }
  }

  const handleSelectClass = async (section: CourseSection) => {
    try {
      // Get full course details
      const { data: courseData } = await supabase
        .from('courses')
        .select('*')
        .eq('course_code', currentCourseCode)
        .eq('class_number', section.class_number)
        .single()

      if (!courseData) return

      // Get GPA
      const { data: grades } = await supabase
        .from('grade_distributions')
        .select('avg_class_grade')
        .eq('course_code', currentCourseCode)
        .not('avg_class_grade', 'is', null)
        .limit(100)

      const gpa = grades && grades.length > 0
        ? grades.reduce((sum: number, g: any) => sum + parseFloat(g.avg_class_grade || 0), 0) / grades.length
        : 0

      // Get requirement names
      const currentCourse = courses[currentIndex]
      const requirementNames = currentCourse.requirement_names || []

      // Parse time slots
      const timeSlots = parseMeetingTime(courseData.meeting_time)

      // Create scheduled course
      const scheduledCourse: ScheduledCourse = {
        ...courseData,
        gpa,
        requirement_name: requirementNames[0] || undefined,
        timeSlots
      }

      // Check if course already exists (by course_code and class_number)
      const alreadyExists = selectedCourses.some(
        c => c.course_code === scheduledCourse.course_code && 
             c.class_number === scheduledCourse.class_number
      )

      if (alreadyExists) {
        alert('This course section is already in your schedule')
        setShowClassModal(false)
        return
      }

      // Check for time conflicts
      if (hasTimeSlotsConflict(timeSlots, selectedCourses)) {
        // Find the conflicting course
        let conflicting: ScheduledCourse | null = null
        for (const existingCourse of selectedCourses) {
          if (!existingCourse.timeSlots || existingCourse.timeSlots.length === 0) continue
          
          for (const existingSlot of existingCourse.timeSlots) {
            for (const courseSlot of timeSlots) {
              const commonDays = existingSlot.days.filter(day => courseSlot.days.includes(day))
              if (commonDays.length > 0) {
                if (existingSlot.startTime < courseSlot.endTime && courseSlot.startTime < existingSlot.endTime) {
                  conflicting = existingCourse
                  break
                }
              }
            }
            if (conflicting) break
          }
          if (conflicting) break
        }

        if (conflicting) {
          // Show conflict resolution modal
          setConflictingCourse(conflicting)
          setNewCourseToAdd(scheduledCourse)
          setShowConflictModal(true)
          setShowClassModal(false)
          return
        }
      }

      // No conflict - proceed with normal addition
      await addCourseToSchedule(scheduledCourse)

      // Close modal and move to next course
      setShowClassModal(false)
      setCurrentIndex(prev => prev + 1)
    } catch (error) {
      console.error('Error selecting class:', error)
    }
  }

  const handleConflictResolution = async (keepNew: boolean) => {
    if (!conflictingCourse || !newCourseToAdd) return

    if (keepNew) {
      // Delete the conflicting course and add the new one
      await deleteCourseFromSchedule(conflictingCourse)
      await addCourseToSchedule(newCourseToAdd)
    }
    // If keepNew is false, we just close the modal (keep the existing course)

    setShowConflictModal(false)
    setConflictingCourse(null)
    setNewCourseToAdd(null)
    setShowClassModal(false)
    setCurrentIndex(prev => prev + 1)
  }

  const deleteCourseFromSchedule = async (courseToDelete: ScheduledCourse) => {
    // Remove course from schedule
    const scheduleKey = `generatedSchedule_${userId}`
    const savedSchedule = localStorage.getItem(scheduleKey)
    if (savedSchedule) {
      const parsed: ScheduledCourse[] = JSON.parse(savedSchedule)
      const updatedSchedule = parsed.filter(
        c => !(c.course_code === courseToDelete.course_code && c.class_number === courseToDelete.class_number)
      )
      
      // Save updated schedule
      localStorage.setItem(scheduleKey, JSON.stringify(updatedSchedule))
      setSelectedCourses(updatedSchedule)
      
      // Get requirements that this course fulfilled
      const { data: fulfillments } = await supabase
        .from('requirement_fulfillments')
        .select('requirement_id')
        .eq('course_code', courseToDelete.course_code)
      
      const fulfilledReqIds = fulfillments ? fulfillments.map((f: any) => f.requirement_id) : []
      
      // Remove from swiped courses
      const swipedKey = `swipedCourses_${userId}`
      const savedSwiped = localStorage.getItem(swipedKey)
      if (savedSwiped) {
        const swipedArray: string[] = JSON.parse(savedSwiped)
        const updatedSwiped = swipedArray.filter(code => code !== courseToDelete.course_code)
        localStorage.setItem(swipedKey, JSON.stringify(updatedSwiped))
        setSwipedCourses(new Set(updatedSwiped))
      }
      
      // Remove fulfilled requirements
      const fulfilledReqsKey = `fulfilledRequirements_${userId}`
      const savedFulfilledReqs = localStorage.getItem(fulfilledReqsKey)
      if (savedFulfilledReqs) {
        const fulfilledReqsArray: string[] = JSON.parse(savedFulfilledReqs)
        const updatedFulfilledReqs = fulfilledReqsArray.filter(reqId => !fulfilledReqIds.includes(reqId))
        localStorage.setItem(fulfilledReqsKey, JSON.stringify(updatedFulfilledReqs))
        setFulfilledRequirements(new Set(updatedFulfilledReqs))
      }
      
      // Dispatch event to update other components
      window.dispatchEvent(new CustomEvent('courseDeleted', { 
        detail: { 
          userId,
          courseCode: courseToDelete.course_code,
          fulfilledReqIds
        } 
      }))
    }
  }

  const addCourseToSchedule = async (scheduledCourse: ScheduledCourse) => {
    // Get requirement IDs that this course fulfills
    const { data: fulfillments } = await supabase
      .from('requirement_fulfillments')
      .select('requirement_id')
      .eq('course_code', scheduledCourse.course_code)

    const newFulfilledReqIds = fulfillments ? fulfillments.map((f: any) => f.requirement_id) : []
    
    // Add to selected courses
    const updatedSchedule = [...selectedCourses, scheduledCourse]
    setSelectedCourses(updatedSchedule)

    // Save to localStorage
    const scheduleKey = `generatedSchedule_${userId}`
    localStorage.setItem(scheduleKey, JSON.stringify(updatedSchedule))
    
    // Track as swiped and update state immediately
    const swipedKey = `swipedCourses_${userId}`
    const currentSwiped = new Set(swipedCourses)
    currentSwiped.add(scheduledCourse.course_code)
    setSwipedCourses(currentSwiped)
    localStorage.setItem(swipedKey, JSON.stringify(Array.from(currentSwiped)))
    
    // Update fulfilled requirements
    const newFulfilledReqs = new Set(fulfilledRequirements)
    newFulfilledReqIds.forEach((reqId: any) => newFulfilledReqs.add(reqId))
    setFulfilledRequirements(newFulfilledReqs)
    
    // Save fulfilled requirements to localStorage
    const fulfilledReqsKey = `fulfilledRequirements_${userId}`
    localStorage.setItem(fulfilledReqsKey, JSON.stringify(Array.from(newFulfilledReqs)))
    
    // Remove this course and all courses that fulfill the same requirements from the current list
    const coursesToRemove = new Set<string>([scheduledCourse.course_code])
    
    // Find all other courses that fulfill the same requirements
    if (newFulfilledReqIds.length > 0) {
      const { data: otherFulfillments } = await supabase
        .from('requirement_fulfillments')
        .select('course_code')
        .in('requirement_id', newFulfilledReqIds)
        .neq('course_code', scheduledCourse.course_code)
      
      if (otherFulfillments) {
        otherFulfillments.forEach((f: any) => {
          coursesToRemove.add(f.course_code)
        })
      }
    }
    
    // Remove all courses that fulfill the same requirements
    setCourses(prev => prev.filter(c => !coursesToRemove.has(c.course_code)))
    
    window.dispatchEvent(new CustomEvent('scheduleUpdated', { detail: { userId } }))
  }

  const handleDragEnd = (event: any, info: PanInfo) => {
    const swipeThreshold = 50
    if (Math.abs(info.offset.x) > swipeThreshold) {
      handleSwipe(info.offset.x > 0 ? 'right' : 'left')
    }
  }

  const getStatusColor = (status: string | null) => {
    const statusLower = (status || 'open').toLowerCase()
    if (statusLower === 'open') return 'bg-green-100 text-green-800 border-green-300'
    if (statusLower === 'waitlist') return 'bg-yellow-100 text-yellow-800 border-yellow-300'
    if (statusLower === 'closed' || statusLower === 'full') return 'bg-red-100 text-red-800 border-red-300'
    return 'bg-gray-100 text-gray-800 border-gray-300'
  }

  const getStatusIcon = (status: string | null) => {
    const statusLower = (status || 'open').toLowerCase()
    if (statusLower === 'open') return <div className="w-3 h-3 rounded-full bg-green-500"></div>
    if (statusLower === 'waitlist') return <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
    if (statusLower === 'closed' || statusLower === 'full') return <div className="w-3 h-3 rounded-full bg-red-500"></div>
    return <div className="w-3 h-3 rounded-full bg-gray-500"></div>
  }

  const formatTime = (meetingTime: string | null): string => {
    if (!meetingTime) return 'TBA'
    // Extract time portion
    const timeMatch = meetingTime.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i)
    if (timeMatch) {
      return `${timeMatch[1]}:${timeMatch[2]} ${timeMatch[3]}`
    }
    return meetingTime
  }

  // Convert GPA (4.0 scale) to letter grade
  const gpaToLetterGrade = (gpa: number | undefined): string => {
    if (!gpa || gpa === 0) return ''
    
    if (gpa >= 4.0) return 'A'
    if (gpa >= 3.7) return 'A-'
    if (gpa >= 3.3) return 'B+'
    if (gpa >= 3.0) return 'B'
    if (gpa >= 2.7) return 'B-'
    if (gpa >= 2.3) return 'C+'
    if (gpa >= 2.0) return 'C'
    if (gpa >= 1.7) return 'C-'
    if (gpa >= 1.3) return 'D+'
    if (gpa >= 1.0) return 'D'
    if (gpa >= 0.0) return 'F'
    return ''
  }

  // Filter courses based on all criteria
  const getFilteredCourses = () => {
    let filtered = courses.filter(course => {
      // Time filter
      if (selectedTimes.length > 0 && course.meeting_time) {
        const timeStr = course.meeting_time.toUpperCase()
        const matchesTime = selectedTimes.some(timeRange => {
          if (timeRange === 'morning') {
            return timeStr.includes('8:') || timeStr.includes('9:') || timeStr.includes('10:') || timeStr.includes('11:')
          } else if (timeRange === 'afternoon') {
            return timeStr.includes('12:') || timeStr.includes('1:') || timeStr.includes('2:') || timeStr.includes('3:') || timeStr.includes('4:')
          } else if (timeRange === 'evening') {
            return timeStr.includes('5:') || timeStr.includes('6:') || timeStr.includes('7:') || timeStr.includes('8:')
          } else if (timeRange === 'mwf') {
            return timeStr.includes('MWF') || timeStr.includes('MW') || timeStr.includes('M ') || timeStr.includes('MONDAY')
          } else if (timeRange === 'tr') {
            return timeStr.includes('TR') || timeStr.includes('T ') || timeStr.includes('TUESDAY')
          }
          return false
        })
        if (!matchesTime) return false
      }

      // Open only filter
      if (showOpenOnly && course.status?.toLowerCase() !== 'open') {
        return false
      }

      // GenEd filter
      if (genEdFilter.length > 0 && course.requirement_names) {
        const matchesGenEd = genEdFilter.some(genEd => 
          course.requirement_names?.some(req => req.toLowerCase().includes(genEd.toLowerCase()))
        )
        if (!matchesGenEd) return false
      }

      // Difficulty filter
      if (difficultyFilter.length > 0) {
        // Estimate difficulty from GPA (lower GPA = higher difficulty)
        const estimatedDifficulty = course.gpa ? Math.max(1, Math.min(5, Math.round(5 - (course.gpa / 4.0 * 4)))) : 3
        if (!difficultyFilter.includes(estimatedDifficulty)) return false
      }

      return true
    })

    return filtered
  }

  const availableCourses = getFilteredCourses()
  
  // Ensure currentIndex is within bounds
  useEffect(() => {
    if (currentIndex >= availableCourses.length && availableCourses.length > 0) {
      setCurrentIndex(0)
    }
  }, [availableCourses.length, currentIndex])
  
  const currentCourse = availableCourses[currentIndex]

  // Get enrollment status info
  const getEnrollmentStatus = (status: string | null) => {
    const statusLower = (status || 'open').toLowerCase()
    if (statusLower === 'open') {
      return {
        color: 'text-green-600 bg-green-100',
        icon: Check,
        text: 'Open',
        badgeText: 'Open'
      }
    } else if (statusLower === 'waitlist') {
      return {
        color: 'text-yellow-600 bg-yellow-100',
        icon: AlertTriangle,
        text: 'Waitlist',
        badgeText: 'Waitlist'
      }
    } else {
      return {
        color: 'text-red-600 bg-red-100',
        icon: X,
        text: 'Closed',
        badgeText: 'Closed'
      }
    }
  }

  // Check time conflicts
  const checkTimeConflicts = (meetingTime: string | null, existingCourses: ScheduledCourse[]): ScheduledCourse[] => {
    const conflicts: ScheduledCourse[] = []
    const newTimeSlots = parseMeetingTime(meetingTime)
    
    for (const course of existingCourses) {
      if (hasTimeSlotsConflict(newTimeSlots, [course])) {
        conflicts.push(course)
      }
    }
    
    return conflicts
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-gray-700">Loading courses...</div>
      </div>
    )
  }

  if (courses.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <p className="text-xl font-bold text-gray-800 mb-2">No Courses Available</p>
          <p className="text-gray-600">Complete your onboarding to see course recommendations</p>
        </div>
      </div>
    )
  }

  if (!currentCourse || availableCourses.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white pb-20">
        <div className="text-center p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            {showOpenOnly ? 'No more open courses!' : 'All caught up!'}
          </h3>
          <p className="text-gray-600 mb-4">
            {showOpenOnly 
              ? 'Try disabling "Show only open classes" to see more options.'
              : "You've seen all available courses."
            }
          </p>
          {showOpenOnly && (
            <button
              onClick={() => setShowOpenOnly(false)}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 mb-4"
            >
              Show All Courses
            </button>
          )}
          <p className="text-sm text-gray-500">
            Check your calendar tab to see your selected courses.
          </p>
        </div>
      </div>
    )
  }

  const timeSlots = currentCourse.meeting_time ? parseMeetingTime(currentCourse.meeting_time) : []
  const enrollmentStatus = getEnrollmentStatus(currentCourse.status)
  const StatusIcon = enrollmentStatus.icon

  return (
    <div className="min-h-screen pb-20 bg-white flex flex-col p-4">
      {/* Header with Filters */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-800 text-center mb-4">Find Your Perfect Classes</h2>
        <div className="flex items-center justify-end space-x-2">
          {/* Time Filter Button */}
          <button
            onClick={() => setShowTimeFilter(!showTimeFilter)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Clock className="w-5 h-5 text-gray-600" />
          </button>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Filter className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Time Filter Panel */}
      {showTimeFilter && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg"
        >
          <label className="text-sm text-blue-800 mb-3 block font-medium">Select Preferred Times</label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { value: 'morning', label: 'Morning (8-12 PM)' },
              { value: 'afternoon', label: 'Afternoon (12-5 PM)' },
              { value: 'evening', label: 'Evening (5+ PM)' },
              { value: 'mwf', label: 'MWF Classes' },
              { value: 'tr', label: 'TR Classes' }
            ].map(time => (
              <div key={time.value} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id={time.value}
                  checked={selectedTimes.includes(time.value)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedTimes(prev => [...prev, time.value])
                    } else {
                      setSelectedTimes(prev => prev.filter(item => item !== time.value))
                    }
                  }}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor={time.value} className="text-sm text-blue-700 cursor-pointer">{time.label}</label>
              </div>
            ))}
          </div>
          {selectedTimes.length > 0 && (
            <button
              onClick={() => setSelectedTimes([])}
              className="mt-3 text-sm text-blue-600 hover:text-blue-700"
            >
              Clear Time Filters
            </button>
          )}
        </motion.div>
      )}

      {/* Advanced Filters Panel */}
      {showFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mb-4 p-4 bg-gray-50 rounded-lg space-y-4"
        >
          <div className="flex items-center justify-between">
            <label htmlFor="open-only" className="text-sm text-gray-700">Show only open classes</label>
            <input
              type="checkbox"
              id="open-only"
              checked={showOpenOnly}
              onChange={(e) => setShowOpenOnly(e.target.checked)}
              className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
            />
          </div>

          <button
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 flex items-center justify-center gap-2"
          >
            <Settings className="w-4 h-4" />
            {showAdvancedFilters ? 'Hide' : 'Show'} Advanced Filters
          </button>

          {showAdvancedFilters && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4 pt-4 border-t border-gray-200"
            >
              {/* Gen Ed Filter */}
              <div>
                <label className="text-sm text-gray-700 mb-2 block">General Education</label>
                <div className="mt-2 space-y-2">
                  {['Math', 'Science', 'English', 'Social Science', 'Arts'].map(genEd => (
                    <div key={genEd} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={genEd}
                        checked={genEdFilter.includes(genEd)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setGenEdFilter(prev => [...prev, genEd])
                          } else {
                            setGenEdFilter(prev => prev.filter(item => item !== genEd))
                          }
                        }}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded"
                      />
                      <label htmlFor={genEd} className="text-sm text-gray-700 cursor-pointer">{genEd}</label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Difficulty Filter */}
              <div>
                <label className="text-sm text-gray-700 mb-2 block">Difficulty Level</label>
                <div className="mt-2 flex space-x-2">
                  {[1, 2, 3, 4, 5].map(level => (
                    <button
                      key={level}
                      onClick={() => {
                        if (difficultyFilter.includes(level)) {
                          setDifficultyFilter(prev => prev.filter(item => item !== level))
                        } else {
                          setDifficultyFilter(prev => [...prev, level])
                        }
                      }}
                      className={`w-10 h-10 rounded-lg border-2 ${
                        difficultyFilter.includes(level)
                          ? 'bg-red-600 text-white border-red-600'
                          : 'bg-white text-gray-700 border-gray-300 hover:border-red-500'
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              {/* Clear Filters */}
              <button
                onClick={() => {
                  setGenEdFilter([])
                  setCourseTypeFilter([])
                  setDifficultyFilter([])
                  setSelectedTimes([])
                }}
                className="w-full px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg border border-red-200"
              >
                Clear All Filters
              </button>
            </motion.div>
          )}
        </motion.div>
      )}

      <div className="text-center mb-4">
        <p className="text-gray-600 text-sm">Swipe right to add, left to pass</p>
        {selectedCourses.length > 0 && (
          <p className="text-sm text-red-600 mt-1">
            {selectedCourses.length} course{selectedCourses.length === 1 ? '' : 's'} added to schedule
          </p>
        )}
      </div>

      {/* Course Card */}
      <div className="flex-1 flex items-center justify-center">
        <motion.div
          ref={cardRef}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          onDragEnd={handleDragEnd}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="relative w-full max-w-sm bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden cursor-grab active:cursor-grabbing"
        >
          {/* Degree Progress Badge */}
          {currentCourse.isRequired && (
            <div className="absolute top-4 right-4 z-10">
              <div className={`px-3 py-1 rounded-full text-sm font-bold ${
                currentCourse.isCritical 
                  ? 'bg-red-600 text-white' 
                  : 'bg-blue-600 text-white'
              }`}>
                {currentCourse.isCritical ? 'CRITICAL' : 'REQUIRED'}
              </div>
            </div>
          )}

          <div className="p-6">
            {/* Course Header */}
            <div className="mb-4">
              <div className="flex items-center space-x-2 mb-2">
                <span className="px-2 py-1 border border-gray-300 rounded text-xs font-medium">{currentCourse.course_code}</span>
                {currentCourse.credits && (
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">{currentCourse.credits} credits</span>
                )}
                <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">Fall 2024</span>
              </div>
              <h2 className="text-xl font-bold text-gray-800 mb-1">{currentCourse.course_name}</h2>
              {currentCourse.instructor && (
                <p className="text-gray-600 text-sm">Professor: {currentCourse.instructor}</p>
              )}
            </div>

            {/* Primary Time Slot Display */}
            {currentCourse.meeting_time && (
              <div className="mb-4">
                <div className={`flex items-center justify-between p-3 rounded-lg border ${
                  enrollmentStatus.text === 'Open' ? 'border-green-200 bg-green-50' :
                  enrollmentStatus.text === 'Waitlist' ? 'border-yellow-200 bg-yellow-50' :
                  'border-red-200 bg-red-50'
                }`}>
                  <div className="flex items-center space-x-2">
                    <StatusIcon className="w-4 h-4" />
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-sm">{enrollmentStatus.text}</span>
                        <span className={`px-2 py-0.5 rounded text-xs ${enrollmentStatus.color}`}>
                          {enrollmentStatus.badgeText}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Course Details */}
            <div className="space-y-3 mb-4">
              {currentCourse.meeting_time && (
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">
                    {timeSlots.length > 0 
                      ? timeSlots.map((slot, i) => (
                          <span key={i}>
                            {slot.days.join(', ')} {formatTime(currentCourse.meeting_time)}
                            {i < timeSlots.length - 1 && ', '}
                          </span>
                        ))
                      : currentCourse.meeting_time}
                  </span>
                </div>
              )}
              {currentCourse.building && currentCourse.room && (
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">{currentCourse.building} {currentCourse.room}</span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              {currentCourse.gpa && currentCourse.gpa > 0 && (
                <>
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-1 mb-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="font-bold text-gray-800">{currentCourse.gpa.toFixed(1)}</span>
                    </div>
                    <p className="text-xs text-gray-500">Professor Rating</p>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-gray-800 mb-1">{gpaToLetterGrade(currentCourse.gpa)}</div>
                    <p className="text-xs text-gray-500">Average Grade</p>
                  </div>
                </>
              )}
            </div>

            <div className="mb-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-gray-600">Difficulty</span>
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((level) => {
                    // Estimate difficulty from GPA (lower GPA = higher difficulty)
                    const estimatedDifficulty = currentCourse.gpa ? Math.max(1, Math.min(5, Math.round(5 - (currentCourse.gpa / 4.0 * 4)))) : 3
                    return (
                      <div
                        key={level}
                        className={`w-2 h-2 rounded-full ${
                          level <= estimatedDifficulty ? 'bg-red-500' : 'bg-gray-200'
                        }`}
                      />
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Requirements Fulfilled */}
            {currentCourse.requirement_names && currentCourse.requirement_names.length > 0 && (
              <div className="mb-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-sm text-blue-800 font-medium">
                      Fulfills: {currentCourse.requirement_names.join(', ')}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Course Description */}
            {courseDescriptions.has(currentCourse.course_code) && (
              <div className="mb-4">
                <p className={`text-sm text-gray-600 leading-relaxed ${expandedDescription === currentCourse.course_code ? '' : 'line-clamp-3'}`}>
                  {courseDescriptions.get(currentCourse.course_code)}
                </p>
                {courseDescriptions.get(currentCourse.course_code) && courseDescriptions.get(currentCourse.course_code)!.length > 150 && (
                  <button
                    onClick={() => setExpandedDescription(
                      expandedDescription === currentCourse.course_code ? null : currentCourse.course_code
                    )}
                    className="text-xs text-blue-600 mt-1 flex items-center gap-1 hover:text-blue-800"
                  >
                    {expandedDescription === currentCourse.course_code ? (
                      <>Show less <ChevronUp className="w-3 h-3" /></>
                    ) : (
                      <>Show more <ChevronDown className="w-3 h-3" /></>
                    )}
                  </button>
                )}
              </div>
            )}

            {/* Course Format Tags */}
            <div className="mb-4">
              <label className="text-sm text-gray-700 mb-3 block">Course Format</label>
              <div className="flex flex-wrap gap-2 mb-3">
                <span className="px-2 py-1 border border-gray-300 rounded-full text-xs flex items-center gap-1">
                  <BookOpen className="w-3 h-3" />
                  Lecture Heavy
                </span>
                <span className="px-2 py-1 border border-gray-300 rounded-full text-xs flex items-center gap-1">
                  <Beaker className="w-3 h-3" />
                  Lab Component
                </span>
              </div>

              <label className="text-sm text-gray-700 mb-2 block">Workload Type</label>
              <div className="flex flex-wrap gap-2">
                <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs flex items-center gap-1">
                  <BookOpen className="w-3 h-3" />
                  Reading Intensive
                </span>
                <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs flex items-center gap-1">
                  <FileText className="w-3 h-3" />
                  Writing Intensive
                </span>
                <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs flex items-center gap-1">
                  <Calculator className="w-3 h-3" />
                  Math Heavy
                </span>
                <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs flex items-center gap-1">
                  <GroupIcon className="w-3 h-3" />
                  Group Projects
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center space-x-4 mt-6">
        <button
          onClick={() => handleSwipe('left')}
          className="w-16 h-16 rounded-full border-2 border-gray-300 hover:border-red-500 hover:bg-red-50 flex items-center justify-center transition-colors"
        >
          <X className="w-8 h-8 text-gray-500 hover:text-red-500" />
        </button>
        <button
          onClick={handleUndo}
          disabled={currentIndex === 0 && passedCourses.length === 0}
          className="w-16 h-16 rounded-full border-2 border-gray-300 hover:border-blue-500 hover:bg-blue-50 flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <RotateCcw className="w-8 h-8 text-gray-500 hover:text-blue-500" />
        </button>
        <button
          onClick={() => handleSwipe('right')}
          className="w-16 h-16 rounded-full bg-red-600 hover:bg-red-700 flex items-center justify-center transition-colors"
        >
          <Heart className="w-8 h-8 text-white" />
        </button>
      </div>

      {/* Progress Indicator */}
      <div className="text-center mt-4">
        <p className="text-sm text-gray-500">
          {currentIndex + 1} of {availableCourses.length} courses
          {showOpenOnly && (
            <span className="text-xs text-gray-400 block">
              (Showing open classes only)
            </span>
          )}
        </p>
      </div>

      {/* Time Selection Modal */}
      <AnimatePresence>
        {showClassModal && currentCourse && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowClassModal(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-red-600 text-white p-4 rounded-t-lg flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-bold">Choose a Time Slot</h3>
                  <p className="text-sm text-red-100 mt-1">
                    {currentCourseCode}: {currentCourse.course_name}
                  </p>
                </div>
                <button
                  onClick={() => setShowClassModal(false)}
                  className="text-white hover:text-gray-200 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-4 space-y-3">
                {currentCourseSections.map((section, index) => {
                  const sectionStatus = getEnrollmentStatus(section.status)
                  const SectionStatusIcon = sectionStatus.icon
                  const sectionTimeSlot = {
                    id: section.class_number,
                    time: section.meeting_time,
                    location: section.building && section.room ? `${section.building} ${section.room}` : 'TBA',
                    instructor: section.instructor || undefined,
                    classSize: section.class_size || 120,
                    enrolled: section.enrolled || 87,
                    waitlist: section.waitlist || 0,
                    status: section.status?.toLowerCase() === 'open' ? 'open' : section.status?.toLowerCase() === 'waitlist' ? 'waitlist' : 'full'
                  }
                  const conflicts = checkTimeConflicts(section.meeting_time, selectedCourses)

                  return (
                    <motion.div
                      key={section.class_number}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <button
                        onClick={() => handleSelectClass(section)}
                        className="w-full p-4 text-left border-2 rounded-lg hover:border-red-500 transition-colors bg-white"
                      >
                        <div className="w-full">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-2">
                              {sectionStatus.text === 'Open' ? (
                                <Check className="w-5 h-5 text-green-600" />
                              ) : sectionStatus.text === 'Waitlist' ? (
                                <AlertTriangle className="w-5 h-5 text-yellow-600" />
                              ) : (
                                <X className="w-5 h-5 text-red-600" />
                              )}
                              <span className="font-semibold text-gray-900">{section.meeting_time}</span>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${sectionStatus.color}`}>
                              {sectionStatus.text}
                            </span>
                          </div>

                          <div className="space-y-2">
                            {section.building && section.room && (
                              <div className="flex items-center gap-2 text-sm text-gray-700">
                                <MapPin className="w-4 h-4 text-red-500" />
                                <span>{section.building} {section.room}</span>
                              </div>
                            )}
                            {section.instructor && section.instructor !== currentCourse.instructor && (
                              <div className="flex items-center gap-2 text-sm text-gray-700">
                                <Users className="w-4 h-4 text-amber-700" />
                                <span>{section.instructor}</span>
                              </div>
                            )}
                            <div className="flex items-center gap-2 text-sm text-gray-700">
                              <Users className="w-4 h-4 text-blue-500" />
                              <span>{section.enrolled || 87}/{section.class_size || 120} enrolled</span>
                            </div>
                          </div>

                          {conflicts.length > 0 && (
                            <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded">
                              <div className="text-xs text-red-700 flex items-center gap-1">
                                <AlertTriangle className="w-3 h-3" />
                                <span><strong>Time Conflict:</strong> Overlaps with {conflicts.map(c => c.course_code).join(', ')}</span>
                              </div>
                            </div>
                          )}
                        </div>
                      </button>
                    </motion.div>
                  )
                })}

                <div className="pt-4 border-t">
                  <button
                    onClick={() => setShowClassModal(false)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Time Conflict Resolution Modal */}
      {showConflictModal && conflictingCourse && newCourseToAdd && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => {
            setShowConflictModal(false)
            setConflictingCourse(null)
            setNewCourseToAdd(null)
          }}
        >
          <div
            className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-red-600 text-white p-4 rounded-t-lg flex justify-between items-center">
              <h3 className="text-lg font-bold">⚠️ Time Conflict Detected</h3>
              <button
                onClick={() => {
                  setShowConflictModal(false)
                  setConflictingCourse(null)
                  setNewCourseToAdd(null)
                }}
                className="text-white hover:text-gray-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <p className="text-gray-700 mb-6">
                The class you selected conflicts with a course already in your schedule. Please choose which course to keep:
              </p>
              
              <div className="space-y-4">
                {/* Existing Course */}
                <div className="border-2 border-blue-300 rounded-lg p-4 bg-blue-50">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-4 h-4 rounded-full bg-blue-500"></div>
                    <h4 className="font-bold text-gray-900">Current Course</h4>
                  </div>
                  <div className="ml-6 space-y-1">
                    <p className="font-semibold text-gray-900">{conflictingCourse.course_code}: {conflictingCourse.course_name}</p>
                    {conflictingCourse.meeting_time && (
                      <p className="text-sm text-gray-700">
                        <Clock className="w-4 h-4 inline mr-1" />
                        {conflictingCourse.meeting_time}
                      </p>
                    )}
                    {conflictingCourse.instructor && (
                      <p className="text-sm text-gray-700">Instructor: {conflictingCourse.instructor}</p>
                    )}
                    {conflictingCourse.requirement_name && (
                      <p className="text-xs text-blue-700">Fulfills: {conflictingCourse.requirement_name}</p>
                    )}
                  </div>
                </div>

                {/* New Course */}
                <div className="border-2 border-green-300 rounded-lg p-4 bg-green-50">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-4 h-4 rounded-full bg-green-500"></div>
                    <h4 className="font-bold text-gray-900">New Course</h4>
                  </div>
                  <div className="ml-6 space-y-1">
                    <p className="font-semibold text-gray-900">{newCourseToAdd.course_code}: {newCourseToAdd.course_name}</p>
                    {newCourseToAdd.meeting_time && (
                      <p className="text-sm text-gray-700">
                        <Clock className="w-4 h-4 inline mr-1" />
                        {newCourseToAdd.meeting_time}
                      </p>
                    )}
                    {newCourseToAdd.instructor && (
                      <p className="text-sm text-gray-700">Instructor: {newCourseToAdd.instructor}</p>
                    )}
                    {newCourseToAdd.requirement_name && (
                      <p className="text-xs text-green-700">Fulfills: {newCourseToAdd.requirement_name}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 px-6 py-4 rounded-b-lg flex justify-between">
              <button
                onClick={() => handleConflictResolution(false)}
                className="px-6 py-2 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 transition-colors"
              >
                Keep Current Course
              </button>
              <button
                onClick={() => handleConflictResolution(true)}
                className="px-6 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
              >
                Replace with New Course
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

