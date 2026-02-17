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
      className={cn('relative py-24 px-6 overflow-hidden', className)}
      aria-labelledby={headingId}
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-brand/5 to-transparent pointer-events-none" aria-hidden />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-brand/8 rounded-full blur-[100px] pointer-events-none" aria-hidden />

      <div className="relative z-10 max-w-3xl mx-auto text-center space-y-6">
        <h2
          id={headingId}
          className="text-3xl md:text-5xl font-bold text-text-primary"
        >
          {headline}
        </h2>
        <p className="text-lg text-text-muted max-w-xl mx-auto leading-relaxed">
          {subtitle}
        </p>
        <div className="flex items-center justify-center pt-4">
          <a
            href={ctaHref}
            className="inline-flex items-center gap-2 bg-brand text-text-on-brand px-8 py-3.5 rounded-xl font-semibold text-base hover:bg-brand-strong transition-all shadow-[0_0_24px_rgba(66,133,244,0.3)] hover:shadow-[0_0_36px_rgba(66,133,244,0.45)] hover:-translate-y-0.5"
          >
            {ctaLabel}
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5" aria-hidden>
              <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
