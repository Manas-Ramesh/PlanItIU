import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { createClient } from '@supabase/supabase-js'

// Lazy initialization to avoid build-time errors
const getOpenAI = () => {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('Missing OPENAI_API_KEY environment variable')
  }
  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  })
}

// Lazy initialization to avoid build-time errors
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

// Calculate current semester based on graduation year
function calculateCurrentSemester(graduationYear: number): { year: number; term: string; semester: number } {
  const currentYear = new Date().getFullYear()
  const currentMonth = new Date().getMonth() + 1 // 1-12
  
  // Fall: August-December (months 8-12), Spring: January-July (months 1-7)
  const term = currentMonth >= 8 ? 'fall' : 'spring'
  
  const yearsUntilGraduation = graduationYear - currentYear
  
  // Calculate academic year (1-4)
  let year = 1
  if (yearsUntilGraduation === 4) {
    year = 1 // Freshman
  } else if (yearsUntilGraduation === 3) {
    year = 2 // Sophomore
  } else if (yearsUntilGraduation === 2) {
    year = 3 // Junior
  } else if (yearsUntilGraduation === 1) {
    year = 4 // Senior
  } else if (yearsUntilGraduation > 4) {
    year = 1
  } else {
    year = 4
  }
  
  // Calculate semester number (1-8)
  const semester = (year - 1) * 2 + (term === 'fall' ? 1 : 2)
  
  return { year, term, semester }
}

export async function POST(request: NextRequest) {
  try {
    const { messages, userId } = await request.json()

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      )
    }

    // Fetch user context
    let userContext = ''
    if (userId) {
      try {
        const supabase = getSupabase()
        // Get user preferences
        const { data: preferences } = await supabase
          .from('user_preferences')
          .select('major, expected_graduation_year, courses_taken')
          .eq('user_id', userId)
          .single()

        if (preferences) {
          const { year, term, semester } = preferences.expected_graduation_year
            ? calculateCurrentSemester(preferences.expected_graduation_year)
            : { year: 1, term: 'fall', semester: 1 }

          userContext = `\n\n## Current User Information:\n`
          userContext += `- Major: ${preferences.major || 'Not set'}\n`
          userContext += `- Expected Graduation Year: ${preferences.expected_graduation_year || 'Not set'}\n`
          userContext += `- Current Academic Year: Year ${year} (${year === 1 ? 'Freshman' : year === 2 ? 'Sophomore' : year === 3 ? 'Junior' : 'Senior'})\n`
          userContext += `- Current Semester: Semester ${semester} (${term.charAt(0).toUpperCase() + term.slice(1)})\n`
          userContext += `- Courses Already Taken: ${(preferences.courses_taken || []).length} courses\n`
          
          if (preferences.courses_taken && preferences.courses_taken.length > 0) {
            userContext += `  - ${preferences.courses_taken.slice(0, 10).join(', ')}`
            if (preferences.courses_taken.length > 10) {
              userContext += ` (and ${preferences.courses_taken.length - 10} more)`
            }
            userContext += '\n'
          }

          // Get degree requirements for current semester
          if (preferences.major) {
            const { data: degree } = await getSupabase()
              .from('degrees')
              .select('id, major_name')
              .eq('major_name', preferences.major)
              .single()

            if (degree) {
              const { data: requirements } = await getSupabase()
                .from('degree_requirements')
                .select('requirement_name, credits, critical, year, term')
                .eq('degree_id', degree.id)
                .eq('year', year)
                .eq('term', term)

              if (requirements && requirements.length > 0) {
                userContext += `\n## Current Semester Requirements (Year ${year}, ${term.charAt(0).toUpperCase() + term.slice(1)}):\n`
                requirements.forEach((req: any) => {
                  userContext += `- ${req.requirement_name} (${req.credits} credits${req.critical ? ', CRITICAL' : ''})\n`
                })
              }

              // Get all requirements for the degree
              const { data: allRequirements } = await getSupabase()
                .from('degree_requirements')
                .select('requirement_name, credits, critical, year, term')
                .eq('degree_id', degree.id)
                .order('year', { ascending: true })
                .order('term', { ascending: true })

              if (allRequirements && allRequirements.length > 0) {
                userContext += `\n## All Degree Requirements:\n`
                const byYear = allRequirements.reduce((acc: any, req: any) => {
                  const key = `Year ${req.year} ${req.term}`
                  if (!acc[key]) acc[key] = []
                  acc[key].push(req)
                  return acc
                }, {})
                
                Object.keys(byYear).forEach(yearTerm => {
                  userContext += `\n${yearTerm}:\n`
                  byYear[yearTerm].forEach((req: any) => {
                    userContext += `  - ${req.requirement_name} (${req.credits} credits${req.critical ? ', CRITICAL' : ''})\n`
                  })
                })
              }
            }
          }
        }
      } catch (error) {
        console.error('Error fetching user context:', error)
        // Continue without user context if there's an error
      }
    }

    const systemPrompt = `You are a helpful assistant for PlanItIU, a course planning application for university students. You help students with:

- Course scheduling and time conflicts
- Degree requirements and progress tracking  
- GPA information and course recommendations
- General questions about using the PlanItIU app

Be friendly, concise, and helpful. If asked about features, mention:
- The Schedules tab for generating course schedules
- The Course Progress tab for tracking degree requirements
- The Calendar tab for viewing the weekly schedule
- How the system prioritizes courses with higher GPAs

When answering questions, use the user's current information provided below to give personalized advice. Reference their major, current semester, courses taken, and degree requirements when relevant.

Keep responses conversational and detailed. Provide complete information without truncation.${userContext}`

    // Format messages for OpenAI (convert to OpenAI format)
    // Limit conversation history to last 20 messages to avoid token limits
    // Keep the most recent messages for context
    const recentMessages = messages.slice(-20)
    
    const openaiMessages = [
      { role: 'system', content: systemPrompt },
      ...recentMessages.map((msg: { role: string; content: string }) => ({
        role: msg.role,
        content: msg.content,
      })),
    ]

    const openai = getOpenAI()
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: openaiMessages as any,
      temperature: 0.7,
      max_tokens: 2000, // Increased to allow full detailed responses
    })

    const response = completion.choices[0]?.message?.content || 'Sorry, I could not generate a response.'

    // Log API usage details for verification
    const usage = completion.usage
    console.log('✅ OpenAI API call successful:', {
      model: 'gpt-4o',
      promptTokens: usage?.prompt_tokens || 0,
      completionTokens: usage?.completion_tokens || 0,
      totalTokens: usage?.total_tokens || 0,
      responseLength: response.length,
      timestamp: new Date().toISOString()
    })

    return NextResponse.json({ 
      message: response,
      // Include usage info in response for debugging (optional)
      _debug: process.env.NODE_ENV === 'development' ? {
        tokensUsed: usage?.total_tokens,
        promptTokens: usage?.prompt_tokens,
        completionTokens: usage?.completion_tokens
      } : undefined
    })
  } catch (error: any) {
    console.error('OpenAI API error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to get response from AI' },
      { status: 500 }
    )
  }
}

