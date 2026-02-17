'use client';

import { useState, useCallback } from 'react';
import { cn } from '@/lib/utils/cn';
import { Button, Card, Input } from '@/components/ui';
import { EmptyState } from '@/components/EmptyState';
import { parseCourseTime, CALENDAR_START_HOUR, CALENDAR_END_HOUR } from '@/lib/utils/scheduleTime';
import type { ScheduleViewProps } from './ScheduleView.types';
import type { Course } from '@/lib/types';

const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
const HOURS = Array.from(
  { length: CALENDAR_END_HOUR - CALENDAR_START_HOUR + 1 },
  (_, i) => CALENDAR_START_HOUR + i
);
const ROW_HEIGHT_PX = 56;

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

export function ScheduleView({
  currentSchedule,
  savedSchedules,
  onSaveSchedule,
  onDeleteSchedule,
}: ScheduleViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [scheduleName, setScheduleName] = useState('');
  const [expandedCourse, setExpandedCourse] = useState<string | null>(null);

  const handleSave = useCallback(() => {
    const name = scheduleName.trim() || `Schedule ${new Date().toISOString().slice(0, 10)}`;
    onSaveSchedule(name);
    setScheduleName('');
    setSaveDialogOpen(false);
  }, [scheduleName, onSaveSchedule]);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  }, []);

  const courses = currentSchedule?.courses ?? [];
  const canSaveMore = savedSchedules.length < 5;

  return (
    <div className="flex h-full flex-col">
      <header className="flex shrink-0 flex-wrap items-center gap-3 border-b border-border-subtle bg-background px-6 py-4">
        <h1 id="schedule-title" className="text-xl font-semibold text-text-primary">
          Plan your classes
        </h1>
        <Input
          type="search"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Search for a course…"
          aria-label="Search courses"
          className="max-w-xs"
        />
        <Button
          type="button"
          size="sm"
          className="border border-brand bg-transparent text-text-primary hover:bg-brand/10"
        >
          Add to generate schedule
        </Button>
        <Button
          type="button"
          size="sm"
          disabled={!canSaveMore}
          onClick={() => setSaveDialogOpen(true)}
        >
          Save schedule ({savedSchedules.length}/5)
        </Button>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <aside
          className="w-80 shrink-0 overflow-y-auto border-r border-border-subtle bg-surface p-4"
          aria-label="Current schedule"
        >
          <div className="flex gap-2 mb-3">
            <Button
              type="button"
              size="sm"
              className="bg-elevated text-text-primary hover:bg-border-strong border-0"
            >
              Regenerate
            </Button>
            <Button
              type="button"
              size="sm"
              className="bg-elevated text-text-primary hover:bg-border-strong border-0"
            >
              Undo
            </Button>
            <Button
              type="button"
              size="sm"
              className="bg-brand text-text-on-brand border-0"
            >
              Export
            </Button>
          </div>
          <div className="flex gap-4 text-xs font-medium text-text-muted mb-2">
            <span>Rating</span>
            <span>Grade</span>
            <span>Credits</span>
          </div>
          <h2 className="text-sm font-semibold text-text-primary sr-only">Current schedule</h2>
          {courses.length === 0 ? (
            <EmptyState
              title="No courses"
              description="Add courses to build your schedule. Backend will provide catalog."
              className="mt-4"
            />
          ) : (
            <ul className="mt-3 space-y-3" role="list">
              {courses.map((c) => (
                <li key={c.id}>
                  <CourseCard
                    course={c}
                    isExpanded={expandedCourse === c.id}
                    onToggleExpand={() =>
                      setExpandedCourse((id) => (id === c.id ? null : c.id))
                    }
                  />
                </li>
              ))}
            </ul>
          )}
        </aside>

        <main className="flex-1 overflow-auto p-6" aria-labelledby="schedule-title">
          <h2 className="text-lg font-semibold text-text-primary">Weekly Calendar View</h2>
          {courses.length === 0 ? (
            <div className="mt-4 rounded-xl border border-border-subtle bg-surface p-8">
              <EmptyState
                title="No schedule to display"
                description="Save or load a schedule to see the calendar."
              />
            </div>
          ) : (
            <>
              <p className="mt-2 text-sm text-text-muted">credits</p>
              <div className="mt-2 rounded-xl border border-border-subtle overflow-hidden">
                <CalendarGrid courses={courses} />
              </div>
            </>
          )}
        </main>
      </div>

      {saveDialogOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="save-schedule-title"
        >
          <Card variant="default" padding="lg" className="mx-4 w-full max-w-md">
            <h2 id="save-schedule-title" className="text-lg font-semibold text-text-primary">
              Save schedule
            </h2>
            <Input
              type="text"
              value={scheduleName}
              onChange={(e) => setScheduleName(e.target.value)}
              placeholder="Schedule name"
              className="mt-4"
              aria-label="Schedule name"
            />
            <div className="mt-4 flex justify-end gap-2">
              <Button variant="secondary" onClick={() => setSaveDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave}>Save</Button>
            </div>
          </Card>
        </div>
      ) : null}
    </div>
  );
}

