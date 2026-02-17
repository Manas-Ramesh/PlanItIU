'use client';

import { cn } from '@/lib/utils/cn';
import type { BadgeProps as Props, BadgeVariant } from './Badge.types';

const variantClasses: Record<BadgeVariant, string> = {
  default: 'bg-[var(--color-bg-elevated)] text-[var(--color-text-primary)] border-[var(--color-border-subtle)]',
  success: 'bg-[var(--color-success)]/20 text-[var(--color-success)] border-[var(--color-success)]/40',
  warning: 'bg-[var(--color-warning)]/20 text-[var(--color-warning)] border-[var(--color-warning)]/40',
  danger: 'bg-[var(--color-danger)]/20 text-[var(--color-danger)] border-[var(--color-danger)]/40',
};

export function Badge({
  variant = 'default',
  children,
  className,
  ...rest
}: Props) {
  return (
    <span
      role="status"
      className={cn(
        'inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium',
        variantClasses[variant],
        className
      )}
      {...rest}
    >
      {children}
    </span>
  );
}
