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
        'mt-1 w-full rounded-lg border border-border-subtle bg-surface px-3 py-2 text-text-primary placeholder:text-text-muted',
        'focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2 focus:ring-offset-background transition',
        'disabled:opacity-60 disabled:cursor-not-allowed',
        className
      )}
      {...rest}
    />
  );
});
