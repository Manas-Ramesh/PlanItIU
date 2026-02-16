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
        'py-20 px-6 max-w-6xl mx-auto text-center',
        className
      )}
      aria-labelledby={ariaLabelledBy ?? headingId}
      aria-describedby={subtitle ? subtitleId : undefined}
    >
      <h2 id={headingId} className="text-4xl font-bold text-white mb-4">
        {title}
      </h2>
      {subtitle ? (
        <p id={subtitleId} className="text-text-secondary text-center mb-16 text-lg">
          {subtitle}
        </p>
      ) : null}
      <ul
        role="list"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto"
      >
        {features.map((feature) => (
          <li key={feature.id}>
            <FeatureCard
              id={feature.id}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              iconGradient={feature.iconGradient}
            />
          </li>
        ))}
      </ul>
    </section>
  );
}
