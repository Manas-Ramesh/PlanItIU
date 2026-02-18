'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils/cn';

const SECTIONS = [
  {
    label: 'Interview Prep',
    href: '/career/interview-prep',
    icon: 'target' as const,
    tabs: [
      { label: 'Practice Chat', href: '/career/interview-prep?tab=practice', icon: 'chat' as const },
      { label: 'Question Drills', href: '/career/interview-prep?tab=drills', icon: 'list' as const },
      { label: 'Mock Interview', href: '/career/interview-prep?tab=mock', icon: 'video' as const },
    ],
  },
  {
    label: 'Job Search',
    href: '/career/jobs',
    icon: 'search' as const,
    tabs: [
      { label: 'Browse Jobs', href: '/career/jobs?tab=browse', icon: 'compass' as const },
      { label: 'Application Tracker', href: '/career/jobs?tab=tracker', icon: 'kanban' as const },
    ],
  },
  {
    label: 'Networking',
    href: '/career/networking',
    icon: 'network' as const,
    tabs: [
      { label: 'Swipe Contacts', href: '/career/networking?tab=swipe', icon: 'swipe' as const },
      { label: 'My Network', href: '/career/networking?tab=network', icon: 'users' as const },
      { label: 'Outreach Analytics', href: '/career/networking?tab=analytics', icon: 'chart' as const },
    ],
  },
] as const;

type SectionIconType = 'target' | 'search' | 'network';
type TabIconType = 'chat' | 'list' | 'video' | 'compass' | 'kanban' | 'swipe' | 'users' | 'chart';

