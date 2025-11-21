import { createBrowserClient } from '@supabase/ssr'

// Lazy initialization to avoid build-time errors
let supabaseClient: ReturnType<typeof createBrowserClient> | null = null

export function getSupabase() {
  if (!supabaseClient) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    
    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Missing Supabase environment variables')
    }
    
    supabaseClient = createBrowserClient(supabaseUrl, supabaseAnonKey)
  }
  return supabaseClient
}

// For backward compatibility - only call this in client components at runtime
export const supabase = typeof window !== 'undefined' ? getSupabase() : ({} as ReturnType<typeof createBrowserClient>)

