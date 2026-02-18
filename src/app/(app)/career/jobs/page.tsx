'use client';

import { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { SAMPLE_JOBS, SAMPLE_APPLICATIONS } from '@/lib/data/sampleData';
import type { JobPosting } from '@/lib/types';
import { Button } from '@/components/ui';
import { cn } from '@/lib/utils/cn';

function CareerJobsPageInner() {
  const searchParams = useSearchParams();
  const tab = (searchParams.get('tab') as 'browse' | 'tracker') || 'browse';

  return (
    <div className="flex flex-col h-full">
      <header className="shrink-0 border-b border-[var(--color-border-subtle)]/30 bg-[var(--color-bg-base)] px-6 py-[15.5px]">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="flex size-8 items-center justify-center rounded-lg bg-[var(--color-feature-orange)]/10 border border-[var(--color-feature-orange)]/20 shrink-0">
              <svg className="size-4 text-[var(--color-feature-orange)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
            </div>
            <h1 className="text-xl font-semibold text-[var(--color-text-primary)]">Job Search</h1>
            <span className="rounded-full bg-[var(--color-feature-orange)]/10 border border-[var(--color-feature-orange)]/20 px-3 py-0.5 text-xs font-semibold text-[var(--color-feature-orange)]">
              Pipeline
            </span>
          </div>
        </div>
      </header>
      <main className="flex-1 overflow-y-auto p-6">
        {tab === 'browse' && <BrowseJobsTab />}
        {tab === 'tracker' && <ApplicationTrackerTab />}
      </main>
    </div>
  );
}

const JOB_DETAILS: Record<string, { salary: string; skills: string[]; about: string; perks: string[]; links: { label: string; url: string }[] }> = {
  j1: {
    salary: '$75k – $85k / yr',
    skills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL'],
    about: 'Join our engineering team to build and ship user-facing features across web and mobile. You\'ll work closely with design, product, and data to deliver impactful work from day one.',
    perks: ['Hybrid / SF office', 'Equity package', 'Unlimited PTO', 'Learning stipend'],
    links: [
      { label: 'Company Website', url: '#' },
      { label: 'Glassdoor Reviews', url: '#' },
      { label: 'LinkedIn Page', url: '#' },
    ],
  },
  j2: {
    salary: '$40 / hr',
    skills: ['Product Strategy', 'SQL', 'Figma', 'A/B Testing'],
    about: 'Drive product strategy and roadmap for our core platform. Partner with engineering and design to define, prioritize, and ship features that delight users and grow the business.',
    perks: ['Fully remote', 'Flexible hours', 'Home office budget'],
    links: [
      { label: 'Company Website', url: '#' },
      { label: 'LinkedIn Page', url: '#' },
    ],
  },
};

function BrowseJobsTab() {
  const [selectedId, setSelectedId] = useState<string>(SAMPLE_JOBS[0]?.id ?? '');
  const selected = SAMPLE_JOBS.find((j) => j.id === selectedId) ?? SAMPLE_JOBS[0];
  const details = selected ? JOB_DETAILS[selected.id] : undefined;

  return (
    <div className="flex flex-col h-full -m-6">
      {/* Search bar pinned at top */}
      <div className="shrink-0 flex items-center gap-3 px-5 py-3 border-b border-[var(--color-border-subtle)]/30">
        <div className="flex flex-1 items-center gap-2 rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-bg-surface)] px-3 py-2">
          <svg className="size-4 text-[var(--color-text-muted)] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
          <input
            type="text"
            placeholder="Search jobs..."
            className="flex-1 bg-transparent text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] outline-none"
          />
        </div>
        <div className="flex gap-1.5">
          {['All', 'Internship', 'Full-time', 'Remote'].map((tag, i) => (
            <button
              key={tag}
              type="button"
              className={cn(
                'rounded-full px-3 py-1.5 text-[11px] font-medium transition-colors',
                i === 0
                  ? 'bg-[var(--color-brand-primary)] text-[var(--color-text-on-brand)]'
                  : 'border border-[var(--color-border-subtle)] text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:border-[var(--color-brand-primary)]/40'
              )}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Master-detail split */}
      <div className="flex flex-1 min-h-0">
        {/* Left: scrollable job list */}
        <div className="w-[320px] shrink-0 border-r border-[var(--color-border-subtle)]/30 overflow-y-auto">
          <div className="px-3 py-2">
            <p className="text-[11px] text-[var(--color-text-muted)] px-2">
              <span className="font-medium text-[var(--color-text-primary)]">{SAMPLE_JOBS.length}</span> jobs found
            </p>
          </div>
          <ul role="list" className="px-2 pb-3 space-y-1">
            {SAMPLE_JOBS.map((job) => {
              const isSelected = job.id === selectedId;
              const extras = JOB_DETAILS[job.id];
              return (
                <li key={job.id}>
                  <button
                    type="button"
                    onClick={() => setSelectedId(job.id)}
                    className={cn(
                      'w-full text-left rounded-xl p-3.5 transition-all duration-150',
                      isSelected
                        ? 'bg-[var(--color-brand-primary)]/8 border border-[var(--color-brand-primary)]/25'
                        : 'border border-transparent hover:bg-[var(--color-bg-surface)]/60'
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <span className={cn(
                        'flex size-9 shrink-0 items-center justify-center rounded-lg text-[12px] font-bold',
                        isSelected
                          ? 'bg-[var(--color-brand-primary)]/15 text-[var(--color-brand-primary)]'
                          : 'bg-[var(--color-bg-elevated)] text-[var(--color-text-muted)]'
                      )}>
                        {job.company.charAt(0)}
                      </span>
                      <div className="min-w-0 flex-1">
                        <h3 className={cn(
                          'text-[13px] font-semibold leading-tight truncate',
                          isSelected ? 'text-[var(--color-text-primary)]' : 'text-[var(--color-text-secondary)]'
                        )}>
                          {job.position}
                        </h3>
                        <p className="text-[11px] text-[var(--color-text-muted)] mt-0.5">{job.company}</p>
                        <div className="flex items-center gap-2 mt-1.5 text-[10px] text-[var(--color-text-muted)]">
                          <span className="flex items-center gap-1">
                            <svg className="size-2.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
                            {job.location}
                          </span>
                          <span>·</span>
                          <span>{job.posted}</span>
                        </div>
                        {extras && (
                          <p className="text-[10px] font-medium text-[var(--color-feature-green)] mt-1">{extras.salary}</p>
                        )}
                      </div>
                      <span
                        className={cn(
                          'shrink-0 rounded-full px-1.5 py-0.5 text-[9px] font-semibold mt-0.5',
                          job.type === 'Internship' && 'bg-[var(--color-nav-active)]/15 text-[var(--color-nav-active)]',
                          job.type === 'Full-time' && 'bg-[var(--color-brand-primary)]/10 text-[var(--color-brand-primary)]',
                          job.type === 'Part-time' && 'bg-[var(--color-feature-orange)]/15 text-[var(--color-feature-orange)]',
                          job.type === 'Co-op' && 'bg-[var(--color-feature-teal)]/15 text-[var(--color-feature-teal)]'
                        )}
                      >
                        {job.type}
                      </span>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Right: detail panel */}
        <div className="flex-1 min-w-0 overflow-y-auto">
          {selected ? (
            <div className="p-6 space-y-6">
              {/* Header */}
              <div className="flex items-start gap-4">
                <span className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-[var(--color-brand-primary)]/10 border border-[var(--color-brand-primary)]/20 text-lg font-bold text-[var(--color-brand-primary)]">
                  {selected.company.charAt(0)}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">{selected.position}</h2>
                      <p className="text-sm text-[var(--color-text-secondary)]">{selected.company}</p>
                    </div>
                    <span
                      className={cn(
                        'shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold',
                        selected.type === 'Internship' && 'bg-[var(--color-nav-active)]/15 text-[var(--color-nav-active)]',
                        selected.type === 'Full-time' && 'bg-[var(--color-brand-primary)]/10 text-[var(--color-brand-primary)]',
                        selected.type === 'Part-time' && 'bg-[var(--color-feature-orange)]/15 text-[var(--color-feature-orange)]',
                        selected.type === 'Co-op' && 'bg-[var(--color-feature-teal)]/15 text-[var(--color-feature-teal)]'
                      )}
                    >
                      {selected.type}
                    </span>
                  </div>
                  {/* Quick stats row */}
                  <div className="mt-3 flex flex-wrap items-center gap-3 text-[12px] text-[var(--color-text-muted)]">
                    <span className="flex items-center gap-1.5">
                      <svg className="size-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
                      {selected.location}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <svg className="size-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                      Posted {selected.posted}
                    </span>
                    {details?.salary && (
                      <span className="flex items-center gap-1.5 font-medium text-[var(--color-feature-green)]">
                        <svg className="size-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
                        {details.salary}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <Button>Apply Now</Button>
                <Button variant="secondary">Save Job</Button>
              </div>

              {/* About */}
              {details?.about && (
                <section>
                  <h3 className="text-[13px] font-semibold text-[var(--color-text-primary)] mb-2">About this role</h3>
                  <p className="text-[13px] leading-relaxed text-[var(--color-text-secondary)]">{details.about}</p>
                </section>
              )}

              {/* Skills */}
              {details?.skills && (
                <section>
                  <h3 className="text-[13px] font-semibold text-[var(--color-text-primary)] mb-2">Required Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {details.skills.map((s) => (
                      <span key={s} className="rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-bg-elevated)] px-2.5 py-1 text-[12px] font-medium text-[var(--color-text-secondary)]">
                        {s}
                      </span>
                    ))}
                  </div>
                </section>
              )}

              {/* Perks */}
              {details?.perks && (
                <section>
                  <h3 className="text-[13px] font-semibold text-[var(--color-text-primary)] mb-2">Perks &amp; Benefits</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {details.perks.map((p) => (
                      <div key={p} className="flex items-center gap-2 rounded-lg bg-[var(--color-bg-surface)] border border-[var(--color-border-subtle)]/50 px-3 py-2">
                        <svg className="size-3.5 shrink-0 text-[var(--color-feature-green)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        <span className="text-[12px] text-[var(--color-text-secondary)]">{p}</span>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* External Links */}
              {details?.links && (
                <section>
                  <h3 className="text-[13px] font-semibold text-[var(--color-text-primary)] mb-2">External Links</h3>
                  <div className="flex flex-col gap-1.5">
                    {details.links.map((link) => (
                      <a
                        key={link.label}
                        href={link.url}
                        className="group/link flex items-center justify-between rounded-lg border border-[var(--color-border-subtle)]/50 bg-[var(--color-bg-surface)] px-3.5 py-2.5 transition-colors hover:border-[var(--color-brand-primary)]/30"
                      >
                        <span className="flex items-center gap-2.5">
                          <svg className="size-4 text-[var(--color-text-muted)] group-hover/link:text-[var(--color-brand-primary)] transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                            <polyline points="15 3 21 3 21 9" />
                            <line x1="10" y1="14" x2="21" y2="3" />
                          </svg>
                          <span className="text-[12px] font-medium text-[var(--color-text-secondary)] group-hover/link:text-[var(--color-text-primary)] transition-colors">{link.label}</span>
                        </span>
                        <svg className="size-3.5 text-[var(--color-text-muted)]/50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                          <polyline points="9 18 15 12 9 6" />
                        </svg>
                      </a>
                    ))}
                  </div>
                </section>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-sm text-[var(--color-text-muted)]">
              Select a job to view details
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ApplicationTrackerTab() {
  const statusCounts = {
    Applied: SAMPLE_APPLICATIONS.filter((r) => r.status === 'Applied').length,
    Interview: SAMPLE_APPLICATIONS.filter((r) => r.status === 'Interview').length,
    Offer: SAMPLE_APPLICATIONS.filter((r) => r.status === 'Offer').length,
  };

  return (
    <div className="mx-auto max-w-5xl space-y-5">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">Application Tracker</h2>
          <p className="text-[13px] text-[var(--color-text-muted)]">Track your pipeline across all stages</p>
        </div>
        <Button className="flex flex-column flex-nowrap items-center gap-2 w-[220px]">
          <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          <p className="text-sm">Add Application</p>
        </Button>
      </div>

      {/* Status summary cards */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Applied', count: statusCounts.Applied, color: 'var(--color-nav-active)' },
          { label: 'Interview', count: statusCounts.Interview, color: 'var(--color-brand-primary)' },
          { label: 'Offer', count: statusCounts.Offer, color: 'var(--color-feature-green)' },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-bg-surface)] p-4"
          >
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full" style={{ background: s.color }} aria-hidden />
              <span className="text-xs font-medium uppercase tracking-wider text-[var(--color-text-muted)]">{s.label}</span>
            </div>
            <p className="mt-1.5 text-2xl font-bold text-[var(--color-text-primary)]">{s.count}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-bg-surface)]">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--color-border-subtle)] bg-[var(--color-bg-elevated)]">
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">Company</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">Position</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">Location</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">Salary</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">Deadline</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">Contact</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-border-subtle)]/50">
            {SAMPLE_APPLICATIONS.map((row, i) => (
              <tr key={i} className="transition-colors hover:bg-[var(--color-bg-elevated)]/50">
                <td className="px-4 py-3.5">
                  <span className="inline-flex items-center gap-2.5">
                    <span
                      className={cn(
                        'flex size-8 shrink-0 items-center justify-center rounded-lg text-[11px] font-bold',
                        row.status === 'Applied' && 'bg-[var(--color-nav-active)]/15 text-[var(--color-nav-active)]',
                        row.status === 'Interview' && 'bg-[var(--color-brand-primary)]/15 text-[var(--color-brand-primary)]',
                        row.status === 'Offer' && 'bg-[var(--color-feature-green)]/15 text-[var(--color-feature-green)]'
                      )}
                    >
                      {row.company.charAt(0)}
                    </span>
                    <span className="font-medium text-[var(--color-text-primary)]">{row.company}</span>
                  </span>
                </td>
                <td className="px-4 py-3.5 text-[var(--color-text-secondary)]">{row.position}</td>
                <td className="px-4 py-3.5 text-[var(--color-text-muted)]">{row.location}</td>
                <td className="px-4 py-3.5 font-medium text-[var(--color-text-primary)]">{row.salary}</td>
                <td className="px-4 py-3.5 text-[var(--color-text-muted)]">{row.deadline}</td>
                <td className="px-4 py-3.5 text-[var(--color-text-secondary)]">{row.contact}</td>
                <td className="px-4 py-3.5">
                  <span
                    className={cn(
                      'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold',
                      row.status === 'Applied' && 'bg-[var(--color-nav-active)]/15 text-[var(--color-nav-active)]',
                      row.status === 'Interview' && 'bg-[var(--color-brand-primary)]/10 text-[var(--color-brand-primary)]',
                      row.status === 'Offer' && 'bg-[var(--color-feature-green)]/15 text-[var(--color-feature-green)]'
                    )}
                  >
                    <span className="size-1.5 rounded-full" style={{ background: 'currentColor' }} aria-hidden />
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

export default function CareerJobsPage() {
  return (
    <Suspense fallback={<div className="flex h-full" />}>
      <CareerJobsPageInner />
    </Suspense>
  );
}
