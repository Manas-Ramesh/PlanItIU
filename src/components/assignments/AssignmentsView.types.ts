import type { AssignmentSubmission, UserProfile } from '@/lib/types';

export interface AssignmentsViewProps {
  readonly submissions: ReadonlyArray<AssignmentSubmission>;
  readonly userProfile: UserProfile | null;
  readonly onUpload: (assignmentFile: File | null, rubricFile: File | null) => void;
  readonly onFeedbackSubmit?: (submissionId: string, feedback: unknown) => void;
}
