'use client';

import { useId } from 'react';
import { cn } from '@/lib/utils/cn';
import type { HeroSectionProps as Props } from './HeroSection.types';

export function HeroSection({
  headline,
  highlight,
  subtitle,
  ctaSlot,
  id: idProp,
  className,
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
        'landing-hero-bg text-center pt-20 pb-16 px-6 max-w-5xl mx-auto relative',
        className
      )}
      aria-labelledby={ariaLabelledBy ?? headingId}
      aria-describedby={subtitle ? subtitleId : undefined}
    >
      <div className="relative z-10 space-y-6">
        <h1
          id={headingId}
          className="text-6xl md:text-7xl font-bold tracking-tight text-white leading-tight"
        >
          {headline}
          {highlight ? (
            <>
              <br />
              <span className="text-brand">{highlight}</span>
            </>
          ) : null}
        </h1>

        <p
          id={subtitleId}
          className="text-xl text-text-secondary max-w-3xl mx-auto leading-relaxed mb-12"
        >
          {subtitle}
        </p>

        <div className="flex justify-center max-w-md mx-auto">
          {ctaSlot}
        </div>
      </div>
    </section>
  );
}
