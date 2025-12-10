import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { createClient } from '@supabase/supabase-js'

// Vercel configuration: Increase timeout for image analysis
// Hobby plan: max 10s, Pro plan: max 300s (5 minutes)
// Set to 60s to handle OpenAI API calls + database queries
export const maxDuration = 60

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
  
  // CRITICAL: MUST use service role key to bypass RLS
  // DO NOT fall back to anon key - it will be restricted by RLS and only return 417 rows instead of 12,302
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  
  if (!supabaseUrl) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable')
  }
  
  if (!supabaseServiceKey) {
    console.error('❌ CRITICAL ERROR: SUPABASE_SERVICE_ROLE_KEY is not set!')
    console.error('   This API route requires the service role key to bypass RLS.')
    console.error('   Without it, you will only get 417 rows instead of 12,302.')
    console.error('   Set SUPABASE_SERVICE_ROLE_KEY in Vercel production environment variables.')
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is required. Set it in Vercel environment variables to bypass RLS.')
  }
  
  // Verify we're using service role key (starts with 'eyJ' and is much longer than anon key)
  const isServiceRoleKey = supabaseServiceKey.length > 100 && supabaseServiceKey.startsWith('eyJ')
  if (!isServiceRoleKey) {
    console.warn('⚠️ WARNING: SUPABASE_SERVICE_ROLE_KEY may be invalid (too short or wrong format)')
  }
  
  console.log('✅ Using service role key - RLS will be bypassed')
  
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
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // Check file type
    const isImage = file.type.startsWith('image/')
    const isPDF = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')
    
    if (!isImage && !isPDF) {
      return NextResponse.json(
        { error: 'Invalid file type', message: 'Please upload an image file or PDF' },
        { status: 400 }
      )
    }

    // Check file size before processing
    // Vercel Hobby plan has 4.5MB request body limit
    // Base64 encoding increases size by ~33%, so limit raw file to ~3MB
    const MAX_FILE_SIZE = 3 * 1024 * 1024 // 3MB
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { 
          error: 'File too large',
          message: `File is too large (${(file.size / 1024 / 1024).toFixed(2)}MB). Please use a file under 3MB. Vercel has request body size limits that prevent larger files.`
        },
        { status: 400 }
      )
    }

    // For PDFs, we'll need to convert to image first
    // For now, return an error suggesting to use screenshots
    // TODO: Add PDF to image conversion using a library like pdf-lib or pdfjs-dist
    if (isPDF) {
      return NextResponse.json(
        { 
          error: 'PDF support coming soon',
          message: 'PDF upload is not yet supported. Please take a screenshot of your transcript and upload it as an image file. We\'re working on PDF support!'
        },
        { status: 400 }
      )
    }

    // Convert file to base64
    const bytes = await file.arrayBuffer()
    const base64 = Buffer.from(bytes).toString('base64')
    const mimeType = file.type || 'image/jpeg'
    
    // Log base64 size for debugging (base64 is ~33% larger than original)
    const base64Size = base64.length
    console.log('📊 File size info:', {
      originalSize: file.size,
      base64Size: base64Size,
      sizeIncrease: `${((base64Size / file.size - 1) * 100).toFixed(1)}%`,
      isWithinLimit: base64Size < 4.5 * 1024 * 1024
    })
    
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
3. For each course, also extract the grade if visible (e.g., "A", "B+", "A-", "B", "C+", etc.)
4. Ignore any "Unregistered Items" sections - only extract courses that are actually registered/completed
5. Return ONLY UNIQUE course codes - each course code should appear only ONCE in the array, even if it appears multiple times in the image
6. Return an empty array if no valid courses are found

