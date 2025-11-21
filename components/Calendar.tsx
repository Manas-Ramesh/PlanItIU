'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Clock, MapPin, CheckCircle, AlertCircle, Sparkles, Star, Trash2, Save, FolderOpen, X } from 'lucide-react'

interface TimeSlot {
  days: string[]
  startTime: number // minutes since midnight
  endTime: number
}

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
  timeSlots: TimeSlot[]
}

// Helper function to parse credits (handles ranges like "1-5" or single values like "3")
const parseCredits = (credits: string | null): number => {
  if (!credits) return 0
  // If it's a range like "1-5", take the first number
  const match = credits.match(/^(\d+(?:\.\d+)?)/)
  if (match) {
    return parseFloat(match[1])
  }
  return 0
}

interface UserPreferences {
  major: string | null
  expected_graduation_year: number | null
  courses_taken: string[] | null
}

// Parse meeting_time string to extract days and times (same logic as Schedule component)
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
    if (!dayMatch) {
      console.log('No day match found in:', meetingTime)
      return []
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
        // Handle hour overflow
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

interface SavedCalendar {
  id: string
  name: string
  courses: ScheduledCourse[]
  createdAt: string
}

export default function Calendar({ userId }: { userId: string }) {
  const [preferences, setPreferences] = useState<UserPreferences | null>(null)
  const [schedule, setSchedule] = useState<ScheduledCourse[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCourse, setSelectedCourse] = useState<ScheduledCourse | null>(null)
  const [showSaveModal, setShowSaveModal] = useState(false)
  const [calendarName, setCalendarName] = useState('')
  const [showSavedCalendars, setShowSavedCalendars] = useState(false)
  const [savedCalendars, setSavedCalendars] = useState<SavedCalendar[]>([])

  useEffect(() => {
    fetchData()
    loadSavedCalendars()
    
    // Listen for schedule updates from other components
    const handleScheduleUpdate = () => {
      fetchData()
    }
    window.addEventListener('scheduleUpdated', handleScheduleUpdate)
    
    return () => {
      window.removeEventListener('scheduleUpdated', handleScheduleUpdate)
    }
  }, [userId])

  const loadSavedCalendars = () => {
    const savedKey = `savedCalendars_${userId}`
    const saved = localStorage.getItem(savedKey)
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setSavedCalendars(parsed)
      } catch (error) {
        console.error('Error loading saved calendars:', error)
      }
    }
  }

  const handleSaveCalendar = () => {
    if (!calendarName.trim()) {
      alert('Please enter a name for your calendar')
      return
    }

    const savedKey = `savedCalendars_${userId}`
    const newCalendar: SavedCalendar = {
      id: Date.now().toString(),
      name: calendarName.trim(),
      courses: schedule,
      createdAt: new Date().toISOString()
    }

    const existing = savedCalendars
    existing.push(newCalendar)
    setSavedCalendars(existing)
    localStorage.setItem(savedKey, JSON.stringify(existing))
    
    setShowSaveModal(false)
    setCalendarName('')
    alert('Calendar saved successfully!')
  }

  const handleLoadCalendar = (savedCalendar: SavedCalendar) => {
    // Update schedule
    setSchedule(savedCalendar.courses)
    
    // Save to current schedule
    const scheduleKey = `generatedSchedule_${userId}`
    localStorage.setItem(scheduleKey, JSON.stringify(savedCalendar.courses))
    
    // Update swiped courses and fulfilled requirements
    const swipedKey = `swipedCourses_${userId}`
    const fulfilledReqsKey = `fulfilledRequirements_${userId}`
    
    const swipedSet = new Set(savedCalendar.courses.map(c => c.course_code))
    localStorage.setItem(swipedKey, JSON.stringify(Array.from(swipedSet)))
    
    // Get fulfilled requirements
    const getFulfilledReqs = async () => {
      const courseCodes = savedCalendar.courses.map(c => c.course_code)
      if (courseCodes.length === 0) {
        localStorage.setItem(fulfilledReqsKey, JSON.stringify([]))
        window.dispatchEvent(new CustomEvent('scheduleUpdated', { detail: { userId } }))
        window.dispatchEvent(new CustomEvent('courseDeleted', { detail: { userId, courseCode: '', fulfilledReqIds: [] } }))
        return
      }

      const { data: fulfillments } = await supabase
        .from('requirement_fulfillments')
        .select('requirement_id')
        .in('course_code', courseCodes)
      
      const fulfilledReqIds = fulfillments ? Array.from(new Set(fulfillments.map((f: any) => f.requirement_id))) : []
      localStorage.setItem(fulfilledReqsKey, JSON.stringify(fulfilledReqIds))
      
      window.dispatchEvent(new CustomEvent('scheduleUpdated', { detail: { userId } }))
      window.dispatchEvent(new CustomEvent('courseDeleted', { detail: { userId, courseCode: '', fulfilledReqIds: [] } }))
    }
    
    getFulfilledReqs()
    setShowSavedCalendars(false)
  }

  const handleDeleteSavedCalendar = (id: string) => {
    const updated = savedCalendars.filter(c => c.id !== id)
    setSavedCalendars(updated)
    const savedKey = `savedCalendars_${userId}`
    localStorage.setItem(savedKey, JSON.stringify(updated))
  }

  const handleDeleteCourse = async (courseToDelete: ScheduledCourse) => {
    try {
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
        setSchedule(updatedSchedule)
        
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
        }
        
        // Remove fulfilled requirements
        const fulfilledReqsKey = `fulfilledRequirements_${userId}`
        const savedFulfilledReqs = localStorage.getItem(fulfilledReqsKey)
        if (savedFulfilledReqs) {
          const fulfilledReqsArray: string[] = JSON.parse(savedFulfilledReqs)
          const updatedFulfilledReqs = fulfilledReqsArray.filter(reqId => !fulfilledReqIds.includes(reqId))
          localStorage.setItem(fulfilledReqsKey, JSON.stringify(updatedFulfilledReqs))
        }
        
        // Dispatch event to update Swipe component
        window.dispatchEvent(new CustomEvent('courseDeleted', { 
          detail: { 
            userId,
            courseCode: courseToDelete.course_code,
            fulfilledReqIds
          } 
        }))
        
        // Also dispatch schedule update
        window.dispatchEvent(new CustomEvent('scheduleUpdated', { detail: { userId } }))
        
        // Close modal
        setSelectedCourse(null)
      }
    } catch (error) {
      console.error('Error deleting course:', error)
      alert('Failed to remove course. Please try again.')
    }
  }

  const fetchData = async () => {
    try {
      // Fetch user preferences
      const { data: prefsData } = await supabase
        .from('user_preferences')
        .select('major, expected_graduation_year, courses_taken')
        .eq('user_id', userId)
        .single()

      if (prefsData) {
        setPreferences(prefsData)
      }

      // Fetch schedule from localStorage with user-specific key
      const scheduleKey = `generatedSchedule_${userId}`
      const savedSchedule = localStorage.getItem(scheduleKey)
      if (savedSchedule) {
        const parsed = JSON.parse(savedSchedule)
        console.log('Calendar: Loaded schedule from localStorage:', parsed)
        console.log('Calendar: Number of courses:', parsed.length)
        
        // Ensure timeSlots are parsed for each course
        const coursesWithTimeSlots = parsed.map((course: any, idx: number) => {
          console.log(`Course ${idx}:`, course.course_code, 'meeting_time:', course.meeting_time, 'timeSlots:', course.timeSlots)
          
          // If timeSlots are missing or empty, try to parse from meeting_time
          if (!course.timeSlots || course.timeSlots.length === 0) {
            if (course.meeting_time) {
              const timeSlots = parseMeetingTime(course.meeting_time)
              console.log(`  Parsed timeSlots for ${course.course_code}:`, timeSlots)
              return { ...course, timeSlots }
            } else {
              console.log(`  No meeting_time for ${course.course_code}`)
            }
          }
          return course
        })
        
        setSchedule(coursesWithTimeSlots)
      } else {
        console.log('Calendar: No saved schedule found in localStorage')
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  // Listen for schedule updates from Schedule component
  useEffect(() => {
    const handleScheduleUpdate = (event: Event) => {
      const customEvent = event as CustomEvent
      const updatedUserId = customEvent.detail?.userId || userId
      if (updatedUserId === userId) {
        const scheduleKey = `generatedSchedule_${userId}`
        const savedSchedule = localStorage.getItem(scheduleKey)
        if (savedSchedule) {
          const parsed = JSON.parse(savedSchedule)
          // Ensure timeSlots are parsed for each course
          const coursesWithTimeSlots = parsed.map((course: any) => {
            if (!course.timeSlots || course.timeSlots.length === 0) {
              // Re-parse if timeSlots are missing
              const timeSlots = parseMeetingTime(course.meeting_time)
              return { ...course, timeSlots }
            }
            return course
          })
          console.log('Calendar: Updated schedule with', coursesWithTimeSlots.length, 'courses')
          setSchedule(coursesWithTimeSlots)
        }
      }
    }

    window.addEventListener('scheduleUpdated', handleScheduleUpdate)
    return () => window.removeEventListener('scheduleUpdated', handleScheduleUpdate)
  }, [userId])

  const formatTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    const period = hours >= 12 ? 'PM' : 'AM'
    const displayHours = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours
    return `${displayHours}:${mins.toString().padStart(2, '0')} ${period}`
  }

  const dayOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
  const dayAbbr = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']
  const dayFull = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
  
  // Time slots for the grid
  const timeSlotsGrid = [
    '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM',
    '6:00 PM', '7:00 PM', '8:00 PM'
  ]
  
  // Helper to get status badge
  const getStatusBadge = (status: string | null) => {
    const statusLower = (status || 'open').toLowerCase()
    switch (statusLower) {
      case 'closed':
        return (
          <div className="text-[8px] px-1 py-0 flex items-center gap-0.5 bg-red-600 text-white rounded">
            <AlertCircle className="w-2 h-2" />
            Closed
          </div>
        )
      case 'justopened':
      case 'just opened':
        return (
          <div className="text-[8px] px-1 py-0 flex items-center gap-0.5 bg-blue-600 text-white rounded">
            <Sparkles className="w-2 h-2" />
            Just Opened!
          </div>
        )
      case 'open':
      default:
        return (
          <div className="text-[8px] px-1 py-0 flex items-center gap-0.5 border border-green-600 text-green-700 bg-green-50 rounded">
            <CheckCircle className="w-2 h-2" />
            Open
          </div>
        )
    }
  }
  
  // Helper to convert time string to minutes (e.g., "8:00 AM" -> 480)
  const timeStringToMinutes = (timeStr: string): number => {
    const [time, period] = timeStr.split(' ')
    const [hours, mins] = time.split(':').map(Number)
    let totalMinutes = hours * 60 + mins
    if (period === 'PM' && hours !== 12) totalMinutes += 12 * 60
    if (period === 'AM' && hours === 12) totalMinutes -= 12 * 60
    return totalMinutes
  }
  
  // Helper to find courses at a specific time slot
  const getCoursesAtTimeSlot = (day: string, timeSlot: string) => {
    // Convert time slot to minutes (e.g., "8:00 AM" -> 480, "9:00 AM" -> 540)
    const slotStartMinutes = timeStringToMinutes(timeSlot)
    const slotEndMinutes = slotStartMinutes + 60 // Each slot is 1 hour
    
    return schedule.filter(course => {
      if (!course.timeSlots || course.timeSlots.length === 0) return false
      
      const daySlot = course.timeSlots.find(s => s.days && s.days.includes(day))
      if (!daySlot) return false
      
      // Only show course in the slot where it STARTS (to avoid duplication)
      // Course starts in this slot if: startTime >= slotStart AND startTime < slotEnd
      return daySlot.startTime >= slotStartMinutes && daySlot.startTime < slotEndMinutes
    })
  }

  // Convert GPA to letter grade (rough approximation)
  const getGrade = (gpa: number | undefined): string => {
    if (!gpa) return ''
    if (gpa >= 3.7) return 'A-'
    if (gpa >= 3.3) return 'B+'
    if (gpa >= 3.0) return 'B'
    if (gpa >= 2.7) return 'B-'
    if (gpa >= 2.3) return 'C+'
    if (gpa >= 2.0) return 'C'
    return 'C-'
  }

  // Calculate total credits
  const totalCredits = schedule.reduce((sum, course) => {
    return sum + parseCredits(course.credits)
  }, 0)

  // Generate time slots from 8 AM to 8 PM (every hour for display)
  const generateTimeSlots = () => {
    const slots = []
    for (let hour = 8; hour < 21; hour++) {
      const totalMinutes = hour * 60
      slots.push(totalMinutes)
    }
    return slots
  }

  // Generate time slots every 30 minutes for better grid spacing
  const generateTimeSlotsDetailed = () => {
    const slots = []
    for (let hour = 8; hour < 21; hour++) {
      slots.push(hour * 60) // Top of hour
      slots.push(hour * 60 + 30) // Half hour
    }
    return slots
  }

  const timeSlots = generateTimeSlots()
  const timeSlotsDetailed = generateTimeSlotsDetailed()

  // Get courses for a specific day and time slot
  const getCoursesAtTime = (day: string, timeSlot: number) => {
    return schedule.filter(course => {
      return course.timeSlots.some(slot => {
        if (!slot.days.includes(day)) return false
        // Check if the time slot overlaps with the course time
        return timeSlot >= slot.startTime && timeSlot < slot.endTime
      })
    })
  }

  // Calculate the height and position for a course block
  const getCourseBlockStyle = (course: ScheduledCourse, day: string) => {
    // Check if course has timeSlots
    if (!course.timeSlots || course.timeSlots.length === 0) {
      console.log(`Course ${course.course_code} has no timeSlots`)
      return null
    }

    const slot = course.timeSlots.find(s => s.days && s.days.includes(day))
    if (!slot) {
      return null
    }

    // Calculate position relative to 8 AM (480 minutes)
    const startMinutes = slot.startTime - 480 // Offset from 8 AM
    const durationMinutes = slot.endTime - slot.startTime
    
    // Total calendar height in minutes (8 AM to 8 PM = 12 hours = 720 minutes)
    // Calendar is now 1200px tall, so each hour = 120px (double the previous size)
    const totalCalendarMinutes = 10 * 60 // 600 minutes
    
    // Calculate percentage positions
    const topPercent = (startMinutes / totalCalendarMinutes) * 100
    const heightPercent = (durationMinutes / totalCalendarMinutes) * 100

    // Ensure we don't go negative or exceed 100%
    if (topPercent < 0 || topPercent > 100) {
      console.log(`Course ${course.course_code} time out of range: topPercent=${topPercent}`)
      return null
    }
    if (heightPercent <= 0) {
      console.log(`Course ${course.course_code} has invalid height: ${heightPercent}`)
      return null
    }

    // Ensure minimum height for readability (at least 10% of calendar height for better text display)
    const minHeightPercent = 10
    const finalHeightPercent = Math.max(heightPercent, minHeightPercent)
    
    // Adjust top if height was increased to prevent overflow
    let finalTopPercent = topPercent
    if (finalHeightPercent > heightPercent && topPercent + finalHeightPercent > 100) {
      finalTopPercent = Math.max(0, 100 - finalHeightPercent)
    }

    return {
      top: `${Math.max(0, finalTopPercent)}%`,
      height: `${Math.min(100, finalHeightPercent)}%`,
      minHeight: '70px', // Ensure minimum pixel height for text visibility
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-gray-700">Loading calendar...</div>
      </div>
    )
  }

  if (schedule.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
        <div className="text-center">
          <p className="text-xl font-bold text-gray-800 mb-2">No Schedule</p>
          <p className="text-gray-600">Generate a schedule to see it in calendar view</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pb-24 bg-gray-50 overflow-auto">
      <div className="p-4">
        {/* Header */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h2 className="font-bold text-gray-900 mb-1">Weekly Calendar View</h2>
              <p className="text-xs text-gray-600">{totalCredits} credits</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowSavedCalendars(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <FolderOpen className="w-4 h-4" />
              Saved
            </button>
            <button
              onClick={() => setShowSaveModal(true)}
              className="px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Save Calendar
            </button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-auto shadow-sm">
          <div className="min-w-[800px] overflow-visible">
            {/* Header Row with Days */}
            <div className="grid grid-cols-6 border-b border-gray-200 bg-gray-50 sticky top-0 z-20 shadow-sm">
              <div className="p-2 text-xs font-medium text-gray-500 border-r border-gray-200">
                Time
              </div>
              {dayAbbr.map((day, idx) => (
                <div key={day} className="p-2 text-center border-r border-gray-200 last:border-r-0">
                  <div className="font-semibold text-sm text-gray-900">{day}</div>
                  <div className="text-xs text-gray-500">{dayFull[idx]}</div>
                </div>
              ))}
            </div>

            {/* Calendar Grid with Fixed Height Container */}
            <div className="grid grid-cols-6 overflow-visible relative" style={{ minHeight: '1440px' }}>
              {/* Time Column */}
              <div className="border-r border-gray-200">
                {timeSlotsGrid.map((time) => (
                  <div 
                    key={time}
                    className="p-2 border-b border-gray-200 bg-gray-50 text-xs text-gray-600 font-medium h-[120px]"
                  >
                    {time}
                  </div>
                ))}
              </div>

              {/* Day Columns with Course Blocks */}
              {dayOrder.map((day) => {
                // Get all courses for this day
                const dayCourses = schedule.filter(course => {
                  return course.timeSlots && course.timeSlots.some(s => s.days && s.days.includes(day))
                })

                // Calendar spans from 8 AM (480 minutes) to 8 PM (1200 minutes) = 720 minutes total
                const calendarStartMinutes = 480 // 8 AM
                const calendarEndMinutes = 1200 // 8 PM
                const calendarHeightMinutes = calendarEndMinutes - calendarStartMinutes // 720 minutes
                const pixelsPerHour = 120 // Increased from 80px to give more space
                const calendarHeightPx = 12 * pixelsPerHour // 12 hours * 120px per hour = 1440px

                return (
                  <div 
                    key={day}
                    className="border-r border-gray-200 last:border-r-0 relative"
                    style={{ height: `${calendarHeightPx}px` }}
                  >
                    {/* Time slot dividers */}
                    {timeSlotsGrid.map((time) => (
                      <div 
                        key={time}
                        className="border-b border-gray-200 h-[120px]"
                      />
                    ))}

                    {/* Course Blocks positioned absolutely */}
                    {dayCourses.map((course, courseIdx) => {
                      const daySlot = course.timeSlots.find(s => s.days && s.days.includes(day))
                      if (!daySlot) return null

                      // Calculate position relative to calendar start (8 AM)
                      const courseStartMinutes = daySlot.startTime
                      const courseEndMinutes = daySlot.endTime
                      const durationMinutes = courseEndMinutes - courseStartMinutes

                      // Calculate top position (offset from 8 AM)
                      const topOffsetMinutes = courseStartMinutes - calendarStartMinutes
                      const topPercent = (topOffsetMinutes / calendarHeightMinutes) * 100

                      // Calculate height as percentage
                      const heightPercent = (durationMinutes / calendarHeightMinutes) * 100

                      // Ensure course is within calendar bounds
                      if (topPercent < 0 || topPercent > 100 || heightPercent <= 0) {
                        return null
                      }

                      // Check for overlapping courses and adjust z-index
                      const overlappingCourses = dayCourses.filter((otherCourse, otherIdx) => {
                        if (otherIdx === courseIdx) return false
                        const otherDaySlot = otherCourse.timeSlots.find(s => s.days && s.days.includes(day))
                        if (!otherDaySlot) return false
                        
                        const otherStartMinutes = otherDaySlot.startTime
                        const otherEndMinutes = otherDaySlot.endTime
                        const otherTopOffsetMinutes = otherStartMinutes - calendarStartMinutes
                        const otherTopPercent = (otherTopOffsetMinutes / calendarHeightMinutes) * 100
                        const otherDurationMinutes = otherEndMinutes - otherStartMinutes
                        const otherHeightPercent = (otherDurationMinutes / calendarHeightMinutes) * 100
                        
                        // Check if courses overlap
                        return !(topPercent + heightPercent <= otherTopPercent || otherTopPercent + otherHeightPercent <= topPercent)
                      })
                      
                      const zIndex = 15 + courseIdx + (overlappingCourses.length > 0 ? 5 : 0)

                      // Determine styling based on status
                      const isClosed = (course.status || '').toLowerCase() === 'closed'
                      const bgColor = isClosed ? 'bg-red-50' : 'bg-blue-50'
                      const borderColor = isClosed ? 'border-red-300' : 'border-blue-300'
                      const textColor = isClosed ? 'text-red-900' : 'text-blue-900'

                      const rating = course.gpa ? course.gpa.toFixed(1) : null
                      const grade = getGrade(course.gpa)

                      return (
                        <div
                          key={`${course.course_code}-${day}-${courseIdx}`}
                          onClick={() => setSelectedCourse(course)}
                          className={`${bgColor} ${borderColor} border rounded-md p-1.5 hover:shadow-md transition-all cursor-pointer absolute left-1 right-1 ${textColor}`}
                          style={{
                            top: `${Math.max(0, topPercent)}%`,
                            height: `${Math.min(heightPercent, 100 - topPercent)}%`,
                            minHeight: '50px',
                            zIndex: zIndex,
                            marginTop: courseIdx > 0 ? '2px' : '0'
                          }}
                        >
                          {/* Course Code and Status */}
                          <div className="flex items-center justify-between gap-1 mb-1">
                            <span className={`text-[10px] font-semibold truncate ${textColor}`}>
                              {course.course_code}
                            </span>
                            {getStatusBadge(course.status)}
                          </div>
                          
                          {/* Course Title */}
                          {course.course_name && (
                            <div className="text-[9px] text-gray-700 line-clamp-2 mb-1 leading-tight">
                              {course.course_name}
                            </div>
                          )}
                          
                          {/* Rating & Grade */}
                          {(rating || grade) && (
                            <div className="flex items-center gap-1 mb-1">
                              {rating && (
                                <div className="flex items-center gap-0.5 bg-yellow-500 text-white px-1 py-0.5 rounded text-[8px]">
                                  <Star className="w-2 h-2 fill-current" />
                                  <span className="font-bold">{rating}</span>
                                </div>
                              )}
                              {grade && (
                                <div className="bg-green-600 text-white px-1 py-0.5 rounded text-[8px] font-bold">
                                  {grade}
                                </div>
                              )}
                            </div>
                          )}
                          
                          {/* Location & Time */}
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-0.5 text-[8px] text-gray-600">
                              <Clock className="w-2 h-2 flex-shrink-0" />
                              <span className="truncate">
                                {formatTime(daySlot.startTime)} - {formatTime(daySlot.endTime)}
                              </span>
                            </div>
                            {course.building && course.room && (
                              <div className="flex items-start gap-0.5 text-[8px] text-gray-600 leading-tight">
                                <MapPin className="w-2 h-2 flex-shrink-0 mt-0.5" />
                                <span className="break-words">{course.building} {course.room}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Course Details Modal */}
        {selectedCourse && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedCourse(null)}
          >
            <div 
              className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="bg-red-600 text-white p-6 rounded-t-lg flex justify-between items-center">
                <h2 className="text-2xl font-bold">{selectedCourse.course_code}</h2>
                <button
                  onClick={() => setSelectedCourse(null)}
                  className="text-white hover:text-gray-200 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6 space-y-4">
                {/* Course Name */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">Course Name</h3>
                  <p className="text-gray-700">{selectedCourse.course_name}</p>
                </div>

                {/* Rating and Grade */}
                {selectedCourse.gpa && (
                  <div className="flex items-center gap-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">Rating</h3>
                      <p className="text-gray-700">★{selectedCourse.gpa.toFixed(1)}</p>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">Grade</h3>
                      <p className="text-gray-700">{getGrade(selectedCourse.gpa)}</p>
                    </div>
                  </div>
                )}

                {/* Meeting Times */}
                {selectedCourse.timeSlots && selectedCourse.timeSlots.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Meeting Times</h3>
                    <div className="space-y-2">
                      {selectedCourse.timeSlots.map((slot, idx) => (
                        <div key={idx} className="bg-gray-50 rounded p-3">
                          <p className="font-medium text-gray-900 mb-1">
                            {slot.days.join(', ')}
                          </p>
                          <p className="text-gray-700">
                            {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Location */}
                {(selectedCourse.building || selectedCourse.room) && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">Location</h3>
                    <p className="text-gray-700">
                      {selectedCourse.building} {selectedCourse.room}
                    </p>
                  </div>
                )}

                {/* Instructor */}
                {selectedCourse.instructor && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">Instructor</h3>
                    <p className="text-gray-700">{selectedCourse.instructor}</p>
                  </div>
                )}

                {/* Status */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">Status</h3>
                  <span className={`px-3 py-1 rounded text-sm font-semibold ${
                    (selectedCourse.status || 'Open').toLowerCase() === 'open' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {selectedCourse.status || 'Open'}
                  </span>
                </div>

                {/* Credits */}
                {selectedCourse.credits && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">Credits</h3>
                    <p className="text-gray-700">{selectedCourse.credits}</p>
                  </div>
                )}

                {/* Class Number */}
                {selectedCourse.class_number && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">Class Number</h3>
                    <p className="text-gray-700">{selectedCourse.class_number}</p>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="bg-gray-50 px-6 py-4 rounded-b-lg flex justify-between items-center">
                <button
                  onClick={async () => {
                    if (selectedCourse) {
                      await handleDeleteCourse(selectedCourse)
                    }
                  }}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Remove Course
                </button>
                <button
                  onClick={() => setSelectedCourse(null)}
                  className="px-6 py-2 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Course Legend */}
        <div className="mt-6 mb-24">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Courses</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {schedule.map((course, idx) => (
              <div
                key={idx}
                className="bg-gray-50 rounded-lg p-4 border border-gray-200"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-bold text-gray-900">{course.course_code}</h3>
                    <p className="text-sm text-gray-700">{course.course_name}</p>
                  </div>
                  {course.gpa && course.gpa > 0 && (
                    <div className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs font-semibold">
                      {course.gpa.toFixed(1)}
                    </div>
                  )}
                </div>
                {course.timeSlots.length > 0 && (
                  <div className="text-xs text-gray-600 space-y-1">
                    {course.timeSlots.map((slot, i) => (
                      <div key={i}>
                        <span className="font-semibold">{slot.days.join(', ')}</span>{' '}
                        {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                      </div>
                    ))}
                  </div>
                )}
                {course.instructor && (
                  <div className="text-xs text-gray-600 mt-1">Instructor: {course.instructor}</div>
                )}
                {course.building && course.room && (
                  <div className="text-xs text-gray-600">Location: {course.building} {course.room}</div>
                )}
                <button
                  onClick={async () => {
                    await handleDeleteCourse(course)
                  }}
                  className="mt-2 px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition-colors flex items-center gap-1"
                >
                  <Trash2 className="w-3 h-3" />
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Save Calendar Modal */}
        {showSaveModal && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowSaveModal(false)}
          >
            <div
              className="bg-white rounded-lg shadow-xl max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-green-600 text-white p-4 rounded-t-lg flex justify-between items-center">
                <h3 className="text-lg font-bold">Save Calendar</h3>
                <button
                  onClick={() => setShowSaveModal(false)}
                  className="text-white hover:text-gray-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Calendar Name
                </label>
                <input
                  type="text"
                  value={calendarName}
                  onChange={(e) => setCalendarName(e.target.value)}
                  placeholder="e.g., Fall 2024 Schedule"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleSaveCalendar()
                    }
                  }}
                />
                <p className="text-xs text-gray-500 mt-2">
                  This will save your current schedule with {schedule.length} course{schedule.length !== 1 ? 's' : ''}
                </p>
              </div>
              <div className="bg-gray-50 px-6 py-4 rounded-b-lg flex justify-end gap-2">
                <button
                  onClick={() => setShowSaveModal(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveCalendar}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Saved Calendars Modal */}
        {showSavedCalendars && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowSavedCalendars(false)}
          >
            <div
              className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-blue-600 text-white p-4 rounded-t-lg flex justify-between items-center">
                <h3 className="text-lg font-bold">Saved Calendars</h3>
                <button
                  onClick={() => setShowSavedCalendars(false)}
                  className="text-white hover:text-gray-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6">
                {savedCalendars.length === 0 ? (
                  <p className="text-gray-600 text-center py-8">No saved calendars yet</p>
                ) : (
                  <div className="space-y-3">
                    {savedCalendars.map((cal) => (
                      <div
                        key={cal.id}
                        className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 mb-1">{cal.name}</h4>
                            <p className="text-sm text-gray-600">
                              {cal.courses.length} course{cal.courses.length !== 1 ? 's' : ''} • Saved {new Date(cal.createdAt).toLocaleDateString()}
                            </p>
                            <div className="mt-2 flex flex-wrap gap-1">
                              {cal.courses.slice(0, 5).map((c, idx) => (
                                <span key={idx} className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded">
                                  {c.course_code}
                                </span>
                              ))}
                              {cal.courses.length > 5 && (
                                <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">
                                  +{cal.courses.length - 5} more
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex gap-2 ml-4">
                            <button
                              onClick={() => handleLoadCalendar(cal)}
                              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors"
                            >
                              Load
                            </button>
                            <button
                              onClick={() => handleDeleteSavedCalendar(cal.id)}
                              className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

