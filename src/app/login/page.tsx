'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { submitLogin } from '@/lib/api/auth';
import type { LoginCredentials } from '@/lib/types';
import { cn } from '@/lib/utils/cn';

const FEATURE_PILLS = [
  'AI Schedule Builder',
  'Degree Tracker',
  'Study Portal',
  'Career Center',
];

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleUsernameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value),
    []
  );

  const handlePasswordChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value),
    []
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const credentials: LoginCredentials = { username, password };
      submitLogin(credentials).then(() => {
        router.push('/onboarding');
      });
    },
    [username, password, router]
  );

  return (
    <div className="min-h-screen flex bg-[var(--color-bg-base)]">
      {/* ── Left panel: branded atmosphere ── */}
      <div className="hidden lg:flex lg:w-[55%] relative overflow-hidden landing-grid-bg landing-hero-glow">
        {/* Ambient orbs */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-[var(--color-brand-primary)]/8 rounded-full blur-[160px]" />
          <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-[var(--color-feature-purple)]/6 rounded-full blur-[120px]" />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center px-16 xl:px-24 w-full">
          {/* Brand */}
          <Link href="/" className="flex items-center gap-3 mb-12 group" aria-label="PlanitUni home">
            <div className="w-10 h-10 rounded-xl bg-[var(--color-brand-primary)]/10 border border-[var(--color-brand-primary)]/20 flex items-center justify-center group-hover:bg-[var(--color-brand-primary)]/15 transition-colors">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-[var(--color-brand-primary)]" aria-hidden>
                <path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z" />
              </svg>
            </div>
            <span className="font-display text-2xl text-[var(--color-text-primary)]">PlanitUni</span>
          </Link>

          {/* Tagline */}
          <h1 className="font-display text-4xl xl:text-5xl text-[var(--color-text-primary)] leading-tight mb-6 animate-fade-in-up">
            Your academic journey,{' '}
            <em className="text-[var(--color-brand-primary)] not-italic">simplified.</em>
          </h1>
          <p className="text-[var(--color-text-muted)] text-lg leading-relaxed max-w-md mb-10 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            AI-powered tools to plan your schedule, track your degree, and ace every semester.
          </p>

          {/* Feature pills */}
          <div className="flex flex-wrap gap-3 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            {FEATURE_PILLS.map((pill) => (
              <span
                key={pill}
                className={cn(
                  'inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm',
                  'bg-[var(--color-bg-elevated)]/50 border border-[var(--color-border-subtle)]/30 text-[var(--color-text-secondary)]'
                )}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-brand-primary)]" aria-hidden />
                {pill}
              </span>
            ))}
          </div>

          {/* Decorative mockup preview */}
          <div
            className="mt-16 animate-fade-in-up"
            style={{ animationDelay: '0.35s' }}
            aria-hidden
          >
            <div className="max-w-sm rounded-xl overflow-hidden border border-[var(--color-border-subtle)]/20 bg-[var(--color-bg-elevated)]/40 backdrop-blur-sm">
              {/* Fake title bar */}
              <div className="h-7 bg-[var(--color-bg-deep)]/40 flex items-center px-3 gap-1.5">
                <div className="w-2 h-2 rounded-full bg-[var(--color-danger)]/60" />
                <div className="w-2 h-2 rounded-full bg-[var(--color-warning)]/60" />
                <div className="w-2 h-2 rounded-full bg-[var(--color-success)]/60" />
              </div>
              {/* Skeleton content */}
              <div className="p-4 flex flex-col gap-2.5">
                <div className="h-3 w-2/5 rounded bg-[var(--color-text-primary)]/8" />
                <div className="h-2.5 w-3/4 rounded bg-[var(--color-text-muted)]/6" />
                <div className="mt-2 grid grid-cols-3 gap-2">
                  <div className="h-10 rounded-lg bg-[var(--color-brand-primary)]/8" />
                  <div className="h-10 rounded-lg bg-[var(--color-feature-purple)]/8" />
                  <div className="h-10 rounded-lg bg-[var(--color-feature-teal)]/8" />
                </div>
                <div className="h-7 w-1/3 rounded-lg bg-[var(--color-brand-primary)]/10 mt-1" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Right panel: sign-in form ── */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 relative">
        {/* Subtle ambient glow on mobile */}
        <div className="absolute inset-0 pointer-events-none lg:hidden" aria-hidden>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-[var(--color-brand-primary)]/6 rounded-full blur-[120px]" />
        </div>

        <div className="relative z-10 w-full max-w-sm">
          {/* Mobile brand (hidden on lg) */}
          <div className="lg:hidden text-center mb-10">
            <Link href="/" className="inline-flex items-center gap-2.5" aria-label="PlanitUni home">
              <div className="w-9 h-9 rounded-xl bg-[var(--color-brand-primary)]/10 border border-[var(--color-brand-primary)]/20 flex items-center justify-center">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4.5 h-4.5 text-[var(--color-brand-primary)]" aria-hidden>
                  <path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z" />
                </svg>
              </div>
              <span className="font-display text-xl text-[var(--color-text-primary)]">PlanitUni</span>
            </Link>
            <p className="text-[var(--color-text-muted)] text-sm mt-3">
              Your academic journey, simplified.
            </p>
          </div>

          {/* Form card */}
          <div className="animate-fade-in-up">
            <h2 className="font-display text-2xl text-[var(--color-text-primary)] mb-2">
              Welcome back
            </h2>
            <p className="text-[var(--color-text-muted)] text-sm mb-8">
              Sign in with your university credentials to continue.
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <Label htmlFor="login-username" className="text-[var(--color-text-secondary)] text-sm font-medium mb-1.5">
                  Username
                </Label>
                <Input
                  id="login-username"
                  type="text"
                  placeholder="Your university username"
                  value={username}
                  onChange={handleUsernameChange}
                  required
                  autoComplete="username"
                  aria-required
                  className={cn(
                    'mt-1.5 rounded-xl border-[var(--color-border-subtle)]/40 bg-[var(--color-bg-elevated)]/50',
                    'px-4 py-3 text-sm',
                    'placeholder:text-[var(--color-text-muted)]/50',
                    'focus:border-[var(--color-brand-primary)]/40 focus:ring-[var(--color-brand-primary)]/30'
                  )}
                />
              </div>

              <div>
                <Label htmlFor="login-password" className="text-[var(--color-text-secondary)] text-sm font-medium mb-1.5">
                  Password
                </Label>
                <Input
                  id="login-password"
                  type="password"
                  placeholder="Your password"
                  value={password}
                  onChange={handlePasswordChange}
                  required
                  autoComplete="current-password"
                  aria-required
                  className={cn(
                    'mt-1.5 rounded-xl border-[var(--color-border-subtle)]/40 bg-[var(--color-bg-elevated)]/50',
                    'px-4 py-3 text-sm',
                    'placeholder:text-[var(--color-text-muted)]/50',
                    'focus:border-[var(--color-brand-primary)]/40 focus:ring-[var(--color-brand-primary)]/30'
                  )}
                />
              </div>

              <Button
                type="submit"
                fullWidth
                className={cn(
                  'py-3.5 rounded-xl font-semibold text-sm mt-2',
                  'flex-row gap-2',
                  'shadow-[0_0_30px_var(--color-brand-glow)]',
                  'hover:shadow-[0_4px_50px_var(--color-brand-glow-strong)]',
                  'hover:-translate-y-0.5 transition-all duration-300'
                )}
                rightIcon={
                  <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4" aria-hidden>
                    <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
                  </svg>
                }
              >
                Sign In
              </Button>
            </form>

            <p className="text-xs text-[var(--color-text-muted)]/40 text-center mt-8 leading-relaxed">
              By signing in, you agree to use your credentials securely.
              <br />
              <Link href="/" className="text-[var(--color-brand-primary)]/60 hover:text-[var(--color-brand-primary)] transition-colors">
                Back to home
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
