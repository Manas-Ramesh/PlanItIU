'use client';

import { useCallback } from 'react';
import { AssignmentsView } from '@/components/assignments';
import { SAMPLE_PREGRADE_RESULT } from '@/lib/data/sampleData';

export default function AssignmentsPage() {
  const handleUpload = useCallback(
    (_assignmentFile: File | null, _rubricFile: File | null) => {
      // Backend will handle upload and return submission
    },
    []
  );

  return (
    <AssignmentsView
      submissions={[SAMPLE_PREGRADE_RESULT]}
      userProfile={null}
      onUpload={handleUpload}
    />
  );
}
