import { supabase } from './supabase'

// Type definitions
export interface TimeSlot {
  days: string[]
  startTime: number // minutes since midnight
  endTime: number
}

export interface Course {
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

export interface ScheduledCourse extends Course {
  timeSlots: TimeSlot[]
}

export interface RequirementOption {
  requirement: any
  courseCode: string
  courseName: string
  gpa: number
  sections: Array<{
    class_number: string
    meeting_time: string
    instructor: string | null
    room: string | null
    building: string | null
    status: string | null
    credits: string | null
    timeSlots: TimeSlot[]
  }>
}

// Parse meeting_time string to extract days and times
export function parseMeetingTime(meetingTime: string | null): TimeSlot[] {
  if (!meetingTime) return []

  const slots: TimeSlot[] = []
  
  // Extract day abbreviations (MWF, TuTh, MW, etc.)
  const dayPattern = /(M|Tu|W|Th|F|Sa|Su)+/i
  const dayMatch = meetingTime.match(dayPattern)
  if (!dayMatch) return []

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

  // Extract time
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
    
    // Fix common errors
    if (endHour === 12 && endMin === 0 && endPeriod === 'AM' && startPeriod === 'AM' && startHour < 12) {
      endPeriod = 'PM'
    }
    if (endHour === 12 && endMin === 0 && endPeriod === 'AM' && startPeriod === 'PM') {
      endPeriod = 'PM'
    }
  } else {
    // Try single time pattern
    timeMatch = meetingTime.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i)
    if (!timeMatch) return []
    
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
export function hasTimeConflict(slot1: TimeSlot, slot2: TimeSlot): boolean {
  const commonDays = slot1.days.filter(day => slot2.days.includes(day))
  if (commonDays.length === 0) return false
  return slot1.startTime < slot2.endTime && slot2.startTime < slot1.endTime
}

// Check if time slots conflict with existing schedule
export function hasTimeSlotsConflict(timeSlots: TimeSlot[], existingSchedule: ScheduledCourse[]): boolean {
  if (timeSlots.length === 0) return false
  if (existingSchedule.length === 0) return false

  for (const existingCourse of existingSchedule) {
    if (!existingCourse.timeSlots || existingCourse.timeSlots.length === 0) continue
    
    for (const existingSlot of existingCourse.timeSlots) {
      for (const courseSlot of timeSlots) {
        if (hasTimeConflict(existingSlot, courseSlot)) {
          return true
        }
      }
    }
  }
  return false
}

// Get GPA for a course (with caching)
const gpaCache = new Map<string, number>()

export async function getCourseGPA(courseCode: string): Promise<number> {
  if (gpaCache.has(courseCode)) {
    return gpaCache.get(courseCode)!
  }

  try {
    const { data, error } = await supabase
      .from('grade_distributions')
      .select('avg_class_grade')
      .eq('course_code', courseCode)
      .not('avg_class_grade', 'is', null)
      .limit(100)

    if (error || !data || data.length === 0) {
      gpaCache.set(courseCode, 0)
      return 0
    }

    const grades = data
      .map(d => parseFloat(d.avg_class_grade))
      .filter(g => !isNaN(g))

    if (grades.length === 0) {
      gpaCache.set(courseCode, 0)
      return 0
    }

    const avgGPA = grades.reduce((sum, g) => sum + g, 0) / grades.length
    gpaCache.set(courseCode, avgGPA)
    return avgGPA
  } catch (error) {
    gpaCache.set(courseCode, 0)
    return 0
  }
}

// Check if time slots meet preferences
export function meetsTimePreferences(timeSlots: TimeSlot[], prefs?: any): boolean {
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

// Collect requirement options from database
export async function collectRequirementOptions(userPrefs: any): Promise<RequirementOption[]> {
  const { major, expected_graduation_year, courses_taken = [] } = userPrefs
  
  // Get degree ID
  const { data: degreeData } = await supabase
    .from('degrees')
    .select('id')
    .eq('major_name', major)
    .single()

  if (!degreeData) throw new Error('Degree not found')

  // Calculate current semester
  const currentYear = new Date().getFullYear()
  const currentMonth = new Date().getMonth()
  const term = currentMonth >= 8 ? 'fall' : 'spring'

  // Calculate academic year
  let year = 1
  if (expected_graduation_year) {
    const yearsUntilGraduation = expected_graduation_year - currentYear
    if (yearsUntilGraduation === 4) year = 1
    else if (yearsUntilGraduation === 3) year = 2
    else if (yearsUntilGraduation === 2) year = 3
    else if (yearsUntilGraduation === 1) year = 4
    else if (yearsUntilGraduation > 4) year = 1
    else year = 4
  }

  const coursesTaken = (courses_taken || []).map((c: string) => c.trim().toUpperCase())

  // Get requirements
  const { data: requirements } = await supabase
    .from('degree_requirements')
    .select('*')
    .eq('degree_id', degreeData.id)
    .eq('year', year)
    .eq('term', term)

  if (!requirements || requirements.length === 0) {
    return []
  }

  // Handle time preferences - can be nested in timePreferences or at root level
  const timePrefs = userPrefs.timePreferences || userPrefs.preferences || userPrefs || {}
  const requirementOptions: RequirementOption[] = []

  for (const req of requirements) {
    // Get fulfilling courses
    const { data: fulfillments } = await supabase
      .from('requirement_fulfillments')
      .select('course_code')
      .eq('requirement_id', req.id)

    if (!fulfillments || fulfillments.length === 0) continue

    const fulfillingCourseCodes = fulfillments.map(f => f.course_code)
    
    // Check if already fulfilled
    const requirementFulfilled = fulfillingCourseCodes.some(code => {
      const normalized = code.trim().toUpperCase()
      return coursesTaken.includes(normalized)
    })

    if (requirementFulfilled) continue

    // Filter out taken courses
    const availableCourseCodes = fulfillingCourseCodes.filter(code => {
      const normalized = code.trim().toUpperCase()
      return !coursesTaken.includes(normalized)
    })

    if (availableCourseCodes.length === 0) continue

    // Get all sections
    const { data: allSections } = await supabase
      .from('courses')
      .select('course_code, course_name, class_number, meeting_time, instructor, room, building, status, credits')
      .in('course_code', availableCourseCodes)

    if (!allSections || allSections.length === 0) continue

    // Filter valid sections
    // Allow "Open" and "Closed" status (Closed might have waitlist spots)
    const validSections = allSections.filter(c => {
      // Only exclude if status is explicitly "Cancelled" or "Full" - allow "Open" and "Closed"
      if (c.status && (c.status === 'Cancelled' || c.status === 'Full')) return false
      if (!c.meeting_time || c.meeting_time === '') return false
      
      // Parse time slots first
      const timeSlots = parseMeetingTime(c.meeting_time)
      if (timeSlots.length === 0) return false // Must have parseable time
      
      // Apply time preferences if provided
      if (Object.keys(timePrefs).length > 0) {
        if (!meetsTimePreferences(timeSlots, timePrefs)) {
          return false
        }
      }
      
      return true
    })

    console.log(`[COLLECT] ${req.requirement_name}: Found ${allSections.length} total sections, ${validSections.length} valid sections`)
    
    if (validSections.length === 0) {
      console.log(`  ⚠️ No valid sections after filtering. Reasons could be: no meeting times, time preferences too strict, or all sections cancelled/full`)
      continue
    }

    // Group by course_code
    const courseCodeMap = new Map<string, typeof validSections>()
    for (const section of validSections) {
      const code = section.course_code
      if (!courseCodeMap.has(code)) {
        courseCodeMap.set(code, [])
      }
      courseCodeMap.get(code)!.push(section)
    }

    // Get GPAs and create options
    for (const [courseCode, sections] of courseCodeMap.entries()) {
      const gpa = await getCourseGPA(courseCode)
      const courseName = sections[0].course_name

      const sectionsWithTimeSlots = sections.map(section => {
        const timeSlots = parseMeetingTime(section.meeting_time)
        return {
          class_number: section.class_number,
          meeting_time: section.meeting_time,
          instructor: section.instructor,
          room: section.room,
          building: section.building,
          status: section.status,
          credits: section.credits,
          timeSlots: timeSlots
        }
      }).filter(s => s.timeSlots.length > 0)

      if (sectionsWithTimeSlots.length > 0) {
        requirementOptions.push({
          requirement: req,
          courseCode,
          courseName,
          gpa: gpa || 0,
          sections: sectionsWithTimeSlots
        })
      }
    }
  }

  // Sort by critical first, then GPA
  requirementOptions.sort((a, b) => {
    if (a.requirement.critical !== b.requirement.critical) {
      return b.requirement.critical ? 1 : -1
    }
    return b.gpa - a.gpa
  })

  return requirementOptions
}

// Find a valid schedule using backtracking (modified to collect multiple)
export async function findSchedule(
  requirementOptions: RequirementOption[],
  userPrefs: any,
  maxSchedules: number = 5
): Promise<ScheduledCourse[][]> {
  const validSchedules: ScheduledCourse[][] = []
  
  // Group by requirement
  const requirementGroups = new Map<string, RequirementOption[]>()
  for (const option of requirementOptions) {
    const reqId = option.requirement.id
    if (!requirementGroups.has(reqId)) {
      requirementGroups.set(reqId, [])
    }
    requirementGroups.get(reqId)!.push(option)
  }

  const reqIds = Array.from(requirementGroups.keys())
  
  // Backtracking function
  const findBestSchedule = (reqIndex: number, currentSchedule: ScheduledCourse[]): ScheduledCourse[] | null => {
    if (reqIndex >= reqIds.length) {
      // All requirements satisfied - validate
      const validatedSchedule: ScheduledCourse[] = []
      
      for (const course of currentSchedule) {
        if (!hasTimeSlotsConflict(course.timeSlots, validatedSchedule)) {
          validatedSchedule.push(course)
        }
      }
      
      return validatedSchedule.length > 0 ? validatedSchedule : null
    }

    const reqId = reqIds[reqIndex]
    const options = requirementGroups.get(reqId) || []
    
    if (options.length === 0) {
      return findBestSchedule(reqIndex + 1, currentSchedule)
    }

    // Sort by GPA
    const sortedOptions = [...options].sort((a, b) => b.gpa - a.gpa)

    // Try each option
    for (const option of sortedOptions) {
      for (const section of option.sections) {
        if (section.timeSlots.length === 0) continue
        
        if (!hasTimeSlotsConflict(section.timeSlots, currentSchedule)) {
          const courseToAdd: ScheduledCourse = {
            course_code: option.courseCode,
            course_name: option.courseName,
            class_number: section.class_number,
            meeting_time: section.meeting_time,
            instructor: section.instructor,
            room: section.room,
            building: section.building,
            status: section.status,
            credits: section.credits,
            gpa: option.gpa,
            requirement_name: option.requirement.requirement_name,
            timeSlots: section.timeSlots
          }

          const newSchedule = [...currentSchedule, courseToAdd]
          const result = findBestSchedule(reqIndex + 1, newSchedule)
          
          if (result && result.length > 0) {
            return result
          }
        }
      }
    }

    return findBestSchedule(reqIndex + 1, currentSchedule)
  }

  // Generate multiple schedules with slight randomization
  // Create a closure that uses a specific reqIds order
  const findScheduleWithOrder = (reqIdsOrder: string[]): ScheduledCourse[] | null => {
    const findBestScheduleWithOrder = (reqIndex: number, currentSchedule: ScheduledCourse[]): ScheduledCourse[] | null => {
      if (reqIndex >= reqIdsOrder.length) {
        const validatedSchedule: ScheduledCourse[] = []
        for (const course of currentSchedule) {
          if (!hasTimeSlotsConflict(course.timeSlots, validatedSchedule)) {
            validatedSchedule.push(course)
          }
        }
        return validatedSchedule.length > 0 ? validatedSchedule : null
      }

      const reqId = reqIdsOrder[reqIndex]
      const options = requirementGroups.get(reqId) || []
      
      if (options.length === 0) {
        return findBestScheduleWithOrder(reqIndex + 1, currentSchedule)
      }

      const sortedOptions = [...options].sort((a, b) => b.gpa - a.gpa)

      for (const option of sortedOptions) {
        for (const section of option.sections) {
          if (section.timeSlots.length === 0) continue
          
          if (!hasTimeSlotsConflict(section.timeSlots, currentSchedule)) {
            const courseToAdd: ScheduledCourse = {
              course_code: option.courseCode,
              course_name: option.courseName,
              class_number: section.class_number,
              meeting_time: section.meeting_time,
              instructor: section.instructor,
              room: section.room,
              building: section.building,
              status: section.status,
              credits: section.credits,
              gpa: option.gpa,
              requirement_name: option.requirement.requirement_name,
              timeSlots: section.timeSlots
            }

            const newSchedule = [...currentSchedule, courseToAdd]
            const result = findBestScheduleWithOrder(reqIndex + 1, newSchedule)
            
            if (result && result.length > 0) {
              return result
            }
          }
        }
      }

      return findBestScheduleWithOrder(reqIndex + 1, currentSchedule)
    }
    
    return findBestScheduleWithOrder(0, [])
  }

  // First attempt with original order
  const firstSchedule = findScheduleWithOrder(reqIds)
  if (firstSchedule) {
    validSchedules.push(firstSchedule)
  }

  // Generate more schedules with shuffled order
  const attempts = Math.min(maxSchedules * 2, 10)
  
  for (let i = 1; i < attempts && validSchedules.length < maxSchedules; i++) {
    // Shuffle non-critical requirements for variety
    const critical = reqIds.filter(id => {
      const opts = requirementGroups.get(id) || []
      return opts.length > 0 && opts[0].requirement.critical
    })
    const nonCritical = reqIds.filter(id => {
      const opts = requirementGroups.get(id) || []
      return opts.length > 0 && !opts[0].requirement.critical
    })
    
    // Shuffle non-critical
    const shuffledNonCritical = [...nonCritical]
    for (let j = shuffledNonCritical.length - 1; j > 0; j--) {
      const k = Math.floor(Math.random() * (j + 1));
      [shuffledNonCritical[j], shuffledNonCritical[k]] = [shuffledNonCritical[k], shuffledNonCritical[j]]
    }
    
    const shuffledReqIds = [...critical, ...shuffledNonCritical]
    const schedule = findScheduleWithOrder(shuffledReqIds)
    
    if (schedule) {
      // Check if we already have this schedule
      const isDuplicate = validSchedules.some(existing => {
        if (existing.length !== schedule.length) return false
        return existing.every(c => 
          schedule.some(s => s.course_code === c.course_code && s.class_number === c.class_number)
        )
      })
      
      if (!isDuplicate) {
        validSchedules.push(schedule)
      }
    }
  }

  return validSchedules
}

