'use client';

import { cn } from '@/lib/utils/cn';
import type { FooterProps as Props } from './Footer.types';

export function Footer({
  children,
  linkGroups,
  brandLabel,
  brandDescription,
  className,
  id,
  'aria-label': ariaLabel,
}: Props) {
  return (
    <footer
      id={id}
      className={cn(
        'border-t border-border-subtle/30 pt-16 pb-8 px-6',
        className
      )}
      aria-label={ariaLabel ?? 'Site footer'}
    >
      <div className="max-w-6xl mx-auto">
        {/* Top section with brand + link columns */}
        {(brandLabel || linkGroups) && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">
            {/* Brand column */}
            {brandLabel && (
              <div className="col-span-2 md:col-span-1">
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="w-7 h-7 rounded-md bg-gradient-to-br from-feature-blue to-feature-purple flex items-center justify-center">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-text-on-brand" aria-hidden>
                      <path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z" />
                    </svg>
                  </div>
                  <span className="font-bold text-text-primary">{brandLabel}</span>
                </div>
                {brandDescription && (
                  <p className="text-sm text-text-muted leading-relaxed max-w-xs">
                    {brandDescription}
                  </p>
                )}
              </div>
            )}

            {/* Link columns */}
            {linkGroups?.map((group) => (
              <div key={group.title}>
                <h4 className="font-semibold text-sm text-text-secondary mb-4">
                  {group.title}
                </h4>
                <ul role="list" className="space-y-2.5">
                  {group.links.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        className="text-sm text-text-muted hover:text-text-primary transition-colors"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        {/* Bottom bar */}
        <div className="border-t border-border-subtle/30 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-text-muted">{children}</p>
          <p className="text-xs text-text-muted">
            &copy; {new Date().getFullYear()} PlanitUni. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
