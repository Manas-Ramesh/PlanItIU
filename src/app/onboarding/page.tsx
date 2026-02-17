'use client';

import { useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { OnboardingForm } from '@/components/onboarding';
import type { OnboardingCompleteData } from '@/components/onboarding';
import { saveOnboarding } from '@/lib/api/onboarding';

const CURRENT_YEAR = new Date().getFullYear();
const YEAR_COUNT = 7; // this year + 6 more

export default function OnboardingPage() {
  const router = useRouter();

  const graduationYearOptions = useMemo(
    () =>
      Array.from({ length: YEAR_COUNT }, (_, i) => {
        const year = String(CURRENT_YEAR + i);
        return { value: year, label: year };
      }),
    []
  );

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
      graduationYearOptions={graduationYearOptions}
      onComplete={handleComplete}
    />
  );
}