function SectionIcon({ type, className }: { type: SectionIconType; className?: string }) {
  const c = cn('size-[16px] shrink-0', className);
  switch (type) {
    case 'target':
      return (
        <svg className={c} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
          <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" />
        </svg>
      );
    case 'search':
      return (
        <svg className={c} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
          <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
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

function TabIcon({ type, className }: { type: TabIconType; className?: string }) {
  const c = cn('size-[13px] shrink-0', className);
  switch (type) {
    case 'chat':
      return (
        <svg className={c} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      );
    case 'list':
      return (
        <svg className={c} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
          <line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" />
          <line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" />
        </svg>
      );
    case 'video':
      return (
        <svg className={c} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
          <polygon points="23 7 16 12 23 17 23 7" />
          <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
        </svg>
      );
    case 'compass':
      return (
        <svg className={c} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
          <circle cx="12" cy="12" r="10" />
          <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
        </svg>
      );
    case 'kanban':
      return (
        <svg className={c} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
          <rect x="3" y="3" width="4" height="18" rx="1" />
          <rect x="10" y="3" width="4" height="12" rx="1" />
          <rect x="17" y="3" width="4" height="8" rx="1" />
        </svg>
      );
    case 'swipe':
      return (
        <svg className={c} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
          <polyline points="17 1 21 5 17 9" /><path d="M3 11V9a4 4 0 0 1 4-4h14" />
          <polyline points="7 23 3 19 7 15" /><path d="M21 13v2a4 4 0 0 1-4 4H3" />
        </svg>
      );
    case 'users':
      return (
        <svg className={c} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      );
    case 'chart':
      return (
        <svg className={c} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
          <line x1="18" y1="20" x2="18" y2="10" />
          <line x1="12" y1="20" x2="12" y2="4" />
          <line x1="6" y1="20" x2="6" y2="14" />
          <line x1="2" y1="20" x2="22" y2="20" />
        </svg>
      );
  }
}

export default function CareerLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentFull = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '');
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex h-full">
      {/* Secondary sidebar */}
      <aside
        className={cn(
          'shrink-0 flex flex-col h-full',
          'bg-[var(--color-bg-elevated)] border-r border-[var(--color-border-subtle)]/40',
          'overflow-y-auto overflow-x-hidden transition-all duration-300 ease-out',
          collapsed ? 'w-[52px]' : 'w-[220px]'
        )}
        aria-label="Career navigation"
      >
        {/* Header */}
        <div className={cn(
          'shrink-0 flex items-center border-b border-[var(--color-border-subtle)]/30 h-[49px] py-[31.5px]',
          collapsed ? 'justify-center px-0' : 'px-4 justify-between'
        )}>
          {!collapsed && (
            <span className="text-[10px] font-semibold uppercase tracking-widest text-[var(--color-text-muted)]/60">
              Career Center
            </span>
          )}
          <button
            type="button"
            onClick={() => setCollapsed((c) => !c)}
            className={cn(
              'flex items-center justify-center rounded-lg transition-colors',
              'text-[var(--color-text-muted)]/50 hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-surface)]/40',
              collapsed ? 'size-8' : 'size-7'
            )}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            title={collapsed ? 'Expand' : 'Collapse'}
          >
            <svg
              className={cn('size-3.5 transition-transform duration-300', collapsed && 'rotate-180')}
              viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden
            >
              <polyline points="11 17 6 12 11 7" />
              <polyline points="18 17 13 12 18 7" />
            </svg>
          </button>
        </div>

        {/* Navigation */}
        <nav className={cn('flex-1 pb-4', collapsed ? 'px-1.5 pt-2' : 'px-2.5 pt-1')} aria-label="Career sections">
          <ul role="list" className="flex flex-col gap-1">
            {SECTIONS.map((section) => {
              const isSectionActive = pathname.startsWith(section.href);

              return (
                <li key={section.href}>
                  {/* Section header */}
                  <Link
                    href={section.tabs[0].href}
                    className={cn(
                      'group relative flex items-center rounded-lg transition-all duration-200',
                      collapsed ? 'justify-center h-9 w-9 mx-auto' : 'gap-2.5 px-2.5 py-2',
                      isSectionActive
                        ? 'bg-[var(--color-brand-primary)]/8 text-[var(--color-text-primary)]'
                        : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-surface)]/40'
                    )}
                    title={collapsed ? section.label : undefined}
                  >
                    {isSectionActive && collapsed && (
                      <span className="absolute -left-[3px] top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-full bg-[var(--color-brand-primary)]" aria-hidden />
                    )}
                    <span className={cn('shrink-0', isSectionActive ? 'text-[var(--color-brand-primary)]' : '')}>
                      <SectionIcon type={section.icon} />
                    </span>
                    {!collapsed && (
                      <span className="text-[13px] font-semibold truncate">{section.label}</span>
                    )}
                  </Link>

                  {/* Subtabs — hidden when collapsed */}
                  {!collapsed && (
                    <ul role="list" className="mt-0.5 flex flex-col gap-0.5">
                      {section.tabs.map((tab) => {
                        const tabPath = tab.href.split('?')[0];
                        const tabParam = tab.href.split('?tab=')[1];
                        const currentTab = searchParams.get('tab');
                        const isTabActive =
                          currentFull === tab.href ||
                          (pathname === tabPath && currentTab === tabParam) ||
                          (pathname === tabPath && !currentTab && tab === section.tabs[0]);

                        return (
                          <li key={tab.href}>
                            <Link
                              href={tab.href}
                              className={cn(
                                'group relative flex items-center gap-2 rounded-lg pl-7 pr-2.5 py-1.5 transition-all duration-200',
                                isTabActive
                                  ? 'text-[var(--color-text-primary)] bg-[var(--color-brand-primary)]/5'
                                  : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-surface)]/30'
                              )}
                            >
                              {isTabActive && (
                                <span
                                  className="absolute left-2 top-1/2 -translate-y-1/2 w-[3px] h-4 rounded-full bg-[var(--color-brand-primary)] shadow-[0_0_8px_var(--color-brand-glow)]"
                                  aria-hidden
                                />
                              )}
                              <TabIcon
                                type={tab.icon}
                                className={cn(isTabActive ? 'text-[var(--color-brand-primary)]' : 'text-[var(--color-text-muted)]')}
                              />
                              <span className="text-[12px] font-medium truncate">{tab.label}</span>
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  )}
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
