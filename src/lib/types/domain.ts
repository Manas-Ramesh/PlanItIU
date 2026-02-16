/**
 * Domain types for Planituni. All data is intended to be supplied by the backend.
 * No mock or sample data; use empty arrays / null when data is not yet loaded.
 */

/** Login payload: call backend with this; do not store or log. */
export interface LoginCredentials {
  readonly username: string;
  readonly password: string;
}

/** User profile (from auth/API). */
export interface UserProfile {
  readonly id: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly email: string;
  readonly studentId?: string;
  readonly major?: string;
  readonly majors?: ReadonlyArray<string>;
  readonly graduationYear?: string;
  readonly year?: string;
  readonly greekHouse?: string;
  readonly campus?: string;
  readonly isPremium?: boolean;
  readonly xp?: number;
  readonly level?: number;
  readonly careerInterests?: ReadonlyArray<string>;
}

/** Single course (schedule or catalog). */
export interface Course {
  readonly id: string;
  readonly code: string;
  readonly title: string;
  readonly credits: number;
  readonly professor?: string;
  readonly rating?: number;
  readonly avgGrade?: string;
  readonly time?: string;
  readonly location?: string;
  readonly status?: 'open' | 'closed' | 'justOpened';
  readonly attendance?: string;
  readonly difficulty?: number;
  readonly requirements?: ReadonlyArray<string>;
  readonly type?: 'critical' | 'required' | 'genEd';
  readonly genEdCategory?: string | null;
}

/** Schedule (current or saved). */
export interface Schedule {
  readonly id: string;
  readonly name: string;
  readonly courses: ReadonlyArray<Course>;
  readonly savedAt?: string;
}

/** Chat message (advisor). */
export interface ChatMessage {
  readonly id: string;
  readonly text: string;
  readonly sender: 'user' | 'ai';
  readonly timestamp: string;
}

/** Saved chat session (list item). */
export interface SavedChat {
  readonly id: string;
  readonly title: string;
  readonly timestamp: string;
}

/** Study document (test bank / practice). */
export interface StudyDocument {
  readonly id: string;
  readonly name: string;
  readonly size?: string;
  readonly date?: string;
  readonly type?: string;
  readonly pages?: number;
}

/** Course requirement for degree progress. */
export interface CourseRequirement {
  readonly name: string;
  readonly code?: string;
  readonly critical: boolean;
  readonly completed: boolean;
  readonly fulfilledBy?: string;
  readonly canBeFulfilledBy?: ReadonlyArray<string>;
  readonly creditsRequired?: number;
}

/** Semester block for degree progress. */
export interface SemesterBlock {
  readonly name: string;
  readonly percentage: number;
  readonly credits: string;
  readonly courses: ReadonlyArray<CourseRequirement>;
}

/** Assignment submission / pre-grade result. */
export interface AssignmentSubmission {
  readonly id: string;
  readonly courseCode: string;
  readonly courseName: string;
  readonly assignmentName: string;
  readonly submittedAt: string;
  readonly predictedGrade: number;
  readonly confidence: number;
  readonly feedback?: ReadonlyArray<FeedbackCategory>;
}

export interface FeedbackCategory {
  readonly category: string;
  readonly score: number;
  readonly maxScore: number;
  readonly comments: ReadonlyArray<string>;
  readonly suggestions: ReadonlyArray<string>;
}

/** Job posting (career). */
export interface JobPosting {
  readonly id: string;
  readonly company: string;
  readonly position: string;
  readonly location: string;
  readonly industry?: string;
  readonly type: 'Full-time' | 'Internship' | 'Part-time' | 'Co-op';
  readonly posted: string;
  readonly deadline?: string;
  readonly description?: string;
  readonly requirements?: ReadonlyArray<string>;
  readonly benefits?: ReadonlyArray<string>;
}

/** Network contact (career / alumni). */
export interface NetworkContact {
  readonly id: string;
  readonly name: string;
  readonly title: string;
  readonly company: string;
  readonly location?: string;
  readonly sector?: string;
  readonly graduationYear?: string;
  readonly major?: string;
  readonly linkedInUrl?: string;
  readonly email?: string;
}

/** Option list item for dropdowns (majors, schools, years, etc.). Backend provides. */
export interface OptionItem {
  readonly value: string;
  readonly label: string;
  readonly disabled?: boolean;
}
