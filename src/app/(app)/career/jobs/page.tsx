'use client';

import { useSearchParams } from 'next/navigation';
import { CareerSubLayout } from '@/components/career/CareerSubLayout';
import { SAMPLE_JOBS, SAMPLE_APPLICATIONS } from '@/lib/data/sampleData';
import { Button } from '@/components/ui';
import { cn } from '@/lib/utils/cn';

const TABS = [
  { href: '/career/jobs?tab=browse', label: 'Browse Jobs' },
  { href: '/career/jobs?tab=tracker', label: 'Application Tracker' },
] as const;

export default function CareerJobsPage() {
  const searchParams = useSearchParams();
  const tab = (searchParams.get('tab') as 'browse' | 'tracker') || 'browse';

  return (
    <CareerSubLayout
      title="Job Search"
      subtitle="Browse opportunities and track your applications"
      tabs={TABS}
    >
      {tab === 'browse' && <BrowseJobsTab />}
      {tab === 'tracker' && <ApplicationTrackerTab />}
    </CareerSubLayout>
  );
}

function BrowseJobsTab() {
  const jobTags = ['Internship', 'Full-time', 'Remote', 'Entry-Level'] as const;
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-bg-surface)] p-4">
        <h3 className="text-sm font-medium text-[var(--color-text-primary)] mb-3">Job Type</h3>
        <div className="flex flex-wrap gap-2">
          {['Full-time', 'Part-time', 'Contract', 'Temporary', 'Internship', 'Volunteer', 'Other'].map((t) => (
            <label key={t} className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
              <input type="checkbox" className="rounded border-[var(--color-border-subtle)]" />
              {t}
            </label>
          ))}
        </div>
        <h3 className="text-sm font-medium text-[var(--color-text-primary)] mt-4 mb-2">Job Level</h3>
        <div className="flex flex-wrap gap-2">
          {['Entry Level', 'Mid Level', 'Senior Level', 'Director', 'Executive'].map((t) => (
            <label key={t} className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
              <input type="checkbox" className="rounded border-[var(--color-border-subtle)]" />
              {t}
            </label>
          ))}
        </div>
        <h3 className="text-sm font-medium text-[var(--color-text-primary)] mt-4 mb-2">Custom Filters</h3>
        <div className="flex flex-wrap gap-2">
          {['Remote', 'On-site', 'Hybrid', 'With Sponsorship'].map((t) => (
            <label key={t} className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
              <input type="checkbox" className="rounded border-[var(--color-border-subtle)]" />
              {t}
            </label>
          ))}
        </div>
      </div>
      <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">All Jobs</h2>
      <ul className="space-y-4">
        {SAMPLE_JOBS.map((job) => (
          <li
            key={job.id}
            className="rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-bg-surface)] p-4 flex flex-col gap-3"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex gap-3">
                <span className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-[var(--color-nav-active)] text-[var(--color-text-on-brand)] font-bold">
                  P
                </span>
                <div>
                  <h3 className="font-semibold text-[var(--color-text-primary)]">{job.position}</h3>
                  <p className="text-sm text-[var(--color-text-muted)]">{job.location}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-1">
                {jobTags.map((tag) => (
                  <span
                    key={tag}
                    className={cn(
                      'rounded-full px-2 py-0.5 text-xs font-medium',
                      tag === 'Internship' && 'bg-[var(--color-nav-active)] text-[var(--color-text-on-brand)]',
                      tag === 'Full-time' && 'bg-[var(--color-brand-primary)] text-[var(--color-text-on-brand)]',
                      tag === 'Remote' && 'bg-[var(--color-feature-green)] text-[var(--color-text-on-brand)]',
                      tag === 'Entry-Level' && 'bg-[var(--color-feature-pink)] text-[var(--color-text-on-brand)]'
                    )}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <p className="text-sm text-[var(--color-text-secondary)]">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="text-xs text-[var(--color-text-muted)]">Skills:</span>
              {['React', 'Node.js', 'Python'].map((s) => (
                <span key={s} className="rounded bg-[var(--color-bg-elevated)] px-2 py-0.5 text-xs text-[var(--color-text-secondary)]">
                  {s}
                </span>
              ))}
            </div>
            <div className="flex items-center justify-between pt-2">
              <div className="text-sm text-[var(--color-text-muted)]">
                <span className="block">Company: {job.company}</span>
                <span className="block">Date Posted: {job.posted}</span>
                <span className="block">Salary: $75,000 - $85,000</span>
              </div>
              <div className="flex gap-2">
                <Button variant="secondary">Reject</Button>
                <Button>Apply</Button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ApplicationTrackerTab() {
  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-[var(--color-text-primary)]">Application Tracker</h2>
          <p className="text-sm text-[var(--color-text-secondary)]">Track your job applications and interview progress</p>
        </div>
        <Button className="gap-2">+ Add Application</Button>
      </div>
      <div className="overflow-x-auto rounded-xl border border-[var(--color-border-subtle)]">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--color-border-subtle)] bg-[var(--color-bg-elevated)] text-left">
              <th className="p-3 font-medium text-[var(--color-text-primary)]">Company</th>
              <th className="p-3 font-medium text-[var(--color-text-primary)]">Position</th>
              <th className="p-3 font-medium text-[var(--color-text-primary)]">Location</th>
              <th className="p-3 font-medium text-[var(--color-text-primary)]">Salary</th>
              <th className="p-3 font-medium text-[var(--color-text-primary)]">Deadline</th>
              <th className="p-3 font-medium text-[var(--color-text-primary)]">Contact</th>
              <th className="p-3 font-medium text-[var(--color-text-primary)]">Status</th>
            </tr>
          </thead>
          <tbody>
            {SAMPLE_APPLICATIONS.map((row, i) => (
              <tr key={i} className="border-b border-[var(--color-border-subtle)] hover:bg-[var(--color-bg-surface)]">
                <td className="p-3">
                  <span className="inline-flex items-center gap-2">
                    <span className="flex size-8 items-center justify-center rounded-full bg-[var(--color-nav-active)] text-[var(--color-text-on-brand)] text-xs font-bold">
                      A
                    </span>
                    {row.company}
                  </span>
                </td>
                <td className="p-3 text-[var(--color-text-secondary)]">{row.position}</td>
                <td className="p-3 text-[var(--color-text-secondary)]">{row.location}</td>
                <td className="p-3 text-[var(--color-text-secondary)]">{row.salary}</td>
                <td className="p-3 text-[var(--color-text-secondary)]">{row.deadline}</td>
                <td className="p-3 text-[var(--color-text-secondary)]">{row.contact}</td>
                <td className="p-3">
                  <span
                    className={cn(
                      'inline-block rounded px-2 py-1 text-xs font-medium',
                      row.status === 'Applied' && 'bg-[var(--color-nav-active)] text-[var(--color-text-on-brand)]',
                      row.status === 'Interview' && 'bg-[var(--color-brand-primary)] text-[var(--color-text-on-brand)]',
                      row.status === 'Offer' && 'bg-[var(--color-feature-orange)] text-[var(--color-text-on-brand)]'
                    )}
                  >
                    {row.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
