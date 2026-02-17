'use client';

import { forwardRef } from 'react';
import { cn } from '@/lib/utils/cn';
import type { CardProps as Props, CardVariant, CardPadding } from './Card.types';

const variantClasses: Record<CardVariant, string> = {
  default: 'bg-transparent border border-[var(--color-border-subtle)] rounded-lg',
  feature:
    'bg-[var(--color-bg-surface)] border border-[var(--color-border-subtle)] rounded-2xl p-6 shadow-[var(--shadow-card)] text-center flex flex-col items-center hover:border-[var(--color-border-strong)] transition-colors',
};

const paddingClasses: Record<CardPadding, string> = {
  none: 'p-0',
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-6',
};

const CardInner = forwardRef<HTMLDivElement, Props>(function CardInner(
  {
    variant = 'default',
    as: Component = 'div',
    padding = 'md',
    children,
    className,
    id,
    ...rest
  },
  ref
) {
  const classNames = cn(
    variantClasses[variant],
    variant !== 'feature' && paddingClasses[padding],
    className
  );
  const Wrapper = Component;
  return (
    <Wrapper
      ref={ref as React.Ref<HTMLDivElement>}
      id={id}
      className={classNames}
      {...rest}
    >
      {children}
    </Wrapper>
  );
});

export const Card = CardInner;
