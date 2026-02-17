'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils/cn';

export default function AdvisorPage() {
  return (
    <main
      id="main-content"
      className={cn('flex-1 p-6', 'bg-[var(--color-bg-base)]')}
      aria-labelledby="advisor-title"
    >
      <h1 id="advisor-title" className="text-2xl font-bold text-[var(--color-text-primary)] mb-2">
        Hoosier AI Advisor
      </h1>
      <p className="text-[var(--color-text-secondary)] mb-4">
        Chat with the AI advisor from the Dashboard, or use the panel there for course selection, degree requirements, and study tips.
      </p>
      <Link
        href="/dashboard"
        className="inline-flex items-center justify-center rounded-lg font-medium px-4 py-2 bg-[var(--color-brand-primary)] text-[var(--color-text-on-brand)] hover:bg-[var(--color-brand-strong)] transition"
      >
        Open Dashboard
      </Link>
    </main>
  );
}
