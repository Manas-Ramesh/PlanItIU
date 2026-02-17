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
      className={cn(
        'py-24 px-6 text-center',
        className
      )}
      aria-labelledby={ariaLabelledBy ?? headingId}
      aria-describedby={subtitle ? subtitleId : undefined}
    >
      <div className="max-w-6xl mx-auto">
        <h2 id={headingId} className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
          {title}
        </h2>
        {subtitle ? (
          <p id={subtitleId} className="text-text-muted text-lg max-w-2xl mx-auto mb-16">
            {subtitle}
          </p>
        ) : null}
        <ul
          role="list"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto"
        >
          {features.map((feature) => (
            <li key={feature.id}>
              <FeatureCard
                id={feature.id}
                title={feature.title}
                description={feature.description}
                accentGradient={feature.accentGradient}
                imageSrc={feature.imageSrc}
                imagePlaceholder={feature.imagePlaceholder}
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
