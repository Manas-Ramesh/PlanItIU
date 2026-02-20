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
      className={cn('py-20 px-6 lg:px-8 relative', className)}
      aria-labelledby={headingId}
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[var(--color-bg-surface)]/20 to-transparent pointer-events-none" aria-hidden />

      <div className="relative z-10 max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-14">
          <span className="inline-block text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--color-brand-primary)] mb-4">
            How it works
          </span>
          <h2
            id={headingId}
            className="font-display text-3xl md:text-4xl lg:text-[44px] text-[var(--color-text-primary)] mb-4 leading-tight"
          >
            {title}
          </h2>
          {subtitle ? (
            <p className="text-[var(--color-text-muted)] text-base max-w-lg mx-auto leading-relaxed">
              {subtitle}
            </p>
          ) : null}
        </div>

        {/* Step cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 relative">

          {/* Connecting line between cards */}
          <div
            className="hidden md:block absolute top-[52px] left-[calc(33.33%-24px)] right-[calc(33.33%-24px)] h-px pointer-events-none"
            aria-hidden
          >
            <div className="w-full h-full bg-gradient-to-r from-[var(--color-brand-primary)]/0 via-[var(--color-brand-primary)]/30 to-[var(--color-brand-primary)]/0" />
          </div>

          {steps.map((step, i) => (
            <div
              key={step.number}
              className="relative flex flex-col rounded-2xl border border-[var(--color-border-subtle)]/50 bg-[var(--color-bg-surface)]/50 p-6 overflow-hidden"
            >
              {/* Top accent */}
              <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-[var(--color-brand-primary)]/0 via-[var(--color-brand-primary)] to-[var(--color-brand-primary)]/0" aria-hidden />

              {/* Icon row */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center justify-center w-[52px] h-[52px] rounded-xl bg-[var(--color-brand-primary)]/10 border border-[var(--color-brand-primary)]/15 text-[var(--color-brand-primary)] [&>svg]:w-6 [&>svg]:h-6 shrink-0">
                  {step.icon}
                </div>
                <span className="text-[11px] font-bold tabular-nums text-[var(--color-text-muted)]/30 tracking-widest mt-1">
                  {String(i + 1).padStart(2, '0')}
                </span>
              </div>

              <h3 className="text-[16px] font-bold text-[var(--color-text-primary)] mb-2 leading-snug">
                {step.title}
              </h3>
              <p className="text-[13px] text-[var(--color-text-muted)] leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
