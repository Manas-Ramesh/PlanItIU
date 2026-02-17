'use client';

import { useId } from 'react';
import { cn } from '@/lib/utils/cn';
import { FeatureCard } from '../FeatureCard';
import type { FeatureGridProps as Props } from './FeatureGrid.types';

export function FeatureGrid({
  title,
  subtitle,
  features,
  className,
  id: idProp,
  'aria-labelledby': ariaLabelledBy,
}: Props) {
  const generatedId = useId();
  const id = idProp ?? generatedId;
  const headingId = `${id}-heading`;
  const subtitleId = `${id}-subtitle`;

  return (
    <section
      id={id}
      className={cn('py-28 px-6 lg:px-8', className)}
      aria-labelledby={ariaLabelledBy ?? headingId}
      aria-describedby={subtitle ? subtitleId : undefined}
    >
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <div className="max-w-2xl mb-16">
          <h2
            id={headingId}
            className="font-display text-3xl md:text-4xl lg:text-5xl text-[var(--color-text-primary)] mb-5"
          >
            {title}
          </h2>
          {subtitle ? (
            <p id={subtitleId} className="text-[var(--color-text-muted)] text-lg leading-relaxed">
              {subtitle}
            </p>
          ) : null}
        </div>

        {/* Bento grid */}
        <ul
          role="list"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {features.map((feature, i) => (
            <li
              key={feature.id}
              className={cn(
                /* First and fourth items span 2 columns on large screens for bento effect */
                (i === 0 || i === 3) && 'lg:col-span-2',
              )}
            >
              <FeatureCard
                id={feature.id}
                title={feature.title}
                description={feature.description}
                accentGradient={feature.accentGradient}
                imageSrc={feature.imageSrc}
                imagePlaceholder={feature.imagePlaceholder}
                className="h-full"
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
