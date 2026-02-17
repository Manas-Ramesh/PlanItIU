'use client';

import { useId } from 'react';
import { cn } from '@/lib/utils/cn';
import type { FeatureCardProps as Props } from './FeatureCard.types';
import type { FeatureIconGradient } from '../FeatureGrid/FeatureGrid.types';

const GRADIENT_FROM: Record<FeatureIconGradient, string> = {
  teal: 'from-feature-teal/20',
  blue: 'from-feature-blue/20',
  green: 'from-feature-green/20',
  purple: 'from-feature-purple/20',
  orange: 'from-feature-orange/20',
  pink: 'from-feature-pink/20',
};

const GRADIENT_TO: Record<FeatureIconGradient, string> = {
  teal: 'to-feature-cyan/5',
  blue: 'to-feature-cyan/5',
  green: 'to-feature-emerald/5',
  purple: 'to-feature-indigo/5',
  orange: 'to-feature-amber/5',
  pink: 'to-feature-rose/5',
};

const ACCENT_BAR: Record<FeatureIconGradient, string> = {
  teal: 'from-feature-teal to-feature-cyan',
  blue: 'from-feature-blue to-feature-cyan',
  green: 'from-feature-green to-feature-emerald',
  purple: 'from-feature-purple to-feature-indigo',
  orange: 'from-feature-orange to-feature-amber',
  pink: 'from-feature-pink to-feature-rose',
};

const PLACEHOLDER_TEXT: Record<FeatureIconGradient, string> = {
  teal: 'text-feature-teal/60',
  blue: 'text-feature-blue/60',
  green: 'text-feature-green/60',
  purple: 'text-feature-purple/60',
  orange: 'text-feature-orange/60',
  pink: 'text-feature-pink/60',
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
        'group relative rounded-2xl overflow-hidden transition-all duration-300',
        'bg-surface/30 hover:bg-surface/60',
        'border border-border-subtle/40 hover:border-border-subtle/70',
        'hover:shadow-[0_8px_40px_rgba(0,0,0,0.25)]',
        className
      )}
      aria-labelledby={ariaLabelledBy ?? titleId}
    >
      {/* Image area */}
      <div className={cn(
        'relative h-48 overflow-hidden bg-gradient-to-br',
        GRADIENT_FROM[accentGradient],
        GRADIENT_TO[accentGradient],
      )}>
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={`${title} preview`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          /* Photo placeholder */
          <div className="flex flex-col items-center justify-center h-full px-6 gap-3">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className={cn('w-10 h-10', PLACEHOLDER_TEXT[accentGradient])} aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0 0 22.5 18.75V5.25A2.25 2.25 0 0 0 20.25 3H3.75A2.25 2.25 0 0 0 1.5 5.25v13.5A2.25 2.25 0 0 0 3.75 21Z" />
            </svg>
            <span className={cn('text-xs font-medium text-center leading-snug', PLACEHOLDER_TEXT[accentGradient])}>
              {imagePlaceholder}
            </span>
          </div>
        )}

        {/* Accent gradient bar at bottom of image */}
        <div className={cn(
          'absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r',
          ACCENT_BAR[accentGradient],
        )} aria-hidden />
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 id={titleId} className="text-lg font-bold text-text-primary mb-2">
          {title}
        </h3>
        <p className="text-text-muted text-sm leading-relaxed">
          {description}
        </p>
      </div>
    </article>
  );
}
