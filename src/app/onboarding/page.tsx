'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { OnboardingForm } from '@/components/onboarding';
import type { OnboardingCompleteData } from '@/components/onboarding';
import { saveOnboarding } from '@/lib/api/onboarding';

export default function OnboardingPage() {
  const router = useRouter();

  const handleComplete = useCallback(
    (data: OnboardingCompleteData) => {
      saveOnboarding(data).then(() => {
        router.push('/dashboard');
      });
    },
    [router]
  );

  return (
    <OnboardingForm
      graduationYearOptions={[]}
      schoolOptions={[]}
      onComplete={handleComplete}
    />
  );
}
