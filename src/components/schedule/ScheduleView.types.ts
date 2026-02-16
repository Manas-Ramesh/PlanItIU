import type { Course, Schedule, UserProfile } from '@/lib/types';

export interface ScheduleViewProps {
  readonly currentSchedule: Schedule | null;
  readonly savedSchedules: ReadonlyArray<Schedule>;
  readonly userProfile: UserProfile | null;
  readonly onSaveSchedule: (name: string) => void;
  readonly onDeleteSchedule: (id: string) => void;
  readonly onFeedbackSubmit?: (courseId: string, feedback: unknown, surveyType: string) => void;
}
