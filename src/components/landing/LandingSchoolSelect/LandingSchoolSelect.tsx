'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Select } from '@/components/ui/Select';
import type { LandingSchoolSelectProps as Props } from './LandingSchoolSelect.types';

const LOGIN_SCHOOL_ID = 'iu';

export function LandingSchoolSelect({
  options,
  selectId = 'school-select',
  label,
  placeholder,
}: Props) {
  const router = useRouter();

  const handleChange = useCallback(
    (value: string) => {
      if (value === LOGIN_SCHOOL_ID) {
        router.push('/login');
      }
    },
    [router]
  );

  return (
    <Select
      id={selectId}
      label={label}
      placeholder={placeholder}
      options={options}
      onChange={handleChange}
      variant="landing"
      hideLabel
    />
  );
}
