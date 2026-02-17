'use client';

import { useState, useCallback } from 'react';
import { cn } from '@/lib/utils/cn';
import type { NavBarProps as Props } from './NavBar.types';

export function NavBar(props: Props) {
  const {
    brandLabel,
    navLinks,
    ctaLabel,
    className,
    'aria-label': ariaLabel,
  } = props;

  const [mobileOpen, setMobileOpen] = useState(false);
  const toggleMobile = useCallback(() => setMobileOpen((o) => !o), []);

  const ctaClasses =
    'bg-brand text-text-on-brand px-5 py-2.5 rounded-lg hover:bg-brand-strong transition-all font-semibold text-sm inline-flex items-center justify-center shadow-[0_0_20px_rgba(66,133,244,0.3)] hover:shadow-[0_0_28px_rgba(66,133,244,0.45)]';

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full border-b border-border-subtle/50 bg-background/70 backdrop-blur-xl',
        className
      )}
      aria-label={ariaLabel ?? 'Main navigation'}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        {/* Brand */}
        <a href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-feature-blue to-feature-purple flex items-center justify-center">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-4.5 h-4.5 text-text-on-brand" aria-hidden>
              <path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z" />
            </svg>
          </div>
          <span className="font-bold text-lg text-text-primary tracking-tight">
            {brandLabel}
          </span>
        </a>

        {/* Desktop nav */}
        <nav aria-label={ariaLabel ?? 'Primary'} className="hidden md:block">
          <ul role="list" className="flex items-center gap-8 text-sm">
            {navLinks.map((link) => (
              <li key={`${link.href}-${link.label}`}>
                <a
                  href={link.href}
                  className="text-text-muted hover:text-text-primary transition-colors font-medium"
                >
                  {link.label}
                </a>
              </li>
            ))}
            <li>
              {'ctaHref' in props ? (
                <a href={props.ctaHref} className={ctaClasses}>
                  {ctaLabel}
                </a>
              ) : (
                <button type="button" onClick={props.onCtaClick} className={ctaClasses}>
                  {ctaLabel}
                </button>
              )}
            </li>
          </ul>
        </nav>

        {/* Mobile hamburger */}
        <button
          type="button"
          className="md:hidden p-2 text-text-secondary hover:text-text-primary transition-colors"
          onClick={toggleMobile}
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileOpen}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-6 h-6" aria-hidden>
            {mobileOpen ? (
              <path strokeLinecap="round" d="M6 6l12 12M6 18L18 6" />
            ) : (
              <path strokeLinecap="round" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <nav className="md:hidden border-t border-border-subtle/50 bg-background/95 backdrop-blur-xl px-6 py-4">
          <ul role="list" className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <li key={`mobile-${link.href}`}>
                <a
                  href={link.href}
                  className="text-text-secondary hover:text-text-primary transition-colors font-medium text-sm block py-1"
                >
                  {link.label}
                </a>
              </li>
            ))}
            <li className="pt-2">
              {'ctaHref' in props ? (
                <a href={props.ctaHref} className={cn(ctaClasses, 'w-full')}>
                  {ctaLabel}
                </a>
              ) : (
                <button type="button" onClick={props.onCtaClick} className={cn(ctaClasses, 'w-full')}>
                  {ctaLabel}
                </button>
              )}
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
