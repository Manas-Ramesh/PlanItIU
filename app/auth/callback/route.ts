import { createClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const error = requestUrl.searchParams.get('error')
  const errorDescription = requestUrl.searchParams.get('error_description')
  const next = requestUrl.searchParams.get('next') || '/'

  // Log environment info for debugging
  const isProduction = requestUrl.hostname !== 'localhost' && !requestUrl.hostname.includes('127.0.0.1')
  const expectedCallbackUrl = `${requestUrl.origin}/auth/callback`

  console.log('OAuth callback received:', {
    hasCode: !!code,
    hasError: !!error,
    error,
    errorDescription,
    fullUrl: requestUrl.toString(),
    origin: requestUrl.origin,
    hostname: requestUrl.hostname,
    isProduction,
    expectedCallbackUrl,
    allParams: Object.fromEntries(requestUrl.searchParams.entries())
  })

  // Warn if callback URL might not be configured in Supabase
  if (isProduction) {
    console.log('⚠️  Production callback detected. Make sure this URL is in Supabase Dashboard → Authentication → URL Configuration → Redirect URLs:')
    console.log('   ', expectedCallbackUrl)
  }

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
    
    // Try to get user directly which might work even if getSession doesn't
    const { data: { user: directUser }, error: userError } = await supabase.auth.getUser()
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    
    console.log('No code in callback - checking session and user:', {
      hasSession: !!session,
      hasUser: !!directUser,
      sessionError: sessionError?.message,
      userError: userError?.message,
      userId: session?.user?.id || directUser?.id,
    })
    
    // If we have either a session or a user, authentication worked
    if (session || directUser) {
      const userId = session?.user?.id || directUser?.id
      
      // Ensure profile exists for OAuth users
      if (userId) {
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('id')
          .eq('user_id', userId)
          .single()

        if (profileError || !profileData) {
          console.log('Profile not found, creating manually for OAuth user...')
          const user = session?.user || directUser
          const { error: insertError } = await supabase
            .from('profiles')
            .insert({
              id: userId,
              user_id: userId,
              email: user?.email || '',
              full_name: user?.user_metadata?.full_name || user?.email || '',
            })

          if (insertError) {
            console.error('Error creating profile:', insertError)
          } else {
            console.log('✅ Profile created for OAuth user')
          }
        }
      }
      
      console.log('✅ Authentication successful (session or user found) - redirecting to home')
      return NextResponse.redirect(new URL(next, requestUrl.origin))
    }
    
    // No code and no session/user - this is a configuration issue
    const referer = request.headers.get('referer')
    console.error('❌ OAuth callback called without code and no session/user exists')
    console.log('Request details:', {
      url: requestUrl.toString(),
      origin: requestUrl.origin,
      hostname: requestUrl.hostname,
      referer,
      isProduction,
      expectedCallbackUrl,
      allParams: Object.fromEntries(requestUrl.searchParams.entries()),
      cookies: request.headers.get('cookie') ? 'present' : 'missing',
      cookieNames: request.headers.get('cookie')?.split(';').map(c => c.split('=')[0].trim()) || []
    })
    
    // Check if referer is Google - this means Google Cloud Console is misconfigured
    if (referer?.includes('accounts.google.com')) {
      console.error('⚠️  Google is redirecting directly to callback - Google Cloud Console redirect URI is wrong!')
      console.error('   Expected: Supabase redirects to callback')
      console.error('   Actual: Google redirects directly to callback')
      console.error('   Fix: Update Google Cloud Console Authorized redirect URIs to ONLY include Supabase callback URL')
    }
    
    // Check if this might be a Supabase redirect URL configuration issue
    if (isProduction) {
      console.error('⚠️  Production callback issue detected!')
      console.error('   Make sure this URL is added to Supabase Dashboard:')
      console.error('   → Authentication → URL Configuration → Redirect URLs')
      console.error('   → Add:', expectedCallbackUrl)
    }
    
    // No code and no session - redirect to login
    const errorDetails = isProduction 
      ? 'oauth_error_production_config' 
      : 'google_redirect_misconfigured'
    return NextResponse.redirect(new URL(`/login?error=oauth_error&details=${errorDetails}`, requestUrl.origin))
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
      // Ensure profile exists (trigger should create it, but verify)
      const userId = data.session.user.id
      if (userId) {
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('id')
          .eq('user_id', userId)
          .single()

        if (profileError || !profileData) {
          // Profile doesn't exist, create it manually
          console.log('Profile not found for OAuth user, creating manually...')
          const { error: insertError } = await supabase
            .from('profiles')
            .insert({
              id: userId,
              user_id: userId,
              email: data.session.user.email || '',
              full_name: data.session.user.user_metadata?.full_name || data.session.user.email || '',
            })

          if (insertError) {
            console.error('Error creating profile for OAuth user:', insertError)
          } else {
            console.log('✅ Profile created for OAuth user')
          }
        }
      }
      
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

