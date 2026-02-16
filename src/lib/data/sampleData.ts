/**
 * Sample/mock data for UI design. Replace with API calls when backend is ready.
 * All exports are typed with domain interfaces for easy swap.
 */

import type {
  SavedChat,
  Course,
  SemesterBlock,
  CourseRequirement,
  JobPosting,
  NetworkContact,
  UserProfile,
  AssignmentSubmission,
  FeedbackCategory,
} from '@/lib/types';

export const SAMPLE_SAVED_CHATS: ReadonlyArray<SavedChat> = [
  { id: '1', title: 'Course recommendations for Fall 20', timestamp: '2 hours ago' },
  { id: '2', title: 'Degree audit questions', timestamp: 'Yesterday' },
  { id: '3', title: 'GenEd requirements help', timestamp: '3 days ago' },
];

export const SAMPLE_USER_DISPLAY_NAME = 'asdads asd';

export const SAMPLE_USER_PROFILE: UserProfile = {
  id: 'u1',
  firstName: 'Student',
  lastName: '',
  email: 'student@iu.edu',
  studentId: '123456789',
  campus: 'Bloomington',
  major: 'Computer Science',
  majors: ['Computer Science'],
  graduationYear: '2026',
  year: 'Junior',
  xp: 0,
  level: 1,
};

/** Courses for schedule / plan your classes (Figma 4:2956, 4:3739) */
export const SAMPLE_COURSES: ReadonlyArray<Course> = [
  {
    id: 'c1',
    code: 'CSCI-C 211',
    title: 'Introduction to Computer Science',
    credits: 4,
    professor: 'Dr. Sarah Johnson',
    rating: 4.5,
    avgGrade: 'A-',
    time: 'MW 10:00 AM - 11:15 AM',
    location: 'Lindley Hall 102',
    status: 'open',
    type: 'critical',
  },
  {
    id: 'c2',
    code: 'MATH-M 211',
    title: 'Calculus I',
    credits: 4,
    professor: 'Dr. Michael Chen',
    rating: 3.8,
    avgGrade: 'B+',
    time: 'TR 9:30 AM - 10:45 AM',
    location: 'Rawles Hall 100',
    status: 'closed',
    type: 'critical',
  },
  {
    id: 'c3',
    code: 'ENG-W 131',
    title: 'Elementary Composition',
    credits: 3,
    professor: 'Prof. Emily Roberts',
    rating: 4.3,
    avgGrade: 'A',
    time: 'MWF 1:00 PM - 1:50 PM',
    location: 'Ballantine Hall 308',
    status: 'open',
    type: 'required',
  },
  {
    id: 'c4',
    code: 'PSY-P 101',
    title: 'Intro to Psychology',
    credits: 3,
    professor: 'Dr. James Wilson',
    rating: 4.6,
    avgGrade: 'A',
    time: 'TR 2:00 PM - 3:15 PM',
    location: 'Psychology Building 101',
    status: 'justOpened',
    type: 'genEd',
  },
  {
    id: 'c5',
    code: 'BUS-A 100',
    title: 'Business Foundations',
    credits: 2,
    professor: 'Prof. Lisa Anderson',
    rating: 4,
    avgGrade: 'A-',
    time: 'F 10:00 AM - 11:50 AM',
    location: 'Kelley School 100',
    status: 'open',
    type: 'critical',
  },
];

/** Alternative time slots for CSCI-C 211 (Swap Course modal) */
export const SAMPLE_SWAP_SLOTS: ReadonlyArray<Course> = [
  {
    id: 's1',
    code: 'CSCI-C 211',
    title: 'Introduction to Computer Science',
    credits: 4,
    professor: 'Dr. Sarah Martinez',
    rating: 4.3,
    avgGrade: 'A-',
    time: 'MWF 9:00 AM - 9:50 AM',
    location: 'Lindley 205',
    status: 'open',
    type: 'critical',
  },
  {
    id: 's2',
    code: 'CSCI-C 211',
    title: 'Introduction to Computer Science',
    credits: 4,
    professor: 'Prof. James Anderson',
    rating: 4.1,
    avgGrade: 'B+',
    time: 'TR 11:00 AM - 12:15 PM',
    location: 'Lindley 310',
    status: 'open',
    type: 'critical',
  },
  {
    id: 's3',
    code: 'CSCI-C 211',
    title: 'Introduction to Computer Science',
    credits: 4,
    professor: 'Dr. Emily Davis',
    rating: 4.6,
    avgGrade: 'A',
    time: 'MW 2:00 PM - 3:15 PM',
    location: 'Lindley 101',
    status: 'justOpened',
    type: 'critical',
  },
];

