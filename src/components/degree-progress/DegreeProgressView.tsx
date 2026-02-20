'use client';

import { cn } from '@/lib/utils/cn';
import { Progress } from '@/components/ui';
import type { DegreeProgressViewProps } from './DegreeProgressView.types';
import type { CourseRequirement } from '@/lib/types';

/* ── Inline Icons ── */

function GraduationIcon({ className }: { readonly className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
      <path d="M6 12v5c3 3 9 3 12 0v-5" />
    </svg>
  );
}

function CheckCircleIcon({ className }: { readonly className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}

function CircleIcon({ className }: { readonly className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="12" cy="12" r="10" />
    </svg>
  );
}

function BookIcon({ className }: { readonly className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  );
}

function CalendarIcon({ className }: { readonly className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

function TrendingUpIcon({ className }: { readonly className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </svg>
  );
}

/* ── Helpers ── */

function semesterAccent(percentage: number): string {
  if (percentage === 100) return 'var(--color-feature-green)';
  if (percentage >= 75) return 'var(--color-feature-teal)';
  if (percentage >= 25) return 'var(--color-feature-amber)';
  return 'var(--color-text-muted)';
}

type SemesterState = 'completed' | 'in-progress' | 'planned';

function getSemesterState(percentage: number): SemesterState {
  if (percentage === 100) return 'completed';
  if (percentage > 0) return 'in-progress';
  return 'planned';
}

type SemesterData = {
  readonly name: string;
  readonly percentage: number;
  readonly credits: string;
  readonly courses: ReadonlyArray<CourseRequirement>;
};

function groupSemestersByYear(semesters: ReadonlyArray<SemesterData>): [string, SemesterData[]][] {
  const groups = new Map<string, SemesterData[]>();
  for (const sem of semesters) {
    // Parse "Year 1, Fall" → "Year 1"; fallback to full name
    const match = sem.name.match(/^(Year\s*\d+)/i);
    const year = match ? match[1] : sem.name;
    if (!groups.has(year)) groups.set(year, []);
    groups.get(year)!.push(sem);
  }
  return Array.from(groups.entries());
}

/* ── Main Component ── */

export function DegreeProgressView({
  semesters,
  overall,
}: DegreeProgressViewProps) {
  const percentage = overall
    ? Math.round((overall.completedCredits / overall.totalCredits) * 1000) / 10
    : 0;
  const remaining = overall ? overall.totalCredits - overall.completedCredits : 0;

  const completedSemesters = semesters.filter((s) => s.percentage === 100).length;
  const totalCourses = semesters.reduce((sum, s) => sum + s.courses.length, 0);
  const completedCourses = semesters.reduce(
    (sum, s) => sum + s.courses.filter((c) => c.completed).length,
    0
  );

  return (
    <div className="flex h-full flex-col bg-[var(--color-bg-base)]">
      {/* ── Header ── */}
      <header className="shrink-0 border-b border-[var(--color-border-subtle)]/30 bg-[var(--color-bg-base)] px-6 py-[6.1px]">
      <div className="max-w-8xl mx-auto">
         <div className="flex items-center gap-3">
          <h1 className="text-xl font-semibold text-[var(--color-text-primary)]">
            Degree Progress
          </h1>
          {overall && (
            <span className="rounded-full bg-[var(--color-brand-primary)]/10 border border-[var(--color-brand-primary)]/20 px-3 py-0.5 text-xs font-semibold text-[var(--color-brand-primary)]">
              {overall.degreeName}
            </span>
          )}
        </div>
      </div>
       
      </header>

      {/* ── Content ── */}
      <main className="flex-1 min-h-0 overflow-y-auto p-6">
        <div className="max-w-8xl mx-auto space-y-6">

          {/* ── Stats Row ──
          {overall && (
            <div className="grid grid-cols-4 gap-3">
              <StatCard
                icon={<TrendingUpIcon className="w-4 h-4" />}
                accent="var(--color-brand-primary)"
                label="Overall"
                value={`${percentage}%`}
                sub={`${overall.completedCredits} / ${overall.totalCredits} credits`}
              />
              <StatCard
                icon={<BookIcon className="w-4 h-4" />}
                accent="var(--color-feature-amber)"
                label="Remaining"
                value={`${remaining}`}
                sub="credits left"
              />
              <StatCard
                icon={<CalendarIcon className="w-4 h-4" />}
                accent="var(--color-feature-green)"
                label="Graduation"
                value={overall.expectedGraduation}
                sub={`${completedSemesters} / ${semesters.length} semesters`}
              />
              <StatCard
                icon={<CheckCircleIcon className="w-4 h-4" />}
                accent="var(--color-feature-teal)"
                label="Courses"
                value={`${completedCourses} / ${totalCourses}`}
                sub="completed"
              />
            </div>
          )} */}

          {/* ── Overall Progress Bar ── */}
          {overall && (
            <div className="rounded-xl border border-[var(--color-border-subtle)]/30 bg-[var(--color-bg-base)] p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <GraduationIcon className="w-4 h-4 text-[var(--color-brand-primary)]" />
                  <span className="text-sm font-medium text-[var(--color-text-primary)]">Progress to Graduation</span>
                </div>
                <span className="text-sm font-semibold text-[var(--color-brand-primary)]">{percentage}%</span>
              </div>
              <Progress value={percentage} max={100} className="h-2.5" />
              {/* Semester mini-markers */}
              <div className="flex gap-1 mt-3">
                {semesters.map((sem) => {
                  const accent = semesterAccent(sem.percentage);
                  return (
                    <div key={sem.name} className="flex-1 group relative">
                      <div
                        className="h-1.5 rounded-full transition-all duration-200 group-hover:h-2"
                        style={{
                          backgroundColor: `color-mix(in srgb, ${accent} ${Math.max(sem.percentage, 10)}%, var(--color-bg-elevated))`,
                        }}
                      />
                      <p className="mt-1 text-[9px] text-[var(--color-text-muted)]/50 truncate text-center">
                        {sem.name}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── Semester Timeline ── */}
          {semesters.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-14 h-14 rounded-2xl bg-[var(--color-brand-primary)]/10 border border-[var(--color-brand-primary)]/20 flex items-center justify-center mb-4">
                <GraduationIcon className="w-7 h-7 text-[var(--color-brand-primary)]" />
              </div>
              <p className="text-sm font-medium text-[var(--color-text-secondary)]">No degree data</p>
              <p className="text-xs text-[var(--color-text-muted)]/60 mt-1.5 max-w-xs">
                Upload your transcript or connect to the backend to see your semester blocks and requirements.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {groupSemestersByYear(semesters).map(([year, yearSemesters]) => (
                <div key={year}>
                  <div className="flex items-center gap-3 mb-4">
                    <p className="text-[11px] font-semibold uppercase tracking-widest text-[var(--color-text-muted)]/50 shrink-0">
                      {year}
                    </p>
                    <div className="flex-1 h-px bg-[var(--color-border-subtle)]/30" />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {yearSemesters.map((sem) => (
                      <SemesterCard key={sem.name} semester={sem} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

/* ── Stat Card ── */

function StatCard({
  icon,
  accent,
  label,
  value,
  sub,
}: {
  readonly icon: React.ReactNode;
  readonly accent: string;
  readonly label: string;
  readonly value: string;
  readonly sub: string;
}) {
  return (
    <div className="rounded-xl border border-[var(--color-border-subtle)]/30 bg-[var(--color-bg-base)] p-4 transition-all duration-200 hover:border-[var(--color-border-subtle)]/60">
      <div className="flex items-center gap-2 mb-2">
        <span
          className="flex items-center justify-center w-7 h-7 rounded-lg"
          style={{
            color: accent,
            backgroundColor: `color-mix(in srgb, ${accent} 10%, transparent)`,
          }}
        >
          {icon}
        </span>
        <span className="text-[11px] font-semibold uppercase tracking-widest text-[var(--color-text-muted)]/50">
          {label}
        </span>
      </div>
      <p className="text-xl font-bold text-[var(--color-text-primary)]">{value}</p>
      <p className="text-xs text-[var(--color-text-muted)]/60 mt-0.5">{sub}</p>
    </div>
  );
}

/* ── Semester Card ── */

function SemesterCard({
  semester,
}: {
  readonly semester: SemesterData;
}) {
  const state = getSemesterState(semester.percentage);
  const accent = semesterAccent(semester.percentage);
  const isPlanned = state === 'planned';
  const isCompleted = state === 'completed';
  const isInProgress = state === 'in-progress';

  return (
    <div
      className={cn(
        'rounded-xl bg-[var(--color-bg-surface)] p-4 transition-all duration-200 overflow-hidden',
        isPlanned
          ? 'border border-dashed border-[var(--color-border-subtle)]/40'
          : 'border border-[var(--color-border-subtle)]/30 hover:border-[var(--color-border-subtle)]/60',
        isPlanned && 'opacity-75'
      )}
      style={{
        borderLeft: isPlanned ? undefined : `3px solid ${isCompleted ? 'var(--color-feature-green)' : 'var(--color-brand-primary)'}`,
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {isCompleted ? (
            <CheckCircleIcon className="w-4 h-4 text-[var(--color-feature-green)]" />
          ) : isInProgress ? (
            <div
              className="w-4 h-4 rounded-full border-2"
              style={{ borderColor: accent }}
            />
          ) : (
            <CircleIcon className="w-4 h-4 text-[var(--color-text-muted)]/40" />
          )}
          <h2 className={cn(
            'text-sm font-semibold',
            isPlanned ? 'text-[var(--color-text-primary)]/60' : 'text-[var(--color-text-primary)]'
          )}>
            {semester.name}
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <span className={cn(
            'text-xs',
            isPlanned ? 'text-[var(--color-text-muted)]/60' : 'text-[var(--color-text-muted)]'
          )}>
            {semester.credits}
          </span>
          {isCompleted && (
            <span className="rounded-full bg-[var(--color-feature-green)]/10 border border-[var(--color-feature-green)]/20 px-2 py-0.5 text-[10px] font-semibold text-[var(--color-feature-green)]">
              Completed
            </span>
          )}
          {isInProgress && (
            <span className="rounded-full bg-[var(--color-brand-primary)]/10 border border-[var(--color-brand-primary)]/20 px-2 py-0.5 text-[10px] font-semibold text-[var(--color-brand-primary)]">
              In Progress
            </span>
          )}
          {isPlanned && (
            <span className="rounded-full bg-[var(--color-text-muted)]/10 border border-[var(--color-text-muted)]/20 px-2 py-0.5 text-[10px] font-semibold text-[var(--color-text-muted)]/60">
              Planned
            </span>
          )}
        </div>
      </div>

      {/* Progress — only for in-progress */}
      {isInProgress && (
        <div className="flex items-center gap-3 mb-3">
          <Progress value={semester.percentage} max={100} className="flex-1 h-1.5" />
          <span
            className="text-xs font-semibold"
            style={{ color: accent }}
          >
            {Math.round(semester.percentage)}%
          </span>
        </div>
      )}

      {/* Course list */}
      <ul className="space-y-1.5" role="list">
        {semester.courses.map((req, i) => (
          <CourseRequirementRow key={req.name + String(i)} req={req} planned={isPlanned} />
        ))}
      </ul>
    </div>
  );
}

/* ── Course Requirement Row ── */

function CourseRequirementRow({ req, planned }: { readonly req: CourseRequirement; readonly planned?: boolean }) {
  return (
    <li
      className={cn(
        'flex items-start gap-2.5 rounded-lg px-2.5 py-2 text-sm transition-all duration-200',
        req.completed
          ? 'bg-[var(--color-feature-green)]/5'
          : 'bg-[var(--color-bg-elevated)]/30 hover:bg-[var(--color-bg-elevated)]/50'
      )}
    >
      {/* Status icon */}
      {req.completed ? (
        <CheckCircleIcon className="w-4 h-4 shrink-0 mt-0.5 text-[var(--color-feature-green)]" />
      ) : (
        <CircleIcon className={cn('w-4 h-4 shrink-0 mt-0.5', planned ? 'text-[var(--color-text-muted)]/25' : 'text-[var(--color-text-muted)]/40')} />
      )}

      {/* Content */}
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-1.5">
          <span
            className={cn(
              'text-[13px] font-medium',
              planned ? 'text-[var(--color-text-secondary)]/60' : req.completed ? 'text-[var(--color-text-primary)]' : 'text-[var(--color-text-secondary)]'
            )}
          >
            {req.name}
          </span>
          {req.critical && (
            <span className="rounded-full bg-[var(--color-feature-purple)]/15 px-2 py-0.5 text-[10px] font-semibold text-[var(--color-feature-purple)]">
              Required
            </span>
          )}
          {req.code && (
            <span className="rounded-full bg-[var(--color-bg-elevated)] px-2 py-0.5 text-[10px] font-medium text-[var(--color-text-muted)]">
              {req.code}
            </span>
          )}
        </div>
        <p className={cn('text-[11px] mt-0.5 leading-relaxed', planned ? 'text-[var(--color-text-muted)]/40' : 'text-[var(--color-text-muted)]/60')}>
          {req.creditsRequired ?? 3} credits
          {req.fulfilledBy ? <> &middot; Fulfilled by <span className="text-[var(--color-feature-green)]">{req.fulfilledBy}</span></> : null}
          {req.canBeFulfilledBy?.length ? <> &middot; Options: {req.canBeFulfilledBy.join(', ')}</> : null}
        </p>
      </div>
    </li>
  );
}
