'use client';

// import css global
// import '';

import { useState, useCallback, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Button, Input, Label, Select, Textarea } from '@/components/ui';
import type {
  OnboardingFormProps,
  OnboardingCompleteData,
  HighSchoolCreditEntry,
} from './OnboardingForm.types';
import { getOptionsWithSample } from '@/lib/utils/selectOptions';
import { cn } from '@/lib/utils/cn';
import { useCanvasExtension } from '@/hooks/useCanvasExtension';

const TOTAL_STEPS = 3;

const SAMPLE_GRADUATION_YEAR = { value: '2026', label: '2026' } as const;

/* ── Inline SVG icons ── */

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

/* ── Shared input styling ── */

const inputStyles = cn(
  'mt-1.5 rounded-xl border-[var(--color-border-subtle)]/40 bg-[var(--color-bg-elevated)]/50',
  'px-4 py-3 text-sm',
  'placeholder:text-[var(--color-text-muted)]/50',
  'focus:border-[var(--color-brand-primary)]/40 focus:ring-[var(--color-brand-primary)]/30'
);

/* ── Shared card base for Step 2 method cards ── */

const methodCardBase = cn(
  'flex items-center gap-4 w-full rounded-2xl p-5 text-left transition-all duration-300',
  'bg-[var(--color-bg-elevated)]/40 border hover:bg-[var(--color-bg-elevated)]/60'
);

/* ── Component ── */

