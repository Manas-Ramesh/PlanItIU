import type { OptionItem } from '@/lib/types';

export interface OnboardingFormProps {
  readonly graduationYearOptions: ReadonlyArray<OptionItem>;
  readonly onComplete: (data: OnboardingCompleteData) => void;
}

/** One high school credit entry (subject, credits, optional grade). */
export interface HighSchoolCreditEntry {
  readonly subject: string;
  readonly credits: string;
  readonly grade: string;
}

/** Payload sent to backend when onboarding is complete. All fields from all steps. */
export interface OnboardingCompleteData {
  readonly firstName: string;
  readonly lastName: string;
  readonly major: string;
  readonly majors: ReadonlyArray<string>;
  readonly graduationYear: string;
  readonly careerInterests: string;
  readonly greekHouse: string;
  readonly courseworkMethod: 'manual' | 'highschool' | 'canvas' | null;
  readonly courses: ReadonlyArray<string>;
  readonly highSchoolCredits: ReadonlyArray<HighSchoolCreditEntry>;
  readonly canvasDomain?: string;
}
