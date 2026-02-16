import type { SemesterBlock, UserProfile } from '@/lib/types';

export interface DegreeOverall {
  readonly degreeName: string;
  readonly completedCredits: number;
  readonly totalCredits: number;
  readonly expectedGraduation: string;
}

export interface DegreeProgressViewProps {
  readonly semesters: ReadonlyArray<SemesterBlock>;
  readonly overall?: DegreeOverall | null;
  readonly userProfile: UserProfile | null;
  readonly onGradeChange?: (courseCode: string, grade: string) => void;
}