export function OnboardingForm({
  graduationYearOptions,
  onComplete,
}: OnboardingFormProps) {
  const [step, setStep] = useState(1);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [major, setMajor] = useState('');
  const [graduationYear, setGraduationYear] = useState('');
  const [careerInterests, setCareerInterests] = useState('');
  const [courseworkMethod, setCourseworkMethod] = useState<'manual' | 'highschool' | 'canvas' | null>(null);
  const canvas = useCanvasExtension();
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
  const handleGreekHouseChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setGreekHouse(e.target.value);
  }, []);

  const setCourseworkManual = useCallback(() => setCourseworkMethod('manual'), []);
  const setCourseworkHighSchool = useCallback(() => setCourseworkMethod('highschool'), []);
  // Auto-select canvas when extension becomes connected
  useEffect(() => {
    if (canvas.extensionInstalled && canvas.connected) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCourseworkMethod('canvas');
    }
  }, [canvas.extensionInstalled, canvas.connected]);
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
      major,
      majors: major ? [major] : [],
      graduationYear,
      careerInterests,
      greekHouse,
      courseworkMethod,
      courses,
      highSchoolCredits,
    };
    onComplete(data);
  }, [
    firstName,
    lastName,
    major,
    graduationYear,
    careerInterests,
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

  return (
    <div className="h-screen flex flex-col bg-[var(--color-bg-base)] relative overflow-auto">

      <main
        id="main-content"
        className="relative z-10 flex-1 flex flex-col items-center px-6 py-10"
        aria-label="Onboarding"
      >
        <div className="w-full max-w-lg flex flex-col gap-8">
          {/* ── Header: brand + progress ── */}
          <div className="flex flex-col gap-6">
            {/* Back + brand row */}
            <div className="flex items-center gap-3">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={handleBack}
                  className={cn(
                    'flex items-center justify-center w-9 h-9 rounded-xl',
                    'bg-[var(--color-bg-elevated)]/50 border border-[var(--color-border-subtle)]/30',
                    'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:border-[var(--color-border-subtle)]/50 transition-all'
                  )}
                  aria-label="Back to previous step"
                >
                  <BackArrowIcon className="size-4" />
                </button>
              ) : null}

              <Link
                href="/"
                className="flex items-center gap-2.5"
                aria-label="PlanitUni home"
              >
                <div className="w-8 h-8 rounded-lg bg-[var(--color-brand-primary)]/10 border border-[var(--color-brand-primary)]/20 flex items-center justify-center">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-[var(--color-brand-primary)]" aria-hidden>
                    <path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z" />
                  </svg>
                </div>
                <span className="font-display text-lg text-[var(--color-text-primary)]">PlanitUni</span>
              </Link>

              {/* Spacer + step indicator */}
              <div className="ml-auto">
                <span className="text-xs text-[var(--color-text-muted)]/60 tabular-nums">
                  {step}/{TOTAL_STEPS}
                </span>
              </div>
            </div>

            {/* Progress bar */}
            <div className="relative h-1 rounded-full bg-[var(--color-bg-elevated)]" role="tablist" aria-label="Onboarding steps">
              {/* Grey track */}
              <div className="absolute inset-0 rounded-full bg-[var(--color-border-subtle)]/30" aria-hidden />
              {/* Active fill */}
              <div
                className="absolute inset-y-0 left-0 rounded-full bg-[var(--color-brand-primary)] shadow-[0_0_10px_var(--color-brand-glow)] transition-all duration-500 ease-out"
                style={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
                aria-hidden
              />
            </div>
          </div>

          {/* ── Step 1: Tell us about yourself ── */}
          {step === 1 && (
            <div className="relative z-10 animate-fade-in-up flex flex-col gap-6">
              <div>
                <h1 className="font-display text-3xl text-[var(--color-text-primary)] mb-2">
                  Tell us about <em className="text-[var(--color-brand-primary)] not-italic">yourself</em>
                </h1>
                <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
                  Help us personalize your course recommendations
                </p>
              </div>

              <section className="flex flex-col gap-5" aria-label="Your details">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="onboarding-first-name" className="text-[var(--color-text-secondary)] text-sm font-medium">
                      First Name
                    </Label>
                    <Input
                      id="onboarding-first-name"
                      type="text"
                      placeholder="First name"
                      value={firstName}
                      onChange={handleFirstNameChange}
                      required
                      aria-required
                      className={inputStyles}
                    />
                  </div>
                  <div>
                    <Label htmlFor="onboarding-last-name" className="text-[var(--color-text-secondary)] text-sm font-medium">
                      Last Name
                    </Label>
                    <Input
                      id="onboarding-last-name"
                      type="text"
                      placeholder="Last name"
                      value={lastName}
                      onChange={handleLastNameChange}
                      required
                      aria-required
                      className={inputStyles}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="onboarding-major" className="text-[var(--color-text-secondary)] text-sm font-medium">
                    Major(s)
                  </Label>
                  <Input
                    id="onboarding-major"
                    type="text"
                    placeholder="Type your major..."
                    value={major}
                    onChange={handleMajorChange}
                    className={inputStyles}
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
                    className=""
                  />
                </div>

                <div>
                  <Label htmlFor="onboarding-career" className="text-[var(--color-text-secondary)] text-sm font-medium">
                    Career Interests <span className="text-[var(--color-text-muted)]/50 font-normal">(Optional)</span>
                  </Label>
                  <Textarea
                    id="onboarding-career"
                    placeholder="Type your career interests..."
                    value={careerInterests}
                    onChange={handleCareerInterestsChange}
                    rows={3}
                    aria-required={false}
                    className={cn(
                      'min-h-[120px]',

                      inputStyles
                    )}
                  />
                </div>
              </section>
            </div>
          )}

          {/* ── Step 2: Previous Coursework ── */}
          {step === 2 && (
            <div className="animate-fade-in-up flex flex-col gap-6">
              <div>
                <h1 className="font-display text-3xl text-[var(--color-text-primary)] mb-2">
                  Previous <em className="text-[var(--color-brand-primary)] not-italic">Coursework</em>
                </h1>
                <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
                  How would you like to add your completed courses?
                </p>
              </div>

              <section className="flex flex-col gap-3" aria-label="Coursework method">

                {/* ─ Canvas Import card (always visible) ─ */}
                <div
                  className={cn(
                    'w-full rounded-2xl p-5 text-left transition-all duration-300',
                    'bg-[var(--color-bg-elevated)]/40 border',
                    canvas.connected
                      ? 'border-[var(--color-canvas-red)]/40 shadow-[0_0_20px_rgba(225,63,43,0.15)]'
                      : 'border-[var(--color-border-subtle)]/30'
                  )}
                >
                  {/* Header row */}
                  <div className="flex items-center gap-4">
                    <span
                      className={cn(
                        'flex size-12 shrink-0 items-center justify-center rounded-xl transition-colors',
                        canvas.connected
                          ? 'bg-[var(--color-canvas-red)]/15 text-[var(--color-canvas-red)]'
                          : 'bg-[var(--color-canvas-red)]/8 text-[var(--color-canvas-red)]/60'
                      )}
                      aria-hidden
                    >
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                        <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                        <path d="M8 21h8M12 17v4" />
                      </svg>
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-[var(--color-text-primary)] text-sm">Canvas Import</p>
                        {canvas.connected && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-medium uppercase tracking-wider px-1.5 py-0.5 rounded-full border border-[var(--color-canvas-red)]/20 bg-[var(--color-canvas-red)]/5 text-[var(--color-canvas-red)]">
                            <span className="w-1 h-1 rounded-full bg-[var(--color-canvas-red)]" aria-hidden />
                            Synced
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-[var(--color-text-muted)] mt-0.5">
                        Automatically import courses from Canvas LMS
                      </p>
                    </div>
                    {canvas.connected && (
                      <span
                        className="size-2.5 shrink-0 rounded-full bg-[var(--color-canvas-red)] shadow-[0_0_8px_rgba(225,63,43,0.5)]"
                        aria-hidden
                      />
                    )}
                  </div>

                  {/* State-specific content below the header */}
                  {canvas.loading ? (
                    /* Detecting extension */
                    <div className="mt-4 flex items-center gap-2 text-sm text-[var(--color-text-muted)]">
                      <svg className="animate-spin size-4 text-[var(--color-canvas-red)]/60" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                      </svg>
                      Checking for Canvas Connect extension...
                    </div>
                  ) : !canvas.extensionInstalled ? (
                    /* No extension: install prompt */
                    <div className="mt-4 rounded-xl bg-[var(--color-bg-elevated)]/60 border border-[var(--color-border-subtle)]/20 p-4">
                      <div className="flex items-start gap-3">
                        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[var(--color-canvas-red)]/10 text-[var(--color-canvas-red)] mt-0.5" aria-hidden>
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                            <path d="M7 10l5 5 5-5" />
                            <path d="M12 15V3" />
                          </svg>
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-[var(--color-text-primary)]">
                            Install Canvas Connect
                          </p>
                          <p className="text-xs text-[var(--color-text-muted)] mt-1 leading-relaxed">
                            Add the Chrome extension to automatically import your courses from Canvas LMS.
                          </p>
                          <a
                            href="https://chrome.google.com/webstore"
                            target="_blank"
                            rel="noopener noreferrer"
                            className={cn(
                              'inline-flex items-center gap-1.5 mt-3 px-3.5 py-2 rounded-lg text-xs font-semibold',
                              'bg-[var(--color-canvas-red)]/10 text-[var(--color-canvas-red)]',
                              'border border-[var(--color-canvas-red)]/20',
                              'hover:bg-[var(--color-canvas-red)]/15 hover:border-[var(--color-canvas-red)]/30 transition-all'
                            )}
                          >
                            Get Extension
                            <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5" aria-hidden>
                              <path fillRule="evenodd" d="M5.22 14.78a.75.75 0 001.06 0l7.22-7.22v5.69a.75.75 0 001.5 0v-7.5a.75.75 0 00-.75-.75h-7.5a.75.75 0 000 1.5h5.69l-7.22 7.22a.75.75 0 000 1.06z" clipRule="evenodd" />
                            </svg>
                          </a>
                        </div>
                      </div>
                    </div>
                  ) : !canvas.connected ? (
                    /* Extension installed but not connected: guide user to click it */
                    <div className="mt-4 rounded-xl bg-[var(--color-bg-elevated)]/60 border border-[var(--color-canvas-red)]/15 p-4">
                      <div className="flex items-start gap-3">
                        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[var(--color-canvas-red)]/10 text-[var(--color-canvas-red)] mt-0.5" aria-hidden>
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                          </svg>
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-[var(--color-text-primary)]">
                            Connect to Canvas
                          </p>
                          <p className="text-xs text-[var(--color-text-muted)] mt-1 leading-relaxed">
                            Click the <strong className="text-[var(--color-canvas-red)]">Canvas Connect</strong> extension icon in your browser toolbar, enter your Canvas domain, and hit Connect. This page updates automatically.
                          </p>
                          <div className="flex items-center gap-2 mt-3 text-xs text-[var(--color-canvas-red)]">
                            <svg className="animate-spin size-3.5" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                              <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                            </svg>
                            Waiting for connection...
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* Connected: success confirmation */
                    <div className="mt-3 text-sm text-[var(--color-canvas-red)] flex items-center gap-2">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                        <path d="M22 4L12 14.01l-3-3" />
                      </svg>
                      Connected{canvas.user ? ` as ${canvas.user}` : ''} — courses ready to import
                    </div>
                  )}
                </div>

                {/* ─ Manual Entry + High School Credits (only when no extension) ─ */}
                {!canvas.extensionInstalled && !canvas.loading && (
                  <>
                    <button
                      type="button"
                      onClick={setCourseworkManual}
                      className={cn(
                        methodCardBase,
                        courseworkMethod === 'manual'
                          ? 'border-[var(--color-brand-primary)]/40 shadow-[0_0_20px_var(--color-brand-glow)]'
                          : 'border-[var(--color-border-subtle)]/30 hover:border-[var(--color-border-subtle)]/50'
                      )}
                      aria-pressed={courseworkMethod === 'manual'}
                      aria-label="Manual Entry – type in your courses one by one"
                    >
                      <span
                        className={cn(
                          'flex size-12 shrink-0 items-center justify-center rounded-xl transition-colors',
                          courseworkMethod === 'manual'
                            ? 'bg-[var(--color-brand-primary)]/15 text-[var(--color-brand-primary)]'
                            : 'bg-[var(--color-brand-primary)]/8 text-[var(--color-brand-primary)]/60'
                        )}
                        aria-hidden
                      >
                        <PlusCircleIcon className="size-6" />
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-[var(--color-text-primary)] text-sm">Manual Entry</p>
                        <p className="text-sm text-[var(--color-text-muted)] mt-0.5">
                          Type in your courses one by one
                        </p>
                      </div>
                      {courseworkMethod === 'manual' && (
                        <span
                          className="size-2.5 shrink-0 rounded-full bg-[var(--color-brand-primary)] shadow-[0_0_8px_var(--color-brand-glow)]"
                          aria-hidden
                        />
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={setCourseworkHighSchool}
                      className={cn(
                        methodCardBase,
                        courseworkMethod === 'highschool'
                          ? 'border-[var(--color-feature-green)]/40 shadow-[0_0_20px_var(--color-feature-green)]'
                          : 'border-[var(--color-border-subtle)]/30 hover:border-[var(--color-border-subtle)]/50'
                      )}
                      aria-pressed={courseworkMethod === 'highschool'}
                      aria-label="High School Credits – add AP, IB, dual enrollment, or other credits"
                    >
                      <span
                        className={cn(
                          'flex size-12 shrink-0 items-center justify-center rounded-xl transition-colors',
                          courseworkMethod === 'highschool'
                            ? 'bg-[var(--color-feature-green)]/15 text-[var(--color-feature-green)]'
                            : 'bg-[var(--color-feature-green)]/8 text-[var(--color-feature-green)]/60'
                        )}
                        aria-hidden
                      >
                        <BookIcon className="size-6" />
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-[var(--color-text-primary)] text-sm">High School Credits</p>
                        <p className="text-sm text-[var(--color-text-muted)] mt-0.5">
                          Add AP, IB, dual enrollment, or other credits
                        </p>
                      </div>
                      {courseworkMethod === 'highschool' && (
                        <span
                          className="size-2.5 shrink-0 rounded-full bg-[var(--color-feature-green)] shadow-[0_0_8px_var(--color-feature-green)]"
                          aria-hidden
                        />
                      )}
                    </button>
                  </>
                )}
              </section>
            </div>
          )}

          {/* ── Step 3: Coursework details + Greek House ── */}
          {step === 3 && (
            <div className="animate-fade-in-up flex flex-col gap-6">
              {courseworkMethod === 'canvas' && (
                <section className="flex flex-col gap-6" aria-label="Canvas import complete">
                  <div>
                    <h1 className="font-display text-3xl text-[var(--color-text-primary)] mb-2">
                      Courses <em className="text-[var(--color-brand-primary)] not-italic">Imported</em>
                    </h1>
                    <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
                      Your Canvas courses have been imported successfully.
                    </p>
                  </div>

                  {/* Success card — mirrors the method card layout */}
                  <div className="rounded-2xl border border-[var(--color-canvas-red)]/20 bg-[var(--color-bg-elevated)]/40 p-5">
                    <div className="flex items-center gap-4">
                      <span
                        className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-[var(--color-canvas-red)]/15 text-[var(--color-canvas-red)]"
                        aria-hidden
                      >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                          <path d="M22 4L12 14.01l-3-3" />
                        </svg>
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-[var(--color-text-primary)] text-sm">Canvas Data Synced</p>
                        <p className="text-sm text-[var(--color-text-muted)] mt-0.5">
                          Your courses have been imported from Canvas
                          {canvas.user ? <span className="text-[var(--color-canvas-red)]"> &middot; {canvas.user}</span> : ''}
                        </p>
                      </div>
                      <span
                        className="size-2.5 shrink-0 rounded-full bg-[var(--color-canvas-red)] shadow-[0_0_8px_rgba(225,63,43,0.5)]"
                        aria-hidden
                      />
                    </div>
                  </div>

                  {/* Greek House */}
                  <div className="border-t border-[var(--color-border-subtle)]/20 pt-6">
                    <Label htmlFor="onboarding-greek-house-canvas" className="text-[var(--color-text-secondary)] text-sm font-medium">
                      Greek House <span className="text-[var(--color-text-muted)]/50 font-normal">(Optional)</span>
                    </Label>
                    <Input
                      id="onboarding-greek-house-canvas"
                      type="text"
                      placeholder="Type your Greek house..."
                      value={greekHouse}
                      onChange={handleGreekHouseChange}
                      aria-required={false}
                      className={inputStyles}
                    />
                    <p className="mt-1.5 text-xs text-[var(--color-text-muted)]/50">
                      Join the Greek house leaderboard and earn XP for your house!
                    </p>
                  </div>
                </section>
              )}

              {courseworkMethod === 'manual' && (
                <section className="flex flex-col gap-6" aria-label="Add your courses">
                  <div>
                    <h1 className="font-display text-3xl text-[var(--color-text-primary)] mb-2">
                      Add Your <em className="text-[var(--color-brand-primary)] not-italic">Courses</em>
                    </h1>
                    <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
                      Add any courses you&apos;ve completed to help us recommend better options.
                    </p>
                  </div>

                  {/* Transcript upload card */}
                  <div className="rounded-2xl border border-[var(--color-border-subtle)]/30 bg-[var(--color-bg-elevated)]/40 p-5">
                    <div className="flex items-start gap-4">
                      <span
                        className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[var(--color-brand-primary)]/10 text-[var(--color-brand-primary)]"
                        aria-hidden
                      >
                        <ScanIcon className="size-5" />
                      </span>
                      <div className="flex-1 min-w-0">
                        <h2 className="font-semibold text-[var(--color-text-primary)] text-sm">
                          Scan Your Transcript
                        </h2>
                        <p className="text-sm text-[var(--color-text-muted)] mt-1 leading-relaxed">
                          Take a screenshot of your transcript and upload it. Our AI will
                          automatically extract your completed courses.
                        </p>
                        <Button
                          type="button"
                          className={cn(
                            'mt-4 gap-2 rounded-xl text-sm',
                            'shadow-[0_0_20px_var(--color-brand-glow)]',
                            'hover:shadow-[0_0_30px_var(--color-brand-glow-strong)]',
                            'hover:-translate-y-0.5 transition-all duration-300'
                          )}
                          aria-label="Upload transcript screenshot"
                        >
                          <CameraIcon className="size-4" />
                          Upload Transcript
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Manual course input */}
                  <div>
                    <Label htmlFor="onboarding-courses" className="text-[var(--color-text-secondary)] text-sm font-medium">
                      Completed Courses
                    </Label>
                    <Input
                      id="onboarding-courses"
                      type="text"
                      placeholder="Type a course name or code..."
                      value={courses[0] ?? ''}
                      onChange={(e) =>
                        setCourses(e.target.value ? [e.target.value] : [])
                      }
                      aria-required={false}
                      className={inputStyles}
                    />
                    <p className="mt-1.5 text-xs text-[var(--color-text-muted)]/50">
                      You can skip this step if you prefer, but adding courses helps us make
                      better recommendations.
                    </p>
                  </div>

                  {/* Greek House */}
                  <div className="border-t border-[var(--color-border-subtle)]/20 pt-6">
                    <Label htmlFor="onboarding-greek-house-manual" className="text-[var(--color-text-secondary)] text-sm font-medium">
                      Greek House <span className="text-[var(--color-text-muted)]/50 font-normal">(Optional)</span>
                    </Label>
                    <Input
                      id="onboarding-greek-house-manual"
                      type="text"
                      placeholder="Type your Greek house..."
                      value={greekHouse}
                      onChange={handleGreekHouseChange}
                      aria-required={false}
                      className={inputStyles}
                    />
                    <p className="mt-1.5 text-xs text-[var(--color-text-muted)]/50">
                      Join the Greek house leaderboard and earn XP for your house!
                    </p>
                  </div>
                </section>
              )}

              {courseworkMethod === 'highschool' && (
                <section className="flex flex-col gap-6" aria-label="High school credits">
                  <div>
                    <h1 className="font-display text-3xl text-[var(--color-text-primary)] mb-2">
                      High School <em className="text-[var(--color-feature-green)] not-italic">Credits</em>
                    </h1>
                    <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
                      Add any college credits you earned in high school.
                    </p>
                  </div>

                  {/* Add credit card */}
                  <div className="rounded-2xl border border-[var(--color-border-subtle)]/30 bg-[var(--color-bg-elevated)]/40 p-5 flex flex-col gap-4">
                    <h2 className="font-semibold text-[var(--color-text-primary)] text-sm">Add Credit</h2>
                    <div>
                      <Label htmlFor="onboarding-credit-subject" className="text-[var(--color-text-secondary)] text-sm font-medium">
                        Subject/Course
                      </Label>
                      <Input
                        id="onboarding-credit-subject"
                        type="text"
                        placeholder="e.g., AP Calculus, IB Biology, Dual Enrollment"
                        value={newCreditSubject}
                        onChange={(e) => setNewCreditSubject(e.target.value)}
                        className={inputStyles}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="onboarding-credit-credits" className="text-[var(--color-text-secondary)] text-sm font-medium">
                          Credits
                        </Label>
                        <Input
                          id="onboarding-credit-credits"
                          type="text"
                          placeholder="3"
                          value={newCreditCredits}
                          onChange={(e) => setNewCreditCredits(e.target.value)}
                          className={inputStyles}
                        />
                      </div>
                      <div>
                        <Label htmlFor="onboarding-credit-grade" className="text-[var(--color-text-secondary)] text-sm font-medium">
                          Grade <span className="text-[var(--color-text-muted)]/50 font-normal">(Optional)</span>
                        </Label>
                        <Input
                          id="onboarding-credit-grade"
                          type="text"
                          placeholder="A, B+, 4, 5"
                          value={newCreditGrade}
                          onChange={(e) => setNewCreditGrade(e.target.value)}
                          aria-required={false}
                          className={inputStyles}
                        />
                      </div>
                    </div>
                    <Button
                      type="button"
                      fullWidth
                      onClick={handleAddCredit}
                      className={cn(
                        'gap-2 rounded-xl text-sm',
                        'shadow-[0_0_20px_var(--color-brand-glow)]',
                        'hover:shadow-[0_0_30px_var(--color-brand-glow-strong)]',
                        'hover:-translate-y-0.5 transition-all duration-300'
                      )}
                    >
                      <PlusCircleIcon className="size-4" />
                      Add Credit
                    </Button>
                  </div>

                  {/* Credit list */}
                  {highSchoolCredits.length > 0 && (
                    <div className="flex flex-col gap-2">
                      {highSchoolCredits.map((credit, i) => (
                        <div
                          key={`${credit.subject}-${i}`}
                          className="flex items-center justify-between rounded-xl bg-[var(--color-bg-elevated)]/30 border border-[var(--color-border-subtle)]/20 px-4 py-3"
                        >
                          <div className="flex items-center gap-3">
                            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-feature-green)]" aria-hidden />
                            <span className="text-sm text-[var(--color-text-primary)]">{credit.subject}</span>
                          </div>
                          <div className="flex items-center gap-3 text-xs text-[var(--color-text-muted)]">
                            <span>{credit.credits} cr</span>
                            {credit.grade && <span>{credit.grade}</span>}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <p className="text-xs text-[var(--color-text-muted)]/50 leading-relaxed">
                    Adding high school credits helps us understand your academic background
                    and avoid recommending courses you may have already covered.
                  </p>

                  {/* Greek House */}
                  <div className="border-t border-[var(--color-border-subtle)]/20 pt-6">
                    <Label htmlFor="onboarding-greek-house-hs" className="text-[var(--color-text-secondary)] text-sm font-medium">
                      Greek House <span className="text-[var(--color-text-muted)]/50 font-normal">(Optional)</span>
                    </Label>
                    <Input
                      id="onboarding-greek-house-hs"
                      type="text"
                      placeholder="Type your Greek house..."
                      value={greekHouse}
                      onChange={handleGreekHouseChange}
                      aria-required={false}
                      className={inputStyles}
                    />
                    <p className="mt-1.5 text-xs text-[var(--color-text-muted)]/50">
                      Join the Greek house leaderboard and earn XP for your house!
                    </p>
                  </div>
                </section>
              )}
            </div>
          )}

          {/* ── Footer CTA ── */}
          <footer
            className="relative z-0 mt-auto pt-6"
            role="navigation"
            aria-label="Onboarding actions"
          >
            {showNext && (
              <Button
                type="button"
                fullWidth
                onClick={handleNext}
                disabled={(step === 1 && !canProceedStep1) || (step === 2 && !canProceedStep2)}
                className={cn(
                  'py-3.5 rounded-xl font-semibold text-sm',
                  'shadow-[0_0_30px_var(--color-brand-glow)]',
                  'hover:shadow-[0_4px_50px_var(--color-brand-glow-strong)]',
                  'hover:-translate-y-0.5 transition-all duration-300'
                )}
                rightIcon={
                  <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4" aria-hidden>
                    <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
                  </svg>
                }
              >
                Next
              </Button>
            )}
            {showFinish && (
              <Button
                type="button"
                fullWidth
                onClick={handleFinish}
                className={cn(
                  'py-3.5 rounded-xl font-semibold text-sm',
                  'shadow-[0_0_30px_var(--color-brand-glow)]',
                  'hover:shadow-[0_4px_50px_var(--color-brand-glow-strong)]',
                  'hover:-translate-y-0.5 transition-all duration-300'
                )}
                rightIcon={
                  <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4" aria-hidden>
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                }
              >
                Get Started
              </Button>
            )}
          </footer>
        </div>
      </main>
    </div>
  );
}
