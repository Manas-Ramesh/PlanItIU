'use client';

import { cn } from '@/lib/utils/cn';
import type { FooterProps as Props } from './Footer.types';

export function Footer({
  children,
  className,
  id,
  'aria-label': ariaLabel,
}: Props) {
  return (
    <footer
      id={id}
      className={cn(
        'border-t border-border-subtle py-12 px-6 text-sm text-text-muted',
        'max-w-6xl mx-auto text-right',
        className
      )}
      aria-label={ariaLabel ?? 'Site footer'}
    >
      {children}
    </footer>
  );
}
