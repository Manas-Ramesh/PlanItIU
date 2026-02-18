'use client';

import { useState, useCallback, useMemo } from 'react';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import { cn } from '@/lib/utils/cn';
import { parseCourseTime, CALENDAR_START_HOUR, CALENDAR_END_HOUR } from '@/lib/utils/scheduleTime';
import type { ScheduleViewProps } from './ScheduleView.types';
import type { Course } from '@/lib/types';
import type { EventInput, EventContentArg } from '@fullcalendar/core';

/** Accent colors per course index for calendar block left-edge bars */
const COURSE_ACCENTS = [
  'var(--color-feature-cyan)',
  'var(--color-feature-purple)',
  'var(--color-feature-amber)',
  'var(--color-feature-teal)',
  'var(--color-feature-pink)',
  'var(--color-feature-orange)',
  'var(--color-feature-green)',
];

/* ── Inline Icons ── */

function SearchIcon({ className }: { readonly className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="11" cy="11" r="8" />
      <path d="M21 21l-4.35-4.35" />
    </svg>
  );
}

function RefreshIcon({ className }: { readonly className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <polyline points="23 4 23 10 17 10" />
      <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
    </svg>
  );
}

function UndoIcon({ className }: { readonly className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <polyline points="1 4 1 10 7 10" />
      <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
    </svg>
  );
}

