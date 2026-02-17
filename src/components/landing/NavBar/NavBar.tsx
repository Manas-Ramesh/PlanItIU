/* eslint-disable @next/next/no-html-link-for-pages */
'use client';

import { useState, useCallback } from 'react';
import { cn } from '@/lib/utils/cn';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
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

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full bg-[var(--color-bg-base)]/60 backdrop-blur-2xl',
        'border-b border-[var(--color-border-subtle)]/30',
        className
      )}
      aria-label={ariaLabel ?? 'Main navigation'}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 lg:px-8 py-4">
        {/* Brand */}
        <a href="/" className="flex items-center gap-3 group">
          <div className="relative w-9 h-9 rounded-xl bg-[var(--color-brand-primary)]/10 border border-[var(--color-brand-primary)]/20 flex items-center justify-center group-hover:bg-[var(--color-brand-primary)]/15 transition-colors">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-[var(--color-brand-primary)]" aria-hidden>
              <path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z" />
            </svg>
          </div>
          <span className="font-display text-xl text-[var(--color-text-primary)] tracking-tight">
            {brandLabel}
          </span>
        </a>

        {/* Desktop nav */}
        <nav aria-label={ariaLabel ?? 'Primary'} className="hidden md:block">
          <ul role="list" className="flex items-center gap-1">
            {navLinks.map((link) => (
              <li key={`${link.href}-${link.label}`}>
                <a
                  href={link.href}
                  className="px-4 py-2 rounded-lg text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-surface)]/50 transition-all font-medium"
                >
                  {link.label}
                </a>
              </li>
            ))}
            <li className="ml-3">
              <ThemeToggle />
            </li>
            <li className="ml-3">
              {'ctaHref' in props ? (
                <a
                  href={props.ctaHref}
                  className="bg-[var(--color-brand-primary)] text-[var(--color-text-on-brand)] px-5 py-2 rounded-lg text-sm font-semibold hover:bg-[var(--color-brand-strong)] transition-all shadow-[0_0_20px_var(--color-brand-glow)] hover:shadow-[0_0_30px_var(--color-brand-glow-strong)]"
                >
                  {ctaLabel}
                </a>
              ) : (
                <button
                  type="button"
                  onClick={props.onCtaClick}
                  className="bg-[var(--color-brand-primary)] text-[var(--color-text-on-brand)] px-5 py-2 rounded-lg text-sm font-semibold hover:bg-[var(--color-brand-strong)] transition-all shadow-[0_0_20px_var(--color-brand-glow)] hover:shadow-[0_0_30px_var(--color-brand-glow-strong)]"
                >
                  {ctaLabel}
                </button>
              )}
            </li>
          </ul>
        </nav>

        {/* Mobile toggle */}
        <button
          type="button"
          className="md:hidden p-2 -mr-2 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors"
          onClick={toggleMobile}
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileOpen}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-6 h-6" aria-hidden>
            {mobileOpen ? (
              <path strokeLinecap="round" d="M6 6l12 12M6 18L18 6" />
            ) : (
              <path strokeLinecap="round" d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <nav className="md:hidden border-t border-[var(--color-border-subtle)]/20 bg-[var(--color-bg-base)]/95 backdrop-blur-2xl px-6 py-5 absolute w-full" aria-label={ariaLabel ?? 'Mobile primary navigation'}>
          <ul role="list" className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <li key={`mobile-${link.href}`}>
                <a
                  href={link.href}
                  className="block px-3 py-2.5 rounded-lg text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-surface)]/50 transition-all font-medium text-sm"
                >
                  {link.label}
                </a>
              </li>
            ))}
            <li className="pt-3 mt-2 border-t border-[var(--color-border-subtle)]/20 flex items-center justify-between">
              <span className="text-sm text-[var(--color-text-muted)] font-medium">Theme</span>
              <ThemeToggle />
            </li>
            <li className="pt-3 mt-2">
              {'ctaHref' in props ? (
                <a
                  href={props.ctaHref}
                  className="block text-center bg-[var(--color-brand-primary)] text-[var(--color-text-on-brand)] px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-[var(--color-brand-strong)] transition-all"
                >
                  {ctaLabel}
                </a>
              ) : (
                <button
                  type="button"
                  onClick={props.onCtaClick}
                  className="w-full bg-[var(--color-brand-primary)] text-[var(--color-text-on-brand)] px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-[var(--color-brand-strong)] transition-all"
                >
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
