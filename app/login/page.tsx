'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '@/lib/supabase'
import { getAuthCallbackUrl } from '@/lib/auth-helpers'
import Logo from '@/components/Logo'
import TermsAndPrivacy from '@/components/TermsAndPrivacy'
import TypingAnimation from '@/components/TypingAnimation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [showTerms, setShowTerms] = useState(false)

  useEffect(() => {
    // Check for OAuth error in URL query params
    const oauthError = searchParams.get('error')
    const errorDetails = searchParams.get('details')
    
    if (oauthError === 'oauth_error') {
      let errorMessage = 'Google sign-in failed. Please try again or use email/password to sign in.'
      
      if (errorDetails === 'google_redirect_misconfigured') {
        errorMessage = 'Google OAuth is misconfigured. The redirect URI in Google Cloud Console must point to Supabase, not your app. See OAUTH_FIX.md for instructions.'
      } else if (errorDetails) {
        errorMessage = `Google sign-in failed: ${errorDetails}`
      }
      
      setError(errorMessage)
      // Clean up the URL by removing the error parameters
      router.replace('/login', { scroll: false })
    }
  }, [searchParams, router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      if (data.user) {
        console.log('✅ Login successful, user:', data.user.id)
        console.log('Session data:', data.session)
        
        // Verify session is available before redirecting
        if (data.session) {
          // Wait for cookies to be set in browser
          await new Promise(resolve => setTimeout(resolve, 200))
          // Force a hard redirect to ensure server sees the cookies
          window.location.href = '/'
        } else {
          // Session might not be immediately available, wait and check again
          await new Promise(resolve => setTimeout(resolve, 500))
          const { data: { session: retrySession } } = await supabase.auth.getSession()
          if (retrySession) {
            console.log('Session available on retry, redirecting...')
            window.location.href = '/'
          } else {
            console.error('Session still not available after retry')
            setError('Session not available. Please try logging in again.')
          }
        }
      }
    } catch (error: any) {
      setError(error.message || 'An error occurred during login')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setError(null)
    try {
      // Get the callback URL (works for both localhost and Vercel)
      const callbackUrl = getAuthCallbackUrl()
      console.log('🔐 Using callback URL:', callbackUrl)
      
      // OAuth automatically creates new users if they don't exist, or logs in existing users
      // The database trigger will automatically create a profile with user_id for new users
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: callbackUrl,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      })

      if (error) {
        console.error('OAuth error:', error)
        throw error
      }
      
      // Log the redirect URL for debugging
      if (data?.url) {
        console.log('✅ OAuth redirect URL generated:', data.url)
        console.log('📍 Callback URL configured:', callbackUrl)
        // Supabase should redirect to this URL which goes to Google
        // The redirect_to parameter will be the callbackUrl (localhost or Vercel)
        // Make sure this URL is added to Supabase Dashboard → Authentication → URL Configuration
      } else {
        console.error('❌ No redirect URL returned from Supabase')
      }
    } catch (error: any) {
      console.error('Google login error:', error)
      setError(error.message || 'An error occurred during Google sign-in')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
            className="mx-auto mb-6 flex justify-center items-center"
          >
            <div className="bg-white rounded-full shadow-lg" style={{ width: '120px', height: '120px', padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Logo size="lg" variant="icon" />
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mb-4"
          >
            <TypingAnimation text="PlanItIU" className="text-white text-3xl font-bold" />
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-red-100 text-lg"
          >
            Find Your Perfect Classes
          </motion.p>
        </div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-2xl p-6 shadow-xl"
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center">
            Sign in with IU Credentials
          </h2>
          
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-md bg-red-50 p-4 mb-4"
            >
              <div className="text-sm text-red-800">{error}</div>
            </motion.div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label htmlFor="email" className="text-gray-700">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Your IU email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1"
                required
                autoComplete="email"
              />
            </div>
            
            <div>
              <Label htmlFor="password" className="text-gray-700">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Your IU password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1"
                required
                autoComplete="current-password"
              />
            </div>
            
            <Button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl"
              disabled={loading}
            >
              {loading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mx-auto"
                />
              ) : (
                'Sign In'
              )}
            </Button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">or</span>
            </div>
          </div>

          <div>
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full inline-flex items-center justify-center gap-3 py-3 px-4 border border-gray-300 rounded-xl shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Sign in with Google
            </button>
          </div>

          <div className="text-center mt-4">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link href="/signup" className="font-medium text-red-600 hover:text-red-700 underline">
                Sign up
              </Link>
            </p>
          </div>
          
          <p className="text-xs text-gray-500 text-center mt-6">
            By signing in, you agree to our{' '}
            <button
              onClick={(e) => {
                e.preventDefault()
                setShowTerms(true)
              }}
              className="text-red-600 hover:text-red-700 underline"
            >
              Terms of Service
            </button>
            {' '}and{' '}
            <button
              onClick={(e) => {
                e.preventDefault()
                setShowTerms(true)
              }}
              className="text-red-600 hover:text-red-700 underline"
            >
              Privacy Policy
            </button>
          </p>
        </motion.div>
      </motion.div>

      {/* Terms and Privacy Modal */}
      <AnimatePresence>
        {showTerms && (
          <TermsAndPrivacy onClose={() => setShowTerms(false)} />
        )}
      </AnimatePresence>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-600">Loading...</div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  )
}
