'use client';

import { Card } from '@/components/ui';
import { EmptyState } from '@/components/EmptyState';
import type { CareerViewProps } from './CareerView.types';

export function CareerView({ jobs, contacts }: CareerViewProps) {
  const hasJobs = jobs.length > 0;
  const hasContacts = contacts.length > 0;

  return (
    <div className="flex h-full flex-col">
      <header className="shrink-0 border-b border-border-subtle bg-background px-6 py-4">
        <h1 id="career-title" className="text-xl font-semibold text-text-primary">
          Career Center
        </h1>
        <p className="mt-1 text-sm text-text-secondary">
          Jobs, internships, and alumni contacts. Data from backend.
        </p>
      </header>

      <main className="flex-1 overflow-y-auto p-6" aria-labelledby="career-title">
        <section aria-labelledby="jobs-heading" className="mb-8">
          <h2 id="jobs-heading" className="text-lg font-semibold text-text-primary mb-4">
            Opportunities
          </h2>
          {!hasJobs ? (
            <EmptyState
              title="No jobs listed"
              description="Backend will provide job postings by major and interests."
            />
          ) : (
            <ul className="space-y-3" role="list">
              {jobs.map((job) => (
                <li key={job.id}>
                  <Card variant="default" padding="lg">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium text-text-primary">{job.position}</p>
                        <p className="text-sm text-text-secondary">{job.company}</p>
                        <p className="text-xs text-text-muted mt-1">
                          {job.location} · {job.type}
                        </p>
                      </div>
                    </div>
                  </Card>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section aria-labelledby="contacts-heading">
          <h2 id="contacts-heading" className="text-lg font-semibold text-text-primary mb-4">
            Network
          </h2>
          {!hasContacts ? (
            <EmptyState
              title="No contacts yet"
              description="Backend will provide alumni and network contacts."
            />
          ) : (
            <ul className="space-y-3" role="list">
              {contacts.map((c) => (
                <li key={c.id}>
                  <Card variant="default" padding="lg">
                    <p className="font-medium text-text-primary">{c.name}</p>
                    <p className="text-sm text-text-secondary">{c.title} at {c.company}</p>
                    {c.sector ? (
                      <p className="text-xs text-text-muted mt-1">{c.sector}</p>
                    ) : null}
                  </Card>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}
