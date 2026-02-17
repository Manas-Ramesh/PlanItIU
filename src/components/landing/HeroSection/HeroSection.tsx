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
        'landing-grid-bg landing-hero-glow relative min-h-[85vh] flex items-center justify-center px-6 lg:px-8',
        className
      )}
      aria-labelledby={ariaLabelledBy ?? headingId}
      aria-describedby={subtitle ? subtitleId : undefined}
    >
      <div className="relative z-10 max-w-4xl mx-auto text-center">
        {/* Staggered reveal */}
        <div className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-[var(--color-brand-primary)]/20 bg-[var(--color-brand-primary)]/5 mb-10">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-brand-primary)] animate-pulse" aria-hidden />
            <span className="text-xs font-medium text-[var(--color-brand-accent)] tracking-wide uppercase">
              AI-Powered Academic Planning
            </span>
          </div>
        </div>

        <h1
          id={headingId}
          className="animate-fade-in-up font-display text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] text-[var(--color-text-primary)] leading-[1.08] mb-8"
          style={{ animationDelay: '0.2s' }}
        >
          {headline}{' '}
          {highlight ? (
            <span className="italic text-[var(--color-brand-primary)]">{highlight}</span>
          ) : null}
        </h1>

        <p
          id={subtitleId}
          className="animate-fade-in-up text-lg md:text-xl text-[var(--color-text-muted)] max-w-2xl mx-auto leading-relaxed mb-12"
          style={{ animationDelay: '0.35s' }}
        >
          {subtitle}
        </p>

        <div
          className="animate-fade-in-up flex flex-col sm:flex-row items-center justify-center gap-4"
          style={{ animationDelay: '0.5s' }}
        >
          <a
            href={ctaHref}
            className={cn(
              'group relative inline-flex items-center gap-2.5 px-8 py-4 rounded-xl font-semibold text-base',
              'bg-[var(--color-brand-primary)] text-[var(--color-text-on-brand)]',
              'shadow-[0_0_30px_var(--color-brand-glow)] hover:shadow-[0_4px_40px_var(--color-brand-glow-strong)]',
              'hover:bg-[var(--color-brand-strong)] hover:-translate-y-0.5 transition-all duration-300'
            )}
          >
            {ctaLabel}
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-4.5 h-4.5 group-hover:translate-x-0.5 transition-transform" aria-hidden>
              <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
            </svg>
          </a>
          <a
            href="#features"
            className="inline-flex items-center gap-2 px-6 py-4 rounded-xl font-medium text-base text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] border border-[var(--color-border-subtle)]/40 hover:border-[var(--color-border-subtle)]/70 hover:bg-[var(--color-bg-surface)]/30 transition-all duration-300"
          >
            Explore Features
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4" aria-hidden>
              <path fillRule="evenodd" d="M5.22 8.22a.75.75 0 011.06 0L10 11.94l3.72-3.72a.75.75 0 111.06 1.06l-4.25 4.25a.75.75 0 01-1.06 0L5.22 9.28a.75.75 0 010-1.06z" clipRule="evenodd" />
            </svg>
          </a>
        </div>

        {/* Floating mockup preview */}
        <div
          className="animate-fade-in-up mt-20 relative max-w-3xl mx-auto"
          style={{ animationDelay: '0.7s' }}
        >
          <div className="animate-float mockup-frame border border-[var(--color-border-subtle)]/30 shadow-[0_20px_80px_var(--color-overlay)]">
            {/* Mockup content placeholder */}
            <div className="bg-[var(--color-bg-elevated)] pt-8 pb-0">
              <div className="bg-[var(--color-bg-surface)]/60 mx-3 mb-0 rounded-t-lg p-6 min-h-[200px] flex flex-col gap-4">
                {/* Fake dashboard UI */}
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[var(--color-brand-primary)]/20" />
                  <div className="flex-1">
                    <div className="h-3 w-32 rounded bg-[var(--color-text-primary)]/10 mb-1.5" />
                    <div className="h-2 w-48 rounded bg-[var(--color-text-muted)]/10" />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3 mt-2">
                  <div className="h-20 rounded-lg bg-[var(--color-feature-teal)]/10 border border-[var(--color-feature-teal)]/20" />
                  <div className="h-20 rounded-lg bg-[var(--color-feature-blue)]/10 border border-[var(--color-feature-blue)]/20" />
                  <div className="h-20 rounded-lg bg-[var(--color-feature-purple)]/10 border border-[var(--color-feature-purple)]/20" />
                </div>
                <div className="flex gap-3">
                  <div className="flex-1 h-16 rounded-lg bg-[var(--color-bg-surface)]/80 border border-[var(--color-border-subtle)]/30" />
                  <div className="flex-1 h-16 rounded-lg bg-[var(--color-bg-surface)]/80 border border-[var(--color-border-subtle)]/30" />
                </div>
              </div>
            </div>
          </div>
          {/* Bottom gradient fade */}
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[var(--color-bg-base)] to-transparent pointer-events-none" aria-hidden />
        </div>
      </div>
    </section>
  );
}
