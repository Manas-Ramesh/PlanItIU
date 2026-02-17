'use client';

import { forwardRef } from 'react';
import { cn } from '@/lib/utils/cn';
import type { InputProps as Props } from './Input.types';

export const Input = forwardRef<HTMLInputElement, Props>(function Input(
  { className, ...rest },
  ref
) {
  return (
    <input
      ref={ref}
      className={cn(
        'mt-1 w-full rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-bg-surface)] px-3 py-2 text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)]',
        'focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)] focus:ring-offset-2 focus:ring-offset-[var(--color-bg-base)] transition',
        'disabled:opacity-60 disabled:cursor-not-allowed',
        className
      )}
      {...rest}
    />
  );
});
