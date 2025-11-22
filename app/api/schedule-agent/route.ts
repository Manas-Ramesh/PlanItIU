import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@supabase/supabase-js'

// Lazy initialization to avoid build-time errors
const getAnthropic = () => {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error('Missing ANTHROPIC_API_KEY environment variable')
  }
  return new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  })
}

const getSupabase = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  // Use service role key to bypass RLS for server-side operations
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Missing Supabase environment variables')
  }
  
  // Warn if using anon key (may be restricted by RLS)
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.warn('⚠️ Using anon key - RLS may restrict results. Consider using SUPABASE_SERVICE_ROLE_KEY for server-side operations.')
  }
  
  return createClient(supabaseUrl, supabaseServiceKey)
}

// Tool definitions for Claude (Anthropic format)
const tools = [
  {
    name: 'generate_schedule',
    description: 'Generate a new course schedule based on user preferences. This will create a schedule with courses that fulfill degree requirements, avoid time conflicts, and prioritize high GPA courses.',
    input_schema: {
      type: 'object',
      properties: {
        preferences: {
          type: 'object',
          description: 'Optional preferences to override defaults',
          properties: {
            preferMorningClasses: {
              type: 'boolean',
              description: 'Prefer morning classes (before 12 PM)'
            },
            preferAfternoonClasses: {
              type: 'boolean',
              description: 'Prefer afternoon classes (after 12 PM)'
            },
            maxCredits: {
              type: 'number',
              description: 'Maximum number of credits (default: 15)'
            },
            minCredits: {
              type: 'number',
              description: 'Minimum number of credits (default: 12 for full-time)'
            },
            avoidDays: {
              type: 'array',
              items: { type: 'string' },
              description: 'Days to avoid (e.g., ["Friday", "Monday"])'
            }
          }
        }
      },
      required: []
    }
  },
  {
    name: 'get_current_schedule',
    description: 'Get information about the current generated schedule including courses, times, credits, and conflicts.',
    input_schema: {
      type: 'object',
      properties: {},
      required: []
    }
  },
  {
    name: 'modify_schedule',
    description: 'Modify the current schedule by replacing a course with an alternative section or course.',
    input_schema: {
      type: 'object',
      properties: {
        action: {
          type: 'string',
          enum: ['replace', 'remove', 'add'],
          description: 'Action to take: replace a course, remove a course, or add a course'
        },
        courseCode: {
          type: 'string',
          description: 'Course code to modify (e.g., "BUS-A 304")'
        },
        classNumber: {
          type: 'string',
          description: 'Class number to modify (if replacing/removing specific section)'
        },
        reason: {
          type: 'string',
          description: 'Reason for the modification (e.g., "time conflict", "prefer different time")'
        }
      },
      required: ['action', 'courseCode']
    }
  },
  {
    name: 'get_course_options',
    description: 'Get available course options for a specific requirement or course code.',
    input_schema: {
      type: 'object',
      properties: {
        requirementName: {
          type: 'string',
          description: 'Name of the requirement to get options for'
        },
        courseCode: {
          type: 'string',
          description: 'Course code to get alternative sections for'
        }
      }
    }
  },
  {
    name: 'analyze_schedule',
    description: 'Analyze the current schedule for conflicts, gaps, GPA distribution, credit load, and other insights.',
    input_schema: {
      type: 'object',
      properties: {},
      required: []
    }
  },
  {
    name: 'query_courses',
    description: 'Query courses from the database with filters. Use this to find courses that meet specific criteria like time preferences, GPA thresholds, or prerequisites.',
    input_schema: {
      type: 'object',
      properties: {
        courseCodes: {
          type: 'array',
          items: { type: 'string' },
          description: 'Specific course codes to query (e.g., ["BUS-A 304", "BUS-K 303"])'
        },
        requirementName: {
          type: 'string',
          description: 'Get all courses that fulfill a specific requirement'
        },
        minGPA: {
          type: 'number',
          description: 'Minimum GPA threshold (0-4.0)'
        },
        timeFilter: {
          type: 'object',
          description: 'Filter by meeting times',
          properties: {
            noBefore: {
              type: 'string',
              description: 'No classes before this time (e.g., "11:00 AM")'
            },
            noAfter: {
              type: 'string',
              description: 'No classes after this time (e.g., "5:00 PM")'
            },
            avoidDays: {
              type: 'array',
              items: { type: 'string' },
              description: 'Days to avoid (e.g., ["Friday", "Monday"])'
            }
          }
        },
        status: {
          type: 'string',
          enum: ['Open', 'Closed', 'Waitlist'],
          description: 'Filter by enrollment status'
        }
      }
    }
  },
  {
    name: 'get_degree_requirements',
    description: 'Get all degree requirements for the current semester or specific year/term. This helps understand what courses are needed.',
    input_schema: {
      type: 'object',
      properties: {
        year: {
          type: 'number',
          description: 'Academic year (1-4). If not provided, uses current semester.'
        },
        term: {
          type: 'string',
          enum: ['fall', 'spring'],
          description: 'Term. If not provided, uses current semester.'
        }
      }
    }
  },
  {
    name: 'check_prerequisites',
    description: 'Check if prerequisites are met for a course. Returns which prerequisites are satisfied and which are missing based on courses already taken.',
    input_schema: {
      type: 'object',
      properties: {
        courseCode: {
          type: 'string',
          description: 'Course code to check prerequisites for (e.g., "BUS-A 304")'
        }
      },
      required: ['courseCode']
    }
  },
  {
    name: 'get_course_gpa',
    description: 'Get the average GPA for a specific course based on historical grade distributions.',
    input_schema: {
      type: 'object',
      properties: {
        courseCode: {
          type: 'string',
          description: 'Course code (e.g., "BUS-A 304")'
        }
      },
      required: ['courseCode']
    }
  },
  {
    name: 'build_custom_schedule',
    description: 'Build a custom schedule with specific preferences. This tool allows you to specify detailed time constraints, GPA preferences, and other criteria. The system will find the best courses that meet all requirements while respecting your preferences.',
    input_schema: {
      type: 'object',
      properties: {
        preferences: {
          type: 'object',
          description: 'Detailed scheduling preferences',
          properties: {
            noClassesBefore: {
              type: 'string',
              description: 'No classes before this time (e.g., "11:00 AM", "9:00 AM")'
            },
            noClassesAfter: {
              type: 'string',
              description: 'No classes after this time (e.g., "5:00 PM", "3:00 PM")'
            },
            avoidDays: {
              type: 'array',
              items: { type: 'string' },
              description: 'Days to avoid (e.g., ["Friday", "Monday"])'
            },
            preferDays: {
              type: 'array',
              items: { type: 'string' },
              description: 'Preferred days (e.g., ["Tuesday", "Thursday"])'
            },
            minGPA: {
              type: 'number',
              description: 'Minimum GPA threshold for courses (0-4.0). Higher values prioritize better courses.'
            },
            maxCredits: {
              type: 'number',
              description: 'Maximum credits (default: 15)'
            },
            minCredits: {
              type: 'number',
              description: 'Minimum credits for full-time status (default: 12)'
            },
            prioritizeGPA: {
              type: 'boolean',
              description: 'Prioritize courses with higher GPAs (default: true)'
            }
          }
        }
      },
      required: ['preferences']
    }
  },
  {
    name: 'add_course_to_schedule',
    description: 'Add a specific course section to the schedule. Use this after querying courses and deciding which ones to include. This allows you to build the schedule step by step.',
    input_schema: {
      type: 'object',
      properties: {
        courseCode: {
          type: 'string',
          description: 'Course code (e.g., "BUS-A 304")'
        },
        classNumber: {
          type: 'string',
          description: 'Class/section number'
        },
        requirementName: {
          type: 'string',
          description: 'Which requirement this course fulfills'
        }
      },
      required: ['courseCode', 'classNumber', 'requirementName']
    }
  },
  {
    name: 'finalize_schedule',
    description: 'Finalize and save the schedule you have built. Call this when you have added all the courses you want. The schedule will be saved and displayed.',
    input_schema: {
      type: 'object',
      properties: {
        courses: {
          type: 'array',
          description: 'Array of courses to include in the final schedule',
          items: {
            type: 'object',
            properties: {
              courseCode: { type: 'string' },
              classNumber: { type: 'string' },
              requirementName: { type: 'string' }
            },
            required: ['courseCode', 'classNumber', 'requirementName']
          }
        }
      },
      required: ['courses']
    }
  }
]

// In-memory schedule builder (per user session)
const scheduleBuilders = new Map<string, any[]>()

// Store valid courseCode/classNumber pairs from recent query_courses calls (per user session)
// Format: userId -> { requirementName: string, validPairs: Record<string, string[]> }
const recentValidPairs = new Map<string, { requirementName: string, validPairs: Record<string, string[]> }>()

// Validation function to check if courseCode/classNumber pair is valid
function validateCoursePair(
  courseCode: string, 
  classNumber: string, 
  validPairs: Record<string, string[]> | undefined
): { valid: boolean, error?: string } {
  if (!validPairs) {
    // If no valid pairs stored, skip validation (fallback to database check)
    return { valid: true }
  }
  
  const validNumbers = validPairs[courseCode]
  if (!validNumbers || validNumbers.length === 0) {
    return { 
      valid: false, 
      error: `Invalid courseCode: ${courseCode}. This courseCode was not found in the recent query results.` 
    }
  }
  
  if (!validNumbers.includes(classNumber)) {
    const validList = validNumbers.join(', ')
    return { 
      valid: false, 
      error: `Invalid pairing: courseCode "${courseCode}" cannot use classNumber "${classNumber}". Valid classNumbers for ${courseCode} are: ${validList}` 
    }
  }
  
  return { valid: true }
}

