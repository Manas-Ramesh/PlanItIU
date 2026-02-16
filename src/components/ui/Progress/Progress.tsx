'use client';

import { cn } from '@/lib/utils/cn';
import type { ProgressProps as Props } from './Progress.types';

export function Progress({
  value,
  max = 100,
  className,
  ...rest
}: Props) {
  const percent = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
      className={cn(
        'h-2 w-full overflow-hidden rounded-full bg-elevated',
        className
      )}
      {...rest}
    >
      <div
        className="h-full rounded-full bg-brand transition-[width] duration-300"
        style={{ width: `${percent}%` }}
      />
    </div>
  );
}
