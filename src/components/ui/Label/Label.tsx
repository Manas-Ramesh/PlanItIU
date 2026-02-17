'use client';

import { cn } from '@/lib/utils/cn';
import type { LabelProps as Props } from './Label.types';

export function Label({
  children,
  htmlFor,
  className,
  ...rest
}: Props) {
  return (
    <label
      htmlFor={htmlFor}
      className={cn('block text-sm font-medium text-[var(--color-text-secondary)]', className)}
      {...rest}
    >
      {children}
    </label>
  );
}
