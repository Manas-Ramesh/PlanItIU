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
    // Check for OpenAI API key first
    if (!process.env.OPENAI_API_KEY) {
      console.error('❌ OPENAI_API_KEY is missing in environment variables')
      return NextResponse.json(
        { 
          error: 'AI service is not configured',
          message: 'OpenAI API key is missing. Please configure OPENAI_API_KEY in your environment variables.',
          success: false
        },
        { status: 500 }
      )
    }

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
    
    console.log('📸 Starting transcript analysis:', {
      fileName: file.name,
      fileSize: file.size,
      mimeType,
      hasOpenAIKey: !!process.env.OPENAI_API_KEY,
      timestamp: new Date().toISOString()
    })

    // Use OpenAI Vision API to analyze the image
    const openai = getOpenAI()
    let response
    try {
      console.log('🤖 Calling OpenAI Vision API...')
      response = await openai.chat.completions.create({
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
      
      console.log('✅ OpenAI API call successful:', {
        model: 'gpt-4o',
        hasResponse: !!response.choices[0]?.message?.content,
        responseLength: response.choices[0]?.message?.content?.length || 0,
        usage: response.usage ? {
          promptTokens: response.usage.prompt_tokens,
          completionTokens: response.usage.completion_tokens,
          totalTokens: response.usage.total_tokens
        } : null,
        timestamp: new Date().toISOString()
      })
    } catch (openaiError: any) {
      console.error('❌ OpenAI API call failed:', {
        error: openaiError.message,
        status: openaiError.status,
        code: openaiError.code,
        type: openaiError.type,
        hasOpenAIKey: !!process.env.OPENAI_API_KEY,
        timestamp: new Date().toISOString()
      })
      return NextResponse.json(
        {
          error: 'Failed to analyze image with AI',
          message: openaiError.message || 'OpenAI API error occurred',
          success: false,
          debug: process.env.NODE_ENV === 'development' ? {
            status: openaiError.status,
            code: openaiError.code,
            type: openaiError.type
          } : undefined
        },
        { status: 500 }
      )
    }

    const content = response.choices[0]?.message?.content
    if (!content) {
      console.error('❌ OpenAI returned empty response:', {
        hasResponse: !!response,
        choicesLength: response?.choices?.length || 0,
        firstChoice: response?.choices?.[0] ? {
          hasMessage: !!response.choices[0].message,
          finishReason: response.choices[0].finish_reason,
          index: response.choices[0].index
        } : null,
        timestamp: new Date().toISOString()
      })
      return NextResponse.json(
        { 
          error: 'No response from AI',
          message: 'OpenAI API returned an empty response. Please try again.',
          success: false
        },
        { status: 500 }
      )
    }
    
    console.log('📝 Received AI response (first 200 chars):', content.substring(0, 200))

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

    // Check which courses exist in the database
    const supabase = getSupabase()
    
    // Verify database connection and check total course count
    console.log('🔍 Verifying database connection...')
    const { count: totalCount, error: countError } = await supabase
      .from('courses')
      .select('*', { count: 'exact', head: true })
    console.log('📊 Database connection check:', {
      totalCourses: totalCount,
      error: countError,
      hasServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'set' : 'missing'
    })
    
    // First, try direct case-insensitive matching for the extracted courses
    // This is more efficient than loading all courses
    console.log('🔍 Checking if extracted courses exist in database...')
    
    // Try multiple matching strategies for each course
    const validCourseCodes: string[] = []
    const invalidCourses: string[] = []
    const checkedCourses = new Set<string>()
    
    // Strategy 1: Direct case-insensitive match using ilike
    for (const extractedCode of uniqueCourses) {
      if (checkedCourses.has(extractedCode)) continue
      
      const normalized = extractedCode.trim().replace(/\s+/g, ' ').toUpperCase()
      const noSpaces = extractedCode.trim().replace(/\s+/g, '').toUpperCase()
      
      // Try multiple patterns
      const patterns = [
        normalized,           // "BUS-C 104"
        noSpaces,             // "BUS-C104"
        extractedCode.trim(), // Original trimmed
      ]
      
      let found = false
      let matchedDbCode: string | null = null
      
      for (const pattern of patterns) {
        // Try case-insensitive match
        const { data: match1, error: err1 } = await supabase
          .from('courses')
          .select('course_code')
          .ilike('course_code', pattern)
          .limit(1)
        
        if (err1) {
          console.error(`❌ Database error for "${extractedCode}" with pattern "${pattern}":`, {
            message: err1.message,
            details: err1.details,
            hint: err1.hint,
            code: err1.code
          })
        }
        
        if (!err1 && match1 && match1.length > 0) {
          matchedDbCode = match1[0].course_code
          found = true
          console.log(`✅ Found match: "${extractedCode}" -> "${matchedDbCode}" (pattern: "${pattern}")`)
          break
        }
        
        // Try exact match (case-sensitive)
        const { data: match2, error: err2 } = await supabase
          .from('courses')
          .select('course_code')
          .eq('course_code', pattern)
          .limit(1)
        
        if (err2) {
          console.error(`❌ Database error (exact match) for "${extractedCode}" with pattern "${pattern}":`, {
            message: err2.message,
            details: err2.details,
            hint: err2.hint,
            code: err2.code
          })
        }
        
        if (!err2 && match2 && match2.length > 0) {
          matchedDbCode = match2[0].course_code
          found = true
          console.log(`✅ Found exact match: "${extractedCode}" -> "${matchedDbCode}" (pattern: "${pattern}")`)
          break
        }
      }
      
      if (found && matchedDbCode) {
        // Avoid duplicates
        if (!validCourseCodes.includes(matchedDbCode)) {
          validCourseCodes.push(matchedDbCode)
        }
        checkedCourses.add(extractedCode)
      } else {
        // Check if it exists with any variation by querying similar patterns
        // Try a more flexible search - check if any course_code contains the pattern
        const { data: similar1 } = await supabase
          .from('courses')
          .select('course_code')
          .ilike('course_code', `%${normalized.replace(/\s+/g, '')}%`)
          .limit(5)
        
        const { data: similar2 } = await supabase
          .from('courses')
          .select('course_code')
          .ilike('course_code', `%${noSpaces}%`)
          .limit(5)
        
        const similar = [...(similar1 || []), ...(similar2 || [])]
        const similarErr = null
        
        if (!similarErr && similar && similar.length > 0) {
          console.log(`💡 Found similar courses for "${extractedCode}":`, similar.map(c => c.course_code))
          // Use the first similar match if it's close enough
          const closeMatch = similar.find(c => {
            const dbNormalized = c.course_code.trim().replace(/\s+/g, '').toUpperCase()
            return dbNormalized === noSpaces || dbNormalized === normalized.replace(/\s+/g, '')
          })
          if (closeMatch && !validCourseCodes.includes(closeMatch.course_code)) {
            validCourseCodes.push(closeMatch.course_code)
            checkedCourses.add(extractedCode)
            console.log(`✅ Using close match: "${extractedCode}" -> "${closeMatch.course_code}"`)
            found = true
          }
        }
        
        if (!found) {
          invalidCourses.push(extractedCode)
          console.log(`❌ No match found for: "${extractedCode}" (tried: "${normalized}", "${noSpaces}")`)
        }
      }
    }
    
    // Debug: Check a few specific courses to see what's in the database
    console.log('🔍 Debug: Checking if specific courses exist in database...')
    const testCourses = ['BUS-C 104', 'PHIL-P 106', 'ECON-B 251', 'BUS-A 100', 'BUS-K 201', 'BUS-T 175', 'ENG-W 131']
    for (const testCourse of testCourses) {
      // Try multiple query methods
      const { data: testMatch1, error: err1 } = await supabase
        .from('courses')
        .select('course_code')
        .ilike('course_code', testCourse)
        .limit(5)
      
      const { data: testMatch2, error: err2 } = await supabase
        .from('courses')
        .select('course_code')
        .eq('course_code', testCourse)
        .limit(5)
      
      const { data: testMatch3, error: err3 } = await supabase
        .from('courses')
        .select('course_code')
        .ilike('course_code', testCourse.replace(/\s+/g, ''))
        .limit(5)
      
      const allMatches = [
        ...(testMatch1 || []),
        ...(testMatch2 || []),
        ...(testMatch3 || [])
      ]
      const uniqueMatches = Array.from(new Set(allMatches.map(c => c.course_code)))
      
      console.log(`   "${testCourse}":`, {
        ilike: testMatch1?.length || 0,
        exact: testMatch2?.length || 0,
        noSpaces: testMatch3?.length || 0,
        matches: uniqueMatches,
        errors: err1 || err2 || err3 || null
      })
    }
    
    // Also check what course codes actually exist that are similar
    console.log('🔍 Debug: Sample of actual course codes in database...')
    const { data: sampleCourses, error: sampleErr } = await supabase
      .from('courses')
      .select('course_code')
      .or('course_code.ilike.BUS-%,course_code.ilike.ECON-%,course_code.ilike.ENG-%,course_code.ilike.PHIL-%')
      .limit(20)
    console.log('   Sample courses:', {
      count: sampleCourses?.length || 0,
      courses: sampleCourses?.map(c => c.course_code) || [],
      error: sampleErr
    })
    
    // Try a direct query for BUS-C 104 to see what happens
    console.log('🔍 Debug: Direct query test for BUS-C 104...')
    const directTest = await supabase
      .from('courses')
      .select('course_code, course_name')
      .ilike('course_code', 'BUS-C 104')
      .limit(5)
    console.log('   Direct test result:', {
      data: directTest.data,
      error: directTest.error ? {
        message: directTest.error.message,
        details: directTest.error.details,
        hint: directTest.error.hint,
        code: directTest.error.code
      } : null,
      count: directTest.data?.length || 0
    })
    
    // Also try to get ANY BUS course to verify the table structure
    const anyBusCourse = await supabase
      .from('courses')
      .select('course_code, course_name')
      .ilike('course_code', 'BUS-%')
      .limit(3)
    console.log('   Any BUS course test:', {
      found: anyBusCourse.data?.length || 0,
      courses: anyBusCourse.data?.map(c => `${c.course_code}: ${c.course_name}`) || [],
      error: anyBusCourse.error?.message || null
    })
    
    console.log(`✅ Matching complete: ${validCourseCodes.length} valid, ${invalidCourses.length} invalid`)

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
    console.error('❌ Error analyzing transcript:', {
      error: error.message,
      stack: error.stack,
      name: error.name,
      hasOpenAIKey: !!process.env.OPENAI_API_KEY,
      hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      timestamp: new Date().toISOString()
    })
    return NextResponse.json(
      {
        error: 'Failed to analyze image',
        message: error.message || 'An unexpected error occurred',
        success: false,
        debug: process.env.NODE_ENV === 'development' ? {
          errorName: error.name,
          errorStack: error.stack?.substring(0, 500)
        } : undefined
      },
      { status: 500 }
    )
  }
}


