'use client'

import { useState, useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import { collectRequirementOptions, parseMeetingTime, TimeSlot, ScheduledCourse, hasTimeSlotsConflict } from '@/lib/scheduleCore'
import { motion, AnimatePresence, PanInfo } from 'framer-motion'
import { Clock, MapPin, Users, Star, BookOpen, Calculator, Users as GroupIcon, FlaskConical, X, RotateCcw, Heart, ChevronDown, ChevronUp } from 'lucide-react'

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
}

interface CourseSection {
  class_number: string
  meeting_time: string
  instructor: string | null
  room: string | null
  building: string | null
  status: string | null
  enrollment?: string
  capacity?: string
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
  const cardRef = useRef<HTMLDivElement>(null)

  const fetchData = async (swipedSet?: Set<string>, fulfilledReqsSet?: Set<string>) => {
    const swipedToUse = swipedSet || swipedCourses
    const fulfilledReqsToUse = fulfilledReqsSet || fulfilledRequirements
    
    try {
      // Fetch user preferences
      const { data: prefsData } = await supabase
        .from('user_preferences')
        .select('major, expected_graduation_year, courses_taken')
        .eq('user_id', userId)
        .single()

      if (!prefsData?.major) {
        setLoading(false)
        return
      }

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

      // Get requirements from multiple semesters if user hasn't taken courses
      // This ensures they see Year 1 Fall and Spring courses
      const semestersToFetch: { year: number; term: string }[] = []
      
      if (!hasTakenCourses) {
        // Fetch Year 1 Fall, Year 1 Spring, Year 2 Fall, Year 2 Spring
        semestersToFetch.push(
          { year: 1, term: 'fall' },
          { year: 1, term: 'spring' },
          { year: 2, term: 'fall' },
          { year: 2, term: 'spring' }
        )
      } else {
        // User has taken courses - just get current semester
        semestersToFetch.push({ year: startYear, term: startTerm })
      }

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

      // Get GPAs for all courses (cache by course_code to avoid duplicate queries)
      const gpaCache = new Map<string, number>()
      const coursesWithGPA = await Promise.all(
        availableSections.map(async (section: any) => {
          let gpa = 0
          
          if (gpaCache.has(section.course_code)) {
            gpa = gpaCache.get(section.course_code)!
          } else {
            const { data: grades } = await supabase
              .from('grade_distributions')
              .select('avg_class_grade')
              .eq('course_code', section.course_code)
              .not('avg_class_grade', 'is', null)
              .limit(100)

            if (grades && grades.length > 0) {
              gpa = grades.reduce((sum: number, g: any) => sum + parseFloat(g.avg_class_grade || 0), 0) / grades.length
            }
            gpaCache.set(section.course_code, gpa)
          }

          return { ...section, gpa }
        })
      )

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
          isCritical
        })
      }

      // Sort by: critical first, then required, then by GPA (highest first)
      coursesList.sort((a, b) => {
        if (a.isCritical !== b.isCritical) return b.isCritical ? 1 : -1
        if (a.isRequired !== b.isRequired) return b.isRequired ? 1 : -1
        return (b.gpa || 0) - (a.gpa || 0)
      })

      console.log(`[Swipe] Loaded ${coursesList.length} courses (filtered ${swipedToUse.size} already swiped)`)
      setCourses(coursesList)
    } catch (error) {
      console.error('Error fetching courses:', error)
    } finally {
      setLoading(false)
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
    if (currentIndex >= courses.length) return

    const currentCourse = courses[currentIndex]

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
      setCurrentIndex(prev => prev + 1)
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
        .select('class_number, meeting_time, instructor, room, building, status')
        .eq('course_code', courseCode)
        .order('class_number')

      if (sections && sections.length > 0) {
        // Parse enrollment info from status if available
        const sectionsWithEnrollment: CourseSection[] = sections.map((s: any) => ({
          class_number: s.class_number,
          meeting_time: s.meeting_time || '',
          instructor: s.instructor,
          room: s.room,
          building: s.building,
          status: s.status
        }))
        setCurrentCourseSections(sectionsWithEnrollment)
      } else {
        // If no sections found, show error or use current course's section
        const currentCourse = courses[currentIndex]
        setCurrentCourseSections([{
          class_number: currentCourse.class_number,
          meeting_time: currentCourse.meeting_time || '',
          instructor: currentCourse.instructor,
          room: currentCourse.room,
          building: currentCourse.building,
          status: currentCourse.status
        }])
      }
    } catch (error) {
      console.error('Error fetching sections:', error)
      // Fallback to current course section
      const currentCourse = courses[currentIndex]
      setCurrentCourseSections([{
        class_number: currentCourse.class_number,
        meeting_time: currentCourse.meeting_time || '',
        instructor: currentCourse.instructor,
        room: currentCourse.room,
        building: currentCourse.building,
        status: currentCourse.status
      }])
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

  if (currentIndex >= courses.length) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <p className="text-xl font-bold text-gray-800 mb-2">All Done!</p>
          <p className="text-gray-600 mb-4">You've reviewed all available courses</p>
          <p className="text-sm text-gray-500">Selected {selectedCourses.length} course{selectedCourses.length !== 1 ? 's' : ''}</p>
        </div>
      </div>
    )
  }

  const currentCourse = courses[currentIndex]
  const timeSlots = parseMeetingTime(currentCourse.meeting_time)

  return (
    <div className="min-h-screen pb-20 bg-gray-50 flex flex-col items-center justify-center p-4">
      {/* Instruction hint */}
      <p className="text-sm text-gray-600 mb-4">Swipe right to add, left to pass</p>

      {/* Card Stack */}
      <div className="relative w-full max-w-md" style={{ height: '600px' }}>
        <AnimatePresence>
          <motion.div
            key={currentIndex}
            ref={cardRef}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={handleDragEnd}
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ x: -1000, opacity: 0, rotate: -30 }}
            className="absolute w-full bg-white rounded-2xl shadow-xl p-6 cursor-grab active:cursor-grabbing"
            style={{ height: '600px', overflowY: 'auto' }}
          >
            {/* Required Course Badge */}
            {currentCourse.isRequired && (
              <div className={`mb-3 px-4 py-2 rounded-lg text-sm font-semibold ${
                currentCourse.isCritical 
                  ? 'bg-red-50 text-red-900 border-2 border-red-400 shadow-md' 
                  : 'bg-blue-50 text-blue-900 border-2 border-blue-400'
              }`}>
                <div className="flex items-center gap-2">
                  {currentCourse.isCritical ? (
                    <>
                      <span className="text-lg">⚠️</span>
                      <div>
                        <div className="font-bold">CRITICAL REQUIREMENT</div>
                        <div className="text-xs font-normal mt-0.5">
                          You need to take this course this semester to stay on track
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <span className="text-lg">📋</span>
                      <div>
                        <div className="font-bold">REQUIRED FOR YOUR DEGREE</div>
                        <div className="text-xs font-normal mt-0.5">
                          Recommended for your degree path this semester
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Course Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-2xl font-bold text-gray-900">{currentCourse.course_code}</h2>
                  {currentCourse.credits && (
                    <span className="text-sm text-gray-600">{currentCourse.credits} credits</span>
                  )}
                </div>
                <p className="text-sm text-gray-500 mb-2">Fall 2024</p>
                <h3 className="text-lg font-semibold text-gray-800">{currentCourse.course_name}</h3>
                {currentCourse.instructor && (
                  <p className="text-sm text-gray-600 mt-1">Professor: {currentCourse.instructor}</p>
                )}
              </div>
              {/* Popularity badge placeholder */}
              <div className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs font-bold">
                +15%
              </div>
            </div>

            {/* Enrollment Status */}
            <div className={`mb-4 p-3 rounded-lg border-2 ${getStatusColor(currentCourse.status)}`}>
              <div className="flex items-center gap-2 mb-1">
                {getStatusIcon(currentCourse.status)}
                <span className="font-semibold">{currentCourse.status || 'Open'}</span>
              </div>
              <p className="text-sm mt-1">33 spots left</p>
              <p className="text-xs text-gray-600">87/120 enrolled</p>
            </div>

            {/* Schedule */}
            {currentCourse.meeting_time && (
              <div className="mb-4 flex items-start gap-2">
                <Clock className="w-5 h-5 text-gray-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {timeSlots.length > 0 
                      ? timeSlots.map((slot, i) => (
                          <span key={i}>
                            {slot.days.join(', ')} {formatTime(currentCourse.meeting_time)}
                            {i < timeSlots.length - 1 && ', '}
                          </span>
                        ))
                      : currentCourse.meeting_time}
                  </p>
                  {currentCourse.building && currentCourse.room && (
                    <div className="flex items-center gap-1 mt-1">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      <span className="text-xs text-gray-600">{currentCourse.building} {currentCourse.room}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Ratings */}
            <div className="flex gap-4 mb-4">
              {currentCourse.gpa && currentCourse.gpa > 0 && (
                <>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-semibold">{currentCourse.gpa.toFixed(1)}</span>
                    <span className="text-xs text-gray-600 ml-1">Professor Rating</span>
                  </div>
                  <div>
                    <span className="text-sm font-semibold">{gpaToLetterGrade(currentCourse.gpa)}</span>
                    <span className="text-xs text-gray-600 ml-1">Average Grade</span>
                  </div>
                </>
              )}
            </div>

            {/* Difficulty (placeholder) */}
            <div className="mb-4">
              <p className="text-xs text-gray-600 mb-1">Difficulty</p>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((level) => (
                  <div
                    key={level}
                    className={`w-3 h-3 rounded-full ${
                      level <= 3 ? 'bg-red-500' : 'border-2 border-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Requirements Fulfilled */}
            {currentCourse.requirement_names && currentCourse.requirement_names.length > 0 && (
              <div className="mb-4">
                <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm font-medium text-blue-900">
                    Fulfills: {currentCourse.requirement_names.join(', ')}
                  </span>
                </div>
              </div>
            )}

            {/* Course Description */}
            {courseDescriptions.has(currentCourse.course_code) && (
              <div className="mb-4">
                <p className={`text-sm text-gray-700 ${expandedDescription === currentCourse.course_code ? '' : 'line-clamp-3'}`}>
                  {courseDescriptions.get(currentCourse.course_code)}
                </p>
                {courseDescriptions.get(currentCourse.course_code) && courseDescriptions.get(currentCourse.course_code)!.length > 150 && (
                  <button
                    onClick={() => setExpandedDescription(
                      expandedDescription === currentCourse.course_code ? null : currentCourse.course_code
                    )}
                    className="text-xs text-blue-600 mt-1 flex items-center gap-1"
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

            {/* Format Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs flex items-center gap-1">
                <BookOpen className="w-3 h-3" />
                Lecture Heavy
              </span>
              <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs flex items-center gap-1">
                <FlaskConical className="w-3 h-3" />
                Lab Component
              </span>
            </div>

            {/* Workload Tags */}
            <div className="flex flex-wrap gap-2">
              <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs flex items-center gap-1">
                <Calculator className="w-3 h-3" />
                Math Heavy
              </span>
              <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs flex items-center gap-1">
                <GroupIcon className="w-3 h-3" />
                Group Projects
              </span>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-center gap-8 mt-8">
        <button
          onClick={() => handleSwipe('left')}
          className="w-14 h-14 rounded-full bg-white border-2 border-gray-300 flex items-center justify-center shadow-lg hover:bg-gray-50 transition-colors"
        >
          <X className="w-6 h-6 text-gray-600" />
        </button>
        <button
          onClick={handleUndo}
          disabled={currentIndex === 0 && passedCourses.length === 0}
          className="w-14 h-14 rounded-full bg-white border-2 border-gray-300 flex items-center justify-center shadow-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <RotateCcw className="w-6 h-6 text-gray-600" />
        </button>
        <button
          onClick={() => handleSwipe('right')}
          className="w-16 h-16 rounded-full bg-red-600 flex items-center justify-center shadow-lg hover:bg-red-700 transition-colors"
        >
          <Heart className="w-8 h-8 text-white fill-white" />
        </button>
      </div>

      {/* Progress Indicator */}
      <div className="mt-4 text-sm text-gray-600">
        {currentIndex + 1} of {courses.length}
      </div>

      {/* Class Selection Modal */}
      {showClassModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowClassModal(false)}
        >
          <div
            className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-red-600 text-white p-4 rounded-t-lg flex justify-between items-center">
              <h3 className="text-lg font-bold">Choose a Time Slot</h3>
              <button
                onClick={() => setShowClassModal(false)}
                className="text-white hover:text-gray-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4">
              <p className="text-sm text-gray-600 mb-4">{currentCourseCode}: {currentCourse.course_name}</p>
              <div className="space-y-3">
                {currentCourseSections.map((section, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleSelectClass(section)}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                      section.status?.toLowerCase() === 'open'
                        ? 'border-green-300 bg-green-50 hover:bg-green-100'
                        : section.status?.toLowerCase() === 'waitlist'
                        ? 'border-yellow-300 bg-yellow-50 hover:bg-yellow-100'
                        : 'border-red-300 bg-red-50 hover:bg-red-100'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {section.status?.toLowerCase() === 'open' ? (
                        <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                      ) : section.status?.toLowerCase() === 'waitlist' ? (
                        <div className="w-5 h-5 rounded-full bg-yellow-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                      ) : (
                        <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <X className="w-3 h-3 text-white" />
                        </div>
                      )}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-semibold text-gray-900">{section.meeting_time}</span>
                          <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                            section.status?.toLowerCase() === 'open'
                              ? 'bg-green-100 text-green-800'
                              : section.status?.toLowerCase() === 'waitlist'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {section.status || 'Open'}
                          </span>
                        </div>
                        {section.building && section.room && (
                          <div className="flex items-center gap-1 text-sm text-gray-600 mb-1">
                            <MapPin className="w-4 h-4" />
                            <span>{section.building} {section.room}</span>
                          </div>
                        )}
                        {section.instructor && (
                          <div className="flex items-center gap-1 text-sm text-gray-600 mb-1">
                            <Users className="w-4 h-4" />
                            <span>{section.instructor}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Users className="w-3 h-3" />
                          <span>87/120 enrolled</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="p-4 border-t">
              <button
                onClick={() => setShowClassModal(false)}
                className="w-full px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

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

