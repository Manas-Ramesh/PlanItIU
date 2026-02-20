'use client';

import { useCallback } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils/cn';
import type { HomeViewProps } from './HomeView.types';

/* ── Inline Icons ── */

function SparkleIcon({ className }: { readonly className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2L14.09 8.26L20 9.27L15.55 13.97L16.91 20L12 16.9L7.09 20L8.45 13.97L4 9.27L9.91 8.26L12 2Z" />
    </svg>
  );
}

function SendIcon({ className }: { readonly className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M22 2L11 13" />
      <path d="M22 2L15 22L11 13L2 9L22 2Z" />
    </svg>
  );
}

function CalendarIcon({ className }: { readonly className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

function GraduationIcon({ className }: { readonly className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
      <path d="M6 12v5c3 3 9 3 12 0v-5" />
    </svg>
  );
}

function BookIcon({ className }: { readonly className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  );
}

function DocumentIcon({ className }: { readonly className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="9" y1="15" x2="15" y2="15" />
    </svg>
  );
}

function BriefcaseIcon({ className }: { readonly className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  );
}

/* ── Quick action cards data ── */

const QUICK_ACTIONS: ReadonlyArray<{
  readonly href: string;
  readonly label: string;
  readonly description: string;
  readonly icon: 'calendar' | 'graduation' | 'book' | 'document' | 'briefcase';
  readonly accent: string;
}> = [
  { href: '/schedule', label: 'Schedule Builder', description: 'Plan your semester', icon: 'calendar', accent: 'var(--color-feature-cyan)' },
  { href: '/degree-progress', label: 'Degree Progress', description: 'Track requirements', icon: 'graduation', accent: 'var(--color-feature-green)' },
  { href: '/study', label: 'Study Portal', description: 'Practice & review', icon: 'book', accent: 'var(--color-feature-teal)' },
  { href: '/assignments', label: 'Assignments', description: 'Pre-grade work', icon: 'document', accent: 'var(--color-feature-orange)' },
  { href: '/career', label: 'Career Center', description: 'Jobs & networking', icon: 'briefcase', accent: 'var(--color-feature-pink)' },
];

function QuickActionIcon({ type, className }: { readonly type: string; readonly className?: string }) {
  switch (type) {
    case 'calendar': return <CalendarIcon className={className} />;
    case 'graduation': return <GraduationIcon className={className} />;
    case 'book': return <BookIcon className={className} />;
    case 'document': return <DocumentIcon className={className} />;
    case 'briefcase': return <BriefcaseIcon className={className} />;
    default: return null;
  }
}

/* ── Suggestion prompts ── */

const SUGGESTIONS: ReadonlyArray<{ readonly label: string; readonly prompt: string }> = [
  { label: 'Plan my schedule', prompt: 'Help me plan my course schedule for next semester' },
  { label: 'Degree requirements', prompt: 'What courses do I still need to complete my degree?' },
  { label: 'Study strategies', prompt: 'What are effective study strategies for my upcoming exams?' },
  { label: 'Career advice', prompt: 'What internship opportunities match my major and interests?' },
  { label: 'Generate test exam', prompt: 'Generate a test exam for my upcoming course' }
];

/* ── Main Component ── */

export function HomeView({
  queryValue,
  onQueryChange,
  onSendMessage,
  messages,
  isTyping,
  messagesEndRef,
}: HomeViewProps) {
  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const trimmed = queryValue.trim();
      if (trimmed) onSendMessage(trimmed);
    },
    [queryValue, onSendMessage]
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      onQueryChange(e.target.value);
    },
    [onQueryChange]
  );

  const hasMessages = messages.length > 0;

  return (
    <div className="flex h-full flex-col bg-[var(--color-bg-base)]">
      {/* ── Chat / Welcome Area ── */}
      <div className="flex-1 overflow-y-auto">
        {!hasMessages ? (
          /* ── Empty state: Welcome + Quick Actions ── */
          <div className="relative flex flex-col items-center justify-center min-h-full px-6 py-12 overflow-hidden">
            {/* Ambient background glow */}
            <div className="pointer-events-none absolute inset-0" aria-hidden>
              <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] rounded-full bg-[var(--color-brand-primary)]/6 blur-[120px]" />
            </div>

            <div className="relative w-full max-w-2xl space-y-8">
              {/* Hero */}
              <div className="text-center space-y-4">
                {/* Icon */}
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[var(--color-brand-primary)]/10 border border-[var(--color-brand-primary)]/20 shadow-[0_0_48px_var(--color-brand-glow)] mb-1">
                  <SparkleIcon className="w-8 h-8 text-[var(--color-brand-primary)]" />
                </div>

                {/* Brand pill */}
                <div>
                  <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold bg-[var(--color-brand-primary)]/10 border border-[var(--color-brand-primary)]/20 text-[var(--color-brand-primary)]">
                    <span className="size-1.5 rounded-full bg-[var(--color-brand-primary)]" aria-hidden />
                    PlanIt AI · Academic Advisor
                  </span>
                </div>

                <h1 className="text-[28px] font-bold text-[var(--color-text-primary)] tracking-tight leading-tight">
                  What can I help you<br />with today?
                </h1>
                <p className="text-[var(--color-text-muted)] text-[13px] max-w-sm mx-auto leading-relaxed">
                  Ask about courses, degree planning, study strategies, or career guidance.
                </p>
              </div>

              {/* Suggestion chips */}
              <div className="flex flex-wrap justify-center gap-2">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s.label}
                    type="button"
                    onClick={() => onSendMessage(s.prompt)}
                    className={cn(
                      'rounded-full px-4 py-2 text-[13px] font-medium transition-all duration-200',
                      'border border-[var(--color-border-subtle)]/50 bg-[var(--color-bg-surface)]/60',
                      'text-[var(--color-text-secondary)]',
                      'hover:border-[var(--color-brand-primary)]/30 hover:bg-[var(--color-brand-primary)]/8 hover:text-[var(--color-text-primary)]',
                    )}
                  >
                    {s.label}
                  </button>
                ))}
              </div>

              {/* Quick action cards
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-[var(--color-text-muted)]/40 text-center mb-3">
                  Quick Access
                </p>
                <div className="grid grid-cols-5 gap-2.5">
                  {QUICK_ACTIONS.map((action) => (
                    <Link
                      key={action.href}
                      href={action.href}
                      className={cn(
                        'group flex flex-col items-center gap-3 rounded-xl p-4 transition-all duration-200',
                        'border border-[var(--color-border-subtle)]/40 bg-[var(--color-bg-surface)]/50',
                        'hover:border-[var(--color-border-subtle)]/70 hover:bg-[var(--color-bg-surface)] hover:shadow-md',
                        'focus:outline-none'
                      )}
                    >
                      <span
                        className="flex items-center justify-center w-10 h-10 rounded-xl transition-colors duration-200"
                        style={{
                          color: action.accent,
                          backgroundColor: `color-mix(in srgb, ${action.accent} 12%, transparent)`,
                          border: `1px solid color-mix(in srgb, ${action.accent} 22%, transparent)`,
                        }}
                      >
                        <QuickActionIcon type={action.icon} className="w-5 h-5" />
                      </span>
                      <div className="text-center min-w-0 w-full">
                        <p className="text-[11px] font-semibold text-[var(--color-text-primary)] truncate leading-snug">{action.label}</p>
                        <p className="text-[10px] text-[var(--color-text-muted)]/60 truncate mt-0.5">{action.description}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div> */}
            </div>
          </div>
        ) : (
          /* ── Messages ── */
          <div className="max-w-3xl mx-auto px-6 py-6 space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  'flex',
                  msg.sender === 'user' ? 'justify-end' : 'justify-start'
                )}
              >
                <div
                  className={cn(
                    'max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed',
                    msg.sender === 'user'
                      ? 'bg-[var(--color-brand-primary)] text-white rounded-br-md'
                      : 'bg-[var(--color-bg-surface)] border border-[var(--color-border-subtle)]/30 text-[var(--color-text-primary)] rounded-bl-md'
                  )}
                >
                  {msg.sender === 'ai' && (
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <SparkleIcon className="w-3.5 h-3.5 text-[var(--color-brand-primary)]" />
                      <span className="text-[11px] font-semibold text-[var(--color-brand-primary)]">Hoosier AI</span>
                    </div>
                  )}
                  {msg.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-[var(--color-bg-surface)] border border-[var(--color-border-subtle)]/30 rounded-2xl rounded-bl-md px-4 py-3">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <SparkleIcon className="w-3.5 h-3.5 text-[var(--color-brand-primary)]" />
                    <span className="text-[11px] font-semibold text-[var(--color-brand-primary)]">Hoosier AI</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-text-muted)] animate-pulse" />
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-text-muted)] animate-pulse [animation-delay:150ms]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-text-muted)] animate-pulse [animation-delay:300ms]" />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} aria-hidden />
          </div>
        )}
      </div>

      {/* ── Chat Input ── */}
      <div className="shrink-0 border-t border-[var(--color-border-subtle)]/20 bg-[var(--color-bg-base)] px-6 pb-5 pt-4">
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
          <div
            className={cn(
              'flex items-end gap-3 rounded-2xl border bg-[var(--color-bg-surface)]/70 px-4 py-3',
              'border-[var(--color-border-subtle)]/40',
              'focus-within:border-[var(--color-brand-primary)]/40 focus-within:shadow-[0_0_20px_var(--color-brand-glow)]',
              'transition-all duration-200'
            )}
          >
            <textarea
              value={queryValue}
              onChange={handleInputChange}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  const trimmed = queryValue.trim();
                  if (trimmed) onSendMessage(trimmed);
                }
              }}
              placeholder="Ask your AI academic advisor anything…"
              rows={1}
              className={cn(
                'flex-1 resize-none bg-transparent text-[13px] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)]/40',
                'focus:outline-none leading-relaxed',
                'max-h-32'
              )}
              aria-label="Message the advisor"
            />
            <button
              type="submit"
              disabled={!queryValue.trim() || isTyping}
              className={cn(
                'shrink-0 flex items-center justify-center w-8 h-8 rounded-xl transition-all duration-200',
                queryValue.trim() && !isTyping
                  ? 'bg-[var(--color-brand-primary)] text-white hover:opacity-90 shadow-[0_0_14px_var(--color-brand-glow)]'
                  : 'bg-[var(--color-bg-elevated)] text-[var(--color-text-muted)]/30 cursor-not-allowed'
              )}
              aria-label="Send message"
            >
              <SendIcon className="w-4 h-4" />
            </button>
          </div>
          <p className="mt-2 text-center text-[10px] text-[var(--color-text-muted)]/30">
            PlanIt AI can make mistakes. Always verify important academic decisions.
          </p>
        </form>
      </div>
    </div>
  );
}