/** Degree progress (Figma 4:4686) – Finance UG26 */
function makeCourseReq(
  name: string,
  opts: {
    code?: string;
    critical?: boolean;
    completed?: boolean;
    fulfilledBy?: string;
    canBeFulfilledBy?: ReadonlyArray<string>;
    credits?: number;
  }
): CourseRequirement {
  return {
    name,
    code: opts.code,
    critical: opts.critical ?? true,
    completed: opts.completed ?? false,
    fulfilledBy: opts.fulfilledBy,
    canBeFulfilledBy: opts.canBeFulfilledBy,
    creditsRequired: opts.credits ?? 3,
  };
}

export const SAMPLE_DEGREE_SEMESTERS: ReadonlyArray<SemesterBlock> = [
  {
    name: 'Year 1, Fall',
    percentage: 100,
    credits: '16.0 / 16.0 credits',
    courses: [
      makeCourseReq('English Composition', { fulfilledBy: 'ENG-W131', code: 'BUS-K104' }),
      makeCourseReq('Business Presentations', { fulfilledBy: 'BUS-C104', code: 'BUS-C104' }),
      makeCourseReq('Math for Business', { fulfilledBy: 'MATH-M118', code: 'MATH-M118' }),
      makeCourseReq('Introductory Accounting Principles and Analysis', { fulfilledBy: 'BUS-A100', code: 'BUS-A100' }),
    ],
  },
  {
    name: 'Year 1, Spring',
    percentage: 87.1,
    credits: '13.5 / 15.0 credits',
    courses: [
      makeCourseReq('Compass 1', { fulfilledBy: 'BUS-T175', credits: 1.5, code: 'BUS-T175' }),
      makeCourseReq('Foundations of Business Information Systems and Decision Making', { fulfilledBy: 'BUS-K201', code: 'BUS-K201' }),
      makeCourseReq('Fundamentals of Scan for Bus 1', { fulfilledBy: 'ECON-B251', code: 'ECON-B251' }),
    ],
  },
  {
    name: 'Year 2, Fall',
    percentage: 32.1,
    credits: '4.5 / 14.0 credits',
    courses: [
  makeCourseReq('Legal Environment of Business', { canBeFulfilledBy: ['BUS-L201', 'BUS-L203'], completed: false }),
  makeCourseReq('Compass 2', { fulfilledBy: 'BUS-T275', credits: 1.5, completed: false }),
  makeCourseReq('Technology and Business Analysis', { canBeFulfilledBy: ['BUS-J301', 'BUS-K304'], completed: false }),
      makeCourseReq('Financial Reporting and Analysis', { fulfilledBy: 'BUS-A201', completed: false }),
    ],
  },
  {
    name: 'Year 2, Spring',
    percentage: 36.4,
    credits: '6.0 / 16.5 credits',
    courses: [
      makeCourseReq('Business Writing', { fulfilledBy: 'BUS-C204', completed: false }),
      makeCourseReq('Management Accounting and Analysis', { fulfilledBy: 'BUS-A202', completed: false }),
      makeCourseReq('Statistics', { canBeFulfilledBy: ['ECON-E370', 'BOOM-B370', 'MATH-M285'], completed: false }),
      makeCourseReq('Business, Government, & Society', { fulfilledBy: 'BUS-G202', completed: false }),
    ],
  },
  {
    name: 'Year 3, Fall',
    percentage: 0,
    credits: '0.0 / 15.0 credits',
    courses: [
      makeCourseReq('Integrated Core (I-Core)', { canBeFulfilledBy: ['BUS-X375'], credits: 12, completed: false }),
      makeCourseReq('Supplemental Credits for Graduation', { credits: 3, critical: false, completed: false }),
    ],
  },
  {
    name: 'Year 3, Spring',
    percentage: 20,
    credits: '3.0 / 15.0 credits',
    courses: [
      makeCourseReq('Intermediate Investments', { fulfilledBy: 'BUS-F303', completed: false }),
      makeCourseReq('Intermediate Corporate Finance', { fulfilledBy: 'BUS-F305', completed: false }),
      makeCourseReq("Intermediate Financial Reporting and Analysis: A User's Perspective", { fulfilledBy: 'BUS-A320', critical: false, completed: false }),
    ],
  },
];

export const SAMPLE_DEGREE_OVERALL = {
  degreeName: 'Finance UG26',
  completedCredits: 46,
  totalCredits: 120,
  expectedGraduation: '2026',
};

/** Job postings (Figma 5:5838) */
export const SAMPLE_JOBS: ReadonlyArray<JobPosting> = [
  {
    id: 'j1',
    company: 'Planit',
    position: 'Software Engineer Intern',
    location: 'San Francisco, CA',
    type: 'Internship',
    posted: '2 days ago',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  },
  {
    id: 'j2',
    company: 'Tech Corp',
    position: 'Product Manager Intern',
    location: 'Remote',
    type: 'Internship',
    posted: '1 week ago',
  },
];

