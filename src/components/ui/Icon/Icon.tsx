'use client';

import { cn } from '@/lib/utils/cn';
import type { IconProps as Props, IconSize } from './Icon.types';

const sizeClasses: Record<IconSize, string> = {
  sm: 'size-4',
  md: 'size-6',
  lg: 'size-8',
};

export function Icon({
  children,
  size = 'md',
  'aria-hidden': ariaHidden = true,
  className,
}: Props) {
  return (
    <span
      className={cn('inline-flex shrink-0 items-center justify-center [&>svg]:size-full', sizeClasses[size], className)}
      aria-hidden={ariaHidden}
    >
      {children}
    </span>
  );
}
