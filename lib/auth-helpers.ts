/**
 * Authentication helper functions
 * These functions handle redirect URLs for both local development and production
 */

/**
 * Get the callback URL for OAuth redirects
 * Works for both localhost (development) and Vercel (production)
 * 
 * @returns The full callback URL (e.g., http://localhost:3000/auth/callback or https://planitiu.vercel.app/auth/callback)
 */
export function getAuthCallbackUrl(): string {
  // Use window.location.origin for dynamic detection
  // This works for:
  // - Local development: http://localhost:3000
  // - Production: https://planitiu.vercel.app
  if (typeof window !== 'undefined') {
    return `${window.location.origin}/auth/callback`
  }
  
  // Fallback for server-side (shouldn't be used for OAuth redirects)
  // Check environment variable if available
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.VERCEL_URL
  if (siteUrl) {
    const protocol = siteUrl.startsWith('http') ? '' : 'https://'
    return `${protocol}${siteUrl}/auth/callback`
  }
  
  // Last resort fallback
  return 'http://localhost:3000/auth/callback'
}

/**
 * Get the base URL for the application
 * Useful for other redirects or API calls
 */
export function getBaseUrl(): string {
  if (typeof window !== 'undefined') {
    return window.location.origin
  }
  
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.VERCEL_URL
  if (siteUrl) {
    const protocol = siteUrl.startsWith('http') ? '' : 'https://'
    return `${protocol}${siteUrl}`
  }
  
  return 'http://localhost:3000'
}

