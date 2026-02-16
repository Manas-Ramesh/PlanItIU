'use client';

import { useState, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { Button, Input, Label, Select, Textarea } from '@/components/ui';
import type {
  OnboardingFormProps,
  OnboardingCompleteData,
  HighSchoolCreditEntry,
} from './OnboardingForm.types';
import { getOptionsWithSample } from '@/lib/utils/selectOptions';
import { cn } from '@/lib/utils/cn';

const TOTAL_STEPS = 3;

const SAMPLE_GRADUATION_YEAR = { value: '2026', label: '2026' } as const;

function BackArrowIcon({ className }: { readonly className?: string }) {
  return (
    <svg
      className={className}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M19 12H5M12 19l-7-7 7-7" />
    </svg>
  );
}

function PlanitUniLogoIcon({ className }: { readonly className?: string }) {
  return (
    <svg
      className={className}
      width="48"
      height="48"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M12 14l9-5-9-5-9 5 9 5z" />
      <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
    </svg>
  );
}

function PlusCircleIcon({ className }: { readonly className?: string }) {
  return (
    <svg
      className={className}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 8v8M8 12h8" />
    </svg>
  );
}

function BookIcon({ className }: { readonly className?: string }) {
  return (
    <svg
      className={className}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      <path d="M8 7h8M8 11h8" />
    </svg>
  );
}

function ScanIcon({ className }: { readonly className?: string }) {
  return (
    <svg
      className={className}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M8 3H6a2 2 0 0 0-2 2v2" />
      <path d="M16 3h2a2 2 0 0 1 2 2v2" />
      <path d="M21 8v8a2 2 0 0 1-2 2h-2" />
      <path d="M3 16v2a2 2 0 0 0 2 2h2" />
      <path d="M3 8h18v8H3z" />
    </svg>
  );
}

function CameraIcon({ className }: { readonly className?: string }) {
  return (
    <svg
      className={className}
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
      <circle cx="12" cy="13" r="3" />
    </svg>
  );
}

export function OnboardingForm({
  graduationYearOptions,
  schoolOptions = [],
  onComplete,
}: OnboardingFormProps) {
  const [step, setStep] = useState(1);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [major, setMajor] = useState('');
  const [graduationYear, setGraduationYear] = useState('');
  const [careerInterests, setCareerInterests] = useState('');
  const [courseworkMethod, setCourseworkMethod] = useState<'manual' | 'highschool' | null>(null);
  const [school, setSchool] = useState('');
  const [greekHouse, setGreekHouse] = useState('');
  const [courses, setCourses] = useState<ReadonlyArray<string>>([]);
  const [highSchoolCredits, setHighSchoolCredits] = useState<ReadonlyArray<HighSchoolCreditEntry>>([]);
  const [newCreditSubject, setNewCreditSubject] = useState('');
  const [newCreditCredits, setNewCreditCredits] = useState('');
  const [newCreditGrade, setNewCreditGrade] = useState('');

  const handleFirstNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setFirstName(e.target.value);
  }, []);
  const handleLastNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setLastName(e.target.value);
  }, []);
  const handleMajorChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setMajor(e.target.value);
  }, []);
  const handleGraduationYearChange = useCallback(
    (value: string, _option: { value: string; label: string }) => {
      setGraduationYear(value);
    },
    []
  );
  const handleCareerInterestsChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCareerInterests(e.target.value);
  }, []);
  const handleSchoolChange = useCallback((value: string) => {
    setSchool(value);
  }, []);
  const handleGreekHouseChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setGreekHouse(e.target.value);
  }, []);

  const setCourseworkManual = useCallback(() => setCourseworkMethod('manual'), []);
  const setCourseworkHighSchool = useCallback(() => setCourseworkMethod('highschool'), []);
  const handleBack = useCallback(() => setStep((s) => s - 1), []);

  const handleNext = useCallback(() => {
    if (step < TOTAL_STEPS) {
      setStep((s) => s + 1);
    }
  }, [step]);

  const handleAddCredit = useCallback(() => {
    const subject = newCreditSubject.trim();
    const credits = newCreditCredits.trim();
    if (!subject || !credits) return;
    setHighSchoolCredits((prev) => [
      ...prev,
      { subject, credits, grade: newCreditGrade.trim() },
    ]);
    setNewCreditSubject('');
    setNewCreditCredits('');
    setNewCreditGrade('');
  }, [newCreditSubject, newCreditCredits, newCreditGrade]);

  const handleFinish = useCallback(() => {
    const data: OnboardingCompleteData = {
      firstName,
      lastName,
      email,
      major,
      majors: major ? [major] : [],
      graduationYear,
      careerInterests,
      school,
      greekHouse,
      courseworkMethod,
      courses,
      highSchoolCredits,
    };
    onComplete(data);
  }, [
    firstName,
    lastName,
    email,
    major,
    graduationYear,
    careerInterests,
    school,
    greekHouse,
    courseworkMethod,
    courses,
    highSchoolCredits,
    onComplete,
  ]);

  const graduationYearOptionsWithFallback = useMemo(
    () => getOptionsWithSample(graduationYearOptions, SAMPLE_GRADUATION_YEAR),
    [graduationYearOptions]
  );

  const canProceedStep1 =
    firstName.trim() !== '' && lastName.trim() !== '' && graduationYear !== '';
  const canProceedStep2 = courseworkMethod !== null;
  const isLastStep = step === TOTAL_STEPS;
  const showNext = !isLastStep;
  const showFinish = isLastStep;

  const step2And3BackButton = step > 1 ? (
    <button
      type="button"
      onClick={handleBack}
      className="flex items-center gap-2 text-text-primary hover:text-text-secondary transition shrink-0"
      aria-label="Back to previous step"
    >
      <BackArrowIcon className="size-6" />
    </button>
  ) : null;

  const progressBar = (
    <div className="flex flex-col gap-1 flex-1 min-w-0" role="tablist" aria-label="Onboarding steps">
      <div className="flex gap-1">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className={cn(
              'h-1 flex-1 rounded-full',
              step >= i ? 'bg-[var(--color-nav-active)]' : 'bg-elevated'
            )}
            aria-hidden
          />
        ))}
      </div>
      <p className="text-sm text-text-muted text-center">
        Step {step} of {TOTAL_STEPS}
      </p>
    </div>
  );

  const headerLogo = (
    <header className="flex flex-col items-center gap-2 text-center">
      <Link
        href="/"
        className="flex flex-col items-center gap-2 text-text-primary no-underline hover:text-text-primary"
        aria-label="PlanitUni home"
      >
        <span className="flex size-12 items-center justify-center rounded-full bg-elevated text-text-primary">
          <PlanitUniLogoIcon className="size-8" />
        </span>
        <span className="text-xl font-semibold">PlanitUni</span>
      </Link>
    </header>
  );

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main
        id="main-content"
        className="flex-1 flex flex-col items-center p-6"
        aria-label="Onboarding"
      >
        <div className="w-full max-w-lg flex flex-col gap-6">
          {/* Top: back (step 2+ only) + progress */}
          <div className={cn('flex gap-2', step > 1 ? 'items-center' : 'flex-col')}>
            {step > 1 && step2And3BackButton}
            {progressBar}
          </div>

          {/* Step 1: Tell us about yourself */}
          {step === 1 && (
            <>
              {headerLogo}
              <h1 className="text-2xl font-semibold text-text-primary text-center">
                Welcome to Planitiu, Tell us about yourself!
              </h1>
              <p className="text-sm text-text-secondary text-center -mt-2">
                Help us personalize your course recommendations
              </p>
              <section className="flex flex-col gap-4" aria-label="Your details">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="onboarding-first-name">First Name</Label>
                    <Input
                      id="onboarding-first-name"
                      type="text"
                      placeholder="First name"
                      value={firstName}
                      onChange={handleFirstNameChange}
                      required
                      aria-required
                    />
                  </div>
                  <div>
                    <Label htmlFor="onboarding-last-name">Last Name</Label>
                    <Input
                      id="onboarding-last-name"
                      type="text"
                      placeholder="Last name"
                      value={lastName}
                      onChange={handleLastNameChange}
                      required
                      aria-required
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="onboarding-major">Major(s)</Label>
                  <Input
                    id="onboarding-major"
                    type="text"
                    placeholder="Type your major..."
                    value={major}
                    onChange={handleMajorChange}
                  />
                </div>
                <div>
                  <Select
                    id="onboarding-graduation-year"
                    label="Expected Graduation Year"
                    options={graduationYearOptionsWithFallback}
                    value={graduationYear}
                    onChange={handleGraduationYearChange}
                    placeholder="Select graduation year"
                  />
                </div>
                <div>
                  <Label htmlFor="onboarding-career">Career Interests (Optional)</Label>
                  <Textarea
                    id="onboarding-career"
                    placeholder="Type your career interests..."
                    value={careerInterests}
                    onChange={handleCareerInterestsChange}
                    rows={3}
                    aria-required={false}
                  />
                </div>
              </section>
            </>
          )}

          {/* Step 2: Previous Coursework – option cards */}
          {step === 2 && (
            <>
              {headerLogo}
              <h1 className="text-2xl font-semibold text-text-primary text-center">
                Previous Coursework
              </h1>
              <p className="text-sm text-text-secondary text-center -mt-2">
                How would you like to add your completed courses?
              </p>
              <section className="flex flex-col gap-4" aria-label="Coursework method">
                <button
                  type="button"
                  onClick={setCourseworkManual}
                  className={cn(
                    'flex items-center gap-4 w-full rounded-xl border-2 p-4 text-left transition',
                    'bg-surface border-border-subtle hover:border-border-strong',
                    courseworkMethod === 'manual' && 'border-[var(--color-nav-active)]'
                  )}
                  aria-pressed={courseworkMethod === 'manual'}
                  aria-label="Manual Entry – type in your courses one by one"
                >
                  <span
                    className={cn(
                      'flex size-12 shrink-0 items-center justify-center rounded-full text-white',
                      'bg-[var(--color-nav-active)]'
                    )}
                    aria-hidden
                  >
                    <PlusCircleIcon className="size-6" />
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-text-primary">Manual Entry</p>
                    <p className="text-sm text-text-secondary">
                      Type in your courses one by one
                    </p>
                  </div>
                  {courseworkMethod === 'manual' && (
                    <span
                      className="size-3 shrink-0 rounded-full bg-[var(--color-nav-active)]"
                      aria-hidden
                    />
                  )}
                </button>
                <button
                  type="button"
                  onClick={setCourseworkHighSchool}
                  className={cn(
                    'flex items-center gap-4 w-full rounded-xl border-2 p-4 text-left transition',
                    'bg-surface border-border-subtle hover:border-border-strong',
                    courseworkMethod === 'highschool' && 'border-[var(--color-nav-active)]'
                  )}
                  aria-pressed={courseworkMethod === 'highschool'}
                  aria-label="High School Credits – add AP, IB, dual enrollment, or other credits"
                >
                  <span
                    className={cn(
                      'flex size-12 shrink-0 items-center justify-center rounded-lg text-white',
                      'bg-[var(--color-feature-green)]'
                    )}
                    aria-hidden
                  >
                    <BookIcon className="size-6" />
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-text-primary">High School Credits</p>
                    <p className="text-sm text-text-secondary">
                      Add AP, IB, dual enrollment, or other credits
                    </p>
                  </div>
                  {courseworkMethod === 'highschool' && (
                    <span
                      className="size-3 shrink-0 rounded-full bg-[var(--color-nav-active)]"
                      aria-hidden
                    />
                  )}
                </button>
              </section>
            </>
          )}

          {/* Step 3: Conditional – Manual (Add Your Courses) or High School (Add Credit) + Greek House */}
          {step === 3 && (
            <>
              {courseworkMethod === 'manual' && (
                <section className="flex flex-col gap-6" aria-label="Add your courses">
                  <header>
                    <h1 className="text-2xl font-semibold text-text-primary">
                      Add Your Courses
                    </h1>
                    <p className="mt-1 text-sm text-text-secondary">
                      Add any courses you&apos;ve completed to help us recommend better options.
                    </p>
                  </header>
                  <div
                    className={cn(
                      'rounded-xl border border-border-subtle bg-surface p-4 flex flex-col gap-4'
                    )}
                  >
                    <div className="flex items-start gap-4">
                      <span
                        className="flex size-10 shrink-0 items-center justify-center rounded-lg text-white bg-[var(--color-nav-active)]"
                        aria-hidden
                      >
                        <ScanIcon className="size-5" />
                      </span>
                      <div className="flex-1 min-w-0">
                        <h2 className="font-semibold text-text-primary">
                          Scan Your Transcript
                        </h2>
                        <p className="text-sm text-text-secondary mt-1">
                          Take a screenshot of your transcript and upload it. Our AI will
                          automatically extract your completed courses.
                        </p>
                        <Button
                          type="button"
                          className={cn(
                            'mt-4 gap-2 text-white',
                            'bg-[var(--color-nav-active)] hover:opacity-90',
                            'focus:ring-2 focus:ring-[var(--color-nav-active)] focus:ring-offset-2 focus:ring-offset-background'
                          )}
                          aria-label="Upload transcript screenshot"
                        >
                          <CameraIcon className="size-5" />
                          Upload Transcript Screenshot
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="onboarding-courses">Completed Courses</Label>
                    <Input
                      id="onboarding-courses"
                      type="text"
                      placeholder="Type a course name or code..."
                      value={courses[0] ?? ''}
                      onChange={(e) =>
                        setCourses(e.target.value ? [e.target.value] : [])
                      }
                      aria-required={false}
                    />
                    <p className="mt-1 text-xs text-text-muted">
                      You can skip this step if you prefer, but adding courses helps us make
                      better recommendations.
                    </p>
                  </div>
                  <div className="border-t border-border-subtle pt-6">
                    <Label htmlFor="onboarding-greek-house-manual">Greek House (Optional)</Label>
                    <Input
                      id="onboarding-greek-house-manual"
                      type="text"
                      placeholder="Type your Greek house..."
                      value={greekHouse}
                      onChange={handleGreekHouseChange}
                      aria-required={false}
                    />
                    <p className="mt-1 text-xs text-text-muted">
                      Join the Greek house leaderboard and earn XP for your house!
                    </p>
                  </div>
                </section>
              )}

              {courseworkMethod === 'highschool' && (
                <section className="flex flex-col gap-6" aria-label="High school credits">
                  <header>
                    <h1 className="text-2xl font-semibold text-text-primary">
                      High School Credits
                    </h1>
                    <p className="mt-1 text-sm text-text-secondary">
                      Add any college credits you earned in high school.
                    </p>
                  </header>
                  <div
                    className={cn(
                      'rounded-xl border border-border-subtle bg-surface p-4 flex flex-col gap-4'
                    )}
                  >
                    <h2 className="font-semibold text-text-primary">Add Credit</h2>
                    <div>
                      <Label htmlFor="onboarding-credit-subject">Subject/Course</Label>
                      <Input
                        id="onboarding-credit-subject"
                        type="text"
                        placeholder="e.g., AP Calculus, IB Biology, Dual Enrollment"
                        value={newCreditSubject}
                        onChange={(e) => setNewCreditSubject(e.target.value)}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="onboarding-credit-credits">Credits</Label>
                        <Input
                          id="onboarding-credit-credits"
                          type="text"
                          placeholder="3"
                          value={newCreditCredits}
                          onChange={(e) => setNewCreditCredits(e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="onboarding-credit-grade">Grade (Optional)</Label>
                        <Input
                          id="onboarding-credit-grade"
                          type="text"
                          placeholder="A, B+, 4, 5"
                          value={newCreditGrade}
                          onChange={(e) => setNewCreditGrade(e.target.value)}
                          aria-required={false}
                        />
                      </div>
                    </div>
                    <Button
                      type="button"
                      fullWidth
                      onClick={handleAddCredit}
                      className={cn(
                        'gap-2 text-white bg-[var(--color-nav-active)] hover:opacity-90',
                        'focus:ring-2 focus:ring-[var(--color-nav-active)] focus:ring-offset-2 focus:ring-offset-background'
                      )}
                    >
                      <PlusCircleIcon className="size-5" />
                      + Add Credit
                    </Button>
                  </div>
                  <p className="text-sm text-text-secondary">
                    Adding high school credits helps us understand your academic background
                    and avoid recommending courses you may have already covered.
                  </p>
                </section>
              )}

              {/* Greek House (Optional) – high school path only (manual has it in-section) */}
              {courseworkMethod === 'highschool' && (
                <div className="flex flex-col gap-1 border-t border-border-subtle pt-6">
                  <Label htmlFor="onboarding-greek-house-hs">Greek House (Optional)</Label>
                  <Input
                    id="onboarding-greek-house-hs"
                    type="text"
                    placeholder="Type your Greek house..."
                    value={greekHouse}
                    onChange={handleGreekHouseChange}
                    aria-required={false}
                  />
                  <p className="text-xs text-text-muted">
                    Join the Greek house leaderboard and earn XP for your house!
                  </p>
                </div>
              )}
            </>
          )}

          {/* Footer: single full-width Next or Continue (Figma) */}
          <footer
            className="mt-auto pt-6 border-t border-border-subtle"
            role="navigation"
            aria-label="Onboarding actions"
          >
            {showNext && (
              <Button
                type="button"
                fullWidth
                onClick={handleNext}
                disabled={(step === 1 && !canProceedStep1) || (step === 2 && !canProceedStep2)}
                className={step === 2 ? 'bg-[var(--color-nav-active)] hover:opacity-90 focus:ring-[var(--color-nav-active)]' : undefined}
              >
                Next
              </Button>
            )}
            {showFinish && (
              <Button
                type="button"
                fullWidth
                onClick={handleFinish}
                className="bg-[var(--color-nav-active)] hover:opacity-90 focus:ring-[var(--color-nav-active)]"
              >
                Continue
              </Button>
            )}
          </footer>
        </div>
      </main>
    </div>
  );
}
