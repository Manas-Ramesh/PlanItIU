'use client';

import { cn } from '@/lib/utils/cn';
import type { EmptyStateProps as Props } from './EmptyState.types';

export function EmptyState({ title, description, className }: Props) {
  return (
    <section
      className={cn(
        'flex flex-col items-center justify-center rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-bg-surface)] p-8 text-center',
        className
      )}
      aria-label="Empty state"
    >
      <p className="text-lg font-medium text-[var(--color-text-primary)]">{title}</p>
      {description ? (
        <p className="mt-2 text-sm text-[var(--color-text-secondary)]">{description}</p>
      ) : null}
    </section>
  );
}