/** Application tracker rows (Figma 5:8278) */
export const SAMPLE_APPLICATIONS = [
  { company: 'Goldman Sachs', position: 'Investment Banking Analyst', location: 'New York, NY', salary: '$110k', deadline: '2/14/2026', contact: 'Sarah Chen', status: 'Applied' as const },
  { company: 'McKinsey & Company', position: 'Business Analyst', location: 'Chicago, IL', salary: '$105k', deadline: '1/31/2026', contact: 'Michael Zhang', status: 'Interview' as const },
  { company: 'Google', position: 'Product Manager Intern', location: 'Mountain View, CA', salary: '$9k/month', deadline: '-', contact: 'Jessica Wu', status: 'Offer' as const },
];

/** Network contacts for Swipe / My Network (Figma 5:9062, 5:9532) */
export const SAMPLE_CONTACTS: ReadonlyArray<NetworkContact> = [
  { id: 'n1', name: 'Timothy Johnson', title: 'Managing Director', company: 'Lincoln International', location: 'Chicago', sector: 'Indiana University' },
  { id: 'n2', name: 'Sarah Mitchell', title: 'Investment Banking Analyst', company: 'Goldman Sachs', location: 'New York', sector: 'Indiana University' },
  { id: 'n3', name: 'James Chen', title: 'Consultant', company: 'McKinsey & Company', location: 'Boston', sector: 'Indiana University' },
  { id: 'n4', name: 'Emily Rodriguez', title: 'Marketing Manager', company: 'Nike', location: 'Portland', sector: 'University of Michigan' },
  { id: 'n5', name: 'Michael Thompson', title: 'Investment Banking Analyst', company: 'Goldman Sachs', location: 'New York', sector: 'Indiana University' },
  { id: 'n6', name: 'Rachel Kim', title: 'Marketing Manager', company: 'Nike', location: 'Portland', sector: 'Indiana University' },
  { id: 'n7', name: 'David Martinez', title: 'Consultant', company: 'McKinsey & Company', location: 'Boston', sector: 'Indiana University' },
  { id: 'n8', name: 'Lisa Wang', title: 'UX Designer', company: 'Apple', location: 'Cupertino', sector: 'Indiana University' },
];

/** Outreach analytics (Figma 5:10125) */
export const SAMPLE_OUTREACH_METRICS = {
  totalEmailsSent: 6,
  responsesReceived: 0,
  responseRate: '0%',
  scheduleSendDrafts: 6,
  totalEmails: 6,
  convertedToChat: 0,
  conversionRate: '0%',
};

export const SAMPLE_FIRM_OUTREACH = [
  { firm: 'Google', location: 'Mountain View', emailsSent: 1, convertedToChat: null as number | null, responseRate: '0%', status: 'Pending' as const },
  { firm: 'Goldman Sachs', location: 'New York', emailsSent: 1, convertedToChat: null, responseRate: '0%', status: 'Pending' as const },
  { firm: 'McKinsey & Company', location: 'Chicago', emailsSent: 1, convertedToChat: null, responseRate: '0%', status: 'Pending' as const },
  { firm: 'Meta', location: 'Menlo Park', emailsSent: 1, convertedToChat: null, responseRate: '0%', status: 'Pending' as const },
  { firm: 'Amazon', location: 'Seattle', emailsSent: 1, convertedToChat: null, responseRate: '0%', status: 'Pending' as const },
  { firm: 'Apple', location: 'Cupertino', emailsSent: 1, convertedToChat: null, responseRate: '0%', status: 'Pending' as const },
];

/** Pre-grader result (Figma 4:2615) */
export const SAMPLE_FEEDBACK_CATEGORIES: ReadonlyArray<FeedbackCategory> = [
  { category: 'Content & Understanding', score: 20, maxScore: 30, comments: [], suggestions: [] },
  { category: 'Structure & Organization', score: 21, maxScore: 25, comments: [], suggestions: [] },
  { category: 'Visual Design & Formatting', score: 14, maxScore: 20, comments: [], suggestions: [] },
  { category: 'Quality & Polish', score: 21, maxScore: 25, comments: [], suggestions: [] },
];

export const SAMPLE_PREGRADE_RESULT: AssignmentSubmission = {
  id: 'pg1',
  courseCode: '',
  courseName: '',
  assignmentName: '',
  submittedAt: '',
  predictedGrade: 94,
  confidence: 98.2,
  feedback: SAMPLE_FEEDBACK_CATEGORIES,
};
