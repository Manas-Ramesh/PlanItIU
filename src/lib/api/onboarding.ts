import type { OnboardingCompleteData } from '@/components/onboarding';

/**
 * Send onboarding completion data to the backend. Implement this to call your API.
 */
export async function saveOnboarding(_data: OnboardingCompleteData): Promise<void> {
  // Replace with backend call, e.g.:
  // await fetch('/api/onboarding', { method: 'POST', body: JSON.stringify(data) });
}
