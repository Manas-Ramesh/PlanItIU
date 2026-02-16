import type { StudyDocument, UserProfile } from '@/lib/types';

export interface StudyCourseMaterials {
  readonly courseCode: string;
  readonly courseName: string;
  readonly materials: ReadonlyArray<StudyDocument>;
}

export interface StudyPortalViewProps {
  readonly coursesByMonth: ReadonlyArray<{ readonly month: string; readonly courses: ReadonlyArray<StudyCourseMaterials> }>;
  readonly userProfile: UserProfile | null;
  readonly downloadCredits: number;
  readonly onUpload: (data: unknown) => void;
  readonly onDownload: (material: StudyDocument, course: StudyCourseMaterials) => void;
}
