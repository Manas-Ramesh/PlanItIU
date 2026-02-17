'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils/cn';

export interface CareerTab {
  href: string;
  label: string;
}

export function CareerSubLayout({
  title,
  subtitle,
  highlightText,
  tabs,
  children,
}: {
  title: string;
  subtitle: string;
  highlightText?: string;
  tabs: ReadonlyArray<CareerTab>;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentFull = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '');

  return (
    <div className="flex flex-col h-full">
      <header className="shrink-0 border-b border-border-subtle px-6 py-4">
        <Link
          href="/career"
          className="inline-flex items-center gap-1 text-sm text-text-muted hover:text-text-secondary"
        >
          ← Back to Career Selection
        </Link>
        <h1 className="mt-2 text-2xl font-bold text-text-primary">{title}</h1>
        <p className="mt-1 text-text-secondary">
          {highlightText
            ? (() => {
                const parts = subtitle.split(highlightText);
                return parts.map((part, i) => (
                  <span key={i}>
                    {part}
                    {i < parts.length - 1 ? <span className="text-brand">{highlightText}</span> : null}
                  </span>
                ));
              })()
            : subtitle}
        </p>
        <nav className="mt-4 flex gap-1 border-b border-border-subtle" aria-label="Career sub-navigation">
          {tabs.map((tab) => {
            const isActive = currentFull === tab.href || pathname === tab.href || pathname.startsWith(tab.href.split('?')[0] + '/');
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={cn(
                  'px-4 py-2 text-sm font-medium transition',
                  isActive
                    ? 'text-text-on-brand border-b-2 border-brand'
                    : 'text-text-muted hover:text-text-secondary'
                )}
              >
                {tab.label}
              </Link>
            );
          })}
        </nav>
      </header>
      <main className="flex-1 overflow-y-auto p-6">{children}</main>
    </div>
  );
}
