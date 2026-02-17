'use client';

import { useId } from 'react';
import { cn } from '@/lib/utils/cn';
import type { FeatureCardProps as Props } from './FeatureCard.types';
import type { FeatureIconGradient } from '../FeatureGrid/FeatureGrid.types';

const GRADIENT_FROM: Record<FeatureIconGradient, string> = {
  teal: 'from-[var(--color-feature-teal)]/15',
  blue: 'from-[var(--color-feature-blue)]/15',
  green: 'from-[var(--color-feature-green)]/15',
  purple: 'from-[var(--color-feature-purple)]/15',
  orange: 'from-[var(--color-feature-orange)]/15',
  pink: 'from-[var(--color-feature-pink)]/15',
};

const GRADIENT_TO: Record<FeatureIconGradient, string> = {
  teal: 'to-[var(--color-feature-cyan)]/5',
  blue: 'to-[var(--color-feature-cyan)]/5',
  green: 'to-[var(--color-feature-emerald)]/5',
  purple: 'to-[var(--color-feature-indigo)]/5',
  orange: 'to-[var(--color-feature-amber)]/5',
  pink: 'to-[var(--color-feature-rose)]/5',
};

const ACCENT_DOT: Record<FeatureIconGradient, string> = {
  teal: 'bg-[var(--color-feature-teal)]',
  blue: 'bg-[var(--color-feature-blue)]',
  green: 'bg-[var(--color-feature-green)]',
  purple: 'bg-[var(--color-feature-purple)]',
  orange: 'bg-[var(--color-feature-orange)]',
  pink: 'bg-[var(--color-feature-pink)]',
};

const PLACEHOLDER_ICON: Record<FeatureIconGradient, string> = {
  teal: 'text-[var(--color-feature-teal)]/40',
  blue: 'text-[var(--color-feature-blue)]/40',
  green: 'text-[var(--color-feature-green)]/40',
  purple: 'text-[var(--color-feature-purple)]/40',
  orange: 'text-[var(--color-feature-orange)]/40',
  pink: 'text-[var(--color-feature-pink)]/40',
};

export function FeatureCard({
  title,
  description,
  accentGradient,
  imageSrc,
  imagePlaceholder,
  className,
  id: idProp,
  'aria-labelledby': ariaLabelledBy,
}: Props) {
  const generatedId = useId();
  const id = idProp ?? generatedId;
  const titleId = `${id}-title`;

  return (
    <article
      id={id}
      className={cn(
        'bento-card group relative rounded-2xl overflow-hidden',
        'bg-[var(--color-bg-elevated)]/50 border border-[var(--color-border-subtle)]/20',
        'hover:border-[var(--color-border-subtle)]/40',
        className
      )}
      aria-labelledby={ariaLabelledBy ?? titleId}
    >
      {/* Image / mockup area */}
      <div className={cn(
        'relative h-52 overflow-hidden bg-gradient-to-br',
        GRADIENT_FROM[accentGradient],
        GRADIENT_TO[accentGradient],
      )}>
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={`${title} preview`}
            className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700"
          />
        ) : (
          /* Mockup placeholder with fake UI */
          <div className="absolute inset-3 top-6 rounded-lg overflow-hidden border border-[var(--color-border-subtle)]/20 bg-[var(--color-bg-elevated)]/60">
            {/* Fake title bar */}
            <div className="h-6 bg-[var(--color-bg-deep)]/30 flex items-center px-2.5 gap-1.5">
              <div className="w-2 h-2 rounded-full bg-[var(--color-danger)]/60" />
              <div className="w-2 h-2 rounded-full bg-[var(--color-warning)]/60" />
              <div className="w-2 h-2 rounded-full bg-[var(--color-success)]/60" />
            </div>
            {/* Placeholder content area */}
            <div className="p-3 flex flex-col gap-2">
              <div className="h-2.5 w-3/5 rounded bg-[var(--color-text-primary)]/6" />
              <div className="h-2 w-4/5 rounded bg-[var(--color-text-muted)]/6" />
              <div className="mt-2 grid grid-cols-2 gap-2">
                <div className="h-12 rounded bg-[var(--color-bg-surface)]/40" />
                <div className="h-12 rounded bg-[var(--color-bg-surface)]/40" />
              </div>
              <div className="h-8 rounded bg-[var(--color-bg-surface)]/30" />
            </div>
            {/* Placeholder label */}
            <div className="absolute inset-0 flex items-center justify-center bg-[var(--color-bg-elevated)]/20">
              <div className="flex flex-col items-center gap-2 px-4">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1} className={cn('w-8 h-8', PLACEHOLDER_ICON[accentGradient])} aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0 0 22.5 18.75V5.25A2.25 2.25 0 0 0 20.25 3H3.75A2.25 2.25 0 0 0 1.5 5.25v13.5A2.25 2.25 0 0 0 3.75 21Z" />
                </svg>
                <span className={cn('text-[10px] font-medium text-center leading-tight', PLACEHOLDER_ICON[accentGradient])}>
                  {imagePlaceholder}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex items-center gap-2.5 mb-3">
          <div className={cn('w-2 h-2 rounded-full', ACCENT_DOT[accentGradient])} aria-hidden />
          <h3 id={titleId} className="text-base font-semibold text-[var(--color-text-primary)]">
            {title}
          </h3>
        </div>
        <p className="text-[var(--color-text-muted)] text-sm leading-relaxed">
          {description}
        </p>
      </div>
    </article>
  );
}
