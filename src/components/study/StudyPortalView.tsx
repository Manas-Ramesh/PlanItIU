'use client';

import { useState } from 'react';
import { Button, Card } from '@/components/ui';
import { EmptyState } from '@/components/EmptyState';
import type { StudyPortalViewProps } from './StudyPortalView.types';

export function StudyPortalView({
  coursesByMonth,
  downloadCredits,
  onUpload,
  onDownload,
}: StudyPortalViewProps) {
  const [selectedMonth, setSelectedMonth] = useState<string | null>(
    coursesByMonth.length > 0 ? coursesByMonth[0].month : null
  );
  const [uploadModalOpen, setUploadModalOpen] = useState(false);

  const current = coursesByMonth.find((m) => m.month === selectedMonth);
  const courses = current?.courses ?? [];

  return (
    <div className="flex h-full flex-col">
      <header className="shrink-0 border-b border-border-subtle bg-background px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 id="study-title" className="text-xl font-semibold text-text-primary">
              Study Portal
            </h1>
            <p className="mt-1 text-sm text-text-secondary">
              Practice tests, study guides, flashcards. Upload material to earn download credits.
            </p>
          </div>
          <div className="flex items-center gap-2">
            {downloadCredits > 0 ? (
              <span className="text-sm text-text-secondary">
                {downloadCredits} credit{downloadCredits !== 1 ? 's' : ''}
              </span>
            ) : null}
            <Button type="button" size="sm" onClick={() => setUploadModalOpen(true)}>
              Upload material
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-6" aria-labelledby="study-title">
        {coursesByMonth.length === 0 ? (
          <EmptyState
            title="No study materials"
            description="Upload course materials to earn download credits. Backend will list materials by month."
          />
        ) : (
          <div className="space-y-4">
            <div className="flex gap-2 flex-wrap">
              {coursesByMonth.map((m) => (
                <Button
                  key={m.month}
                  type="button"
                  variant={selectedMonth === m.month ? 'primary' : 'secondary'}
                  size="sm"
                  onClick={() => setSelectedMonth(m.month)}
                >
                  {m.month}
                </Button>
              ))}
            </div>
            {courses.length === 0 ? (
              <EmptyState
                title="No materials for this month"
                description="Select another month or upload materials."
              />
            ) : (
              <ul className="space-y-4" role="list">
                {courses.map((course) => (
                  <li key={course.courseCode}>
                    <Card variant="default" padding="lg">
                      <h2 className="font-semibold text-text-primary">
                        {course.courseCode} – {course.courseName}
                      </h2>
                      <ul className="mt-3 space-y-2" role="list">
                        {course.materials.map((mat) => (
                          <li
                            key={mat.id}
                            className="flex items-center justify-between rounded-lg border border-border-subtle bg-background px-3 py-2"
                          >
                            <span className="text-sm text-text-primary">{mat.name}</span>
                            <Button
                              type="button"
                              variant="secondary"
                              size="sm"
                              onClick={() => onDownload(mat, course)}
                              disabled={downloadCredits <= 0}
                            >
                              Download
                            </Button>
                          </li>
                        ))}
                      </ul>
                    </Card>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </main>

      {uploadModalOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="upload-study-title"
        >
          <Card variant="default" padding="lg" className="mx-4 w-full max-w-md">
            <h2 id="upload-study-title" className="text-lg font-semibold text-text-primary">
              Upload material
            </h2>
            <p className="mt-2 text-sm text-text-secondary">
              Backend will handle file upload and credit assignment.
            </p>
            <div className="mt-4 flex gap-2 justify-end">
              <Button variant="secondary" onClick={() => setUploadModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => { onUpload({}); setUploadModalOpen(false); }}>
                Confirm
              </Button>
            </div>
          </Card>
        </div>
      ) : null}
    </div>
  );
}
