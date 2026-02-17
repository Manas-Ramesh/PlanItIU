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
        'border-t border-[var(--color-border-subtle)]/20 pt-20 pb-10 px-6 lg:px-8',
        className
      )}
      aria-label={ariaLabel ?? 'Site footer'}
    >
      <div className="max-w-6xl mx-auto">
        {(brandLabel || linkGroups) && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-12 mb-16">
            {/* Brand */}
            {brandLabel && (
              <div className="col-span-2">
                <a href="/" className="flex items-center gap-3 mb-5">
                  <div className="w-8 h-8 rounded-xl bg-[var(--color-brand-primary)]/10 border border-[var(--color-brand-primary)]/20 flex items-center justify-center">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4.5 h-4.5 text-[var(--color-brand-primary)]" aria-hidden>
                      <path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z" />
                    </svg>
                  </div>
                  <span className="font-display text-lg text-[var(--color-text-primary)]">
                    {brandLabel}
                  </span>
                </a>
                {brandDescription && (
                  <p className="text-sm text-[var(--color-text-muted)] leading-relaxed max-w-xs">
                    {brandDescription}
                  </p>
                )}
              </div>
            )}

            {/* Link groups */}
            {linkGroups?.map((group) => (
              <div key={group.title}>
                <h4 className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider mb-5">
                  {group.title}
                </h4>
                <ul role="list" className="space-y-3">
                  {group.links.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors"
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

        {/* Bottom */}
        <div className="border-t border-[var(--color-border-subtle)]/15 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[var(--color-text-muted)]/70">{children}</p>
          <p className="text-xs text-[var(--color-text-muted)]/70">
            &copy; {new Date().getFullYear()} PlanitUni
          </p>
        </div>
      </div>
    </footer>
  );
}