export async function POST(request: NextRequest) {
  try {
    const { messages, userId, currentSchedule } = await request.json()
    
    // Initialize schedule builder for this user if needed
    if (!scheduleBuilders.has(userId)) {
      scheduleBuilders.set(userId, [])
    }
    const userScheduleBuilder = scheduleBuilders.get(userId) || []

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: 'Anthropic API key not configured. Please set ANTHROPIC_API_KEY in your environment variables.' },
        { status: 500 }
      )
    }

    // Fetch user context
    let userContext = ''
    if (userId) {
      try {
        const supabase = getSupabase()
        const { data: preferences } = await supabase
          .from('user_preferences')
          .select('major, expected_graduation_year, courses_taken')
          .eq('user_id', userId)
          .single()

        if (preferences) {
          userContext = `\n\n## User Information:\n`
          userContext += `- Major: ${preferences.major || 'Not set'}\n`
          userContext += `- Expected Graduation Year: ${preferences.expected_graduation_year || 'Not set'}\n`
          userContext += `- Courses Already Taken: ${(preferences.courses_taken || []).join(', ') || 'None'}\n`
        }
      } catch (error) {
        console.error('Error fetching user context:', error)
      }
    }

    const systemPrompt = `You are an AI schedule assistant for PlanItIU. You MUST build schedules yourself by analyzing all courses, scoring them, and selecting the best ones. DO NOT use the regular algorithm - YOU build the schedule.

**YOUR JOB: Analyze, Score, Select, Build, Finalize**

When user asks to generate a schedule:
1. IMMEDIATELY call build_custom_schedule with preferences (NO explanation)
2. Get all requirements using get_degree_requirements
3. For EACH requirement:
   - Call query_courses to get ALL available courses (do NOT filter by status - include Open, Closed, Waitlist, etc. Also query without strict time filters to see all options)
   - Analyze the courses: check GPA, meeting times, prerequisites
   - Score each course based on: GPA (higher is better), time preferences (if provided), prerequisites met
   - Select the BEST course that meets preferences and doesn't conflict
   - Call check_prerequisites for your selected course
   - Call add_course_to_schedule (this checks time conflicts automatically)
4. Continue until you have 12+ credits
5. IMMEDIATELY call finalize_schedule - this automatically displays the schedule

**IMPORTANT:**
- Query courses WITHOUT strict time filters first to see all options
- YOU analyze and score courses yourself
- YOU select the best ones based on GPA and preferences
- The add_course_to_schedule tool will check time conflicts - if a course conflicts, try the next best option
- When you have 12+ credits, IMMEDIATELY call finalize_schedule - do not wait

**WORKFLOW EXAMPLE:**

User: "Generate schedule with no classes before 11 AM"
1. build_custom_schedule({ preferences: { noClassesBefore: "11:00 AM" } })
2. get_degree_requirements()
3. For each requirement:
   - query_courses({ requirementName: "..." }) // Query all courses (no status filter, no time filter)
   - Analyze results: check GPAs, times, prerequisites
   - Select best course that starts after 11 AM (or best available if none)
   - check_prerequisites → add_course_to_schedule
4. When 12+ credits: finalize_schedule

**CRITICAL:** You MUST call finalize_schedule when done. This automatically displays the schedule - the user does NOT need to click any button.${userContext}

Current schedule context: ${currentSchedule ? JSON.stringify(currentSchedule, null, 2) : 'No schedule generated yet'}`

    // Convert messages to Claude format
    const recentMessages = messages.slice(-20)
    const claudeMessages: any[] = []
    
    // Convert messages (skip system messages as we'll use system parameter)
    for (const msg of recentMessages) {
      if (msg.role === 'user' || msg.role === 'assistant') {
        claudeMessages.push({
          role: msg.role,
          content: msg.content
        })
      }
    }

    // First call - get tool selection
    // Check if last message indicates we should force tool use
    const lastUserMessage = claudeMessages[claudeMessages.length - 1]?.content
    const shouldForceTool = typeof lastUserMessage === 'string' && (
      lastUserMessage.includes('generate') || 
      lastUserMessage.includes('schedule') ||
      lastUserMessage.includes('build')
    )
    
    const anthropic = getAnthropic()
    const completion = await anthropic.messages.create({
      model: 'claude-4-sonnet-20250514', // Claude Sonnet 4
      max_tokens: 4096,
      temperature: 0.2, // Lower temperature for more deterministic tool use
      system: systemPrompt,
      messages: claudeMessages,
      tools: tools as any,
      ...(shouldForceTool ? { tool_choice: { type: 'any' } } : {}), // Force tool use if user is asking to generate
    })

    // Find the first tool_use or text content
    const message = completion.content.find((block: any) => block.type === 'tool_use' || block.type === 'text') || completion.content[0]

    // If the model wants to use a tool
    if (message?.type === 'tool_use') {
      const toolCall = message
      let functionName = toolCall.name
      const functionArgs: any = toolCall.input || {}

      let toolResult: any = {}

      // Execute the tool
      switch (functionName) {
        case 'generate_schedule':
          try {
            console.log('🔧 generate_schedule tool called with preferences:', functionArgs.preferences)
            
            // Get user preferences
            const supabase = getSupabase()
            const { data: userPrefs } = await supabase
              .from('user_preferences')
              .select('major, expected_graduation_year, courses_taken')
              .eq('user_id', userId)
              .single()

            if (!userPrefs?.major) {
              toolResult = {
                success: false,
                message: 'User major not found. Please complete onboarding first.'
              }
              break
            }

            // Merge preferences
            const preferences = {
              ...userPrefs,
              timePreferences: functionArgs.preferences || {},
              preferences: functionArgs.preferences || {} // Also at root level for compatibility
            }

            // Import and use smart schedule generator
            const { generateSmartSchedule } = await import('@/lib/generateSmartSchedule')
            
            // Get valid pairs from recent query_courses if available
            const storedValidPairs = recentValidPairs.get(userId)
            const validPairs = storedValidPairs?.validPairs

            const scheduleResult = await generateSmartSchedule(preferences, validPairs)

            if (!scheduleResult.topSchedule || scheduleResult.topSchedule.length === 0) {
              toolResult = {
                success: false,
                message: 'No valid schedules found. Please try adjusting your preferences.'
              }
              break
            }

            // Return schedule data (front-end will handle localStorage)
            const scheduleKey = `generatedSchedule_${userId}`
            toolResult = {
              success: true,
              topSchedule: scheduleResult.topSchedule,
              alternatives: scheduleResult.alternatives,
              count: scheduleResult.count,
              message: `Generated ${scheduleResult.count} valid schedule${scheduleResult.count > 1 ? 's' : ''}. Top schedule has ${scheduleResult.topSchedule.length} courses.`,
              action: 'generate',
              scheduleKey: scheduleKey
            }
          } catch (error: any) {
            console.error('Error generating schedule:', error)
            toolResult = {
              success: false,
              message: `Error generating schedule: ${error.message}`
            }
          }
          break

        case 'get_current_schedule':
          if (currentSchedule && currentSchedule.length > 0) {
            const totalCredits = currentSchedule.reduce((sum: number, course: any) => {
              return sum + (parseInt(course.credits) || 0)
            }, 0)
            
            const courses = currentSchedule.map((course: any) => ({
              code: course.course_code,
              name: course.course_name,
              classNumber: course.class_number,
              time: course.meeting_time,
              credits: course.credits,
              gpa: course.gpa,
              instructor: course.instructor
            }))

            toolResult = {
              success: true,
              totalCredits,
              courseCount: currentSchedule.length,
              courses,
              message: `Current schedule has ${currentSchedule.length} courses totaling ${totalCredits} credits.`
            }
          } else {
            toolResult = {
              success: false,
              message: 'No schedule has been generated yet. Would you like me to generate one?'
            }
          }
          break

        case 'modify_schedule':
          toolResult = {
            success: true,
            message: `I'll help you ${functionArgs.action} ${functionArgs.courseCode}${functionArgs.classNumber ? ` (section ${functionArgs.classNumber})` : ''}. ${functionArgs.reason ? `Reason: ${functionArgs.reason}` : ''}`,
            action: 'modify',
            modification: {
              action: functionArgs.action,
              courseCode: functionArgs.courseCode,
              classNumber: functionArgs.classNumber,
              reason: functionArgs.reason
            }
          }
          break

        case 'get_course_options':
          toolResult = {
            success: true,
            message: `I'll look up course options for ${functionArgs.requirementName || functionArgs.courseCode}.`,
            action: 'query',
            query: functionArgs
          }
          break

        case 'analyze_schedule':
          if (currentSchedule && currentSchedule.length > 0) {
            const totalCredits = currentSchedule.reduce((sum: number, course: any) => {
              return sum + (parseInt(course.credits) || 0)
            }, 0)
            
            const avgGPA = currentSchedule.reduce((sum: number, course: any) => {
              return sum + (course.gpa || 0)
            }, 0) / currentSchedule.length

            const timeSlots: any[] = []
            currentSchedule.forEach((course: any) => {
              if (course.timeSlots) {
                course.timeSlots.forEach((slot: any) => {
                  timeSlots.push({
                    course: course.course_code,
                    days: slot.days,
                    start: slot.startTime,
                    end: slot.endTime
                  })
                })
              }
            })

            // Check for conflicts
            const conflicts: any[] = []
            for (let i = 0; i < timeSlots.length; i++) {
              for (let j = i + 1; j < timeSlots.length; j++) {
                const slot1 = timeSlots[i]
                const slot2 = timeSlots[j]
                const commonDays = slot1.days.filter((day: string) => slot2.days.includes(day))
                if (commonDays.length > 0) {
                  const overlaps = slot1.start < slot2.end && slot2.start < slot1.end
                  if (overlaps) {
                    conflicts.push({
                      course1: slot1.course,
                      course2: slot2.course,
                      day: commonDays[0]
                    })
                  }
                }
              }
            }

            toolResult = {
              success: true,
              analysis: {
                totalCredits,
                courseCount: currentSchedule.length,
                averageGPA: avgGPA.toFixed(2),
                conflicts: conflicts.length,
                conflictDetails: conflicts,
                isFullTime: totalCredits >= 12,
                recommendation: totalCredits < 12 
                  ? 'Schedule is below full-time status (12 credits). Consider adding more courses.'
                  : totalCredits > 18
                  ? 'Schedule exceeds recommended credit load. Consider reducing courses.'
                  : 'Schedule looks good!'
              },
              message: `Schedule analysis: ${currentSchedule.length} courses, ${totalCredits} credits, average GPA ${avgGPA.toFixed(2)}, ${conflicts.length} time conflicts detected.`
            }
          } else {
            toolResult = {
              success: false,
              message: 'No schedule to analyze. Please generate a schedule first.'
            }
          }
          break

        case 'query_courses':
          try {
            // Get user preferences for context
            const supabase = getSupabase()
            const { data: userPrefs } = await supabase
              .from('user_preferences')
              .select('major, expected_graduation_year, courses_taken')
              .eq('user_id', userId)
              .single()

            let query = supabase.from('courses').select('*')

            // Filter by course codes if provided
            if (functionArgs.courseCodes && functionArgs.courseCodes.length > 0) {
              query = query.in('course_code', functionArgs.courseCodes)
            }

            // Filter by requirement if provided
            if (functionArgs.requirementName) {
              const { data: degree } = await getSupabase()
                .from('degrees')
                .select('id')
                .eq('major_name', userPrefs?.major)
                .single()

              if (degree) {
                const { data: req } = await getSupabase()
                  .from('degree_requirements')
                  .select('id')
                  .eq('degree_id', degree.id)
                  .eq('requirement_name', functionArgs.requirementName)
                  .single()

                if (req) {
                  const { data: fulfillments } = await getSupabase()
                    .from('requirement_fulfillments')
                    .select('course_code')
                    .eq('requirement_id', req.id)

                  if (fulfillments) {
                    const codes = fulfillments.map(f => f.course_code)
                    query = query.in('course_code', codes)
                  }
                }
              }
            }

            // Filter by status (if provided, otherwise don't filter - allow all statuses)
            // Note: For now, we're not filtering by status since fall courses may be closed
            if (functionArgs.status) {
              query = query.eq('status', functionArgs.status)
            }
            // No default status filter - allow Open, Closed, Waitlist, etc.

            const { data: courses, error } = await query

            if (error) {
              toolResult = { success: false, message: `Error querying courses: ${error.message}` }
              break
            }

            // Filter by time preferences if provided
            let filteredCourses = courses || []
            if (functionArgs.timeFilter) {
              const noBefore = functionArgs.timeFilter.noBefore
              const noAfter = functionArgs.timeFilter.noAfter
              const avoidDays = functionArgs.timeFilter.avoidDays || []

              // Parse time threshold for noBefore
              let noBeforeMinutes: number | null = null
              if (noBefore) {
                const timeMatch = noBefore.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i)
                if (timeMatch) {
                  let hour = parseInt(timeMatch[1])
                  const min = parseInt(timeMatch[2])
                  const period = timeMatch[3].toUpperCase()
                  if (period === 'PM' && hour !== 12) hour += 12
                  if (period === 'AM' && hour === 12) hour = 0
                  noBeforeMinutes = hour * 60 + min
                }
              }

              // Parse time threshold for noAfter
              let noAfterMinutes: number | null = null
              if (noAfter) {
                const timeMatch = noAfter.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i)
                if (timeMatch) {
                  let hour = parseInt(timeMatch[1])
                  const min = parseInt(timeMatch[2])
                  const period = timeMatch[3].toUpperCase()
                  if (period === 'PM' && hour !== 12) hour += 12
                  if (period === 'AM' && hour === 12) hour = 0
                  noAfterMinutes = hour * 60 + min
                }
              }

              filteredCourses = filteredCourses.filter((course: any) => {
                if (!course.meeting_time) return false

                // Check avoid days
                const meetingDays = course.meeting_time.match(/(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)/gi) || []
                if (avoidDays.some((day: string) => meetingDays.some((md: string) => md.toLowerCase().includes(day.toLowerCase())))) {
                  return false
                }

                // Parse course meeting times
                const timePattern = /(\d{1,2}):(\d{2})\s*(AM|PM)/gi
                const times = []
                let match
                while ((match = timePattern.exec(course.meeting_time)) !== null) {
                  let hour = parseInt(match[1])
                  const min = parseInt(match[2])
                  const period = match[3].toUpperCase()
                  if (period === 'PM' && hour !== 12) hour += 12
                  if (period === 'AM' && hour === 12) hour = 0
                  times.push(hour * 60 + min)
                }

                if (times.length === 0) return true // Keep if can't parse

                // Check noBefore constraint (check if any time is before the threshold)
                if (noBeforeMinutes !== null) {
                  const earliestTime = Math.min(...times)
                  if (earliestTime < noBeforeMinutes) return false
                }

                // Check noAfter constraint (check if any time is after the threshold)
                if (noAfterMinutes !== null) {
                  const latestTime = Math.max(...times)
                  if (latestTime > noAfterMinutes) return false
                }

                return true
              })
            }

            // Get GPAs and filter by minGPA
            const coursesWithGPA = await Promise.all(
              filteredCourses.map(async (course: any) => {
                const { data: grades } = await getSupabase()
                  .from('grade_distributions')
                  .select('avg_class_grade')
                  .eq('course_code', course.course_code)
                  .not('avg_class_grade', 'is', null)
                  .limit(100)

                const gpa = grades && grades.length > 0
                  ? grades.reduce((sum: number, g: any) => sum + parseFloat(g.avg_class_grade || 0), 0) / grades.length
                  : 0

                return { ...course, gpa }
              })
            )

            if (functionArgs.minGPA) {
              filteredCourses = coursesWithGPA.filter((c: any) => c.gpa >= functionArgs.minGPA)
            } else {
              filteredCourses = coursesWithGPA
            }

            // Sort by GPA descending
            filteredCourses.sort((a: any, b: any) => (b.gpa || 0) - (a.gpa || 0))

            // If no courses found, try without time filter
            if (filteredCourses.length === 0 && functionArgs.timeFilter) {
              console.log(`⚠️ query_courses: Found 0 courses with time filter. Trying without time filter for "${functionArgs.requirementName}"...`)
              
              // Retry without time filter
              let retryCourses = courses || []
              const retryCoursesWithGPA = await Promise.all(
                retryCourses.map(async (course: any) => {
                  const { data: grades } = await supabase
                    .from('grade_distributions')
                    .select('avg_class_grade')
                    .eq('course_code', course.course_code)
                    .not('avg_class_grade', 'is', null)
                    .limit(100)

                  const gpa = grades && grades.length > 0
                    ? grades.reduce((sum: number, g: any) => sum + parseFloat(g.avg_class_grade || 0), 0) / grades.length
                    : 0

                  return { ...course, gpa }
                })
              )
              
              if (functionArgs.minGPA) {
                retryCourses = retryCoursesWithGPA.filter((c: any) => c.gpa >= functionArgs.minGPA)
              } else {
                retryCourses = retryCoursesWithGPA
              }
              
              retryCourses.sort((a: any, b: any) => (b.gpa || 0) - (a.gpa || 0))
              
              if (retryCourses.length > 0) {
                console.log(`✅ query_courses: Found ${retryCourses.length} courses without time filter. Will filter by time when adding to schedule.`)
                filteredCourses = retryCourses
              }
            }
            
            // If still no courses found, provide helpful message
            if (filteredCourses.length === 0) {
              console.log(`⚠️ query_courses: Found 0 courses for requirement "${functionArgs.requirementName}" with filters:`, {
                timeFilter: functionArgs.timeFilter,
                status: functionArgs.status,
                minGPA: functionArgs.minGPA
              })
              toolResult = {
                success: true,
                courses: [],
                count: 0,
                message: `Found 0 courses matching your criteria for "${functionArgs.requirementName}". IMMEDIATELY try the next requirement.`,
                _instruction: 'Since 0 courses found, IMMEDIATELY call query_courses for the next requirement. Do not explain - just call the tool.'
              }
            } else {
              console.log(`✅ query_courses: Found ${filteredCourses.length} courses for requirement "${functionArgs.requirementName}". Top course: ${filteredCourses[0].course_code} (GPA: ${filteredCourses[0].gpa?.toFixed(2) || 'N/A'})`)
              
              // Show top 10 courses so agent can analyze and pick the best one
              const topCourses = filteredCourses.slice(0, 10)
              
              // Filter out courses without class_number before presenting to agent
              const validTopCourses = topCourses.filter((c: any) => c.class_number != null && c.class_number !== '')
              
              if (validTopCourses.length === 0) {
                toolResult = {
                  success: false,
                  message: `Found courses but none have valid class_number values. This is a data issue.`
                }
                break
              }
              
              // Create a JSON-like structure that's easy for the agent to parse
              const courseListForAgent = validTopCourses.map((c: any) => ({
                courseCode: c.course_code,
                classNumber: String(c.class_number), // Ensure it's a string
                gpa: c.gpa?.toFixed(2) || 'N/A',
                meetingTime: c.meeting_time || 'TBA'
              }))
              
              // Create updated summaries with only valid courses
              const validCoursesSummary = validTopCourses.map((c: any, i: number) => 
                `${i + 1}. ${c.course_code} section ${c.class_number} (GPA: ${c.gpa?.toFixed(2) || 'N/A'}, Time: ${c.meeting_time || 'TBA'})`
              ).join('\n')
              
              const validCourseDetails = validTopCourses.map((c: any, i: number) => 
                `${i + 1}. ${c.course_code} - class_number: "${c.class_number}" (GPA: ${c.gpa?.toFixed(2) || 'N/A'}, Time: ${c.meeting_time || 'TBA'})`
              ).join('\n')
              
              // Get the top course for the example in instruction
              const topCourse = validTopCourses[0]
              
              // Create a strict mapping of courseCode -> classNumber pairs for validation
              // Store ALL valid pairs (multiple sections per course are possible)
              const courseClassNumberMap: Record<string, string[]> = {}
              validTopCourses.forEach((c: any) => {
                const code = c.course_code
                const classNum = String(c.class_number)
                if (!courseClassNumberMap[code]) {
                  courseClassNumberMap[code] = []
                }
                if (!courseClassNumberMap[code].includes(classNum)) {
                  courseClassNumberMap[code].push(classNum)
                }
              })
              
              // Create a clear list showing ONLY valid courseCode:classNumber pairs
              const validPairsList = validTopCourses.map((c: any, i: number) => 
                `${i + 1}. ${c.course_code} → class_number: "${c.class_number}"`
              ).join('\n')
              
              // Filter all courses to only include those with valid class_numbers
              const validAllCourses = filteredCourses.filter((c: any) => c.class_number != null && c.class_number !== '')
              
              // Create machine-readable JSON instruction with strict validation rules
              const validPairsJSON = JSON.stringify(courseClassNumberMap, null, 2)
              const instruction = `SYSTEM INSTRUCTION:

The following courseCode/classNumber pairs are VALID (machine-readable format):
${validPairsJSON}

RULES:
1️⃣ You MUST choose a courseCode and classNumber that appear together in the list above.
2️⃣ Each courseCode has specific classNumbers - you CANNOT mix them between courses.
3️⃣ If you choose ${topCourse.course_code}, you may only use classNumbers: ${courseClassNumberMap[topCourse.course_code]?.join(', ') || topCourse.class_number}.
4️⃣ When calling check_prerequisites or add_course_to_schedule, always include both fields exactly as listed in the JSON above.
5️⃣ Invalid pairs are forbidden and will be rejected by the system.

Your next step:
Call check_prerequisites({ "courseCode": "${topCourse.course_code}" }).
Then, if successful, call add_course_to_schedule({ "courseCode": "${topCourse.course_code}", "classNumber": "${topCourse.class_number}", "requirementName": "${functionArgs.requirementName}" }).

IMPORTANT: Use the EXACT courseCode and classNumber from the JSON map above. Do not use classNumbers from different courses.`
              
              // Store valid pairs for this user session (for backend validation)
              recentValidPairs.set(userId, {
                requirementName: functionArgs.requirementName || '',
                validPairs: courseClassNumberMap
              })
              
              toolResult = {
                success: true,
                courses: validAllCourses.slice(0, 50), // Only include courses with valid class_numbers
                count: validAllCourses.length,
                validCoursePairs: courseClassNumberMap, // Store for validation (all valid pairs)
                message: `Found ${validAllCourses.length} courses for "${functionArgs.requirementName}". Top options:\n${validCoursesSummary}\n\nCRITICAL VALIDATION RULES:\n1. Each course has a SPECIFIC class_number that MUST be used exactly as shown\n2. Valid courseCode → classNumber mappings:\n${validPairsList}\n3. You CANNOT mix class_numbers between courses - if you select BUS-L 293, you CANNOT use a class_number from BUS-L 201\n4. When calling add_course_to_schedule, you MUST use the EXACT class_number shown for that specific courseCode\n5. ONLY use courses from the JSON data below - do not use any other class_numbers\n\nCourse data (JSON format - use these EXACT values, match courseCode to classNumber):\n${JSON.stringify(courseListForAgent, null, 2)}\n\nValid courseCode/classNumber pairs (machine-readable):\n${validPairsJSON}\n\nAnalyze these courses. Select the BEST one based on: 1) GPA (higher is better), 2) Time preferences, 3) Prerequisites. IMMEDIATELY call check_prerequisites for your selected course, then add_course_to_schedule if prerequisites are met.`,
                _instruction: instruction
              }
            }
          } catch (error: any) {
            toolResult = { success: false, message: `Error: ${error.message}` }
          }
          break

        case 'get_degree_requirements':
          try {
            const supabase = getSupabase()
            const { data: userPrefs } = await supabase
              .from('user_preferences')
              .select('major, expected_graduation_year')
              .eq('user_id', userId)
              .single()

            if (!userPrefs?.major) {
              toolResult = { success: false, message: 'User major not found' }
              break
            }

            // Calculate current semester
            const currentYear = new Date().getFullYear()
            const currentMonth = new Date().getMonth() + 1
            const term = currentMonth >= 8 ? 'fall' : 'spring'
            const yearsUntilGrad = (userPrefs.expected_graduation_year || currentYear + 4) - currentYear
            const year = yearsUntilGrad >= 4 ? 1 : yearsUntilGrad >= 3 ? 2 : yearsUntilGrad >= 2 ? 3 : 4

            const reqYear = functionArgs.year || year
            const reqTerm = functionArgs.term || term

            const { data: degree } = await supabase
              .from('degrees')
              .select('id')
              .eq('major_name', userPrefs.major)
              .single()

            if (!degree) {
              toolResult = { success: false, message: 'Degree not found' }
              break
            }

            const { data: requirements } = await getSupabase()
              .from('degree_requirements')
              .select('*')
              .eq('degree_id', degree.id)
              .eq('year', reqYear)
              .eq('term', reqTerm)

            toolResult = {
              success: true,
              requirements: requirements || [],
              year: reqYear,
              term: reqTerm,
              message: `Found ${requirements?.length || 0} requirements for Year ${reqYear}, ${reqTerm}.`
            }
          } catch (error: any) {
            toolResult = { success: false, message: `Error: ${error.message}` }
          }
          break

        case 'check_prerequisites':
          try {
            const { data: course } = await getSupabase()
              .from('courses')
              .select('enrollment_requirements, course_code, course_name')
              .eq('course_code', functionArgs.courseCode)
              .limit(1)
              .single()

            if (!course) {
              toolResult = { success: false, message: `Course ${functionArgs.courseCode} not found` }
              break
            }

            const supabase = getSupabase()
            const { data: userPrefs } = await supabase
              .from('user_preferences')
              .select('courses_taken')
              .eq('user_id', userId)
              .single()

            const coursesTaken = (userPrefs?.courses_taken || []).map((c: string) => c.trim().toUpperCase())
            const prereqText = course.enrollment_requirements || ''

            // Simple prerequisite checking (could be enhanced with NLP)
            const missingPrereqs: string[] = []
            const satisfiedPrereqs: string[] = []

            // Extract course codes from prerequisite text (basic pattern matching)
            const courseCodePattern = /[A-Z]{2,4}\s*[A-Z]?\s*\d{3}/g
            const foundCodes = prereqText.match(courseCodePattern) || []

            foundCodes.forEach((code: string) => {
              const normalized = code.trim().toUpperCase().replace(/\s+/g, ' ')
              if (coursesTaken.includes(normalized)) {
                satisfiedPrereqs.push(normalized)
              } else {
                missingPrereqs.push(normalized)
              }
            })

            toolResult = {
              success: true,
              courseCode: functionArgs.courseCode,
              prerequisites: prereqText || 'No prerequisites listed',
              satisfied: satisfiedPrereqs,
              missing: missingPrereqs,
              canTake: missingPrereqs.length === 0,
              message: missingPrereqs.length === 0
                ? `All prerequisites satisfied for ${functionArgs.courseCode}`
                : `Missing prerequisites: ${missingPrereqs.join(', ')}`
            }
          } catch (error: any) {
            toolResult = { success: false, message: `Error: ${error.message}` }
          }
          break

        case 'get_course_gpa':
          try {
            const { data: grades } = await getSupabase()
              .from('grade_distributions')
              .select('avg_class_grade')
              .eq('course_code', functionArgs.courseCode)
              .not('avg_class_grade', 'is', null)
              .limit(100)

            if (!grades || grades.length === 0) {
              toolResult = {
                success: true,
                courseCode: functionArgs.courseCode,
                gpa: 0,
                message: `No GPA data available for ${functionArgs.courseCode}`
              }
              break
            }

            const gpa = grades.reduce((sum: number, g: any) => sum + parseFloat(g.avg_class_grade || 0), 0) / grades.length

            toolResult = {
              success: true,
              courseCode: functionArgs.courseCode,
              gpa: gpa.toFixed(2),
              sampleSize: grades.length,
              message: `GPA for ${functionArgs.courseCode}: ${gpa.toFixed(2)} (based on ${grades.length} classes)`
            }
          } catch (error: any) {
            toolResult = { success: false, message: `Error: ${error.message}` }
          }
          break

        case 'add_course_to_schedule':
          try {
            const { courseCode, classNumber, requirementName } = functionArgs
            
            // Convert classNumber to string and trim whitespace (database stores as text)
            const classNumberStr = String(classNumber).trim()
            const courseCodeStr = String(courseCode).trim()
            
            // Step 2: Backend validation - check if this pair is valid
            const storedValidPairs = recentValidPairs.get(userId)
            const validation = validateCoursePair(courseCodeStr, classNumberStr, storedValidPairs?.validPairs)
            
            if (!validation.valid) {
              console.warn(`❌ Invalid pairing detected: ${courseCodeStr} + ${classNumberStr}. Error: ${validation.error}`)
              
              // Step 3: Self-corrective feedback - provide helpful error message
              const validPairsForError = storedValidPairs?.validPairs || {}
              const validNumbers = validPairsForError[courseCodeStr] || []
              
              let errorMessage = `ERROR: Invalid courseCode/classNumber pairing detected.\n\n`
              errorMessage += `You attempted to use classNumber "${classNumberStr}" with courseCode "${courseCodeStr}", which is invalid.\n\n`
              
              if (validNumbers.length > 0) {
                errorMessage += `Valid classNumbers for "${courseCodeStr}" are: ${validNumbers.join(', ')}\n\n`
                errorMessage += `Please reselect using a valid pair from the recent query_courses results.`
              } else {
                errorMessage += `The courseCode "${courseCodeStr}" was not found in the recent query results.\n\n`
                errorMessage += `Please call query_courses again for this requirement to get valid course options.`
              }
              
              // Return error with instruction to retry
              toolResult = {
                success: false,
                message: validation.error || errorMessage,
                _instruction: `You used an invalid courseCode/classNumber pair. ${errorMessage}\n\nIMMEDIATELY call query_courses again for "${storedValidPairs?.requirementName || requirementName}" to get the correct valid pairs, then select a course and use its EXACT class_number from the JSON map.`
              }
              break
            }
            
            console.log(`✅ Validation passed: ${courseCodeStr} + ${classNumberStr} is a valid pair`)
            console.log(`🔍 Looking for course: ${courseCodeStr} section ${classNumberStr}`)
            
            // Get the course details - try exact match first
            const supabase = getSupabase()
            let { data: course, error: courseError } = await supabase
              .from('courses')
              .select('*')
              .eq('course_code', courseCodeStr)
              .eq('class_number', classNumberStr)
              .single()
            
            // If not found, try with trimmed values from database (in case of whitespace issues)
            if (courseError || !course) {
              console.log(`⚠️ Exact match failed, trying with trimmed database values...`)
              const { data: allSections } = await supabase
                .from('courses')
                .select('*')
                .eq('course_code', courseCodeStr)
              
              if (allSections) {
                // Find matching section by trimming both sides
                course = allSections.find((c: any) => 
                  c.class_number && String(c.class_number).trim() === classNumberStr
                )
                if (course) {
                  courseError = null
                  console.log(`✅ Found course using trimmed comparison`)
                }
              }
            }

            if (courseError || !course) {
              console.log(`❌ Course not found: ${courseCodeStr} section ${classNumberStr}. Error:`, courseError)
              // Try to find any section of this course to help debug
              const { data: anySection } = await getSupabase()
                .from('courses')
                .select('class_number, meeting_time, gpa')
                .eq('course_code', courseCodeStr)
                .limit(10)
              const availableSections = anySection?.map((c: any) => c.class_number).filter((cn: any) => cn != null) || []
              console.log(`📋 Available sections for ${courseCodeStr}:`, availableSections.join(', ') || 'none')
              
              // Provide helpful error message with available sections
              let errorMessage = `Course ${courseCodeStr} section ${classNumberStr} not found.`
              if (availableSections.length > 0) {
                errorMessage += ` Available sections for ${courseCodeStr}: ${availableSections.join(', ')}. Please use one of these exact class_number values.`
              } else {
                errorMessage += ` No sections found for ${courseCodeStr}. The course may not exist or may have been removed.`
              }
              
              // Create a clear error message with explicit instructions
              let instructionMessage = ''
              if (availableSections.length > 0) {
                instructionMessage = `ERROR: The class_number "${classNumberStr}" you used does NOT exist for ${courseCodeStr}. This is a CRITICAL error - you must use an EXACT class_number from the course data. Available sections for ${courseCodeStr}: ${availableSections.join(', ')}. You MUST call query_courses again for this requirement to get the current valid course data with correct class_numbers. Then, when you select a course, you MUST use the EXACT class_number that appears in the query_courses result for that specific courseCode. Do not guess or use a different value.`
              } else {
                instructionMessage = `ERROR: Course ${courseCodeStr} section ${classNumberStr} not found and no other sections available. The course may not exist. You MUST call query_courses again for this requirement to find available courses.`
              }
              
              toolResult = { 
                success: false, 
                message: errorMessage,
                _instruction: instructionMessage
              }
              break
            }
            
            console.log(`✅ Found course: ${courseCode} section ${classNumberStr}`)

            // Get current schedule builder
            const currentBuilder = scheduleBuilders.get(userId) || []
            
            // Check for time conflicts with existing courses in builder
            const parseMeetingTime = (meetingTime: string | null): any[] => {
              if (!meetingTime) return []
              const timePattern = /(\d{1,2}):(\d{2})\s*(AM|PM)\s*-?\s*(\d{1,2})?:?(\d{2})?\s*(AM|PM)?/i
              const match = meetingTime.match(timePattern)
              if (!match) return []
              
              let startHour = parseInt(match[1])
              const startMin = parseInt(match[2])
              const startPeriod = match[3].toUpperCase()
              if (startPeriod === 'PM' && startHour !== 12) startHour += 12
              if (startPeriod === 'AM' && startHour === 12) startHour = 0
              
              let endHour = startHour
              let endMin = startMin + 50
              if (match[4] && match[5] && match[6]) {
                endHour = parseInt(match[4])
                endMin = parseInt(match[5])
                const endPeriod = match[6].toUpperCase()
                if (endPeriod === 'PM' && endHour !== 12) endHour += 12
                if (endPeriod === 'AM' && endHour === 12) endHour = 0
              } else {
                if (endMin >= 60) {
                  endMin -= 60
                  endHour += 1
                }
              }
              
              const days = []
              if (meetingTime.includes('Monday') || meetingTime.includes('M') && !meetingTime.includes('Tu')) days.push('Monday')
              if (meetingTime.includes('Tuesday') || meetingTime.includes('Tu')) days.push('Tuesday')
              if (meetingTime.includes('Wednesday') || meetingTime.includes('W') && !meetingTime.includes('Th')) days.push('Wednesday')
              if (meetingTime.includes('Thursday') || meetingTime.includes('Th')) days.push('Thursday')
              if (meetingTime.includes('Friday') || meetingTime.includes('F')) days.push('Friday')
              
              return [{
                days,
                startTime: startHour * 60 + startMin,
                endTime: endHour * 60 + endMin
              }]
            }
            
            const newCourseTimeSlots = parseMeetingTime(course.meeting_time)
            
            // Check conflicts with existing courses
            let hasConflict = false
            for (const existingCourse of currentBuilder) {
              const existingTimeSlots = existingCourse.timeSlots || parseMeetingTime(existingCourse.meeting_time)
              for (const newSlot of newCourseTimeSlots) {
                for (const existingSlot of existingTimeSlots) {
                  const commonDays = newSlot.days.filter((d: string) => existingSlot.days.includes(d))
                  if (commonDays.length > 0) {
                    if (newSlot.startTime < existingSlot.endTime && existingSlot.startTime < newSlot.endTime) {
                      hasConflict = true
                      break
                    }
                  }
                }
                if (hasConflict) break
              }
              if (hasConflict) break
            }
            
            if (hasConflict) {
              toolResult = {
                success: false,
                message: `Course ${courseCode} section ${classNumber} conflicts with existing courses. Try a different section.`,
                conflict: true
              }
              break
            }
            
            // Get GPA for the course
            const { data: grades } = await supabase
              .from('grade_distributions')
              .select('avg_class_grade')
              .eq('course_code', courseCode)
              .not('avg_class_grade', 'is', null)
              .limit(100)
            
            const gpa = grades && grades.length > 0
              ? grades.reduce((sum: number, g: any) => sum + parseFloat(g.avg_class_grade || 0), 0) / grades.length
              : 0
            
            // Add to schedule builder
            const courseToAdd = {
              ...course,
              gpa,
              timeSlots: newCourseTimeSlots,
              requirementName
            }
            
            currentBuilder.push(courseToAdd)
            scheduleBuilders.set(userId, currentBuilder)
            
            const totalCredits = currentBuilder.reduce((sum: number, c: any) => sum + (parseInt(c.credits) || 0), 0)
            
            console.log(`✅ Added ${courseCode} section ${classNumber} to schedule. Total credits: ${totalCredits}`)
            
            toolResult = {
              success: true,
              message: `Added ${courseCode} section ${classNumber} to schedule. Total credits: ${totalCredits}. ${totalCredits >= 12 ? 'You have enough credits. IMMEDIATELY call finalize_schedule.' : 'Continue adding courses until you have 12+ credits.'}`,
              course: courseToAdd,
              totalCredits,
              courseCount: currentBuilder.length,
              _instruction: totalCredits >= 12 
                ? 'You have 12+ credits. IMMEDIATELY call finalize_schedule. Do not explain - just call the tool.'
                : 'Continue adding courses. IMMEDIATELY call query_courses for the next requirement.'
            }
          } catch (error: any) {
            toolResult = { success: false, message: `Error: ${error.message}` }
          }
          break

        case 'finalize_schedule':
          try {
            const currentBuilder = scheduleBuilders.get(userId) || []
            
            if (currentBuilder.length === 0) {
              toolResult = { success: false, message: 'No courses in schedule builder. Add courses first using add_course_to_schedule.' }
              break
            }
            
            // Get full course details for each course in builder
            const finalizedCourses = await Promise.all(
              currentBuilder.map(async (course: any) => {
                const { data: fullCourse } = await getSupabase()
                  .from('courses')
                  .select('*')
                  .eq('course_code', course.course_code)
                  .eq('class_number', course.class_number)
                  .single()
                
                if (!fullCourse) return course
                
                return {
                  ...fullCourse,
                  gpa: course.gpa,
                  timeSlots: course.timeSlots || [],
                  requirementName: course.requirementName
                }
              })
            )
            
            const totalCredits = finalizedCourses.reduce((sum: number, c: any) => sum + (parseInt(c.credits) || 0), 0)
            
            console.log(`✅ Finalizing schedule with ${finalizedCourses.length} courses, ${totalCredits} credits`)
            
            // Clear the builder
            scheduleBuilders.set(userId, [])
            
            toolResult = {
              success: true,
              message: `Schedule finalized with ${finalizedCourses.length} courses totaling ${totalCredits} credits. The schedule will be displayed automatically.`,
              schedule: finalizedCourses,
              totalCredits,
              courseCount: finalizedCourses.length
            }
          } catch (error: any) {
            toolResult = { success: false, message: `Error: ${error.message}` }
          }
          break

        case 'build_custom_schedule':
          // Clear existing builder and start fresh
          scheduleBuilders.set(userId, [])
          console.log('🔧 build_custom_schedule tool called with preferences:', functionArgs.preferences)
          
          // Automatically get requirements to help agent get started
          try {
            const supabase = getSupabase()
            const { data: userPrefs } = await supabase
              .from('user_preferences')
              .select('major, expected_graduation_year')
              .eq('user_id', userId)
              .single()

            if (userPrefs?.major) {
              const currentYear = new Date().getFullYear()
              const currentMonth = new Date().getMonth() + 1
              const term = currentMonth >= 8 ? 'fall' : 'spring'
              const yearsUntilGrad = (userPrefs.expected_graduation_year || currentYear + 4) - currentYear
              const year = yearsUntilGrad >= 4 ? 1 : yearsUntilGrad >= 3 ? 2 : yearsUntilGrad >= 2 ? 3 : 4

              const { data: degree } = await supabase
                .from('degrees')
                .select('id')
                .eq('major_name', userPrefs.major)
                .single()

              if (degree) {
                const { data: requirements } = await getSupabase()
                  .from('degree_requirements')
                  .select('*')
                  .eq('degree_id', degree.id)
                  .eq('year', year)
                  .eq('term', term)

                // Build a detailed message that includes the requirements so agent can act on them
                const reqList = (requirements || []).map((r: any) => `- ${r.requirement_name} (${r.credits} credits${r.critical ? ', CRITICAL' : ''})`).join('\n')
                
                // Build a message that explicitly tells the agent to continue
                const reqNames = (requirements || []).map((r: any) => r.requirement_name)
                toolResult = {
                  success: true,
                  message: `I found ${requirements?.length || 0} requirements: ${reqNames.join(', ')}. I MUST NOW immediately call query_courses for each requirement WITHOUT strict time filters to see all options, then analyze and select the best ones. I will NOT explain or wait - I will call query_courses RIGHT NOW for: ${reqNames[0] || 'first requirement'}.`,
                  action: 'build_start',
                  preferences: functionArgs.preferences,
                  requirements: requirements || [],
                  requirementNames: reqNames,
                  scheduleBuilder: [],
                  _instruction: `You MUST now call query_courses({ requirementName: "${reqNames[0] || 'first requirement'}" }) WITHOUT timeFilter and WITHOUT status filter to see ALL available courses. Then analyze them yourself, score them, and select the best one that meets preferences. Do not respond with text - call the tool.`
                }
              } else {
                toolResult = {
                  success: true,
                  message: 'Starting to build your schedule. Call get_degree_requirements next.',
                  action: 'build_start',
                  preferences: functionArgs.preferences,
                  scheduleBuilder: []
                }
              }
            } else {
              toolResult = {
                success: true,
                message: 'Starting to build your schedule. Call get_degree_requirements next.',
                action: 'build_start',
                preferences: functionArgs.preferences,
                scheduleBuilder: []
              }
            }
          } catch (error) {
            toolResult = {
              success: true,
              message: 'Starting to build your schedule. Call get_degree_requirements next.',
              action: 'build_start',
              preferences: functionArgs.preferences,
              scheduleBuilder: []
            }
          }
          break

        default:
          toolResult = {
            success: false,
            message: `Unknown function: ${functionName}`
          }
      }

      // Add tool result to messages and get final response
      const messagesWithTool: any[] = [
        ...claudeMessages,
        {
          role: 'assistant',
          content: [message]
        },
        {
          role: 'user',
          content: [
            {
              type: 'tool_result',
              tool_use_id: toolCall.id,
              content: JSON.stringify(toolResult),
            }
          ]
        },
      ]

      // If this was build_custom_schedule, force the agent to continue by making it call query_courses
      // We'll add an explicit instruction and then check for tool calls
      if (functionName === 'build_custom_schedule' && toolResult.requirements && toolResult.requirements.length > 0) {
        // Add explicit instruction to continue - query WITHOUT time filter to see all options
        const continueInstruction = {
          role: 'user' as const,
          content: `You MUST now call query_courses immediately for the first requirement: "${toolResult.requirementNames?.[0]}". Query WITHOUT timeFilter and WITHOUT status filter to see ALL available courses (including closed ones), then analyze and select the best one. Do not explain - just call query_courses tool NOW.`
        }
        messagesWithTool.push(continueInstruction)
      }
      
      // If this was add_course_to_schedule, check if we should finalize
      if (functionName === 'add_course_to_schedule' && toolResult.totalCredits >= 12) {
        const continueInstruction = {
          role: 'user' as const,
          content: toolResult._instruction || 'You have 12+ credits. IMMEDIATELY call finalize_schedule. Do not explain - just call the tool.'
        }
        messagesWithTool.push(continueInstruction)
      } else if (functionName === 'add_course_to_schedule' && toolResult.totalCredits < 12) {
        const continueInstruction = {
          role: 'user' as const,
          content: toolResult._instruction || 'Continue adding courses. IMMEDIATELY call query_courses for the next requirement. Do not explain - just call the tool.'
        }
        messagesWithTool.push(continueInstruction)
      }
      
      // If this was check_prerequisites and prerequisites are met, tell agent to add course
      if (functionName === 'check_prerequisites' && toolResult.canTake) {
        const continueInstruction = {
          role: 'user' as const,
          content: `Prerequisites satisfied. IMMEDIATELY call add_course_to_schedule with the course you checked. Do not explain - just call the tool.`
        }
        messagesWithTool.push(continueInstruction)
      }
      
      // If this was query_courses, add explicit instruction based on results
      if (functionName === 'query_courses') {
        if (toolResult.count === 0) {
          // 0 results - tell agent to try next requirement
          const continueInstruction = {
            role: 'user' as const,
            content: toolResult._instruction || `No courses found. IMMEDIATELY call query_courses for the next requirement. Do not explain - just call the tool.`
          }
          messagesWithTool.push(continueInstruction)
        } else if (toolResult.count > 0) {
          // Found courses - tell agent to check prerequisites and add
          const continueInstruction = {
            role: 'user' as const,
            content: toolResult._instruction || `Courses found! IMMEDIATELY call check_prerequisites for the top course, then add_course_to_schedule if prerequisites are met. Do not explain - just call the tools.`
          }
          messagesWithTool.push(continueInstruction)
        }
      }
      
      const finalCompletion = await anthropic.messages.create({
        model: 'claude-4-sonnet-20250514',
        max_tokens: 4096,
        temperature: 0.2, // Even lower for more deterministic tool use
        system: systemPrompt,
        messages: messagesWithTool,
      })

      // Check if the response contains more tool calls (agent wants to continue)
      const additionalToolCalls = finalCompletion.content.filter((block: any) => block.type === 'tool_use')
      
      // Extract text from Claude's response (may have multiple content blocks)
      const textBlocks = finalCompletion.content.filter((block: any) => block.type === 'text')
      let finalResponse = textBlocks.length > 0 
        ? textBlocks.map((block: any) => block.text).join('\n')
        : additionalToolCalls.length > 0 
          ? 'Continuing to build your schedule...'
          : ''
      
      // Process tool calls recursively - continue until agent is done or max depth
      // This allows the agent to chain multiple tool calls in one request
      // Also continue if toolResult has _instruction telling us to continue
      let currentMessages = [...messagesWithTool]
      let lastToolResult = toolResult
      let lastToolName = functionName
      let depth = 0
      const maxDepth = 15 // Allow up to 15 tool calls in one request
      let shouldContinue = true
      
      // Add the assistant's first response to messages
      currentMessages.push({
        role: 'assistant',
        content: finalCompletion.content
      })
      
      // Log all messages before filtering for debugging
      console.log(`📋 Current messages before continuation check (${currentMessages.length} total):`)
      currentMessages.forEach((msg: any, i: number) => {
        const contentStr = typeof msg.content === 'string' 
          ? msg.content.substring(0, 100) 
          : Array.isArray(msg.content) 
            ? `[Array with ${msg.content.length} items]` 
            : String(msg.content)
        console.log(`  [${i}] role=${msg.role}, content=${contentStr}`)
      })
      
      // Filter out empty assistant messages BEFORE adding instruction
      // This prevents empty messages from being in the array when we add the instruction
      currentMessages = currentMessages.filter((msg: any, index: number) => {
        if (msg.role === 'assistant') {
          if (Array.isArray(msg.content) && msg.content.length === 0) {
            // Always filter out empty assistant message arrays (they're never valid)
            console.log(`⚠️ Pre-filter: Removing empty assistant message at index ${index}`)
            return false
          }
          if (Array.isArray(msg.content)) {
            // Check if all content blocks are empty
            const hasValidContent = msg.content.some((c: any) => {
              if (c.type === 'text') return c.text && c.text.trim().length > 0
              if (c.type === 'tool_use') return true // tool_use is always valid
              return true
            })
            if (!hasValidContent) {
              console.log(`⚠️ Pre-filter: Removing assistant message with no valid content at index ${index}`)
              return false
            }
          }
        }
        return true
      })
      
      // If tool result has _instruction, add it to messages to force continuation
      // But skip if we already added a continueInstruction (e.g., from build_custom_schedule)
      const alreadyHasContinueInstruction = messagesWithTool.some((msg: any) => 
        msg.role === 'user' && 
        typeof msg.content === 'string' && 
        msg.content.includes('call query_courses')
      )
      
      if (toolResult._instruction && additionalToolCalls.length === 0 && toolResult._instruction.trim().length > 0 && !alreadyHasContinueInstruction) {
        console.log('🔄 Tool result has _instruction, forcing continuation:', toolResult._instruction)
        
        // Ensure the instruction is properly formatted as a string (not empty)
        const instructionContent = toolResult._instruction.trim()
        if (instructionContent.length > 0) {
          currentMessages.push({
            role: 'user',
            content: instructionContent
          })
          
          // Filter out any messages with empty content before sending to Claude
          const validMessages = currentMessages.filter((msg: any, index: number) => {
            if (msg.role === 'user') {
              // User messages must have non-empty content
              if (typeof msg.content === 'string') {
                const isValid = msg.content.trim().length > 0
                if (!isValid) {
                  console.log(`⚠️ Filtering out empty user message at index ${index}:`, msg)
                }
                return isValid
              }
              if (Array.isArray(msg.content)) {
                const hasValidContent = msg.content.length > 0 && msg.content.some((c: any) => {
                  if (c.type === 'text') return c.text && c.text.trim().length > 0
                  if (c.type === 'tool_result') return c.content && c.content.trim().length > 0
                  return true
                })
                if (!hasValidContent) {
                  console.log(`⚠️ Filtering out user message with empty array content at index ${index}:`, msg)
                }
                return hasValidContent
              }
              console.log(`⚠️ Filtering out user message with invalid content type at index ${index}:`, msg)
              return false
            }
            // Assistant messages: can only be empty if they're the final message
            if (typeof msg.content === 'string') {
              return msg.content.trim().length > 0
            }
            if (Array.isArray(msg.content)) {
              // Empty array is only allowed if this is the last message
              if (msg.content.length === 0) {
                const isLastMessage = index === currentMessages.length - 1
                if (!isLastMessage) {
                  console.log(`⚠️ Filtering out empty assistant message at index ${index} (not final):`, msg)
                  return false
                }
                return true // Allow empty final assistant message
              }
              // Check if all content blocks are empty
              const hasValidContent = msg.content.some((c: any) => {
                if (c.type === 'text') return c.text && c.text.trim().length > 0
                if (c.type === 'tool_use') return true // tool_use is always valid
                return true
              })
              if (!hasValidContent) {
                const isLastMessage = index === currentMessages.length - 1
                if (!isLastMessage) {
                  console.log(`⚠️ Filtering out assistant message with no valid content at index ${index} (not final):`, msg)
                  return false
                }
                return true // Allow empty final assistant message
              }
              return true
            }
            // Invalid content type
            const isLastMessage = index === currentMessages.length - 1
            if (!isLastMessage) {
              console.log(`⚠️ Filtering out assistant message with invalid content type at index ${index} (not final):`, msg)
              return false
            }
            return true // Allow empty final assistant message
          })
          
          // Log messages being sent for debugging
          console.log(`📤 Sending ${validMessages.length} messages to Claude (filtered from ${currentMessages.length})`)
          validMessages.forEach((msg: any, i: number) => {
            console.log(`  Message ${i}: role=${msg.role}, contentType=${typeof msg.content}, contentLength=${typeof msg.content === 'string' ? msg.content.length : Array.isArray(msg.content) ? msg.content.length : 'unknown'}`)
          })
          
          // Get next response from Claude
          const nextCompletion = await anthropic.messages.create({
            model: 'claude-4-sonnet-20250514',
            max_tokens: 4096,
            temperature: 0.2,
            system: systemPrompt,
            messages: validMessages,
            tools: tools as any,
          })
          
          // Add Claude's response
          currentMessages.push({
            role: 'assistant',
            content: nextCompletion.content
          })
          
          // Check if Claude made a tool call
          const nextToolCalls = nextCompletion.content.filter((block: any) => block.type === 'tool_use')
          if (nextToolCalls.length === 0) {
            // No tool call, we're done
            const nextText = nextCompletion.content.filter((block: any) => block.type === 'text')
            if (nextText.length > 0) {
              finalResponse = nextText.map((block: any) => block.text).join('\n')
            }
            shouldContinue = false
          }
        }
      }
      
      // Process tool calls recursively
      while (shouldContinue && depth < maxDepth) {
        // Get all tool calls from the last response
        // Check if last message is assistant with array content
        const lastMessage = currentMessages[currentMessages.length - 1]
        const toolCalls = (lastMessage?.role === 'assistant' && Array.isArray(lastMessage.content))
          ? lastMessage.content.filter((block: any) => block.type === 'tool_use')
          : []
        
        if (toolCalls.length === 0) {
          // No more tool calls, we're done
          // Check if last message is assistant with array content
          const lastMsg = currentMessages[currentMessages.length - 1]
          const lastText = (lastMsg?.role === 'assistant' && Array.isArray(lastMsg.content))
            ? lastMsg.content.filter((block: any) => block.type === 'text')
            : []
          if (lastText.length > 0) {
            finalResponse = lastText.map((block: any) => block.text).join('\n')
          }
          break
        }
        
        // Process the first tool call
        const nextToolCall = toolCalls[0]
        const nextFunctionName = nextToolCall.name
        const nextFunctionArgs: any = nextToolCall.input || {}
        
        console.log(`📋 Processing tool ${depth + 1}: ${nextFunctionName}`, nextFunctionArgs)
        
        // Execute the tool - reuse the switch logic from above
        let nextToolResult: any = {}
        
        try {
          // We need to extract the tool execution logic into a reusable function
          // For now, let's handle the most common cases inline
          switch (nextFunctionName) {
            case 'query_courses':
              // Simplified query_courses - reuse full logic would be better
              const supabase = getSupabase()
            const { data: userPrefs } = await supabase
                .from('user_preferences')
                .select('major, expected_graduation_year, courses_taken')
                .eq('user_id', userId)
                .single()
              
              let query = supabase.from('courses').select('*')
              
              if (nextFunctionArgs.requirementName) {
                const { data: degree } = await supabase
                  .from('degrees')
                  .select('id')
                  .eq('major_name', userPrefs?.major)
                  .single()
                
                if (degree) {
                  const { data: req } = await supabase
                    .from('degree_requirements')
                    .select('id')
                    .eq('degree_id', degree.id)
                    .eq('requirement_name', nextFunctionArgs.requirementName)
                    .single()
                  
                  if (req) {
                    const { data: fulfillments } = await supabase
                      .from('requirement_fulfillments')
                      .select('course_code')
                      .eq('requirement_id', req.id)
                    
                    if (fulfillments) {
                      const codes = fulfillments.map(f => f.course_code)
                      query = query.in('course_code', codes)
                    }
                  }
                }
              }
              
              if (nextFunctionArgs.status) {
                query = query.eq('status', nextFunctionArgs.status)
              }
              
              const { data: courses } = await query
              
              // Get GPAs
              const coursesWithGPA = await Promise.all(
                (courses || []).map(async (course: any) => {
                  const { data: grades } = await supabase
                    .from('grade_distributions')
                    .select('avg_class_grade')
                    .eq('course_code', course.course_code)
                    .not('avg_class_grade', 'is', null)
                    .limit(100)
                  
                  const gpa = grades && grades.length > 0
                    ? grades.reduce((sum: number, g: any) => sum + parseFloat(g.avg_class_grade || 0), 0) / grades.length
                    : 0
                  
                  return { ...course, gpa }
                })
              )
              
              coursesWithGPA.sort((a: any, b: any) => (b.gpa || 0) - (a.gpa || 0))
              
              const topCourses = coursesWithGPA.slice(0, 10)
              const coursesSummary = topCourses.map((c: any, i: number) => 
                `${i + 1}. ${c.course_code} section ${c.class_number} (GPA: ${c.gpa?.toFixed(2) || 'N/A'}, Time: ${c.meeting_time || 'TBA'})`
              ).join('\n')
              
              nextToolResult = {
                success: true,
                courses: coursesWithGPA.slice(0, 50),
                count: coursesWithGPA.length,
                message: `Found ${coursesWithGPA.length} courses. Top options:\n${coursesSummary}\n\nAnalyze and select the BEST one. IMMEDIATELY call check_prerequisites for your selected course.`,
                _instruction: `Analyze the courses above. Select the BEST one based on GPA and time preferences. IMMEDIATELY call check_prerequisites({ courseCode: "YOUR_SELECTED_COURSE_CODE" }).`
              }
              break
              
            case 'check_prerequisites':
              const { data: course } = await getSupabase()
                .from('courses')
                .select('enrollment_requirements, course_code')
                .eq('course_code', nextFunctionArgs.courseCode)
                .limit(1)
                .single()
              
              const { data: userPrefs2 } = await getSupabase()
                .from('user_preferences')
                .select('courses_taken')
                .eq('user_id', userId)
                .single()
              
              const coursesTaken = (userPrefs2?.courses_taken || []).map((c: string) => c.trim().toUpperCase())
              const prereqText = course?.enrollment_requirements || ''
              const courseCodePattern = /[A-Z]{2,4}\s*[A-Z]?\s*\d{3}/g
              const foundCodes = prereqText.match(courseCodePattern) || []
              const missingPrereqs = foundCodes.filter((code: string) => {
                const normalized = code.trim().toUpperCase().replace(/\s+/g, ' ')
                return !coursesTaken.includes(normalized)
              })
              
              nextToolResult = {
                success: true,
                courseCode: nextFunctionArgs.courseCode,
                canTake: missingPrereqs.length === 0,
                message: missingPrereqs.length === 0
                  ? `All prerequisites satisfied for ${nextFunctionArgs.courseCode}. IMMEDIATELY call add_course_to_schedule.`
                  : `Missing prerequisites: ${missingPrereqs.join(', ')}. Try the next best course.`,
                _instruction: missingPrereqs.length === 0
                  ? `Prerequisites satisfied. IMMEDIATELY call add_course_to_schedule({ courseCode: "${nextFunctionArgs.courseCode}", classNumber: YOUR_CLASS_NUMBER, requirementName: "REQUIREMENT_NAME" }).`
                  : 'Prerequisites not met. IMMEDIATELY call check_prerequisites for the next best course.'
              }
              break
              
            case 'add_course_to_schedule':
              // Reuse the full add_course_to_schedule logic from the switch statement above
              // For now, simplified version - should extract into function
              const { data: courseToAdd } = await getSupabase()
                .from('courses')
                .select('*')
                .eq('course_code', nextFunctionArgs.courseCode)
                .eq('class_number', nextFunctionArgs.classNumber)
                .single()
              
              if (!courseToAdd) {
                nextToolResult = { success: false, message: `Course not found` }
                break
              }
              
              const currentBuilder = scheduleBuilders.get(userId) || []
              
              // Parse meeting time helper
              const parseTime = (mt: string | null) => {
                if (!mt) return []
                const match = mt.match(/(\d{1,2}):(\d{2})\s*(AM|PM)\s*-?\s*(\d{1,2})?:?(\d{2})?\s*(AM|PM)?/i)
                if (!match) return []
                let sh = parseInt(match[1])
                const sm = parseInt(match[2])
                const sp = match[3].toUpperCase()
                if (sp === 'PM' && sh !== 12) sh += 12
                if (sp === 'AM' && sh === 12) sh = 0
                let eh = sh
                let em = sm + 50
                if (match[4] && match[5] && match[6]) {
                  eh = parseInt(match[4])
                  em = parseInt(match[5])
                  const ep = match[6].toUpperCase()
                  if (ep === 'PM' && eh !== 12) eh += 12
                  if (ep === 'AM' && eh === 12) eh = 0
                } else {
                  if (em >= 60) { em -= 60; eh += 1 }
                }
                const days = []
                if (mt.includes('Monday') || (mt.includes('M') && !mt.includes('Tu'))) days.push('Monday')
                if (mt.includes('Tuesday') || mt.includes('Tu')) days.push('Tuesday')
                if (mt.includes('Wednesday') || (mt.includes('W') && !mt.includes('Th'))) days.push('Wednesday')
                if (mt.includes('Thursday') || mt.includes('Th')) days.push('Thursday')
                if (mt.includes('Friday') || mt.includes('F')) days.push('Friday')
                return [{ days, startTime: sh * 60 + sm, endTime: eh * 60 + em }]
              }
              
              const newSlots = parseTime(courseToAdd.meeting_time)
              let conflict = false
              for (const existing of currentBuilder) {
                const existingSlots = existing.timeSlots || parseTime(existing.meeting_time)
                for (const ns of newSlots) {
                  for (const es of existingSlots) {
                    const common = ns.days.filter((d: string) => es.days.includes(d))
                    if (common.length > 0 && ns.startTime < es.endTime && es.startTime < ns.endTime) {
                      conflict = true
                      break
                    }
                  }
                  if (conflict) break
                }
                if (conflict) break
              }
              
              if (conflict) {
                nextToolResult = { success: false, message: `Time conflict. Try next course.`, conflict: true }
                break
              }
              
              const { data: grades } = await getSupabase()
                .from('grade_distributions')
                .select('avg_class_grade')
                .eq('course_code', nextFunctionArgs.courseCode)
                .not('avg_class_grade', 'is', null)
                .limit(100)
              
              const gpa = grades && grades.length > 0
                ? grades.reduce((sum: number, g: any) => sum + parseFloat(g.avg_class_grade || 0), 0) / grades.length
                : 0
              
              currentBuilder.push({
                ...courseToAdd,
                gpa,
                timeSlots: newSlots,
                requirementName: nextFunctionArgs.requirementName
              })
              scheduleBuilders.set(userId, currentBuilder)
              
              const totalCredits = currentBuilder.reduce((sum: number, c: any) => sum + (parseInt(c.credits) || 0), 0)
              
              nextToolResult = {
                success: true,
                message: `Added ${nextFunctionArgs.courseCode} section ${nextFunctionArgs.classNumber}. Total credits: ${totalCredits}. ${totalCredits >= 12 ? 'IMMEDIATELY call finalize_schedule.' : 'Continue adding courses.'}`,
                totalCredits,
                courseCount: currentBuilder.length,
                _instruction: totalCredits >= 12
                  ? 'You have 12+ credits. IMMEDIATELY call finalize_schedule.'
                  : 'Continue. IMMEDIATELY call query_courses for the next requirement.'
              }
              break
              
            case 'finalize_schedule':
              const builder = scheduleBuilders.get(userId) || []
              const finalized = await Promise.all(
                builder.map(async (c: any) => {
                  const { data: fc } = await getSupabase()
                    .from('courses')
                    .select('*')
                    .eq('course_code', c.course_code)
                    .eq('class_number', c.class_number)
                    .single()
                  return fc ? { ...fc, gpa: c.gpa, timeSlots: c.timeSlots, requirementName: c.requirementName } : c
                })
              )
              scheduleBuilders.set(userId, [])
              nextToolResult = {
                success: true,
                message: `Schedule finalized with ${finalized.length} courses.`,
                schedule: finalized,
                totalCredits: finalized.reduce((sum: number, c: any) => sum + (parseInt(c.credits) || 0), 0)
              }
              shouldContinue = false // Stop after finalize
              break
              
            default:
              // For other tools, we need to execute them using the main switch statement
              // This is a fallback - ideally all tools should be handled here
              nextToolResult = { success: false, message: `Tool ${nextFunctionName} needs to be processed in recursive handler` }
          }
        } catch (error: any) {
          nextToolResult = { success: false, message: `Error: ${error.message}` }
        }
        
        // Add tool result to messages
        currentMessages.push({
          role: 'user',
          content: [{
            type: 'tool_result',
            tool_use_id: nextToolCall.id,
            content: JSON.stringify(nextToolResult)
          }]
        })
        
        // If this was finalize_schedule, we're done
        if (nextFunctionName === 'finalize_schedule' && nextToolResult.success) {
          lastToolResult = nextToolResult
          lastToolName = nextFunctionName
          finalResponse = nextToolResult.message
          break
        }
        
        // Get next response from Claude
        if (nextToolResult._instruction && depth < maxDepth - 1) {
          // Pre-filter empty assistant messages before adding instruction
          currentMessages = currentMessages.filter((msg: any, index: number) => {
            if (msg.role === 'assistant') {
              if (Array.isArray(msg.content) && msg.content.length === 0) {
                console.log(`⚠️ [Recursive] Pre-filter: Removing empty assistant message at index ${index}`)
                return false
              }
              if (Array.isArray(msg.content)) {
                const hasValidContent = msg.content.some((c: any) => {
                  if (c.type === 'text') return c.text && c.text.trim().length > 0
                  if (c.type === 'tool_use') return true
                  return true
                })
                if (!hasValidContent) {
                  console.log(`⚠️ [Recursive] Pre-filter: Removing assistant message with no valid content at index ${index}`)
                  return false
                }
              }
            }
            return true
          })
          
          const instructionContent = nextToolResult._instruction.trim()
          if (instructionContent.length > 0) {
            currentMessages.push({
              role: 'user',
              content: instructionContent
            })
          }
          
          // Filter out any messages with empty content before sending to Claude
          const validMessages = currentMessages.filter((msg: any, index: number) => {
            if (msg.role === 'user') {
              // User messages must have non-empty content
              if (typeof msg.content === 'string') {
                const isValid = msg.content.trim().length > 0
                if (!isValid) {
                  console.log(`⚠️ [Recursive] Filtering out empty user message at index ${index}:`, msg)
                }
                return isValid
              }
              if (Array.isArray(msg.content)) {
                const hasValidContent = msg.content.length > 0 && msg.content.some((c: any) => {
                  if (c.type === 'text') return c.text && c.text.trim().length > 0
                  if (c.type === 'tool_result') return c.content && c.content.trim().length > 0
                  return true
                })
                if (!hasValidContent) {
                  console.log(`⚠️ [Recursive] Filtering out user message with empty array content at index ${index}:`, msg)
                }
                return hasValidContent
              }
              console.log(`⚠️ [Recursive] Filtering out user message with invalid content type at index ${index}:`, msg)
              return false
            }
            // Assistant messages: can only be empty if they're the final message
            if (typeof msg.content === 'string') {
              return msg.content.trim().length > 0
            }
            if (Array.isArray(msg.content)) {
              // Empty array is only allowed if this is the last message
              if (msg.content.length === 0) {
                const isLastMessage = index === currentMessages.length - 1
                if (!isLastMessage) {
                  console.log(`⚠️ [Recursive] Filtering out empty assistant message at index ${index} (not final):`, msg)
                  return false
                }
                return true // Allow empty final assistant message
              }
              // Check if all content blocks are empty
              const hasValidContent = msg.content.some((c: any) => {
                if (c.type === 'text') return c.text && c.text.trim().length > 0
                if (c.type === 'tool_use') return true // tool_use is always valid
                return true
              })
              if (!hasValidContent) {
                const isLastMessage = index === currentMessages.length - 1
                if (!isLastMessage) {
                  console.log(`⚠️ [Recursive] Filtering out assistant message with no valid content at index ${index} (not final):`, msg)
                  return false
                }
                return true // Allow empty final assistant message
              }
              return true
            }
            // Invalid content type
            const isLastMessage = index === currentMessages.length - 1
            if (!isLastMessage) {
              console.log(`⚠️ [Recursive] Filtering out assistant message with invalid content type at index ${index} (not final):`, msg)
              return false
            }
            return true // Allow empty final assistant message
          })
          
          console.log(`📤 [Recursive] Sending ${validMessages.length} messages to Claude (filtered from ${currentMessages.length})`)
          
          const nextCompletion = await anthropic.messages.create({
            model: 'claude-4-sonnet-20250514',
            max_tokens: 4096,
            temperature: 0.2,
            system: systemPrompt,
            messages: validMessages,
            tools: tools as any,
          })
          
          // Add Claude's response to messages
          currentMessages.push({
            role: 'assistant',
            content: nextCompletion.content
          })
          
          // Check if there are more tool calls
          const nextToolCalls = nextCompletion.content.filter((block: any) => block.type === 'tool_use')
          if (nextToolCalls.length === 0) {
            // No more tool calls, we're done
            const nextText = nextCompletion.content.filter((block: any) => block.type === 'text')
            if (nextText.length > 0) {
              finalResponse = nextText.map((block: any) => block.text).join('\n')
            }
            break
          }
          
          // Continue with next iteration to process the new tool calls
          depth++
          lastToolResult = nextToolResult
          lastToolName = nextFunctionName
          continue
        }
        
        // No instruction to continue, we're done
        depth++
        lastToolResult = nextToolResult
        lastToolName = nextFunctionName
        break
      }
      
      // Update final response and tool result
      if (lastToolResult && Object.keys(lastToolResult).length > 0) {
        toolResult = lastToolResult
        functionName = lastToolName
      }
      
      if (!finalResponse || finalResponse === 'Continuing to build your schedule...') {
        finalResponse = toolResult?.message || 'Continuing to build your schedule...'
      }
      
      // Handle case where build_custom_schedule was called but agent didn't continue
      if (functionName === 'build_custom_schedule' && depth === 0 && additionalToolCalls.length === 0) {
        if (!finalResponse || finalResponse.includes('Sorry')) {
          finalResponse = `I've started building your schedule. I found ${toolResult.requirements?.length || 0} requirements. I'll now query courses for each requirement and build your optimal schedule.`
        }
      }

      console.log('📤 Returning response with tool:', {
        functionName,
        hasToolResult: !!toolResult,
        toolResultAction: toolResult?.action,
        preferences: toolResult?.preferences,
        hasAdditionalToolCalls: additionalToolCalls.length > 0
      })
      
      return NextResponse.json({
        message: finalResponse,
        toolResult,
        toolUsed: functionName,
        _debug: {
          toolCalled: functionName,
          toolResultAction: toolResult?.action,
          hasPreferences: !!toolResult?.preferences,
          additionalToolCalls: additionalToolCalls.length
        }
      })
    }

    // No tool call - direct response
    // Extract text from all text blocks in the response
    const textBlocks = completion.content.filter((block: any) => block.type === 'text')
    const response = textBlocks.length > 0 
      ? textBlocks.map((block: any) => block.text).join('\n')
      : 'Sorry, I could not generate a response.'

    return NextResponse.json({
      message: response,
    })
  } catch (error: any) {
    console.error('Schedule agent error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to process request' },
      { status: 500 }
    )
  }
}

