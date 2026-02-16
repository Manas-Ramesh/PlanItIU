'use client';

import { cn } from '@/lib/utils/cn';
import type { NavBarProps as Props } from './NavBar.types';

export function NavBar(props: Props) {
  const {
    brandLabel,
    brandHighlight,
    navLinks,
    ctaLabel,
    className,
    'aria-label': ariaLabel,
  } = props;

  const ctaClasses =
    'bg-brand text-white px-4 py-2 rounded-md hover:bg-brand-strong transition font-medium inline-flex items-center justify-center';

  return (
    <header
      className={cn(
        'sticky top-0 z-40 w-full flex items-center justify-between px-6 py-4 border-b border-border-subtle bg-background/80 backdrop-blur-md',
        className
      )}
      aria-label={ariaLabel ?? 'Main navigation'}
    >
      <div className="flex items-center gap-2 font-semibold text-lg">
        {brandHighlight ? (
          <>
            <span
              aria-hidden
              className="rounded px-2 py-0.5 text-xs font-medium bg-danger/10 text-danger border border-danger/30"
            >
              {brandHighlight}
            </span>
            <span>{brandLabel}</span>
          </>
        ) : (
          <span>{brandLabel}</span>
        )}
      </div>

      <nav aria-label={ariaLabel ?? 'Primary'}>
        <ul role="list" className="flex items-center gap-6 text-text-secondary text-sm">
          {navLinks.map((link) => (
            <li key={`${link.href}-${link.label}`}>
              <a href={link.href}>{link.label}</a>
            </li>
          ))}
          <li>
            {'ctaHref' in props ? (
              <a
                href={props.ctaHref}
                className={ctaClasses}
              >
                {ctaLabel}
              </a>
            ) : (
              <button
                type="button"
                onClick={props.onCtaClick}
                className={ctaClasses}
              >
                {ctaLabel}
              </button>
            )}
          </li>
        </ul>
      </nav>
    </header>
  );
}
