import { collectRequirementOptions, findSchedule, ScheduledCourse, TimeSlot } from "./scheduleCore"

// Simple deterministic helper functions
function calculateTimeMatch(schedule: ScheduledCourse[], prefs: any): number {
  if (!prefs.timePreferences) return 0.5

  let total = 0
  for (const c of schedule) {
    if (!c.timeSlots || c.timeSlots.length === 0) continue
    
    for (const slot of c.timeSlots) {
      if (prefs.timePreferences.noClassesBefore) {
        const timeStr = prefs.timePreferences.noClassesBefore
        const timeMatch = timeStr.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i)
        if (timeMatch) {
          const hour = parseInt(timeMatch[1])
          const min = parseInt(timeMatch[2])
          const period = timeMatch[3].toUpperCase()
          let thresholdMinutes = hour * 60 + min
          if (period === 'PM' && hour !== 12) thresholdMinutes += 12 * 60
          if (period === 'AM' && hour === 12) thresholdMinutes = min
          
          if (slot.startTime < thresholdMinutes) total -= 0.1
        }
      }
      
      if (prefs.timePreferences.noClassesAfter) {
        const timeStr = prefs.timePreferences.noClassesAfter
        const timeMatch = timeStr.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i)
        if (timeMatch) {
          const hour = parseInt(timeMatch[1])
          const min = parseInt(timeMatch[2])
          const period = timeMatch[3].toUpperCase()
          let thresholdMinutes = hour * 60 + min
          if (period === 'PM' && hour !== 12) thresholdMinutes += 12 * 60
          if (period === 'AM' && hour === 12) thresholdMinutes = min
          
          if (slot.endTime > thresholdMinutes) total -= 0.1
        }
      }
    }
  }
  return Math.max(0, Math.min(1, 0.5 + total))
}

function overlapDensity(schedule: ScheduledCourse[]): number {
  let conflicts = 0
  for (let i = 0; i < schedule.length; i++) {
    for (let j = i + 1; j < schedule.length; j++) {
      const a = schedule[i]
      const b = schedule[j]
      
      if (!a.timeSlots || !b.timeSlots) continue
      
      for (const slotA of a.timeSlots) {
        for (const slotB of b.timeSlots) {
          const commonDays = slotA.days.filter(day => slotB.days.includes(day))
          if (commonDays.length > 0) {
            if (slotA.startTime < slotB.endTime && slotB.startTime < slotA.endTime) {
              conflicts++
              break
            }
          }
        }
      }
    }
  }
  return conflicts / (schedule.length || 1)
}

function scoreSchedule(schedule: ScheduledCourse[], prefs: any): number {
  if (schedule.length === 0) return 0
  
  const avgGPA = schedule.reduce((s, c) => s + (c.gpa || 0), 0) / schedule.length
  const timeScore = calculateTimeMatch(schedule, prefs)
  const spreadScore = 1 - Math.min(1, overlapDensity(schedule))
  
  return avgGPA * 0.7 + timeScore * 0.2 + spreadScore * 0.1
}

function validateCoursePair(courseCode: string, classNumber: string, validPairs: Record<string, string[]> | undefined): void {
  if (!validPairs) return // Skip validation if no pairs provided
  
  const validNumbers = validPairs[courseCode]
  if (!validNumbers || !validNumbers.includes(classNumber)) {
    throw new Error(`Invalid pairing: ${courseCode}:${classNumber}`)
  }
}

export async function generateSmartSchedule(
  userPrefs: any,
  validPairs?: Record<string, string[]>
): Promise<{
  topSchedule: ScheduledCourse[]
  alternatives: ScheduledCourse[][]
  count: number
}> {
  console.log('[generateSmartSchedule] Starting with userPrefs:', {
    major: userPrefs.major,
    year: userPrefs.year,
    timePreferences: userPrefs.timePreferences || userPrefs.preferences
  })
  
  const baseOptions = await collectRequirementOptions(userPrefs)
  console.log(`[generateSmartSchedule] Collected ${baseOptions.length} requirement options`)

  // Filter invalid (future prereq placeholder)
  const validOptions = baseOptions.filter(o => {
    // Basic level check - can be enhanced with actual prerequisite checking
    const courseNumMatch = o.courseCode.match(/\d+/)
    if (courseNumMatch) {
      const num = parseInt(courseNumMatch[0])
      const year = userPrefs.year || 1
      
      // Rough heuristic: 300-level courses typically require year 3+, 400-level year 4+
      if (num >= 300 && year < 3) return false
      if (num >= 400 && year < 4) return false
    }
    return true
  })
  
  console.log(`[generateSmartSchedule] After filtering: ${validOptions.length} valid options`)
  
  if (validOptions.length === 0) {
    console.warn('[generateSmartSchedule] ⚠️ No valid options found after filtering!')
    return {
      topSchedule: [],
      alternatives: [],
      count: 0
    }
  }

  // Weight by GPA + slight randomization for variety
  const weighted = validOptions.map(o => ({
    ...o,
    weight: (o.gpa || 0) + Math.random() * 0.15,
  }))

  weighted.sort((a, b) => b.weight - a.weight)

  // Generate multiple valid schedules
  const MAX_SCHEDULES = 5
  console.log(`[generateSmartSchedule] Attempting to find up to ${MAX_SCHEDULES} schedules...`)
  const allSchedules = await findSchedule(weighted, userPrefs, MAX_SCHEDULES)
  console.log(`[generateSmartSchedule] Found ${allSchedules.length} candidate schedules`)

  // Validate and filter
  const validSchedules: ScheduledCourse[][] = []

  for (const schedule of allSchedules) {
    if (schedule && schedule.length > 0) {
      try {
        // Optional validation of pairs
        if (validPairs) {
          for (const c of schedule) {
            validateCoursePair(c.course_code, c.class_number, validPairs)
          }
        }
        validSchedules.push(schedule)
      } catch (err: any) {
        console.warn("Skipping invalid combination:", err.message)
      }
    }
  }

  console.log(`[generateSmartSchedule] After validation: ${validSchedules.length} valid schedules`)

  // Score and rank
  validSchedules.sort((a, b) => scoreSchedule(b, userPrefs) - scoreSchedule(a, userPrefs))

  if (validSchedules.length === 0) {
    console.error('[generateSmartSchedule] ❌ No valid schedules found! This could be due to:')
    console.error('  - All sections conflict with each other')
    console.error('  - Time preferences too strict')
    console.error('  - No sections available for requirements')
  }

  return {
    topSchedule: validSchedules[0] || [],
    alternatives: validSchedules.slice(1),
    count: validSchedules.length,
  }
}

