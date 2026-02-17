'use client';

import { useId } from 'react';
import { cn } from '@/lib/utils/cn';
import type { CTASectionProps as Props } from './CTASection.types';

export function CTASection({
  headline,
  subtitle,
  ctaLabel,
  ctaHref,
  className,
  id: idProp,
}: Props) {
  const generatedId = useId();
  const id = idProp ?? generatedId;
  const headingId = `${id}-heading`;

  return (
    <section
      id={id}
      className={cn('relative py-32 px-6 lg:px-8 overflow-hidden', className)}
      aria-labelledby={headingId}
    >
      {/* Background atmosphere */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-[var(--color-brand-primary)]/6 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-1/4 w-[300px] h-[200px] bg-[var(--color-feature-purple)]/4 rounded-full blur-[80px]" />
      </div>

      {/* Grid texture */}
      <div className="landing-grid-bg absolute inset-0 pointer-events-none opacity-50" aria-hidden />

      <div className="relative z-10 max-w-2xl mx-auto text-center">
        <h2
          id={headingId}
          className="font-display text-3xl md:text-4xl lg:text-5xl text-[var(--color-text-primary)] mb-6 leading-tight"
        >
          {headline}
        </h2>
        <p className="text-lg text-[var(--color-text-muted)] max-w-lg mx-auto leading-relaxed mb-10">
          {subtitle}
        </p>
        <a
          href={ctaHref}
          className={cn(
            'group inline-flex items-center gap-2.5 px-10 py-4 rounded-xl font-semibold text-base',
            'bg-[var(--color-brand-primary)] text-[var(--color-text-on-brand)]',
            'shadow-[0_0_40px_var(--color-brand-glow)] hover:shadow-[0_4px_60px_var(--color-brand-glow-strong)]',
            'hover:bg-[var(--color-brand-strong)] hover:-translate-y-0.5 transition-all duration-300'
          )}
        >
          {ctaLabel}
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-4.5 h-4.5 group-hover:translate-x-0.5 transition-transform" aria-hidden>
            <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
          </svg>
        </a>
      </div>
    </section>
  );
}
