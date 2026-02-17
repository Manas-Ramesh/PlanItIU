'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils/cn';

const CAREER_CARDS = [
  {
    href: '/career/interview-prep',
    title: 'Interview Prep',
    description:
      'Practice technical questions, get AI-powered feedback, and ace your interviews with HireVue-style mock sessions.',
    icon: 'target',
    features: [
      { label: 'Upload PDFs for custom practice', icon: 'document' },
      { label: 'AI-powered question drills', icon: 'brain' },
      { label: 'Mock video interviews & scoring', icon: 'video' },
    ],
    iconBg: 'bg-[var(--color-nav-active)]',
  },
  {
    href: '/career/jobs',
    title: 'Job Search',
    description:
      'Browse jobs by industry, track your applications, and manage your entire recruiting pipeline.',
    icon: 'search',
    features: [
      { label: 'Filter by banking, consulting, tech', icon: 'filter' },
      { label: 'Track applications & deadlines', icon: 'briefcase' },
      { label: 'Monitor interview progress', icon: 'chart' },
    ],
    iconBg: 'bg-[var(--color-feature-orange)]',
  },
  {
    href: '/career/networking',
    title: 'Networking',
    description:
      'Connect with IU alumni at top firms, build your network, and track your outreach campaigns.',
    icon: 'network',
    features: [
      { label: 'Swipe through alumni profiles', icon: 'people' },
      { label: 'Smart email templates & tracking', icon: 'envelope' },
      { label: 'Outreach analytics & insights', icon: 'chart' },
    ],
    iconBg: 'bg-[var(--color-feature-teal)]',
  },
] as const;

function TargetIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  );
}
function SearchIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <circle cx="11" cy="11" r="8" />
      <path d="M21 21l-4.35-4.35" />
    </svg>
  );
}
function NetworkIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}
function DocumentIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  );
}
function VideoIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <polygon points="23 7 16 12 23 17 23 7" />
      <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
    </svg>
  );
}
function FilterIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
    </svg>
  );
}
function BriefcaseIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  );
}
function ChartIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  );
}
function EnvelopeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  );
}
function PeopleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

export default function CareerChoosePathPage() {
  return (
    <div className="flex flex-col h-full">
      <main className="flex-1 overflow-y-auto p-6">
        <div className="mx-auto max-w-5xl">
          <h1 className="text-3xl font-bold text-[var(--color-text-primary)] text-center">
            Choose Your Career Path
          </h1>
          <p className="mt-2 text-[var(--color-text-secondary)] text-center">
            Select how you want to advance your career
          </p>
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {CAREER_CARDS.map((card) => (
              <Link
                key={card.href}
                href={card.href}
                className={cn(
                  'flex flex-col rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-bg-surface)] p-5',
                  'hover:border-[var(--color-nav-active)] transition'
                )}
              >
                <span
                  className={cn(
                    'flex size-14 shrink-0 items-center justify-center rounded-full text-[var(--color-text-on-brand)]',
                    card.iconBg
                  )}
                  aria-hidden
                >
                  {card.icon === 'target' && <TargetIcon className="size-7" />}
                  {card.icon === 'search' && <SearchIcon className="size-7" />}
                  {card.icon === 'network' && <NetworkIcon className="size-7" />}
                </span>
                <h2 className="mt-4 text-xl font-semibold text-[var(--color-text-primary)]">{card.title}</h2>
                <p className="mt-2 text-sm text-[var(--color-text-secondary)]">{card.description}</p>
                <ul className="mt-4 space-y-2">
                  {card.features.map((f) => (
                    <li key={f.label} className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
                      <span className="shrink-0 text-[var(--color-text-muted)]">
                        {f.icon === 'document' && <DocumentIcon className="size-4" />}
                        {f.icon === 'brain' && <span aria-hidden>🧠</span>}
                        {f.icon === 'video' && <VideoIcon className="size-4" />}
                        {f.icon === 'filter' && <FilterIcon className="size-4" />}
                        {f.icon === 'briefcase' && <BriefcaseIcon className="size-4" />}
                        {f.icon === 'chart' && <ChartIcon className="size-4" />}
                        {f.icon === 'people' && <PeopleIcon className="size-4" />}
                        {f.icon === 'envelope' && <EnvelopeIcon className="size-4" />}
                      </span>
                      {f.label}
                    </li>
                  ))}
                </ul>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