function CourseCard({
  course,
  isExpanded,
  onToggleExpand,
}: {
  readonly course: Course;
  readonly isExpanded: boolean;
  readonly onToggleExpand: () => void;
}) {
  const variant = statusVariant(course.status, course.type);
  const tagLabel =
    course.status === 'justOpened'
      ? 'Just Opened!'
      : course.status === 'open'
        ? 'Open'
        : course.status === 'closed'
          ? 'Closed'
          : course.type === 'critical'
            ? 'Critical'
            : course.type === 'required'
              ? 'Required'
              : course.type === 'genEd'
                ? 'Gen Ed'
                : null;

  return (
    <Card
      variant="default"
      padding="md"
      className={cn(
        'flex flex-col gap-2 border border-border-subtle',
        'bg-course-block'
      )}
    >
      <div className="flex flex-wrap items-start justify-between gap-1">
        <span className="text-xs font-medium text-text-primary">{course.code}</span>
        <div className="flex flex-wrap gap-1">
          {tagLabel ? (
            <span
              className={cn(
                'rounded px-1.5 py-0.5 text-xs font-medium text-text-on-brand',
                variant === 'closed' && 'bg-danger',
                variant === 'critical' && 'bg-danger',
                variant === 'open' && tagLabel !== 'Just Opened!' && 'bg-tag-open',
                tagLabel === 'Just Opened!' && 'bg-tag-open',
                variant === 'required' && 'bg-feature-purple',
                variant === 'genEd' && 'bg-tag-open'
              )}
            >
              {tagLabel}
            </span>
          ) : null}
          <span className="rounded bg-tag-credits px-1.5 py-0.5 text-xs font-medium text-text-on-brand">
            {course.credits}cr
          </span>
        </div>
      </div>
      <p className="font-medium text-text-primary">{course.title}</p>
      <div className="flex items-center gap-2 text-sm text-text-secondary">
        {course.rating != null && (
          <span className="font-medium text-feature-amber" aria-hidden>★{course.rating}</span>
        )}
        {course.avgGrade && (
          <span className="rounded bg-feature-green px-1.5 py-0.5 text-xs font-medium text-text-on-brand">
            {course.avgGrade}
          </span>
        )}
      </div>
      {course.professor && (
        <p className="text-xs text-text-muted">{course.professor}</p>
      )}
      {course.time && (
        <p className="text-xs text-text-muted">{course.time}</p>
      )}
      {course.location && (
        <p className="text-xs text-text-muted">{course.location}</p>
      )}
      <button
        type="button"
        onClick={onToggleExpand}
        className="flex items-center gap-1 text-xs text-text-muted hover:text-text-secondary"
      >
        Course Description
        <span className={cn('transition', isExpanded && 'rotate-180')} aria-hidden>▼</span>
      </button>
      <button
        type="button"
        className="flex items-center gap-1 text-xs text-text-muted hover:text-text-secondary"
      >
        Rate My Professor
        <span aria-hidden>▼</span>
      </button>
      <Button
        type="button"
        size="sm"
        className="mt-1 bg-brand text-text-on-brand hover:opacity-90 border-0"
      >
        Swap Class
      </Button>
    </Card>
  );
}

function CalendarGrid({ courses }: { readonly courses: ReadonlyArray<Course> }) {
  const blocks: Array<{
    course: Course;
    dayIndex: number;
    startMinutes: number;
    endMinutes: number;
  }> = [];
  for (const course of courses) {
    if (!course.time) continue;
    const parsed = parseCourseTime(course.time);
    if (!parsed) continue;
    for (const meeting of parsed) {
      for (const dayIndex of meeting.dayIndices) {
        blocks.push({
          course,
          dayIndex,
          startMinutes: meeting.startMinutes,
          endMinutes: meeting.endMinutes,
        });
      }
    }
  }

  return (
    <div className="grid grid-cols-[auto_1fr_1fr_1fr_1fr_1fr] gap-px bg-border-subtle">
      <div className="bg-surface p-2" aria-hidden />
      {DAY_LABELS.map((day) => (
        <div
          key={day}
          className="bg-surface p-2 text-center text-sm font-medium text-text-primary"
        >
          {day}
        </div>
      ))}
      {HOURS.map((hour) => (
        <div key={hour} className="contents">
          <div
            className="bg-surface py-1 pr-2 text-right text-xs text-text-muted"
            aria-hidden
          >
            {hour === 12 ? '12' : hour % 12}:00 {hour >= 12 ? 'PM' : 'AM'}
          </div>
          {DAY_LABELS.map((_, dayIndex) => (
            <div
              key={`${hour}-${dayIndex}`}
              className="relative bg-background overflow-visible"
              style={{ height: ROW_HEIGHT_PX }}
            >
              {blocks
                .filter(
                  (b) =>
                    b.dayIndex === dayIndex &&
                    b.startMinutes >= hour * 60 &&
                    b.startMinutes < (hour + 1) * 60
                )
                .map((b) => {
                  const top = (b.startMinutes - hour * 60) / 60 * ROW_HEIGHT_PX;
                  const height =
                    (b.endMinutes - b.startMinutes) / 60 * ROW_HEIGHT_PX;
                  return (
                    <div
                      key={`${b.course.id}-${b.dayIndex}-${b.startMinutes}`}
                      className="absolute left-1 right-1 rounded border border-border-subtle bg-course-block p-1.5 text-xs overflow-hidden z-10"
                      style={{ top, height: Math.max(height, 28) }}
                    >
                      <p className="truncate font-medium text-text-primary">
                        {b.course.code} {b.course.title}
                      </p>
                      <p className="truncate text-text-muted">{b.course.time}</p>
                      {b.course.location && (
                        <p className="truncate text-text-muted">{b.course.location}</p>
                      )}
                    </div>
                  );
                })}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