IMPORTANT: 
- Extract each course code ONLY ONCE, even if it appears multiple times in the image
- Do NOT include duplicates in the courses array
- Course codes typically follow patterns like: "BUS-C 104", "PHIL-P 106", "ECON-B 251"
- Format: Department code, hyphen, single letter, space, number (e.g., "BUS-C 104", "ENG-W 131")
- Grades should be in standard format: A+, A, A-, B+, B, B-, C+, C, C-, D+, D, D-, F
- If a grade is not visible or unclear, set it to null

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
  "courses": [
    {"course_code": "BUS-C 104", "grade": "A"},
    {"course_code": "PHIL-P 106", "grade": "B+"},
    {"course_code": "ECON-B 251", "grade": null}
  ],  // Array of objects with course_code and grade (grade can be null if not visible)
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
              text: 'Extract ALL course codes and their corresponding grades from this image. Look carefully at both Fall and Spring terms. Ignore "Unregistered Items" sections. Return only registered/completed courses. For each course, extract the course code and the grade if visible (A+, A, A-, B+, B, B-, C+, C, C-, D+, D, D-, F). If a grade is not visible or unclear, set it to null. Extract every unique course code you see, even if there are many.',
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
    // Handle both old format (array of strings) and new format (array of objects)
    const extractedCourses = parsedResponse.courses || []
    console.log('📸 Extracted courses from AI:', extractedCourses)
    
    if (extractedCourses.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'No courses found in the image. Please ensure you screenshot from the SIS plan page.',
        courses: [],
        courseGrades: {},
      })
    }

    // Normalize extracted courses - handle both string and object formats
    const coursesWithGrades: { course_code: string; grade: string | null }[] = []
    const courseGradesMap: { [key: string]: string | null } = {}
    
    for (const item of extractedCourses) {
      let courseCode: string
      let grade: string | null = null
      
      if (typeof item === 'string') {
        // Old format: just course code string
        courseCode = item
      } else if (item && typeof item === 'object' && 'course_code' in item) {
        // New format: object with course_code and grade
        courseCode = item.course_code
        grade = item.grade || null
      } else {
        continue
      }
      
      // Normalize course code
      const normalized = courseCode.trim().replace(/\s+/g, ' ').toUpperCase()
      if (normalized.length === 0) continue
      
      // Avoid duplicates
      if (!courseGradesMap[normalized]) {
        coursesWithGrades.push({ course_code: normalized, grade })
        courseGradesMap[normalized] = grade
      }
    }
    
    const uniqueCourses: string[] = coursesWithGrades.map(c => c.course_code)
    console.log('🔍 Normalized unique courses:', uniqueCourses)
    console.log('📊 Extracted grades:', courseGradesMap)

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
    
    const hasServiceKey = !!process.env.SUPABASE_SERVICE_ROLE_KEY
    const keyType = hasServiceKey ? 'SERVICE ROLE KEY ✅' : 'ANON KEY ❌'
    
    console.log('📊 Database connection check:', {
      totalCourses: totalCount,
      error: countError,
      keyType: keyType,
      hasServiceKey: hasServiceKey,
      hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'set' : 'missing',
      status: hasServiceKey 
        ? '✅ Using service role key - RLS bypassed, should see all 12,302 rows' 
        : '❌ ERROR: Should be using service role key but it is not set!'
    })
    
    // If count is much lower than expected, warn about RLS
    if (totalCount && totalCount < 1000) {
      console.warn(`⚠️ WARNING: Only ${totalCount} courses found. Expected ~12,302.`)
      console.warn('   This suggests RLS is restricting access. Check:')
      console.warn('   1. SUPABASE_SERVICE_ROLE_KEY is set in Vercel production')
      console.warn('   2. RLS policies on courses table allow reading all rows')
    }
    
    // First, try direct case-insensitive matching for the extracted courses
    // This is more efficient than loading all courses
    console.log('🔍 Checking if extracted courses exist in database...')
    
    // Try multiple matching strategies for each course
    const validCourseCodes: string[] = []
    const invalidCourses: string[] = []
    const checkedCourses = new Set<string>()
    
    // Strategy 1: Batch query all courses at once, then match in memory
    // This is more efficient and reliable than individual queries
    console.log('📚 Fetching all unique course codes from database...')
    const { data: allCourses, error: fetchError } = await supabase
      .from('courses')
      .select('course_code')
      .limit(50000)
    
    if (fetchError) {
      console.error('❌ Error fetching courses:', fetchError)
      console.error('   Error details:', {
        message: fetchError.message,
        details: fetchError.details,
        hint: fetchError.hint,
        code: fetchError.code
      })
      // Fallback to individual queries
    } else {
      console.log(`📚 Loaded ${allCourses?.length || 0} course rows from database`)
      
      // CRITICAL: Warn if we're getting too few rows (RLS issue)
      if (allCourses && allCourses.length < 1000) {
        console.error('❌ RLS ISSUE DETECTED: Only loaded', allCourses.length, 'rows instead of expected ~12,302')
        console.error('   This means RLS is restricting access. Solutions:')
        console.error('   1. Set SUPABASE_SERVICE_ROLE_KEY in Vercel production environment variables')
        console.error('   2. Or add RLS policy: CREATE POLICY "Allow read all courses" ON courses FOR SELECT USING (true);')
        console.error('   Current key type:', process.env.SUPABASE_SERVICE_ROLE_KEY ? 'Service Role ✅' : 'Anon Key ⚠️')
      }
      
      // Get unique course codes (deduplicate)
      const uniqueDbCourses = Array.from(new Set(allCourses?.map(c => c.course_code).filter(Boolean) || []))
      console.log(`📚 Found ${uniqueDbCourses.length} unique course codes in database`)
      
      // Log sample of actual course codes from database for debugging
      console.log('📚 Sample of database course codes (first 10):', uniqueDbCourses.slice(0, 10))
      
      // Create a normalized lookup map
      const courseCodeMap = new Map<string, string>()
      uniqueDbCourses.forEach(code => {
        if (!code) return
        
        // Store multiple normalized versions
        const normalized = code.trim().replace(/\s+/g, ' ').toUpperCase()
        const noSpaces = code.trim().replace(/\s+/g, '').toUpperCase()
        const original = code.trim()
        
        // Map all variations to the original database format
        if (!courseCodeMap.has(normalized)) courseCodeMap.set(normalized, code)
        if (!courseCodeMap.has(noSpaces)) courseCodeMap.set(noSpaces, code)
        if (!courseCodeMap.has(original.toUpperCase())) courseCodeMap.set(original.toUpperCase(), code)
        if (!courseCodeMap.has(original)) courseCodeMap.set(original, code)
      })
      
      console.log(`📚 Created lookup map with ${courseCodeMap.size} normalized entries`)
      
      // Debug: Check if specific courses exist in the map
      console.log('🔍 Debug: Checking lookup map for extracted courses...')
      for (const extractedCode of uniqueCourses.slice(0, 3)) {
        const codeStr = String(extractedCode)
        const normalized = codeStr.trim().replace(/\s+/g, ' ').toUpperCase()
        const noSpaces = codeStr.trim().replace(/\s+/g, '').toUpperCase()
        const foundInMap = courseCodeMap.has(normalized) || courseCodeMap.has(noSpaces)
        const mapValue = courseCodeMap.get(normalized) || courseCodeMap.get(noSpaces)
        
        console.log(`   "${codeStr}":`, {
          normalized: normalized,
          noSpaces: noSpaces,
          inMap: foundInMap,
          mapValue: mapValue || null,
          mapKeys_sample: Array.from(courseCodeMap.keys()).filter(k => k.includes('BUS-C') || k.includes('PHIL')).slice(0, 5)
        })
        
        // Also try a direct database query for this specific course
        if (!foundInMap) {
          const { data: directQuery, error: directErr } = await supabase
            .from('courses')
            .select('course_code')
            .ilike('course_code', `%${codeStr.replace(/\s+/g, '%')}%`)
            .limit(5)
          
          console.log(`   Direct DB query for "${codeStr}":`, {
            found: directQuery?.length || 0,
            results: directQuery?.map(c => c.course_code) || [],
            error: directErr?.message || null
          })
        }
      }
      
      // Now match extracted courses against the map
      for (const extractedCode of uniqueCourses) {
        if (checkedCourses.has(extractedCode)) continue
        
        const normalized = extractedCode.trim().replace(/\s+/g, ' ').toUpperCase()
        const noSpaces = extractedCode.trim().replace(/\s+/g, '').toUpperCase()
        const original = extractedCode.trim()
        
        // Try multiple lookup keys
        const lookupKeys = [normalized, noSpaces, original.toUpperCase(), original]
        let matchedDbCode: string | null = null
        
        for (const key of lookupKeys) {
          if (courseCodeMap.has(key)) {
            matchedDbCode = courseCodeMap.get(key)!
            break
          }
        }
        
        if (matchedDbCode) {
          if (!validCourseCodes.includes(matchedDbCode)) {
            validCourseCodes.push(matchedDbCode)
          }
          checkedCourses.add(extractedCode)
          console.log(`✅ Matched: "${extractedCode}" -> "${matchedDbCode}"`)
          continue
        }
        
        // If not found in map, try database query as fallback
        // Use multiple query strategies
        let found = false
        const patterns = [
          normalized,           // "BUS-C 104"
          noSpaces,             // "BUS-C104"
          original,             // "BUS-C 104" (original)
          original.toUpperCase(), // "BUS-C 104" (uppercase)
          normalized.replace(/\s+/g, ''), // Remove all spaces
        ]
        
        for (const pattern of patterns) {
          // Try exact case-insensitive match
          const { data: match1, error: err1 } = await supabase
            .from('courses')
            .select('course_code')
            .ilike('course_code', pattern)
            .limit(1)
          
          if (err1) {
            console.error(`❌ Database error for "${extractedCode}" with pattern "${pattern}":`, err1.message)
            continue
          }
          
          if (match1 && match1.length > 0) {
            matchedDbCode = match1[0].course_code
            found = true
            console.log(`✅ Found via query: "${extractedCode}" -> "${matchedDbCode}" (pattern: "${pattern}")`)
            break
          }
        }
        
        // If still not found, try a more flexible pattern match
        if (!found) {
          // Try matching with wildcards - e.g., "BUS-C%" or "BUS C%"
          const basePattern = normalized.split(' ')[0] // Get "BUS-C" or "BUS"
          if (basePattern) {
            const { data: wildcardMatch, error: wildcardErr } = await supabase
              .from('courses')
              .select('course_code')
              .ilike('course_code', `${basePattern}%`)
              .limit(10)
            
            if (!wildcardErr && wildcardMatch && wildcardMatch.length > 0) {
              // Find the closest match
              const possibleMatches = wildcardMatch.map(c => c.course_code)
              console.log(`🔍 Wildcard match for "${extractedCode}":`, possibleMatches)
              
              // Try to find exact match in the results
              for (const possibleMatch of possibleMatches) {
                const matchNormalized = possibleMatch.trim().replace(/\s+/g, ' ').toUpperCase()
                const matchNoSpaces = possibleMatch.trim().replace(/\s+/g, '').toUpperCase()
                
                if (matchNormalized === normalized || matchNoSpaces === noSpaces) {
                  matchedDbCode = possibleMatch
                  found = true
                  console.log(`✅ Found via wildcard: "${extractedCode}" -> "${matchedDbCode}"`)
                  break
                }
              }
            }
          }
        }
        
        if (found && matchedDbCode) {
          if (!validCourseCodes.includes(matchedDbCode)) {
            validCourseCodes.push(matchedDbCode)
          }
          checkedCourses.add(extractedCode)
        } else {
          invalidCourses.push(extractedCode)
          console.log(`❌ No match found for: "${extractedCode}"`)
        }
      }
    }
    
    // Fallback: If batch fetch failed, use individual queries
    if (fetchError || !allCourses) {
      console.log('⚠️ Using fallback: individual queries for each course...')
      for (const extractedCode of uniqueCourses) {
        if (checkedCourses.has(extractedCode)) continue
        
        const normalized = extractedCode.trim().replace(/\s+/g, ' ').toUpperCase()
        const noSpaces = extractedCode.trim().replace(/\s+/g, '').toUpperCase()
        
        let found = false
        let matchedDbCode: string | null = null
        
        // Try case-insensitive match
        const { data: match1, error: err1 } = await supabase
          .from('courses')
          .select('course_code')
          .ilike('course_code', normalized)
          .limit(1)
        
        if (!err1 && match1 && match1.length > 0) {
          matchedDbCode = match1[0].course_code
          found = true
          console.log(`✅ Found match: "${extractedCode}" -> "${matchedDbCode}"`)
        } else {
          // Try without spaces
          const { data: match2, error: err2 } = await supabase
            .from('courses')
            .select('course_code')
            .ilike('course_code', noSpaces)
            .limit(1)
          
          if (!err2 && match2 && match2.length > 0) {
            matchedDbCode = match2[0].course_code
            found = true
            console.log(`✅ Found match (no spaces): "${extractedCode}" -> "${matchedDbCode}"`)
          }
        }
        
        if (found && matchedDbCode) {
          if (!validCourseCodes.includes(matchedDbCode)) {
            validCourseCodes.push(matchedDbCode)
          }
          checkedCourses.add(extractedCode)
        } else {
          invalidCourses.push(extractedCode)
          console.log(`❌ No match found for: "${extractedCode}"`)
        }
      }
    }
    
    // Debug: Check a few specific courses to see what's in the database
    // This helps diagnose why matching is failing in production
    console.log('🔍 Debug: Checking if specific courses exist in database...')
    const testCourses = ['BUS-C 104', 'PHIL-P 106', 'ECON-B 251', 'BUS-A 100', 'BUS-K 201', 'BUS-T 175', 'ENG-W 131']
    for (const testCourse of testCourses) {
      // Try multiple query methods with various formats
      const variations = [
        testCourse,                              // "BUS-C 104"
        testCourse.toUpperCase(),                // "BUS-C 104"
        testCourse.replace(/\s+/g, ''),         // "BUS-C104"
        testCourse.replace(/\s+/g, ' ').trim(), // "BUS-C 104" (normalized)
        testCourse.replace(/-/g, ' '),          // "BUS C 104"
        testCourse.replace(/\s+/g, '-'),        // "BUS-C-104"
      ]
      
      const allMatches: string[] = []
      const errors: any[] = []
      
      for (const variation of variations) {
        // Try ilike (case-insensitive LIKE)
        const { data: ilikeMatch, error: ilikeErr } = await supabase
          .from('courses')
          .select('course_code')
          .ilike('course_code', variation)
          .limit(5)
        
        if (ilikeErr) errors.push({ method: 'ilike', pattern: variation, error: ilikeErr.message })
        if (ilikeMatch) allMatches.push(...ilikeMatch.map(c => c.course_code))
        
        // Try exact match (case-sensitive)
        const { data: exactMatch, error: exactErr } = await supabase
          .from('courses')
          .select('course_code')
          .eq('course_code', variation)
          .limit(5)
        
        if (exactErr) errors.push({ method: 'eq', pattern: variation, error: exactErr.message })
        if (exactMatch) allMatches.push(...exactMatch.map(c => c.course_code))
      }
      
      const uniqueMatches = Array.from(new Set(allMatches))
      
      console.log(`   "${testCourse}":`, {
        totalMatches: uniqueMatches.length,
        matches: uniqueMatches,
        errors: errors.length > 0 ? errors : null,
        searchedVariations: variations.length
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

    // Build course grades map for valid courses only
    const validCourseGrades: { [key: string]: string | null } = {}
    validCourseCodes.forEach(code => {
      // Find the grade for this course code (try normalized versions)
      const normalized = code.trim().replace(/\s+/g, ' ').toUpperCase()
      validCourseGrades[code] = courseGradesMap[normalized] || null
    })

    return NextResponse.json({
      success: true,
      courses: validCourseCodes,
      courseGrades: validCourseGrades, // Map of course_code -> grade
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


