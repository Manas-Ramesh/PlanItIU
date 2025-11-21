'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import ScheduleAgent from './ScheduleAgent'

interface Course {
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

interface TimeSlot {
  days: string[]
  startTime: number // minutes since midnight
  endTime: number
}

interface ScheduledCourse extends Course {
  timeSlots: TimeSlot[]
}

interface UserPreferences {
  major: string | null
  expected_graduation_year: number | null
  courses_taken: string[] | null
}

export default function Schedule({ userId }: { userId: string }) {
  const [preferences, setPreferences] = useState<UserPreferences | null>(null)
  const [schedule, setSchedule] = useState<ScheduledCourse[]>([])
  const [alternatives, setAlternatives] = useState<ScheduledCourse[][]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(false)
  const [generating, setGenerating] = useState(false)

  useEffect(() => {
    fetchPreferences()
    // Load saved schedule from localStorage
    loadSavedSchedule()
    
    // Listen for schedule updates (from agent finalizing)
    const handleScheduleUpdate = (event: Event) => {
      const customEvent = event as CustomEvent
      const updatedUserId = customEvent.detail?.userId || userId
      if (updatedUserId === userId) {
        loadSavedSchedule()
      }
    }
    
    window.addEventListener('scheduleUpdated', handleScheduleUpdate)
    return () => window.removeEventListener('scheduleUpdated', handleScheduleUpdate)
  }, [userId])

  const loadSavedSchedule = () => {
    try {
      const scheduleKey = `generatedSchedule_${userId}`
      const savedSchedule = localStorage.getItem(scheduleKey)
      if (savedSchedule) {
        const parsed = JSON.parse(savedSchedule)
        setSchedule(parsed)
        console.log('Loaded saved schedule:', parsed.length, 'courses')
      }
      
      // Load alternatives if available
      const alternativesKey = `scheduleAlternatives_${userId}`
      const savedAlternatives = localStorage.getItem(alternativesKey)
      if (savedAlternatives) {
        const parsedAlternatives = JSON.parse(savedAlternatives)
        setAlternatives(parsedAlternatives)
        console.log('Loaded', parsedAlternatives.length, 'alternative schedules')
      }
    } catch (error) {
      console.error('Error loading saved schedule:', error)
    }
  }

  const cycleToNextSchedule = () => {
    const allSchedules = [schedule, ...alternatives]
    const totalSchedules = allSchedules.length
    if (totalSchedules <= 1) {
      console.log('No alternatives to cycle through')
      return
    }
    
    const nextIndex = (currentIndex + 1) % totalSchedules
    setCurrentIndex(nextIndex)
    const nextSchedule = allSchedules[nextIndex]
    setSchedule(nextSchedule)
    
    console.log(`Cycling to schedule ${nextIndex + 1} of ${totalSchedules}`)
    
    // Update localStorage with current schedule
    const scheduleKey = `generatedSchedule_${userId}`
    localStorage.setItem(scheduleKey, JSON.stringify(nextSchedule))
    window.dispatchEvent(new CustomEvent('scheduleUpdated', { detail: { userId } }))
  }

  const fetchPreferences = async () => {
    try {
      const { data, error } = await supabase
        .from('user_preferences')
        .select('major, expected_graduation_year, courses_taken')
        .eq('user_id', userId)
        .single()

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching preferences:', error)
        return
      }

      if (data) {
        setPreferences(data)
      }
    } catch (error) {
      console.error('Error in fetchPreferences:', error)
    }
  }

