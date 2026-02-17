'use client';

import { cn } from '@/lib/utils/cn';
import type { StatsSectionProps as Props } from './StatsSection.types';

export function StatsSection({ stats, className, id }: Props) {
  return (
    <section
      id={id}
      className={cn(
        'relative py-16 px-6 border-y border-border-subtle/30',
        className
      )}
      aria-label="Platform statistics"
    >
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-feature-blue to-feature-purple bg-clip-text text-transparent">
                {stat.value}
              </div>
              <div className="mt-2 text-sm text-text-muted font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
