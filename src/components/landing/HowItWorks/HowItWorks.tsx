'use client';

import { useId } from 'react';
import { cn } from '@/lib/utils/cn';
import type { HowItWorksProps as Props } from './HowItWorks.types';

export function HowItWorks({
  title,
  subtitle,
  steps,
  className,
  id: idProp,
}: Props) {
  const generatedId = useId();
  const id = idProp ?? generatedId;
  const headingId = `${id}-heading`;

  return (
    <section
      id={id}
      className={cn('py-28 px-6 lg:px-8 relative', className)}
      aria-labelledby={headingId}
    >
      {/* Subtle background accent */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[var(--color-bg-surface)]/20 to-transparent pointer-events-none" aria-hidden />

      <div className="relative z-10 max-w-5xl mx-auto">
        <div className="text-center mb-20">
          <h2
            id={headingId}
            className="font-display text-3xl md:text-4xl lg:text-5xl text-[var(--color-text-primary)] mb-5"
          >
            {title}
          </h2>
          {subtitle ? (
            <p className="text-[var(--color-text-muted)] text-lg max-w-xl mx-auto leading-relaxed">
              {subtitle}
            </p>
          ) : null}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-8 relative">
          {/* Connecting line */}
          {/* <div
            className="hidden md:block absolute top-10 left-[16%] right-[16%] h-px"
            aria-hidden
          >
            <div className="w-full h-full bg-gradient-to-r from-brand/0 via-brand/30 to-brand/0" />
          </div> */}

          {steps.map((step) => (
            <div key={step.number} className="relative text-center flex flex-col items-center">
              {/* Number circle */}
              <div className="relative mb-8">
                <div className="w-20 h-20 rounded-2xl bg-[var(--color-brand-primary)]/10 border border-[var(--color-brand-primary)]/20 flex items-center justify-center">
                  <span className="font-display text-3xl text-[var(--color-brand-primary)]">
                    {step.number}
                  </span>
                </div>
              </div>

              {/* Icon */}
              <div className="w-10 h-10 mb-5 text-[var(--color-text-muted)]/60 [&>svg]:w-full [&>svg]:h-full">
                {step.icon}
              </div>

              <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-3">
                {step.title}
              </h3>
              <p className="text-sm text-[var(--color-text-muted)] leading-relaxed max-w-[280px]">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
