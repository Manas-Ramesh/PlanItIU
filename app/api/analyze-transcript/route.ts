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
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Missing Supabase environment variables')
  }
  return createClient(supabaseUrl, supabaseServiceKey)
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('image') as File

    if (!file) {
      return NextResponse.json(
        { error: 'No image file provided' },
        { status: 400 }
      )
    }

    // Convert file to base64
    const bytes = await file.arrayBuffer()
    const base64 = Buffer.from(bytes).toString('base64')
    const mimeType = file.type || 'image/jpeg'

    // Use OpenAI Vision API to analyze the image
    const openai = getOpenAI()
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `You are an expert at extracting course information from university transcript screenshots. 
          
Your task is to:
1. Determine if this image is actually a course schedule/transcript from Indiana University's SIS system
2. If it's a valid course schedule, extract ALL UNIQUE course codes (e.g., "BUS-C 104", "PHIL-P 106", "ECON-B 251")
3. Ignore any "Unregistered Items" sections - only extract courses that are actually registered/completed
4. Return ONLY UNIQUE course codes - each course code should appear only ONCE in the array, even if it appears multiple times in the image
5. Return an empty array if no valid courses are found

IMPORTANT: 
- Extract each course code ONLY ONCE, even if it appears multiple times in the image
- Do NOT include duplicates in the courses array
- Course codes typically follow patterns like: "BUS-C 104", "PHIL-P 106", "ECON-B 251"
- Format: Department code, hyphen, single letter, space, number (e.g., "BUS-C 104", "ENG-W 131")

Course codes typically follow patterns like:
- BUS-C 104
- PHIL-P 106
- ECON-B 251
- ENG-W 131
- BUS-A 100
- GEOG-G 208
- BUS-K 201
- SPH-R 142
- ENG-L 220
- BUS-T 175

If the image is NOT a course schedule/transcript, return an empty array: []

Return your response as a JSON object with this structure:
{
  "isValidSchedule": true/false,
  "courses": ["BUS-C 104", "PHIL-P 106", ...],  // UNIQUE courses only, no duplicates
  "message": "Optional message explaining what was found"
}`
        },
        {
          role: 'user',
          content: [
            {
              type: 'image_url',
              image_url: {
                url: `data:${mimeType};base64,${base64}`,
              },
            },
            {
              type: 'text',
              text: 'Extract ALL course codes from this image. Look carefully at both Fall and Spring terms. Ignore "Unregistered Items" sections. Return only registered/completed courses with grades. Extract every unique course code you see, even if there are many.',
            },
          ],
        },
      ],
      max_tokens: 2000,
    })

    const content = response.choices[0]?.message?.content
    if (!content) {
      return NextResponse.json(
        { error: 'No response from AI' },
        { status: 500 }
      )
    }

    // Parse the JSON response
    let parsedResponse
    try {
      // Extract JSON from markdown code blocks if present
      const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/) || content.match(/```\n([\s\S]*?)\n```/)
      const jsonString = jsonMatch ? jsonMatch[1] : content
      parsedResponse = JSON.parse(jsonString)
    } catch (parseError) {
      console.error('Failed to parse AI response:', content)
      return NextResponse.json(
        { error: 'Failed to parse AI response', rawResponse: content },
        { status: 500 }
      )
    }

    // Validate that we got a valid schedule
    if (!parsedResponse.isValidSchedule) {
      return NextResponse.json({
        success: false,
        message: parsedResponse.message || 'This does not appear to be a valid course schedule. Please screenshot from https://sisjee.iu.edu/sisigps-prd/web/igps/plan/full/',
        courses: [],
      })
    }

    // Validate courses against database
    const extractedCourses = parsedResponse.courses || []
    console.log('📸 Extracted courses from AI:', extractedCourses)
    
    if (extractedCourses.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'No courses found in the image. Please ensure you screenshot from the SIS plan page.',
        courses: [],
      })
    }

    // Remove duplicates and normalize course codes (trim whitespace, normalize spacing)
    // Keep original format for matching, but normalize for comparison
    const normalizedCourses = extractedCourses
      .map((code: string) => {
        // Normalize: trim, remove extra spaces, uppercase for comparison
        return code.trim().replace(/\s+/g, ' ').toUpperCase()
      })
      .filter((code: string) => code.length > 0)
    
    const uniqueCourses = Array.from(new Set(normalizedCourses))
    console.log('🔍 Normalized unique courses:', uniqueCourses)

    if (uniqueCourses.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'No valid course codes found in the image.',
        courses: [],
      })
    }

    // Check which courses exist in the database (case-insensitive)
    // Fetch all unique course codes from database (one-time query)
    const supabase = getSupabase()
    const { data: allCourses, error: dbError } = await supabase
      .from('courses')
      .select('course_code')
      .limit(50000) // Reasonable limit for course codes

    if (dbError) {
      console.error('Database error:', dbError)
      // Fallback: try exact matches for the extracted courses
      const { data: exactMatches } = await supabase
        .from('courses')
        .select('course_code')
        .in('course_code', uniqueCourses)
      
      const validCourseCodes = exactMatches?.map(c => c.course_code) || []
      const invalidCourses = uniqueCourses.filter(
        code => !validCourseCodes.includes(code)
      )

      return NextResponse.json({
        success: true,
        courses: validCourseCodes,
        invalidCourses: invalidCourses,
        message: invalidCourses.length > 0
          ? `Found ${validCourseCodes.length} valid courses. ${invalidCourses.length} courses not found in database: ${invalidCourses.join(', ')}`
          : `Successfully extracted ${validCourseCodes.length} courses!`,
      })
    }

    // Create a case-insensitive map: normalized -> actual database format
    const courseCodeMap = new Map<string, string>()
    allCourses?.forEach(course => {
      // Normalize database course codes: trim, remove extra spaces, uppercase
      const normalized = course.course_code.trim().replace(/\s+/g, ' ').toUpperCase()
      if (!courseCodeMap.has(normalized)) {
        courseCodeMap.set(normalized, course.course_code)
      }
    })

    console.log(`📚 Loaded ${courseCodeMap.size} unique courses from database`)

    // Match extracted courses (normalized) with database courses
    const validCourseCodes: string[] = []
    const invalidCourses: string[] = []
    const addedCodes = new Set<string>()

    uniqueCourses.forEach(extractedCode => {
      const codeStr = extractedCode as string
      const dbCourseCode = courseCodeMap.get(codeStr)
      if (dbCourseCode && !addedCodes.has(dbCourseCode)) {
        // Use the actual database format and avoid duplicates
        validCourseCodes.push(dbCourseCode)
        addedCodes.add(dbCourseCode)
        console.log(`✅ Matched: ${codeStr} -> ${dbCourseCode}`)
      } else if (!dbCourseCode) {
        invalidCourses.push(codeStr)
        console.log(`❌ No match found for: ${codeStr}`)
      }
    })

    console.log(`✅ Valid courses: ${validCourseCodes.length}, Invalid: ${invalidCourses.length}`)

    // If we have invalid courses, include them in the response for debugging
    const responseMessage = invalidCourses.length > 0
      ? `Found ${validCourseCodes.length} valid course${validCourseCodes.length !== 1 ? 's' : ''}. ${invalidCourses.length} course${invalidCourses.length !== 1 ? 's' : ''} not found in database: ${invalidCourses.join(', ')}`
      : `Successfully extracted ${validCourseCodes.length} course${validCourseCodes.length !== 1 ? 's' : ''}!`

    return NextResponse.json({
      success: true,
      courses: validCourseCodes,
      invalidCourses: invalidCourses,
      message: responseMessage,
      debug: {
        extractedCount: extractedCourses.length,
        uniqueCount: uniqueCourses.length,
        validCount: validCourseCodes.length,
        invalidCount: invalidCourses.length,
      },
    })
  } catch (error: any) {
    console.error('Error analyzing transcript:', error)
    return NextResponse.json(
      {
        error: 'Failed to analyze image',
        message: error.message || 'An unexpected error occurred',
      },
      { status: 500 }
    )
  }
}

