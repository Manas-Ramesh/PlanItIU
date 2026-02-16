'use client';

import Link from 'next/link';
import { AppSidebar } from '@/components/app/AppSidebar';
import type { AppSidebarLink } from '@/components/app/AppSidebar';
import { cn } from '@/lib/utils/cn';
import { SAMPLE_SAVED_CHATS, SAMPLE_USER_DISPLAY_NAME } from '@/lib/data/sampleData';

const APP_NAV_LINKS: ReadonlyArray<AppSidebarLink> = [
  { href: '/dashboard', label: 'Home', icon: 'home' },
  { href: '/schedule', label: 'Plan your classes', icon: 'schedule' },
  { href: '/degree-progress', label: 'Degree Progress', icon: 'degree' },
  { href: '/career', label: 'Career', icon: 'career' },
];

export default function AppLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div
      className={cn(
        'min-h-screen flex bg-background',
        'text-text-primary'
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
        <header
          className="shrink-0 flex justify-end border-b border-border-subtle px-4 py-2"
          aria-label="App top"
        >
          <Link
            href="#"
            className="text-sm text-text-muted hover:text-text-secondary transition"
          >
            Mobile App
          </Link>
        </header>
        {children}
      </div>
    </div>
  );
}
