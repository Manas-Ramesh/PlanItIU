'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils/cn';

const SECTIONS = [
  {
    label: 'Interview Prep',
    href: '/career/interview-prep',
    icon: 'target' as const,
    tabs: [
      { label: 'Practice Chat', href: '/career/interview-prep?tab=practice' },
      { label: 'Question Drills', href: '/career/interview-prep?tab=drills' },
      { label: 'Mock Interview', href: '/career/interview-prep?tab=mock' },
    ],
  },
  {
    label: 'Job Search',
    href: '/career/jobs',
    icon: 'search' as const,
    tabs: [
      { label: 'Browse Jobs', href: '/career/jobs?tab=browse' },
      { label: 'Application Tracker', href: '/career/jobs?tab=tracker' },
    ],
  },
  {
    label: 'Networking',
    href: '/career/networking',
    icon: 'network' as const,
    tabs: [
      { label: 'Swipe Contacts', href: '/career/networking?tab=swipe' },
      { label: 'My Network', href: '/career/networking?tab=network' },
      { label: 'Outreach Analytics', href: '/career/networking?tab=analytics' },
    ],
  },
] as const;

function SectionIcon({ type, className }: { type: 'target' | 'search' | 'network'; className?: string }) {
  const c = cn('size-[16px] shrink-0', className);
  switch (type) {
    case 'target':
      return (
        <svg className={c} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
          <circle cx="12" cy="12" r="10" />
          <circle cx="12" cy="12" r="6" />
          <circle cx="12" cy="12" r="2" />
        </svg>
      );
    case 'search':
      return (
        <svg className={c} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
          <circle cx="11" cy="11" r="8" />
          <path d="M21 21l-4.35-4.35" />
        </svg>
      );
    case 'network':
      return (
        <svg className={c} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      );
  }
}

export default function CareerLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentFull = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '');

  return (
    <div className="flex h-full">
      {/* Secondary sidebar */}
      <aside
        className={cn(
          'shrink-0 w-[220px] flex flex-col h-full',
          'bg-[var(--color-bg-elevated)] border-r border-[var(--color-border-subtle)]/40',
          'overflow-y-auto'
        )}
        aria-label="Career navigation"
      >
        {/* Header */}
        <div className="px-4 pt-5 pb-[19px] border-b border-[var(--color-border-subtle)]/30">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-[var(--color-text-muted)]/60">
            Career Center
          </span>
        </div>

        {/* Navigation sections */}
        <nav className="flex-1 px-2.5 pb-4" aria-label="Career sections">
          <ul role="list" className="flex flex-col gap-1">
            {SECTIONS.map((section) => {
              const isSectionActive = pathname.startsWith(section.href);
              return (
                <li key={section.href}>
                  {/* Section header */}
                  <Link
                    href={section.tabs[0].href}
                    className={cn(
                      'group relative flex items-center gap-2.5 rounded-lg px-2.5 py-2 transition-all duration-200',
                      isSectionActive
                        ? 'bg-[var(--color-brand-primary)]/8 text-[var(--color-text-primary)]'
                        : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-surface)]/40'
                    )}
                  >
                    <span
                      className={cn(
                        'shrink-0 transition-colors duration-200',
                        isSectionActive ? 'text-[var(--color-brand-primary)]' : ''
                      )}
                    >
                      <SectionIcon type={section.icon} />
                    </span>
                    <span className="text-[13px] font-semibold truncate">{section.label}</span>
                  </Link>

                  {/* Subtabs */}
                  <ul role="list" className="mt-0.5 flex flex-col gap-0.5">
                    {section.tabs.map((tab) => {
                      const tabPath = tab.href.split('?')[0];
                      const tabParam = tab.href.split('?tab=')[1];
                      const currentTab = searchParams.get('tab');
                      // Active if: exact match, or on the section page with matching tab, or first tab and no tab param
                      const isTabActive =
                        currentFull === tab.href ||
                        (pathname === tabPath && currentTab === tabParam) ||
                        (pathname === tabPath && !currentTab && tab === section.tabs[0]);

                      return (
                        <li key={tab.href}>
                          <Link
                            href={tab.href}
                            className={cn(
                              'group relative flex items-center rounded-lg pl-8 pr-2.5 py-1.5 transition-all duration-200',
                              isTabActive
                                ? 'text-[var(--color-text-primary)] bg-[var(--color-brand-primary)]/5'
                                : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-surface)]/30'
                            )}
                          >
                            {/* Active indicator bar */}
                            {isTabActive && (
                              <span
                                className="absolute left-2 top-1/2 -translate-y-1/2 w-[3px] h-4 rounded-full bg-[var(--color-brand-primary)] shadow-[0_0_8px_var(--color-brand-glow)]"
                                aria-hidden
                              />
                            )}
                            <span className="text-[12px] font-medium truncate">{tab.label}</span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 min-w-0 h-full overflow-hidden">
        {children}
      </div>
    </div>
  );
}
