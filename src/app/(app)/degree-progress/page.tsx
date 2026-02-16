'use client';

import { DegreeProgressView } from '@/components/degree-progress';
import { SAMPLE_DEGREE_SEMESTERS, SAMPLE_DEGREE_OVERALL } from '@/lib/data/sampleData';

export default function DegreeProgressPage() {
  return (
    <DegreeProgressView
      semesters={SAMPLE_DEGREE_SEMESTERS}
      overall={SAMPLE_DEGREE_OVERALL}
      userProfile={null}
    />
  );
}
