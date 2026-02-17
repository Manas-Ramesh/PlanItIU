'use client';

import { useId } from 'react';
import { cn } from '@/lib/utils/cn';
import type { HeroSectionProps as Props } from './HeroSection.types';

export function HeroSection({
  headline,
  highlight,
  subtitle,
  ctaLabel,
  ctaHref,
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
        'landing-hero-bg relative overflow-hidden pt-24 pb-32 px-6',
        className
      )}
      aria-labelledby={ariaLabelledBy ?? headingId}
      aria-describedby={subtitle ? subtitleId : undefined}
    >
      {/* Decorative gradient orbs */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-brand/5 rounded-full blur-[120px] pointer-events-none" aria-hidden />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-feature-purple/5 rounded-full blur-[100px] pointer-events-none" aria-hidden />

      <div className="relative z-10 max-w-5xl mx-auto text-center space-y-8">
        {/* Pill badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-border-subtle/50 bg-surface/40 backdrop-blur-sm">
          <span className="w-2 h-2 rounded-full bg-success animate-pulse" aria-hidden />
          <span className="text-xs font-medium text-text-secondary">
            AI-Powered Academic Planning
          </span>
        </div>

        <h1
          id={headingId}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-text-primary leading-[1.05]"
        >
          {headline}
          {highlight ? (
            <>
              <br />
              <span className="bg-gradient-to-r from-feature-blue via-feature-purple to-feature-pink bg-clip-text text-transparent">
                {highlight}
              </span>
            </>
          ) : null}
        </h1>

        <p
          id={subtitleId}
          className="text-lg md:text-xl text-text-muted max-w-2xl mx-auto leading-relaxed"
        >
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

        {/* Trust indicators */}
        <div className="pt-8 flex flex-col items-center gap-3">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <svg key={i} viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-feature-amber" aria-hidden>
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <p className="text-sm text-text-muted">
            Built for students who aim higher
          </p>
        </div>
      </div>
    </section>
  );
}
