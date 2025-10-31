import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase-server';

export default async function Home() {
  const supabase = await createClient();
  
  // Use getUser() instead of getSession() for security (as recommended by Supabase)
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  console.log('[app/page.tsx] User check:', {
    hasUser: !!user,
    userId: user?.id,
    userError: userError?.message,
  });

  // Check if user is authenticated
  if (!user || userError) {
    console.log('[app/page.tsx] No user authenticated, redirecting to /login');
    redirect('/login');
  }

  const currentUserId = user.id;

  // Check if onboarding is completed
  const { data: preferences, error: prefError } = await supabase
    .from('user_preferences')
    .select('onboarding_completed')
    .eq('user_id', currentUserId)
    .single();

  console.log('[app/page.tsx] Preferences check:', {
    hasPreferences: !!preferences,
    onboardingCompleted: preferences?.onboarding_completed,
    prefError: prefError?.message,
  });

  // If table doesn't exist or no preferences found, redirect to onboarding
  if (prefError || !preferences || !preferences.onboarding_completed) {
    console.log('[app/page.tsx] Onboarding not completed, redirecting to /onboarding/step1');
    redirect('/onboarding/step1');
  } else {
    console.log('[app/page.tsx] Onboarding completed, redirecting to /home');
    redirect('/home');
  }
}

