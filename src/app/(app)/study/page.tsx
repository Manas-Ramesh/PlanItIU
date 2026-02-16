'use client';

import { useState, useCallback } from 'react';
import { StudyPortalView } from '@/components/study';
import type { StudyDocument } from '@/lib/types';
import type { StudyCourseMaterials } from '@/components/study';

export default function StudyPage() {
  const [downloadCredits, setDownloadCredits] = useState(0);

  const handleUpload = useCallback((_data: unknown) => {
    setDownloadCredits((c) => c + 3);
  }, []);

  const handleDownload = useCallback(
    (_material: StudyDocument, _course: StudyCourseMaterials) => {
      if (downloadCredits > 0) setDownloadCredits((c) => c - 1);
    },
    [downloadCredits]
  );

  return (
    <StudyPortalView
      coursesByMonth={[]}
      userProfile={null}
      downloadCredits={downloadCredits}
      onUpload={handleUpload}
      onDownload={handleDownload}
    />
  );
}
