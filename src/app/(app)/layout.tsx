'use client';

import Link from 'next/link';
import { AppSidebar } from '@/components/app/AppSidebar';
import type { AppSidebarLink } from '@/components/app/AppSidebar';
import { cn } from '@/lib/utils/cn';
import { SAMPLE_SAVED_CHATS, SAMPLE_USER_DISPLAY_NAME } from '@/lib/data/sampleData';

const APP_NAV_LINKS: ReadonlyArray<AppSidebarLink> = [
  { href: '/dashboard', label: 'AI Advisor', icon: 'home', accent: 'var(--color-feature-blue)' },
  { href: '/schedule', label: 'Schedule Builder', icon: 'schedule', accent: 'var(--color-feature-cyan)' },
  { href: '/degree-progress', label: 'Degree Progress', icon: 'degree', accent: 'var(--color-feature-green)' },
  { href: '/study', label: 'Study Portal', icon: 'study', accent: 'var(--color-feature-teal)' },
  { href: '/assignments', label: 'Assignments', icon: 'assignments', accent: 'var(--color-feature-orange)' },
  { href: '/career', label: 'Career Center', icon: 'career', accent: 'var(--color-feature-pink)' },
];

export default function AppLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div
      className={cn(
        'h-screen flex overflow-hidden bg-[var(--color-bg-base)]',
        'text-[var(--color-text-primary)]'
      )}
    >
      <AppSidebar
        brandHref="/"
        brandLabel="Planituni"
        links={APP_NAV_LINKS}
        savedChats={SAMPLE_SAVED_CHATS}
        userDisplayName={SAMPLE_USER_DISPLAY_NAME}
      />
      <div className="flex-1 flex flex-col min-w-0">
        {/* <header
          className="shrink-0 flex justify-end border-b border-[var(--color-border-subtle)] px-4 py-2"
          aria-label="App top"
        >
          <Link
            href="#"
            className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] transition"
          >
            Mobile App
          </Link>
        </header> */}
        {children}
      </div>
    </div>
  );
}