  // Parse meeting_time string to extract days and times
  const parseMeetingTime = (meetingTime: string | null): TimeSlot[] => {
    if (!meetingTime) return []

    const slots: TimeSlot[] = []
    
    // Handle formats like:
    // "MWF Monday, Wednesday, Friday 3:10 PM"
    // "TuTh Tuesday, Thursday 9:35 AM-10:50 AM"
    // "MW Monday, Wednesday 10:00 AM - 11:15 AM"
    
    // Extract day abbreviations (MWF, TuTh, MW, etc.)
    const dayPattern = /(M|Tu|W|Th|F|Sa|Su)+/i
    const timePattern = /(\d{1,2}):(\d{2})\s*(AM|PM)\s*-?\s*(\d{1,2})?:?(\d{2})?\s*(AM|PM)?/i
    
    const dayMatch = meetingTime.match(dayPattern)
    if (!dayMatch) return []

    // Map abbreviations to day names
    const dayMap: { [key: string]: string } = {
      'M': 'Monday',
      'Tu': 'Tuesday',
      'W': 'Wednesday',
      'Th': 'Thursday',
      'F': 'Friday',
      'Sa': 'Saturday',
      'Su': 'Sunday'
    }

    // Extract days
    const dayAbbr = dayMatch[0]
    const days: string[] = []
    if (dayAbbr.includes('M') && !dayAbbr.includes('Tu')) days.push('Monday')
    if (dayAbbr.includes('Tu')) days.push('Tuesday')
    if (dayAbbr.includes('W') && !dayAbbr.includes('Th')) days.push('Wednesday')
    if (dayAbbr.includes('Th')) days.push('Thursday')
    if (dayAbbr.includes('F')) days.push('Friday')
    if (dayAbbr.includes('Sa')) days.push('Saturday')
    if (dayAbbr.includes('Su')) days.push('Sunday')

    // Extract time - try multiple patterns
    // Pattern 1: "9:35 AM-10:50 AM" or "9:35 AM - 10:50 AM"
    // Pattern 2: "11:10 AM-12:00 PM" (note: might be written as "12:00 AM" incorrectly)
    // Pattern 3: "9:35 AM" (single time, need to infer end)
    
    let timeMatch = meetingTime.match(/(\d{1,2}):(\d{2})\s*(AM|PM)\s*-?\s*(\d{1,2}):(\d{2})\s*(AM|PM)/i)
    
    let startHour: number
    let startMin: number
    let startPeriod: string
    let endHour: number
    let endMin: number
    let endPeriod: string

    if (timeMatch && timeMatch.length >= 7) {
      // Has both start and end times
      startHour = parseInt(timeMatch[1])
      startMin = parseInt(timeMatch[2])
      startPeriod = timeMatch[3].toUpperCase()
      endHour = parseInt(timeMatch[4])
      endMin = parseInt(timeMatch[5])
      endPeriod = timeMatch[6].toUpperCase()
      
      // Fix common error: if end time is 12:00 AM and start is AM, it's probably 12:00 PM
      if (endHour === 12 && endMin === 0 && endPeriod === 'AM' && startPeriod === 'AM' && startHour < 12) {
        endPeriod = 'PM'
      }
      // Fix: if end time is 12:00 AM and start is PM, it's probably next day (12:00 PM next day = 12:00 PM)
      if (endHour === 12 && endMin === 0 && endPeriod === 'AM' && startPeriod === 'PM') {
        endPeriod = 'PM'
      }
    } else {
      // Try single time pattern
      timeMatch = meetingTime.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i)
      if (!timeMatch) {
        console.log('No time match found in:', meetingTime)
        return []
      }
      
      startHour = parseInt(timeMatch[1])
      startMin = parseInt(timeMatch[2])
      startPeriod = timeMatch[3].toUpperCase()
      
      // No end time, assume 50 min class duration
      endHour = startHour
      endMin = startMin + 50
      endPeriod = startPeriod
      if (endMin >= 60) {
        endMin -= 60
        endHour += 1
        // Handle hour overflow (e.g., 11:50 AM + 50 min = 12:40 PM)
        if (endHour === 12 && startPeriod === 'AM') {
          endPeriod = 'PM'
        } else if (endHour === 13) {
          endHour = 1
          endPeriod = 'PM'
        }
      }
    }

    // Convert to 24-hour format and then to minutes
    const convertToMinutes = (hour: number, min: number, period: string): number => {
      let h = hour
      if (period === 'PM' && hour !== 12) h += 12
      if (period === 'AM' && hour === 12) h = 0
      return h * 60 + min
    }

    const startMinutes = convertToMinutes(startHour, startMin, startPeriod)
    const endMinutes = convertToMinutes(endHour, endMin, endPeriod)

    slots.push({
      days,
      startTime: startMinutes,
      endTime: endMinutes
    })

