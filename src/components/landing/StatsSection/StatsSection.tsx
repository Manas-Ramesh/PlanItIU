'use client';

import { cn } from '@/lib/utils/cn';
import type { StatsSectionProps as Props } from './StatsSection.types';

export function StatsSection({ stats, className, id }: Props) {
  return (
    <section
      id={id}
      className={cn('py-16 px-6 lg:px-8', className)}
      aria-label="Platform statistics"
    >
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-wrap items-center justify-center gap-y-8">
          {stats.map((stat, i) => (
            <div key={stat.label} className="flex items-center">
              <div className="text-center px-8 md:px-12">
                <div className="text-3xl md:text-4xl font-display text-[var(--color-brand-primary)]">
                  {stat.value}
                </div>
                <div className="mt-1.5 text-xs text-[var(--color-text-muted)] font-medium uppercase tracking-wider">
                  {stat.label}
                </div>
              </div>
              {i < stats.length - 1 && (
                <div className="hidden sm:block w-px h-10 bg-[var(--color-border-subtle)]/40" aria-hidden />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
