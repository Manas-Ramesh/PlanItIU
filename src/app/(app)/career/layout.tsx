'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils/cn';

const SECTIONS = [
  { label: 'Job Search', href: '/career/jobs' },
  { label: 'Networking', href: '/career/networking' },
  { label: 'Interview Prep', href: '/career/interview-prep' },

] as const;

export default function CareerLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* Header */}
      <header className="shrink-0 border-b border-[var(--color-border-subtle)]/30 px-6 py-[10px] flex items-center gap-4">
        <div className="size-9 rounded-xl flex items-center justify-center bg-[var(--color-brand-primary)]/10 shrink-0">
          <svg className="size-4.5 text-[var(--color-brand-primary)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="text-[17px] font-bold text-[var(--color-text-primary)]">Career Center</h1>
            <span className="hidden sm:inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-semibold bg-[var(--color-brand-primary)]/10 text-[var(--color-brand-primary)] uppercase tracking-wider">
              PlanIt AI
            </span>
          </div>
          <p className="text-[11px] text-[var(--color-text-muted)]">Interview prep, job search, and professional networking</p>
        </div>
      </header>

      {/* Top section tab bar */}
      <div className="shrink-0 flex gap-0 border-b border-[var(--color-border-subtle)]/30 px-6">
        {SECTIONS.map((s) => (
          <Link
            key={s.href}
            href={s.href}
            className={cn(
              'px-4 py-2.5 text-[12px] font-semibold border-b-2 transition-colors -mb-px',
              pathname.startsWith(s.href)
                ? 'border-[var(--color-brand-primary)] text-[var(--color-brand-primary)]'
                : 'border-transparent text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]'
            )}
          >
            {s.label}
          </Link>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 min-h-0 overflow-hidden">
        {children}
      </div>
    </div>
  );
}
