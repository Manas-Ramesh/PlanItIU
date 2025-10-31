import { createClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const error = requestUrl.searchParams.get('error')
  const errorDescription = requestUrl.searchParams.get('error_description')
  const next = requestUrl.searchParams.get('next') || '/dashboard'

  console.log('OAuth callback received:', {
    hasCode: !!code,
    hasError: !!error,
    error,
    errorDescription,
    fullUrl: requestUrl.toString(),
    allParams: Object.fromEntries(requestUrl.searchParams.entries())
  })

  // If Supabase returns an error parameter, log it
  if (error) {
    console.error('OAuth error from Supabase:', error, errorDescription)
    return NextResponse.redirect(
      new URL(`/login?error=oauth_error&details=${encodeURIComponent(errorDescription || error)}`, requestUrl.origin)
    )
  }

  // If no code, check if we already have a session (Supabase might have already set cookies)
  if (!code) {
    const supabase = await createClient()
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    
    console.log('No code in callback - checking session:', {
      hasSession: !!session,
      sessionError: sessionError?.message,
      userId: session?.user?.id,
    })
    
    if (sessionError) {
      console.error('Error getting session:', sessionError)
    }
    
    if (session) {
      // User is already authenticated (Supabase set session cookies), redirect to dashboard
      console.log('✅ Session found without code - OAuth successful, redirecting to dashboard')
      return NextResponse.redirect(new URL(next, requestUrl.origin))
    }
    
    // No code and no session - check if this is a direct navigation
    const referer = request.headers.get('referer')
    console.error('❌ OAuth callback called without code and no session exists')
    console.log('Request details:', {
      url: requestUrl.toString(),
      referer,
      allParams: Object.fromEntries(requestUrl.searchParams.entries()),
      cookies: request.headers.get('cookie') ? 'present' : 'missing'
    })
    
    // If no referer, this might be a direct navigation - redirect to login
    if (!referer || !referer.includes('supabase')) {
      console.warn('⚠️  Possible direct navigation to callback - redirecting to login')
    }
    
    // No code and no session - redirect to login
    return NextResponse.redirect(new URL('/login?error=oauth_error&details=no_code_no_session', requestUrl.origin))
  }

  // Exchange code for session
  try {
    const supabase = await createClient()
    const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
    
    if (exchangeError) {
      console.error('Session exchange error:', exchangeError.message, exchangeError)
      return NextResponse.redirect(
        new URL(`/login?error=oauth_error&details=${encodeURIComponent(exchangeError.message)}`, requestUrl.origin)
      )
    }
    
    if (data.session) {
      // Success - redirect to dashboard
      return NextResponse.redirect(new URL(next, requestUrl.origin))
    }
    
    // No session after exchange (unlikely but possible)
    return NextResponse.redirect(new URL('/login?error=oauth_error&details=no_session', requestUrl.origin))
  } catch (err: any) {
    console.error('Unexpected error in OAuth callback:', err)
    return NextResponse.redirect(
      new URL(`/login?error=oauth_error&details=${encodeURIComponent(err.message || 'Unexpected error')}`, requestUrl.origin)
    )
  }
}

