'use client';

import { cn } from '@/lib/utils/cn';
import { Card, Progress } from '@/components/ui';
import { EmptyState } from '@/components/EmptyState';
import type { DegreeProgressViewProps } from './DegreeProgressView.types';

export function DegreeProgressView({
  semesters,
  overall,
  userProfile,
}: DegreeProgressViewProps) {
  const percentage = overall
    ? Math.round((overall.completedCredits / overall.totalCredits) * 1000) / 10
    : 0;
  const remaining = overall ? overall.totalCredits - overall.completedCredits : 0;

  return (
    <div className="flex h-full flex-col">
      <header className="shrink-0 border-b border-border-subtle bg-background px-6 py-4">
        <h1 id="degree-progress-title" className="text-xl font-semibold text-text-primary">
          Degree Progress
        </h1>
        <p className="mt-1 text-sm text-text-secondary">
          Track your progress towards graduation
        </p>
      </header>

      <main className="flex-1 overflow-y-auto p-6" aria-labelledby="degree-progress-title">
        {overall ? (
          <Card
            variant="default"
            padding="lg"
            className="mb-6 bg-[var(--color-nav-active)]/10 border-[var(--color-nav-active)]/30"
          >
            <div className="flex items-center gap-2">
              <span className="text-nav-active" aria-hidden>
                <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                  <path d="M6 12v5c3 3 9 3 12 0v-5" />
                </svg>
              </span>
              <h2 className="font-semibold text-text-primary">Overall Progress</h2>
            </div>
            <p className="mt-1 text-sm text-text-secondary">{overall.degreeName}</p>
            <div className="mt-3 flex items-center gap-4">
              <Progress value={percentage} max={100} className="flex-1 h-3" />
              <div className="text-right shrink-0">
                <p className="text-2xl font-bold text-text-primary">{percentage}%</p>
                <p className="text-xs text-text-muted">{remaining} credits remaining</p>
              </div>
            </div>
            <p className="mt-2 text-sm text-text-muted">
              {overall.completedCredits} / {overall.totalCredits} credits · Expected graduation: {overall.expectedGraduation}
            </p>
          </Card>
        ) : null}

        {semesters.length === 0 ? (
          <EmptyState
            title="No degree data"
            description="Upload transcript or connect backend to see semester blocks and requirements."
          />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2">
            {semesters.map((sem) => (
              <Card key={sem.name} variant="default" padding="lg">
                <div className="flex items-center justify-between">
                  <h2 className="font-semibold text-text-primary">{sem.name}</h2>
                  <span className="text-sm text-text-secondary">{sem.credits}</span>
                </div>
                <Progress value={sem.percentage} className="mt-2" />
                <ul className="mt-4 space-y-3" role="list">
                  {sem.courses.map((req, i) => (
                    <li
                      key={req.name + String(i)}
                      className={cn(
                        'flex gap-2 text-sm rounded-lg p-2',
                        req.completed ? 'bg-[var(--color-success)]/10' : 'bg-elevated/50'
                      )}
                    >
                      <span
                        className={cn(
                          'shrink-0',
                          req.completed ? 'text-[var(--color-success)]' : 'text-text-muted'
                        )}
                        aria-hidden
                      >
                        {req.completed ? '✓' : '○'}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-1">
                          <span className="text-text-primary font-medium">{req.name}</span>
                          {req.critical ? (
                            <span className="rounded bg-danger px-1.5 py-0.5 text-xs font-medium text-white">
                              CRITICAL
                            </span>
                          ) : null}
                        </div>
                        <p className="text-xs text-text-muted mt-0.5">
                          {req.creditsRequired ?? 3} credits required
                          {req.fulfilledBy ? ` · Fulfilled by ${req.fulfilledBy}` : null}
                          {req.canBeFulfilledBy?.length ? ` · Can be fulfilled by ${req.canBeFulfilledBy.join(', ')}` : null}
                        </p>
                        {req.code ? <p className="text-xs text-text-muted">{req.code}</p> : null}
                      </div>
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
