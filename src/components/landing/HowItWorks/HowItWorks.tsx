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
      className={cn('py-24 px-6', className)}
      aria-labelledby={headingId}
    >
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2
            id={headingId}
            className="text-3xl md:text-4xl font-bold text-text-primary mb-4"
          >
            {title}
          </h2>
          {subtitle ? (
            <p className="text-text-muted text-lg max-w-2xl mx-auto">
              {subtitle}
            </p>
          ) : null}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 relative">
          {/* Connecting line (desktop) */}
          <div
            className="hidden md:block absolute top-16 left-[20%] right-[20%] h-px bg-gradient-to-r from-transparent via-border-strong to-transparent"
            aria-hidden
          />

          {steps.map((step) => (
            <div key={step.number} className="relative text-center flex flex-col items-center">
              {/* Step number ring */}
              <div className="relative mb-6">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-feature-blue to-feature-purple flex items-center justify-center text-text-on-brand font-bold text-xl shadow-[0_0_30px_rgba(66,133,244,0.2)]">
                  {step.number}
                </div>
              </div>

              {/* Icon */}
              <div className="w-12 h-12 mb-4 text-text-secondary [&>svg]:w-full [&>svg]:h-full">
                {step.icon}
              </div>

              <h3 className="text-lg font-semibold text-text-primary mb-2">
                {step.title}
              </h3>
              <p className="text-sm text-text-muted leading-relaxed max-w-xs">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