    return slots
  }

  // Check if two time slots overlap
  const hasTimeConflict = (slot1: TimeSlot, slot2: TimeSlot): boolean => {
    // Check if they share any common day
    const commonDays = slot1.days.filter(day => slot2.days.includes(day))
    
    const formatTime = (mins: number) => {
      const h = Math.floor(mins / 60)
      const m = mins % 60
      const period = h >= 12 ? 'PM' : 'AM'
      const displayH = h > 12 ? h - 12 : h === 0 ? 12 : h
      return `${displayH}:${m.toString().padStart(2, '0')} ${period}`
    }
    
    console.log(`[hasTimeConflict] Comparing:`, {
      slot1: { days: slot1.days, start: slot1.startTime, end: slot1.endTime, time: `${formatTime(slot1.startTime)}-${formatTime(slot1.endTime)}` },
      slot2: { days: slot2.days, start: slot2.startTime, end: slot2.endTime, time: `${formatTime(slot2.startTime)}-${formatTime(slot2.endTime)}` },
      commonDays: commonDays
    })
    
    if (commonDays.length === 0) {
      console.log(`  No common days - no conflict`)
      return false
    }

    // Check if time ranges overlap
    // Two ranges overlap if: slot1.start < slot2.end AND slot2.start < slot1.end
    const overlaps = slot1.startTime < slot2.endTime && slot2.startTime < slot1.endTime
    
    console.log(`  Common days found: ${commonDays.join(', ')}`)
    console.log(`  Time overlap check: ${slot1.startTime} < ${slot2.endTime} && ${slot2.startTime} < ${slot1.endTime} = ${overlaps}`)
    
    if (overlaps) {
      console.log(`  ✓ CONFLICT DETECTED!`)
    } else {
      console.log(`  ✗ No time overlap - no conflict`)
    }
    
    return overlaps
  }

  // Check if a course conflicts with existing schedule
  const hasConflict = (course: Course, existingSchedule: ScheduledCourse[]): boolean => {
    const courseSlots = parseMeetingTime(course.meeting_time)
    if (courseSlots.length === 0) return false // No time info, assume no conflict

    for (const existingCourse of existingSchedule) {
      for (const existingSlot of existingCourse.timeSlots) {
        for (const courseSlot of courseSlots) {
          if (hasTimeConflict(existingSlot, courseSlot)) {
            return true
          }
        }
      }
    }
    return false
  }

  // Check if time slots conflict with existing schedule (using pre-parsed timeSlots)
  const hasTimeSlotsConflict = (timeSlots: TimeSlot[], existingSchedule: ScheduledCourse[]): boolean => {
    if (timeSlots.length === 0) return false // No time info, assume no conflict
    if (existingSchedule.length === 0) return false // No existing schedule, no conflict

    for (const existingCourse of existingSchedule) {
      // Skip if existing course has no time slots
      if (!existingCourse.timeSlots || existingCourse.timeSlots.length === 0) {
        continue
      }
      
      for (const existingSlot of existingCourse.timeSlots) {
        for (const courseSlot of timeSlots) {
          const conflicts = hasTimeConflict(existingSlot, courseSlot)
          if (conflicts) {
            // Debug log
            console.log(`[CONFLICT CHECK] ${existingCourse.course_code} vs new course:`, {
              existing: {
                course: existingCourse.course_code,
                days: existingSlot.days,
                start: existingSlot.startTime,
                end: existingSlot.endTime
              },
              new: {
                days: courseSlot.days,
                start: courseSlot.startTime,
                end: courseSlot.endTime
              }
            })
            return true
          }
        }
      }
    }
    return false
  }

  // Get GPA for a course from grade_distributions
  const getCourseGPA = async (courseCode: string): Promise<number> => {
    try {
      const { data, error } = await supabase
        .from('grade_distributions')
        .select('avg_class_grade')
        .eq('course_code', courseCode)
        .not('avg_class_grade', 'is', null)
        .limit(100)

      if (error || !data || data.length === 0) return 0

      const grades = data
        .map((d: any) => parseFloat(d.avg_class_grade))
        .filter((g: number) => !isNaN(g))

      if (grades.length === 0) return 0

      return grades.reduce((sum: number, g: number) => sum + g, 0) / grades.length
    } catch (error) {
      return 0
    }
  }

  // Helper to check if a time slot meets preferences
  const meetsTimePreferences = (timeSlots: TimeSlot[], prefs?: any): boolean => {
    if (!prefs) return true

    for (const slot of timeSlots) {
      // Check avoid days
      if (prefs.avoidDays && prefs.avoidDays.length > 0) {
        const hasAvoidedDay = slot.days.some(day => 
          prefs.avoidDays.some((avoidDay: string) => 
            day.toLowerCase().includes(avoidDay.toLowerCase())
          )
        )
        if (hasAvoidedDay) return false
      }

      // Check no classes before time
      if (prefs.noClassesBefore) {
        const timeStr = prefs.noClassesBefore
        const timeMatch = timeStr.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i)
        if (timeMatch) {
          const hour = parseInt(timeMatch[1])
          const min = parseInt(timeMatch[2])
          const period = timeMatch[3].toUpperCase()
          let thresholdMinutes = hour * 60 + min
          if (period === 'PM' && hour !== 12) thresholdMinutes += 12 * 60
          if (period === 'AM' && hour === 12) thresholdMinutes = min
          
          if (slot.startTime < thresholdMinutes) return false
        }
      }

      // Check no classes after time
      if (prefs.noClassesAfter) {
        const timeStr = prefs.noClassesAfter
        const timeMatch = timeStr.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i)
        if (timeMatch) {
          const hour = parseInt(timeMatch[1])
          const min = parseInt(timeMatch[2])
          const period = timeMatch[3].toUpperCase()
          let thresholdMinutes = hour * 60 + min
          if (period === 'PM' && hour !== 12) thresholdMinutes += 12 * 60
          if (period === 'AM' && hour === 12) thresholdMinutes = min
          
          if (slot.endTime > thresholdMinutes) return false
        }
      }
    }

    return true
  }

  const generateSchedule = async (agentPreferences?: any) => {
    if (!preferences || !preferences.major) {
      alert('Please complete onboarding first')
      return
    }

    setGenerating(true)
    setLoading(true)
    
    // Clear existing schedule immediately so user sees it's regenerating
    setSchedule([])
    setAlternatives([])
    setCurrentIndex(0)
    
    // Extract preferences from agent (could be nested in preferences object)
    const timePrefs = agentPreferences?.preferences || agentPreferences || {}

    try {
      console.log('Starting smart schedule generation...')
      
      // Use the new smart schedule generator
      const { generateSmartSchedule } = await import('@/lib/generateSmartSchedule')
      
      // Prepare user preferences
      const userPrefs = {
        ...preferences,
        timePreferences: timePrefs,
        preferences: timePrefs, // Also at root for compatibility
        year: (() => {
          const currentYear = new Date().getFullYear()
          const yearsUntilGraduation = (preferences.expected_graduation_year || currentYear + 4) - currentYear
          if (yearsUntilGraduation === 4) return 1
          else if (yearsUntilGraduation === 3) return 2
          else if (yearsUntilGraduation === 2) return 3
          else if (yearsUntilGraduation === 1) return 4
          else if (yearsUntilGraduation > 4) return 1
          else return 4
        })()
      }
      
      // Generate schedules using smart algorithm
      const scheduleResult = await generateSmartSchedule(userPrefs)
      
      if (!scheduleResult.topSchedule || scheduleResult.topSchedule.length === 0) {
        alert('No valid schedules found. Please try adjusting your preferences.')
        return
      }
      
      console.log(`✅ Generated ${scheduleResult.count} valid schedule(s)`)
      
      // Set the top schedule and alternatives
      setSchedule(scheduleResult.topSchedule)
      setAlternatives(scheduleResult.alternatives)
      setCurrentIndex(0)
      
      // Save to localStorage
      const scheduleKey = `generatedSchedule_${userId}`
      localStorage.setItem(scheduleKey, JSON.stringify(scheduleResult.topSchedule))
      
      if (scheduleResult.alternatives.length > 0) {
        const alternativesKey = `scheduleAlternatives_${userId}`
        localStorage.setItem(alternativesKey, JSON.stringify(scheduleResult.alternatives))
        console.log(`Saved ${scheduleResult.alternatives.length} alternative schedules`)
      }
      
      window.dispatchEvent(new CustomEvent('scheduleUpdated', { detail: { userId } }))
      
      if (scheduleResult.topSchedule.length === 0) {
        alert('No courses could be scheduled. This might be because:\n- No courses are available\n- All courses conflict with each other\n- No meeting time data available')
      }
    } catch (error) {
      console.error('Error generating schedule:', error)
      alert(`Error generating schedule: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setGenerating(false)
      setLoading(false)
    }
  }

  const formatTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    const period = hours >= 12 ? 'PM' : 'AM'
    const displayHours = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours
    return `${displayHours}:${mins.toString().padStart(2, '0')} ${period}`
  }

  if (!preferences) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-gray-700">Loading...</div>
      </div>
    )
  }

  const handleModifySchedule = async (modification: any) => {
    // TODO: Implement schedule modification logic
    console.log('Modify schedule:', modification)
    // For now, just regenerate
    if (modification.action === 'replace' || modification.action === 'remove') {
      // Could implement specific course replacement logic here
      alert(`I'll help you ${modification.action} ${modification.courseCode}. This feature is being enhanced.`)
    }
  }

  return (
    <div className="min-h-screen pb-20 bg-white">
      {/* AI Schedule Agent */}
      <ScheduleAgent
        userId={userId}
        currentSchedule={schedule}
        onGenerateSchedule={generateSchedule}
        onModifySchedule={handleModifySchedule}
      />
      
      <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {schedule.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <p className="text-xl text-gray-700 mb-8">Click Generate to generate a schedule</p>
            <button
              onClick={generateSchedule}
              disabled={generating}
              className="px-8 py-4 bg-red-600 text-white rounded-lg font-semibold text-lg hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors shadow-lg"
            >
              {generating ? 'Generating...' : 'Generate'}
            </button>
          </div>
        ) : (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-gray-900">Your Schedule</h1>
              <div className="flex gap-2">
                {alternatives.length > 0 && (
                  <button
                    onClick={cycleToNextSchedule}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    title={`View alternative schedule (${currentIndex + 1} of ${1 + alternatives.length})`}
                  >
                    Next Alternative ({currentIndex + 1}/{1 + alternatives.length})
                  </button>
                )}
                <button
                  onClick={generateSchedule}
                  disabled={generating}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  {generating ? 'Regenerating...' : 'Regenerate'}
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {schedule.map((course, idx) => (
                <div
                  key={`${course.course_code}-${course.class_number}-${idx}`}
                  className="bg-white rounded-lg shadow-md border border-gray-200 p-6"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h2 className="text-xl font-bold text-gray-900">{course.course_code}</h2>
                        {course.status === 'Open' && (
                          <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                            Open
                          </span>
                        )}
                        {course.status === 'Closed' && (
                          <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                            Closed
                          </span>
                        )}
                        {course.credits && (
                          <span className="text-sm text-gray-600">{course.credits}cr</span>
                        )}
                      </div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">{course.course_name}</h3>
                      {course.requirement_name && (
                        <p className="text-sm text-gray-600 mb-1">Requirement: {course.requirement_name}</p>
                      )}
                    </div>
                    {course.gpa && course.gpa > 0 && (
                      <div className="flex gap-2">
                        <div className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-lg flex items-center gap-1">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          <span className="font-semibold">{course.gpa.toFixed(1)}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    {course.instructor && (
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span>{course.instructor}</span>
                      </div>
                    )}
                    {course.meeting_time && (
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="font-medium">
                          {course.timeSlots.length > 0 ? (
                            course.timeSlots.map((slot, i) => (
                              <span key={i} className="block">
                                <span className="font-semibold">{slot.days.join(', ')}</span>{' '}
                                {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                              </span>
                            ))
                          ) : (
                            <span>{course.meeting_time}</span>
                          )}
                        </span>
                      </div>
                    )}
                    {course.building && course.room && (
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span>{course.building} {course.room}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
