'use client';

import { useCallback } from 'react';
import Link from 'next/link';
import { Button, Input } from '@/components/ui';
import type { HomeViewProps } from './HomeView.types';
import { cn } from '@/lib/utils/cn';

function InfoIcon({ className }: { readonly className?: string }) {
  return (
    <svg
      className={className}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  );
}

function SparkleIcon({ className }: { readonly className?: string }) {
  return (
    <svg
      className={className}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z" />
      <path d="M5 21l2-6 2 2 2-6" />
      <path d="M19 21l-2-6-2 2-2-6" />
    </svg>
  );
}

function BuildingIcon({ className }: { readonly className?: string }) {
  return (
    <svg
      className={className}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  );
}

function DocumentIcon({ className }: { readonly className?: string }) {
  return (
    <svg
      className={className}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  );
}

function GraduationIcon({ className }: { readonly className?: string }) {
  return (
    <svg
      className={className}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
      <path d="M6 12v5c3 3 9 3 12 0v-5" />
    </svg>
  );
}

function ChevronDownIcon({ className }: { readonly className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

function PaperclipIcon({ className }: { readonly className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
    </svg>
  );
}

function SendArrowIcon({ className }: { readonly className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  );
}

const FEATURE_CARDS: ReadonlyArray<{
  readonly href: string;
  readonly title: string;
  readonly description: string;
  readonly icon: 'building' | 'document' | 'graduation';
}> = [
  {
    href: '/career',
    title: 'Career',
    description:
      'Find job postings based off your major, year, and career interests. Connect with alumni from your school.',
    icon: 'building',
  },
  {
    href: '/assignments',
    title: 'Assignment Grade Prediction and Feedback',
    description:
      'This tool enables you to submit your assignments, as many times as you want, and gain valuable insights before actual submission.',
    icon: 'document',
  },
  {
    href: '/study',
    title: 'Study Portal',
    description: 'Generate custom practice exams based on your courses.',
    icon: 'graduation',
  },
];

export function HomeView({ queryValue, onQueryChange, onSendMessage }: HomeViewProps) {
  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const trimmed = queryValue.trim();
      if (trimmed) onSendMessage(trimmed);
    },
    [queryValue, onSendMessage]
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onQueryChange(e.target.value);
    },
    [onQueryChange]
  );

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 overflow-y-auto p-6">
        <div className="mx-auto max-w-4xl space-y-6">
          {/* How It Works banner */}
          <section
            className={cn(
              'rounded-xl p-6',
              'bg-[var(--color-feature-purple)]'
            )}
            aria-labelledby="how-it-works-heading"
          >
            <div className="flex items-start gap-4">
              <span
                className="flex size-10 shrink-0 items-center justify-center rounded-full bg-white/20 text-white"
                aria-hidden
              >
                <InfoIcon className="size-5" />
              </span>
              <div className="min-w-0 flex-1">
                <h2 id="how-it-works-heading" className="text-lg font-semibold text-white">
                  How It Works
                </h2>
                <div className="mt-2 flex items-start gap-2">
                  <SparkleIcon className="mt-0.5 size-5 shrink-0 text-white/80" />
                  <div className="text-sm text-white/95">
                    <p className="font-semibold">An LLM designed for Indiana University</p>
                    <p className="mt-1">
                      Plan your courses, chat with Hoosier AI, pre-grade homework assignments,
                      study for exams, and find internships. This platform is tailored to your
                      school and profile, so if you enjoy, recommend it to a friend!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Feature cards */}
          <section aria-label="Features" className="grid gap-4 sm:grid-cols-3">
            {FEATURE_CARDS.map((card) => (
              <Link
                key={card.href}
                href={card.href}
                className={cn(
                  'flex flex-col rounded-xl border border-border-subtle bg-surface p-4',
                  'hover:border-border-strong transition',
                  'focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2 focus:ring-offset-background'
                )}
              >
                <span
                  className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-elevated text-text-muted"
                  aria-hidden
                >
                  {card.icon === 'building' && <BuildingIcon className="size-5" />}
                  {card.icon === 'document' && <DocumentIcon className="size-5" />}
                  {card.icon === 'graduation' && <GraduationIcon className="size-5" />}
                </span>
                <h3 className="mt-3 font-semibold text-text-primary">{card.title}</h3>
                <p className="mt-1 text-sm text-text-secondary">{card.description}</p>
              </Link>
            ))}
          </section>
        </div>
      </div>

      {/* Chat input at bottom */}
      <div className="shrink-0 border-t border-border-subtle bg-background p-4">
        <form onSubmit={handleSubmit} className="mx-auto max-w-4xl">
          <div
            className={cn(
              'flex items-center gap-2 rounded-xl border border-border-subtle bg-surface px-4 py-3'
            )}
          >
            <button
              type="button"
              className="shrink-0 rounded p-1 text-text-muted hover:text-text-secondary"
              aria-label="Options"
            >
              <ChevronDownIcon className="size-5" />
            </button>
            <button
              type="button"
              className="shrink-0 rounded p-1 text-text-muted hover:text-text-secondary"
              aria-label="Attach file"
            >
              <PaperclipIcon className="size-5" />
            </button>
            <Input
              type="text"
              value={queryValue}
              onChange={handleInputChange}
              placeholder="Ask your AI academic advisor anything..."
              className="flex-1 border-0 bg-transparent shadow-none focus-visible:ring-0"
              aria-label="Message the advisor"
            />
            <Button
              type="submit"
              disabled={!queryValue.trim()}
              className="shrink-0 rounded-full size-10 p-0 bg-elevated hover:bg-border-strong text-text-primary"
              aria-label="Send"
            >
              <SendArrowIcon className="size-5" />
            </Button>
          </div>
          <p className="mt-2 text-center text-xs text-text-muted">
            Planituni can make mistakes. Check important info.
          </p>
        </form>
      </div>
    </div>
  );
}