function DownloadIcon({ className }: { readonly className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

function MapPinIcon({ className }: { readonly className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function ClockIcon({ className }: { readonly className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function UserIcon({ className }: { readonly className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function SwapIcon({ className }: { readonly className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <polyline points="17 1 21 5 17 9" />
      <path d="M3 11V9a4 4 0 0 1 4-4h14" />
      <polyline points="7 23 3 19 7 15" />
      <path d="M21 13v2a4 4 0 0 1-4 4H3" />
    </svg>
  );
}

function SparkleIcon({ className }: { readonly className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2L14.09 8.26L20 9.27L15.55 13.97L16.91 20L12 16.9L7.09 20L8.45 13.97L4 9.27L9.91 8.26L12 2Z" />
    </svg>
  );
}

function SaveIcon({ className }: { readonly className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
      <polyline points="17 21 17 13 7 13 7 21" />
      <polyline points="7 3 7 8 15 8" />
    </svg>
  );
}

/* ── Helpers ── */

function statusVariant(
  status: Course['status'],
  type: Course['type']
): 'open' | 'closed' | 'critical' | 'required' | 'genEd' {
  if (status === 'closed') return 'closed';
  if (status === 'justOpened') return 'open';
  if (type === 'critical') return 'critical';
  if (type === 'required') return 'required';
  if (type === 'genEd') return 'genEd';
  return 'open';
}

function getTagLabel(course: Course): string | null {
  if (course.status === 'justOpened') return 'Just Opened!';
  if (course.status === 'closed') return 'Closed';
  if (course.type === 'critical') return 'Critical';
  if (course.type === 'required') return 'Required';
  if (course.type === 'genEd') return 'Gen Ed';
  if (course.status === 'open') return 'Open';
  return null;
}

function tagClasses(variant: string, label: string): string {
  if (variant === 'closed' || variant === 'critical')
    return 'bg-[var(--color-danger)]/15 text-[var(--color-danger)]';
  if (variant === 'open' && label === 'Just Opened!')
    return 'bg-[var(--color-tag-open)]/15 text-[var(--color-tag-open)]';
  if (variant === 'open')
    return 'bg-[var(--color-tag-open)]/15 text-[var(--color-tag-open)]';
  if (variant === 'required')
    return 'bg-[var(--color-feature-purple)]/15 text-[var(--color-feature-purple)]';
  if (variant === 'genEd')
    return 'bg-[var(--color-feature-teal)]/15 text-[var(--color-feature-teal)]';
  return 'bg-[var(--color-tag-open)]/15 text-[var(--color-tag-open)]';
}

/* ── Main Component ── */

export function ScheduleView({
  currentSchedule,
  savedSchedules,
  onSaveSchedule,
  onDeleteSchedule,
}: ScheduleViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [scheduleName, setScheduleName] = useState('');

  const handleSave = useCallback(() => {
    const name = scheduleName.trim() || `Schedule ${new Date().toISOString().slice(0, 10)}`;
    onSaveSchedule(name);
    setScheduleName('');
    setSaveDialogOpen(false);
  }, [scheduleName, onSaveSchedule]);

  const courses = currentSchedule?.courses ?? [];
  const totalCredits = courses.reduce((sum, c) => sum + c.credits, 0);
  const canSaveMore = savedSchedules.length < 5;

  return (
    <div className="flex h-full flex-col bg-[var(--color-bg-base)]">
      {/* ── Header — Title only ── */}
      <header className="shrink-0 border-b border-[var(--color-border-subtle)]/30 bg-[var(--color-bg-base)] px-6 py-[17.5px]">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-semibold text-[var(--color-text-primary)]">
            Schedule Builder
          </h1>
          {courses.length > 0 && (
            <span className="rounded-full bg-[var(--color-brand-primary)]/10 border border-[var(--color-brand-primary)]/20 px-3 py-0.5 text-xs font-semibold text-[var(--color-brand-primary)]">
              {totalCredits} credits
            </span>
          )}
        </div>
      </header>

      {/* ── Toolbar — Search + Actions ── */}
      <div className="shrink-0 border-b border-[var(--color-border-subtle)]/30 bg-[var(--color-bg-base)] px-3 py-3 w-full">
        <div className="flex flex-wrap items-center gap-3">
          {/* Search */}
          <div
            className={cn(
              'flex items-center gap-2 rounded-xl border border-[var(--color-border-subtle)]/40 bg-[var(--color-bg-base)]/80 px-3 py-2 w-64',
              'focus-within:border-[var(--color-brand-primary)]/30 focus-within:shadow-[0_0_16px_var(--color-brand-glow)]',
              'transition-all duration-200 flex-1 min-w-40'
            )}
          >
            <SearchIcon className="w-4 h-4 text-[var(--color-text-muted)]/50 shrink-0" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search courses..."
              aria-label="Search courses"
              className="flex-1 bg-transparent text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)]/50 focus:outline-none"
            />
          </div>

          {/* <div className="flex-1" /> */}

          {/* Action buttons  inside of nicely row */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              className={cn(
                'flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all duration-200',
                'bg-[var(--color-brand-primary)] text-[var(--color-text-on-brand)]',
                'hover:shadow-[0_0_16px_var(--color-brand-glow)] hover:brightness-110',
                // no text wraping inside
                'active:scale-[0.98] w-full sm:w-auto text-nowrap'
              )}
            >
              <SparkleIcon className="w-4 h-4" />
              Generate Schedule
            </button>
            <button
              type="button"
              disabled={!canSaveMore}
              onClick={() => setSaveDialogOpen(true)}
              className={cn(
                'flex items-center gap-2 rounded-xl border border-[var(--color-border-subtle)]/40 bg-[var(--color-bg-base)]/80 px-4 py-2 text-sm font-medium transition-all duration-200',
                'text-[var(--color-text-secondary)]',
                'hover:border-[var(--color-border-subtle)]/60 hover:bg-[var(--color-bg-surface)]/80 hover:text-[var(--color-text-primary)]',
                'disabled:opacity-40 disabled:cursor-not-allowed',
                'active:scale-[0.98]'
              )}
            >
              <SaveIcon className="w-4 h-4" />
              Save
              <span className="rounded-full bg-[var(--color-bg-elevated)] px-1.5 py-0.5 text-[10px] font-semibold text-[var(--color-text-muted)]">
                {savedSchedules.length}/5
              </span>
            </button>
          </div>

        </div>
      </div>

      {/* ── Body ── */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* ── Left Panel — Course List ── */}
        <aside
          className="w-80 shrink-0 overflow-y-auto bg-[var(--color-bg-base)] p-4"
          aria-label="Current schedule"
        >
          {/* Section header + actions */}
          <div className="flex items-center gap-2 mb-4">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-[var(--color-text-muted)]/50">
              Your Courses
            </p>
            {courses.length > 0 && (
              <span className="rounded-full bg-[var(--color-bg-elevated)] px-2 py-0.5 text-[10px] font-semibold text-[var(--color-text-muted)]">
                {courses.length}
              </span>
            )}
            <div className="flex-1" />
            <div className="flex gap-1.5">
              <IconButton icon={<RefreshIcon className="w-4 h-4" />} label="Regenerate" />
              <IconButton icon={<UndoIcon className="w-4 h-4" />} label="Undo" />
              <IconButton icon={<DownloadIcon className="w-4 h-4" />} label="Export" />
            </div>
          </div>

          {/* Course cards */}
          {courses.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-12 h-12 rounded-2xl bg-[var(--color-bg-elevated)] flex items-center justify-center mb-3">
                <SearchIcon className="w-5 h-5 text-[var(--color-text-muted)]/40" />
              </div>
              <p className="text-sm font-medium text-[var(--color-text-secondary)]">No courses yet</p>
              <p className="text-xs text-[var(--color-text-muted)]/60 mt-1 max-w-[200px]">
                Search for courses or generate a schedule to get started.
              </p>
            </div>
          ) : (
            <ul className="space-y-2.5" role="list">
              {courses.map((c, i) => (
                <li key={c.id}>
                  <CourseCard course={c} accentIndex={i} />
                </li>
              ))}
            </ul>
          )}
        </aside>

        {/* ── Right Panel — Calendar Grid ── */}
        <main className="flex-1 min-w-0 min-h-0 border-l border-[var(--color-border-subtle)]/30 bg-[var(--color-bg-base)]" aria-label="Weekly calendar" style={{ minHeight: 400 }}>
          {courses.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center max-w-md p-12">
                <div className="w-14 h-14 rounded-2xl bg-[var(--color-brand-primary)]/10 border border-[var(--color-brand-primary)]/20 flex items-center justify-center mx-auto mb-4">
                  <SparkleIcon className="w-7 h-7 text-[var(--color-brand-primary)]" />
                </div>
                <p className="text-sm font-medium text-[var(--color-text-secondary)]">No schedule to display</p>
                <p className="text-xs text-[var(--color-text-muted)]/60 mt-1.5">
                  Generate or load a schedule to see the calendar view.
                </p>
              </div>
            </div>
          ) : (
            <ScheduleCalendar courses={courses} />
          )}
        </main>
      </div>

      {/* ── Save Dialog ── */}
      {saveDialogOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="save-schedule-title"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSaveDialogOpen(false);
          }}
        >
          <div
            className={cn(
              'mx-4 w-full max-w-md rounded-2xl border border-[var(--color-border-subtle)]/30',
              'bg-[var(--color-bg-surface)] p-6 shadow-2xl',
              'animate-in fade-in zoom-in-95 duration-200'
            )}
          >
            <h2 id="save-schedule-title" className="text-lg font-semibold text-[var(--color-text-primary)]">
              Save Schedule
            </h2>
            <p className="mt-1 text-sm text-[var(--color-text-muted)]/60">
              Give your schedule a name to save it for later.
            </p>
            <div
              className={cn(
                'mt-4 flex items-center rounded-xl border border-[var(--color-border-subtle)]/40 bg-[var(--color-bg-base)] px-3 py-2.5',
                'focus-within:border-[var(--color-brand-primary)]/30 focus-within:shadow-[0_0_16px_var(--color-brand-glow)]',
                'transition-all duration-200'
              )}
            >
              <input
                type="text"
                value={scheduleName}
                onChange={(e) => setScheduleName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSave();
                }}
                placeholder="e.g. Spring 2026 — Plan A"
                aria-label="Schedule name"
                className="flex-1 bg-transparent text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)]/40 focus:outline-none"
                autoFocus
              />
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setSaveDialogOpen(false)}
                className={cn(
                  'rounded-xl px-4 py-2 text-sm font-medium transition-all duration-200',
                  'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-elevated)]'
                )}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                className={cn(
                  'rounded-xl px-5 py-2 text-sm font-medium transition-all duration-200',
                  'bg-[var(--color-brand-primary)] text-[var(--color-text-on-brand)]',
                  'hover:shadow-[0_0_16px_var(--color-brand-glow)] hover:brightness-110',
                  'active:scale-[0.98]'
                )}
              >
                Save Schedule
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Icon Button (tooltip-like action) ── */

function IconButton({
  icon,
  label,
}: {
  readonly icon: React.ReactNode;
  readonly label: string;
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      className={cn(
        'group relative flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-200',
        'border border-[var(--color-border-subtle)]/30 bg-[var(--color-bg-surface)]/60',
        'text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]',
        'hover:border-[var(--color-border-subtle)]/60 hover:bg-[var(--color-bg-surface)]',
        'active:scale-95'
      )}
    >
      {icon}
    </button>
  );
}

/* ── Course Card ── */

function CourseCard({
  course,
  accentIndex,
}: {
  readonly course: Course;
  readonly accentIndex: number;
}) {
  const variant = statusVariant(course.status, course.type);
  const label = getTagLabel(course);
  const accent = COURSE_ACCENTS[accentIndex % COURSE_ACCENTS.length];

  return (
    <div
      className={cn(
        'group relative rounded-xl border border-[var(--color-border-subtle)]/30 bg-[var(--color-bg-course-block)] p-3.5',
        'transition-all duration-200',
        'hover:border-[var(--color-border-subtle)]/60 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/5'
      )}
    >
      {/* Accent left edge */}
      <div
        className="absolute left-0 top-3 bottom-3 w-[3px] rounded-full"
        style={{ backgroundColor: accent }}
      />

      {/* Top row: code + tags */}
      <div className="flex items-start justify-between gap-2 pl-2">
        <span className="text-sm font-semibold text-[var(--color-text-primary)]">
          {course.code}
        </span>
        <div className="flex flex-wrap gap-1">
          {label && (
            <span
              className={cn(
                'rounded-full px-2 py-0.5 text-[10px] font-semibold',
                tagClasses(variant, label)
              )}
            >
              {label}
            </span>
          )}
          <span className="rounded-full bg-[var(--color-tag-credits)]/15 px-2 py-0.5 text-[10px] font-semibold text-[var(--color-tag-credits)]">
            {course.credits}cr
          </span>
        </div>
      </div>

      {/* Title */}
      <p className="mt-1.5 pl-2 text-[13px] font-medium text-[var(--color-text-primary)] leading-snug">
        {course.title}
      </p>

      {/* Rating + Grade row */}
      <div className="mt-2 flex items-center gap-2 pl-2">
        {course.rating != null && (
          <span className="flex items-center gap-0.5 text-xs font-medium text-[var(--color-feature-amber)]">
            <span aria-hidden>★</span>
            {course.rating}
          </span>
        )}
        {course.avgGrade && (
          <span className="rounded-full bg-[var(--color-feature-green)]/15 px-2 py-0.5 text-[10px] font-semibold text-[var(--color-feature-green)]">
            {course.avgGrade}
          </span>
        )}
      </div>

      {/* Metadata lines */}
      <div className="mt-2 space-y-1 pl-2">
        {course.professor && (
          <div className="flex items-center gap-1.5 text-xs text-[var(--color-text-muted)]">
            <UserIcon className="w-3 h-3 shrink-0" />
            {course.professor}
          </div>
        )}
        {course.time && (
          <div className="flex items-center gap-1.5 text-xs text-[var(--color-text-muted)]">
            <ClockIcon className="w-3 h-3 shrink-0" />
            {course.time}
          </div>
        )}
        {course.location && (
          <div className="flex items-center gap-1.5 text-xs text-[var(--color-text-muted)]">
            <MapPinIcon className="w-3 h-3 shrink-0" />
            {course.location}
          </div>
        )}
      </div>

      {/* Swap button */}
      <button
        type="button"
        className={cn(
          'mt-3 ml-2 flex items-center gap-1.5 rounded-lg border border-[var(--color-border-subtle)]/30 bg-[var(--color-bg-surface)]/60 px-3 py-1.5 text-xs font-medium',
          'text-[var(--color-text-secondary)] transition-all duration-200',
          'hover:border-[var(--color-border-subtle)]/60 hover:bg-[var(--color-bg-surface)] hover:text-[var(--color-text-primary)]',
          'active:scale-[0.97]'
        )}
      >
        <SwapIcon className="w-3.5 h-3.5" />
        Swap Class
      </button>
    </div>
  );
}

/* ── FullCalendar wrapper ── */

/** Map day-index (0=Mon … 4=Fri) to a real date in a reference week (Mon 2026-01-05) */
const REF_MONDAY = '2026-01-05';

function minutesToTime(m: number): string {
  const h = Math.floor(m / 60);
  const min = m % 60;
  return `${h.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`;
}

function coursesToEvents(courses: ReadonlyArray<Course>): EventInput[] {
  const events: EventInput[] = [];
  for (let ci = 0; ci < courses.length; ci++) {
    const course = courses[ci];
    if (!course.time) continue;
    const parsed = parseCourseTime(course.time);
    if (!parsed) continue;
    const accent = COURSE_ACCENTS[ci % COURSE_ACCENTS.length];
    for (const meeting of parsed) {
      for (const dayIndex of meeting.dayIndices) {
        const date = new Date(REF_MONDAY);
        date.setDate(date.getDate() + dayIndex);
        const dateStr = date.toISOString().slice(0, 10);
        events.push({
          id: `${course.id}-${dayIndex}-${meeting.startMinutes}`,
          title: course.code,
          start: `${dateStr}T${minutesToTime(meeting.startMinutes)}`,
          end: `${dateStr}T${minutesToTime(meeting.endMinutes)}`,
          extendedProps: { course, accent, location: course.location },
        });
      }
    }
  }
  return events;
}

function renderEventContent(arg: EventContentArg) {
  const { accent, location } = arg.event.extendedProps;
  return (
    <div className="relative h-full overflow-hidden">
      <div
        className="absolute left-0 top-0 bottom-0 w-[3px]"
        style={{ backgroundColor: accent as string }}
      />
      <div className="pl-2.5 pr-1.5 py-1">
        <p className="truncate text-[11px] font-semibold text-[var(--color-text-primary)]">
          {arg.event.title}
        </p>
        <p className="truncate text-[10px] text-[var(--color-text-muted)]">
          {arg.timeText}
        </p>
        {location && (
          <p className="truncate text-[10px] text-[var(--color-text-muted)]/60">
            {location as string}
          </p>
        )}
      </div>
    </div>
  );
}

function ScheduleCalendar({ courses }: { readonly courses: ReadonlyArray<Course> }) {
  const events = useMemo(() => coursesToEvents(courses), [courses]);

  return (
    <div className="schedule-calendar h-full">
      <FullCalendar
        plugins={[timeGridPlugin]}
        initialView="timeGridWeek"
        initialDate={REF_MONDAY}
        headerToolbar={false}
        allDaySlot={false}
        weekends={false}
        slotMinTime={`${CALENDAR_START_HOUR.toString().padStart(2, '0')}:00:00`}
        slotMaxTime={`${CALENDAR_END_HOUR.toString().padStart(2, '0')}:00:00`}
        slotDuration="01:00:00"
        dayHeaderFormat={{ weekday: 'short' }}
        slotLabelFormat={{ hour: 'numeric', minute: '2-digit', meridiem: 'short' }}
        events={events}
        eventContent={renderEventContent}
        height="100%"
        expandRows
      />
    </div>
  );
}
